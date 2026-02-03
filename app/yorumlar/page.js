'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Yorumlar() {
  const pathname = usePathname()
  const [language, setLanguage] = useState('TR')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [yorumlar, setYorumlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    ad: '',
    email: '',
    puan: '5',
    baslik: '',
    yorum: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    loadYorumlar()
  }, [])

  const content = {
    TR: {
      navLinks: [
        { label: 'ANA SAYFA', href: '/' },
        { label: 'GALERİ', href: '/galeri' },
        { label: 'ÖZELLİKLER', href: '/ozellikler' },
        { label: 'YORUMLAR', href: '/yorumlar' },
        { label: 'İLETİŞİM', href: '/iletisim' }
      ],
      cta: { book: 'REZERVASYON YAP' },
      hero: {
        badge: '⭐ MİSAFİR DEĞERLENDİRMELERİ',
        title: 'Konuklarımızın Görüşleri',
        description: 'Deneyimlerini paylaşan misafirlerimizin hikayelerini okuyun',
        subtitle: 'Gerçek deneyimler, gerçek yorumlar'
      },
      stats: {
        average: 'Ortalama Puan',
        reviews: 'değerlendirme',
        total: 'Toplam Yorum',
        guests: 'Mutlu misafirler',
        recommend: 'Tavsiye Eder',
        return: 'Tekrar gelirler'
      },
      form: {
        title: 'Deneyiminizi Paylaşın',
        subtitle: 'Görüşleriniz bizim için çok değerli',
        name: 'Adınız',
        email: 'E-posta',
        emailNote: 'E-postanız yayınlanmayacak',
        rating: 'Puanınız',
        title_field: 'Başlık',
        review: 'Yorumunuz',
        placeholder: {
          name: 'Adınız',
          email: 'ornek@email.com',
          title: 'Yorumunuzun başlığı',
          review: 'Deneyiminizi paylaşın...'
        },
        success: {
          title: 'Yorumunuz alındı!',
          message: 'Onaylandıktan sonra yayınlanacak'
        },
        submit: '✨ Yorum Gönder',
        submitting: 'Gönderiliyor...',
        required: '* ile işaretli alanlar zorunludur'
      },
      empty: {
        title: 'Henüz yorum yok',
        message: 'İlk yorumu yapan siz olun!'
      },
      verified: 'Doğrulanmış Konuk',
      loading: 'Yorumlar yükleniyor...'
    },
    EN: {
      navLinks: [
        { label: 'HOME', href: '/' },
        { label: 'GALLERY', href: '/galeri' },
        { label: 'FEATURES', href: '/ozellikler' },
        { label: 'REVIEWS', href: '/yorumlar' },
        { label: 'CONTACT', href: '/iletisim' }
      ],
      cta: { book: 'BOOK NOW' },
      hero: {
        badge: '⭐ GUEST REVIEWS',
        title: 'What Our Guests Say',
        description: 'Read stories from guests who shared their experiences',
        subtitle: 'Real experiences, real reviews'
      },
      stats: {
        average: 'Average Rating',
        reviews: 'reviews',
        total: 'Total Reviews',
        guests: 'Happy guests',
        recommend: 'Recommend',
        return: 'Return guests'
      },
      form: {
        title: 'Share Your Experience',
        subtitle: 'Your feedback is valuable to us',
        name: 'Your Name',
        email: 'Email',
        emailNote: 'Your email will not be published',
        rating: 'Your Rating',
        title_field: 'Title',
        review: 'Your Review',
        placeholder: {
          name: 'Your name',
          email: 'example@email.com',
          title: 'Review title',
          review: 'Share your experience...'
        },
        success: {
          title: 'Review received!',
          message: 'Will be published after approval'
        },
        submit: '✨ Submit Review',
        submitting: 'Submitting...',
        required: '* Required fields'
      },
      empty: {
        title: 'No reviews yet',
        message: 'Be the first to review!'
      },
      verified: 'Verified Guest',
      loading: 'Loading reviews...'
    }
  }

  const t = content[language]
  const navLinks = t.navLinks
  const isActive = (href) => pathname === href

  const loadYorumlar = async () => {
    try {
      const { data, error } = await supabase
        .from('yorumlar')
        .select('*')
        .eq('onaylandi', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase hatası:', error)
        throw error
      }
      
      setYorumlar(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error)
      setYorumlar([])
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('yorumlar')
        .insert([
          {
            ad: formData.ad,
            email: formData.email,
            puan: parseInt(formData.puan),
            baslik: formData.baslik,
            yorum: formData.yorum,
            onaylandi: false
          }
        ])

      if (error) throw error

      setSuccess(true)
      setFormData({
        ad: '',
        email: '',
        puan: '5',
        baslik: '',
        yorum: ''
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Yorum gönderilirken hata:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (puan) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= puan ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const ortalamaPuan = yorumlar.length > 0
    ? (yorumlar.reduce((sum, y) => sum + y.puan, 0) / yorumlar.length).toFixed(1)
    : 0

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRandomColor = (name) => {
    const colors = [
      'from-purple-400 to-pink-500',
      'from-blue-400 to-cyan-500',
      'from-green-400 to-emerald-500',
      'from-orange-400 to-amber-500',
      'from-indigo-400 to-purple-500',
      'from-pink-400 to-rose-500',
      'from-cyan-400 to-blue-500',
      'from-teal-400 to-green-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <>
      {/* TOP NAVBAR */}
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
              <nav className="hidden md:flex items-center gap-8">
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
                {/* Language */}
                <div
                  className={[
                    'hidden sm:flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-300',
                    isScrolled ? 'border border-white/20 bg-white/5' : 'border border-white/15 bg-white/0'
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => setLanguage('TR')}
                    className={`text-[13px] tracking-[0.18em] uppercase font-medium transition ${
                      language === 'TR' ? 'text-cyan-200' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    TR
                  </button>
                  <span className="text-white/25">|</span>
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    className={`text-[13px] tracking-[0.18em] uppercase font-medium transition ${
                      language === 'EN' ? 'text-cyan-200' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* CTA */}
                <Link
                  href="/rezervasyon"
                  className={[
                    'hidden md:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
                    'text-[14px] tracking-[0.22em] uppercase font-semibold shadow-lg hover:shadow-xl transition',
                    isScrolled ? 'px-5 py-2.5' : 'px-6 py-3',
                    'hover:from-cyan-600 hover:to-blue-700'
                  ].join(' ')}
                >
                  {t.cta.book}
                </Link>

                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className={[
                    'md:hidden inline-flex w-10 h-10 items-center justify-center rounded-full transition',
                    isScrolled
                      ? 'border border-white/20 bg-white/10 hover:bg-white/15'
                      : 'border border-white/15 bg-white/5 hover:bg-white/10'
                  ].join(' ')}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-gradient-to-br from-gray-900 via-slate-900 to-black border-l border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-white text-2xl" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                Serenity
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-2 mb-8">
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

            <Link
              href="/rezervasyon"
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[14px] tracking-[0.22em] uppercase font-semibold shadow-lg hover:shadow-xl transition"
            >
              {t.cta.book}
            </Link>
          </div>
        </div>
      )}

      <main className="pt-0">
        {/* HERO SECTION */}
        <section className="relative h-[400px] md:h-[480px] -mt-16 pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&h=1080&fit=crop"
              alt="Reviews Hero"
              className="w-full h-full object-cover scale-105 animate-[zoom_20s_ease-in-out_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 inline-block px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md animate-[fadeIn_1s_ease-out]">
              <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/90 font-light">
                {t.hero.badge}
              </p>
            </div>
            
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 text-white animate-[fadeIn_1s_ease-out]"
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontWeight: 300,
                letterSpacing: '0.02em',
                textShadow: '0 10px 40px rgba(0,0,0,0.8)'
              }}
            >
              {t.hero.title}
            </h1>
            
            <p 
              className="text-lg md:text-xl font-light text-white/95 tracking-wide max-w-2xl mb-4 animate-[fadeIn_1.5s_ease-out]"
              style={{
                textShadow: '0 6px 22px rgba(0,0,0,0.70)'
              }}
            >
              {t.hero.description}
            </p>

            <p className="text-sm text-white/80 font-light animate-[fadeIn_2s_ease-out]">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-[scroll_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="relative -mt-16 pb-20 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-4">
            {/* İstatistikler - Modern Kartlar */}
            <div className="max-w-5xl mx-auto mb-16 animate-[fadeIn_1s_ease-out]">
              <div className="grid md:grid-cols-3 gap-5">
                {/* Ortalama Puan */}
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Top gradient bar */}
                  <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"></div>
                  
                  <div className="relative p-6 text-center">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>

                    {/* Number */}
                    <div className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                      {ortalamaPuan}
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {renderStars(Math.round(ortalamaPuan))}
                    </div>

                    {/* Label */}
                    <p className="text-gray-900 font-bold text-base mb-1">{t.stats.average}</p>
                    <p className="text-xs text-gray-500 font-light">{yorumlar.length} {t.stats.reviews}</p>
                  </div>

                  {/* Bottom decoration */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Toplam Yorum */}
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Top gradient bar */}
                  <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-600 to-rose-600"></div>
                  
                  <div className="relative p-6 text-center">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>

                    {/* Number */}
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                      {yorumlar.length}
                    </div>

                    {/* Label */}
                    <p className="text-gray-900 font-bold text-base mb-1 mt-10">{t.stats.total}</p>
                    <p className="text-xs text-gray-500 font-light">{t.stats.guests}</p>
                  </div>

                  {/* Bottom decoration */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Tavsiye Eder */}
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Top gradient bar */}
                  <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600"></div>
                  
                  <div className="relative p-6 text-center">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    {/* Number */}
                    <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                      100%
                    </div>

                    {/* Label */}
                    <p className="text-gray-900 font-bold text-base mb-1 mt-10">{t.stats.recommend}</p>
                    <p className="text-xs text-gray-500 font-light">{t.stats.return}</p>
                  </div>

                  {/* Bottom decoration */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Sol: Yorum Formu */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <div className="relative bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden">
                      {/* Decorative gradient background */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-pink-500/10 rounded-full blur-3xl"></div>

                      <div className="relative z-10">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl transform hover:rotate-6 transition-transform duration-300">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}>
                            {t.form.title}
                          </h2>
                          <p className="text-gray-600 text-sm font-light">{t.form.subtitle}</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                              {t.form.name} *
                            </label>
                            <input
                              type="text"
                              value={formData.ad}
                              onChange={(e) => setFormData({...formData, ad: e.target.value})}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition bg-white hover:border-gray-300"
                              placeholder={t.form.placeholder.name}
                            />
                          </div>

                          <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                              {t.form.email} *
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition bg-white hover:border-gray-300"
                              placeholder={t.form.placeholder.email}
                            />
                            <p className="text-xs text-gray-500 mt-1.5 font-light">{t.form.emailNote}</p>
                          </div>

                          <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-3">
                              {t.form.rating} *
                            </label>
                            <div className="flex space-x-2 justify-center py-3 bg-gray-50 rounded-xl">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setFormData({...formData, puan: star.toString()})}
                                  className="focus:outline-none transform hover:scale-125 transition-all duration-200"
                                >
                                  <svg
                                    className={`w-10 h-10 ${parseInt(formData.puan) >= star ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300'} hover:text-yellow-400 transition`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                              {t.form.title_field} *
                            </label>
                            <input
                              type="text"
                              value={formData.baslik}
                              onChange={(e) => setFormData({...formData, baslik: e.target.value})}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition bg-white hover:border-gray-300"
                              placeholder={t.form.placeholder.title}
                            />
                          </div>

                          <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                              {t.form.review} *
                            </label>
                            <textarea
                              value={formData.yorum}
                              onChange={(e) => setFormData({...formData, yorum: e.target.value})}
                              required
                              rows="4"
                              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none resize-none transition bg-white hover:border-gray-300 font-light"
                              placeholder={t.form.placeholder.review}
                            ></textarea>
                          </div>

                          {success && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-4 py-4 rounded-xl text-sm flex items-center animate-[fadeIn_0.5s_ease-out]">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-bold">{t.form.success.title}</p>
                                <p className="text-xs mt-0.5">{t.form.success.message}</p>
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl text-sm tracking-[0.2em] uppercase font-bold hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] duration-300"
                          >
                            {submitting ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.form.submitting}
                              </span>
                            ) : (
                              t.form.submit
                            )}
                          </button>
                          
                          <p className="text-center text-gray-500 text-xs mt-4 font-light tracking-wide">
                            {t.form.required}
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ: Yorumlar Listesi */}
                <div className="lg:col-span-2">
                  {loading ? (
                    <div className="text-center py-20">
                      <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-cyan-600 mb-4"></div>
                      <p className="text-gray-600 font-light">{t.loading}</p>
                    </div>
                  ) : yorumlar.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-900 text-2xl font-serif mb-3" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                        {t.empty.title}
                      </p>
                      <p className="text-gray-500 font-light">{t.empty.message}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {yorumlar.map((yorum, index) => (
                        <div 
                          key={yorum.id} 
                          className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {/* Gradient border effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                          
                          <div className="relative bg-white rounded-3xl p-8">
                            <div className="flex items-start space-x-5 mb-5">
                              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getRandomColor(yorum.ad)} flex items-center justify-center text-white font-bold text-xl shadow-xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                {getInitials(yorum.ad)}
                                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-1.5" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                                      {yorum.baslik}
                                    </h3>
                                    <p className="text-base font-semibold text-gray-700">{yorum.ad}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(yorum.created_at).toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    {renderStars(yorum.puan)}
                                    <span className="text-sm font-bold text-gray-700 mt-1.5">{yorum.puan}.0</span>
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 leading-relaxed font-light text-base">
                                  {yorum.yorum}
                                </p>

                                <div className="mt-5 inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {t.verified}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-gradient-to-b from-gray-900 via-slate-900 to-black text-white py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <div className="mb-6">
                  <span className="font-serif text-3xl text-white" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                    Serenity
                  </span>
                  <span className="ml-2 text-xs tracking-[0.3em] uppercase text-cyan-400">ISKELE</span>
                </div>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  {language === 'TR' 
                    ? "Serenity Iskele'e hoş geldiniz, konfor her şeydir. Güzel oda sunumları, basit rezervasyon seçenekleri."
                    : "Welcome to Serenity Iskele, where comfort is everything. Beautiful rooms, simple booking options."}
                </p>
              </div>

              <div>
                <h4 className="text-sm tracking-[0.3em] uppercase mb-8 font-bold text-cyan-400">
                  {language === 'TR' ? 'İletişim' : 'Contact'}
                </h4>
                <div className="space-y-4 text-sm text-gray-400 font-light">
                  <div className="group">
                    <p className="text-gray-500 text-xs tracking-[0.1em] uppercase mb-2">Adres</p>
                    <p className="group-hover:text-cyan-400 transition">İskele, KKTC</p>
                  </div>
                  <div className="group">
                    <p className="text-gray-500 text-xs tracking-[0.1em] uppercase mb-2">Telefon</p>
                    <a href="tel:+905331234567" className="hover:text-cyan-400 transition flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +90 533 123 45 67
                    </a>
                  </div>
                  <div className="group">
                    <p className="text-gray-500 text-xs tracking-[0.1em] uppercase mb-2">Email</p>
                    <a href="mailto:info@serenity-iskele.com" className="hover:text-cyan-400 transition flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      info@serenity-iskele.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm tracking-[0.3em] uppercase mb-8 font-bold text-cyan-400">
                  {language === 'TR' ? 'Sosyal Medya' : 'Get Social'}
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-12 h-12 border border-gray-700 hover:border-cyan-500 flex items-center justify-center transition rounded-full hover:bg-cyan-500/10 group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 border border-gray-700 hover:border-cyan-500 flex items-center justify-center transition rounded-full hover:bg-cyan-500/10 group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 border border-gray-700 hover:border-cyan-500 flex items-center justify-center transition rounded-full hover:bg-cyan-500/10 group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-xs text-gray-500 tracking-[0.1em] uppercase font-light">
                © 2025 Serenity Iskele. {language === 'TR' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
              </p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoom {
          from {
            transform: scale(1.05);
          }
          to {
            transform: scale(1.1);
          }
        }

        @keyframes scroll {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }
      `}</style>
    </>
  )
}