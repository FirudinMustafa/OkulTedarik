import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

// Okul sifresi olustur
function generateSchoolPassword(schoolName: string): string {
  const year = new Date().getFullYear()
  const prefix = schoolName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${year}-${prefix}-${random}`
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { id } = await params

    // Okulu bul
    const school = await prisma.school.findUnique({
      where: { id }
    })

    if (!school) {
      return NextResponse.json(
        { error: 'Okul bulunamadi' },
        { status: 404 }
      )
    }

    // Yeni sifre olustur
    const newPassword = generateSchoolPassword(school.name)

    // Sifreyi guncelle
    const updatedSchool = await prisma.school.update({
      where: { id },
      data: {
        password: newPassword,
        passwordGeneratedAt: new Date(),
        passwordChangedBy: session.id
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'SCHOOL',
      entityId: id,
      details: {
        action: 'REGENERATE_PASSWORD',
        schoolName: school.name
      }
    })

    return NextResponse.json({
      success: true,
      password: updatedSchool.password
    })
  } catch (error) {
    console.error('Sifre yenilenirken hata:', error)
    return NextResponse.json(
      { error: 'Sifre yenilenemedi' },
      { status: 500 }
    )
  }
}
