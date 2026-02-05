import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { createInvoice } from '@/lib/kolaybi'
import { createShipment } from '@/lib/aras-kargo'

interface BatchResult {
  orderId: string
  orderNumber: string
  success: boolean
  trackingNo?: string
  invoiceNo?: string
  autoInvoiced?: boolean
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

    // Kargo gonderimi yapilabilecek siparisleri getir
    // PAID veya PREPARING durumundaki siparisler
    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        status: { in: ['NEW', 'PAID', 'PREPARING'] }
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

    // Sadece CARGO teslimat tipindeki siparisleri filtrele
    const cargoOrders = orders.filter(o => o.class.school.deliveryType === 'CARGO')

    if (cargoOrders.length === 0) {
      return NextResponse.json(
        { error: 'Kargo gonderilebilir siparis bulunamadi' },
        { status: 400 }
      )
    }

    const results: BatchResult[] = []

    // Her siparis icin kargo olustur
    for (const order of cargoOrders) {
      try {
        let invoiceNo: string | null | undefined = order.invoiceNo
        let autoInvoiced = false

        // OTOMATIK FATURA: Henuz faturalanmamis siparisler icin once fatura kes
        if (order.status === 'PAID') {
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
              error: `Otomatik fatura olusturulamadi: ${invoiceResult.errorMessage || 'Bilinmeyen hata'}`
            })
            continue
          }

          invoiceNo = invoiceResult.invoiceNo
          autoInvoiced = true

          // Fatura bilgilerini kaydet
          await prisma.order.update({
            where: { id: order.id },
            data: {
              invoiceNo: invoiceResult.invoiceNo,
              invoicePdfPath: invoiceResult.invoiceUrl,
              invoiceDate: new Date(),
              invoicedAt: new Date()
            }
          })

          await logAction({
            userId: session.id,
            userType: 'ADMIN',
            action: 'AUTO_INVOICE_CREATED',
            entity: 'ORDER',
            entityId: order.id,
            details: {
              orderNumber: order.orderNumber,
              invoiceNo: invoiceResult.invoiceNo,
              autoCreated: true,
              batchOperation: true
            }
          })
        }

        // Kargo olustur
        const shipmentResult = await createShipment({
          orderNumber: order.orderNumber,
          receiverName: order.parentName,
          receiverPhone: order.phone,
          receiverAddress: order.deliveryAddress || order.address || '',
          packageCount: 1,
          packageWeight: 2,
          packageContent: 'Okul Malzemeleri'
        })

        if (!shipmentResult.success) {
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            success: false,
            invoiceNo: invoiceNo || undefined,
            autoInvoiced,
            error: shipmentResult.errorMessage || 'Kargo olusturulamadi'
          })
          continue
        }

        // Siparis durumunu guncelle
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'SHIPPED',
            trackingNo: shipmentResult.trackingNo,
            shippedAt: new Date()
          }
        })

        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          success: true,
          trackingNo: shipmentResult.trackingNo,
          invoiceNo: invoiceNo || undefined,
          autoInvoiced
        })

        await logAction({
          userId: session.id,
          userType: 'ADMIN',
          action: 'BATCH_SHIPMENT_CREATED',
          entity: 'ORDER',
          entityId: order.id,
          details: {
            orderNumber: order.orderNumber,
            trackingNo: shipmentResult.trackingNo,
            autoInvoiced,
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
    const autoInvoicedCount = results.filter(r => r.autoInvoiced).length

    // Toplu islem logu
    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'BATCH_SHIPMENT_COMPLETED',
      entity: 'ORDER',
      details: {
        totalOrders: cargoOrders.length,
        successCount,
        failCount,
        autoInvoicedCount,
        orderIds: results.filter(r => r.success).map(r => r.orderId)
      }
    })

    return NextResponse.json({
      success: true,
      message: `${successCount} kargo olusturuldu${autoInvoicedCount > 0 ? ` (${autoInvoicedCount} otomatik fatura)` : ''}${failCount > 0 ? `, ${failCount} hata` : ''}`,
      results,
      summary: {
        total: cargoOrders.length,
        success: successCount,
        failed: failCount,
        autoInvoiced: autoInvoicedCount
      }
    })

  } catch (error) {
    console.error('Toplu kargo olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Toplu kargo olusturulamadi' },
      { status: 500 }
    )
  }
}
