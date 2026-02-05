import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { VALID_STATUS_TRANSITIONS } from '@/lib/constants'

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

    // Izin verilen alanlari filtrele
    const allowedFields = ['status', 'trackingNo', 'address', 'phone', 'email', 'orderNote']
    const updateData: Record<string, unknown> = {}

    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Guncellenecek alan bulunamadi' }, { status: 400 })
    }

    // Status degisikligi varsa gecerli gecis kontrolu
    if (updateData.status) {
      const currentOrder = await prisma.order.findUnique({ where: { id }, select: { status: true } })
      if (!currentOrder) {
        return NextResponse.json({ error: 'Siparis bulunamadi' }, { status: 404 })
      }

      const allowedTransitions = VALID_STATUS_TRANSITIONS[currentOrder.status] || []
      if (!allowedTransitions.includes(updateData.status as string)) {
        return NextResponse.json(
          { error: `${currentOrder.status} durumundan ${updateData.status} durumuna gecis yapilamaz` },
          { status: 400 }
        )
      }

      // PAID gecisinde paidAt otomatik set et
      if (updateData.status === 'PAID') {
        updateData.paidAt = new Date()
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'ORDER',
      entityId: order.id,
      details: { orderNumber: order.orderNumber, updatedFields: Object.keys(updateData) }
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
