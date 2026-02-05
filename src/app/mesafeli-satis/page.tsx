import Link from 'next/link'

export default function MesafeliSatisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mesafeli Satis Sozlesmesi</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. TARAFLAR</h2>
            <p>
              Isbu Mesafeli Satis Sozlesmesi, asagidaki taraflar arasinda ve asagida belirtilen hukum ve sartlar
              cercevesinde akdedilmistir.
            </p>
            <p className="mt-2"><strong>SATICI:</strong> OkulTedarigim</p>
            <p><strong>ALICI:</strong> Siparis formunda bilgileri bulunan kisi</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. KONU</h2>
            <p>
              Isbu sozlesmenin konusu, ALICI&apos;nin SATICI&apos;ya ait internet sitesinden elektronik ortamda
              siparisini verdigi asagida nitelikleri ve satis fiyati belirtilen urunun satisi ve teslimi ile
              ilgili olarak 6502 sayili Tuketicinin Korunmasi Hakkinda Kanun ve Mesafeli Sozlesmeler Yonetmeligi
              hukumleri geregi taraflarin hak ve yukumluluklerinin saptanmasidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. URUN BILGILERI</h2>
            <p>
              Malin/Urunun/Hizmetin turu, miktari, marka/modeli, rengi, adedi, satis bedeli, odeme sekli
              siparis formunda ve siparis onay e-postasinda belirtilmistir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. GENEL HUKUMLER</h2>
            <p>
              ALICI, SATICI&apos;ya ait internet sitesinde satis sozlesmesine konu urunun temel nitelikleri,
              satis fiyati ve odeme sekli ile teslimata iliskin on bilgileri okuyup, bilgi sahibi oldugunu,
              elektronik ortamda gerekli teyidi verdigi kabul, beyan ve taahhut eder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. CAYMA HAKKI</h2>
            <p>
              ALICI, satin aldigi urunun kendisine veya gosterdigi adresteki kisi/kuruluslara teslim tarihinden
              itibaren 14 (ondort) gun icinde herhangi bir gerekce gostermeksizin ve cezai sart odemeksizin
              sozlesmeden cayma hakkina sahiptir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. TESLIMAT</h2>
            <p>
              Siparis onayinin ardinda en gec 30 (otuz) gun icinde teslimat gerceklestirilir.
              Teslimat, okula teslim veya kargo ile eve teslim seklinde yapilabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. ODEME VE IADE</h2>
            <p>
              Odeme, kredi karti ile online olarak yapilir. Iade talepleri, siparis tarihinden itibaren
              14 gun icinde yapilabilir. Iade onaylanan siparislerin bedeli, odeme yapilan araca 14 is gunu
              icinde iade edilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. YETKILI MAHKEME</h2>
            <p>
              Isbu sozlesmeden dogan uyusmazliklarda, Tuketici Hakem Heyetleri ve Tuketici Mahkemeleri yetkilidir.
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4 border-t border-gray-200">
            Bu sozlesme, siparis tarihinde elektronik ortamda taraflarca okunup kabul edilmistir.
          </p>
        </div>
      </main>
    </div>
  )
}
