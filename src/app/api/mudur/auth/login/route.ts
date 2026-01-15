import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createToken, verifyPassword } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve sifre gerekli' },
        { status: 400 }
      )
    }

    // Mudur email'i ile okul bul
    const school = await prisma.school.findFirst({
      where: {
        directorEmail: email.toLowerCase(),
        isActive: true
      }
    })

    if (!school) {
      return NextResponse.json(
        { error: 'Gecersiz email veya sifre' },
        { status: 401 }
      )
    }

    // Sifre kontrolu
    const isValid = await verifyPassword(password, school.directorPassword)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Gecersiz email veya sifre' },
        { status: 401 }
      )
    }

    // Token olustur
    const token = await createToken({
      id: school.id,
      email: school.directorEmail,
      type: 'mudur',
      name: school.directorName || 'Mudur',
      schoolId: school.id
    })

    // Log kaydet
    await logAction({
      userId: school.id,
      userType: 'MUDUR',
      action: 'LOGIN',
      entity: 'USER',
      entityId: school.id,
      details: { email, schoolName: school.name }
    })

    // Cookie'ye token kaydet
    const cookieStore = await cookies()
    cookieStore.set('mudur_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 gun
    })

    return NextResponse.json({
      success: true,
      school: {
        id: school.id,
        name: school.name,
        directorName: school.directorName
      }
    })

  } catch (error) {
    console.error('Mudur login hatasi:', error)
    return NextResponse.json(
      { error: 'Giris yapilamadi' },
      { status: 500 }
    )
  }
}
