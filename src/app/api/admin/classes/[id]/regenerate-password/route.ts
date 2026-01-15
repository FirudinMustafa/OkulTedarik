import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { generateClassPassword } from '@/lib/password-generator'

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

    const newPassword = generateClassPassword()

    const classData = await prisma.class.update({
      where: { id },
      data: { password: newPassword }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'CLASS',
      entityId: classData.id,
      details: { action: 'password_regenerated', name: classData.name }
    })

    return NextResponse.json({
      success: true,
      password: newPassword
    })
  } catch (error) {
    console.error('Sifre yenilenemedi:', error)
    return NextResponse.json(
      { error: 'Sifre yenilenemedi' },
      { status: 500 }
    )
  }
}
