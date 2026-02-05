import Link from 'next/link'

export default function KVKKPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">KVKK Aydinlatma Metni</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. VERI SORUMLUSU</h2>
            <p>
              6698 sayili Kisisel Verilerin Korunmasi Kanunu (&quot;KVKK&quot;) uyarinca, kisisel verileriniz;
              veri sorumlusu olarak OkulTedarigim tarafindan asagida aciklanan kapsamda islenebilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. KISISEL VERILERIN ISLENME AMACI</h2>
            <p>Toplanan kisisel verileriniz asagidaki amaclarla islenebilecektir:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Siparis ve odeme islemlerinin gerceklestirilmesi</li>
              <li>Teslimat islemlerinin yapilmasi</li>
              <li>Fatura duzenlenmesi</li>
              <li>Musteri iliskileri yonetimi</li>
              <li>Yasal yukumluluklerin yerine getirilmesi</li>
              <li>Hizmet kalitesinin arttirilmasi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. ISLENEN KISISEL VERILER</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Kimlik bilgileri (ad, soyad)</li>
              <li>Iletisim bilgileri (telefon, e-posta, adres)</li>
              <li>Ogrenci bilgileri (ad, soyad, sinif, okul)</li>
              <li>Odeme bilgileri (odeme yontemi, islem bilgileri)</li>
              <li>Fatura bilgileri (vergi numarasi, vergi dairesi - kurumsal fatura icin)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. KISISEL VERILERIN AKTARILMASI</h2>
            <p>
              Kisisel verileriniz; odeme islemlerinin gerceklestirilmesi, kargo teslimatinin yapilmasi
              ve yasal yukumluluklerin yerine getirilmesi amaciyla ilgili is ortaklari, tedarikci firmalar,
              kargo sirketleri ve yasal mercilerle paylasilabilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. KISISEL VERI TOPLAMANIN YONTEMI VE HUKUKI SEBEBI</h2>
            <p>
              Kisisel verileriniz, elektronik ortamda siparis formu araciligiyla toplanmaktadir.
              KVKK&apos;nin 5. maddesinde belirtilen &quot;bir sozlesmenin kurulmasi veya ifasi&quot;
              ve &quot;meşru menfaat&quot; hukuki sebeplerine dayanilarak islenm ektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. KISISEL VERI SAHIBININ HAKLARI</h2>
            <p>KVKK&apos;nin 11. maddesi uyarinca asagidaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Kisisel verilerinizin islenip islenmedigini ogrenme</li>
              <li>Kisisel verileriniz islenmisse buna iliskin bilgi talep etme</li>
              <li>Kisisel verilerinizin islenme amacini ve bunlarin amacina uygun kullanilip kullanilmadigini ogrenme</li>
              <li>Yurt icinde veya yurt disinda kisisel verilerinizin aktarildigi ucuncu kisileri bilme</li>
              <li>Kisisel verilerinizin eksik veya yanlis islenmis olmasi halinde bunlarin duzeltilmesini isteme</li>
              <li>KVKK mevzuatinda ongonulen sartlar cercevesinde kisisel verilerinizin silinmesini veya yok edilmesini isteme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. ILETISIM</h2>
            <p>
              KVKK kapsamindaki talepleriniz icin destek hattimizdan bizimle iletisime gecebilirsiniz.
            </p>
            <p className="mt-2">
              <strong>Telefon:</strong> +90 549 774 71 37
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4 border-t border-gray-200">
            Son guncelleme tarihi: Subat 2026
          </p>
        </div>
      </main>
    </div>
  )
}
