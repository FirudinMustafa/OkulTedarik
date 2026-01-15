'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ==================== MAIN PAGE ====================
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

// ==================== HEADER ====================
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Özellikler', href: '#ozellikler' },
    { label: 'Nasıl Çalışır', href: '#nasil-calisir' },
    { label: 'Referanslar', href: '#referanslar' },
    { label: 'S.S.S', href: '#sss' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/mudur/login"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Okul Girişi
            </Link>
            <Link
              href="/siparis"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              Sipariş Ver
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/mudur/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Okul Girişi
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// ==================== HERO SECTION ====================
function HeroSection() {
  const trustBadges = [
    { icon: '🚚', label: 'Hızlı Teslimat' },
    { icon: '🔒', label: 'Güvenli Ödeme' },
    { icon: '⭐', label: '5.0 Puan' },
  ]

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Pastel Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50" />

      {/* Decorative Blobs */}
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[100px] translate-x-1/3" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="max-w-xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              2024-2025 Eğitim Dönemi Aktif
            </div>

            {/* Two-Color Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="text-blue-600">Okul Kitaplarınız</span>
              <br />
              <span className="text-gray-900">Artık Çok Kolay!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
              Okulunuzun belirlediği kitap paketlerine tek tıkla ulaşın.
              Güvenli ödeme, hızlı teslimat, şeffaf takip.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/siparis"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                Hemen Sipariş Ver
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#nasil-calisir"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-full border border-gray-200 transition-all hover:border-gray-300"
              >
                Nasıl Çalışır?
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-100"
                >
                  <span>{badge.icon}</span>
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual Illustration */}
          <div className="relative flex items-center justify-center">
            {/* Main Book Stack Illustration */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl scale-150" />

              {/* Floating Books */}
              <div className="relative w-[320px] h-[380px] lg:w-[400px] lg:h-[460px]">
                {/* Main Book */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-60 lg:w-56 lg:h-72">
                  <div className="relative w-full h-full transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl" />
                    <div className="absolute inset-[3px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl" />
                    <div className="absolute inset-3 bg-white rounded-xl flex flex-col items-center justify-center p-4">
                      <span className="text-5xl mb-3">📚</span>
                      <p className="text-sm font-bold text-gray-800 text-center">Student Book</p>
                      <p className="text-xs text-gray-500">İngilizce A1</p>
                    </div>
                  </div>
                </div>

                {/* Second Book */}
                <div className="absolute left-8 top-1/3 w-36 h-48 lg:w-44 lg:h-56 transform -rotate-12 hover:rotate-[-6deg] transition-transform duration-500">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-xl" />
                    <div className="absolute inset-[3px] bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl" />
                    <div className="absolute inset-3 bg-white rounded-xl flex flex-col items-center justify-center p-3">
                      <span className="text-4xl mb-2">📖</span>
                      <p className="text-xs font-bold text-gray-800 text-center">Workbook</p>
                      <p className="text-[10px] text-gray-500">Alıştırma</p>
                    </div>
                  </div>
                </div>

                {/* Third Book */}
                <div className="absolute right-4 bottom-1/4 w-32 h-44 lg:w-40 lg:h-52 transform rotate-[15deg] hover:rotate-[10deg] transition-transform duration-500">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-xl" />
                    <div className="absolute inset-[3px] bg-gradient-to-br from-green-400 to-green-600 rounded-2xl" />
                    <div className="absolute inset-3 bg-white rounded-xl flex flex-col items-center justify-center p-3">
                      <span className="text-3xl mb-2">📕</span>
                      <p className="text-xs font-bold text-gray-800 text-center">Teacher's</p>
                      <p className="text-[10px] text-gray-500">Guide</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-8 bg-white rounded-xl shadow-lg px-3 py-2 animate-bounce">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-gray-700">Stokta</span>
                  </div>
                </div>

                <div className="absolute bottom-8 left-4 bg-white rounded-xl shadow-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚚</span>
                    <span className="text-xs font-medium text-gray-700">2-3 Gün</span>
                  </div>
                </div>

                <div className="absolute top-1/4 left-0 bg-white rounded-xl shadow-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    <span className="text-xs font-medium text-gray-700">Güvenli</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

// ==================== STATS SECTION ====================
function StatsSection() {
  const stats = [
    { value: '100+', label: 'Okul', icon: '🏫' },
    { value: '5000+', label: 'Mutlu Öğrenci', icon: '👨‍🎓' },
    { value: '%99', label: 'Memnuniyet', icon: '💯' },
    { value: '2-3 Gün', label: 'Hızlı Teslimat', icon: '🚀' },
  ]

  return (
    <section className="py-16 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 text-center border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm lg:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== FEATURES SECTION ====================
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Okul Kontrolünde',
      description: 'Tüm paketler ve fiyatlar okul idaresi tarafından belirlenir. Sadece onaylı içerikler.',
      color: 'blue'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      title: 'Güvenli Ödeme',
      description: '3D Secure ile korumalı, 256-bit SSL şifreli. Kredi kartı ve kapıda ödeme seçenekleri.',
      color: 'green'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: 'Hızlı Teslimat',
      description: 'Okula toplu teslim veya kargo ile eve teslimat. 2-3 iş günü içinde kapınızda.',
      color: 'purple'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
      title: 'Şeffaf Takip',
      description: 'Sipariş numarası ile anlık durum takibi. SMS ve e-posta bildirimleri.',
      color: 'orange'
    }
  ]

  const colorClasses: Record<string, { bg: string; iconBg: string; iconText: string }> = {
    blue: { bg: 'from-blue-50 to-blue-100/50', iconBg: 'bg-blue-500', iconText: 'text-white' },
    green: { bg: 'from-green-50 to-green-100/50', iconBg: 'bg-green-500', iconText: 'text-white' },
    purple: { bg: 'from-purple-50 to-purple-100/50', iconBg: 'bg-purple-500', iconText: 'text-white' },
    orange: { bg: 'from-orange-50 to-orange-100/50', iconBg: 'bg-orange-500', iconText: 'text-white' }
  }

  return (
    <section id="ozellikler" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Avantajlar
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Neden Okul Tedarigim?
          </h2>
          <p className="text-lg text-gray-600">
            Veliler ve okullar için tasarlanmış, güvenilir ve kullanımı kolay bir sistem
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${colorClasses[feature.color].bg} rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div className={`w-14 h-14 ${colorClasses[feature.color].iconBg} rounded-2xl flex items-center justify-center mb-6 ${colorClasses[feature.color].iconText} shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== HOW IT WORKS SECTION ====================
function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [flowProgress, setFlowProgress] = useState(0)

  const steps = [
    {
      number: '01',
      title: 'Okul Paketi Belirler',
      description: 'Okul yönetimi müfredata uygun kitap paketlerini tanımlar',
      icon: '🏫',
      gradient: 'from-blue-500 to-blue-600',
      lightGradient: 'from-blue-50 to-blue-100',
      shadowColor: 'shadow-blue-500/25',
      details: ['Paket içeriği belirlenir', 'Fiyatlandırma yapılır', 'Sınıflar atanır']
    },
    {
      number: '02',
      title: 'Şifre Paylaşılır',
      description: 'Her sınıf için benzersiz şifreler oluşturulur ve velilere iletilir',
      icon: '🔐',
      gradient: 'from-purple-500 to-purple-600',
      lightGradient: 'from-purple-50 to-purple-100',
      shadowColor: 'shadow-purple-500/25',
      details: ['Benzersiz şifre üretilir', 'SMS/E-posta gönderilir', 'Güvenli erişim sağlanır']
    },
    {
      number: '03',
      title: 'Sipariş Oluşturulur',
      description: 'Veli şifreyi girer, paketi görüntüler ve güvenli ödeme yapar',
      icon: '🛒',
      gradient: 'from-emerald-500 to-emerald-600',
      lightGradient: 'from-emerald-50 to-emerald-100',
      shadowColor: 'shadow-emerald-500/25',
      details: ['Şifre ile giriş', 'Paket onayı', '3D Secure ödeme']
    },
    {
      number: '04',
      title: 'Teslimat Yapılır',
      description: 'Siparişler okula toplu veya kargo ile eve güvenle teslim edilir',
      icon: '📦',
      gradient: 'from-orange-500 to-orange-600',
      lightGradient: 'from-orange-50 to-orange-100',
      shadowColor: 'shadow-orange-500/25',
      details: ['Hazırlık başlar', 'Kargo takibi', 'Güvenli teslimat']
    }
  ]

  // Continuous auto-rotation
  useEffect(() => {
    const stepDuration = 4000
    const progressInterval = 20

    const progressTimer = setInterval(() => {
      setFlowProgress(prev => {
        const increment = 100 / (stepDuration / progressInterval)
        return prev >= 100 ? 0 : prev + increment
      })
    }, progressInterval)

    const stepTimer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
      setFlowProgress(0)
    }, stepDuration)

    return () => {
      clearInterval(progressTimer)
      clearInterval(stepTimer)
    }
  }, [steps.length])

  return (
    <section id="nasil-calisir" className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-emerald-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            4 Basit Adım
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight mb-6">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Uçtan uca kontrollü, şeffaf ve takip edilebilir bir süreç
          </p>
        </div>

        {/* Main Timeline Flow */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-[100px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent">
            {/* Animated Flow */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 to-orange-500 rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${((activeStep * 100) / (steps.length - 1)) + (flowProgress / (steps.length - 1))}%`,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
              }}
            />
            {/* Glowing Particle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-100 ease-linear"
              style={{
                left: `calc(${((activeStep * 100) / (steps.length - 1)) + (flowProgress / (steps.length - 1))}% - 8px)`,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const isActive = activeStep === index
              const isPast = index < activeStep
              const isNext = index === activeStep + 1

              return (
                <div
                  key={index}
                  className={`relative transition-all duration-700 ${
                    isActive ? 'scale-105 z-10' : isPast ? 'scale-100 opacity-80' : 'scale-95 opacity-60'
                  }`}
                >
                  {/* Card */}
                  <div className={`relative bg-white rounded-3xl p-6 lg:p-8 transition-all duration-500 ${
                    isActive
                      ? `shadow-2xl ${step.shadowColor} ring-2 ring-offset-2 ring-offset-slate-50 ring-${step.gradient.split('-')[1]}-400/50`
                      : 'shadow-lg hover:shadow-xl'
                  }`}>
                    {/* Step Number Badge */}
                    <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg transition-all duration-500 ${
                      isActive || isPast
                        ? `bg-gradient-to-br ${step.gradient} shadow-lg ${step.shadowColor}`
                        : 'bg-gray-300'
                    }`}>
                      {isPast ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.number}
                    </div>

                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 transition-all duration-500 ${
                      isActive
                        ? `bg-gradient-to-br ${step.lightGradient} shadow-inner`
                        : 'bg-gray-50'
                    }`}>
                      <span className={`transition-transform duration-500 ${isActive ? 'scale-110 animate-bounce' : ''}`} style={{ animationDuration: '2s' }}>
                        {step.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                      isActive ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Detail List - Only shown when active */}
                    <div className={`space-y-2 overflow-hidden transition-all duration-500 ${
                      isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {step.details.map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600"
                          style={{
                            animation: isActive ? `fadeInUp 0.4s ease-out ${i * 0.1}s both` : 'none'
                          }}
                        >
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0`}>
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar - Only on active */}
                    {isActive && (
                      <div className="mt-6">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${step.gradient} rounded-full transition-all duration-100 ease-linear`}
                            style={{ width: `${flowProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Connection Arrow */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-4 lg:hidden">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isPast ? `bg-gradient-to-br ${step.gradient} text-white` : 'bg-gray-200 text-gray-400'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Step Indicators - Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  activeStep === index
                    ? 'w-8 h-3 rounded-full'
                    : 'w-3 h-3 rounded-full'
                } ${
                  index <= activeStep
                    ? `bg-gradient-to-r ${step.gradient}`
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Live Indicator */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Otomatik geçiş aktif
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==================== TESTIMONIALS SECTION ====================
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ayşe Yılmaz',
      role: 'Veli, Atatürk İlkokulu',
      content: 'Kitap alışverişi artık çok kolay. Şifreyi girdim, paketi gördüm, ödemeyi yaptım. 3 gün içinde kitaplar evime geldi. Harika bir sistem!',
      rating: 5,
      avatar: '👩'
    },
    {
      name: 'Mehmet Kaya',
      role: 'Okul Müdürü',
      content: 'Velilerimizden çok olumlu geri dönüşler alıyoruz. Sistem sayesinde kitap dağıtım süreci çok kolaylaştı. Artık herkes memnun.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Fatma Demir',
      role: 'Veli, Cumhuriyet İlkokulu',
      content: 'İlk başta şüpheliydim ama deneyince çok beğendim. Ödeme güvenli, takip sistemi çok iyi. Tavsiye ederim.',
      rating: 5,
      avatar: '👩‍🦱'
    }
  ]

  return (
    <section id="referanslar" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Referanslar
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Kullanıcılarımız Ne Diyor?
          </h2>
          <p className="text-lg text-gray-600">
            Binlerce veli ve okul yöneticisinin güvendiği sistem
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== FAQ SECTION ====================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Şifreyi nereden alacağım?',
      answer: 'Sınıf şifrenizi okulunuzun idaresinden veya sınıf öğretmeninizden temin edebilirsiniz. Her sınıf için özel bir şifre tanımlanmıştır ve bu şifre sadece o sınıfın velileriyle paylaşılır.'
    },
    {
      question: 'Ödeme güvenli mi?',
      answer: 'Evet, tüm ödemeler 256-bit SSL şifrelemesi ve 3D Secure teknolojisi ile korunmaktadır. Kredi kartı bilgileriniz hiçbir zaman sistemimizde saklanmaz. Ayrıca kapıda ödeme seçeneği de mevcuttur.'
    },
    {
      question: 'Teslimat ne kadar sürer?',
      answer: 'Teslimat süresi okulunuzun tercihine göre değişir. Kargo ile teslimat 2-3 iş günü içinde gerçekleşir. Okula toplu teslimat seçeneğinde ise okul tarafından belirlenen tarihte teslim yapılır.'
    },
    {
      question: 'İade yapabilir miyim?',
      answer: 'Kullanılmamış ve ambalajı açılmamış ürünler için 14 gün içinde iade talebinde bulunabilirsiniz. İade işlemleri için sipariş takip sayfasından veya destek hattımızdan yardım alabilirsiniz.'
    },
    {
      question: 'Fatura alabilir miyim?',
      answer: 'Evet, sipariş sırasında kurumsal fatura talebinde bulunabilirsiniz. Bunun için vergi numarası ve vergi dairesi bilgilerini girmeniz yeterlidir. Fatura, teslimatla birlikte gönderilir.'
    }
  ]

  return (
    <section id="sss" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            S.S.S
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-lg text-gray-600">
            Merak ettiğiniz her şeyin cevabı burada
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-100 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== CTA SECTION ====================
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
          Siparişinizi Oluşturmaya Hazır mısınız?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Okulunuzdan aldığınız şifreyi girin ve hemen başlayın.
          Kayıt veya üyelik gerekmez.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/siparis"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-4 px-8 rounded-full hover:bg-blue-50 transition-all hover:shadow-xl"
          >
            Hemen Sipariş Ver
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/siparis-takip"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all border border-white/20"
          >
            Sipariş Takip
          </Link>
        </div>
      </div>
    </section>
  )
}

// ==================== FOOTER ====================
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Okul<span className="text-blue-400">Tedarigim</span></span>
              </div>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed mb-6">
              Okulların belirlediği, velilerin güvenle kullandığı kurumsal kitap tedarik sistemi.
              Güvenli, şeffaf ve hızlı.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span>+90 549 774 71 37</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>destek@okultedarigim.com</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Hızlı Erişim</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/siparis-takip" className="hover:text-white transition-colors">Sipariş Takip</Link>
              </li>
              <li>
                <Link href="/kvkk" className="hover:text-white transition-colors">KVKK Aydınlatma</Link>
              </li>
              <li>
                <Link href="/mesafeli-satis" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</Link>
              </li>
              <li className="pt-4 border-t border-gray-800">
                <Link href="/mudur/login" className="hover:text-white transition-colors">Okul Girişi</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 OkulTedarigim. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ==================== CHATBOT WITH GEMINI API ====================
function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string; isPhone?: boolean }>>([
    { role: 'bot', text: 'Merhaba! Ben OkulTedarigim asistanıyım. Sipariş, şifre, teslimat veya ödeme hakkında sorularınızı yanıtlayabilirim.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [showPhoneBanner, setShowPhoneBanner] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show phone banner after 5 questions
  useEffect(() => {
    if (questionCount >= 5 && !showPhoneBanner) {
      setShowPhoneBanner(true)
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Daha detaylı yardım için destek hattımızı arayabilirsiniz:',
        isPhone: true
      }])
    }
  }, [questionCount, showPhoneBanner])

  const sendToGemini = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await response.json()
      return data.response || 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya +90 549 774 71 37 numarasından destek hattımızı arayın.'
    } catch (error) {
      console.error('Chatbot API error:', error)
      return 'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya +90 549 774 71 37 numarasından destek hattımızı arayın.'
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setIsLoading(true)
    setQuestionCount(prev => prev + 1)

    const botResponse = await sendToGemini(userMessage)
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }])
    setIsLoading(false)
  }

  const quickQuestions = [
    'Şifre nereden alınır?',
    'Teslimat ne kadar sürer?',
    'Ödeme seçenekleri neler?',
    'İade yapabilir miyim?'
  ]

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rotate-0'
            : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40'
        }`}
        aria-label="Destek Asistanı"
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>

      {/* Notification Bubble (when closed) */}
      {!isOpen && (
        <div className="fixed bottom-[92px] right-6 z-50 animate-bounce">
          <div className="bg-white rounded-2xl shadow-xl px-4 py-3 border border-gray-100/80 backdrop-blur-sm">
            <p className="text-sm text-gray-700 font-medium">Yardıma mı ihtiyacınız var?</p>
            <p className="text-xs text-gray-400">Asistanımız size yardımcı olabilir</p>
          </div>
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[100px] right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] bg-white rounded-3xl shadow-2xl border border-gray-100/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 flex items-center gap-4 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div className="relative">
              <p className="font-bold text-white text-lg">Tedarik Asistan</p>
              <p className="text-sm text-blue-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Aktif - Hemen yanıt veriyor
              </p>
            </div>
          </div>

          {/* Phone Banner (shows after 5 questions) */}
          {showPhoneBanner && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-green-100">
              <a
                href="tel:+905497747137"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">Destek Hattı</p>
                  <p className="text-green-600 font-bold">+90 549 774 71 37</p>
                </div>
                <svg className="w-5 h-5 text-green-500 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                {msg.role === 'bot' && !msg.isPhone && (
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-2 flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                )}
                {msg.isPhone ? (
                  <a
                    href="tel:+905497747137"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-4 rounded-2xl shadow-lg shadow-green-500/20 flex items-center gap-3 hover:shadow-xl transition-shadow"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-green-100">Hemen Arayın</p>
                      <p className="font-bold text-lg">+90 549 774 71 37</p>
                    </div>
                  </a>
                ) : (
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg shadow-blue-500/20'
                        : 'bg-white text-gray-800 shadow-md border border-gray-100/80 rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="bg-white text-gray-800 shadow-md border border-gray-100/80 rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400 mb-2 font-medium">Hızlı Sorular</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q)
                    setTimeout(() => handleSend(), 100)
                  }}
                  disabled={isLoading}
                  className="flex-shrink-0 text-xs bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-600 px-4 py-2.5 rounded-xl transition-all border border-gray-200 shadow-sm disabled:opacity-50 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Sorunuzu yazın..."
                disabled={isLoading}
                className="flex-1 px-5 py-3.5 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all disabled:opacity-50 placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl flex items-center justify-center transition-all disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 disabled:shadow-none hover:shadow-xl hover:shadow-blue-500/40"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            {/* Question counter */}
            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-xs text-gray-400">
                {questionCount > 0 && `${questionCount} soru soruldu`}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AI destekli
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
