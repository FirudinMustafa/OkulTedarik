'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ==================== MAIN PAGE ====================
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <BrandScrollSection />
        <BookShowcaseSection />
        <ProcessSection />
        <StatsSection />
        <FeaturesSection />
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
    { label: 'Kitap Setleri', href: '#kitaplar' },
    { label: 'Nasıl Çalışır', href: '#nasil-calisir' },
    { label: 'Özellikler', href: '#ozellikler' },
    { label: 'Referanslar', href: '#referanslar' },
    { label: 'S.S.S', href: '#sss' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Okul<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tedarigim</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-1/2 transition-all" />
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/mudur/login"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
              </svg>
              Okul Paneli
            </Link>
            <Link
              href="/siparis"
              className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 px-6 rounded-full transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sipariş Ver
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
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
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
          <nav className="flex flex-col gap-1 pt-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/mudur/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              Okul Paneli
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

// ==================== HERO SECTION ====================
function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-[10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-300/10 rounded-full blur-[150px]" />
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animation: `float ${5 + (i % 10)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.25) % 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="max-w-xl">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-blue-200/50 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-lg shadow-blue-500/10 animate-fade-in-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              2024-2025 Kayıt Dönemi Başladı
            </div>

            {/* Main Headline with Animation */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
              <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                Okul Kitapları
              </span>
              <span className="block text-gray-900 mt-2">
                Tek Tıkla
              </span>
              <span className="block text-gray-900">
                Kapınızda
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              Okulunuzun belirlediği kitap paketlerine <span className="text-blue-600 font-semibold">güvenle</span> ulaşın.
              3D Secure ödeme, anlık takip, hızlı teslimat.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/siparis"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  Hemen Sipariş Ver
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <a
                href="#nasil-calisir"
                className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
                Nasıl Çalışır?
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-200/50 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">3D Secure</p>
                  <p className="text-xs text-gray-500">Güvenli Ödeme</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-200/50 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">2-3 Gün</p>
                  <p className="text-xs text-gray-500">Hızlı Teslimat</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-200/50 shadow-sm">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">5.0 Puan</p>
                  <p className="text-xs text-gray-500">Memnuniyet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - 3D Book Stack with Parallax */}
          <div className="relative flex items-center justify-center perspective-1000">
            <div
              className="relative w-full max-w-lg"
              style={{
                transform: `rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-[50%] blur-[100px] scale-150 animate-pulse" style={{ animationDuration: '4s' }} />

              {/* Book Stack */}
              <div className="relative transform-gpu preserve-3d">
                {/* Background Book */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-72 -translate-z-20 opacity-60">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-2xl transform rotate-[-20deg] translate-x-8 translate-y-8" />
                </div>

                {/* Middle Book */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-76 -translate-z-10 opacity-80">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-2xl transform rotate-[-10deg] translate-x-4 translate-y-4" />
                </div>

                {/* Main Book - Front */}
                <div className="relative w-64 h-80 mx-auto transform hover:scale-105 transition-transform duration-500">
                  {/* Book Cover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-500/50">
                    {/* Spine Effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/30 to-transparent rounded-l-3xl" />
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-3xl" />
                  </div>

                  {/* Book Content */}
                  <div className="absolute inset-4 bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-inner">
                    {/* Publisher Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Student Book</h3>
                    <p className="text-sm text-gray-500 mb-4">English A1</p>
                    <div className="w-full h-px bg-gray-200 mb-4" />
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-medium">2024-2025</span>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-green-500/50 animate-bounce" style={{ animationDuration: '2s' }}>
                    Stokta
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute top-0 -right-8 bg-white rounded-2xl shadow-xl px-4 py-3 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Kargo Takip</p>
                      <p className="text-xs text-gray-500">Anlık Bildirim</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">256-bit SSL</p>
                      <p className="text-xs text-gray-500">Şifreli Ödeme</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Keşfet</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  )
}

// ==================== BRAND SCROLL SECTION ====================
function BrandScrollSection() {
  const brands = [
    'Oxford', 'Cambridge', 'Pearson', 'Macmillan', 'National Geographic', 'Express Publishing'
  ]

  return (
    <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm text-gray-400 font-medium mb-8">Dünya Markalarının Güvenilir Tedarikçisi</p>
        <div className="relative">
          <div className="flex gap-16 animate-scroll">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-2xl font-bold text-gray-300 hover:text-blue-500 transition-colors cursor-default"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  )
}

// ==================== BOOK SHOWCASE SECTION ====================
function BookShowcaseSection() {
  const [activeBook, setActiveBook] = useState(0)

  const bookSets = [
    {
      id: 1,
      name: 'English Stars A1',
      grade: '1. Sınıf',
      publisher: 'Oxford',
      price: '450 TL',
      image: 'blue',
      items: ['Student Book', 'Workbook', 'Online Access', 'Audio CD'],
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 2,
      name: 'Math Adventures B1',
      grade: '2. Sınıf',
      publisher: 'Cambridge',
      price: '520 TL',
      image: 'purple',
      items: ['Course Book', 'Practice Book', 'Digital Resources', 'Teacher Guide'],
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 3,
      name: 'Science Explorer',
      grade: '3. Sınıf',
      publisher: 'Pearson',
      price: '480 TL',
      image: 'green',
      items: ['Student Edition', 'Lab Manual', 'Online Platform', 'Assessment Pack'],
      color: 'from-emerald-500 to-emerald-700'
    },
    {
      id: 4,
      name: 'World History Plus',
      grade: '4. Sınıf',
      publisher: 'National Geographic',
      price: '550 TL',
      image: 'orange',
      items: ['Core Textbook', 'Activity Book', 'Map Collection', 'Video Access'],
      color: 'from-orange-500 to-orange-700'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBook(prev => (prev + 1) % bookSets.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [bookSets.length])

  return (
    <section id="kitaplar" className="py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Kitap Setleri
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Okulunuzun Belirlediği
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Premium Paketler
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Her sınıf için özel olarak hazırlanmış, müfredata uygun içerikler
          </p>
        </div>

        {/* Book Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Book Preview */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Rotating Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${bookSets[activeBook].color} rounded-full blur-[100px] opacity-30 scale-125 transition-all duration-1000`} />

              {/* Book Cards Stack */}
              <div className="relative h-full flex items-center justify-center">
                {bookSets.map((book, index) => {
                  const isActive = index === activeBook
                  const offset = index - activeBook
                  return (
                    <div
                      key={book.id}
                      className={`absolute w-64 h-80 transition-all duration-700 cursor-pointer ${
                        isActive ? 'z-30 scale-100 opacity-100' : 'scale-90 opacity-50'
                      }`}
                      style={{
                        transform: `translateX(${offset * 30}px) translateY(${Math.abs(offset) * 10}px) rotate(${offset * 5}deg)`,
                        zIndex: 30 - Math.abs(offset)
                      }}
                      onClick={() => setActiveBook(index)}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${book.color} rounded-3xl shadow-2xl p-1`}>
                        <div className="w-full h-full bg-white rounded-[22px] p-6 flex flex-col">
                          {/* Publisher Badge */}
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{book.publisher}</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${book.color} text-white`}>
                              {book.grade}
                            </span>
                          </div>

                          {/* Book Icon */}
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${book.color} flex items-center justify-center shadow-lg`}>
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>

                          {/* Book Title */}
                          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{book.name}</h3>

                          {/* Price */}
                          <p className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                            {book.price}
                          </p>

                          {/* Items Count */}
                          <div className="mt-auto text-center">
                            <p className="text-sm text-gray-500">{book.items.length} parça set</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {bookSets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBook(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeBook
                      ? 'w-8 h-3 bg-blue-600'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right - Book Details */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
              {/* Active Book Info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${bookSets[activeBook].color}`}>
                    {bookSets[activeBook].grade}
                  </span>
                  <span className="text-sm text-gray-500">{bookSets[activeBook].publisher}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{bookSets[activeBook].name}</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {bookSets[activeBook].price}
                </p>
              </div>

              {/* Package Contents */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Set İçeriği</h4>
                <div className="grid grid-cols-2 gap-3">
                  {bookSets[activeBook].items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 group hover:bg-blue-50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bookSets[activeBook].color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/siparis"
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r ${bookSets[activeBook].color} text-white font-bold py-4 px-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-0.5`}
              >
                <span>Bu Paketi Sipariş Ver</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==================== PROCESS SECTION ====================
function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      number: '01',
      title: 'Okul Paketi Oluşturur',
      description: 'Okul idaresi, sınıf bazında ders kitaplarını ve yardımcı kaynakları belirleyerek sistemde paket oluşturur.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
      color: 'blue',
      details: [
        'Müfredata uygun içerik seçimi',
        'Fiyat belirleme ve onaylama',
        'Sınıf ve şube atamaları'
      ]
    },
    {
      number: '02',
      title: 'Şifre Velilere Ulaştırılır',
      description: 'Her sınıf için benzersiz sipariş şifresi oluşturulur ve SMS/e-posta ile velilere güvenle iletilir.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      ),
      color: 'purple',
      details: [
        'Güvenli şifre üretimi',
        'Otomatik SMS bildirimi',
        'Çoklu iletişim kanalları'
      ]
    },
    {
      number: '03',
      title: 'Veli Siparişi Tamamlar',
      description: 'Veli, şifre ile sisteme giriş yaparak paketi inceler ve 3D Secure ile güvenli ödeme yapar.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      ),
      color: 'emerald',
      details: [
        'Paket içeriği görüntüleme',
        '3D Secure ödeme',
        'Anlık sipariş onayı'
      ]
    },
    {
      number: '04',
      title: 'Kitaplar Teslim Edilir',
      description: 'Siparişler okula toplu olarak veya Aras Kargo ile eve teslim edilir. Anlık takip imkanı sunulur.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      color: 'orange',
      details: [
        'Okula toplu teslimat',
        'Eve kargo seçeneği',
        'Canlı kargo takibi'
      ]
    }
  ]

  const colors: Record<string, { bg: string; light: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-600', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-600', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
    orange: { bg: 'bg-orange-600', light: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isVisible, steps.length])

  return (
    <section id="nasil-calisir" ref={sectionRef} className="py-24 lg:py-32 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-300 px-5 py-2.5 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            Süreç
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            4 Adımda
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kolayca Sipariş
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Uçtan uca şeffaf, takip edilebilir ve güvenli bir süreç
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 transition-all duration-1000 rounded-full"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const isActive = index === activeStep
              const isPast = index < activeStep
              const colorSet = colors[step.color]

              return (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    isActive ? 'scale-105' : 'scale-100 hover:scale-102'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Step Number - Top */}
                  <div className={`relative w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive || isPast
                      ? `${colorSet.bg} text-white shadow-lg shadow-${step.color}-500/30`
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {isPast ? (
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xl font-bold">{step.number}</span>
                    )}
                    {/* Pulse Ring */}
                    {isActive && (
                      <div className={`absolute inset-0 rounded-2xl ${colorSet.bg} animate-ping opacity-50`} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`bg-white/5 backdrop-blur-sm rounded-3xl p-6 border transition-all duration-500 ${
                    isActive
                      ? `border-${step.color}-500/50 bg-white/10`
                      : 'border-white/10 hover:border-white/20'
                  }`}>
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                      isActive ? colorSet.light : 'bg-white/10'
                    } ${isActive ? colorSet.text : 'text-white/50'}`}>
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.description}</p>

                    {/* Details - Only on active */}
                    <div className={`space-y-2 overflow-hidden transition-all duration-500 ${
                      isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-5 h-5 rounded-full ${colorSet.bg} flex items-center justify-center flex-shrink-0`}>
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-4 lg:hidden">
                      <svg className={`w-6 h-6 ${isPast ? colorSet.text : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeStep
                    ? `w-10 h-3 ${colors[step.color].bg}`
                    : index < activeStep
                    ? `w-3 h-3 ${colors[step.color].bg} opacity-60`
                    : 'w-3 h-3 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ==================== STATS SECTION ====================
function StatsSection() {
  const [counters, setCounters] = useState([0, 0, 0, 0])
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = [
    { value: 150, suffix: '+', label: 'Okul', icon: '🏫', color: 'blue' },
    { value: 12000, suffix: '+', label: 'Mutlu Öğrenci', icon: '👨‍🎓', color: 'green' },
    { value: 99, suffix: '%', label: 'Memnuniyet', icon: '⭐', color: 'yellow' },
    { value: 2, suffix: '-3 Gün', label: 'Teslimat', icon: '🚀', color: 'purple' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    const duration = 2000
    const steps = 60
    const increment = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      setCounters(stats.map(stat => Math.round(stat.value * eased)))

      if (step >= steps) clearInterval(timer)
    }, increment)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 text-center border border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Floating Icon */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>

              {/* Counter */}
              <div className="pt-4">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {counters[index]}{stat.suffix}
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
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
      title: 'Okul Onaylı Paketler',
      description: 'Tüm içerikler okul idaresi tarafından belirlenir ve onaylanır. Müfredata %100 uyumlu.',
      color: 'blue'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      title: '3D Secure Ödeme',
      description: '256-bit SSL şifrelemesi ve 3D Secure teknolojisi ile tam koruma. Kapıda ödeme seçeneği.',
      color: 'green'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      title: 'Anlık Kargo Takibi',
      description: 'Siparişinizi her an takip edin. SMS ve e-posta bildirimleri ile süreçten haberdar olun.',
      color: 'purple'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
      title: 'E-Fatura Desteği',
      description: 'Bireysel veya kurumsal fatura seçenekleri. Anında dijital fatura gönderimi.',
      color: 'orange'
    }
  ]

  const colorClasses: Record<string, { bg: string; iconBg: string; iconText: string; hover: string }> = {
    blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-500', iconText: 'text-white', hover: 'hover:bg-blue-100' },
    green: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-500', iconText: 'text-white', hover: 'hover:bg-emerald-100' },
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-500', iconText: 'text-white', hover: 'hover:bg-purple-100' },
    orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-500', iconText: 'text-white', hover: 'hover:bg-orange-100' }
  }

  return (
    <section id="ozellikler" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Avantajlar
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Neden OkulTedarigim?
          </h2>
          <p className="text-xl text-gray-600">
            Veliler ve okullar için tasarlanmış, güvenilir sistem
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${colorClasses[feature.color].bg} ${colorClasses[feature.color].hover} rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}
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

// ==================== TESTIMONIALS SECTION ====================
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ayşe Yılmaz',
      role: 'Veli, Atatürk İlkokulu',
      content: 'Kitap alışverişi artık çok kolay. Şifreyi girdim, paketi gördüm, ödemeyi yaptım. 3 gün içinde kitaplar evime geldi!',
      rating: 5,
      image: 'A'
    },
    {
      name: 'Mehmet Kaya',
      role: 'Okul Müdürü',
      content: 'Velilerimizden çok olumlu geri dönüşler alıyoruz. Sistem sayesinde kitap dağıtım süreci çok kolaylaştı.',
      rating: 5,
      image: 'M'
    },
    {
      name: 'Fatma Demir',
      role: 'Veli, Cumhuriyet İlkokulu',
      content: 'İlk başta şüpheliydim ama deneyince çok beğendim. Ödeme güvenli, takip sistemi harika. Tavsiye ederim.',
      rating: 5,
      image: 'F'
    }
  ]

  return (
    <section id="referanslar" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Referanslar
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Kullanıcılarımız Ne Diyor?
          </h2>
          <p className="text-xl text-gray-600">
            Binlerce velinin güvendiği sistem
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
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
      answer: 'Sınıf şifrenizi okulunuzun idaresinden veya sınıf öğretmeninizden temin edebilirsiniz. Her sınıf için özel bir şifre tanımlanmıştır.'
    },
    {
      question: 'Ödeme güvenli mi?',
      answer: 'Evet, tüm ödemeler 256-bit SSL şifrelemesi ve 3D Secure teknolojisi ile korunmaktadır. Kredi kartı bilgileriniz sistemimizde saklanmaz.'
    },
    {
      question: 'Teslimat ne kadar sürer?',
      answer: 'Kargo ile teslimat 2-3 iş günü içinde gerçekleşir. Okula toplu teslimat seçeneğinde okul tarafından belirlenen tarihte teslim yapılır.'
    },
    {
      question: 'İade yapabilir miyim?',
      answer: 'Kullanılmamış ve ambalajı açılmamış ürünler için 14 gün içinde iade talebinde bulunabilirsiniz.'
    },
    {
      question: 'Fatura alabilir miyim?',
      answer: 'Evet, bireysel veya kurumsal fatura seçenekleri mevcuttur. Sipariş sırasında tercihini belirtmeniz yeterlidir.'
    }
  ]

  return (
    <section id="sss" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            S.S.S
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Merak Edilenler
          </h2>
          <p className="text-xl text-gray-600">
            Sık sorulan sorular ve cevapları
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-2xl overflow-hidden border transition-all duration-300 ${
                openIndex === index ? 'border-blue-200 shadow-lg' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180 bg-blue-500' : ''
                }`}>
                  <svg
                    className={`w-4 h-4 transition-colors ${openIndex === index ? 'text-white' : 'text-gray-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-48' : 'max-h-0'
              }`}>
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
    <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </div>

      {/* Floating Books */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-20 bg-white/10 rounded-lg transform rotate-12 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-20 w-12 h-16 bg-white/10 rounded-lg transform -rotate-12 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-20 w-10 h-14 bg-white/10 rounded-lg transform rotate-6 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Kayıt Dönemi Aktif
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Siparişinizi
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Hemen Verin
          </span>
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Okulunuzdan aldığınız şifreyi girin ve kitaplarınız kapınıza gelsin.
          Üyelik gerektirmez.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/siparis"
            className="group inline-flex items-center justify-center gap-3 bg-white text-blue-700 font-bold py-4 px-10 rounded-2xl hover:bg-blue-50 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Sipariş Ver
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/siparis-takip"
            className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white font-bold py-4 px-10 rounded-2xl hover:bg-white/20 transition-all border border-white/30"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Sipariş Takip
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

// ==================== FOOTER ====================
function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">
                Okul<span className="text-blue-400">Tedarigim</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed mb-6">
              Okulların belirlediği, velilerin güvenle kullandığı kurumsal kitap tedarik sistemi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-pink-500 rounded-xl flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <span>+90 549 774 71 37</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <span>destek@okultedarigim.com</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Hızlı Erişim</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/siparis-takip" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Sipariş Takip
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  KVKK Aydınlatma
                </Link>
              </li>
              <li>
                <Link href="/mesafeli-satis" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Mesafeli Satış
                </Link>
              </li>
              <li className="pt-4 border-t border-white/10">
                <Link href="/mudur/login" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                  </svg>
                  Okul Paneli
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 OkulTedarigim. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://www.mastercard.com.tr/content/dam/public/mastercardcom/eu/tr/images/mc-logo-52.svg" alt="Mastercard" className="h-8 opacity-50 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
            <img src="https://www.visa.com.tr/dam/VCOM/regional/ve/romania/blogs/hero-image/visa-logo-800x450.jpg" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
        </div>
      </div>
    </footer>
  )
}

// ==================== CHATBOT ====================
function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  const sendMessage = async (text: string) => {
    const userMessage = text.trim()
    if (!userMessage || isLoading) return

    const newCount = questionCount + 1
    setQuestionCount(newCount)
    const updatedMessages = [...messages, { role: 'user' as const, text: userMessage }]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    // Auto-resize textarea back
    if (inputRef.current) inputRef.current.style.height = '44px'

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: updatedMessages.slice(0, -1),
          questionCount: newCount
        })
      })
      const data = await response.json()
      const botText = data.response || 'Yanıt alınamadı. Lütfen tekrar deneyin.'
      setMessages(prev => [...prev, { role: 'bot', text: botText }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Bağlantı hatası. Lütfen tekrar deneyin.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize
    e.target.style.height = '44px'
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
  }

  // Page name mapping for friendly link labels
  const pageLabels: Record<string, string> = {
    '/siparis': 'Sipariş Ver',
    '/siparis-takip': 'Sipariş Takip',
    '/kvkk': 'KVKK',
    '/mesafeli-satis': 'Mesafeli Satış Sözleşmesi',
    '/mudur/login': 'Okul Paneli',
  }

  // Render bot message with simple formatting (bold, links)
  const renderBotText = (text: string) => {
    // Parse (/path) and (/path/subpath) patterns into clickable links
    const parts = text.split(/(\(\/[a-z/-]+\))/g)
    return parts.map((part, i) => {
      const linkMatch = part.match(/^\((\/[a-z/-]+)\)$/)
      if (linkMatch) {
        const path = linkMatch[1]
        const label = pageLabels[path] || path
        return (
          <a key={i} href={path} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors text-[12px] mx-0.5">
            {label}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </a>
        )
      }
      // Bold text between **
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      return boldParts.map((bp, j) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={`${i}-${j}`} className="font-semibold">{bp.slice(2, -2)}</strong>
        }
        return <span key={`${i}-${j}`}>{bp}</span>
      })
    })
  }

  const quickActions = [
    { label: 'Sipariş vermek istiyorum', icon: '🛒' },
    { label: 'Şifremi nereden alırım?', icon: '🔑' },
    { label: 'Siparişimi takip etmek istiyorum', icon: '📦' },
    { label: 'Ödeme seçenekleri neler?', icon: '💳' },
  ]

  const hasMessages = messages.length > 0

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 z-50 rounded-full shadow-2xl flex items-center transition-all duration-300 ${
          isOpen
            ? 'w-12 h-12 bg-gray-800 hover:bg-gray-700 justify-center'
            : 'h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40 hover:scale-105 px-5 gap-3'
        }`}
      >
        {isOpen ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <div className="relative">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-600" />
            </div>
            <span className="text-white text-sm font-medium hidden sm:inline">Yardım mı lazım?</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-[400px] max-w-[calc(100vw-40px)] bg-white rounded-2xl shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden"
          style={{ maxHeight: 'min(580px, calc(100vh - 120px))' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-[15px] leading-tight">Teddy</p>
              <p className="text-xs text-blue-200">OkulTedarigim Asistanı</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-[11px] text-white/90 font-medium">Aktif</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white" style={{ minHeight: '200px', maxHeight: '380px' }}>
            {/* Welcome message (always shown) */}
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                <p className="text-[13px] text-gray-800 leading-relaxed">
                  Merhaba! Ben <strong className="font-semibold">Teddy</strong>, OkulTedarigim asistanınız. Sipariş verme, takip, ödeme veya teslimat hakkında sorularınızı yanıtlayabilirim.
                </p>
              </div>
            </div>

            {/* Quick action cards when no messages yet */}
            {!hasMessages && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(action.label)}
                    disabled={isLoading}
                    className="flex items-start gap-2.5 p-3 bg-white border border-gray-150 rounded-xl text-left hover:border-blue-300 hover:bg-blue-50/50 transition-all group disabled:opacity-50"
                  >
                    <span className="text-base mt-0.5">{action.icon}</span>
                    <span className="text-[12px] text-gray-600 group-hover:text-blue-700 leading-snug font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Conversation messages */}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2.5'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-md'
                    : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-2xl rounded-tl-md'
                }`}>
                  {msg.role === 'bot' ? renderBotText(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (shown after conversation starts) */}
          {hasMessages && !isLoading && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/80 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                {['Sipariş nasıl verilir?', 'Kargo takibi', 'İade/iptal', 'Destek hattı'].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="flex-shrink-0 text-[11px] bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-700 px-3 py-1.5 rounded-lg transition-all font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none py-2 leading-snug"
                style={{ height: '44px', maxHeight: '100px' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg flex items-center justify-center transition-all shrink-0 mb-0.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">Teddy yapay zeka desteklidir. Dogrulugu garanti edilmez.</p>
          </div>
        </div>
      )}
    </>
  )
}
