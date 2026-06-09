'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search, Menu, X, ChevronRight, ChevronDown, MapPin, Phone, Mail, Clock,
  Send, BedDouble, Wifi, ShieldCheck, Bath, Dumbbell, Wine, Quote, Sparkles,
  Languages, MessageCircle, Sun, UtensilsCrossed, Anchor, ArrowUpRight,
  Waves, Plane, Maximize2, Snowflake, Tv,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { generateStructuredData } from '@/lib/metadata'
import { useLanguage } from '@/lib/LanguageContext'
import DatePickerTR from './components/DatePickerTR'

/* Brand icons (Instagram/Facebook removed from lucide for trademark reasons) */
const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
  </svg>
)
const IconFacebook = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */
function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return scrollY
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const compute = () => {
      const h = document.documentElement
      const total = h.scrollHeight - h.clientHeight
      const p = total > 0 ? (h.scrollTop / total) * 100 : 0
      setProgress(Math.min(100, Math.max(0, p)))
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])
  return progress
}

function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); obs.disconnect() }
    }, { threshold: 0.15, ...options })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, isInView]
}

/* ------------------------------------------------------------------ */
/* Small ornamental components                                         */
/* ------------------------------------------------------------------ */
function GoldDivider({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="block h-px w-10 bg-gold-500/60" />
      <span className="block h-1.5 w-1.5 rotate-45 bg-gold-500" />
      <span className="block h-px w-10 bg-gold-500/60" />
    </div>
  )
}

function Eyebrow({ children, tone = 'gold', className = '' }) {
  const color = tone === 'cream' ? 'text-gold-300' : 'text-gold-600'
  return (
    <p className={`text-[11px] tracking-[0.32em] uppercase font-medium ${color} ${className}`}>
      {children}
    </p>
  )
}

/**
 * ChapterMarker — "01 · WELCOME" magazine treatment
 * Vertical orientation on desktop, horizontal on mobile.
 */
