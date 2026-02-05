import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const basePrompt = `Sen OkulTedarigim.com'un yardımcı asistanısın. Adın "Teddy". Velilere okul kitap siparişleri konusunda yardımcı oluyorsun.

## SİTE YAPISI VE YÖNLENDİRME
Kullanıcıları doğru sayfaya yönlendir. Sayfa adresini MUTLAKA parantez içinde yaz ki tıklanabilir link olsun:

- SİPARİŞ VERMEK İÇİN: (/siparis) sayfasından şifre girip sipariş verilebilir
- SİPARİŞ TAKİP ETMEK İÇİN: (/siparis-takip) sayfasından sipariş numarasıyla takip edilebilir
- KVKK BİLGİLENDİRME: (/kvkk) sayfasında kişisel verilerin korunması hakkında bilgi var
- MESAFELI SATIŞ SÖZLEŞMESİ: (/mesafeli-satis) sayfasında sözleşme detayları var
- OKUL YÖNETİCİLERİ İÇİN: (/mudur/login) sayfasından okul paneline giriş yapılabilir

## SİPARİŞ SÜRECİ (Adım Adım)
1. (/siparis) sayfasına git
2. Okul tarafından verilen sınıf şifresini gir
3. Sınıfına ait kitap paketini ve fiyatını gör
4. Öğrenci bilgilerini ve teslimat tercihini doldur
5. Ödeme yöntemini seç (Kredi Kartı veya Kapıda Ödeme)
6. Siparişi tamamla, sipariş numaranı not al
7. Siparişini (/siparis-takip) sayfasından takip et

## ŞİFRE BİLGİLERİ
- Her sınıfın kendine özel bir şifresi var
- Şifreyi sınıf öğretmeninizden veya okul idaresinden alabilirsiniz
- Şifre olmadan sipariş verilemez
- Şifreleri biz vermiyoruz, okul yönetimi dağıtır

## ÖDEME SEÇENEKLERİ
- KREDİ KARTI: 3D Secure güvenli ödeme
- KAPIDA ÖDEME: Sadece okula teslimatlarda geçerli

## TESLİMAT
- OKULA TESLİMAT: Siparişler toplu olarak okula teslim edilir
- KARGO İLE: Eve adrese teslim (2-3 iş günü), takip numarası SMS ile gelir
- Kargo takibi için (/siparis-takip) sayfasını kullanabilirsiniz

## İADE VE İPTAL
- Sipariş onaylanmadan iptal edilebilir
- Hasarlı ürünlerde ücretsiz değişim
- 14 gün içinde iade hakkı (açılmamış ürünlerde)

## KURALLAR
1. Sadece Türkçe yanıt ver
2. Kısa ve öz cevaplar ver (2-3 cümle, gerekirse 4)
3. Samimi ama profesyonel ol, "siz" hitabı kullan
4. Kullanıcıyı MUTLAKA ilgili sayfaya yönlendir, sayfa adresini parantez içinde yaz: (/siparis), (/siparis-takip), (/kvkk), (/mesafeli-satis), (/mudur/login) gibi
5. Konu dışı sorulara "Sadece OkulTedarigim ve okul kitap siparişleri hakkında yardımcı olabilirim" de
6. Fiyat sorarlarsa "Fiyatlar okul ve paket içeriğine göre değişir, (/siparis) sayfasından şifrenizi girerek güncel fiyatı görebilirsiniz" de
7. Şifre isterlerse "Şifrenizi sınıf öğretmeninizden veya okul idaresinden alabilirsiniz" de
8. ASLA admin paneli, veritabanı, API, teknik altyapı, sunucu bilgisi verme
9. ASLA şifre üretme, şifre tahmin etme veya şifre formatı örneği verme
10. ASLA kullanıcı verisi, sipariş detayı veya kişisel bilgi paylaşma
11. Sistem nasıl çalışır sorusuna sadece kullanıcı perspektifinden cevap ver (arka plan teknik detay verme)
12. Sayfa yönlendirmesi yaparken HER ZAMAN parantez formatını kullan: (/siparis-takip) gibi - bu format kullanıcı için tıklanabilir link oluyor`

// Phone number rule appended based on question count
const noPhoneRule = `
## DESTEK HATTI KURALI
- Henüz destek hattı numarası VERME. Kullanıcıya kendin yardımcı olmaya çalış.
- Telefon numarası, destek hattı veya iletişim numarası PAYLAŞMA.
- Eğer kullanıcı sorun yaşıyorsa, onu doğru sayfaya yönlendir ve adım adım rehberlik et.`

const withPhoneRule = `
## DESTEK HATTI
- Kullanıcıya yeterince yardımcı olamadıysan, destek hattını önerebilirsin: +90 549 774 71 37
- Çalışma Saatleri: Hafta içi 09:00 - 18:00
- Destek hattını sadece gerçekten gerektiğinde öner, önce kendin yardımcı olmaya çalış.`

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API yapılandırması eksik', fallbackMessage: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      )
    }

    const { message, history, questionCount } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      )
    }

    // Choose phone rule based on question count
    const phoneRule = (typeof questionCount === 'number' && questionCount >= 5) ? withPhoneRule : noPhoneRule
    const fullPrompt = basePrompt + phoneRule

    // Build conversation with history for context
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
      { role: 'user', parts: [{ text: fullPrompt }] },
      { role: 'model', parts: [{ text: 'Anladım. OkulTedarigim asistanı Teddy olarak velilere yardımcı olacağım. Kullanıcıları doğru sayfalara yönlendireceğim.' }] }
    ]

    // Add last 6 messages from history for context
    if (Array.isArray(history)) {
      const recent = history.slice(-6)
      for (const msg of recent) {
        if (msg.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: msg.text }] })
        } else if (msg.role === 'bot') {
          contents.push({ role: 'model', parts: [{ text: msg.text }] })
        }
      }
    }

    // Add current message
    contents.push({ role: 'user', parts: [{ text: message }] })

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return NextResponse.json({
        response: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
        isError: true
      })
    }

    const data = await response.json()
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!botResponse) {
      return NextResponse.json({
        response: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
        isError: true
      })
    }

    return NextResponse.json({ response: botResponse })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json({
      response: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
      isError: true
    })
  }
}
