import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processPayment } from '@/lib/iyzico'
import { sendEmail } from '@/lib/email'
import { sendSMS } from '@/lib/sms'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, mockPayment, cardNumber, cardHolder, expiry, cvv } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Siparis ID gerekli' },
        { status: 400 }
      )
    }

    // Siparisi getir
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        class: {
          include: { school: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Siparis bulunamadi' },
        { status: 404 }
      )
    }

    if (order.status !== 'PAYMENT_PENDING' || order.paymentId) {
      return NextResponse.json(
        { error: 'Bu siparis icin odeme yapilamaz' },
        { status: 400 }
      )
    }

    let paymentId: string

    if (mockPayment) {
      // Mock odeme - gercek kart bilgisi gerektirmez
      paymentId = `MOCK_PAY_${Date.now()}`
    } else {
      // Gercek odeme islemi
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        return NextResponse.json(
          { error: 'Tum kart bilgileri gerekli' },
          { status: 400 }
        )
      }

      const paymentResult = await processPayment({
        amount: Number(order.totalAmount),
        currency: 'TRY',
        cardNumber,
        cardHolder,
        expiry,
        cvv,
        orderId: order.id,
        orderNumber: order.orderNumber,
        buyerName: order.parentName,
        buyerEmail: order.email || '',
        buyerPhone: order.phone
      })

      if (!paymentResult.success) {
        return NextResponse.json(
          { error: paymentResult.errorMessage || 'Odeme islemi basarisiz' },
          { status: 400 }
        )
      }

      paymentId = paymentResult.paymentId || `PAY_${Date.now()}`
    }

    // Siparis durumunu guncelle
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paymentId,
        paymentMethod: 'CREDIT_CARD',
        paidAt: new Date()
      }
    })

    // Bildirimler gonder (mock)
    try {
      await Promise.all([
        order.email ? sendEmail({
          to: order.email,
          subject: `Siparis Onayi - ${order.orderNumber}`,
          body: `Sayin ${order.parentName}, ${order.orderNumber} numarali siparisini aldik. Odemeniz basariyla tamamlandi.`
        }) : Promise.resolve(),
        sendSMS({
          to: order.phone,
          message: `${order.orderNumber} no'lu siparisini aldik. Odeme basarili. Tesekkurler!`
        })
      ])
    } catch (notifError) {
      console.error('Bildirim gonderilemedi:', notifError)
    }

    return NextResponse.json({
      success: true,
      paymentId,
      message: 'Odeme basariyla tamamlandi'
    })

  } catch (error) {
    console.error('Odeme hatasi:', error)
    return NextResponse.json(
      { error: 'Odeme islemi sirasinda bir hata olustu' },
      { status: 500 }
    )
  }
}
