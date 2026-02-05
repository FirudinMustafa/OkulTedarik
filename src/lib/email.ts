/**
 * Email Servisi - Resend API
 * USE_MOCK_EMAIL=false ise Resend uzerinden gercek email gonderir
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

const USE_MOCK = process.env.USE_MOCK_EMAIL !== 'false'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'

async function sendViaResend(data: EmailData): Promise<EmailResult> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: data.to,
      subject: data.subject,
      html: data.html
    })
  })

  const json = await res.json()

  if (!res.ok) {
    console.error('[RESEND] Email gonderilemedi:', json)
    return {
      success: false,
      errorMessage: json.message || 'Email gonderilemedi'
    }
  }

  console.log(`[RESEND] Email gonderildi: ${data.to} - ${data.subject} (${json.id})`)
  return {
    success: true,
    messageId: json.id
  }
}

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

  return sendViaResend(data)
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e293b; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">OKULTEDARIGIM.COM</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b;">Sipari\u015finiz Al\u0131nd\u0131!</h2>
        <p>Say\u0131n ${data.parentName},</p>
        <p><strong>${data.studentName}</strong> i\u00e7in sipari\u015finiz ba\u015far\u0131yla olu\u015fturuldu.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Sipari\u015f No:</strong> ${data.orderNumber}</p>
          <p><strong>Paket:</strong> ${data.packageName}</p>
          <p><strong>Tutar:</strong> ${data.totalAmount} TL</p>
        </div>
        <p>Sipari\u015finizi takip etmek i\u00e7in sipari\u015f numaran\u0131z\u0131 kullanabilirsiniz.</p>
        <p>Te\u015fekk\u00fcrler!</p>
      </div>
    </div>
  `

  return sendEmailInternal({
    to: data.email,
    subject: `Sipari\u015f Onay - ${data.orderNumber}`,
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e293b; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">OKULTEDARIGIM.COM</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #16a34a;">\u00d6demeniz Al\u0131nd\u0131!</h2>
        <p>Say\u0131n ${data.parentName},</p>
        <p><strong>${data.orderNumber}</strong> numaral\u0131 sipari\u015finiz i\u00e7in \u00f6demeniz ba\u015far\u0131yla al\u0131nd\u0131.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Sipari\u015f No:</strong> ${data.orderNumber}</p>
          <p><strong>\u00d6denen Tutar:</strong> ${data.totalAmount} TL</p>
        </div>
        <p>Sipari\u015finiz en k\u0131sa s\u00fcrede haz\u0131rlanacakt\u0131r.</p>
        <p>Te\u015fekk\u00fcrler!</p>
      </div>
    </div>
  `

  return sendEmailInternal({
    to: data.email,
    subject: `\u00d6deme Onay - ${data.orderNumber}`,
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e293b; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">OKULTEDARIGIM.COM</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #7c3aed;">Kargonuz Yola \u00c7\u0131kt\u0131!</h2>
        <p>Say\u0131n ${data.parentName},</p>
        <p><strong>${data.orderNumber}</strong> numaral\u0131 sipari\u015finiz kargoya verildi.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Kargo Takip No:</strong> <span style="font-family: monospace; font-size: 16px;">${data.trackingNo}</span></p>
          <p><a href="${data.trackingUrl}" style="color: #7c3aed;">Kargo Takip</a></p>
        </div>
        <p>Kargonuz en k\u0131sa s\u00fcrede size ula\u015facakt\u0131r.</p>
        <p>Te\u015fekk\u00fcrler!</p>
      </div>
    </div>
  `

  return sendEmailInternal({
    to: data.email,
    subject: `Kargonuz Yola \u00c7\u0131kt\u0131 - ${data.orderNumber}`,
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e293b; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">OKULTEDARIGIM.COM</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #16a34a;">Sipari\u015finiz Teslim Edildi!</h2>
        <p>Say\u0131n ${data.parentName},</p>
        <p><strong>${data.orderNumber}</strong> numaral\u0131 sipari\u015finiz teslim edildi.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Teslim Tarihi:</strong> ${data.deliveryDate}</p>
        </div>
        <p>Bizi tercih etti\u011finiz i\u00e7in te\u015fekk\u00fcr ederiz!</p>
      </div>
    </div>
  `

  return sendEmailInternal({
    to: data.email,
    subject: `Sipari\u015f Teslim Edildi - ${data.orderNumber}`,
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e293b; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">OKULTEDARIGIM.COM</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #dc2626;">Sipari\u015f \u0130ptal Edildi</h2>
        <p>Say\u0131n ${data.parentName},</p>
        <p><strong>${data.orderNumber}</strong> numaral\u0131 sipari\u015finiz iptal edildi.</p>
        ${data.refundAmount ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>\u0130ade Tutar\u0131:</strong> ${data.refundAmount} TL</p>
        </div>` : ''}
        <p>Herhangi bir sorunuz i\u00e7in bizimle ileti\u015fime ge\u00e7ebilirsiniz.</p>
      </div>
    </div>
  `

  return sendEmailInternal({
    to: data.email,
    subject: `Sipari\u015f \u0130ptal - ${data.orderNumber}`,
    html
  })
}
