import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const allowedFields = ['code', 'description', 'type', 'value', 'minAmount', 'maxDiscount', 'validFrom', 'validUntil', 'usageLimit', 'isActive']
    const updateData: Record<string, unknown> = {}

    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        if (key === 'code') {
          updateData[key] = String(body[key]).toUpperCase().trim()
        } else if (key === 'validFrom' || key === 'validUntil') {
          updateData[key] = new Date(body[key])
        } else {
          updateData[key] = body[key]
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Guncellenecek alan bulunamadi' }, { status: 400 })
    }

    const discount = await prisma.discount.update({
      where: { id },
      data: updateData
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'DISCOUNT',
      entityId: discount.id,
      details: { code: discount.code }
    })

    return NextResponse.json({ discount })
  } catch (error) {
    console.error('Indirim guncellenemedi:', error)
    return NextResponse.json(
      { error: 'Indirim guncellenemedi' },
      { status: 500 }
    )
  }
}

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

    const discount = await prisma.discount.findUnique({ where: { id } })
    if (!discount) {
      return NextResponse.json({ error: 'Indirim bulunamadi' }, { status: 404 })
    }

    await prisma.discount.delete({ where: { id } })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'DELETE',
      entity: 'DISCOUNT',
      entityId: id,
      details: { code: discount.code }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Indirim silinemedi:', error)
    return NextResponse.json(
      { error: 'Indirim silinemedi' },
      { status: 500 }
    )
  }
}
