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

    const payments = await prisma.schoolPayment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        school: { select: { id: true, name: true } }
      }
    })

    // Frontend icin map et
    const mappedPayments = payments.map(payment => ({
      id: payment.id,
      school: payment.school,
      amount: payment.amount,
      period: payment.period || new Date(payment.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      status: payment.status,
      paidAt: payment.paidAt?.toISOString() || null,
      createdAt: payment.createdAt.toISOString()
    }))

    return NextResponse.json({ payments: mappedPayments })
  } catch (error) {
    console.error('Odemeler listelenemedi:', error)
    return NextResponse.json(
      { error: 'Odemeler yuklenemedi' },
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

    const { schoolId, amount, description } = await request.json()

    if (!schoolId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Okul ve gecerli bir tutar gerekli' },
        { status: 400 }
      )
    }

    // Donem olustur (mevcut ay-yil)
    const now = new Date()
    const period = now.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

    const payment = await prisma.schoolPayment.create({
      data: {
        schoolId,
        amount,
        description: description || null,
        period,
        status: 'PENDING',
        paymentDate: now
      },
      include: {
        school: { select: { id: true, name: true } }
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'CREATE',
      entity: 'PAYMENT',
      entityId: payment.id,
      details: {
        schoolName: payment.school.name,
        amount
      }
    })

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Odeme olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Odeme olusturulamadi' },
      { status: 500 }
    )
  }
}
