'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export default function Iletisim() {
  const { language } = useLanguage()
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

  const content = {
    tr: {
      hero: {
        badge: 'İLETİŞİM',
        title: 'Bize Ulaşın',
        subtitle: 'Rezervasyon, sorular veya özel istekleriniz için 7/24 yanınızdayız.'
      },
      info: {
        title: 'İletişim Bilgileri',
        items: [
          { label: 'E-Posta', value: 'info@serenity-iskele.com', icon: 'mail' },
          { label: 'Telefon / WhatsApp', value: '+90 533 123 45 67', icon: 'phone' },
          { label: 'Adres', value: 'İskele, Gazimağusa, KKTC', icon: 'location' },
          { label: 'Hizmet', value: '7/24 — Her gün', icon: 'clock' }
        ]
      },
      social: {
        title: 'Sosyal Medya',
        follow: 'Bizi takip edin'
      },
      form: {
        badge: 'MESAJ',
        title: 'Mesaj Gönderin',
        subtitle: 'Formu doldurun, en kısa sürede size dönüş yapalım.',
        name: 'Ad Soyad *',
        email: 'E-posta *',
        phone: 'Telefon',
        subject: 'Konu',
        message: 'Mesajınız *',
        send: 'Mesaj Gönder',
        sending: 'Gönderiliyor...',
        success: 'Mesajınız başarıyla iletildi! En kısa sürede size dönüş yapacağız.',
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      },
      map: {
        title: 'Konumumuz',
        subtitle: 'Kuzey Kıbrıs, İskele'
      },
      book: 'REZERVASYON'
    },
    en: {
      hero: {
        badge: 'CONTACT',
        title: 'Get in Touch',
        subtitle: "We're available 24/7 for bookings, questions, or special requests."
      },
      info: {
        title: 'Contact Details',
        items: [
          { label: 'Email', value: 'info@serenity-iskele.com', icon: 'mail' },
          { label: 'Phone / WhatsApp', value: '+90 533 123 45 67', icon: 'phone' },
          { label: 'Address', value: 'Iskele, Famagusta, TRNC', icon: 'location' },
          { label: 'Service', value: '24/7 — Every day', icon: 'clock' }
        ]
      },
      social: {
        title: 'Social Media',
        follow: 'Follow us'
      },
      form: {
        badge: 'MESSAGE',
        title: 'Send a Message',
        subtitle: 'Fill in the form and we will get back to you as soon as possible.',
        name: 'Full Name *',
        email: 'Email Address *',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Your Message *',
        send: 'Send Message',
        sending: 'Sending...',
        success: 'Your message has been sent! We will get back to you shortly.',
        error: 'An error occurred. Please try again.'
      },
      map: {
        title: 'Our Location',
        subtitle: 'Northern Cyprus, Iskele'
      },
      book: 'BOOK NOW'
    }
  }

  const c = content[language] || content.tr

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/iletisim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad_soyad: formData.ad,
          email: formData.email,
          telefon: formData.telefon,
          konu: formData.konu,
          mesaj: formData.mesaj
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || c.form.error)

      setSuccess(true)
      setFormData({ ad: '', email: '', telefon: '', konu: '', mesaj: '' })
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      console.error('Form error:', err)
      setError(err.message || c.form.error)
    } finally {
      setLoading(false)
    }
  }

  const iconPath = (type) => {
    switch (type) {
      case 'mail':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      case 'phone':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      case 'location':
        return <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      case 'clock':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-cyan-900">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-600/10 translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

        {/* Grid lines overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 container mx-auto text-center">
          <span className="inline-block bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6">
            {c.hero.badge}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 tracking-tight">
            {c.hero.title}
          </h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto">
            {c.hero.subtitle}
          </p>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* CONTACT INFO STRIP */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {c.info.items.map((item, i) => (
              <div key={i} className="group text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-300">
                  <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {iconPath(item.icon)}
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-gray-800 font-medium text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

      {/* FORM + MAP */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-10 items-start">

            {/* CONTACT FORM — 3 cols */}
            <div className="lg:col-span-3">
              <span className="inline-block text-cyan-600 text-xs font-bold tracking-widest bg-cyan-50 px-4 py-1.5 rounded-full mb-4">
                {c.form.badge}
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{c.form.title}</h2>
              <p className="text-gray-500 mb-8">{c.form.subtitle}</p>

              {success && (
                <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{c.form.success}</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {c.form.name}
                    </label>
                    <input
                      type="text"
                      name="ad"
                      value={formData.ad}
                      onChange={handleChange}
                      required
                      placeholder={language === 'tr' ? 'Adınız Soyadınız' : 'Your Full Name'}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {c.form.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ornek@email.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {c.form.phone}
                    </label>
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {c.form.subject}
                    </label>
                    <input
                      type="text"
                      name="konu"
                      value={formData.konu}
                      onChange={handleChange}
                      placeholder={language === 'tr' ? 'Konu başlığı' : 'Subject line'}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {c.form.message}
                  </label>
                  <textarea
                    name="mesaj"
                    value={formData.mesaj}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={language === 'tr' ? 'Mesajınızı buraya yazın...' : 'Type your message here...'}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition resize-none text-gray-800 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold tracking-wide hover:shadow-xl hover:shadow-cyan-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {c.form.sending}
                    </>
                  ) : (
                    <>
                      {c.form.send}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN — 2 cols: info card + map */}
            <div className="lg:col-span-2 space-y-6">

              {/* Dark info card */}
              <div className="bg-gray-900 rounded-3xl p-8 text-white">
                <h3 className="text-sm font-bold tracking-widest text-cyan-400 uppercase mb-6">{c.info.title}</h3>
                <div className="space-y-5">
                  {c.info.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {iconPath(item.icon)}
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social icons inside card */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-4">{c.social.follow}</p>
                  <div className="flex gap-3">
                    {[
                      { name: 'Instagram', url: 'https://instagram.com/serenityiskele', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                      { name: 'Facebook', url: 'https://facebook.com/serenityiskele', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                      { name: 'WhatsApp', url: 'https://wa.me/905331234567', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' }
                    ].map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all duration-200"
                        title={s.name}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d={s.path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="px-6 py-4 bg-white flex items-center justify-between border-b border-gray-100">
                  <div>
                    <p className="font-bold text-gray-900">{c.map.title}</p>
                    <p className="text-xs text-gray-500">{c.map.subtitle}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26113.04699691!2d33.9!3d35.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de1767ca494d55%3A0x324c6c7f3e347cb7!2sIskele%2C%20Cyprus!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="260"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
