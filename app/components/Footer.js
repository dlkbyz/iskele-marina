'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabase'

export default function Footer() {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
          setError(language === 'tr' ? 'Bu e-posta zaten kayıtlı!' : 'This email is already registered!')
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
      setError(language === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const content = {
    tr: {
      about: {
        title: 'Serenity İskele',
        description: 'Kıbrıs İskele bölgesinde lüks villa kiralama deneyimi. Denize sıfır konumu ve modern tasarımıyla unutulmaz tatil anıları yaratın.'
      },
      quickLinks: {
        title: 'Hızlı Linkler',
        links: [
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Galeri', href: '/galeri' },
          { label: 'Özellikler', href: '/ozellikler' },
          { label: 'Yorumlar', href: '/yorumlar' },
          { label: 'İletişim', href: '/iletisim' },
          { label: 'Rezervasyon', href: '/rezervasyon' }
        ]
      },
      contact: {
        title: 'İletişim',
        email: 'info@serenity-iskele.com',
        phone: '+90 533 123 45 67',
        address: 'İskele, KKTC',
        hours: '7/24 Hizmet'
      },
      newsletter: {
        title: 'Bülten',
        description: 'Özel fırsatlar ve kampanyalardan haberdar olun',
        placeholder: 'E-posta adresiniz',
        button: 'Abone Ol',
        subscribing: 'İşleniyor...',
        success: 'Başarıyla abone oldunuz!',
        privacyNote: 'E-postanız gizli tutulacaktır'
      },
      social: {
        title: 'Bizi Takip Edin'
      },
      bottom: {
        copyright: '© 2026 Serenity İskele. Tüm hakları saklıdır.',
        madeWith: 'ile yapıldı',
        privacy: 'Gizlilik Politikası',
        terms: 'Kullanım Koşulları'
      }
    },
    en: {
      about: {
        title: 'Serenity Iskele',
        description: 'Luxury villa rental experience in Cyprus Iskele region. Create unforgettable vacation memories with our beachfront location and modern design.'
      },
      quickLinks: {
        title: 'Quick Links',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Gallery', href: '/galeri' },
          { label: 'Features', href: '/ozellikler' },
          { label: 'Reviews', href: '/yorumlar' },
          { label: 'Contact', href: '/iletisim' },
          { label: 'Booking', href: '/rezervasyon' }
        ]
      },
      contact: {
        title: 'Contact',
        email: 'info@serenity-iskele.com',
        phone: '+90 533 123 45 67',
        address: 'Iskele, TRNC',
        hours: '24/7 Service'
      },
      newsletter: {
        title: 'Newsletter',
        description: 'Stay updated with special offers and campaigns',
        placeholder: 'Your email address',
        button: 'Subscribe',
        subscribing: 'Processing...',
        success: 'Successfully subscribed!',
        privacyNote: 'Your email will be kept private'
      },
      social: {
        title: 'Follow Us'
      },
      bottom: {
        copyright: '© 2026 Serenity Iskele. All rights reserved.',
        madeWith: 'Made with',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      }
    }
  }

  const t = content[language]

  const socialLinks = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: 'https://instagram.com/serenityiskele',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: 'https://facebook.com/serenityiskele',
      color: 'hover:text-blue-600'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: 'https://wa.me/905331234567',
      color: 'hover:text-green-500'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      url: 'https://twitter.com/serenityiskele',
      color: 'hover:text-sky-500'
    }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Serenity <span className="font-light text-cyan-400">İskele</span>
                </h3>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-cyan-400">{t.quickLinks.title}</h4>
            <ul className="space-y-2">
              {t.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center group"
                  >
                    <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-cyan-400">{t.contact.title}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start text-gray-400">
                <svg className="w-5 h-5 mr-3 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${t.contact.email}`} className="hover:text-cyan-400 transition-colors">
                  {t.contact.email}
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="w-5 h-5 mr-3 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${t.contact.phone.replace(/\s/g, '')}`} className="hover:text-cyan-400 transition-colors">
                  {t.contact.phone}
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="w-5 h-5 mr-3 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t.contact.address}</span>
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="w-5 h-5 mr-3 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t.contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-cyan-400">{t.newsletter.title}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t.newsletter.description}
            </p>
            
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                ✅ {t.newsletter.success}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition text-white placeholder-gray-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-sm"
              >
                {loading ? t.newsletter.subscribing : t.newsletter.button}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              🔒 {t.newsletter.privacyNote}
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold mb-4 text-cyan-400">{t.social.title}</h4>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 ${social.color} transition-all transform hover:scale-110 hover:bg-gray-700`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>{t.bottom.copyright}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{t.bottom.madeWith}</span>
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Serenity Team</span>
            </div>
            <div className="flex gap-4">
              <Link href="/gizlilik" className="hover:text-cyan-400 transition-colors">
                {t.bottom.privacy}
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/kullanim-kosullari" className="hover:text-cyan-400 transition-colors">
                {t.bottom.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
