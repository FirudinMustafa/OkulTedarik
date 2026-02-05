import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { generateSchoolPassword } from '@/lib/password-generator'

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

    // Sinifi bul ve okul bilgisini al
    const classData = await prisma.class.findUnique({
      where: { id },
      include: { school: true }
    })

    if (!classData) {
      return NextResponse.json({ error: 'Sinif bulunamadi' }, { status: 404 })
    }

    // Benzersiz okul sifresi olustur
    let newPassword: string = ''
    let isUnique = false
    let attempt = 0

    while (!isUnique && attempt < 10) {
      newPassword = generateSchoolPassword()
      const existing = await prisma.school.findFirst({
        where: {
          password: newPassword,
          id: { not: classData.schoolId }
        }
      })
      if (!existing) isUnique = true
      attempt++
    }

    if (!newPassword || !isUnique) {
      return NextResponse.json(
        { error: 'Benzersiz sifre olusturulamadi, tekrar deneyin' },
        { status: 500 }
      )
    }

    // Okulun veli giris sifresini guncelle (sifre okul bazli)
    await prisma.school.update({
      where: { id: classData.schoolId },
      data: { password: newPassword }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'SCHOOL',
      entityId: classData.schoolId,
      details: {
        action: 'school_password_regenerated_via_class',
        className: classData.name,
        schoolName: classData.school.name
      }
    })

    return NextResponse.json({
      success: true,
      password: newPassword,
      schoolName: classData.school.name,
      message: `${classData.school.name} okulunun veli giris sifresi yenilendi`
    })
  } catch (error) {
    console.error('Sifre yenilenemedi:', error)
    return NextResponse.json(
      { error: 'Sifre yenilenemedi' },
      { status: 500 }
    )
  }
}
