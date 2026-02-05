/**
 * SMS Servisi (Mock)
 * Gercek SMS API bilgileri verildiginde bu dosya guncellenecek
 */

export interface SMSResult {
  success: boolean
  messageId?: string
  errorMessage?: string
}

const USE_MOCK = process.env.USE_MOCK_SMS !== 'false'

export async function sendSMS(data: { to: string; message: string }): Promise<SMSResult> {
  return sendSMSInternal(data.to, data.message)
}

async function sendSMSInternal(phone: string, message: string): Promise<SMSResult> {
  if (USE_MOCK) {
    console.log('[MOCK SMS] ===============================')
    console.log(`[MOCK SMS] To: ${phone}`)
    console.log(`[MOCK SMS] Message: ${message}`)
    console.log('[MOCK SMS] ===============================')

    await new Promise(resolve => setTimeout(resolve, 200))

    return {
      success: true,
      messageId: `sms_${Date.now()}`
    }
  }

  // TODO: Gercek SMS servisi entegrasyonu (Netgsm, Ileti Merkezi, vb.)
  throw new Error('Gercek SMS servisi henuz yapilandirilmadi')
}

/**
 * Siparis onay SMS
 */
export async function sendOrderSMS(phone: string, orderNumber: string): Promise<SMSResult> {
  const message = `Siparisini alindi. Siparis No: ${orderNumber}. Takip icin web sitemizi ziyaret edin.`
  console.log(`[MOCK SMS] Siparis onay SMS gonderiliyor: ${phone}`)
  return sendSMSInternal(phone, message)
}

/**
 * Odeme onay SMS
 */
export async function sendPaymentSMS(phone: string, orderNumber: string, amount: number): Promise<SMSResult> {
  const message = `${orderNumber} no'lu siparisini icin ${amount} TL odeme alindi. Tesekkurler!`
  console.log(`[MOCK SMS] Odeme onay SMS gonderiliyor: ${phone}`)
  return sendSMSInternal(phone, message)
}

/**
 * Kargo takip SMS
 */
export async function sendCargoTrackingSMS(phone: string, trackingNo: string): Promise<SMSResult> {
  const message = `Kargonuz yola cikti! Takip No: ${trackingNo}`
  console.log(`[MOCK SMS] Kargo takip SMS gonderiliyor: ${phone}`)
  return sendSMSInternal(phone, message)
}

/**
 * Teslim bildirim SMS
 */
export async function sendDeliverySMS(phone: string, orderNumber: string): Promise<SMSResult> {
  const message = `${orderNumber} no'lu siparisini teslim edildi. Bizi tercih ettiginiz icin tesekkurler!`
  console.log(`[MOCK SMS] Teslim bildirim SMS gonderiliyor: ${phone}`)
  return sendSMSInternal(phone, message)
}

/**
 * Iptal bildirim SMS
 */
export async function sendCancellationSMS(phone: string, orderNumber: string): Promise<SMSResult> {
  const message = `${orderNumber} no'lu siparisini iptal edildi. Detaylar icin web sitemizi ziyaret edin.`
  console.log(`[MOCK SMS] Iptal bildirim SMS gonderiliyor: ${phone}`)
  return sendSMSInternal(phone, message)
}
