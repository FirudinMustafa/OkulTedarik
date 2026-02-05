import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMudurSession } from '@/lib/auth'
import { ORDER_STATUS_LABELS } from '@/lib/constants'

export async function GET() {
  try {
    const session = await getMudurSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        class: { schoolId: session.schoolId }
      },
      include: {
        class: { select: { name: true } },
        package: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const statusLabels: Record<string, string> = { ...ORDER_STATUS_LABELS, REFUNDED: 'Iade' }

    const BOM = '\uFEFF'
    const headers = [
      'Siparis No', 'Durum', 'Veli Adi', 'Ogrenci Adi', 'Telefon',
      'Sinif', 'Paket', 'Tutar (TL)', 'Siparis Tarihi'
    ]

    const rows = orders.map(o => [
      o.orderNumber,
      statusLabels[o.status] || o.status,
      o.parentName,
      o.studentName,
      o.phone,
      o.class.name,
      o.package?.name || '',
      Number(o.totalAmount).toFixed(2),
      new Date(o.createdAt).toLocaleDateString('tr-TR')
    ])

    const csvContent = BOM + [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="okul_siparisleri_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    })

  } catch (error) {
    console.error('CSV export hatasi:', error)
    return NextResponse.json({ error: 'Export basarisiz' }, { status: 500 })
  }
}
