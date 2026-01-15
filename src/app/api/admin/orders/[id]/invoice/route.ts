import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { logAction } from '@/lib/logger'
import { createInvoice } from '@/lib/kolaybi'

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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            school: true,
            package: { include: { items: true } }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Siparis bulunamadi' }, { status: 404 })
    }

    if (order.status !== 'PAYMENT_RECEIVED' && order.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Bu siparis icin fatura kesilemez' },
        { status: 400 }
      )
    }

    // Mock fatura olustur
    const invoiceResult = await createInvoice({
      orderNumber: order.orderNumber,
      customerName: order.parentName,
      customerEmail: order.email || undefined,
      customerPhone: order.phone,
      customerAddress: order.address || order.class.school.address || undefined,
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

    // Siparis durumunu guncelle
    await prisma.order.update({
      where: { id },
      data: {
        status: 'INVOICED',
        invoiceNo: invoiceResult.invoiceNo,
        invoicePdfPath: invoiceResult.invoiceUrl,
        invoiceDate: new Date()
      }
    })

    await logAction({
      userId: session.id,
      userType: 'ADMIN',
      action: 'CREATE',
      entity: 'INVOICE',
      entityId: order.id,
      details: {
        orderNumber: order.orderNumber,
        invoiceNo: invoiceResult.invoiceNo
      }
    })

    return NextResponse.json({
      success: true,
      invoiceNo: invoiceResult.invoiceNo,
      invoiceUrl: invoiceResult.invoiceUrl
    })
  } catch (error) {
    console.error('Fatura olusturulamadi:', error)
    return NextResponse.json(
      { error: 'Fatura olusturulamadi' },
      { status: 500 }
    )
  }
}
