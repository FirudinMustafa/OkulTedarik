import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    // Teslimat asamasindaki siparisleri getir
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['INVOICED', 'CARGO_SHIPPED', 'DELIVERED_TO_SCHOOL', 'DELIVERED_BY_CARGO']
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        class: {
          include: {
            school: { select: { id: true, name: true, deliveryType: true } }
          }
        }
      }
    })

    // Frontend icin map et
    const mappedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      studentName: order.studentName,
      parentName: order.parentName,
      parentPhone: order.phone,
      deliveryType: order.class.school.deliveryType === 'CARGO' ? 'CARGO' : 'SCHOOL',
      deliveryAddress: order.address,
      status: order.status,
      cargoTrackingNumber: order.trackingNo,
      cargoCompany: order.trackingNo ? 'Aras Kargo' : null,
      class: {
        name: order.class.name,
        school: { id: order.class.school.id, name: order.class.school.name }
      }
    }))

    return NextResponse.json({ orders: mappedOrders })
  } catch (error) {
    console.error('Teslimatlar listelenemedi:', error)
    return NextResponse.json(
      { error: 'Teslimatlar yuklenemedi' },
      { status: 500 }
    )
  }
}
