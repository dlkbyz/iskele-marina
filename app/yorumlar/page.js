'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '../components/Footer'

// Star Component with Animation
function StarRating({ rating, maxStars = 5, size = 'md', interactive = false, onRate = null }) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= (interactive ? (hoverRating || rating) : rating)
        
        return (
          <button
            key={index}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRate && onRate(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200 ${
              isFilled ? 'text-yellow-400 scale-110' : 'text-gray-300'
            }`}
          >
            <svg
              className={`${sizeClasses[size]} transition-all duration-200 ${isFilled ? 'fill-current drop-shadow-lg' : ''}`}
              viewBox="0 0 24 24"
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFilled ? 0 : 1}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

// Intersection Observer Hook
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

export default function Yorumlar() {
  const pathname = usePathname()
  const { language, toggleLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [yorumlar, setYorumlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    ad: '',
    email: '',
    puan: 5,
    baslik: '',
    yorum: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [heroRef, heroInView] = useInView()
  const [statsRef, statsInView] = useInView()
  const [reviewsRef, reviewsInView] = useInView()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    loadYorumlar()
  }, [])

  const loadYorumlar = async () => {
    try {
      const { data, error } = await supabase
        .from('yorumlar')
        .select('*')
        .eq('onaylanmis', true)
        .order('olusturulma_tarihi', { ascending: false })

      if (error) throw error
      setYorumlar(data || [])
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error)
    } finally {
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
            ad_soyad: formData.ad,
            email: formData.email,
            puan: formData.puan,
            baslik: formData.baslik,
            yorum: formData.yorum,
            onaylanmis: false
          }
        ])

      if (error) throw error

      setSuccess(true)
      setFormData({ ad: '', email: '', puan: 5, baslik: '', yorum: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Yorum gönderilemedi:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const content = {
    tr: {
      navLinks: [
        { label: 'ANA SAYFA', href: '/' },
        { label: 'GALERİ', href: '/galeri' },
        { label: 'ÖZELLİKLER', href: '/ozellikler' },
        { label: 'YORUMLAR', href: '/yorumlar' },
        { label: 'İLETİŞİM', href: '/iletisim' }
      ],
      hero: {
        badge: '⭐ MİSAFİR DEĞERLENDİRMELERİ',
        title: 'Konuklarımızın Görüşleri',
        description: 'Deneyimlerini paylaşan misafirlerimizin hikayelerini okuyun'
      },
      filters: {
        all: 'Tümü',
        five: '5 Yıldız',
        four: '4 Yıldız',
        three: '3+ Yıldız'
      },
      stats: {
        average: 'Ortalama',
        total: 'Toplam Yorum',
        recommend: 'Tavsiye Eder'
      },
      form: {
        title: 'Deneyiminizi Paylaşın',
        subtitle: 'Görüşleriniz bizim için çok değerli',
        name: 'Adınız',
        email: 'E-posta',
        rating: 'Puanınız',
        title: 'Başlık',
        review: 'Yorumunuz',
        submit: 'Yorum Gönder',
        submitting: 'Gönderiliyor...',
        success: 'Yorumunuz alındı! Onaylandıktan sonra yayınlanacak.'
      },
      verified: 'Doğrulanmış Konuk',
      loading: 'Yorumlar yükleniyor...',
      noReviews: 'Henüz yorum yok. İlk yorumu siz yapın!'
    },
    en: {
      navLinks: [
        { label: 'HOME', href: '/' },
        { label: 'GALLERY', href: '/galeri' },
        { label: 'FEATURES', href: '/ozellikler' },
        { label: 'REVIEWS', href: '/yorumlar' },
        { label: 'CONTACT', href: '/iletisim' }
      ],
      hero: {
        badge: '⭐ GUEST REVIEWS',
        title: 'What Our Guests Say',
        description: 'Read stories from guests who shared their experiences'
      },
      filters: {
        all: 'All',
        five: '5 Stars',
        four: '4 Stars',
        three: '3+ Stars'
      },
      stats: {
        average: 'Average',
        total: 'Total Reviews',
        recommend: 'Would Recommend'
      },
      form: {
        title: 'Share Your Experience',
        subtitle: 'Your feedback is very valuable to us',
        name: 'Your Name',
        email: 'Email',
        rating: 'Your Rating',
        title: 'Title',
        review: 'Your Review',
        submit: 'Submit Review',
        submitting: 'Submitting...',
        success: 'Your review has been received! It will be published after approval.'
      },
      verified: 'Verified Guest',
      loading: 'Loading reviews...',
      noReviews: 'No reviews yet. Be the first to review!'
    }
  }

  const isActive = (href) => pathname === href
  const t_local = content[language]

  // Calculate statistics
  const avgRating = yorumlar.length > 0 
    ? (yorumlar.reduce((sum, y) => sum + y.puan, 0) / yorumlar.length).toFixed(1)
    : '0.0'
  
  const recommendPercent = yorumlar.length > 0
    ? Math.round((yorumlar.filter(y => y.puan >= 4).length / yorumlar.length) * 100)
    : 0

  // Filter reviews
  const filteredReviews = yorumlar.filter(yorum => {
    if (filter === 'all') return true
    if (filter === 'five') return yorum.puan === 5
    if (filter === 'four') return yorum.puan === 4
    if (filter === 'three') return yorum.puan >= 3
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  Serenity <span className="font-light text-cyan-600">İskele</span>
                </h1>
                <p className="text-xs text-gray-600">Lüks Tatil Deneyimi</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {t_local.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-sm text-gray-700 transition"
              >
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
              <Link
                href="/rezervasyon"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg transition"
              >
                {language === 'tr' ? 'REZERVASYON' : 'BOOK NOW'}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white p-6 shadow-2xl">
            <button className="absolute top-4 right-4" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="mt-8 space-y-4">
              {t_local.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 rounded-lg ${
                    isActive(link.href) ? 'bg-cyan-100 text-cyan-600' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div
            ref={heroRef}
            className={`text-center transform transition-all duration-1000 ${
              heroInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="inline-block bg-yellow-100 text-yellow-600 px-6 py-2 rounded-full font-semibold text-sm mb-6">
              {t_local.hero.badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {t_local.hero.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t_local.hero.description}
            </p>
            
            {/* Star Rating Display */}
            <div className="flex items-center justify-center gap-4">
              <StarRating rating={parseFloat(avgRating)} size="xl" />
              <div className="text-left">
                <div className="text-3xl font-bold text-gray-900">{avgRating}</div>
                <div className="text-sm text-gray-600">{yorumlar.length} {language === 'tr' ? 'yorum' : 'reviews'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div
            ref={statsRef}
            className={`grid md:grid-cols-3 gap-6 transform transition-all duration-1000 delay-200 ${
              statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-yellow-500 mb-2">{avgRating}</div>
              <div className="text-gray-600 mb-3">{t_local.stats.average}</div>
              <StarRating rating={parseFloat(avgRating)} size="md" />
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-cyan-600 mb-2">{yorumlar.length}</div>
              <div className="text-gray-600">{t_local.stats.total}</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-green-600 mb-2">{recommendPercent}%</div>
              <div className="text-gray-600">{t_local.stats.recommend}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.entries(t_local.filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
                  filter === key
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS GRID */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">{t_local.loading}</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💭</div>
              <p className="text-xl text-gray-600">{t_local.noReviews}</p>
            </div>
          ) : (
            <div
              ref={reviewsRef}
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transform transition-all duration-1000 ${
                reviewsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {filteredReviews.map((yorum, index) => (
                <div
                  key={yorum.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{yorum.ad_soyad}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {t_local.verified}
                      </div>
                    </div>
                    <StarRating rating={yorum.puan} size="sm" />
                  </div>
                  
                  {/* Title */}
                  {yorum.baslik && (
                    <h4 className="font-semibold text-gray-800 mb-2">{yorum.baslik}</h4>
                  )}
                  
                  {/* Review */}
                  <p className="text-gray-600 leading-relaxed">{yorum.yorum}</p>
                  
                  {/* Date */}
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    {new Date(yorum.olusturulma_tarihi).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* REVIEW FORM */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t_local.form.title}</h2>
              <p className="text-gray-600">{t_local.form.subtitle}</p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 animate-fadeIn">
                ✅ {t_local.form.success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t_local.form.name}
                  </label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t_local.form.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t_local.form.rating}
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={formData.puan}
                    size="xl"
                    interactive={true}
                    onRate={(rating) => setFormData({ ...formData, puan: rating })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t_local.form.title}
                </label>
                <input
                  type="text"
                  value={formData.baslik}
                  onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t_local.form.review}
                </label>
                <textarea
                  value={formData.yorum}
                  onChange={(e) => setFormData({ ...formData, yorum: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {submitting ? t_local.form.submitting : t_local.form.submit}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
