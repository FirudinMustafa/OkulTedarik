import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession, hashPassword } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { generateSchoolPassword } from '@/lib/password-generator'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const schools = await prisma.school.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        deliveryType: true,
        password: true,
        directorName: true,
        directorEmail: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
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
      directorPassword,
      password // Veli giris sifresi (opsiyonel - verilmezse otomatik olusturulur)
    } = body

    if (!name || !directorEmail || !directorPassword) {
      return NextResponse.json(
        { error: 'Okul adi, mudur emaili ve sifresi gerekli' },
        { status: 400 }
      )
    }

    // Mudur sifresini hashle
    const hashedPassword = await hashPassword(directorPassword)

    // Veli giris sifresi - verilmediyse otomatik olustur
    let schoolPassword = password?.toUpperCase()
    if (!schoolPassword) {
      // Benzersiz sifre olustur
      let isUnique = false
      let attempt = 0
      while (!isUnique && attempt < 10) {
        schoolPassword = generateSchoolPassword()
        const existing = await prisma.school.findFirst({
          where: { password: schoolPassword }
        })
        if (!existing) isUnique = true
        attempt++
      }
    }

    const school = await prisma.school.create({
      data: {
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
        deliveryType: deliveryType || 'SCHOOL_DELIVERY',
        password: schoolPassword,
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

    return NextResponse.json({
      school: {
        id: school.id,
        name: school.name,
        address: school.address,
        phone: school.phone,
        email: school.email,
        deliveryType: school.deliveryType,
        password: school.password,
        directorName: school.directorName,
        directorEmail: school.directorEmail,
        isActive: school.isActive
      }
    })
  } catch (error) {
    console.error('Okul olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Okul olusturulamadi' },
      { status: 500 }
    )
  }
}
