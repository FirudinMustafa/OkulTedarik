import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { createInvoice } from '@/lib/kolaybi'

interface BatchResult {
  orderId: string
  orderNumber: string
  success: boolean
  invoiceNo?: string
  error?: string
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { orderIds } = await request.json()

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Siparis ID listesi gerekli' },
        { status: 400 }
      )
    }

    // Fatura kesilebilir durumdaki siparisleri getir
    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        status: { in: ['PAID'] }
      },
      include: {
        class: {
          include: {
            school: true,
            package: { include: { items: true } }
          }
        }
      }
    })

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'Fatura kesilebilir siparis bulunamadi' },
        { status: 400 }
      )
    }

    const results: BatchResult[] = []

    // Her siparis icin fatura olustur
    for (const order of orders) {
      try {
        // Fatura olustur
        const invoiceResult = await createInvoice({
          orderNumber: order.orderNumber,
          customerName: order.parentName,
          customerEmail: order.email || undefined,
          customerPhone: order.phone,
          customerAddress: order.invoiceAddress || order.address || order.class.school.address || undefined,
          isCorporate: order.isCorporateInvoice,
          taxNumber: order.taxNumber || undefined,
          taxOffice: order.taxOffice || undefined,
          items: order.class.package?.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: Number(item.price),
            totalPrice: Number(item.price) * item.quantity
          })) || [],
          totalAmount: Number(order.totalAmount)
        })

        if (!invoiceResult.success) {
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            success: false,
            error: invoiceResult.errorMessage || 'Fatura olusturulamadi'
          })
          continue
        }

        // Siparis durumunu guncelle
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PREPARING',
            invoiceNo: invoiceResult.invoiceNo,
            invoicePdfPath: invoiceResult.invoiceUrl,
            invoiceDate: new Date(),
            invoicedAt: new Date()
          }
        })

        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          success: true,
          invoiceNo: invoiceResult.invoiceNo
        })

        // Log kaydet
        await logAction({
          userId: session.id,
          userType: 'ADMIN',
          action: 'BATCH_INVOICE_CREATED',
          entity: 'ORDER',
          entityId: order.id,
          details: {
            orderNumber: order.orderNumber,
            invoiceNo: invoiceResult.invoiceNo,
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
      action: 'BATCH_INVOICE_COMPLETED',
      entity: 'ORDER',
      details: {
        totalOrders: orders.length,
        successCount,
        failCount,
        orderIds: results.filter(r => r.success).map(r => r.orderId)
      }
    })

    return NextResponse.json({
      success: true,
      message: `${successCount} fatura olusturuldu${failCount > 0 ? `, ${failCount} hata` : ''}`,
      results,
      summary: {
        total: orders.length,
        success: successCount,
        failed: failCount
      }
    })

  } catch (error) {
    console.error('Toplu fatura olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Toplu fatura olusturulamadi' },
      { status: 500 }
    )
  }
}
