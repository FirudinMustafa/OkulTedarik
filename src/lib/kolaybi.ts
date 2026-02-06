/**
 * KolayBi E-Fatura Entegrasyonu (Mock)
 * Gercek API bilgileri verildiginde bu dosya guncellenecek
 */

export interface InvoiceData {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress?: string
  isCorporate: boolean
  taxNumber?: string
  taxOffice?: string
  items: {
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
  totalAmount: number
}

export interface InvoiceResult {
  success: boolean
  invoiceNo?: string
  invoiceDate?: string
  invoiceUrl?: string
  errorMessage?: string
}

const USE_MOCK = process.env.USE_MOCK_INVOICE !== 'false'
const isDev = process.env.NODE_ENV !== 'production'

/**
 * E-Fatura olustur
 */
export async function createInvoice(data: InvoiceData): Promise<InvoiceResult> {
  if (USE_MOCK) {
    if (isDev) {
      console.log('[MOCK KOLAYBI] E-Fatura olusturuluyor:', data.orderNumber)
      console.log('  - Musteri:', data.customerName)
      console.log('  - Tutar:', data.totalAmount, 'TL')
      console.log('  - Kurumsal:', data.isCorporate)
    }

    // Simulasyon: 1.5 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 1500))

    const invoiceNo = `INV-${Date.now().toString().slice(-8)}`
    const invoiceDate = new Date().toISOString()

    return {
      success: true,
      invoiceNo,
      invoiceDate,
      invoiceUrl: `/api/mock-invoices/${data.orderNumber}.pdf`
    }
  }

  // TODO: Gercek KolayBi entegrasyonu
  throw new Error('Gercek KolayBi entegrasyonu henuz yapilandirilmadi')
}

/**
 * E-Fatura iptal
 */
export async function cancelInvoice(invoiceNo: string): Promise<{ success: boolean; message?: string }> {
  if (USE_MOCK) {
    if (isDev) console.log('[MOCK KOLAYBI] E-Fatura iptal ediliyor:', invoiceNo)

    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      message: 'Fatura iptali basarili (Mock)'
    }
  }

  // TODO: Gercek KolayBi fatura iptal
  throw new Error('Gercek KolayBi entegrasyonu henuz yapilandirilmadi')
}

/**
 * Fatura durumu sorgula
 */
export async function getInvoiceStatus(invoiceNo: string): Promise<{ status: string; message?: string }> {
  if (USE_MOCK) {
    if (isDev) console.log('[MOCK KOLAYBI] Fatura durumu sorgusu:', invoiceNo)

    return {
      status: 'APPROVED',
      message: 'Fatura onaylandi (Mock)'
    }
  }

  // TODO: Gercek KolayBi durum sorgulama
  throw new Error('Gercek KolayBi entegrasyonu henuz yapilandirilmadi')
}
