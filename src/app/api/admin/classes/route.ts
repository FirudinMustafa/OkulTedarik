import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const classes = await prisma.class.findMany({
      orderBy: [{ school: { name: 'asc' } }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        commissionAmount: true,
        isActive: true,
        school: { select: { id: true, name: true, password: true } },
        package: { select: { id: true, name: true } },
        _count: { select: { orders: true } }
      }
    })

    return NextResponse.json({ classes })
  } catch (error) {
    console.error('Siniflar listelenemedi:', error)
    return NextResponse.json(
      { error: 'Siniflar yuklenemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const body = await request.json()
    const { name, schoolId, packageId, commissionAmount } = body

    if (!name || !schoolId) {
      return NextResponse.json(
        { error: 'Sinif adi ve okul gerekli' },
        { status: 400 }
      )
    }

    const classData = await prisma.class.create({
      data: {
        name,
        schoolId,
        packageId: packageId || null,
        commissionAmount: commissionAmount || 0
      },
      include: {
        school: { select: { id: true, name: true } },
        package: { select: { id: true, name: true } }
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'CREATE',
      entity: 'CLASS',
      entityId: classData.id,
      details: { name: classData.name, schoolId }
    })

    return NextResponse.json({ class: classData })
  } catch (error) {
    console.error('Sinif olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Sinif olusturulamadi' },
      { status: 500 }
    )
  }
}
