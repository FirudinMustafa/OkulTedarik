/**
 * Email Servisi (Mock)
 * Gercek SMTP bilgileri verildiginde bu dosya guncellenecek
 */

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  errorMessage?: string
}

const USE_MOCK = process.env.USE_MOCK_EMAIL === 'true'

export async function sendEmail(data: { to: string; subject: string; body: string }): Promise<EmailResult> {
  return sendEmailInternal({
    to: data.to,
    subject: data.subject,
    html: `<p>${data.body}</p>`
  })
}

async function sendEmailInternal(data: EmailData): Promise<EmailResult> {
  if (USE_MOCK) {
    console.log('[MOCK EMAIL] ===============================')
    console.log(`[MOCK EMAIL] To: ${data.to}`)
    console.log(`[MOCK EMAIL] Subject: ${data.subject}`)
    console.log('[MOCK EMAIL] ===============================')

    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      messageId: `mock_${Date.now()}`
    }
  }

  // TODO: Gercek SMTP/SendGrid entegrasyonu
  throw new Error('Gercek email servisi henuz yapilandirilmadi')
}

/**
 * Siparis onay maili
 */
export async function sendOrderConfirmation(data: {
  email: string
  orderNumber: string
  parentName: string
  studentName: string
  packageName: string
  totalAmount: number
}): Promise<EmailResult> {
  const html = `
    <h2>Siparisiniz Alindi!</h2>
    <p>Sayin ${data.parentName},</p>
    <p>${data.studentName} icin siparişiniz basariyla olusturuldu.</p>
    <hr>
    <p><strong>Siparis No:</strong> ${data.orderNumber}</p>
    <p><strong>Paket:</strong> ${data.packageName}</p>
    <p><strong>Tutar:</strong> ${data.totalAmount} TL</p>
    <hr>
    <p>Siparisini takip etmek icin siparis numaranizi kullanabilirsiniz.</p>
    <p>Tesekkurler!</p>
  `

  console.log(`[MOCK EMAIL] Siparis onay maili gonderiliyor: ${data.email}`)
  return sendEmailInternal({
    to: data.email,
    subject: `Siparis Onay - ${data.orderNumber}`,
    html
  })
}

/**
 * Odeme onay maili
 */
export async function sendPaymentConfirmation(data: {
  email: string
  orderNumber: string
  parentName: string
  totalAmount: number
}): Promise<EmailResult> {
  const html = `
    <h2>Odemeniz Alindi!</h2>
    <p>Sayin ${data.parentName},</p>
    <p>${data.orderNumber} numarali siparisini icin odemeniz basariyla alindi.</p>
    <hr>
    <p><strong>Siparis No:</strong> ${data.orderNumber}</p>
    <p><strong>Odenen Tutar:</strong> ${data.totalAmount} TL</p>
    <hr>
    <p>Siparisini en kisa surede hazirlanacaktir.</p>
    <p>Tesekkurler!</p>
  `

  console.log(`[MOCK EMAIL] Odeme onay maili gonderiliyor: ${data.email}`)
  return sendEmailInternal({
    to: data.email,
    subject: `Odeme Onay - ${data.orderNumber}`,
    html
  })
}

/**
 * Kargo bildirim maili
 */
export async function sendCargoNotification(data: {
  email: string
  orderNumber: string
  parentName: string
  trackingNo: string
  trackingUrl: string
}): Promise<EmailResult> {
  const html = `
    <h2>Kargonuz Yola Cikti!</h2>
    <p>Sayin ${data.parentName},</p>
    <p>${data.orderNumber} numarali siparisini kargoya verildi.</p>
    <hr>
    <p><strong>Kargo Takip No:</strong> ${data.trackingNo}</p>
    <p><strong>Takip Linki:</strong> <a href="${data.trackingUrl}">${data.trackingUrl}</a></p>
    <hr>
    <p>Kargonuz en kisa surede size ulasacaktir.</p>
    <p>Tesekkurler!</p>
  `

  console.log(`[MOCK EMAIL] Kargo bildirim maili gonderiliyor: ${data.email}`)
  return sendEmailInternal({
    to: data.email,
    subject: `Kargonuz Yola Cikti - ${data.orderNumber}`,
    html
  })
}

/**
 * Teslim bildirim maili
 */
export async function sendDeliveryConfirmation(data: {
  email: string
  orderNumber: string
  parentName: string
  deliveryDate: string
}): Promise<EmailResult> {
  const html = `
    <h2>Siparisini Teslim Edildi!</h2>
    <p>Sayin ${data.parentName},</p>
    <p>${data.orderNumber} numarali siparisini teslim edildi.</p>
    <hr>
    <p><strong>Teslim Tarihi:</strong> ${data.deliveryDate}</p>
    <hr>
    <p>Bizi tercih ettiginiz icin tesekkur ederiz!</p>
  `

  console.log(`[MOCK EMAIL] Teslim bildirim maili gonderiliyor: ${data.email}`)
  return sendEmailInternal({
    to: data.email,
    subject: `Siparis Teslim Edildi - ${data.orderNumber}`,
    html
  })
}

/**
 * Iptal onay maili
 */
export async function sendCancellationConfirmation(data: {
  email: string
  orderNumber: string
  parentName: string
  refundAmount?: number
}): Promise<EmailResult> {
  const html = `
    <h2>Siparis Iptal Edildi</h2>
    <p>Sayin ${data.parentName},</p>
    <p>${data.orderNumber} numarali siparisini iptal edildi.</p>
    ${data.refundAmount ? `<p><strong>Iade Tutari:</strong> ${data.refundAmount} TL</p>` : ''}
    <hr>
    <p>Herhangi bir sorunuz icin bizimle iletisime gecebilirsiniz.</p>
  `

  console.log(`[MOCK EMAIL] Iptal onay maili gonderiliyor: ${data.email}`)
  return sendEmailInternal({
    to: data.email,
    subject: `Siparis Iptal - ${data.orderNumber}`,
    html
  })
}
