'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Phone, Mail, Clock, Send, ChevronRight, Sparkles, MessageCircle,
} from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Eyebrow, IconInstagram, IconFacebook } from './SiteShell'

export default function Footer() {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const tr = language === 'tr'

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await supabase
        .from('newsletter')
        .insert([{ email, dil: language }])

      if (submitError) {
        if (submitError.code === '23505') {
          setError(tr ? 'Bu e-posta zaten kayıtlı!' : 'This email is already registered!')
        } else {
          throw submitError
        }
      } else {
        setSuccess(true)
        setEmail('')
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err) {
      console.error('Newsletter error:', err)
      setError(tr ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const navLinks = [
    { label: tr ? 'Ana Sayfa' : 'Home', href: '/' },
    { label: tr ? 'Galeri' : 'Gallery', href: '/galeri' },
    { label: tr ? 'Özellikler' : 'Features', href: '/ozellikler' },
    { label: tr ? 'Yorumlar' : 'Reviews', href: '/yorumlar' },
    { label: tr ? 'İletişim' : 'Contact', href: '/iletisim' },
    { label: tr ? 'Rezervasyon' : 'Booking', href: '/rezervasyon' },
  ]

  return (
    <footer className="bg-sea-900 text-cream border-t border-gold-500/15 relative overflow-hidden">
      {/* Ornamental blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 rounded-full bg-gold-500/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sea-400/8 blur-3xl" />

      {/* Newsletter strip */}
      <div className="relative border-b border-gold-500/15">
        <div className="container mx-auto px-6 py-14 md:py-16 text-center">
          <Eyebrow tone="cream" className="mb-4">
            {tr ? 'Bültenimize Katılın' : 'Join the Journal'}
          </Eyebrow>
          <h3 className="font-display text-3xl md:text-4xl text-cream font-light mb-4">
            {tr ? 'Bülten' : 'Newsletter'}
          </h3>
          <p className="text-cream/70 mb-8 max-w-xl mx-auto font-light text-sm md:text-base">
            {tr
              ? 'Özel fırsatlardan, sezon kampanyalarından ve butik konaklama hikayelerinden ilk siz haberdar olun.'
              : 'Be the first to know about special offers, seasonal campaigns and boutique stay stories.'}
          </p>

          {success && (
            <div className="mb-5 mx-auto max-w-md p-3 bg-emerald-500/10 border border-emerald-300/30 rounded-full text-emerald-200 text-sm">
              ✓ {tr ? 'Başarıyla abone oldunuz!' : 'Successfully subscribed!'}
            </div>
          )}
          {error && (
            <div className="mb-5 mx-auto max-w-md p-3 bg-rose-500/10 border border-rose-300/30 rounded-full text-rose-200 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubscribe}
            className="flex gap-2 flex-col sm:flex-row bg-cream/10 backdrop-blur-md p-1.5 rounded-full border border-gold-300/30 hover:border-gold-300/60 transition-all max-w-xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tr ? 'E-posta adresiniz' : 'Your email address'}
              required
              className="flex-1 px-6 py-3.5 border-0 outline-none bg-transparent text-cream placeholder-cream/60 text-sm rounded-full"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="group px-7 py-3.5 bg-gold-500 text-sea-900 hover:bg-gold-300 transition text-[11px] tracking-[0.28em] uppercase font-semibold shadow-md rounded-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (tr ? 'İşleniyor...' : 'Processing...') : (tr ? 'Abone Ol' : 'Subscribe')}
              <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main columns */}
      <div className="relative container mx-auto px-6 pt-16 pb-10">
        <div className="grid md:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/serenity_logo.png"
              alt="Serenity İskele"
              width={180}
              height={72}
              className="h-12 w-auto object-contain mb-5"
            />
            <p className="text-cream/65 text-sm leading-relaxed font-light">
              {tr
                ? 'Kıbrıs İskele bölgesinde butik konaklama. Denize yakın konumu ve modern tasarımıyla unutulmaz tatil anıları.'
                : '2+1 boutique stay in Cyprus Iskele. Create unforgettable memories with our seaside location and modern design.'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <Eyebrow tone="cream" className="mb-5">{tr ? 'İletişim' : 'Contact'}</Eyebrow>
            <ul className="space-y-3.5 text-sm font-light text-cream/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                <span>İskele, KKTC</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                <a href="tel:+905331234567" className="hover:text-gold-300 transition">+90 533 123 45 67</a>
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

          {/* Explore */}
          <div>
            <Eyebrow tone="cream" className="mb-5">{tr ? 'Keşfedin' : 'Explore'}</Eyebrow>
            <ul className="space-y-3 text-sm font-light text-cream/75">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gold-300 transition inline-flex items-center gap-2 group"
                  >
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
              <li>
                <Link href="/kullanim-kosullari" className="hover:text-gold-300 transition inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-gold-500/60 transition-all group-hover:w-4 group-hover:bg-gold-300" />
                  {tr ? 'Kullanım Koşulları' : 'Terms'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <Eyebrow tone="cream" className="mb-5">{tr ? 'Bizi Takip Edin' : 'Follow Us'}</Eyebrow>
            <div className="flex gap-3 mb-6">
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
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold-500/30 hover:border-gold-300 hover:bg-gold-500/10 flex items-center justify-center text-gold-300 transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <Link
              href="/rezervasyon"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 hover:bg-gold-300 text-sea-900 text-[11px] tracking-[0.26em] uppercase font-semibold px-6 py-3 shadow-md transition-all"
            >
              {tr ? 'Rezervasyon' : 'Book Now'}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="border-t border-gold-500/15 pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/55 text-xs tracking-wide">
            © 2026 Serenity İskele. {tr ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-2 text-gold-500/70">
            <span className="block h-px w-6 bg-gold-500/40" />
            <Sparkles className="w-3 h-3" />
            <span className="block h-px w-6 bg-gold-500/40" />
          </div>
        </div>
      </div>
    </footer>
  )
}
