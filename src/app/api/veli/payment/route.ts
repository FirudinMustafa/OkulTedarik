import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processPayment } from '@/lib/iyzico'
import { sendEmail } from '@/lib/email'
import { sendSMS } from '@/lib/sms'

export async function POST(request: Request) {
  try {
    const { orderId, cardNumber, cardHolder, expiry, cvv } = await request.json()

    if (!orderId || !cardNumber || !cardHolder || !expiry || !cvv) {
      return NextResponse.json(
        { error: 'Tum kart bilgileri gerekli' },
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

    if (order.status !== 'PAYMENT_PENDING') {
      return NextResponse.json(
        { error: 'Bu siparis icin odeme yapilamaz' },
        { status: 400 }
      )
    }

    // Mock odeme islemi
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

    // Siparis durumunu guncelle
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAYMENT_RECEIVED',
        paymentId: paymentResult.paymentId,
        paymentMethod: 'CREDIT_CARD',
        paidAt: new Date()
      }
    })

    // Bildirimler gonder (mock)
    await Promise.all([
      sendEmail({
        to: order.email || '',
        subject: `Siparis Onayi - ${order.orderNumber}`,
        body: `Sayin ${order.parentName}, ${order.orderNumber} numarali siparisini aldik. Odemeniz basariyla tamamlandi.`
      }),
      sendSMS({
        to: order.phone,
        message: `${order.orderNumber} no'lu siparisini aldik. Odeme basarili. Tesekkurler!`
      })
    ])

    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
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
