"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import {
  BookOpen, Search, ArrowLeft, Loader2, Package, Truck, School,
  CheckCircle, Clock, XCircle
} from "lucide-react"
import { formatDateTime, formatPrice } from "@/lib/utils"

interface CancelRequestData {
  status: "PENDING" | "APPROVED" | "REJECTED"
  adminNote: string | null
  processedAt: string | null
  reason: string | null
}

interface OrderData {
  id: string
  orderNumber: string
  status: string
  parentName: string
  studentName: string
  totalAmount: number
  paymentMethod: string
  schoolName: string
  className: string
  packageName: string
  deliveryType: string
  trackingNo: string | null
  createdAt: string
  paidAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  cancelRequest?: CancelRequestData | null
}

const statusLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PAID: { label: "Ödendi", color: "bg-blue-500", icon: <CheckCircle className="h-4 w-4" /> },
  PREPARING: { label: "Hazırlanıyor", color: "bg-amber-500", icon: <Clock className="h-4 w-4" /> },
  SHIPPED: { label: "Kargoda", color: "bg-purple-500", icon: <Truck className="h-4 w-4" /> },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-500", icon: <Package className="h-4 w-4" /> },
  COMPLETED: { label: "Tamamlandı", color: "bg-green-700", icon: <CheckCircle className="h-4 w-4" /> },
  CANCELLED: { label: "İptal Edildi", color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> }
}

export default function SiparisTakipPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    }>
      <SiparisTakipPage />
    </Suspense>
  )
}

function SiparisTakipPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<OrderData | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)

  // URL'den siparis numarasini oku ve otomatik sorgula
  useEffect(() => {
    const urlOrderNumber = searchParams.get('orderNumber')
    if (urlOrderNumber) {
      setOrderNumber(urlOrderNumber.toUpperCase())
      searchOrder(urlOrderNumber.toUpperCase())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const searchOrder = async (searchNumber: string) => {
    setError("")
    setOrder(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/veli/order?orderNumber=${searchNumber}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Siparis bulunamadi")
        return
      }

      setOrder(data)
    } catch {
      setError("Siparis sorgulanirken hata olustu")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchOrder(orderNumber.toUpperCase())
  }

  const formatDateOrDash = (dateString: string | null) => {
    if (!dateString) return "-"
    return formatDateTime(dateString)
  }

  const getStatusInfo = (status: string) => {
    return statusLabels[status] || { label: status, color: "bg-gray-500", icon: <Clock className="h-4 w-4" /> }
  }

  const handleCancelRequest = async () => {
    if (!order || !cancelReason.trim()) return

    setCancelLoading(true)
    try {
      const res = await fetch("/api/veli/cancel-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          reason: cancelReason.trim()
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Iptal talebi gonderilemedi")
        return
      }

      setCancelSuccess(true)
      setCancelDialogOpen(false)
      setCancelReason("")
      // Siparisi guncelle - yeni PENDING talebi goster
      setOrder({ ...order, cancelRequest: { status: 'PENDING', adminNote: null, processedAt: null, reason: cancelReason.trim() } })
    } catch {
      setError("Iptal talebi gonderilirken hata olustu")
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfa
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="font-bold">Okul Tedarik</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Siparis Takip</CardTitle>
            <CardDescription>
              Siparis numaranizi girerek siparisini durumunu ogrenin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Siparis No (Orn: ORD-20250114-A3K9M)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !orderNumber}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Siparis Detayi */}
        {order && (
          <Card className="mt-6 animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Siparis No</p>
                  <CardTitle className="text-xl">{order.orderNumber}</CardTitle>
                </div>
                <Badge className={`${getStatusInfo(order.status).color} text-white`}>
                  {getStatusInfo(order.status).icon}
                  <span className="ml-1">{getStatusInfo(order.status).label}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Durum Cizgisi */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-4">
                  <div className={`relative pl-10 ${order.createdAt ? "text-green-600" : "text-gray-400"}`}>
                    <div className={`absolute left-2 w-4 h-4 rounded-full ${order.createdAt ? "bg-green-500" : "bg-gray-300"}`} />
                    <p className="font-medium">Siparis Olusturuldu</p>
                    <p className="text-sm">{formatDateOrDash(order.createdAt)}</p>
                  </div>
                  <div className={`relative pl-10 ${order.paidAt ? "text-green-600" : "text-gray-400"}`}>
                    <div className={`absolute left-2 w-4 h-4 rounded-full ${order.paidAt ? "bg-green-500" : "bg-gray-300"}`} />
                    <p className="font-medium">Odeme Alindi</p>
                    <p className="text-sm">{formatDateOrDash(order.paidAt)}</p>
                  </div>
                  {order.deliveryType === "CARGO" ? (
                    <>
                      <div className={`relative pl-10 ${order.shippedAt ? "text-green-600" : "text-gray-400"}`}>
                        <div className={`absolute left-2 w-4 h-4 rounded-full ${order.shippedAt ? "bg-green-500" : "bg-gray-300"}`} />
                        <p className="font-medium">Kargoya Verildi</p>
                        <p className="text-sm">{formatDateOrDash(order.shippedAt)}</p>
                        {order.trackingNo && (
                          <p className="text-sm mt-1">
                            Takip No: <span className="font-mono font-medium">{order.trackingNo}</span>
                          </p>
                        )}
                      </div>
                      <div className={`relative pl-10 ${order.deliveredAt ? "text-green-600" : "text-gray-400"}`}>
                        <div className={`absolute left-2 w-4 h-4 rounded-full ${order.deliveredAt ? "bg-green-500" : "bg-gray-300"}`} />
                        <p className="font-medium">Teslim Edildi</p>
                        <p className="text-sm">{formatDateOrDash(order.deliveredAt)}</p>
                      </div>
                    </>
                  ) : (
                    <div className={`relative pl-10 ${order.deliveredAt ? "text-green-600" : "text-gray-400"}`}>
                      <div className={`absolute left-2 w-4 h-4 rounded-full ${order.deliveredAt ? "bg-green-500" : "bg-gray-300"}`} />
                      <p className="font-medium">Okula Teslim Edildi</p>
                      <p className="text-sm">{formatDateOrDash(order.deliveredAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Siparis Bilgileri */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Veli</p>
                  <p className="font-medium">{order.parentName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ogrenci</p>
                  <p className="font-medium">{order.studentName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Okul / Sinif</p>
                  <p className="font-medium">{order.schoolName} - {order.className}</p>
                </div>
                <div>
                  <p className="text-gray-500">Paket</p>
                  <p className="font-medium">{order.packageName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Odeme Yontemi</p>
                  <p className="font-medium">
                    {order.paymentMethod === "CREDIT_CARD" ? "Kredi Karti" : "Kapida Odeme"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Toplam Tutar</p>
                  <p className="font-medium text-blue-600">{formatPrice(order.totalAmount)} TL</p>
                </div>
              </div>
            </CardContent>
            {/* Iptal Talebi Durum Bilgilendirmesi */}
            {order.cancelRequest && (
              <div className="px-6 pb-2">
                {order.cancelRequest.status === 'PENDING' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-yellow-800">Iptal Talebiniz Inceleniyor</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Talebiniz admin tarafindan degerlendiriliyor. Sonuc hakkinda bilgilendirileceksiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {order.cancelRequest.status === 'REJECTED' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800">Iptal Talebiniz Reddedildi</p>
                        {order.cancelRequest.adminNote && (
                          <p className="text-sm text-red-700 mt-1">
                            <span className="font-medium">Gerekcesi:</span> {order.cancelRequest.adminNote}
                          </p>
                        )}
                        {order.cancelRequest.processedAt && (
                          <p className="text-xs text-red-500 mt-1">
                            {formatDateTime(order.cancelRequest.processedAt)}
                          </p>
                        )}
                        <p className="text-sm text-red-600 mt-2">
                          Isterseniz yeni bir iptal talebi olusturabilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {order.cancelRequest.status === 'APPROVED' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Iptal Talebiniz Onaylandi</p>
                        <p className="text-sm text-green-700 mt-1">
                          Siparisiz iptal edilmistir. Iade islemi baslatilmistir.
                        </p>
                        {order.cancelRequest.processedAt && (
                          <p className="text-xs text-green-500 mt-1">
                            {formatDateTime(order.cancelRequest.processedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setOrder(null)}>
                Yeni Sorgulama
              </Button>
              {/* Iptal butonu - iptal edilebilir durumlarda ve aktif PENDING talep yoksa goster */}
              {["PAID", "PREPARING"].includes(order.status) &&
                (!order.cancelRequest || order.cancelRequest.status === 'REJECTED') &&
                !cancelSuccess && (
                <Button variant="destructive" size="sm" onClick={() => setCancelDialogOpen(true)}>
                  {order.cancelRequest?.status === 'REJECTED' ? 'Tekrar Iptal Talebi' : 'Iptal Talebi'}
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {/* Iptal Talebi Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Siparis Iptal Talebi</DialogTitle>
              <DialogDescription>
                Iptal talebiniz admin tarafindan incelenecektir.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500 mb-2">
                Siparis No: <span className="font-mono font-medium">{order?.orderNumber}</span>
              </p>
              <Textarea
                placeholder="Iptal nedeninizi yazin..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={cancelLoading}>
                Vazgec
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelRequest}
                disabled={cancelLoading || !cancelReason.trim()}
              >
                {cancelLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Iptal Talebi Gonder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
