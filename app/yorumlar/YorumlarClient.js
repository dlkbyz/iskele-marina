'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

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
  const [isInView, setIsInView] = useState(false)
  const observerRef = useRef(null)

  const ref = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    if (node) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      }, { threshold: 0.1, ...options })
      observerRef.current.observe(node)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, isInView]
}

export default function Yorumlar({ initialReviews = [] }) {
  const { language } = useLanguage()
  const [yorumlar, setYorumlar] = useState(initialReviews)
  const [loading, setLoading] = useState(false)
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
  const [submitError, setSubmitError] = useState('')

  const [heroRef, heroInView] = useInView()
  const [statsRef, statsInView] = useInView()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/yorumlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: formData.ad,
          email: formData.email,
          puan: formData.puan,
          baslik: formData.baslik,
          yorum: formData.yorum
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Hata')

      setSuccess(true)
      setFormData({ ad: '', email: '', puan: 5, baslik: '', yorum: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Yorum gönderilemedi:', error)
      setSubmitError(language === 'tr' ? 'Yorum gönderilemedi. Lütfen tekrar deneyin.' : 'Could not submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const content = {
    tr: {
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
        heading: 'Deneyiminizi Paylaşın',
        subtitle: 'Görüşleriniz bizim için çok değerli',
        name: 'Adınız',
        email: 'E-posta',
        rating: 'Puanınız',
        titleField: 'Başlık',
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
        heading: 'Share Your Experience',
        subtitle: 'Your feedback is very valuable to us',
        name: 'Your Name',
        email: 'Email',
        rating: 'Your Rating',
        titleField: 'Title',
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

  const t_local = content[language] || content.tr

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
      <Navbar />

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((yorum, index) => (
                <div
                  key={yorum.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{yorum.ad}</h3>
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
                    {new Date(yorum.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t_local.form.heading}</h2>
              <p className="text-gray-600">{t_local.form.subtitle}</p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 animate-fadeIn">
                ✅ {t_local.form.success}
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 animate-fadeIn">
                ❌ {submitError}
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
                  {t_local.form.titleField}
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
