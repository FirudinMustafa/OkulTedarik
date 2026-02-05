import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, totalAmount } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Indirim kodu gerekli' },
        { status: 400 }
      )
    }

    const discount = await prisma.discount.findUnique({
      where: { code: code.toUpperCase().trim() }
    })

    if (!discount) {
      return NextResponse.json(
        { error: 'Gecersiz indirim kodu' },
        { status: 404 }
      )
    }

    if (!discount.isActive) {
      return NextResponse.json(
        { error: 'Bu indirim kodu artik gecerli degil' },
        { status: 400 }
      )
    }

    const now = new Date()
    if (now < discount.validFrom || now > discount.validUntil) {
      return NextResponse.json(
        { error: 'Bu indirim kodunun gecerlilik suresi dolmus' },
        { status: 400 }
      )
    }

    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return NextResponse.json(
        { error: 'Bu indirim kodu kullanim limitine ulasmis' },
        { status: 400 }
      )
    }

    const amount = totalAmount ? Number(totalAmount) : 0

    if (discount.minAmount && amount < Number(discount.minAmount)) {
      return NextResponse.json(
        { error: `Bu indirim kodu en az ${Number(discount.minAmount).toFixed(2)} TL siparis tutari gerektirir` },
        { status: 400 }
      )
    }

    // Indirim tutarini hesapla
    let discountAmount = 0
    if (discount.type === 'PERCENTAGE') {
      discountAmount = amount * Number(discount.value) / 100
      if (discount.maxDiscount && discountAmount > Number(discount.maxDiscount)) {
        discountAmount = Number(discount.maxDiscount)
      }
    } else {
      discountAmount = Number(discount.value)
    }

    // Indirim tutari siparis tutarindan buyuk olamaz
    if (discountAmount > amount) {
      discountAmount = amount
    }

    return NextResponse.json({
      valid: true,
      discount: {
        code: discount.code,
        description: discount.description,
        type: discount.type,
        value: Number(discount.value),
        discountAmount: Math.round(discountAmount * 100) / 100
      }
    })

  } catch (error) {
    console.error('Indirim kodu dogrulama hatasi:', error)
    return NextResponse.json(
      { error: 'Bir hata olustu' },
      { status: 500 }
    )
  }
}
