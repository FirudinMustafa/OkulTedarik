import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession, hashPassword } from '@/lib/auth'
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

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        classes: {
          include: {
            package: true,
            _count: { select: { orders: true } }
          }
        }
      }
    })

    if (!school) {
      return NextResponse.json({ error: 'Okul bulunamadi' }, { status: 404 })
    }

    return NextResponse.json({ school })
  } catch (error) {
    console.error('Okul getirilemedi:', error)
    return NextResponse.json(
      { error: 'Okul yuklenemedi' },
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

    // directorPassword varsa hash'le
    const { directorPassword, ...rest } = body
    const updateData: Record<string, unknown> = { ...rest }

    if (directorPassword && directorPassword.trim()) {
      updateData.directorPassword = await hashPassword(directorPassword.trim())
    }

    const school = await prisma.school.update({
      where: { id },
      data: updateData
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'SCHOOL',
      entityId: school.id,
      details: { name: school.name }
    })

    return NextResponse.json({ school })
  } catch (error) {
    console.error('Okul guncellenemedi:', error)
    return NextResponse.json(
      { error: 'Okul guncellenemedi' },
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

    // Okul bilgisini al
    const school = await prisma.school.findUnique({
      where: { id },
      include: { classes: { select: { id: true } } }
    })

    if (!school) {
      return NextResponse.json({ error: 'Okul bulunamadi' }, { status: 404 })
    }

    const classIds = school.classes.map(c => c.id)

    // Bagli tum verileri sirayla sil
    if (classIds.length > 0) {
      // 1. Siparis iptal taleplerini sil
      await prisma.cancelRequest.deleteMany({
        where: { order: { classId: { in: classIds } } }
      })

      // 2. Siparisleri sil
      await prisma.order.deleteMany({
        where: { classId: { in: classIds } }
      })

      // 3. Siniflari sil
      await prisma.class.deleteMany({
        where: { schoolId: id }
      })
    }

    // 4. Okul hakedislerini sil
    await prisma.schoolPayment.deleteMany({
      where: { schoolId: id }
    })

    // 5. Okulu sil
    await prisma.school.delete({
      where: { id }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'DELETE',
      entity: 'SCHOOL',
      entityId: id,
      details: { name: school.name }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Okul silinemedi:', error)
    return NextResponse.json(
      { error: 'Okul silinemedi' },
      { status: 500 }
    )
  }
}
