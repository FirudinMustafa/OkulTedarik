import { prisma } from './prisma'

/**
 * Siparis numarasi uretici
 * Format: ORD-YYYY-XXXXX (sequential)
 * Ornek: ORD-2026-00001, ORD-2026-00002
 *
 * - Yıl bilgisi zorunlu
 * - Sequential number artan ve benzersiz
 * - Yeni yıl başladığında sayaç 00001'den başlar
 */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `ORD-${year}-`

  // Bu yıla ait son siparişi bul
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      orderNumber: 'desc'
    },
    select: {
      orderNumber: true
    }
  })

  let nextNumber = 1

  if (lastOrder) {
    // ORD-2026-00123 -> 123
    const lastNumberStr = lastOrder.orderNumber.replace(prefix, '')
    const lastNumber = parseInt(lastNumberStr, 10)
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  // 5 haneli olacak şekilde formatla
  const sequentialNumber = String(nextNumber).padStart(5, '0')

  return `${prefix}${sequentialNumber}`
}

/**
 * Senkron siparis numarasi uretici (fallback - kullanilmamali)
 * Benzersizlik garanti edilemez, sadece acil durumlar icin
 */
export function generateOrderNumberSync(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `ORD-${year}-${timestamp}${random}`.substring(0, 16)
}

/**
 * Teslim tutanagi numarasi uretici
 * Format: TT-YYYY-XXXXX
 * Ornek: TT-2026-00001
 */
export async function generateDeliveryDocumentNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `TT-${year}-`

  // Bu yıla ait son tutanağı bul
  const lastDoc = await prisma.deliveryDocument.findFirst({
    where: {
      documentNo: {
        startsWith: prefix
      }
    },
    orderBy: {
      documentNo: 'desc'
    },
    select: {
      documentNo: true
    }
  })

  let nextNumber = 1

  if (lastDoc) {
    const lastNumberStr = lastDoc.documentNo.replace(prefix, '')
    const lastNumber = parseInt(lastNumberStr, 10)
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  const sequentialNumber = String(nextNumber).padStart(5, '0')

  return `${prefix}${sequentialNumber}`
}

/**
 * Fatura numarasi uretici
 * Format: INV-YYYY-XXXXXX
 */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `INV-${year}-`

  // Bu yıla ait son faturayı bul
  const lastOrder = await prisma.order.findFirst({
    where: {
      invoiceNo: {
        startsWith: prefix,
        not: null
      }
    },
    orderBy: {
      invoiceNo: 'desc'
    },
    select: {
      invoiceNo: true
    }
  })

  let nextNumber = 1

  if (lastOrder && lastOrder.invoiceNo) {
    const lastNumberStr = lastOrder.invoiceNo.replace(prefix, '')
    const lastNumber = parseInt(lastNumberStr, 10)
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  const sequentialNumber = String(nextNumber).padStart(6, '0')

  return `${prefix}${sequentialNumber}`
}
