'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'

interface PackageItem {
  id: string
  name: string
  quantity: number
}

interface Package {
  id: string
  name: string
  description: string | null
  note: string | null
  price: number
  items: PackageItem[]
}

interface ClassInfo {
  id: string
  name: string
  package: Package | null
}

interface SchoolData {
  schoolId: string
  schoolName: string
  deliveryType: string
  classes: ClassInfo[]
}

export default function SiparisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] translate-x-1/3" />

      <OrderHeader />
      <main className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
        <SchoolPasswordFlow />
      </main>
    </div>
  )
}

// ==================== ORDER HEADER ====================
function OrderHeader() {
  return (
    <header className="relative z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Okul<span className="text-blue-600">Tedarigim</span></span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/siparis-takip"
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Siparis Takip
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

// ==================== SCHOOL PASSWORD FLOW ====================
function SchoolPasswordFlow() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      setErrorMessage('Lutfen okul sifrenizi girin')
      return
    }

    setIsValidating(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/veli/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Gecersiz okul sifresi')
        setIsValidating(false)
        return
      }

      // Basarili - okul ve sinif bilgilerini goster
      setSchoolData({
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        deliveryType: data.deliveryType,
        classes: data.classes
      })

      setIsValidating(false)
    } catch {
      setErrorMessage('Bir hata olustu. Lutfen tekrar deneyin.')
      setIsValidating(false)
    }
  }

  const handleClassSelect = (cls: ClassInfo) => {
    if (!cls.package || !schoolData) return

    // Secilen sinif bilgilerini sessionStorage'a kaydet
    sessionStorage.setItem('classData', JSON.stringify({
      classId: cls.id,
      className: cls.name,
      schoolId: schoolData.schoolId,
      schoolName: schoolData.schoolName,
      deliveryType: schoolData.deliveryType,
      package: cls.package
    }))

    // Paket sayfasina yonlendir
    router.push(`/paket/${cls.id}`)
  }

  // Sinif secim ekrani
  if (schoolData) {
    return (
      <div className="w-full max-w-2xl">
        {/* School Info Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100/50">
          {/* Back Button */}
          <button
            onClick={() => setSchoolData(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Geri
          </button>

          {/* School Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{schoolData.schoolName}</h2>
              <p className="text-gray-500">
                {schoolData.deliveryType === 'CARGO' ? 'Kargo ile Teslim' : 'Okula Teslim'}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sinif Seciniz
            </h1>
            <p className="text-gray-500">
              Ogrencinin sinifini secin ve paketi goruntuleyin
            </p>
          </div>

          {/* Class List */}
          <div className="space-y-3">
            {schoolData.classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => handleClassSelect(cls)}
                disabled={!cls.package}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  cls.package
                    ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      cls.package ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cls.name}</p>
                      {cls.package ? (
                        <p className="text-sm text-gray-500">{cls.package.name}</p>
                      ) : (
                        <p className="text-sm text-gray-400">Paket tanimlanmamis</p>
                      )}
                    </div>
                  </div>
                  {cls.package && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">
                        {formatNumber(Number(cls.package.price))} TL
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Sifre giris ekrani
  return (
    <div className="w-full max-w-md">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100/50">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Okul Sifrenizi Girin
          </h1>
          <p className="text-gray-500">
            Okulunuzdan aldiginiz sifre ile devam edin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="schoolPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Okul Sifresi
            </label>
            <input
              id="schoolPassword"
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value.toUpperCase())
                setErrorMessage('')
              }}
              placeholder="Orn: ATATURK2024"
              disabled={isValidating}
              className={`w-full px-5 py-4 text-lg border-2 rounded-2xl transition-all outline-none font-mono tracking-wider text-center ${
                errorMessage
                  ? 'border-red-300 bg-red-50 focus:border-red-500'
                  : 'border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              autoComplete="off"
              autoFocus
            />
            {errorMessage && (
              <div className="mt-3 flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!password.trim() || isValidating}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none"
          >
            {isValidating ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Kontrol ediliyor...</span>
              </>
            ) : (
              <>
                <span>Devam Et</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Okul sifresi nedir?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Okul sifresi, okulunuza ozel olusturulan bir sifredir.
              Okul mudurlugunden veya sinif ogretmeninizden alabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Guvenli Baglanti</span>
        </div>
      </div>
    </div>
  )
}
