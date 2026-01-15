import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const schoolId = searchParams.get('schoolId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (schoolId) where.class = { schoolId }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        class: {
          include: {
            school: { select: { id: true, name: true, deliveryType: true } }
          }
        },
        package: {
          select: { name: true }
        }
      }
    })

    // Map to expected format for admin panel
    const mappedOrders = orders.map(order => ({
      ...order,
      parentPhone: order.phone,
      parentEmail: order.email,
      deliveryType: order.class.school.deliveryType,
      deliveryAddress: order.address
    }))

    return NextResponse.json({ orders: mappedOrders })
  } catch (error) {
    console.error('Siparisler listelenemedi:', error)
    return NextResponse.json(
      { error: 'Siparisler yuklenemedi' },
      { status: 500 }
    )
  }
}
