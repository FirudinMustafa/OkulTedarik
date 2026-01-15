import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken } from '@/lib/auth'
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

    // Admin kullanicisini bul
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Gecersiz email veya sifre' },
        { status: 401 }
      )
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Bu hesap aktif degil' },
        { status: 403 }
      )
    }

    // Sifre kontrolu
    const isValid = await verifyPassword(password, admin.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Gecersiz email veya sifre' },
        { status: 401 }
      )
    }

    // Token olustur
    const token = await createToken({
      id: admin.id,
      email: admin.email,
      type: 'admin',
      name: admin.name
    })

    // Son giris zamanini guncelle
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })

    // Log kaydet
    await logAction({
      userId: admin.id,
      userType: 'ADMIN',
      action: 'LOGIN',
      entity: 'USER',
      entityId: admin.id,
      details: { email: admin.email }
    })

    // Cookie'ye token kaydet
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 gun
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    })

  } catch (error) {
    console.error('Admin login hatasi:', error)
    return NextResponse.json(
      { error: 'Giris yapilamadi' },
      { status: 500 }
    )
  }
}
