import { redirect } from 'next/navigation'
import { getMudurSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { ShoppingCart } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

const statusLabels: Record<string, string> = {
  PAID: "Ödendi",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi"
}

const statusColors: Record<string, string> = {
  PAID: "bg-blue-100 text-blue-800",
  PREPARING: "bg-amber-100 text-amber-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800"
}

async function getSchoolOrders(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      classes: {
        include: {
          orders: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  })

  if (!school) return { orders: [], deliveryType: 'SCHOOL_DELIVERY' }

  const orders = school.classes.flatMap(cls =>
    cls.orders.map(order => ({
      ...order,
      className: cls.name
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { orders, deliveryType: school.deliveryType }
}

export default async function MudurSiparislerPage() {
  const session = await getMudurSession()

  if (!session || !session.schoolId) {
    redirect('/mudur/login')
  }

  const { orders, deliveryType } = await getSchoolOrders(session.schoolId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Siparisler</h1>
        <p className="text-gray-500">Okulunuza ait tum siparisler</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Siparis Listesi ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Henuz siparis bulunmuyor</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siparis No</TableHead>
                  <TableHead>Sinif</TableHead>
                  <TableHead>Ogrenci</TableHead>
                  <TableHead>Veli</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Teslimat</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.className}</TableCell>
                    <TableCell className="font-medium">
                      {order.studentName}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{order.parentName}</p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {Number(order.totalAmount).toFixed(2)} TL
                    </TableCell>
                    <TableCell>
                      {deliveryType === "CARGO" ? "Kargo" : "Okula"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status] || ""}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
