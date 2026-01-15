import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(
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
          include: {
            school: true,
            package: { include: { items: true } }
          }
        },
        cancelRequest: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Siparis bulunamadi' }, { status: 404 })
    }

    // Map to expected format for admin panel
    const mappedOrder = {
      ...order,
      parentPhone: order.phone,
      parentEmail: order.email,
      deliveryType: order.class.school.deliveryType,
      deliveryAddress: order.address
    }

    return NextResponse.json({ order: mappedOrder })
  } catch (error) {
    console.error('Siparis getirilemedi:', error)
    return NextResponse.json(
      { error: 'Siparis yuklenemedi' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const order = await prisma.order.update({
      where: { id },
      data: body
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Siparis guncellenemedi:', error)
    return NextResponse.json(
      { error: 'Siparis guncellenemedi' },
      { status: 500 }
    )
  }
}
