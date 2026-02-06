import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CANCELLABLE_STATUSES } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const { orderId, reason } = await request.json()

    if (!orderId || !reason) {
      return NextResponse.json(
        { error: 'Siparis ID ve iptal nedeni gerekli' },
        { status: 400 }
      )
    }

    // Siparisi kontrol et
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Siparis bulunamadi' },
        { status: 404 }
      )
    }

    // Iptal edilebilir durumlari kontrol et
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        { error: 'Bu siparis artik iptal edilemez' },
        { status: 400 }
      )
    }

    // Mevcut iptal talebi var mi kontrol et
    const existingRequest = await prisma.cancelRequest.findUnique({
      where: { orderId }
    })

    if (existingRequest) {
      // Reddedilen talep varsa sil ve yeniden olusturulmasina izin ver
      if (existingRequest.status === 'REJECTED') {
        await prisma.cancelRequest.delete({
          where: { id: existingRequest.id }
        })
      } else {
        return NextResponse.json(
          { error: 'Bu siparis icin zaten bir iptal talebi mevcut' },
          { status: 400 }
        )
      }
    }

    // Iptal talebi olustur
    const cancelRequest = await prisma.cancelRequest.create({
      data: {
        orderId,
        reason,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      cancelRequest
    })

  } catch (error) {
    console.error('Iptal talebi hatasi:', error)
    return NextResponse.json(
      { error: 'Iptal talebi olusturulamadi' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Siparis ID gerekli' },
        { status: 400 }
      )
    }

    const cancelRequest = await prisma.cancelRequest.findUnique({
      where: { orderId }
    })

    return NextResponse.json({ cancelRequest })

  } catch (error) {
    console.error('Iptal talebi sorgulama hatasi:', error)
    return NextResponse.json(
      { error: 'Iptal talebi sorgulanamadi' },
      { status: 500 }
    )
  }
}
