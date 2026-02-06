// Siparis durum sabitleri - tum sayfalarda kullanilir

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Yeni",
  PAYMENT_PENDING: "Odeme Bekliyor",
  PAID: "Odendi",
  PREPARING: "Hazirlaniyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  COMPLETED: "Tamamlandi",
  CANCELLED: "Iptal Edildi"
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-sky-100 text-sky-800",
  PAYMENT_PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PREPARING: "bg-amber-100 text-amber-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800"
}

// Iptal edilebilir durumlar (veli tarafindan)
export const CANCELLABLE_STATUSES = ['NEW', 'PAYMENT_PENDING', 'PAID', 'PREPARING']

// Gelire dahil edilecek durumlar (odenmis siparisler)
export const REVENUE_STATUSES = ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'COMPLETED']

// Gecerli status gecisleri
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  NEW: ['PAID', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING', 'SHIPPED', 'CANCELLED'],
  PREPARING: ['SHIPPED', 'DELIVERED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
}
