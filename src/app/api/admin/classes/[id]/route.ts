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

    // Izin verilen alanlari filtrele
    const allowedFields = ['name', 'schoolId', 'packageId', 'isActive']
    const updateData: Record<string, unknown> = {}

    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    }

    // packageId bos string ise null yap
    if (updateData.packageId === "") {
      updateData.packageId = null
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Guncellenecek alan bulunamadi' }, { status: 400 })
    }

    const classData = await prisma.class.update({
      where: { id },
      data: updateData
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

    // Sinif bilgisini al
    const classData = await prisma.class.findUnique({
      where: { id }
    })

    if (!classData) {
      return NextResponse.json({ error: 'Sinif bulunamadi' }, { status: 404 })
    }

    // Bagli verileri sirayla sil
    // 1. Siparis iptal taleplerini sil
    await prisma.cancelRequest.deleteMany({
      where: { order: { classId: id } }
    })

    // 2. Siparisleri sil
    await prisma.order.deleteMany({
      where: { classId: id }
    })

    // 3. Sinifi sil
    await prisma.class.delete({
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
