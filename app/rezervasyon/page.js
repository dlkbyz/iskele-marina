'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search, Calendar, CalendarCheck, Users, User, Mail, Phone,
  MessageSquare, Sparkles, CircleCheck, CircleX, TriangleAlert,
  MessageCircle, ChevronRight, Check,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '@/lib/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DatePickerTR from '../components/DatePickerTR'
import { ChapterMarker, GoldDivider, Eyebrow } from '../components/SiteShell'

export const dynamic = 'force-dynamic'

/* ============================================================
   MODAL — Akdeniz lüks butik palette
   ============================================================ */
function Modal({ isOpen, onClose, type, data, tr }) {
  if (!isOpen) return null

  const configs = {
    available: {
      Icon: CircleCheck,
      title: tr ? 'Harika Haber!' : 'Great News!',
      ring: 'bg-emerald-500',
      iconColor: 'text-cream',
      headerBg: 'bg-emerald-600',
    },
    unavailable: {
      Icon: CircleX,
      title: tr ? 'Üzgünüz' : 'Sorry',
      ring: 'bg-rose-500',
      iconColor: 'text-cream',
      headerBg: 'bg-rose-600',
    },
    success: {
      Icon: Sparkles,
      title: tr ? 'Rezervasyon Alındı!' : 'Reservation Received!',
      ring: 'bg-gold-500',
      iconColor: 'text-sea-900',
      headerBg: 'bg-sea-900',
    },
    error: {
      Icon: TriangleAlert,
      title: tr ? 'Hata Oluştu' : 'Error',
      ring: 'bg-amber-500',
      iconColor: 'text-cream',
      headerBg: 'bg-amber-600',
    },
    warning: {
      Icon: TriangleAlert,
      title: tr ? 'Bilgilendirme' : 'Heads up',
      ring: 'bg-gold-500',
      iconColor: 'text-sea-900',
      headerBg: 'bg-sea-800',
    },
  }

  const config = configs[type] || configs.error
  const Icon = config.Icon

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-sea-900/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-cream rounded-3xl shadow-[0_30px_80px_rgba(22,59,52,0.45)] max-w-md w-full overflow-hidden border border-gold-300/40 animate-scaleIn">
        <div className={`${config.headerBg} p-8 text-center relative`}>
          <div className={`w-20 h-20 ${config.ring} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-cream/30`}>
            <Icon className={`w-9 h-9 ${config.iconColor}`} strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-cream text-3xl font-light">{config.title}</h2>
        </div>

        <div className="p-8 md:p-10">
          {type === 'available' && (
            <div className="text-center">
              <p className="text-ink-soft text-lg mb-4 leading-relaxed">
                {tr ? 'Seçtiğiniz tarihler ' : 'Selected dates are '}
                <span className="font-semibold text-emerald-700">{tr ? 'müsait!' : 'available!'}</span>
              </p>
              <p className="text-mute text-sm">
                {tr ? 'Rezervasyon formunu doldurup gönderebilirsiniz.' : 'You can fill out and send the reservation form.'}
              </p>
            </div>
          )}

          {type === 'unavailable' && (
            <div className="text-center">
              <p className="text-ink-soft text-lg mb-6 leading-relaxed">
                {data?.message
                  ? data.message
                  : tr
                  ? <>Seçtiğiniz tarihler için rezervasyon <span className="font-semibold text-rose-700">mevcuttur.</span></>
                  : <>Selected dates are <span className="font-semibold text-rose-700">already reserved.</span></>}
              </p>
              <p className="text-mute text-sm mb-5">
                {tr ? 'Lütfen farklı tarihler seçiniz veya bizimle iletişime geçiniz:' : 'Please select different dates or contact us:'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/905331234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-cream transition-all text-[10px] tracking-[0.28em] uppercase font-semibold inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {tr ? 'WhatsApp' : 'WhatsApp'}
                </a>
                <a
                  href="/iletisim"
                  className="px-6 py-3 rounded-full bg-sea-900 hover:bg-sea-800 text-cream transition-all text-[10px] tracking-[0.28em] uppercase font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {tr ? 'İletişim' : 'Contact'}
                </a>
              </div>
            </div>
          )}

          {type === 'success' && data && (
            <div className="space-y-4">
              <div className="bg-sand-50 border border-gold-300/40 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <Eyebrow>{tr ? 'Rezervasyon No' : 'Reservation #'}</Eyebrow>
                  <span className="font-display text-xl font-medium text-sea-900">#{data.id}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gold-300/30">
                  <Eyebrow>{tr ? 'Toplam' : 'Total'}</Eyebrow>
                  <span className="font-display text-2xl font-light text-gold-700">{data.fiyat}</span>
                </div>
              </div>
              <p className="text-mute text-center text-sm leading-relaxed">
                {tr ? 'Talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.' : 'Your request has been received. We will contact you shortly.'}
              </p>
            </div>
          )}

          {type === 'error' && data && (
            <div className="text-center">
              <p className="text-ink-soft text-lg mb-5 leading-relaxed">{data.message}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <a
                  href="https://wa.me/905331234567?text=Merhaba, rezervasyon hakkında bilgi almak istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-cream transition-all text-[10px] tracking-[0.28em] uppercase font-semibold inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href="/iletisim"
                  className="px-6 py-3 rounded-full bg-sea-900 hover:bg-sea-800 text-cream transition-all text-[10px] tracking-[0.28em] uppercase font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {tr ? 'İletişim' : 'Contact'}
                </a>
              </div>
            </div>
          )}

          {type === 'warning' && data && (
            <div className="text-center">
              <p className="text-ink-soft text-lg mb-4 leading-relaxed">{data.message}</p>
              <p className="text-mute text-sm">
                {tr ? 'Aşağıdaki formu doldurmaya devam edebilirsiniz.' : 'You can continue filling out the form below.'}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-7 py-4 rounded-full bg-sea-900 hover:bg-sea-800 text-cream transition-all text-[11px] tracking-[0.28em] uppercase font-semibold shadow-md inline-flex items-center justify-center gap-2"
          >
            {tr ? 'Tamam' : 'Got it'}
            <ChevronRight className="w-3.5 h-3.5 text-gold-300" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   PAGE — Rezervasyon
   ============================================================ */
function RezervasyonContent() {
  const searchParams = useSearchParams()
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()
  const tr = language === 'tr'

  const [formData, setFormData] = useState({
    ad: '', soyad: '', email: '', telefon: '',
    giris: '', cikis: '', kisiSayisi: '2', mesaj: '',
  })

  const [toplamFiyat, setToplamFiyat] = useState(0)
  const [gunSayisi, setGunSayisi] = useState(0)
  const [fiyatDetay, setFiyatDetay] = useState(null)
  const [fiyatLoading, setFiyatLoading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, type: 'available', data: null })
  const [isAvailable, setIsAvailable] = useState(false)

  /* --------- Pricing --------- */
  useEffect(() => {
    if (formData.giris && formData.cikis) hesaplaFiyat()
  }, [formData.giris, formData.cikis]) // eslint-disable-line react-hooks/exhaustive-deps

  const hesaplaFiyat = async () => {
    if (!formData.giris || !formData.cikis) return
    const girisDate = new Date(formData.giris)
    const cikisDate = new Date(formData.cikis)
    const gun = Math.ceil((cikisDate - girisDate) / (1000 * 60 * 60 * 24))
    if (gun <= 0) {
      setGunSayisi(0); setToplamFiyat(0); setFiyatDetay(null)
      return
    }
    setGunSayisi(gun)
    setFiyatLoading(true)
    try {
      const response = await fetch('/api/fiyat/hesapla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giris_tarihi: formData.giris, cikis_tarihi: formData.cikis }),
      })
      const result = await response.json()
      if (result.success) {
        setToplamFiyat(parseFloat(result.toplamFiyat))
        setFiyatDetay(result.gunlukDetay)
      } else {
        setToplamFiyat(gun * 150)
        setFiyatDetay(null)
      }
    } catch (err) {
      console.warn('Fiyat hesaplama hatası:', err)
      setToplamFiyat(gun * 150)
      setFiyatDetay(null)
    } finally {
      setFiyatLoading(false)
    }
  }

  /* --------- Query string preload --------- */
  useEffect(() => {
    const giris = searchParams.get('giris')
    const cikis = searchParams.get('cikis')
    const yetiskin = searchParams.get('yetiskin')

    if (giris || cikis || yetiskin) {
      setFormData((prev) => ({
        ...prev,
        giris: giris || prev.giris,
        cikis: cikis || prev.cikis,
        kisiSayisi: yetiskin || prev.kisiSayisi,
      }))

      if (giris && cikis) {
        checkAvailability(giris, cikis, false).then((ok) => setIsAvailable(ok))
      }
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  /* --------- Formatting helpers --------- */
  const formatTelefon = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }
  const formatIsim = (value) =>
    value.toLowerCase().split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'giris' || name === 'cikis') setIsAvailable(false)
    if (name === 'telefon') {
      setFormData((prev) => ({ ...prev, telefon: formatTelefon(value) }))
    } else if (name === 'ad' || name === 'soyad') {
      setFormData((prev) => ({ ...prev, [name]: formatIsim(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  /* --------- Availability --------- */
  const checkAvailability = async (giris, cikis, showModal = true) => {
    try {
      if (!giris || !cikis) { setIsAvailable(false); return false }
      const girisDate = new Date(giris)
      const cikisDate = new Date(cikis)
      if (isNaN(girisDate.getTime()) || isNaN(cikisDate.getTime())) { setIsAvailable(false); return false }

      const { data: existing, error } = await supabase
        .from('rezervasyonlar')
        .select('giris_tarihi, cikis_tarihi, durum')
        .in('durum', ['onaylandı', 'beklemede'])
      if (error) throw error

      const conflicts = (existing || []).filter((r) => {
        const eGiris = new Date(r.giris_tarihi)
        const eCikis = new Date(r.cikis_tarihi)
        return (
          (girisDate >= eGiris && girisDate < eCikis) ||
          (cikisDate > eGiris && cikisDate <= eCikis) ||
          (girisDate <= eGiris && cikisDate >= eCikis)
        )
      })

      const hasConflict = conflicts.length > 0
      setIsAvailable(!hasConflict)
      if (showModal) {
        setModal({
          isOpen: true,
          type: hasConflict ? 'unavailable' : 'available',
          data: hasConflict ? { conflictingDates: conflicts } : null,
        })
      }
      return !hasConflict
    } catch (err) {
      // Network/fetch error → formu yine de aç, sessizce
      const msg = String(err?.message || '')
      const isNetworkError =
        msg.includes('Failed to fetch') ||
        msg.includes('NetworkError') ||
        msg.includes('ERR_NAME_NOT_RESOLVED') ||
        err?.code === 'ENOTFOUND'

      if (isNetworkError) {
        // Sunucuya ulaşılamıyor (dev env): formu sessizce aç.
        // Production'da Supabase çalışacağı için bu yola normalde girilmez.
        console.warn('[rezervasyon] Müsaitlik servisine ulaşılamadı — form sessizce açılıyor.')
        setIsAvailable(true)
        return true
      }

      // Beklenmeyen hata — sadece uyarı seviyesinde logla, Next dev overlay'i tetikleme
      console.warn('[rezervasyon] Müsaitlik kontrolü hatası:', err)
      setIsAvailable(false)
      if (showModal) {
        setModal({
          isOpen: true,
          type: 'error',
          data: {
            message: tr
              ? 'Müsaitlik kontrolü sırasında bir hata oluştu. Aşağıdaki kanallardan doğrudan ulaşabilirsiniz:'
              : 'An error occurred during availability check. You can reach us directly below:',
          },
        })
      }
      return false
    }
  }

  const handleAvailabilityCheck = async (e) => {
    e.preventDefault()
    if (!formData.giris || !formData.cikis) {
      setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Lütfen giriş ve çıkış tarihlerini seçiniz.' : 'Please select check-in and check-out dates.' } })
      return
    }
    if (new Date(formData.giris) >= new Date(formData.cikis)) {
      setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Çıkış tarihi, giriş tarihinden sonra olmalıdır.' : 'Check-out must be after check-in.' } })
      return
    }
    setLoading(true)
    await checkAvailability(formData.giris, formData.cikis, true)
    setLoading(false)
  }

  /* --------- Submit --------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.ad.trim() || !formData.soyad.trim()) return setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Lütfen ad ve soyadınızı giriniz.' : 'Please enter your first and last name.' } })
    if (!formData.email.trim()) return setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Lütfen e-posta adresinizi giriniz.' : 'Please enter your email address.' } })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Lütfen geçerli bir e-posta adresi giriniz.' : 'Please enter a valid email address.' } })
    const telefonRakamlar = formData.telefon.replace(/\D/g, '')
    if (telefonRakamlar.length < 10) return setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Lütfen geçerli bir telefon numarası giriniz.' : 'Please enter a valid phone number.' } })
    if (!formData.giris || !formData.cikis) return setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Lütfen giriş ve çıkış tarihlerini seçiniz.' : 'Please select check-in and check-out dates.' } })
    if (new Date(formData.giris) >= new Date(formData.cikis)) return setModal({ isOpen: true, type: 'error', data: { message: tr ? 'Çıkış tarihi, giriş tarihinden sonra olmalıdır.' : 'Check-out must be after check-in.' } })

    setLoading(true)
    try {
      const available = await checkAvailability(formData.giris, formData.cikis, false)
      if (!available) {
        setModal({ isOpen: true, type: 'unavailable', data: { message: tr ? 'Form doldururken bu tarihler için başka bir rezervasyon yapılmış.' : 'These dates have been booked while filling out the form.' } })
        setLoading(false)
        return
      }

      const { data: rezervasyonData, error: dbError } = await supabase
        .from('rezervasyonlar')
        .insert([{
          ad: formData.ad, soyad: formData.soyad,
          email: formData.email, telefon: formData.telefon,
          giris_tarihi: formData.giris, cikis_tarihi: formData.cikis,
          kisi_sayisi: parseInt(formData.kisiSayisi),
          toplam_fiyat: toplamFiyat, mesaj: formData.mesaj,
          durum: 'beklemede', odeme_durumu: 'bekliyor',
        }])
        .select()
      if (dbError) throw dbError

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin_notification',
          data: {
            id: rezervasyonData[0].id,
            ad: formData.ad, soyad: formData.soyad,
            email: formData.email, telefon: formData.telefon,
            giris_tarihi: formData.giris, cikis_tarihi: formData.cikis,
            kisi_sayisi: formData.kisiSayisi,
            toplam_fiyat: toplamFiyat, mesaj: formData.mesaj,
          },
        }),
      })

      setLoading(false)
      setModal({ isOpen: true, type: 'success', data: { id: rezervasyonData[0].id, fiyat: formatPrice(toplamFiyat) } })
    } catch (err) {
      console.warn('Submit error:', err)
      setLoading(false)

      const msg = String(err?.message || '')
      const isNetworkError =
        msg.includes('Failed to fetch') ||
        msg.includes('NetworkError') ||
        msg.includes('ERR_NAME_NOT_RESOLVED') ||
        err?.code === 'ENOTFOUND'

      setModal({
        isOpen: true,
        type: 'error',
        data: {
          message: isNetworkError
            ? (tr
                ? 'Rezervasyonunuz şu an iletilemedi. Lütfen aşağıdaki kanallardan bize doğrudan ulaşın — talebinizi hemen alalım.'
                : 'Your reservation could not be submitted right now. Please reach us directly via the channels below — we will take your request immediately.')
            : (tr
                ? 'Bir hata oluştu. Aşağıdaki kanallardan bize ulaşabilirsiniz:'
                : 'An error occurred. You can reach us via the channels below:'),
        },
      })
    }
  }

  const closeModal = () => setModal({ isOpen: false, type: 'available', data: null })
  const bugun = new Date().toISOString().split('T')[0]

  const infoItems = tr
    ? [
        'Talebiniz aldıktan sonra en kısa sürede size dönüş yapacağız',
        'Müsaitlik durumunu kontrol ederek onay vereceğiz',
        'Check-in: 14:00 | Check-out: 12:00',
        'Nakit veya banka transferi ile ödeme',
        'Giriş tarihinden 7 gün öncesine kadar ücretsiz iptal',
        'Evcil hayvan kabul edilmez',
      ]
    : [
        'We will get back to you as soon as we receive your request',
        'We will check availability and confirm',
        'Check-in: 2:00 PM | Check-out: 12:00 PM',
        'Payment by cash or bank transfer',
        'Free cancellation up to 7 days before check-in',
        'No pets allowed',
      ]

  return (
    <>
      <Navbar />

      <main className="bg-cream">
        {/* ============================ HERO ============================ */}
        <section className="relative h-[480px] md:h-[540px] overflow-visible">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/h4-rev-img-1-1536x864.jpg"
              alt="Reservation hero"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(22,59,52,0.6) 0%, rgba(22,59,52,0.35) 45%, rgba(22,59,52,0.7) 100%)' }}
            />
          </div>

          {/* Hero copy */}
          <div className="relative z-10 container mx-auto px-6 pt-32 flex flex-col items-center text-center">
            <ChapterMarker number="05" label={tr ? 'Rezervasyon' : 'Reservation'} tone="cream" />
            <h1
              className="font-display text-cream text-5xl md:text-7xl font-light leading-[1.05] mt-6"
              style={{ textShadow: '0 4px 24px rgba(22,59,52,0.5)' }}
            >
              {tr ? 'Rezervasyon' : 'Reservation'}
            </h1>
            <div className="my-5">
              <GoldDivider />
            </div>
            <p
              className="max-w-xl text-cream/85 text-base md:text-lg font-light"
              style={{ textShadow: '0 2px 12px rgba(22,59,52,0.5)' }}
            >
              {tr ? 'Hayalinizdeki tatil bir adım uzağınızda.' : 'Your dream vacation is just one step away.'}
            </p>
          </div>

          {/* Floating availability widget */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-full px-4 z-20">
            <div className="max-w-5xl mx-auto bg-cream rounded-2xl border border-gold-300/40 shadow-[0_25px_60px_-20px_rgba(22,59,52,0.45)] overflow-hidden">
              <div className="flex items-center justify-center gap-3 py-3 bg-sea-800 text-cream">
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                <span className="text-[10px] tracking-[0.32em] uppercase font-medium">
                  {tr ? 'Müsaitlik Sorgula' : 'Check Availability'}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              </div>

              <form onSubmit={handleAvailabilityCheck} className="grid grid-cols-1 md:grid-cols-4 gap-0">
                <div className="border-r border-sand-200 p-5 md:p-6">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-3">
                    {tr ? 'Giriş Tarihi *' : 'Check-in *'}
                  </label>
                  <DatePickerTR
                    value={formData.giris}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        giris: val,
                        cikis: prev.cikis && val >= prev.cikis ? '' : prev.cikis,
                      }))
                    }
                    minDate={bugun}
                    placeholder="gg/aa/yyyy"
                    className="w-full"
                    inputClassName="w-full text-base md:text-lg font-light border-0 border-b border-sea-800/30 focus:border-gold-500 py-2 bg-transparent outline-none cursor-pointer text-sea-900 placeholder-mute transition-colors"
                  />
                </div>

                <div className="border-r border-sand-200 p-5 md:p-6">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-3">
                    {tr ? 'Çıkış Tarihi *' : 'Check-out *'}
                  </label>
                  <DatePickerTR
                    value={formData.cikis}
                    onChange={(val) => setFormData((prev) => ({ ...prev, cikis: val }))}
                    minDate={formData.giris || bugun}
                    placeholder="gg/aa/yyyy"
                    className="w-full"
                    inputClassName="w-full text-base md:text-lg font-light border-0 border-b border-sea-800/30 focus:border-gold-500 py-2 bg-transparent outline-none cursor-pointer text-sea-900 placeholder-mute transition-colors"
                  />
                </div>

                <div className="border-r border-sand-200 p-5 md:p-6">
                  <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-3">
                    {tr ? 'Kişi Sayısı *' : 'Guests *'}
                  </label>
                  <select
                    name="kisiSayisi"
                    value={formData.kisiSayisi}
                    onChange={handleChange}
                    required
                    className="w-full text-base md:text-lg font-light border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none bg-transparent transition-colors py-2 appearance-none cursor-pointer text-sea-900 pr-4"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} {tr ? 'kişi' : 'guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 md:p-5 flex items-center justify-center bg-sand-50">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full h-full px-6 py-4 rounded-xl bg-sea-800 hover:bg-sea-900 text-cream transition-all text-[11px] tracking-[0.26em] uppercase font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4 text-gold-300 transition-transform group-hover:scale-110" />
                    {loading ? (tr ? 'Kontrol…' : 'Checking…') : (tr ? 'Müsaitlik' : 'Check')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* ============================ FORM SECTION ============================ */}
        {isAvailable ? (
          <section className="pt-40 md:pt-44 pb-24 bg-cream">
            <div className="container mx-auto px-6 max-w-7xl">
              {/* Confirmation badge */}
              <div className="mb-10 max-w-3xl mx-auto bg-gradient-to-r from-emerald-50 to-cream border border-emerald-300/60 rounded-2xl p-6 shadow-[0_15px_40px_-15px_rgba(22,59,52,0.18)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                    <CircleCheck className="w-7 h-7 text-cream" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-sea-900 font-medium mb-1">
                      {tr ? 'Seçtiğiniz tarihler müsait!' : 'Selected dates are available!'}
                    </h3>
                    <p className="text-sm text-ink-soft font-light">
                      {new Date(formData.giris).toLocaleDateString(tr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' — '}
                      {new Date(formData.cikis).toLocaleDateString(tr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                {/* ========== FORM (left, span 2) ========== */}
                <div className="lg:col-span-2">
                  <div className="bg-cream border border-gold-300/30 rounded-2xl shadow-[0_25px_60px_-20px_rgba(22,59,52,0.25)] overflow-hidden">
                    <div className="border-l-4 border-gold-500 p-8 md:p-12">
                      <form onSubmit={handleSubmit} className="space-y-12">
                        {/* --- Personal info --- */}
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-sea-900 flex items-center justify-center shrink-0">
                              <User className="w-5 h-5 text-gold-300" strokeWidth={1.5} />
                            </div>
                            <div>
                              <Eyebrow>{tr ? 'Adım 1' : 'Step 1'}</Eyebrow>
                              <h2 className="font-display text-2xl md:text-3xl text-sea-900 font-light leading-tight">
                                {tr ? 'Kişisel Bilgiler' : 'Personal Information'}
                              </h2>
                            </div>
                          </div>
                          <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-8" />

                          <div className="grid md:grid-cols-2 gap-7">
                            <div>
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'Ad *' : 'First Name *'}
                              </label>
                              <input
                                type="text"
                                name="ad"
                                value={formData.ad}
                                onChange={handleChange}
                                required
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                                placeholder={tr ? 'Adınız' : 'Your first name'}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'Soyad *' : 'Last Name *'}
                              </label>
                              <input
                                type="text"
                                name="soyad"
                                value={formData.soyad}
                                onChange={handleChange}
                                required
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                                placeholder={tr ? 'Soyadınız' : 'Your last name'}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'E-posta *' : 'Email *'}
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                                placeholder="ornek@email.com"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'Telefon *' : 'Phone *'}
                              </label>
                              <input
                                type="tel"
                                name="telefon"
                                value={formData.telefon}
                                onChange={handleChange}
                                required
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                                placeholder="(5xx) 8xx-xxxx"
                              />
                            </div>
                          </div>
                        </div>

                        {/* --- Reservation details --- */}
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-sea-900 flex items-center justify-center shrink-0">
                              <CalendarCheck className="w-5 h-5 text-gold-300" strokeWidth={1.5} />
                            </div>
                            <div>
                              <Eyebrow>{tr ? 'Adım 2' : 'Step 2'}</Eyebrow>
                              <h2 className="font-display text-2xl md:text-3xl text-sea-900 font-light leading-tight">
                                {tr ? 'Rezervasyon Detayları' : 'Reservation Details'}
                              </h2>
                            </div>
                          </div>
                          <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-8" />

                          <div className="grid md:grid-cols-2 gap-7">
                            <div>
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'Giriş Tarihi *' : 'Check-in *'}
                              </label>
                              <DatePickerTR
                                value={formData.giris}
                                onChange={(val) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    giris: val,
                                    cikis: prev.cikis && val >= prev.cikis ? '' : prev.cikis,
                                  }))
                                }
                                minDate={bugun}
                                placeholder="gg/aa/yyyy"
                                className="w-full"
                                inputClassName="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'Çıkış Tarihi *' : 'Check-out *'}
                              </label>
                              <DatePickerTR
                                value={formData.cikis}
                                onChange={(val) => setFormData((prev) => ({ ...prev, cikis: val }))}
                                minDate={formData.giris || bugun}
                                placeholder="gg/aa/yyyy"
                                className="w-full"
                                inputClassName="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'Kişi Sayısı *' : 'Guests *'}
                              </label>
                              <select
                                name="kisiSayisi"
                                value={formData.kisiSayisi}
                                onChange={handleChange}
                                required
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors appearance-none cursor-pointer"
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>{n} {tr ? 'kişi' : 'guests'}</option>
                                ))}
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                                {tr ? 'Özel İstekler / Notlar' : 'Special Requests / Notes'}
                              </label>
                              <textarea
                                name="mesaj"
                                value={formData.mesaj}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 bg-sand-50 border border-gold-300/30 focus:border-gold-500 rounded-xl outline-none text-sea-900 font-light leading-relaxed transition-colors resize-none placeholder-mute"
                                placeholder={tr ? 'Özel istekleriniz veya sorularınız varsa buraya yazabilirsiniz…' : 'Write any special requests or questions here…'}
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="group w-full mt-10 py-4 rounded-full bg-sea-900 hover:bg-sea-800 text-cream transition-all text-[11px] tracking-[0.28em] uppercase font-semibold shadow-[0_10px_30px_rgba(22,59,52,0.25)] hover:shadow-[0_14px_40px_rgba(22,59,52,0.4)] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
                          >
                            {loading ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {tr ? 'Gönderiliyor…' : 'Sending…'}
                              </>
                            ) : (
                              <>
                                {tr ? 'Rezervasyon Talebini Gönder' : 'Submit Reservation Request'}
                                <ChevronRight className="w-4 h-4 text-gold-300 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </button>

                          <p className="text-center text-mute text-xs mt-6 font-light tracking-wide">
                            {tr ? '* işaretli alanlar zorunludur' : '* Required fields'}
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* ========== SIDEBAR (right, span 1) ========== */}
                <div className="lg:col-span-1">
                  <div className="sticky top-32 space-y-6">
                    {/* Price summary */}
                    {gunSayisi > 0 && (
                      <div className="bg-sea-900 text-cream rounded-2xl p-7 shadow-[0_20px_50px_-20px_rgba(22,59,52,0.5)] border border-gold-500/20">
                        <Eyebrow tone="cream" className="mb-5">
                          {tr ? 'Rezervasyon Özeti' : 'Reservation Summary'}
                        </Eyebrow>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2.5 border-b border-gold-500/15">
                            <span className="text-sm text-cream/70 font-light">
                              {tr ? 'Gece Sayısı' : 'Nights'}
                            </span>
                            <span className="font-display text-xl text-cream font-light">
                              {gunSayisi} {tr ? 'gece' : 'nights'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-gold-500/15">
                            <span className="text-sm text-cream/70 font-light">
                              {tr ? 'Gecelik' : 'Per night'}
                            </span>
                            <span className="font-display text-xl text-cream font-light">
                              {formatPrice(145)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-gold-500/15">
                            <span className="text-sm text-cream/70 font-light">
                              {tr ? 'Kişi Sayısı' : 'Guests'}
                            </span>
                            <span className="font-display text-xl text-cream font-light">
                              {formData.kisiSayisi} {tr ? 'kişi' : 'guests'}
                            </span>
                          </div>
                          <div className="mt-4 bg-gold-500 rounded-xl p-5 flex justify-between items-center">
                            <Eyebrow className="text-sea-900">
                              {tr ? 'Toplam' : 'Total'}
                            </Eyebrow>
                            <span className="font-display text-3xl text-sea-900 font-medium">
                              {fiyatLoading ? '…' : formatPrice(toplamFiyat)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div className="bg-cream border border-gold-300/30 rounded-2xl p-7 shadow-[0_15px_40px_-15px_rgba(22,59,52,0.18)]">
                      <Eyebrow className="mb-5">{tr ? 'Neden Serenity?' : 'Why Serenity?'}</Eyebrow>
                      <ul className="space-y-3 text-sm text-ink-soft font-light leading-relaxed">
                        {infoItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 w-5 h-5 rounded-full bg-gold-50 border border-gold-500/40 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-gold-700" strokeWidth={2.2} />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* WhatsApp */}
                    <div className="bg-gradient-to-br from-emerald-50 to-cream border border-emerald-300/40 rounded-2xl p-7 text-center shadow-[0_15px_40px_-15px_rgba(22,59,52,0.18)]">
                      <MessageCircle className="w-7 h-7 text-emerald-600 mx-auto mb-3" strokeWidth={1.5} />
                      <h3 className="font-display text-xl text-sea-900 font-medium mb-2">
                        {tr ? 'Sorularınız mı var?' : 'Have questions?'}
                      </h3>
                      <p className="text-sm text-mute font-light mb-5">
                        {tr ? 'Rezervasyonunuz hakkında sorularınız için bize ulaşın' : 'Contact us about your reservation'}
                      </p>
                      <a
                        href="https://wa.me/905331234567?text=Merhaba, rezervasyon hakkında bilgi almak istiyorum."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-cream py-3.5 rounded-full text-[11px] tracking-[0.26em] uppercase font-semibold transition-all gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {tr ? 'WhatsApp ile İletişim' : 'Contact via WhatsApp'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          // Müsaitlik kontrolü beklenirken
          <section className="pt-40 md:pt-44 pb-24 bg-cream">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto text-center bg-cream rounded-3xl shadow-[0_25px_60px_-20px_rgba(22,59,52,0.2)] p-12 border border-gold-300/30">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sand-50 border border-gold-500/40 flex items-center justify-center">
                  <Calendar className="w-9 h-9 text-gold-700" strokeWidth={1.5} />
                </div>
                <Eyebrow className="mb-3">{tr ? 'Bir Adım Kaldı' : 'One Step Left'}</Eyebrow>
                <h2 className="font-display text-3xl md:text-4xl text-sea-900 font-light mb-5">
                  {tr ? 'Müsaitlik Kontrolü Gerekli' : 'Check Availability First'}
                </h2>
                <div className="flex justify-center mb-6">
                  <GoldDivider />
                </div>
                <p className="text-ink-soft text-base md:text-lg font-light leading-relaxed mb-7 max-w-md mx-auto">
                  {tr
                    ? 'Rezervasyon formunu doldurmadan önce lütfen yukarıdaki alanda tarih seçerek müsaitlik kontrolü yapınız.'
                    : 'Before filling out the reservation form, please check availability by selecting dates above.'}
                </p>
                <div className="inline-flex items-center gap-2 text-gold-700 font-medium text-[11px] tracking-[0.22em] uppercase">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {tr ? 'Yukarı kaydırın' : 'Scroll up'}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <Modal isOpen={modal.isOpen} onClose={closeModal} type={modal.type} data={modal.data} tr={tr} />
    </>
  )
}

export default function Rezervasyon() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-4" />
            <p className="text-mute text-sm tracking-wider font-light">Yükleniyor…</p>
          </div>
        </div>
      }
    >
      <RezervasyonContent />
    </Suspense>
  )
}
