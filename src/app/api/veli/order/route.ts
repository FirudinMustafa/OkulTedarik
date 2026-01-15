import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/order-number'
import { initializePayment } from '@/lib/iyzico'
import { sendOrderConfirmation, sendPaymentConfirmation } from '@/lib/email'
import { sendOrderSMS } from '@/lib/sms'
import { logAction } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      classId,
      parentName,
      studentName,
      phone,
      email,
      address,
      paymentMethod,
      isCorporateInvoice,
      taxNumber,
      taxOffice,
      orderNote
    } = body

    // Validasyon
    if (!classId || !parentName || !studentName || !phone) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    // Sinif ve paket bilgisini al
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
        package: {
          include: { items: true }
        }
      }
    })

    if (!classData || !classData.package) {
      return NextResponse.json(
        { error: 'Sinif veya paket bulunamadi' },
        { status: 404 }
      )
    }

    // Kargo teslim icin adres zorunlu
    if (classData.school.deliveryType === 'CARGO' && !address) {
      return NextResponse.json(
        { error: 'Kargo teslim icin adres zorunludur' },
        { status: 400 }
      )
    }

    // Ayni ogrenci icin tekrar siparis kontrolu (opsiyonel)
    const existingOrder = await prisma.order.findFirst({
      where: {
        classId,
        studentName: studentName.trim(),
        status: {
          notIn: ['CANCELLED', 'REFUNDED']
        }
      }
    })

    if (existingOrder) {
      return NextResponse.json(
        {
          error: 'Bu ogrenci icin zaten bir siparis mevcut',
          orderNumber: existingOrder.orderNumber
        },
        { status: 409 }
      )
    }

    // Siparis numarasi olustur
    const orderNumber = await generateOrderNumber()

    // Siparis olustur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        parentName: parentName.trim(),
        studentName: studentName.trim(),
        phone: phone.replace(/\s/g, ''),
        email: email || null,
        address: address || null,
        totalAmount: classData.package.price,
        status: paymentMethod === 'CASH_ON_DELIVERY' ? 'CONFIRMED' : 'PAYMENT_PENDING',
        paymentMethod: paymentMethod || 'CREDIT_CARD',
        isCorporateInvoice: isCorporateInvoice || false,
        taxNumber: taxNumber || null,
        taxOffice: taxOffice || null,
        classId,
        packageId: classData.package.id
      }
    })

    // Log kaydet
    await logAction({
      action: 'ORDER_CREATED',
      entity: 'ORDER',
      entityId: order.id,
      details: {
        orderNumber,
        studentName,
        paymentMethod,
        amount: classData.package.price
      }
    })

    // Kredi karti odemesi icin odeme linki olustur
    if (paymentMethod === 'CREDIT_CARD') {
      const paymentResult = await initializePayment({
        orderNumber,
        amount: Number(classData.package.price),
        buyerName: parentName,
        buyerEmail: email || `${phone}@temp.com`,
        buyerPhone: phone,
        buyerAddress: address,
        items: classData.package.items.map(item => ({
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity
        }))
      })

      if (paymentResult.success) {
        // Odeme URL'ini kaydet
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentUrl: paymentResult.paymentUrl }
        })

        return NextResponse.json({
          success: true,
          orderNumber,
          orderId: order.id,
          paymentUrl: paymentResult.paymentUrl
        })
      } else {
        return NextResponse.json(
          { error: 'Odeme baslatilamadi' },
          { status: 500 }
        )
      }
    }

    // Kapida odeme - bildirim gonder
    if (email) {
      await sendOrderConfirmation({
        email,
        orderNumber,
        parentName,
        studentName,
        packageName: classData.package.name,
        totalAmount: Number(classData.package.price)
      })
    }

    await sendOrderSMS(phone, orderNumber)

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
      message: 'Siparis basariyla olusturuldu'
    })

  } catch (error) {
    console.error('Siparis olusturma hatasi:', error)
    return NextResponse.json(
      { error: 'Siparis olusturulamadi' },
      { status: 500 }
    )
  }
}

// Siparis sorgulama
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Siparis numarasi gerekli' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        class: {
          include: {
            school: {
              select: {
                name: true,
                deliveryType: true
              }
            }
          }
        },
        package: {
          select: {
            name: true,
            price: true
          }
        },
        cancelRequest: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Siparis bulunamadi' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      parentName: order.parentName,
      studentName: order.studentName,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      schoolName: order.class.school.name,
      className: order.class.name,
      packageName: order.package?.name || 'N/A',
      deliveryType: order.class.school.deliveryType,
      trackingNo: order.trackingNo,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      hasCancelRequest: !!order.cancelRequest
    })

  } catch (error) {
    console.error('Siparis sorgulama hatasi:', error)
    return NextResponse.json(
      { error: 'Bir hata olustu' },
      { status: 500 }
    )
  }
}
