'use client'

import { useState } from 'react'
import {
  Mail, Phone, MapPin, Clock, Send, MessageCircle, Sparkles, ChevronRight,
} from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  ChapterMarker, GoldDivider, Eyebrow, IconInstagram, IconFacebook, useHeroSlot,
} from '../components/SiteShell'

export default function Iletisim() {
  const { language } = useLanguage()
  const tr = language === 'tr'
  const heroImage = useHeroSlot('iletisim_hero', '/h4-rev-img-1-1536x864.jpg')

  const [formData, setFormData] = useState({
    ad: '', email: '', telefon: '', konu: '', mesaj: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const formatTelefon = (raw) => {
    let d = (raw || '').replace(/\D/g, '')
    if (d.startsWith('90')) d = d.slice(2)
    if (d.startsWith('0')) d = d.slice(1)
    d = d.slice(0, 10)
    if (!d) return ''
    let out = '+90 ' + d.slice(0, 3)
    if (d.length > 3) out += ' ' + d.slice(3, 6)
    if (d.length > 6) out += ' ' + d.slice(6, 8)
    if (d.length > 8) out += ' ' + d.slice(8, 10)
    return out
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'telefon') {
      setFormData({ ...formData, telefon: formatTelefon(value) })
      return
    }
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.telefon && !/^\+90 5\d{2} \d{3} \d{2} \d{2}$/.test(formData.telefon)) {
      setError(tr
        ? 'Telefon numarası +90 5XX XXX XX XX formatında olmalıdır.'
        : 'Phone must be in +90 5XX XXX XX XX format.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/iletisim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad_soyad: formData.ad,
          email: formData.email,
          telefon: formData.telefon,
          konu: formData.konu,
          mesaj: formData.mesaj,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Hata')

      setSuccess(true)
      setFormData({ ad: '', email: '', telefon: '', konu: '', mesaj: '' })
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      console.error('Form error:', err)
      setError(err.message || (tr ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const infoItems = [
    { Icon: Mail,   label: tr ? 'E-Posta' : 'Email',         value: 'info@serenity-iskele.com', href: 'mailto:info@serenity-iskele.com' },
    { Icon: Phone,  label: tr ? 'Telefon / WhatsApp' : 'Phone / WhatsApp', value: '+90 533 123 45 67', href: 'tel:+905331234567' },
    { Icon: MapPin, label: tr ? 'Adres'   : 'Address',       value: tr ? 'İskele, Gazimağusa, KKTC' : 'Iskele, Famagusta, TRNC' },
    { Icon: Clock,  label: tr ? 'Hizmet'  : 'Service',       value: tr ? '7/24 — Her gün' : '24/7 — Every day' },
  ]

  return (
    <>
      <Navbar />

      <main className="bg-cream">
        {/* ============================ HERO ============================ */}
        <section className="relative h-[460px] md:h-[520px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Contact hero"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(19,64,59,0.6) 0%, rgba(19,64,59,0.35) 45%, rgba(19,64,59,0.7) 100%)' }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-20">
            <ChapterMarker number="04" label={tr ? 'İletişim' : 'Contact'} tone="cream" />
            <h1
              className="font-display text-cream text-5xl md:text-7xl font-light leading-[1.05] mt-6"
              style={{ textShadow: '0 4px 24px rgba(19,64,59,0.5)' }}
            >
              {tr ? 'Bize ulaşın' : 'Get in touch'}
            </h1>
            <div className="my-6">
              <GoldDivider />
            </div>
            <p
              className="max-w-xl text-cream/85 text-base md:text-lg font-light"
              style={{ textShadow: '0 2px 12px rgba(19,64,59,0.5)' }}
            >
              {tr
                ? 'Rezervasyon, sorular veya özel istekleriniz için 7/24 yanınızdayız.'
                : "We're available 24/7 for bookings, questions, or special requests."}
            </p>
          </div>
        </section>

        {/* ============================ INFO STRIP ============================ */}
        <section className="relative -mt-12 z-20 mb-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-cream border border-gold-300/40 rounded-2xl shadow-[0_25px_60px_-20px_rgba(19,64,59,0.3)] p-8 md:p-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {infoItems.map(({ Icon, label, value, href }, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-sand-50 border border-gold-500/40 flex items-center justify-center group-hover:bg-gold-50 group-hover:border-gold-500 transition-all duration-500">
                      <Icon className="w-5 h-5 text-sea-800 group-hover:text-gold-700 transition" strokeWidth={1.5} />
                    </div>
                    <Eyebrow className="mb-2">{label}</Eyebrow>
                    {href ? (
                      <a href={href} className="text-sea-900 font-medium text-sm hover:text-gold-600 transition">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sea-900 font-medium text-sm">{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ FORM + SIDE ============================ */}
        <section className="py-20 md:py-24 bg-cream">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-5 gap-10 items-start">
              {/* FORM */}
              <div className="lg:col-span-3">
                <Eyebrow className="mb-4">{tr ? 'Mesaj' : 'Message'}</Eyebrow>
                <h2 className="font-display text-4xl md:text-5xl text-sea-900 font-light leading-tight mb-4">
                  {tr ? 'Mesaj gönderin' : 'Send a message'}
                </h2>
                <div className="w-12 h-px bg-gold-500 mb-6" />
                <p className="text-ink-soft font-light mb-10">
                  {tr
                    ? 'Formu doldurun, en kısa sürede size dönüş yapalım.'
                    : 'Fill in the form and we will get back to you as soon as possible.'}
                </p>

                {success && (
                  <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" />
                    <span>{tr
                      ? 'Mesajınız başarıyla iletildi! En kısa sürede size dönüş yapacağız.'
                      : 'Your message has been sent! We will get back to you shortly.'}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                        {tr ? 'Ad Soyad *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        name="ad"
                        value={formData.ad}
                        onChange={handleChange}
                        required
                        placeholder={tr ? 'Adınız Soyadınız' : 'Your full name'}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
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
                        placeholder="ornek@email.com"
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                        {tr ? 'Telefon' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        placeholder="+90 5XX XXX XX XX"
                        inputMode="tel"
                        maxLength={17}
                        autoComplete="tel"
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                        {tr ? 'Konu' : 'Subject'}
                      </label>
                      <input
                        type="text"
                        name="konu"
                        value={formData.konu}
                        onChange={handleChange}
                        placeholder={tr ? 'Konu başlığı' : 'Subject line'}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-sea-800/30 focus:border-gold-500 outline-none text-sea-900 font-light text-lg transition-colors placeholder-mute"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.28em] uppercase text-gold-700 font-semibold mb-2">
                      {tr ? 'Mesajınız *' : 'Your Message *'}
                    </label>
                    <textarea
                      name="mesaj"
                      value={formData.mesaj}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={tr ? 'Mesajınızı buraya yazın…' : 'Type your message here…'}
                      className="w-full px-4 py-3 bg-sand-50 border border-gold-300/30 focus:border-gold-500 rounded-xl outline-none text-sea-900 font-light leading-relaxed transition-colors placeholder-mute resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-sea-900 hover:bg-sea-800 text-cream transition-all text-[11px] tracking-[0.28em] uppercase font-semibold shadow-[0_10px_30px_rgba(19,64,59,0.25)] hover:shadow-[0_14px_40px_rgba(19,64,59,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
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
                        {tr ? 'Mesaj Gönder' : 'Send Message'}
                        <Send className="w-3.5 h-3.5 text-gold-300 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* SIDE: Dark info card + Map */}
              <div className="lg:col-span-2 space-y-6">
                {/* Dark contact card */}
                <div className="bg-sea-900 rounded-2xl p-8 text-cream border border-gold-500/20 shadow-[0_25px_60px_-20px_rgba(19,64,59,0.4)]">
                  <Eyebrow tone="cream" className="mb-6">
                    {tr ? 'İletişim Bilgileri' : 'Contact Details'}
                  </Eyebrow>

                  <ul className="space-y-5">
                    {infoItems.map(({ Icon, label, value, href }, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cream/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-gold-300" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.28em] uppercase text-gold-300/80 font-semibold mb-1">
                            {label}
                          </p>
                          {href ? (
                            <a href={href} className="text-cream font-medium hover:text-gold-300 transition">
                              {value}
                            </a>
                          ) : (
                            <p className="text-cream font-medium">{value}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Social */}
                  <div className="mt-8 pt-7 border-t border-gold-500/15">
                    <Eyebrow tone="cream" className="mb-4">
                      {tr ? 'Bizi Takip Edin' : 'Follow Us'}
                    </Eyebrow>
                    <div className="flex gap-3">
                      <a
                        href="https://instagram.com/serenityiskele"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="w-10 h-10 rounded-full border border-gold-500/30 hover:border-gold-300 hover:bg-gold-500/10 flex items-center justify-center text-gold-300 transition"
                      >
                        <IconInstagram className="w-4 h-4" />
                      </a>
                      <a
                        href="https://facebook.com/serenityiskele"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="w-10 h-10 rounded-full border border-gold-500/30 hover:border-gold-300 hover:bg-gold-500/10 flex items-center justify-center text-gold-300 transition"
                      >
                        <IconFacebook className="w-4 h-4" />
                      </a>
                      <a
                        href="https://wa.me/905331234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="w-10 h-10 rounded-full border border-gold-500/30 hover:border-gold-300 hover:bg-gold-500/10 flex items-center justify-center text-gold-300 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-gold-300/30 bg-cream shadow-[0_15px_40px_-15px_rgba(19,64,59,0.2)]">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-gold-300/30">
                    <div>
                      <Eyebrow className="mb-1">{tr ? 'Konumumuz' : 'Our Location'}</Eyebrow>
                      <p className="font-display text-xl text-sea-900 font-light">
                        {tr ? 'Kuzey Kıbrıs, İskele' : 'Northern Cyprus, Iskele'}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-sea-900" strokeWidth={1.5} />
                    </div>
                  </div>
                  <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26113.04699691!2d33.9!3d35.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de1767ca494d55%3A0x324c6c7f3e347cb7!2sIskele%2C%20Cyprus!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="280"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Reservation CTA */}
                <a
                  href="/rezervasyon"
                  className="group flex items-center justify-between gap-3 px-6 py-5 rounded-2xl bg-gold-500 hover:bg-gold-300 text-sea-900 transition-all shadow-[0_10px_30px_rgba(201,169,97,0.35)]"
                >
                  <div>
                    <p className="text-[10px] tracking-[0.28em] uppercase font-semibold opacity-80">
                      {tr ? 'Doğrudan' : 'Skip the form'}
                    </p>
                    <p className="text-base font-display font-medium">
                      {tr ? 'Rezervasyon Yap' : 'Book Now'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
