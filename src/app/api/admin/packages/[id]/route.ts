import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { id } = await params

    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        items: true,
        classes: {
          include: {
            school: { select: { name: true } }
          }
        }
      }
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Paket bulunamadi' }, { status: 404 })
    }

    // Frontend icin map et
    const mappedPackage = {
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
      classes: pkg.classes
    }

    return NextResponse.json({ package: mappedPackage })
  } catch (error) {
    console.error('Paket getirilemedi:', error)
    return NextResponse.json(
      { error: 'Paket yuklenemedi' },
      { status: 500 }
    )
  }
}

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
    const { items, basePrice, ...otherData } = body

    // basePrice varsa price olarak kaydet
    const packageData = {
      ...otherData,
      ...(basePrice !== undefined ? { price: basePrice } : {})
    }

    // Eger items varsa, once eskileri sil, sonra yenilerini ekle
    if (items) {
      await prisma.packageItem.deleteMany({
        where: { packageId: id }
      })

      await prisma.packageItem.createMany({
        data: items.map((item: { name: string; quantity: number; unitPrice?: number; price?: number }) => ({
          packageId: id,
          name: item.name,
          quantity: item.quantity || 1,
          price: item.unitPrice !== undefined ? item.unitPrice : (item.price || 0)
        }))
      })
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: packageData,
      include: { items: true }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'UPDATE',
      entity: 'PACKAGE',
      entityId: pkg.id,
      details: { name: pkg.name }
    })

    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error('Paket guncellenemedi:', error)
    return NextResponse.json(
      { error: 'Paket guncellenemedi' },
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

    // Bagli siniflar var mi kontrol et
    const classCount = await prisma.class.count({
      where: { packageId: id }
    })

    if (classCount > 0) {
      return NextResponse.json(
        { error: 'Bu paket siniflara atanmis. Once siniflardan kaldiriniz.' },
        { status: 400 }
      )
    }

    // Paket itemlarini sil
    await prisma.packageItem.deleteMany({
      where: { packageId: id }
    })

    const pkg = await prisma.package.delete({
      where: { id }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'DELETE',
      entity: 'PACKAGE',
      entityId: id,
      details: { name: pkg.name }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Paket silinemedi:', error)
    return NextResponse.json(
      { error: 'Paket silinemedi' },
      { status: 500 }
    )
  }
}
