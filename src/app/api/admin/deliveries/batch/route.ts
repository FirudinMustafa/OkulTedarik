import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'

interface BatchResult {
  orderId: string
  orderNumber: string
  success: boolean
  error?: string
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { orderIds, action } = await request.json()

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Siparis ID listesi gerekli' },
        { status: 400 }
      )
    }

    // Gecerli aksiyonlar
    const validActions = ['DELIVERED', 'COMPLETED']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Gecersiz aksiyon' },
        { status: 400 }
      )
    }

    // Siparisleri getir
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: {
        class: {
          include: { school: true }
        }
      }
    })

    const results: BatchResult[] = []

    for (const order of orders) {
      try {
        // Durum gecislerini kontrol et
        let canUpdate = false
        const deliveryType = order.class.school.deliveryType

        if (action === 'DELIVERED') {
          // Teslim edildi: PREPARING (okula teslim) veya SHIPPED (kargo teslim) durumundakiler
          canUpdate = (deliveryType === 'SCHOOL_DELIVERY' && ['PAID', 'PREPARING'].includes(order.status)) ||
                      (deliveryType === 'CARGO' && order.status === 'SHIPPED')
        } else if (action === 'COMPLETED') {
          // Tamamla: DELIVERED durumundakiler
          canUpdate = order.status === 'DELIVERED'
        }

        if (!canUpdate) {
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            success: false,
            error: `Bu siparis ${action} durumuna gecirilemez (mevcut: ${order.status})`
          })
          continue
        }

        // Durumu guncelle
        const updateData: Record<string, unknown> = {
          status: action
        }

        if (action === 'DELIVERED') {
          updateData.deliveredAt = new Date()
        }

        await prisma.order.update({
          where: { id: order.id },
          data: updateData
        })

        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          success: true
        })

        await logAction({
          userId: session.id,
          userType: 'ADMIN',
          action: 'BATCH_DELIVERY_UPDATE',
          entity: 'ORDER',
          entityId: order.id,
          details: {
            orderNumber: order.orderNumber,
            newStatus: action,
            batchOperation: true
          }
        })

      } catch (error) {
        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          success: false,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    // Toplu islem logu
    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'BATCH_DELIVERY_COMPLETED',
      entity: 'ORDER',
      details: {
        action,
        totalOrders: orders.length,
        successCount,
        failCount,
        orderIds: results.filter(r => r.success).map(r => r.orderId)
      }
    })

    const actionLabels: Record<string, string> = {
      'DELIVERED': 'teslim edildi',
      'COMPLETED': 'tamamlandi'
    }

    return NextResponse.json({
      success: true,
      message: `${successCount} siparis ${actionLabels[action]}${failCount > 0 ? `, ${failCount} hata` : ''}`,
      results,
      summary: {
        total: orders.length,
        success: successCount,
        failed: failCount
      }
    })

  } catch (error) {
    console.error('Toplu teslimat guncelleme hatasi:', error)
    return NextResponse.json(
      { error: 'Toplu teslimat guncellenemedi' },
      { status: 500 }
    )
  }
}
