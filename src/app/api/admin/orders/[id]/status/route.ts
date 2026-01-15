import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

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
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Durum gerekli' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'ORDER',
      entityId: order.id,
      details: {
        orderNumber: order.orderNumber,
        newStatus: status
      }
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Siparis durumu guncellenemedi:', error)
    return NextResponse.json(
      { error: 'Durum guncellenemedi' },
      { status: 500 }
    )
  }
}
