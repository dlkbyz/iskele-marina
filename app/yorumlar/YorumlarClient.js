'use client'

import { useState } from 'react'
import { Star, BadgeCheck, Quote, MessageSquare, Send, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ChapterMarker, GoldDivider, Eyebrow } from '../components/SiteShell'

/* ---------------- StarRating (gold) ---------------- */
function StarRating({ rating, maxStars = 5, size = 'md', interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-9 h-9',
  }
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const v = i + 1
        const filled = v <= (interactive ? hover || rating : rating)
        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(v)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onRate && onRate(v)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all ${
              filled ? 'text-gold-500' : 'text-sand-300'
            }`}
            aria-label={`${v} stars`}
          >
            <Star className={sizes[size]} fill={filled ? 'currentColor' : 'none'} strokeWidth={1.4} />
          </button>
        )
      })}
    </div>
  )
}

/* ============================================================ */
export default function Yorumlar({ initialReviews = [], initialHeroImage }) {
  const heroImage = initialHeroImage || '/h4-rev-img-3-1536x864.jpg'
  const { language } = useLanguage()
  const tr = language === 'tr'

  const [yorumlar, setYorumlar] = useState(initialReviews)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    ad: '', email: '', puan: 5, baslik: '', yorum: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/yorumlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Hata')

      setSuccess(true)
      setFormData({ ad: '', email: '', puan: 5, baslik: '', yorum: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Yorum gönderilemedi:', err)
      setSubmitError(tr ? 'Yorum gönderilemedi. Lütfen tekrar deneyin.' : 'Could not submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filters = tr
    ? { all: 'Tümü', five: '5 Yıldız', four: '4 Yıldız', three: '3+ Yıldız' }
    : { all: 'All',  five: '5 Stars',  four: '4 Stars',  three: '3+ Stars' }

  const avgRating = yorumlar.length
    ? (yorumlar.reduce((s, y) => s + y.puan, 0) / yorumlar.length).toFixed(1)
    : '0.0'

  const recommendPercent = yorumlar.length
    ? Math.round((yorumlar.filter((y) => y.puan >= 4).length / yorumlar.length) * 100)
    : 0

  const filtered = yorumlar.filter((y) => {
    if (filter === 'all') return true
    if (filter === 'five') return y.puan === 5
    if (filter === 'four') return y.puan === 4
    if (filter === 'three') return y.puan >= 3
    return true
  })

  return (
    <>
      <Navbar />

      <main className="bg-cream">
        {/* ============================ HERO ============================ */}
        <section className="relative h-[520px] md:h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Reviews hero"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 50%' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(19,64,59,0.55) 0%, rgba(19,64,59,0.3) 50%, rgba(19,64,59,0.65) 100%)' }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-24">
            <ChapterMarker number="03" label={tr ? 'Misafirler' : 'Guests'} tone="cream" />
            <h1
              className="font-display text-cream text-5xl md:text-7xl font-light leading-[1.05] mt-6 max-w-3xl"
              style={{ textShadow: '0 4px 24px rgba(19,64,59,0.5)' }}
            >
              {tr ? 'Konuklarımızın görüşleri' : 'What our guests say'}
            </h1>
            <div className="my-6">
              <GoldDivider />
            </div>
            <p
              className="max-w-xl text-cream/85 text-base md:text-lg font-light"
              style={{ textShadow: '0 2px 12px rgba(19,64,59,0.5)' }}
            >
              {tr
                ? 'Deneyimlerini paylaşan misafirlerimizin hikâyelerini okuyun.'
                : 'Read stories from guests who shared their experiences.'}
            </p>

            {/* Average + stars */}
            <div className="mt-8 inline-flex items-center gap-4 px-7 py-3.5 rounded-full bg-cream/10 backdrop-blur-md border border-gold-300/30">
              <StarRating rating={parseFloat(avgRating)} size="md" />
              <div className="font-display text-2xl text-cream font-light">{avgRating}</div>
              <span className="block h-5 w-px bg-gold-300/40" />
              <span className="text-[11px] tracking-[0.22em] uppercase text-cream/80 font-medium">
                {yorumlar.length} {tr ? 'yorum' : 'reviews'}
              </span>
            </div>
          </div>
        </section>

        {/* ============================ STATS ============================ */}
        <section className="py-20 bg-cream">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-cream border border-gold-300/30 rounded-2xl p-8 text-center shadow-[0_15px_40px_-15px_rgba(19,64,59,0.18)]">
                <Eyebrow className="mb-3">{tr ? 'Ortalama' : 'Average'}</Eyebrow>
                <div className="font-display text-6xl text-gold-600 font-light mb-3">{avgRating}</div>
                <StarRating rating={parseFloat(avgRating)} size="md" />
              </div>

              <div className="bg-cream border border-gold-300/30 rounded-2xl p-8 text-center shadow-[0_15px_40px_-15px_rgba(19,64,59,0.18)]">
                <Eyebrow className="mb-3">{tr ? 'Toplam Yorum' : 'Total Reviews'}</Eyebrow>
                <div className="font-display text-6xl text-sea-800 font-light mb-3">{yorumlar.length}</div>
                <p className="text-[11px] tracking-[0.22em] uppercase text-mute font-medium">
                  {tr ? 'Doğrulanmış' : 'Verified'}
                </p>
              </div>

              <div className="bg-cream border border-gold-300/30 rounded-2xl p-8 text-center shadow-[0_15px_40px_-15px_rgba(19,64,59,0.18)]">
                <Eyebrow className="mb-3">{tr ? 'Tavsiye Eder' : 'Would Recommend'}</Eyebrow>
                <div className="font-display text-6xl text-emerald-600 font-light mb-3">{recommendPercent}%</div>
                <p className="text-[11px] tracking-[0.22em] uppercase text-mute font-medium">
                  {tr ? '4 yıldız +' : '4 stars +'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ FILTERS ============================ */}
        <section className="pb-10">
          <div className="container mx-auto px-6">
            <div className="flex justify-center gap-3 flex-wrap">
              {Object.entries(filters).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`px-6 py-3 rounded-full text-[11px] tracking-[0.26em] uppercase font-semibold transition ${
                    filter === key
                      ? 'bg-sea-900 text-cream shadow-[0_10px_25px_rgba(19,64,59,0.25)]'
                      : 'bg-cream text-sea-900 border border-gold-300/40 hover:border-gold-500 hover:bg-gold-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ REVIEWS GRID ============================ */}
        <section className="pb-24">
          <div className="container mx-auto px-6 max-w-6xl">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="w-12 h-12 text-gold-500/50 mx-auto mb-4" strokeWidth={1.4} />
                <p className="text-mute font-light">
                  {tr ? 'Henüz yorum yok. İlk yorumu siz yapın!' : 'No reviews yet. Be the first to review!'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((y, i) => (
                  <article
                    key={y.id}
                    className="relative group bg-cream rounded-2xl border border-gold-300/30 p-7 shadow-[0_15px_40px_-15px_rgba(19,64,59,0.18)] hover:shadow-[0_28px_60px_-20px_rgba(19,64,59,0.32)] hover:border-gold-500/60 transition-all duration-500 hover:-translate-y-1"
                    style={{ animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.06}s both` }}
                  >
                    {/* Quote ornament */}
                    <div className="absolute -top-3 left-7 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center shadow-md">
                      <Quote className="w-4 h-4 text-sea-900" strokeWidth={1.5} />
                    </div>

                    <div className="flex items-start justify-between mb-4 mt-2">
                      <div>
                        <h3 className="font-display text-xl text-sea-900 font-medium leading-tight">
                          {y.ad}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-gold-700 tracking-[0.2em] uppercase font-medium mt-1">
                          <BadgeCheck className="w-3 h-3" />
                          {tr ? 'Doğrulanmış Konuk' : 'Verified Guest'}
                        </div>
                      </div>
                      <StarRating rating={y.puan} size="sm" />
                    </div>

                    {y.baslik && (
                      <h4 className="font-display text-lg italic text-sea-800 mb-2 font-light break-words" style={{ overflowWrap: 'anywhere' }}>
                        “{y.baslik}”
                      </h4>
                    )}

                    <p className="text-[14px] text-ink-soft font-light leading-relaxed break-words whitespace-pre-wrap" style={{ overflowWrap: 'anywhere' }}>
                      {y.yorum}
                    </p>

                    <div className="mt-5 pt-4 border-t border-gold-300/30 text-[10px] tracking-[0.22em] uppercase text-mute font-medium">
                      {new Date(y.created_at).toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============================ FORM ============================ */}
        <section className="py-24 md:py-28 bg-sand-50">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
              <Sparkles className="w-7 h-7 text-gold-500 mx-auto mb-4" />
              <Eyebrow className="mb-4">{tr ? 'Deneyiminizi paylaşın' : 'Share your stay'}</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl text-sea-900 font-light">
                {tr ? 'Yorum Yazın' : 'Write a Review'}
              </h2>
              <div className="mt-5 flex justify-center">
                <GoldDivider />
              </div>
              <p className="mt-6 text-ink-soft font-light max-w-lg mx-auto">
                {tr
                  ? 'Görüşleriniz bizim için çok değerli — diğer misafirlere yol gösterin.'
                  : 'Your feedback is very valuable — help future guests.'}
              </p>
            </div>

            <div className="bg-cream border border-gold-300/30 rounded-2xl shadow-[0_25px_60px_-20px_rgba(19,64,59,0.25)] p-8 md:p-12">
              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium">
                  ✓ {tr ? 'Yorumunuz alındı! Onaylandıktan sonra yayınlanacak.' : 'Your review has been received! It will be published after approval.'}
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm font-medium">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                      {tr ? 'Adınız' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.ad}
                      onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                      required
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                      placeholder={tr ? 'Ad Soyad' : 'Full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                      {tr ? 'E-posta' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="bg-sand-50 rounded-xl p-5 text-center">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-3">
                    {tr ? 'Puanınız' : 'Your Rating'}
                  </label>
                  <div className="flex justify-center">
                    <StarRating
                      rating={formData.puan}
                      size="xl"
                      interactive
                      onRate={(r) => setFormData({ ...formData, puan: r })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                    {tr ? 'Başlık' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                    required
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                    placeholder={tr ? 'Kısa bir başlık' : 'A short title'}
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                    {tr ? 'Yorumunuz' : 'Your Review'}
                  </label>
                  <textarea
                    value={formData.yorum}
                    onChange={(e) => setFormData({ ...formData, yorum: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-sand-50 border border-gold-300/30 focus:border-gold-500 rounded-xl outline-none text-sea-900 font-light leading-relaxed transition-colors placeholder-mute resize-none"
                    placeholder={tr ? 'Konaklama deneyiminizi anlatın…' : 'Tell us about your stay…'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full py-4 rounded-full bg-sea-900 hover:bg-sea-800 text-cream transition-all text-[11px] tracking-[0.28em] uppercase font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
                >
                  {submitting ? (tr ? 'Gönderiliyor…' : 'Submitting…') : (tr ? 'Yorum Gönder' : 'Submit Review')}
                  <Send className="w-3.5 h-3.5 text-gold-300 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
