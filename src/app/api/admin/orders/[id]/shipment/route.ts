import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { createShipment } from '@/lib/aras-kargo'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        class: {
          include: { school: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Siparis bulunamadi' }, { status: 404 })
    }

    // Teslimat tipi okul uzerinden alinir
    if (order.class.school.deliveryType !== 'CARGO') {
      return NextResponse.json(
        { error: 'Bu siparis kargo ile gonderilmeyecek' },
        { status: 400 }
      )
    }

    if (order.status !== 'INVOICED' && order.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Bu siparis icin kargo olusturulamaz' },
        { status: 400 }
      )
    }

    // Mock kargo olustur
    const shipmentResult = await createShipment({
      orderNumber: order.orderNumber,
      receiverName: order.parentName,
      receiverPhone: order.phone,
      receiverAddress: order.address || '',
      packageCount: 1,
      packageWeight: 2, // varsayilan 2 kg
      packageContent: 'Okul Malzemeleri'
    })

    // Siparis durumunu guncelle
    await prisma.order.update({
      where: { id },
      data: {
        status: 'CARGO_SHIPPED',
        trackingNo: shipmentResult.trackingNo,
        shippedAt: new Date()
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'CREATE',
      entity: 'SHIPMENT',
      entityId: order.id,
      details: {
        orderNumber: order.orderNumber,
        trackingNo: shipmentResult.trackingNo
      }
    })

    return NextResponse.json({
      success: true,
      trackingNo: shipmentResult.trackingNo,
      trackingUrl: shipmentResult.trackingUrl
    })
  } catch (error) {
    console.error('Kargo olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Kargo olusturulamadi' },
      { status: 500 }
    )
  }
}
