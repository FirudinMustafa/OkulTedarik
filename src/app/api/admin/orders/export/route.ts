import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const schoolId = searchParams.get('schoolId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }
    if (schoolId) {
      where.class = { schoolId }
    }
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(dateFrom)
      if (dateTo) (where.createdAt as Record<string, Date>).lte = new Date(dateTo)
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        class: {
          include: {
            school: { select: { name: true } }
          }
        },
        package: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const statusLabels: Record<string, string> = {
      NEW: 'Yeni',
      PAYMENT_PENDING: 'Odeme Bekliyor',
      PAID: 'Odendi',
      PREPARING: 'Hazirlaniyor',
      SHIPPED: 'Kargoda',
      DELIVERED: 'Teslim Edildi',
      COMPLETED: 'Tamamlandi',
      CANCELLED: 'Iptal',
      REFUNDED: 'Iade'
    }

    const paymentLabels: Record<string, string> = {
      CREDIT_CARD: 'Kredi Karti',
      CASH_ON_DELIVERY: 'Kapida Odeme',
      BANK_TRANSFER: 'Havale/EFT'
    }

    // BOM + CSV header
    const BOM = '\uFEFF'
    const headers = [
      'Siparis No', 'Durum', 'Veli Adi', 'Ogrenci Adi', 'Telefon', 'Email',
      'Okul', 'Sinif', 'Paket', 'Tutar (TL)', 'Indirim Kodu', 'Indirim (TL)',
      'Odeme Yontemi', 'Fatura No', 'Kargo Takip No',
      'Siparis Tarihi', 'Odeme Tarihi', 'Kargo Tarihi', 'Teslim Tarihi'
    ]

    const rows = orders.map(o => [
      o.orderNumber,
      statusLabels[o.status] || o.status,
      o.parentName,
      o.studentName,
      o.phone,
      o.email || '',
      o.class.school.name,
      o.class.name,
      o.package?.name || '',
      Number(o.totalAmount).toFixed(2),
      o.discountCode || '',
      o.discountAmount ? Number(o.discountAmount).toFixed(2) : '',
      o.paymentMethod ? (paymentLabels[o.paymentMethod] || o.paymentMethod) : '',
      o.invoiceNo || '',
      o.trackingNo || '',
      new Date(o.createdAt).toLocaleDateString('tr-TR'),
      o.paidAt ? new Date(o.paidAt).toLocaleDateString('tr-TR') : '',
      o.shippedAt ? new Date(o.shippedAt).toLocaleDateString('tr-TR') : '',
      o.deliveredAt ? new Date(o.deliveredAt).toLocaleDateString('tr-TR') : ''
    ])

    const csvContent = BOM + [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="siparisler_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    })

  } catch (error) {
    console.error('CSV export hatasi:', error)
    return NextResponse.json({ error: 'Export basarisiz' }, { status: 500 })
  }
}
