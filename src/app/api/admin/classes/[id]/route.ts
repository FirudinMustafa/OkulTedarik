import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

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

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        school: true,
        package: { include: { items: true } },
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!classData) {
      return NextResponse.json({ error: 'Sinif bulunamadi' }, { status: 404 })
    }

    return NextResponse.json({ class: classData })
  } catch (error) {
    console.error('Sinif getirilemedi:', error)
    return NextResponse.json(
      { error: 'Sinif yuklenemedi' },
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

    // packageId bos string ise null yap
    if (body.packageId === "") {
      body.packageId = null
    }

    const classData = await prisma.class.update({
      where: { id },
      data: body
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'CLASS',
      entityId: classData.id,
      details: { name: classData.name }
    })

    return NextResponse.json({ class: classData })
  } catch (error) {
    console.error('Sinif guncellenemedi:', error)
    return NextResponse.json(
      { error: 'Sinif guncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { id } = await params

    // Bagli siparisler var mi kontrol et
    const orderCount = await prisma.order.count({
      where: { classId: id }
    })

    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Bu sinifa ait siparisler var. Sinif silinemez.' },
        { status: 400 }
      )
    }

    const classData = await prisma.class.delete({
      where: { id }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'DELETE',
      entity: 'CLASS',
      entityId: id,
      details: { name: classData.name }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sinif silinemedi:', error)
    return NextResponse.json(
      { error: 'Sinif silinemedi' },
      { status: 500 }
    )
  }
}
