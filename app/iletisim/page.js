'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '../components/Footer'

// Intersection Observer hook
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

export default function Iletisim() {
  const pathname = usePathname()
  const { language, toggleLanguage, t } = useLanguage()
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

  const [heroRef, heroInView] = useInView()
  const [contactRef, contactInView] = useInView()
  const [formRef, formInView] = useInView()
  const [mapRef, mapInView] = useInView()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        title: 'Bize Ulaşın',
        subtitle: 'Sorularınız için buradayız'
      },
      contact: {
        title: 'İletişim Bilgileri',
        email: { title: 'E-posta', value: 'info@serenity-iskele.com' },
        phone: { title: 'Telefon', value: '+90 533 123 45 67' },
        address: { title: 'Adres', value: 'İskele, KKTC' },
        hours: { title: 'Çalışma Saatleri', value: '7/24 Hizmet' }
      },
      social: {
        title: 'Sosyal Medya',
        subtitle: 'Bizi takip edin'
      },
      form: {
        title: 'Mesaj Gönderin',
        subtitle: 'Formu doldurun, en kısa sürede dönüş yapalım',
        name: 'Ad Soyad',
        email: 'E-posta',
        phone: 'Telefon',
        subject: 'Konu',
        message: 'Mesajınız',
        send: 'Gönder',
        sending: 'Gönderiliyor...',
        success: 'Mesajınız başarıyla gönderildi!',
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      },
      map: {
        title: 'Konumumuz',
        subtitle: 'Haritada bizi bulun'
      }
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
        title: 'Get in Touch',
        subtitle: "We're here for your questions"
      },
      contact: {
        title: 'Contact Information',
        email: { title: 'Email', value: 'info@serenity-iskele.com' },
        phone: { title: 'Phone', value: '+90 533 123 45 67' },
        address: { title: 'Address', value: 'Iskele, TRNC' },
        hours: { title: 'Working Hours', value: '24/7 Service' }
      },
      social: {
        title: 'Social Media',
        subtitle: 'Follow us'
      },
      form: {
        title: 'Send Message',
        subtitle: 'Fill out the form and we will get back to you soon',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Your Message',
        send: 'Send',
        sending: 'Sending...',
        success: 'Your message has been sent successfully!',
        error: 'An error occurred. Please try again.'
      },
      map: {
        title: 'Our Location',
        subtitle: 'Find us on the map'
      }
    }
  }

  const isActive = (href) => pathname === href
  const t_local = content[language]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await supabase
        .from('iletisim_mesajlari')
        .insert([
          {
            ad_soyad: formData.ad,
            email: formData.email,
            telefon: formData.telefon,
            konu: formData.konu,
            mesaj: formData.mesaj,
            okundu: false
          }
        ])

      if (submitError) throw submitError

      setSuccess(true)
      setFormData({ ad: '', email: '', telefon: '', konu: '', mesaj: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Form error:', err)
      setError(t_local.form.error)
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: 'https://instagram.com/serenityiskele',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: 'https://facebook.com/serenityiskele',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: 'https://wa.me/905331234567',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Email',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      url: 'mailto:info@serenity-iskele.com',
      color: 'from-cyan-500 to-blue-500'
    }
  ]

  const contactInfo = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t_local.contact.email.title,
      value: t_local.contact.email.value,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: t_local.contact.phone.title,
      value: t_local.contact.phone.value,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t_local.contact.address.title,
      value: t_local.contact.address.value,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t_local.contact.hours.title,
      value: t_local.contact.hours.value,
      gradient: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HEADER - Identical to other pages */}
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
            <div className="inline-block bg-cyan-100 text-cyan-600 px-6 py-2 rounded-full font-semibold text-sm mb-6">
              📧 {language === 'tr' ? 'İLETİŞİM' : 'CONTACT'}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {t_local.hero.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t_local.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div
            ref={contactRef}
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transform transition-all duration-1000 delay-200 ${
              contactInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t_local.social.title}</h2>
            <p className="text-gray-600">{t_local.social.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {social.icon}
                </div>
                <span className="font-semibold text-gray-800">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FORM & MAP SECTION */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* CONTACT FORM */}
            <div
              ref={formRef}
              className={`transform transition-all duration-1000 ${
                formInView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t_local.form.title}</h2>
                <p className="text-gray-600 mb-8">{t_local.form.subtitle}</p>

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 animate-fadeIn">
                    ✅ {t_local.form.success}
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 animate-fadeIn">
                    ❌ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t_local.form.name}
                    </label>
                    <input
                      type="text"
                      name="ad"
                      value={formData.ad}
                      onChange={handleChange}
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t_local.form.phone}
                    </label>
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t_local.form.subject}
                    </label>
                    <input
                      type="text"
                      name="konu"
                      value={formData.konu}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t_local.form.message}
                    </label>
                    <textarea
                      name="mesaj"
                      value={formData.mesaj}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {loading ? t_local.form.sending : t_local.form.send}
                  </button>
                </form>
              </div>
            </div>

            {/* MAP */}
            <div
              ref={mapRef}
              className={`transform transition-all duration-1000 delay-200 ${
                mapInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl h-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t_local.map.title}</h2>
                <p className="text-gray-600 mb-6">{t_local.map.subtitle}</p>
                
                <div className="rounded-2xl overflow-hidden h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26113.04699691!2d33.9!3d35.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de1767ca494d55%3A0x324c6c7f3e347cb7!2sIskele%2C%20Cyprus!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
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
