import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

// Odemeyi tamamla (PAID olarak isaretle)
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

    const payment = await prisma.schoolPayment.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date()
      },
      include: {
        school: { select: { id: true, name: true } }
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'PAYMENT',
      entityId: payment.id,
      details: {
        schoolName: payment.school.name,
        amount: payment.amount,
        action: 'marked_as_paid'
      }
    })

    return NextResponse.json({ payment, success: true })
  } catch (error) {
    console.error('Odeme tamamlanamadi:', error)
    return NextResponse.json(
      { error: 'Odeme tamamlanamadi' },
      { status: 500 }
    )
  }
}

// SchoolPayment kaydini sil (iptal)
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

    await prisma.schoolPayment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Odeme silinemedi:', error)
    return NextResponse.json(
      { error: 'Odeme silinemedi' },
      { status: 500 }
    )
  }
}
