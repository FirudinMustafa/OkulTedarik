"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Eye, FileText, Truck } from "lucide-react"

interface OrderType {
  id: string
  orderNumber: string
  studentName: string
  parentName: string
  parentPhone: string
  parentEmail: string | null
  deliveryType: string
  deliveryAddress: string | null
  totalAmount: number
  status: string
  paymentMethod: string | null
  createdAt: string
  class: {
    name: string
    school: { name: string }
  }
}

const statusLabels: Record<string, string> = {
  NEW: "Yeni",
  PAYMENT_PENDING: "Odeme Bekleniyor",
  PAYMENT_RECEIVED: "Odeme Alindi",
  CONFIRMED: "Onaylandi",
  INVOICED: "Faturalandi",
  CARGO_SHIPPED: "Kargoda",
  DELIVERED_TO_SCHOOL: "Okula Teslim",
  DELIVERED_BY_CARGO: "Teslim Edildi",
  COMPLETED: "Tamamlandi",
  CANCELLED: "Iptal",
  REFUNDED: "Iade"
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  PAYMENT_PENDING: "bg-yellow-100 text-yellow-800",
  PAYMENT_RECEIVED: "bg-green-100 text-green-800",
  CONFIRMED: "bg-purple-100 text-purple-800",
  INVOICED: "bg-indigo-100 text-indigo-800",
  CARGO_SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED_TO_SCHOOL: "bg-teal-100 text-teal-800",
  DELIVERED_BY_CARGO: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800"
}

export default function SiparislerPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", { credentials: 'include' })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Siparisler yuklenemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        fetchOrders()
        setStatusDialogOpen(false)
        setNewStatus("")
      }
    } catch (error) {
      console.error("Durum guncelleme hatasi:", error)
    }
  }

  const createInvoice = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/invoice`, {
        method: "POST",
        credentials: 'include'
      })

      if (res.ok) {
        fetchOrders()
        alert("Fatura olusturuldu (Mock)")
      }
    } catch (error) {
      console.error("Fatura olusturma hatasi:", error)
    }
  }

  const createShipment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipment`, {
        method: "POST",
        credentials: 'include'
      })

      if (res.ok) {
        fetchOrders()
        alert("Kargo olusturuldu (Mock)")
      }
    } catch (error) {
      console.error("Kargo olusturma hatasi:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.class.school.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparisler</h1>
          <p className="text-gray-500">Siparis yonetimi ve takibi</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Siparis no, ogrenci, veli veya okul ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus || "__all__"} onValueChange={(val) => setFilterStatus(val === "__all__" ? "" : val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tum durumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tum durumlar</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Yukleniyor...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Siparis bulunamadi</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siparis No</TableHead>
                  <TableHead>Ogrenci</TableHead>
                  <TableHead>Okul / Sinif</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Teslimat</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">Islemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.studentName}</p>
                        <p className="text-sm text-gray-500">{order.parentName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{order.class.school.name}</p>
                        <p className="text-sm text-gray-500">{order.class.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {Number(order.totalAmount).toFixed(2)} TL
                    </TableCell>
                    <TableCell>
                      {order.deliveryType === "CARGO" ? "Kargo" : "Okula Teslim"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${statusColors[order.status] || ""}`}
                        onClick={() => {
                          setSelectedOrder(order)
                          setNewStatus(order.status)
                          setStatusDialogOpen(true)
                        }}
                      >
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order)
                          setDetailDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status === "PAYMENT_RECEIVED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => createInvoice(order.id)}
                          title="Fatura Olustur"
                        >
                          <FileText className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      {order.status === "INVOICED" && order.deliveryType === "CARGO" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => createShipment(order.id)}
                          title="Kargo Olustur"
                        >
                          <Truck className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Siparis Detay Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Siparis Detayi - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Ogrenci Bilgileri</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-500">Ogrenci:</span> {selectedOrder.studentName}</p>
                    <p><span className="text-gray-500">Okul:</span> {selectedOrder.class.school.name}</p>
                    <p><span className="text-gray-500">Sinif:</span> {selectedOrder.class.name}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Veli Bilgileri</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-500">Ad Soyad:</span> {selectedOrder.parentName}</p>
                    <p><span className="text-gray-500">Telefon:</span> {selectedOrder.parentPhone}</p>
                    {selectedOrder.parentEmail && (
                      <p><span className="text-gray-500">E-posta:</span> {selectedOrder.parentEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Teslimat Bilgileri</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-500">Teslimat Tipi:</span>{" "}
                    {selectedOrder.deliveryType === "CARGO" ? "Kargo ile Teslimat" : "Okula Teslim"}
                  </p>
                  {selectedOrder.deliveryAddress && (
                    <p><span className="text-gray-500">Adres:</span> {selectedOrder.deliveryAddress}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Odeme Bilgileri</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-500">Tutar:</span>{" "}
                    <span className="font-medium">{Number(selectedOrder.totalAmount).toFixed(2)} TL</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Odeme Yontemi:</span>{" "}
                    {selectedOrder.paymentMethod === "CREDIT_CARD" ? "Kredi Karti" : selectedOrder.paymentMethod || "-"}
                  </p>
                  <p>
                    <span className="text-gray-500">Durum:</span>{" "}
                    <Badge className={statusColors[selectedOrder.status] || ""}>
                      {statusLabels[selectedOrder.status] || selectedOrder.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Durum Degistirme Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Siparis Durumu Degistir</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              Siparis: <span className="font-mono">{selectedOrder?.orderNumber}</span>
            </p>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Yeni durum secin" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Iptal
            </Button>
            <Button onClick={handleStatusChange}>
              Guncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
