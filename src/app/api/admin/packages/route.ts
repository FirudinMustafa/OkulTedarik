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

    const packages = await prisma.package.findMany({
      orderBy: { name: 'asc' },
      include: {
        items: true,
        _count: { select: { classes: true } }
      }
    })

    // Frontend icin map et
    const mappedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      basePrice: Number(pkg.price),
      isActive: pkg.isActive,
      items: pkg.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: Number(item.price)
      })),
      _count: pkg._count
    }))

    return NextResponse.json({ packages: mappedPackages })
  } catch (error) {
    console.error('Paketler listelenemedi:', error)
    return NextResponse.json(
      { error: 'Paketler yuklenemedi' },
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
    const { name, description, basePrice, price, items } = body

    // basePrice veya price kabul et (frontend uyumlulugu)
    const finalPrice = basePrice !== undefined ? basePrice : price

    if (!name || finalPrice === undefined) {
      return NextResponse.json(
        { error: 'Paket adi ve fiyat gerekli' },
        { status: 400 }
      )
    }

    const pkg = await prisma.package.create({
      data: {
        name,
        description: description || null,
        price: finalPrice,
        items: {
          create: items?.map((item: { name: string; quantity: number; unitPrice?: number; price?: number }) => ({
            name: item.name,
            quantity: item.quantity || 1,
            price: item.unitPrice !== undefined ? item.unitPrice : (item.price || 0)
          })) || []
        }
      },
      include: { items: true }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'CREATE',
      entity: 'PACKAGE',
      entityId: pkg.id,
      details: { name: pkg.name }
    })

    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error('Paket olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Paket olusturulamadi' },
      { status: 500 }
    )
  }
}
