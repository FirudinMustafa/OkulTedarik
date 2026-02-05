"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { formatDateTime, formatPrice } from "@/lib/utils"

interface OrderData {
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
  trackingNo?: string
  createdAt: string
  paidAt?: string
}

const statusLabels: Record<string, { label: string; bgClass: string; textClass: string; icon: string }> = {
  PAID: { label: 'Ödendi', bgClass: 'bg-blue-50 border-b border-blue-100', textClass: 'text-blue-700', icon: '✓' },
  PREPARING: { label: 'Hazırlanıyor', bgClass: 'bg-amber-50 border-b border-amber-100', textClass: 'text-amber-700', icon: '⏳' },
  SHIPPED: { label: 'Kargoda', bgClass: 'bg-purple-50 border-b border-purple-100', textClass: 'text-purple-700', icon: '📦' },
  DELIVERED: { label: 'Teslim Edildi', bgClass: 'bg-green-50 border-b border-green-100', textClass: 'text-green-700', icon: '✓' },
  COMPLETED: { label: 'Tamamlandı', bgClass: 'bg-green-50 border-b border-green-100', textClass: 'text-green-700', icon: '✓' },
  CANCELLED: { label: 'İptal Edildi', bgClass: 'bg-red-50 border-b border-red-100', textClass: 'text-red-700', icon: '✗' },
}

export default function SiparisOnayPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrder()
  }, [orderNumber])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/veli/order?orderNumber=${orderNumber}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Sipariş bulunamadı")
        return
      }

      setOrder(data)
    } catch {
      setError("Sipariş bilgileri yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  if (!order) return null

  const statusInfo = statusLabels[order.status] || { label: order.status, bgClass: 'bg-gray-50 border-b border-gray-100', textClass: 'text-gray-700', icon: '?' }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Okul<span className="text-blue-900">Tedarigim</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Başarı Mesajı */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
            <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Siparişiniz Alındı!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Sipariş numaranız:
          </p>
          <div className="inline-block bg-blue-900 text-white font-mono text-2xl font-bold px-6 py-3 rounded-xl">
            {order.orderNumber}
          </div>
        </div>

        {/* Sipariş Detayları */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Durum Bandı */}
          <div className={`px-6 py-4 ${statusInfo.bgClass}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{statusInfo.icon}</span>
              <div>
                <p className="text-sm text-gray-600">Sipariş Durumu</p>
                <p className={`font-semibold ${statusInfo.textClass}`}>{statusInfo.label}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Sipariş Bilgileri */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Veli Adı</h3>
                <p className="text-gray-900 font-medium">{order.parentName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Öğrenci Adı</h3>
                <p className="text-gray-900 font-medium">{order.studentName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Okul</h3>
                <p className="text-gray-900 font-medium">{order.schoolName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Sınıf</h3>
                <p className="text-gray-900 font-medium">{order.className}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Paket</h3>
                <p className="text-gray-900 font-medium">{order.packageName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Teslimat Yöntemi</h3>
                <p className="text-gray-900 font-medium">
                  {order.deliveryType === 'CARGO' ? '📦 Kargo ile Eve' : '🏫 Okula Teslim'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Ödeme Yöntemi</h3>
                <p className="text-gray-900 font-medium">
                  {order.paymentMethod === 'CREDIT_CARD' ? '💳 Kredi Kartı' : '💵 Kapıda Ödeme'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Sipariş Tarihi</h3>
                <p className="text-gray-900 font-medium">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Toplam Tutar */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Toplam Tutar</span>
              <span className="text-2xl font-bold text-blue-900">
                {formatPrice(order.totalAmount)} TL
              </span>
            </div>

            {/* Kargo Takip */}
            {order.trackingNo && (
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="text-sm text-orange-700">Kargo Takip Numarası</p>
                    <p className="font-mono font-bold text-orange-900">{order.trackingNo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bilgilendirme */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">Bilgilendirme</h3>
          <ul className="text-blue-700 text-sm space-y-2">
            <li>• Sipariş bilgileriniz e-posta ve SMS ile gönderilecektir.</li>
            <li>• Siparişinizi takip etmek için sipariş numaranızı saklayın.</li>
            <li>• Sorularınız için destek hattımızı arayabilirsiniz: <strong>+90 549 774 71 37</strong></li>
          </ul>
        </div>

        {/* Butonlar */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/siparis-takip?orderNumber=${order.orderNumber}`}
            className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Siparişi Takip Et
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-300 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    </div>
  )
}
