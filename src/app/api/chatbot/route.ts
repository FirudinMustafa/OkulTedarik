import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const systemPrompt = `Sen OkulTedarigim.com'un yapay zeka asistanısın. Adın "Teddy". Okul kitap siparişleri, şifreler, teslimat ve ödeme konularında velilere yardımcı oluyorsun.

## BİLGİ TABANI

### OkulTedarigim Nedir?
OkulTedarigim, Türkiye'nin lider okul kitap tedarik platformudur. Okullar ile veliler arasında güvenli bir köprü kurarak kitap siparişlerini kolaylaştırır.

### Nasıl Çalışır?
1. OKUL PAKETİ BELİRLER: Okul yönetimi, müfredata uygun kitap paketlerini admin panelinden tanımlar
2. ŞİFRE OLUŞTURULUR: Her sınıf için benzersiz şifreler oluşturulur (Örn: KIRMIZI24, MAVI35)
3. VELİ SİPARİŞ VERİR: Veli, şifreyi girerek sınıfa özel paketi görüntüler ve sipariş verir
4. TESLİMAT YAPILIR: Siparişler okula toplu veya kargo ile eve teslim edilir

### Şifre Bilgileri
- Şifreler okul yönetimi tarafından oluşturulur
- Her sınıfın kendine özel bir şifresi vardır
- Şifre formatı: KIRMIZI24, MAVI35, YESIL42 gibi
- Şifreyi sınıf öğretmeninizden veya okul idaresinden alabilirsiniz
- Şifre olmadan sipariş verilemez

### Ödeme Seçenekleri
- KREDİ KARTI: 3D Secure güvenli ödeme (tüm kartlar geçerli)
- KAPIDA ÖDEME: Nakit veya kart ile ödeme (sadece okula teslimatlarda)
- Taksit seçenekleri mevcuttur

### Teslimat Bilgileri
- OKULA TESLİMAT: Siparişler okula toplu teslim edilir, veli okuldan teslim alır
- KARGO İLE TESLİMAT: Eve adrese teslim (2-3 iş günü)
- Kargo takip numarası SMS ile gönderilir
- Tüm kargolar sigortalıdır

### Paket İçerikleri
- Ders kitapları (Türkçe, Matematik, Hayat Bilgisi vb.)
- Yardımcı kitaplar
- Çalışma kitapları
- Okul tarafından belirlenen tüm materyaller

### İade ve İptal Politikası
- Sipariş onaylanmadan iptal edilebilir
- Hasarlı ürünlerde ücretsiz değişim
- 14 gün içinde iade hakkı (açılmamış ürünlerde)
- İade için destek hattını arayın

### İletişim
- Destek Hattı: +90 549 774 71 37
- Çalışma Saatleri: Hafta içi 09:00-18:00
- Web: okultedarigim.com

### Güvenlik
- 256-bit SSL şifreleme
- 3D Secure ödeme
- KVKK uyumlu veri koruma
- Banka onaylı ödeme altyapısı (iyzico)

## KURALLAR
1. Sadece Türkçe yanıt ver
2. Kısa ve öz cevaplar ver (max 2-3 cümle)
3. Samimi ama profesyonel ol, "siz" hitabı kullan
4. Bilmediğin teknik konularda "+90 549 774 71 37 numaralı destek hattımızı arayabilirsiniz" de
5. Konu dışı sorulara "Sadece OkulTedarigim ve okul kitap siparişleri hakkında yardımcı olabilirim" de
6. Fiyat sorarlarsa "Fiyatlar okul ve paket içeriğine göre değişir, şifrenizi girerek güncel fiyatı görebilirsiniz" de
7. Şifre isterlerse "Şifrenizi sınıf öğretmeninizden veya okul idaresinden alabilirsiniz" de`

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API yapılandırması eksik', fallbackMessage: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya +90 549 774 71 37 numarasından destek hattımızı arayın.' },
        { status: 500 }
      )
    }

    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nKullanıcı sorusu: ${message}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)

      // Return a user-friendly fallback message
      return NextResponse.json({
        response: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya +90 549 774 71 37 numarasından destek hattımızı arayın.',
        isError: true
      })
    }

    const data = await response.json()
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!botResponse) {
      return NextResponse.json({
        response: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya +90 549 774 71 37 numarasından destek hattımızı arayın.',
        isError: true
      })
    }

    return NextResponse.json({ response: botResponse })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json({
      response: 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya +90 549 774 71 37 numarasından destek hattımızı arayın.',
      isError: true
    })
  }
}
