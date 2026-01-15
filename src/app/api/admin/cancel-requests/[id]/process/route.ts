import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { processRefund } from '@/lib/iyzico'

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
    const { status, adminNote } = await request.json()

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Gecersiz durum' },
        { status: 400 }
      )
    }

    // Iptal talebini getir
    const cancelRequest = await prisma.cancelRequest.findUnique({
      where: { id },
      include: { order: true }
    })

    if (!cancelRequest) {
      return NextResponse.json(
        { error: 'Iptal talebi bulunamadi' },
        { status: 404 }
      )
    }

    // Talebi guncelle
    const updatedRequest = await prisma.cancelRequest.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote || null,
        processedAt: new Date()
      }
    })

    // Eger onaylandiysa, siparis durumunu guncelle ve iade islemini baslat
    if (status === 'APPROVED') {
      // Mock iade islemi
      if (cancelRequest.order.paymentId) {
        await processRefund({
          paymentId: cancelRequest.order.paymentId,
          amount: Number(cancelRequest.order.totalAmount)
        })
      }

      await prisma.order.update({
        where: { id: cancelRequest.orderId },
        data: { status: 'REFUNDED' }
      })
    }

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: status === 'APPROVED' ? 'APPROVE' : 'REJECT',
      entity: 'CANCEL_REQUEST',
      entityId: id,
      details: {
        orderNumber: cancelRequest.order.orderNumber,
        status,
        adminNote
      }
    })

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error('Iptal talebi islenemedi:', error)
    return NextResponse.json(
      { error: 'Islem yapilamadi' },
      { status: 500 }
    )
  }
}
