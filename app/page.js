'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateStructuredData } from '@/lib/metadata'
import { useLanguage } from '@/lib/LanguageContext'

// Scroll animation hook
function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return scrollY
}

// Intersection Observer hook for fade-in animations
function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, ...options })
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  
  return [ref, isInView]
}

// Newsletter Form Component
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useLanguage()

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!email || !email.includes('@')) {
      setMessage(t('footer.emailError'))
      return
    }

    try {
      setLoading(true)

      // Supabase'e ekle
      const { error } = await supabase
        .from('newsletter_aboneler')
        .insert([{ email, aktif: true }])

      if (error) {
        if (error.code === '23505') {
          setMessage(t('footer.emailExists'))
        } else {
          throw error
        }
      } else {
        setMessage(t('footer.subscribeSuccess'))
        setEmail('')
        setTimeout(() => setMessage(''), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubscribe} className="flex gap-3 flex-col sm:flex-row bg-white/10 backdrop-blur-sm p-1 rounded-full border border-white/20 hover:border-white/40 transition-all">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.emailPlaceholder')}
          className="flex-1 px-6 py-4 border-0 outline-none bg-transparent text-white placeholder-white/60 text-sm rounded-full"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-white text-cyan-600 hover:bg-cyan-50 transition text-xs tracking-[0.2em] uppercase font-bold shadow-lg hover:shadow-xl rounded-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('common.loading') : t('footer.subscribe')}
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-4 font-medium transition-opacity ${
          message.includes('✅') ? 'text-green-200' : 
          message.includes('⚠️') ? 'text-yellow-200' : 
          'text-red-200'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, toggleLanguage, t } = useLanguage()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrollY = useScrollAnimation()

  // ✅ Structured Data for SEO
  const structuredData = generateStructuredData('home')

  // ✅ Premium navbar scroll effect
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Booking states
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const [checking, setChecking] = useState(false)
  const [availabilityMsg, setAvailabilityMsg] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]

  const handleCheckAvailability = async () => {
    setAvailabilityMsg('')

    if (!checkIn || !checkOut) {
      setAvailabilityMsg(
        language === 'TR' ? '⚠️ Lütfen giriş ve çıkış tarihini seçin.' : '⚠️ Please select check-in and check-out dates.'
      )
      return
    }

    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)

    if (outDate <= inDate) {
      setAvailabilityMsg(
        language === 'TR'
          ? '⚠️ Çıkış tarihi giriş tarihinden sonra olmalıdır.'
          : '⚠️ Check-out must be after check-in.'
      )
      return
    }

    try {
      setChecking(true)
      
      // Supabase'den rezervasyonları kontrol et
      const { data: existingReservations } = await supabase
        .from('rezervasyonlar')
        .select('*')
        .eq('durum', 'onaylandı')
        .or(`and(giris_tarihi.lte.${checkOut},cikis_tarihi.gte.${checkIn})`)

      await new Promise((r) => setTimeout(r, 500))

      if (existingReservations && existingReservations.length > 0) {
        // Müsait değil
        setAvailabilityMsg(
          language === 'TR'
            ? '❌ Üzgünüz, seçtiğiniz tarihler için rezervasyon mevcut.'
            : '❌ Sorry, selected dates are not available.'
        )
      } else {
        // Müsait!
        setAvailabilityMsg(
          language === 'TR'
            ? '✅ Harika! Seçtiğiniz tarihler müsait.'
            : '✅ Great! Selected dates are available.'
        )
      }
    } catch (error) {
      console.error('Availability check error:', error)
      setAvailabilityMsg(
        language === 'TR'
          ? '⚠️ Kontrol sırasında bir hata oluştu. Lütfen tekrar deneyin.'
          : '⚠️ An error occurred. Please try again.'
      )
    } finally {
      setChecking(false)
    }
  }

  // ✅ ÇALIŞAN SUPABASE URL
  const heroImage = useMemo(() => {
    return 'https://uvadqixzovxsjrzjayom.supabase.co/storage/v1/object/public/mainpage/h4-rev-img-1-1536x864.jpg?w=1920&h=1080&fit=crop'
  }, [])

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

  // Navigation links
  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.gallery'), href: '/galeri' },
    { label: t('nav.features'), href: '/ozellikler' },
    { label: t('nav.reviews'), href: '/yorumlar' },
    { label: t('nav.contact'), href: '/iletisim' }
  ]

  // Home features array
  const homeFeatures = [
    { icon: '🛏️', title: t('homeFeatures.bed.title'), desc: t('homeFeatures.bed.desc') },
    { icon: '📶', title: t('homeFeatures.wifi.title'), desc: t('homeFeatures.wifi.desc') },
    { icon: '🔒', title: t('homeFeatures.safe.title'), desc: t('homeFeatures.safe.desc') },
    { icon: '🛁', title: t('homeFeatures.bath.title'), desc: t('homeFeatures.bath.desc') },
    { icon: '🤾', title: t('homeFeatures.exercise.title'), desc: t('homeFeatures.exercise.desc') },
    { icon: '🍷', title: t('homeFeatures.drinks.title'), desc: t('homeFeatures.drinks.desc') }
  ]

  const goReservationWithQS = () => {
    const qs = new URLSearchParams({
      giris: checkIn,
      cikis: checkOut,
      yetiskin: String(adults),
      cocuk: String(children)
    }).toString()
    router.push(`/rezervasyon?${qs}`)
  }

  /**
   * ✅ HERO TYPOGRAPHY OPTIONS
   * classic: Alloggio benzeri daha romantik, serif ağırlıklı
   * modern : daha modern / premium editorial hissi
   */
  const HERO_VARIANT = 'classic' // 'classic' | 'modern'

  const heroTitleClass =
    HERO_VARIANT === 'classic'
      ? 'text-4xl md:text-5xl lg:text-6xl font-serif'
      : 'text-4xl md:text-6xl lg:text-7xl font-serif tracking-[0.01em]'

  const heroSubtitleClass =
    HERO_VARIANT === 'classic'
      ? 'text-base md:text-lg font-medium text-white/95 tracking-wide'
      : 'text-sm md:text-base font-semibold text-white/90 tracking-[0.24em] uppercase'

  return (
    <>
      {/* SEO: Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* TOP NAVBAR (Premium Scroll) */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'py-2' : 'py-0'
        ].join(' ')}
      >
        <div className="px-5 md:px-10">
          <div
            className={[
              'relative rounded-2xl border backdrop-blur-md transition-all duration-300',
              isScrolled ? 'border-white/20 bg-black/55 shadow-2xl' : 'border-white/15 bg-black/20 shadow-lg'
            ].join(' ')}
          >
            {/* subtle highlight */}
            <div
              className={[
                'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent transition-opacity duration-300',
                isScrolled ? 'opacity-100' : 'opacity-0'
              ].join(' ')}
            />
            <div
              className={[
                'relative flex items-center justify-between transition-all duration-300',
                isScrolled ? 'px-5 md:px-8 py-3' : 'px-5 md:px-8 py-4'
              ].join(' ')}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span
                  className={[
                    'font-serif text-white tracking-wide transition-all duration-300',
                    isScrolled ? 'text-base md:text-lg' : 'text-lg md:text-xl'
                  ].join(' ')}
                  style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                >
                  Serenity
                </span>
                <span
                  className={[
                    'hidden md:inline text-[10px] tracking-[0.35em] uppercase transition-all duration-300',
                    isScrolled ? 'text-cyan-100/90 text-[10px]' : 'text-cyan-200/90 text-[11px]'
                  ].join(' ')}
                >
                  ISKELE
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      'relative text-[12px] md:text-[13px] tracking-[0.18em] uppercase font-medium transition',
                      isActive(link.href) ? 'text-cyan-200' : 'text-white/85 hover:text-white'
                    ].join(' ')}
                  >
                    {link.label}
                    <span
                      className={[
                        'absolute left-0 -bottom-2 h-[2px] bg-cyan-200 rounded-full transition-all duration-300',
                        isActive(link.href) ? 'w-full opacity-100' : 'w-0 opacity-0 hover:w-full hover:opacity-100'
                      ].join(' ')}
                    />
                  </Link>
                ))}
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-3">
                {/* Language (bigger) */}
                <div
                  className={[
                    'hidden sm:flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-300',
                    isScrolled ? 'border border-white/20 bg-white/5' : 'border border-white/15 bg-white/0'
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className={`text-[13px] tracking-[0.18em] uppercase font-medium transition ${
                      language === 'tr' ? 'text-cyan-200' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {language === 'tr' ? 'TR' : 'EN'}
                  </button>
                </div>

                {/* CTA (bigger) */}
                <Link
                  href="/rezervasyon"
                  className={[
                    'hidden md:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
                    'text-[14px] tracking-[0.22em] uppercase font-semibold shadow-lg hover:shadow-xl transition',
                    isScrolled ? 'px-5 py-2.5' : 'px-6 py-3',
                    'hover:from-cyan-600 hover:to-blue-700'
                  ].join(' ')}
                >
                  {t('nav.reservation')}
                </Link>

                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className={[
                    'lg:hidden inline-flex w-10 h-10 items-center justify-center rounded-full transition',
                    isScrolled
                      ? 'border border-white/20 bg-white/10 hover:bg-white/15'
                      : 'border border-white/15 bg-white/5 hover:bg-white/10'
                  ].join(' ')}
                  aria-label="Open menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-[#0b0f17] border-l border-white/10 p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-white text-2xl" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                Serenity
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={toggleLanguage}
                className={`px-4 py-2 rounded-full border text-[13px] tracking-[0.18em] uppercase font-medium transition ${
                  language === 'tr' ? 'border-cyan-300/40 text-cyan-200 bg-white/5' : 'border-white/15 text-white/70 hover:text-white'
                }`}
              >
                {language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-[14px] tracking-[0.18em] uppercase font-medium transition ${
                    isActive(link.href) ? 'bg-white/10 text-cyan-200' : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              <Link
                href="/rezervasyon"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[14px] tracking-[0.22em] uppercase font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700 transition"
              >
                {t('nav.reservation')}
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* MAIN */}
      <main>
        {/* HERO */}
        <section className="relative h-screen overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <img
              src={heroImage}
              alt="Serenity Iskele"
              className="w-full h-full object-cover scale-110"
              onError={(e) => {
                console.log('Hero image failed to load:', heroImage)
                e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600'
              }}
            />
            {/* ✅ Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
          </div>

          {/* ✅ HERO TEXT with fade-in animation */}
          <div className="relative z-10 h-full flex items-center justify-center px-4 text-center -mt-6">
            <div 
              className="px-6 py-5 md:px-10 md:py-7 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 shadow-2xl animate-fadeInUp"
              style={{
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              <h1
                className={`${heroTitleClass} mb-3 text-white animate-fadeIn`}
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontWeight: HERO_VARIANT === 'modern' ? 400 : 300,
                  letterSpacing: HERO_VARIANT === 'modern' ? '0.01em' : '0.02em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  animation: 'fadeIn 1.2s ease-out'
                }}
              >
                {t('hero.title')}
              </h1>

              <p
                className={`${heroSubtitleClass} animate-fadeIn`}
                style={{
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  animation: 'fadeIn 1.4s ease-out'
                }}
              >
                {t('hero.subtitle')}
              </p>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 md:pb-12 px-4">
            <div className="max-w-7xl mx-auto rounded-3xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
                {/* Giriş Tarihi */}
                <div className="border-r border-gray-200 p-6 md:p-8 flex flex-col justify-between min-h-[140px] lg:border-r">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3 font-semibold">
                    {t('reservation.checkIn')}
                  </label>
                  <div className="flex-1 flex items-center">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={todayStr}
                      className="w-full text-lg md:text-xl text-gray-900 font-light border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none bg-transparent transition py-2"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 font-light">mm/dd/yyyy</p>
                </div>

                {/* Çıkış Tarihi */}
                <div className="border-r border-gray-200 p-6 md:p-8 flex flex-col justify-between min-h-[140px]">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3 font-semibold">
                    {t('reservation.checkOut')}
                  </label>
                  <div className="flex-1 flex items-center">
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || todayStr}
                      className="w-full text-lg md:text-xl text-gray-900 font-light border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none bg-transparent transition py-2"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 font-light">mm/dd/yyyy</p>
                </div>

                {/* Yetişkinler */}
                <div className="border-r border-gray-200 p-6 md:p-8 flex flex-col justify-between min-h-[140px]">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3 font-semibold">
                    {t('hero.guests')}
                  </label>
                  <div className="flex-1 flex items-center">
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full text-lg md:text-xl text-gray-900 font-light border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none bg-transparent transition py-2 appearance-none cursor-pointer pr-4"
                    >
                      <option value={1}>1 {language === 'tr' ? 'Kişi' : 'Guest'}</option>
                      <option value={2}>2 {language === 'tr' ? 'Kişi' : 'Guests'}</option>
                      <option value={3}>3 {language === 'tr' ? 'Kişi' : 'Guests'}</option>
                      <option value={4}>4 {language === 'tr' ? 'Kişi' : 'Guests'}</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 font-light invisible">placeholder</p>
                </div>

                {/* Çocuklar */}
                <div className="border-r border-gray-200 p-6 md:p-8 flex flex-col justify-between min-h-[140px] lg:border-r-0">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3 font-semibold">
                    {t('hero.guests')}
                  </label>
                  <div className="flex-1 flex items-center">
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full text-lg md:text-xl text-gray-900 font-light border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none bg-transparent transition py-2 appearance-none cursor-pointer pr-4"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 font-light invisible">placeholder</p>
                </div>

                {/* Button */}
                <div className="p-6 md:p-8 flex items-center justify-center lg:border-l border-gray-200 min-h-[140px]">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={checking}
                    className="w-full h-full px-8 py-4 md:py-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all text-[12px] md:text-[13px] tracking-[0.2em] uppercase font-bold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 duration-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {checking ? t('common.loading') : t('reservation.submit')}
                    </div>
                  </button>
                </div>
              </div>

              {availabilityMsg && (
                <div className="px-5 md:px-6 pb-6">
                  <div className={`p-4 rounded-xl border-2 ${
                    availabilityMsg.includes('✅') 
                      ? 'bg-green-50 border-green-300 text-green-800' 
                      : availabilityMsg.includes('❌')
                      ? 'bg-red-50 border-red-300 text-red-800'
                      : 'bg-yellow-50 border-yellow-300 text-yellow-800'
                  }`}>
                    <p className="text-sm md:text-base font-medium text-center">{availabilityMsg}</p>
                  </div>

                  {availabilityMsg.includes('✅') && checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
                    <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={goReservationWithQS}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all text-[11px] tracking-[0.2em] uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                      >
                        {language === 'TR' ? '📝 Rezervasyon Yap' : '📝 Make Reservation'}
                      </button>
                    </div>
                  )}

                  {availabilityMsg.includes('❌') && (
                    <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                      <a
                        href="https://wa.me/905301234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all text-[11px] tracking-[0.15em] uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {language === 'TR' ? 'WhatsApp ile Sor' : 'Ask on WhatsApp'}
                      </a>
                      <a
                        href="/iletisim"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all text-[11px] tracking-[0.15em] uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {language === 'TR' ? 'İletişim Formu' : 'Contact Form'}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* WELCOME */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4 font-light">{t('hero.welcomeBadge')}</p>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                {t('hero.welcomeTitle')}
              </h2>
              <div className="w-12 h-[1px] bg-gray-400 mx-auto mb-8" />
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">{t('hero.welcomeDesc')}</p>
            </div>
          </div>
        </section>

        {/* FEATURES - Modern Overlay Style */}
        <section className="relative py-0">
          <div className="absolute inset-0 z-0">
            <img
              src="https://uvadqixzovxsjrzjayom.supabase.co/storage/v1/object/public/mainpage/h4-rev-img-2-1536x864.jpg"
              alt="Modern Interior"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1631049307038-da5ec5d27288?w=1920&h=1080&fit=crop"
              }}
            />
            <div className="absolute inset-0 bg-black/25"></div>
          </div>

          <div className="relative z-10 py-20 md:py-32 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
                  {homeFeatures.map((feature, i) => (
                    <div 
                      key={i} 
                      className="flex flex-col items-center text-center group cursor-pointer"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
                      }}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 md:mb-6 transition-all group-hover:scale-125 group-hover:-translate-y-3 duration-500 ease-out">
                        <span className="text-4xl filter drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500">{feature.icon}</span>
                      </div>
                      <h3 className="text-sm md:text-base tracking-[0.15em] uppercase text-gray-900 mb-2 font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY & ABOUT */}
        <section className="py-0 bg-white">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[600px] lg:min-h-[750px]">
            <div className="relative overflow-hidden bg-gray-200 order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=900&fit=crop"
                alt="Gallery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
              <div className="absolute left-6 md:left-10 lg:left-12 top-1/2 -translate-y-1/2">
                <div className="bg-white px-8 md:px-12 lg:px-16 py-12 md:py-16 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/90 hover:shadow-3xl transition-shadow duration-300">
                  <div className="text-cyan-600 text-sm tracking-[0.2em] uppercase font-bold mb-4">Keşfet</div>
                  <h3
                    className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8 font-light"
                    style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  >
                    {language === 'TR' ? 'Galeri' : 'Gallery'}
                  </h3>
                  <Link
                    href="/galeri"
                    className="inline-flex items-center gap-3 text-[12px] tracking-[0.3em] uppercase text-gray-900 hover:text-cyan-600 font-bold transition group"
                  >
                    {language === 'TR' ? 'Daha Fazla' : 'Read More'} 
                    <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-cyan-50 p-8 md:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
              <div className="relative z-10 max-w-lg">
                <div className="text-cyan-600 text-sm tracking-[0.2em] uppercase font-bold mb-6">Serenity Iskele</div>
                <h3
                  className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-10 font-light leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                >
                  {language === 'TR' ? 'Hakkımızda' : 'About Us'}
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-8"></div>
                <p className="text-[15px] md:text-[16px] leading-relaxed text-gray-700 font-light mb-10">
                  {language === 'TR'
                    ? "Denize yakın konumunun huzurlu atmosferi ve modern konforu bir araya getirir. Her misafirimiz için unutulmaz bir deneyim yaratmayı amaçlıyoruz."
                    : "Located close to the sea, combining serene atmosphere with modern comfort. We aim to create an unforgettable experience for every guest."}
                </p>
                <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-300">
                  <div>
                    <div className="text-4xl md:text-5xl font-light text-cyan-600 mb-3">5+</div>
                    <p className="text-xs tracking-[0.15em] uppercase text-gray-600 font-semibold">
                      {language === 'TR' ? 'Yıl Deneyim' : 'Years Experience'}
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-light text-blue-600 mb-3">500+</div>
                    <p className="text-xs tracking-[0.15em] uppercase text-gray-600 font-semibold">
                      {language === 'TR' ? 'Memnun Konuk' : 'Happy Guests'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="relative py-24 overflow-hidden min-h-[450px]">
          <div className="absolute inset-0 z-0">
            <img
              src="https://uvadqixzovxsjrzjayom.supabase.co/storage/v1/object/public/mainpage/h4-rev-bg-img-3-1536x864.jpg"
              alt="Interior Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-12 md:p-16 border border-white/80">
                <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                  {t('testimonial.title')}
                </h3>
                <p className="text-lg md:text-xl text-gray-700 font-light leading-relaxed mb-12 text-center italic">
                  {t('testimonial.text')}
                </p>
                <div className="text-center">
                  <p className="text-sm md:text-base tracking-[0.15em] uppercase text-gray-900 font-semibold">
                    {t('testimonial.author')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="relative py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
              {t('footer.newsletter')}
            </h3>
            <p className="text-cyan-100 mb-10 text-lg">{t('footer.newsletterText')}</p>
            <div className="max-w-2xl mx-auto">
              <NewsletterForm language={language} />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
              <div>
                <h4 className="text-cyan-400 uppercase tracking-widest mb-6">Serenity Iskele</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{t('footer.aboutDesc')}</p>
              </div>
              <div>
                <h4 className="text-cyan-400 uppercase tracking-widest mb-6">{t('contact.title')}</h4>
                <p className="text-gray-400 text-sm">İskele, KKTC</p>
                <p className="text-gray-400 text-sm mt-2">+90 533 123 45 67</p>
              </div>
              <div>
                <h4 className="text-cyan-400 uppercase tracking-widest mb-6">{t('footer.followUs')}</h4>
                <div className="flex justify-center md:justify-start gap-4">
                  <Link href="#" className="hover:text-cyan-400 transition">Instagram</Link>
                  <Link href="#" className="hover:text-cyan-400 transition">Facebook</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
              {t('footer.copyright')}
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        
        @keyframes fadeIn {
          from { 
            opacity: 0;
          }
          to { 
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from { 
            opacity: 0;
            transform: translateY(-30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
      `}</style>
    </>
  )
}