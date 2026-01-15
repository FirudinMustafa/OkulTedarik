import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            deliveryType: true,
            isActive: true
          }
        },
        package: {
          include: {
            items: {
              select: {
                id: true,
                name: true,
                quantity: true
                // price kasitli olarak dahil edilmiyor - veliye gosterilmeyecek
              }
            }
          }
        }
      }
    })

    if (!classData) {
      return NextResponse.json(
        { error: 'Sinif bulunamadi' },
        { status: 404 }
      )
    }

    if (!classData.isActive) {
      return NextResponse.json(
        { error: 'Bu sinif aktif degil' },
        { status: 403 }
      )
    }

    if (!classData.school.isActive) {
      return NextResponse.json(
        { error: 'Bu okul aktif degil' },
        { status: 403 }
      )
    }

    if (!classData.package) {
      return NextResponse.json(
        { error: 'Bu sinif icin paket tanimlanmamis' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: classData.id,
      name: classData.name,
      school: {
        id: classData.school.id,
        name: classData.school.name,
        deliveryType: classData.school.deliveryType
      },
      package: {
        id: classData.package.id,
        name: classData.package.name,
        description: classData.package.description,
        note: classData.package.note,
        price: classData.package.price,
        items: classData.package.items
      }
    })

  } catch (error) {
    console.error('Sinif bilgisi hatasi:', error)
    return NextResponse.json(
      { error: 'Bir hata olustu' },
      { status: 500 }
    )
  }
}