function ChapterMarker({ label, tone = 'gold' }) {
  const color = tone === 'cream' ? 'text-gold-300' : 'text-gold-600'
  return (
    <div className={`inline-flex items-center gap-3 ${color}`}>
      <span className="block h-px w-8 bg-current opacity-50" />
      <span className="text-[10px] tracking-[0.32em] uppercase font-medium">{label}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Newsletter form                                                     */
/* ------------------------------------------------------------------ */
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
      const { error } = await supabase
        .from('newsletter_aboneler')
        .insert([{ email, aktif: true }])
      if (error) {
        if (error.code === '23505') setMessage(t('footer.emailExists'))
        else throw error
      } else {
        setMessage(t('footer.subscribeSuccess'))
        setEmail('')
        setTimeout(() => setMessage(''), 5000)
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubscribe}
        className="flex gap-2 flex-col sm:flex-row bg-cream/10 backdrop-blur-md p-1.5 rounded-full border border-gold-300/30 hover:border-gold-300/60 transition-all"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.emailPlaceholder')}
          className="flex-1 px-6 py-3.5 border-0 outline-none bg-transparent text-cream placeholder-cream/60 text-sm rounded-full"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="group px-7 py-3.5 bg-gold-500 text-sea-900 hover:bg-gold-300 transition text-[11px] tracking-[0.28em] uppercase font-semibold shadow-md rounded-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {loading ? t('common.loading') : t('footer.subscribe')}
          <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-4 font-medium transition-opacity ${
          message.includes('✅') ? 'text-emerald-200' :
          message.includes('⚠️') ? 'text-gold-200' :
          'text-rose-200'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */
export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, toggleLanguage, t } = useLanguage()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrollY = useScrollAnimation()
  const scrollProgress = useScrollProgress()
  const structuredData = generateStructuredData('home')
  const tr = language === 'tr'

  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Galeri slot foto'ları — atanmış foto'lar admin'den seçilir, yoksa public fallback */
  const SLOT_FALLBACKS = {
    hero:          '/salon.png',
    karsilama:     '/living.png',
    konfor_bg:     '/h4-rev-img-2-1536x864.jpg',
    yatak_odasi:   '/yatak_odasi.png',
    suite_detay:   '/main_bedroom1.png',
    cocuk_odasi:   '/kids_bedroom.png',
    manzara_bg:    '/h4-rev-img-3-1536x864.jpg',
    hakkimizda_bg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=900&fit=crop',
  }
  const [slotImages, setSlotImages] = useState(SLOT_FALLBACKS)
  useEffect(() => {
    let cancelled = false
    const loadSlots = async () => {
      try {
        const { data } = await supabase
          .from('galeri')
          .select('kullanim_yerleri, image_url, sira')
          .not('kullanim_yerleri', 'is', null)
          .eq('aktif', true)
          .order('sira', { ascending: true })
        if (cancelled || !data) return
        const next = { ...SLOT_FALLBACKS }
        const claimed = new Set()
        data.forEach(row => {
          ;(row.kullanim_yerleri || []).forEach(slot => {
            if (!claimed.has(slot) && row.image_url) {
              next[slot] = row.image_url
              claimed.add(slot)
            }
          })
        })
        setSlotImages(next)
      } catch (e) { console.warn('Slot foto:', e) }
    }
    loadSlots()
    return () => { cancelled = true }
  }, [])

  // Booking states
  const bookingRef = useRef(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [checking, setChecking] = useState(false)
  const [availabilityMsg, setAvailabilityMsg] = useState('')
  const todayStr = new Date().toISOString().split('T')[0]

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleCheckAvailability = async () => {
    setAvailabilityMsg('')
    if (!checkIn || !checkOut) {
      setAvailabilityMsg(tr ? '⚠️ Lütfen giriş ve çıkış tarihini seçin.' : '⚠️ Please select check-in and check-out dates.')
      return
    }
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    if (outDate <= inDate) {
      setAvailabilityMsg(tr ? '⚠️ Çıkış tarihi giriş tarihinden sonra olmalıdır.' : '⚠️ Check-out must be after check-in.')
      return
    }
    try {
      setChecking(true)
      const { data: existing } = await supabase
        .from('rezervasyonlar')
        .select('*')
        .eq('durum', 'onaylandı')
        .or(`and(giris_tarihi.lte.${checkOut},cikis_tarihi.gte.${checkIn})`)
      await new Promise((r) => setTimeout(r, 500))
      if (existing && existing.length > 0) {
        setAvailabilityMsg(tr ? '❌ Üzgünüz, seçtiğiniz tarihler için rezervasyon mevcut.' : '❌ Sorry, selected dates are not available.')
      } else {
        setAvailabilityMsg(tr ? '✅ Harika! Seçtiğiniz tarihler müsait.' : '✅ Great! Selected dates are available.')
      }
    } catch (err) {
      console.error('Availability check error:', err)
      setAvailabilityMsg(tr ? '⚠️ Kontrol sırasında bir hata oluştu. Lütfen tekrar deneyin.' : '⚠️ An error occurred. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const heroImage = slotImages.hero

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.gallery'), href: '/galeri' },
    { label: t('nav.features'), href: '/ozellikler' },
    { label: t('nav.reviews'), href: '/yorumlar' },
    { label: t('nav.contact'), href: '/iletisim' },
  ]

  /* Bento-style stay privileges */
  const homeFeatures = [
    { Icon: BedDouble,   title: t('homeFeatures.bed.title'),      desc: t('homeFeatures.bed.desc'),      span: 'md:col-span-2' },
    { Icon: Wifi,        title: t('homeFeatures.wifi.title'),     desc: t('homeFeatures.wifi.desc'),     span: '' },
    { Icon: ShieldCheck, title: t('homeFeatures.safe.title'),     desc: t('homeFeatures.safe.desc'),     span: '' },
    { Icon: Bath,        title: t('homeFeatures.bath.title'),     desc: t('homeFeatures.bath.desc'),     span: '' },
    { Icon: Dumbbell,    title: t('homeFeatures.exercise.title'), desc: t('homeFeatures.exercise.desc'), span: '' },
    { Icon: Wine,        title: t('homeFeatures.drinks.title'),   desc: t('homeFeatures.drinks.desc'),   span: 'md:col-span-2' },
  ]

  /* Marquee strip phrases */
  const marqueePhrases = tr
    ? ['İskele · KKTC', 'Long Beach 2 dk', 'Marina 5 dk', 'Ercan 35 dk', '75 m² · 2+1', 'Anlık Müsaitlik']
    : ['Iskele · TRNC', 'Long Beach 2 min', 'Marina 5 min', 'Ercan 35 min', '75 m² · 2+1', 'Live Availability']

  /* Experiences cards */
  const experiences = [
    {
      Icon: Sun,
      tag: tr ? 'Sahil' : 'Coast',
      title: tr ? 'Altın Kumlu Plajlar' : 'Golden Sandy Beaches',
      desc: tr
        ? 'Yürüme mesafesinde Akdeniz\'in en sakin koylarına ulaşın.'
        : 'Walk to the calmest bays of the Mediterranean within minutes.',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=1100&fit=crop',
    },
    {
      Icon: UtensilsCrossed,
      tag: tr ? 'Lezzet' : 'Taste',
      title: tr ? 'Sahil Lokantaları' : 'Seaside Tables',
      desc: tr
        ? 'Yerel meze, taze deniz mahsulleri ve Akdeniz mutfağının zarif yorumları.'
        : 'Local mezze, fresh seafood and refined Mediterranean cuisine.',
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=1100&fit=crop',
    },
    {
      Icon: Anchor,
      tag: tr ? 'Macera' : 'Adventure',
      title: tr ? 'Tekne & Dalış' : 'Yacht & Diving',
      desc: tr
        ? 'Özel tekne turları, gün batımı yelken ve berrak sularda dalış.'
        : 'Private boat tours, sunset sailing and diving in crystal waters.',
      img: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=900&h=1100&fit=crop',
    },
  ]

  const goReservationWithQS = () => {
    const qs = new URLSearchParams({
      giris: checkIn, cikis: checkOut, yetiskin: String(adults), cocuk: String(children),
    }).toString()
    router.push(`/rezervasyon?${qs}`)
  }

  return (
    <>
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* =========================================================== */}
      {/* TOP SCROLL PROGRESS BAR                                      */}
      {/* =========================================================== */}
      <div className="fixed top-0 left-0 right-0 z-[55] h-[2px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 shadow-[0_0_8px_rgba(201,169,97,0.6)] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* =========================================================== */}
      {/* NAVBAR                                                       */}
      {/* =========================================================== */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled ? 'pt-3' : 'pt-4',
        ].join(' ')}
      >
        <div className="px-4 md:px-8">
          <div
            className={[
              'relative rounded-full border backdrop-blur-xl transition-all duration-500',
              isScrolled
                ? 'border-gold-300/25 bg-sea-900/75 shadow-[0_8px_40px_rgba(19,64,59,0.4)]'
                : 'border-cream/15 bg-sea-900/25 shadow-lg',
            ].join(' ')}
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-cream/8 to-transparent opacity-60" />

            <div
              className={[
                'relative flex items-center justify-between transition-all duration-500',
                isScrolled ? 'px-5 md:px-7 py-2.5' : 'px-5 md:px-7 py-3',
              ].join(' ')}
            >
              {/* Logo */}
              <Link href="/" className="shrink-0">
                <Image
                  src="/serenity_logo.png"
                  alt="Serenity İskele"
                  width={400}
                  height={160}
                  className={`object-contain transition-all duration-500 ${isScrolled ? 'h-9' : 'h-11'} w-auto`}
                  priority
                />
              </Link>

              <nav className="hidden lg:flex items-center gap-9">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      'relative text-[12px] tracking-[0.22em] uppercase font-medium transition-colors',
                      isActive(link.href) ? 'text-gold-300' : 'text-cream/85 hover:text-gold-300',
                    ].join(' ')}
                  >
                    {link.label}
                    <span
                      className={[
                        'absolute left-0 -bottom-2 h-px bg-gold-500 transition-all duration-300',
                        isActive(link.href) ? 'w-full opacity-100' : 'w-0 opacity-0',
                      ].join(' ')}
                    />
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold-300/25 bg-cream/5 px-3.5 py-2 text-[12px] tracking-[0.2em] uppercase font-medium text-cream hover:text-gold-300 hover:border-gold-300/50 transition"
                  aria-label="Toggle language"
                >
                  <Languages className="w-3.5 h-3.5" />
                  {language === 'tr' ? 'TR' : 'EN'}
                </button>

                <Link
                  href="/rezervasyon"
                  className={[
                    'hidden md:inline-flex items-center justify-center gap-2 rounded-full',
                    'bg-gold-500 hover:bg-gold-300 text-sea-900',
                    'text-[12px] tracking-[0.26em] uppercase font-semibold shadow-[0_8px_24px_rgba(201,169,97,0.35)] hover:shadow-[0_10px_28px_rgba(201,169,97,0.55)] transition-all',
                    isScrolled ? 'px-5 py-2.5' : 'px-6 py-3',
                  ].join(' ')}
                >
                  {t('nav.reservation')}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden inline-flex w-10 h-10 items-center justify-center rounded-full border border-gold-300/25 bg-cream/5 hover:bg-cream/10 transition"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-cream" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-sea-900/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-sea-900 border-l border-gold-300/15 p-6">
            <div className="flex items-center justify-between mb-10">
              <Image
                src="/serenity_logo.png"
                alt="Serenity İskele"
                width={160}
                height={64}
                className="h-12 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-gold-300/25 bg-cream/5 hover:bg-cream/10 transition flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-cream" />
              </button>
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-300/30 px-4 py-2 text-[12px] tracking-[0.22em] uppercase font-medium text-cream"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === 'tr' ? 'Türkçe' : 'English'}
            </button>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3.5 rounded-xl text-[13px] tracking-[0.22em] uppercase font-medium transition ${
                    isActive(link.href)
                      ? 'bg-gold-500/10 text-gold-300 border-l-2 border-gold-500'
                      : 'text-cream/85 hover:bg-cream/5 hover:text-gold-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-10">
              <Link
                href="/rezervasyon"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gold-500 text-sea-900 text-[12px] tracking-[0.28em] uppercase font-semibold shadow-lg hover:bg-gold-300 transition"
              >
                {t('nav.reservation')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* =========================================================== */}
      {/* SIDE RESERVATION TAB (left edge, appears after scroll)        */}
      {/* =========================================================== */}
      <button
        type="button"
        onClick={scrollToBooking}
        aria-label="Müsaitlik sorgula"
        className={[
          'fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-2',
          'bg-gold-500 hover:bg-gold-300 text-sea-900 font-semibold',
          'pl-2 pr-3 py-5 rounded-r-xl shadow-[0_10px_30px_rgba(19,64,59,0.3)]',
          'transition-all duration-500',
          isScrolled ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none',
        ].join(' ')}
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <Search className="w-3.5 h-3.5 -rotate-90" />
        <span className="text-[11px] tracking-[0.32em] uppercase">
          {tr ? 'Müsaitlik' : 'Availability'}
        </span>
      </button>

      {/* =========================================================== */}
      {/* MAIN                                                         */}
      {/* =========================================================== */}
      <main className="bg-cream">
        {/* =========================================================== */}
        {/* HERO — editorial bottom-left                                 */}
        {/* =========================================================== */}
        <section className="relative h-screen min-h-[720px] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ transform: `translateY(${scrollY * 0.35}px)`, transition: 'transform 0.1s ease-out' }}
          >
            <img
              src={heroImage}
              alt="Serenity Iskele"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 35%' }}
            />
            {/* Tight top vignette — only top 18% dims for chapter marker */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(19,64,59,0.32) 0%, transparent 18%)' }}
            />
            {/* Tight bottom vignette — only bottom 42% dims for title + widget */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(19,64,59,0.78) 0%, rgba(19,64,59,0.35) 22%, transparent 42%)',
              }}
            />
          </div>

          {/* Chapter marker top-left */}
          <div className="absolute top-32 md:top-36 left-6 md:left-12 z-10 animate-fadeIn animation-delay-200">
            <ChapterMarker number="00" label={tr ? 'Hoşgeldiniz' : 'Welcome'} tone="cream" />
          </div>

          {/* Vertical scroll indicator right edge */}
          <div className="hidden md:flex absolute right-8 bottom-72 z-10 flex-col items-center gap-3 text-cream/70 animate-fadeIn animation-delay-600">
            <span
              className="text-[10px] tracking-[0.4em] uppercase font-medium"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {tr ? 'Aşağı kaydır' : 'Scroll down'}
            </span>
            <span className="block h-12 w-px bg-gradient-to-b from-gold-300 to-transparent animate-pulse" />
            <ChevronDown className="w-4 h-4 text-gold-300 animate-float" />
          </div>

          {/* Hero copy — bottom-left editorial */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-56 md:pb-72 px-6 md:px-14">
            <div className="max-w-3xl">
              <Eyebrow tone="cream" className="mb-5 animate-fadeIn animation-delay-200">
                {tr ? 'Boutique Marina · İskele, KKTC' : 'Boutique Marina · Iskele, TRNC'}
              </Eyebrow>

              <h1
                className="font-display text-cream text-6xl md:text-8xl lg:text-[7rem] leading-[0.95] font-light animate-fadeInUp"
                style={{ textShadow: '0 4px 30px rgba(19,64,59,0.55)' }}
              >
                {t('hero.title')}
              </h1>

              <div className="mt-8 flex items-center gap-5 animate-fadeIn animation-delay-400">
                <span className="block h-px w-16 bg-gold-500" />
                <p
                  className="max-w-md text-cream/90 text-base md:text-lg font-light leading-relaxed"
                  style={{ textShadow: '0 2px 12px rgba(19,64,59,0.55)' }}
                >
                  {t('hero.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Booking widget anchored to bottom */}
          <div ref={bookingRef} className="absolute bottom-0 left-0 right-0 z-20 pb-8 md:pb-10 px-4">
            <div className="max-w-6xl mx-auto rounded-2xl border border-gold-300/40 bg-cream/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(19,64,59,0.45)] overflow-hidden animate-fadeInUp animation-delay-600">
              <div className="flex items-center justify-center gap-3 py-3 bg-sea-800 text-cream">
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                <span className="text-[10px] tracking-[0.32em] uppercase font-medium">
                  {tr ? 'Müsaitlik Sorgula' : 'Check Availability'}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
                <div className="border-r border-sand-200 p-5 md:p-7 flex flex-col justify-between min-h-[130px]">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 mb-3 font-semibold">
                    {t('reservation.checkIn')}
                  </label>
                  <DatePickerTR
                    value={checkIn}
                    onChange={setCheckIn}
                    minDate={todayStr}
                    placeholder="gg/aa/yyyy"
                    className="w-full"
                    inputClassName="w-full text-lg md:text-xl font-light border-0 border-b border-sea-800/30 focus:border-gold-500 py-2 bg-transparent outline-none cursor-pointer placeholder-mute text-sea-900 transition-colors"
                  />
                </div>

                <div className="border-r border-sand-200 p-5 md:p-7 flex flex-col justify-between min-h-[130px]">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 mb-3 font-semibold">
                    {t('reservation.checkOut')}
                  </label>
                  <DatePickerTR
                    value={checkOut}
                    onChange={setCheckOut}
                    minDate={checkIn || todayStr}
                    placeholder="gg/aa/yyyy"
                    className="w-full"
                    inputClassName="w-full text-lg md:text-xl font-light border-0 border-b border-sea-800/30 focus:border-gold-500 py-2 bg-transparent outline-none cursor-pointer placeholder-mute text-sea-900 transition-colors"
                  />
                </div>

                <div className="border-r border-sand-200 p-5 md:p-7 flex flex-col justify-between min-h-[130px]">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 mb-3 font-semibold">
                    {t('reservation.adults')}
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full text-lg md:text-xl text-sea-900 font-light border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none bg-transparent transition-colors py-2 appearance-none cursor-pointer pr-4"
                  >
                    <option value={1}>1 {tr ? 'Kişi' : 'Guest'}</option>
                    <option value={2}>2 {tr ? 'Kişi' : 'Guests'}</option>
                    <option value={3}>3 {tr ? 'Kişi' : 'Guests'}</option>
                    <option value={4}>4 {tr ? 'Kişi' : 'Guests'}</option>
                  </select>
                </div>

                <div className="border-r border-sand-200 p-5 md:p-7 flex flex-col justify-between min-h-[130px] lg:border-r-0">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 mb-3 font-semibold">
                    {t('reservation.children')}
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full text-lg md:text-xl text-sea-900 font-light border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none bg-transparent transition-colors py-2 appearance-none cursor-pointer pr-4"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>

                <div className="p-4 md:p-5 flex items-center justify-center min-h-[130px] bg-sand-50">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={checking}
                    className="group w-full h-full px-6 py-4 rounded-xl bg-sea-800 hover:bg-sea-900 text-cream transition-all text-[11px] tracking-[0.26em] uppercase font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4 text-gold-300 transition-transform group-hover:scale-110" />
                    {checking ? t('common.loading') : t('reservation.submit')}
                  </button>
                </div>
              </div>

              {availabilityMsg && (
                <div className="px-5 md:px-6 pb-6 pt-4 border-t border-sand-200 bg-sand-50/40">
                  <div className={`p-4 rounded-xl border ${
                    availabilityMsg.includes('✅')
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : availabilityMsg.includes('❌')
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-gold-50 border-gold-300 text-gold-700'
                  }`}>
                    <p className="text-sm md:text-base font-medium text-center">{availabilityMsg}</p>
                  </div>

                  {availabilityMsg.includes('✅') && checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
                    <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={goReservationWithQS}
                        className="group px-8 py-3 rounded-full bg-gold-500 text-sea-900 hover:bg-gold-300 transition-all text-[11px] tracking-[0.26em] uppercase font-semibold shadow-md inline-flex items-center gap-2"
                      >
                        {tr ? 'Rezervasyon Yap' : 'Make Reservation'}
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  )}

                  {availabilityMsg.includes('❌') && (
                    <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                      <a
                        href="https://wa.me/905301234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-emerald-600 text-cream hover:bg-emerald-700 transition-all text-[11px] tracking-[0.2em] uppercase font-semibold shadow-md flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {tr ? 'WhatsApp ile Sor' : 'Ask on WhatsApp'}
                      </a>
                      <a
                        href="/iletisim"
                        className="px-6 py-3 rounded-full bg-sea-800 text-cream hover:bg-sea-900 transition-all text-[11px] tracking-[0.2em] uppercase font-semibold shadow-md flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {tr ? 'İletişim Formu' : 'Contact Form'}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* MARQUEE STRIP                                                */}
        {/* =========================================================== */}
        <div className="relative bg-sea-900 border-y border-gold-500/20 overflow-hidden py-5">
          <div className="flex gap-12 whitespace-nowrap animate-marquee">
            {[...marqueePhrases, ...marqueePhrases, ...marqueePhrases].map((phrase, i) => (
              <div key={i} className="flex items-center gap-12 shrink-0">
                <span className="font-display italic text-cream/85 text-2xl md:text-3xl font-light">{phrase}</span>
                <span className="block h-2 w-2 rotate-45 bg-gold-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================== */}
        {/* 01 — WELCOME (asymmetric editorial)                          */}
        {/* =========================================================== */}
        <section className="py-28 md:py-36 bg-cream relative overflow-hidden">
          <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />

          <div className="container mx-auto px-6 relative">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left: chapter + heading + pull text */}
              <div className="lg:col-span-7">
                <ChapterMarker number="01" label={tr ? 'Karşılama' : 'Welcome'} />
                <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-sea-900 font-light leading-[1.05] mt-6 mb-8">
                  {t('hero.welcomeTitle')}
                </h2>
                <div className="w-16 h-px bg-gold-500 mb-8" />
                <p className="text-lg md:text-xl text-ink-soft font-light leading-relaxed max-w-xl">
                  {t('hero.welcomeDesc')}
                </p>
              </div>

              {/* Right: real living room with floating caption */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(19,64,59,0.4)] group">
                  <img
                    src={slotImages.karsilama}
                    alt="Yaşam alanı"
                    className="w-full h-full object-cover transition-transform duration-[1.6s] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sea-900/35 via-transparent to-transparent" />

                  {/* Location proximity strip — overlay on top of image */}
                  <div className="absolute inset-x-0 top-0 px-5 md:px-6 py-4 md:py-5 bg-gradient-to-b from-sea-900/65 via-sea-900/30 to-transparent flex items-center justify-between gap-2">
                    {[
                      { Icon: Waves,  label: tr ? 'Plaja'  : 'Beach',  value: tr ? '2 dk' : '2 min' },
                      { Icon: Anchor, label: tr ? 'Marina' : 'Marina', value: tr ? '5 dk' : '5 min' },
                      { Icon: Plane,  label: tr ? 'Ercan'  : 'Ercan',  value: tr ? '35 dk' : '35 min' },
                    ].map((item, i, arr) => (
                      <div key={i} className="flex items-center gap-3 flex-1">
                        {i > 0 && <span className="w-px h-7 bg-gold-300/40 -ml-1" />}
                        <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-300/40 flex items-center justify-center shrink-0">
                          <item.Icon className="w-3.5 h-3.5 text-gold-300" strokeWidth={1.4} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] tracking-[0.22em] uppercase text-gold-200/90 font-semibold leading-tight">{item.label}</p>
                          <p className="font-display text-cream text-base md:text-lg italic leading-tight">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating frame ornament */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl border-2 border-gold-500 hidden md:block" />
                </div>
                {/* Floating caption tile bottom-left */}
                <div className="hidden lg:flex absolute -bottom-8 -left-8 flex-col bg-cream border border-gold-300/30 px-6 py-5 rounded-xl shadow-[0_20px_40px_-10px_rgba(19,64,59,0.25)]">
                  <span className="text-[10px] tracking-[0.28em] uppercase text-gold-600 font-medium mb-1">
                    {tr ? 'İskele' : 'Iskele'}
                  </span>
                  <span className="font-display text-2xl text-sea-900 italic">KKTC</span>
                </div>
              </div>
            </div>

            {/* Spec cards — daire spesifikasyonları */}
            <div className="mt-20 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {[
                { Icon: Maximize2, label: tr ? 'Boyut'       : 'Size',      value: '75 m²' },
                { Icon: BedDouble, label: tr ? 'Yatak Odası' : 'Bedrooms',  value: '2+1' },
                { Icon: Bath,      label: tr ? 'Banyo'       : 'Bathrooms', value: '2' },
                { Icon: Sun,       label: tr ? 'Manzara'     : 'View',      value: tr ? 'Deniz' : 'Sea' },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="group relative bg-white/50 backdrop-blur-sm border border-gold-300/30 rounded-2xl p-6 md:p-7 hover:border-gold-500 hover:bg-white/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(19,64,59,0.25)]"
                  style={{ animation: `fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${0.1 + i * 0.08}s both` }}
                >
                  <span className="absolute top-4 right-4 w-5 h-5 border-t border-r border-gold-500/40 group-hover:border-gold-500 transition-colors" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sand-50 border border-gold-500/40 group-hover:border-gold-500 group-hover:bg-gold-50 flex items-center justify-center shrink-0 transition-all duration-500">
                      <spec.Icon className="w-5 h-5 text-sea-800 group-hover:text-gold-700 transition-colors" strokeWidth={1.4} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] tracking-[0.24em] uppercase text-gold-700 font-semibold mb-1">{spec.label}</p>
                      <p className="font-display text-2xl md:text-3xl text-sea-900 font-light leading-tight">{spec.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* 02 — STAY PRIVILEGES (bento grid)                            */}
        {/* =========================================================== */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <img
              src={slotImages.konfor_bg}
              alt="Modern Interior"
              className="w-full h-full object-cover"
            />
            {/* Hafifletilmiş overlay — foto nefes alsın */}
            <div className="absolute inset-0 bg-gradient-to-b from-sea-900/55 via-sea-900/35 to-sea-900/55" />
          </div>

          <div className="relative z-10 py-24 md:py-32 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <ChapterMarker number="02" label={tr ? 'Konfor' : 'Comfort'} tone="cream" />
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream font-light mt-6">
                  {tr ? 'Her detay sizin için' : 'Every detail, for you'}
                </h2>
                <div className="mt-6 flex justify-center">
                  <GoldDivider />
                </div>
              </div>

              {/* Glass capsules — 4x2 grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { Icon: BedDouble,   title: tr ? 'Geniş Yatak'  : 'King Bed' },
                  { Icon: Wifi,        title: tr ? 'Hızlı Wi-Fi'  : 'Fast Wi-Fi' },
                  { Icon: ShieldCheck, title: tr ? 'Kasa'         : 'Safe' },
                  { Icon: Bath,        title: tr ? 'Modern Banyo' : 'Modern Bath' },
                  { Icon: Snowflake,   title: tr ? 'Klima'        : 'A/C' },
                  { Icon: Tv,          title: tr ? 'Smart TV'     : 'Smart TV' },
                  { Icon: Wine,        title: tr ? 'Mini Bar'     : 'Mini Bar' },
                  { Icon: Dumbbell,    title: tr ? 'Egzersiz'     : 'Gym' },
                ].map(({ Icon, title }, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-3 bg-cream/8 backdrop-blur-md border border-gold-300/25 rounded-full px-4 py-3 md:px-5 md:py-3.5 hover:bg-cream/15 hover:border-gold-500/60 transition-all duration-500"
                    style={{ animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.06}s both` }}
                  >
                    <span className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-300/40 flex items-center justify-center shrink-0 group-hover:bg-gold-500/25 group-hover:border-gold-500/70 transition">
                      <Icon className="w-4 h-4 text-gold-300 group-hover:text-gold-200 transition" strokeWidth={1.4} />
                    </span>
                    <span className="text-cream text-[11px] md:text-[12px] tracking-[0.18em] uppercase font-semibold">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* 03 — ATMOSPHERE / Gallery preview                            */}
        {/* =========================================================== */}
        <section className="py-28 md:py-36 bg-cream relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-14">
              <div className="max-w-2xl">
                <ChapterMarker number="03" label={tr ? 'Atmosfer' : 'Atmosphere'} />
                <h2 className="font-display text-5xl md:text-6xl text-sea-900 font-light leading-tight mt-6">
                  {tr ? 'Mekândan kareler' : 'Frames from the space'}
                </h2>
              </div>
              <Link
                href="/galeri"
                className="group inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-sea-900 hover:text-gold-600 font-semibold transition self-start"
              >
                {tr ? 'Tüm Galeri' : 'View Full Gallery'}
                <span className="w-10 h-10 rounded-full border border-gold-500/50 group-hover:bg-gold-500 group-hover:border-gold-500 flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-4 h-4 text-gold-600 group-hover:text-sea-900 transition" />
                </span>
              </Link>
            </div>

            {/* Editorial: cinematic banner (real interior) + 2 thumbnails below */}
            <div className="space-y-4 md:space-y-6">
              {/* Cinematic banner — master bedroom */}
              <div className="relative h-[420px] md:h-[560px] rounded-2xl overflow-hidden group shadow-[0_30px_70px_-25px_rgba(19,64,59,0.4)]">
                <img
                  src={slotImages.yatak_odasi}
                  alt={tr ? 'Yatak odası' : 'Bedroom'}
                  className="w-full h-full object-cover transition-transform duration-[1.6s] group-hover:scale-[1.04]"
                  style={{ objectPosition: '50% 55%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sea-900/65 via-sea-900/10 to-transparent" />
                <div className="absolute top-6 right-6 inline-flex items-center gap-2 bg-cream/95 backdrop-blur px-4 py-2 rounded-full border border-gold-300/40 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-sea-900 font-semibold">
                    {tr ? 'Bizim Mekanımız' : 'Our Space'}
                  </span>
                </div>
                <div className="absolute bottom-7 left-7 md:bottom-10 md:left-10 max-w-md">
                  <Eyebrow tone="cream" className="mb-3">{tr ? 'Yatak Odası' : 'Bedroom'}</Eyebrow>
                  <p className="font-display text-cream text-3xl md:text-5xl font-light italic leading-tight">
                    {tr ? 'Sessizlik & sıcaklık' : 'Stillness & warmth'}
                  </p>
                </div>
              </div>

              {/* Two thumbnails — real rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[260px] md:h-[320px]">
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src={slotImages.suite_detay}
                    alt={tr ? 'İç mekan detayları' : 'Interior details'}
                    className="w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                    style={{ objectPosition: '50% 50%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sea-900/55 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <Eyebrow tone="cream" className="mb-1">{tr ? 'Suite' : 'Suite'}</Eyebrow>
                    <p className="font-display text-cream text-2xl font-light italic">
                      {tr ? 'İnce Detaylar' : 'Fine Details'}
                    </p>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src={slotImages.cocuk_odasi}
                    alt={tr ? 'Çocuk odası' : 'Kids room'}
                    className="w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                    style={{ objectPosition: '50% 55%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sea-900/55 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <Eyebrow tone="cream" className="mb-1">{tr ? 'Çocuk Odası' : 'Kids Room'}</Eyebrow>
                    <p className="font-display text-cream text-2xl font-light italic">
                      {tr ? 'Aile' : 'Family'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* 04 — ABOUT (split with chapter + signature ornament)         */}
        {/* =========================================================== */}
        <section className="bg-cream">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[680px]">
            <div className="relative overflow-hidden bg-sea-900 order-2 lg:order-1 group">
              <img
                src={slotImages.hakkimizda_bg}
                alt={tr ? 'Hakkımızda' : 'About'}
                className="w-full h-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sea-900/25 via-transparent to-transparent" />
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-sand-50 via-cream to-sand-100 p-8 md:p-14 lg:p-20 flex flex-col justify-center order-1 lg:order-2">

              <div className="relative z-10 max-w-lg">
                <ChapterMarker label={tr ? 'Hikayemiz' : 'Our Story'} />
                <h3 className="font-display text-5xl md:text-6xl text-sea-900 font-light leading-tight mt-6 mb-7">
                  {tr ? 'Hakkımızda' : 'About Us'}
                </h3>
                <div className="w-12 h-px bg-gold-500 mb-8" />
                <p className="text-[15px] md:text-[17px] leading-relaxed text-ink-soft font-light mb-10">
                  {tr
                    ? 'Denize yakın konumunun huzurlu atmosferi ve modern konforu bir araya getirir. Her misafirimiz için unutulmaz bir deneyim yaratmayı amaçlıyoruz.'
                    : 'Located close to the sea, combining serene atmosphere with modern comfort. We aim to create an unforgettable experience for every guest.'}
                </p>
                <dl className="grid grid-cols-2 gap-8 pt-10 border-t border-gold-500/20">
                  <div>
                    <dt className="text-[11px] tracking-[0.22em] uppercase text-mute font-semibold mb-2">
                      {tr ? 'Konum' : 'Location'}
                    </dt>
                    <dd className="font-display text-2xl md:text-3xl text-sea-900 font-light leading-tight">
                      İskele · KKTC
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] tracking-[0.22em] uppercase text-mute font-semibold mb-2">
                      {tr ? 'Rezervasyon' : 'Booking'}
                    </dt>
                    <dd className="font-display text-2xl md:text-3xl text-sea-900 font-light leading-tight">
                      {tr ? 'Anlık onay' : 'Instant confirm'}
                    </dd>
                  </div>
                </dl>

                {/* CTA */}
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href="/rezervasyon"
                    className="group/cta inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-sea-900 hover:bg-sea-800 text-cream text-[11px] tracking-[0.28em] uppercase font-semibold transition shadow-[0_12px_30px_-12px_rgba(19,64,59,0.55)]"
                  >
                    {tr ? 'Rezervasyon Yap' : 'Book Now'}
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                  <Link
                    href="/iletisim"
                    className="group/cta2 inline-flex items-center gap-2 px-5 py-3.5 text-[11px] tracking-[0.28em] uppercase font-semibold text-sea-900 hover:text-gold-600 transition"
                  >
                    {tr ? 'İletişim' : 'Contact'}
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/cta2:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* 05 — EXPERIENCES (3 immersive cards)                         */}
        {/* =========================================================== */}
        <section className="py-28 md:py-36 bg-sand-50 relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 rounded-full bg-gold-500/8 blur-3xl" />

          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <ChapterMarker number="05" label={tr ? 'Deneyim' : 'Experience'} />
              <h2 className="font-display text-5xl md:text-6xl text-sea-900 font-light leading-tight mt-6 mb-6">
                {tr ? 'İskele’de sizi neler bekliyor' : 'What awaits you in Iskele'}
              </h2>
              <GoldDivider />
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {experiences.map(({ Icon, tag, title, desc, img }, i) => (
                <div
                  key={i}
                  className="group relative bg-cream rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(19,64,59,0.25)] hover:shadow-[0_30px_70px_-20px_rgba(19,64,59,0.4)] transition-all duration-500 hover:-translate-y-2"
                  style={{ animation: `fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s both` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sea-900/80 via-sea-900/15 to-transparent" />

                    {/* Tag */}
                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-cream/95 backdrop-blur px-3 py-1.5 rounded-full border border-gold-300/40">
                      <Icon className="w-3.5 h-3.5 text-gold-600" strokeWidth={1.6} />
                      <span className="text-[10px] tracking-[0.28em] uppercase text-sea-900 font-semibold">{tag}</span>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <h3 className="font-display text-cream text-3xl md:text-4xl font-light leading-tight">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-7 md:p-8">
                    <p className="text-sm md:text-[15px] text-ink-soft font-light leading-relaxed mb-5">
                      {desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-gold-600 font-semibold">
                        {tr ? 'Misafirlerimize özel' : 'For our guests'}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-sea-900 transition-transform group-hover:rotate-45" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* 06 — TESTIMONIAL                                             */}
        {/* =========================================================== */}
        <section className="relative py-28 md:py-36 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={slotImages.manzara_bg}
              alt="Interior Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-sea-900/65" />
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center mb-12">
              <ChapterMarker number="06" label={tr ? 'Misafirler' : 'Guests'} tone="cream" />
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative bg-cream/95 backdrop-blur-md rounded-2xl shadow-[0_30px_80px_-20px_rgba(19,64,59,0.5)] p-12 md:p-16 border border-gold-300/30">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-sea-900" strokeWidth={1.5} />
                </div>

                <h3 className="font-display text-3xl md:text-4xl text-sea-900 mb-8 mt-2 text-center font-light">
                  {t('testimonial.title')}
                </h3>

                <p className="text-lg md:text-xl text-ink-soft font-light leading-relaxed mb-10 text-center italic">
                  &ldquo;{t('testimonial.text')}&rdquo;
                </p>

                <div className="flex flex-col items-center gap-3">
                  <GoldDivider />
                  <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-sea-900 font-semibold">
                    {t('testimonial.author')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* NEWSLETTER                                                   */}
        {/* =========================================================== */}
        <section className="relative py-24 md:py-28 bg-sea-900 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />

          <div className="relative container mx-auto px-4 text-center">
            <Eyebrow tone="cream" className="mb-5">
              {tr ? 'Bültenimize Katılın' : 'Join the Journal'}
            </Eyebrow>
            <h3 className="font-display text-4xl md:text-5xl text-cream mb-5 font-light">
              {t('footer.newsletter')}
            </h3>
            <div className="flex justify-center mb-7">
              <GoldDivider />
            </div>
            <p className="text-cream/75 mb-10 text-base md:text-lg font-light max-w-xl mx-auto">
              {t('footer.newsletterText')}
            </p>
            <div className="max-w-xl mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* FOOTER                                                       */}
        {/* =========================================================== */}
        <footer className="bg-sea-900 text-cream border-t border-gold-500/15">
          <div className="container mx-auto px-6 pt-20 pb-10">
            <div className="grid md:grid-cols-4 gap-12 mb-14">
              <div className="md:col-span-1">
                <Image
                  src="/serenity_logo.png"
                  alt="Serenity İskele"
                  width={180}
                  height={72}
                  className="h-12 w-auto object-contain mb-5"
                />
                <p className="text-cream/65 text-sm leading-relaxed font-light">
                  {t('footer.aboutDesc')}
                </p>
              </div>

              <div>
                <Eyebrow tone="cream" className="mb-5">{t('contact.title')}</Eyebrow>
                <ul className="space-y-3.5 text-sm font-light text-cream/75">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                    <span>İskele, KKTC</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                    <a href="tel:+905301234567" className="hover:text-gold-300 transition">+90 533 123 45 67</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                    <a href="mailto:info@serenity-iskele.com" className="hover:text-gold-300 transition">info@serenity-iskele.com</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                    <span>{tr ? '7/24 Resepsiyon' : '24/7 Reception'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <Eyebrow tone="cream" className="mb-5">
                  {tr ? 'Keşfedin' : 'Explore'}
                </Eyebrow>
                <ul className="space-y-3 text-sm font-light text-cream/75">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-gold-300 transition inline-flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-gold-500/60 transition-all group-hover:w-4 group-hover:bg-gold-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/gizlilik" className="hover:text-gold-300 transition inline-flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-gold-500/60 transition-all group-hover:w-4 group-hover:bg-gold-300" />
                      {tr ? 'Gizlilik' : 'Privacy'}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <Eyebrow tone="cream" className="mb-5">{t('footer.followUs')}</Eyebrow>
                <div className="flex gap-3 mb-6">
                  <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-gold-500/30 hover:border-gold-300 hover:bg-gold-500/10 flex items-center justify-center text-gold-300 transition">
                    <IconInstagram className="w-4 h-4" />
                  </a>
                  <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-gold-500/30 hover:border-gold-300 hover:bg-gold-500/10 flex items-center justify-center text-gold-300 transition">
                    <IconFacebook className="w-4 h-4" />
                  </a>
                  <a href="https://wa.me/905301234567" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold-500/30 hover:border-gold-300 hover:bg-gold-500/10 flex items-center justify-center text-gold-300 transition">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
                <Link
                  href="/rezervasyon"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 hover:bg-gold-300 text-sea-900 text-[11px] tracking-[0.26em] uppercase font-semibold px-6 py-3 shadow-md transition-all"
                >
                  {t('nav.reservation')}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="border-t border-gold-500/15 pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-cream/55 text-xs tracking-wide">{t('footer.copyright')}</p>
              <div className="flex items-center gap-2 text-gold-500/70">
                <span className="block h-px w-6 bg-gold-500/40" />
                <Sparkles className="w-3 h-3" />
                <span className="block h-px w-6 bg-gold-500/40" />
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 38s linear infinite;
          will-change: transform;
        }
      `}</style>
    </>
  )
}
