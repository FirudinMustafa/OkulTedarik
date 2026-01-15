'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ClassInfo {
  id: string
  name: string
  packageId: string
  packageName: string
  packagePrice: number
}

interface SchoolData {
  schoolId: string
  schoolName: string
  deliveryType: string
  classes: ClassInfo[]
}

export default function SiparisPage() {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const handlePasswordSuccess = (data: SchoolData) => {
    setSchoolData(data)
    setCurrentStep(2)
  }

  const handleBack = () => {
    setSchoolData(null)
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] translate-x-1/3" />

      <OrderHeader />
      <main className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
        <Stepper currentStep={currentStep} />
        {currentStep === 1 ? (
          <SchoolPasswordCard onSuccess={handlePasswordSuccess} />
        ) : (
          <ClassSelectionCard schoolData={schoolData!} onBack={handleBack} />
        )}
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

          {/* Right side - minimal */}
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
    </header>
  )
}

// ==================== STEPPER ====================
function Stepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Okul Girisi' },
    { number: 2, label: 'Sinif Secimi' },
    { number: 3, label: 'Siparis' }
  ]

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full mx-12" />

        {/* Progress Line Active */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full mx-12 transition-all duration-500"
          style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 6rem)` }}
        />

        {steps.map((step) => {
          const isActive = step.number === currentStep
          const isCompleted = step.number < currentStep
          const isPending = step.number > currentStep

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110'
                    : isCompleted
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-3 text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : isPending ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ==================== SCHOOL PASSWORD CARD ====================
function SchoolPasswordCard({ onSuccess }: { onSuccess: (data: SchoolData) => void }) {
  const [password, setPassword] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Success - show class selection
      onSuccess({
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        deliveryType: data.deliveryType,
        classes: data.classes
      })
    } catch {
      setErrorMessage('Bir hata olustu. Lutfen tekrar deneyin.')
      setIsValidating(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100/50">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Okul Sifrenizi Girin
          </h1>
          <p className="text-gray-500">
            Okulunuzdan aldiginiz sifreyi girerek devam edin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Orn: 2026-ATA-ABC12"
              disabled={isValidating}
              className={`w-full px-5 py-4 text-lg border-2 rounded-2xl transition-all outline-none font-mono tracking-wider ${
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
              Sinif ogretmeninizden veya okul mudurlugunden alabilirsiniz.
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

// ==================== CLASS SELECTION CARD ====================
function ClassSelectionCard({ schoolData, onBack }: { schoolData: SchoolData; onBack: () => void }) {
  const router = useRouter()
  const [selectedClassId, setSelectedClassId] = useState('')

  const handleContinue = () => {
    if (selectedClassId) {
      router.push(`/paket/${selectedClassId}`)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100/50">
        {/* School Info */}
        <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-blue-50 rounded-2xl">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
          <span className="font-semibold text-blue-900">{schoolData.schoolName}</span>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sinif Seciniz
          </h1>
          <p className="text-gray-500">
            Ogrencinin sinifini secin
          </p>
        </div>

        {/* Class List */}
        <div className="space-y-3 mb-6">
          {schoolData.classes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Bu okul icin paket tanimli sinif bulunamadi.</p>
            </div>
          ) : (
            schoolData.classes.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClassId(cls.id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedClassId === cls.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.packageName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{Number(cls.packagePrice).toFixed(2)} TL</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Geri</span>
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedClassId}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none"
          >
            <span>Devam Et</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
