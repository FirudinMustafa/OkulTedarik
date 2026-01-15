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

    const school = await prisma.school.update({
      where: { id },
      data: body
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

    // Bagli siniflar var mi kontrol et
    const classCount = await prisma.class.count({
      where: { schoolId: id }
    })

    if (classCount > 0) {
      return NextResponse.json(
        { error: 'Bu okula bagli siniflar var. Oncellikle siniflari silin.' },
        { status: 400 }
      )
    }

    const school = await prisma.school.delete({
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
