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

    const discounts = await prisma.discount.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ discounts })
  } catch (error) {
    console.error('Indirimler listelenemedi:', error)
    return NextResponse.json(
      { error: 'Indirimler yuklenemedi' },
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
    const { code, description, type, value, minAmount, maxDiscount, validFrom, validUntil, usageLimit } = body

    if (!code || !type || value === undefined || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: 'Kod, tip, deger, baslangic ve bitis tarihi zorunlu' },
        { status: 400 }
      )
    }

    if (!['PERCENTAGE', 'FIXED'].includes(type)) {
      return NextResponse.json(
        { error: 'Gecersiz indirim tipi' },
        { status: 400 }
      )
    }

    if (type === 'PERCENTAGE' && (Number(value) <= 0 || Number(value) > 100)) {
      return NextResponse.json(
        { error: 'Yuzde indirim 0 ile 100 arasinda olmali' },
        { status: 400 }
      )
    }

    const existing = await prisma.discount.findUnique({
      where: { code: code.toUpperCase().trim() }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Bu indirim kodu zaten mevcut' },
        { status: 409 }
      )
    }

    const discount = await prisma.discount.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description || null,
        type,
        value,
        minAmount: minAmount || null,
        maxDiscount: maxDiscount || null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        usageLimit: usageLimit ? Number(usageLimit) : null
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'CREATE',
      entity: 'DISCOUNT',
      entityId: discount.id,
      details: { code: discount.code, type: discount.type }
    })

    return NextResponse.json({ discount })
  } catch (error) {
    console.error('Indirim olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Indirim olusturulamadi' },
      { status: 500 }
    )
  }
}
