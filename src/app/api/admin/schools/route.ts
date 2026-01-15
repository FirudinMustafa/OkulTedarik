import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession, hashPassword } from '@/lib/auth'
import { logAction } from '@/lib/logger'

// Okul sifresi olustur
function generateSchoolPassword(schoolName: string): string {
  const year = new Date().getFullYear()
  const prefix = schoolName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${year}-${prefix}-${random}`
}

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const schools = await prisma.school.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { classes: true }
        }
      }
    })

    return NextResponse.json({ schools })
  } catch (error) {
    console.error('Okullar listelenemedi:', error)
    return NextResponse.json(
      { error: 'Okullar yuklenemedi' },
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
    const {
      name,
      address,
      phone,
      email,
      deliveryType,
      directorName,
      directorEmail,
      directorPassword
    } = body

    if (!name || !directorEmail || !directorPassword) {
      return NextResponse.json(
        { error: 'Okul adi, mudur emaili ve sifresi gerekli' },
        { status: 400 }
      )
    }

    // Mudur sifresini hashle
    const hashedPassword = await hashPassword(directorPassword)

    // Okul sifresi olustur
    const schoolPassword = generateSchoolPassword(name)

    const school = await prisma.school.create({
      data: {
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
        deliveryType: deliveryType || 'SCHOOL_DELIVERY',
        password: schoolPassword,
        passwordGeneratedAt: new Date(),
        directorName: directorName || null,
        directorEmail: directorEmail.toLowerCase(),
        directorPassword: hashedPassword
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'CREATE',
      entity: 'SCHOOL',
      entityId: school.id,
      details: { name: school.name }
    })

    return NextResponse.json({ school })
  } catch (error) {
    console.error('Okul olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Okul olusturulamadi' },
      { status: 500 }
    )
  }
}
