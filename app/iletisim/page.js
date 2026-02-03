'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Iletisim() {
  const pathname = usePathname()
  const [language, setLanguage] = useState('TR')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [formData, setFormData] = useState({
    ad: '',
    email: '',
    telefon: '',
    konu: '',
    mesaj: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
        badge: '📧 İLETİŞİM',
        title: 'Bize Ulaşın',
        description: 'Sorularınız için buradayız',
        subtitle: 'Her zaman size yardımcı olmaya hazırız'
      },
      contact: {
        email: {
          title: 'E-posta',
          value: 'info@serenity-iskele.com',
          desc: 'Bize her zaman yazabilirsiniz'
        },
        phone: {
          title: 'Telefon',
          value: '+90 533 123 45 67',
          desc: 'WhatsApp & Viber'
        },
        address: {
          title: 'Adres',
          value: 'İskele, KKTC',
          desc: 'Deniz manzaralı konaklama'
        },
        hours: {
          title: 'Çalışma Saatleri',
          value: '7/24 Hizmet',
          desc: 'Her zaman ulaşabilirsiniz'
        }
      },
      form: {
        title: 'Mesaj Gönderin',
        desc: 'Formu doldurun, size en kısa sürede geri dönelim',
        fields: {
          name: 'Ad Soyad',
          email: 'E-posta Adresi',
          phone: 'Telefon',
          subject: 'Konu',
          message: 'Mesajınız'
        },
        subjects: {
          placeholder: 'Konu seçin',
          reservation: 'Rezervasyon',
          price: 'Fiyat Bilgisi',
          features: 'Özellikler',
          location: 'Konum & Ulaşım',
          other: 'Diğer'
        },
        button: {
          send: '✉ Mesaj Gönder',
          sending: 'Gönderiliyor...'
        },
        success: 'Mesajınız alındı! En kısa sürede dönüş yapacağız.',
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        required: '* ile işaretli alanlar zorunludur'
      }
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
        badge: '📧 CONTACT',
        title: 'Get in Touch',
        description: "We're here for your questions",
        subtitle: 'Always ready to help you'
      },
      contact: {
        email: {
          title: 'Email',
          value: 'info@serenity-iskele.com',
          desc: 'You can always write to us'
        },
        phone: {
          title: 'Phone',
          value: '+90 533 123 45 67',
          desc: 'WhatsApp & Viber'
        },
        address: {
          title: 'Address',
          value: 'İskele, TRNC',
          desc: 'Sea view accommodation'
        },
        hours: {
          title: 'Working Hours',
          value: '24/7 Service',
          desc: 'Always reachable'
        }
      },
      form: {
        title: 'Send Message',
        desc: 'Fill out the form and we will get back to you soon',
        fields: {
          name: 'Full Name',
          email: 'Email Address',
          phone: 'Phone',
          subject: 'Subject',
          message: 'Your Message'
        },
        subjects: {
          placeholder: 'Select subject',
          reservation: 'Reservation',
          price: 'Pricing',
          features: 'Features',
          location: 'Location & Transport',
          other: 'Other'
        },
        button: {
          send: '✉ Send Message',
          sending: 'Sending...'
        },
        success: 'Message received! We will get back to you soon.',
        error: 'An error occurred. Please try again.',
        required: '* Required fields'
      }
    }
  }

  const t = content[language]
  const navLinks = t.navLinks
  const isActive = (href) => pathname === href

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const adSoyad = formData.ad.trim().split(' ')
      const ad = adSoyad[0] || ''
      const soyad = adSoyad.slice(1).join(' ') || ''

      const { data, error } = await supabase
        .from('iletisim_mesajlari')
        .insert([
          {
            ad: ad,
            soyad: soyad,
            email: formData.email,
            telefon: formData.telefon,
            konu: formData.konu,
            mesaj: formData.mesaj,
            okundu: false
          }
        ])
        .select()

      if (error) throw error

      setLoading(false)
      setSuccess(true)
      
      setTimeout(() => {
        setFormData({
          ad: '',
          email: '',
          telefon: '',
          konu: '',
          mesaj: ''
        })
        setSuccess(false)
      }, 5000)
      
    } catch (error) {
      console.error('Supabase Error:', error.message, error)
      setLoading(false)
      setError(error.message || t.form.error)
    }
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
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop"
              alt="Contact Hero"
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
            <div className="max-w-6xl mx-auto">
              
              {/* İletişim Kartları Grid */}
              <div className="grid md:grid-cols-4 gap-5 mb-16 animate-[fadeIn_1s_ease-out]">
                {/* Email Card */}
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 font-semibold">{t.contact.email.title}</h3>
                    <a href={`mailto:${t.contact.email.value}`} className="text-sm font-bold text-gray-900 hover:text-cyan-600 transition block mb-1">
                      {t.contact.email.value}
                    </a>
                    <p className="text-xs text-gray-500 font-light">{t.contact.email.desc}</p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 font-semibold">{t.contact.phone.title}</h3>
                    <a href={`tel:${t.contact.phone.value}`} className="text-sm font-bold text-gray-900 hover:text-green-600 transition block mb-1">
                      {t.contact.phone.value}
                    </a>
                    <p className="text-xs text-gray-500 font-light">{t.contact.phone.desc}</p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 font-semibold">{t.contact.address.title}</h3>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {t.contact.address.value}
                    </p>
                    <p className="text-xs text-gray-500 font-light">{t.contact.address.desc}</p>
                  </div>
                </div>

                {/* Hours Card */}
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-600"></div>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 font-semibold">{t.contact.hours.title}</h3>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {t.contact.hours.value}
                    </p>
                    <p className="text-xs text-gray-500 font-light">{t.contact.hours.desc}</p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Sol: Form */}
                <div>
                  <div className="relative bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden">
                    {/* Decorative gradient backgrounds */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-pink-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                      <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}>
                          {t.form.title}
                        </h2>
                        <p className="text-sm text-gray-600 font-light">{t.form.desc}</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                            {t.form.fields.name} *
                          </label>
                          <input
                            type="text"
                            name="ad"
                            value={formData.ad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition bg-white hover:border-gray-300"
                            placeholder={t.form.fields.name}
                          />
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                            {t.form.fields.email} *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition bg-white hover:border-gray-300"
                            placeholder={t.form.fields.email}
                          />
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                            {t.form.fields.phone}
                          </label>
                          <input
                            type="tel"
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition bg-white hover:border-gray-300"
                            placeholder={t.form.fields.phone}
                          />
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                            {t.form.fields.subject} *
                          </label>
                          <select
                            name="konu"
                            value={formData.konu}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition bg-white hover:border-gray-300 cursor-pointer"
                          >
                            <option value="">{t.form.subjects.placeholder}</option>
                            <option value="rezervasyon">{t.form.subjects.reservation}</option>
                            <option value="fiyat">{t.form.subjects.price}</option>
                            <option value="ozellikler">{t.form.subjects.features}</option>
                            <option value="ulasim">{t.form.subjects.location}</option>
                            <option value="diger">{t.form.subjects.other}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-semibold mb-2">
                            {t.form.fields.message} *
                          </label>
                          <textarea
                            name="mesaj"
                            value={formData.mesaj}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 rounded-xl outline-none transition resize-none bg-white hover:border-gray-300 font-light"
                            placeholder={t.form.fields.message}
                          ></textarea>
                        </div>

                        {success && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-4 py-4 rounded-xl text-sm flex items-center animate-[fadeIn_0.5s_ease-out]">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="font-bold">{t.form.success}</p>
                          </div>
                        )}

                        {error && (
                          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800 px-4 py-4 rounded-xl text-sm">
                            <p className="font-light">{error}</p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl text-sm tracking-[0.2em] uppercase font-bold hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] duration-300"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t.form.button.sending}
                            </span>
                          ) : (
                            t.form.button.send
                          )}
                        </button>
                        
                        <p className="text-center text-gray-500 text-xs mt-4 font-light tracking-wide">
                          {t.form.required}
                        </p>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Sağ: Map */}
                <div>
                  <div className="rounded-[2rem] overflow-hidden shadow-2xl h-full min-h-[600px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52220.89364405693!2d33.87899!3d35.29333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de178ddb1d5d1f%3A0x9a71c2c746663a8e!2sIskele%2C%20Cyprus!5e0!3m2!1sen!2s!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
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