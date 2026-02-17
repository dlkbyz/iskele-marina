'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'

const navLinks = {
  tr: [
    { label: 'ANA SAYFA', href: '/' },
    { label: 'GALERİ', href: '/galeri' },
    { label: 'ÖZELLİKLER', href: '/ozellikler' },
    { label: 'YORUMLAR', href: '/yorumlar' },
    { label: 'İLETİŞİM', href: '/iletisim' }
  ],
  en: [
    { label: 'HOME', href: '/' },
    { label: 'GALLERY', href: '/galeri' },
    { label: 'FEATURES', href: '/ozellikler' },
    { label: 'REVIEWS', href: '/yorumlar' },
    { label: 'CONTACT', href: '/iletisim' }
  ]
}

export default function Navbar() {
  const pathname = usePathname()
  const { language, toggleLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = navLinks[language] || navLinks.tr
  const isActive = (href) => pathname === href
  const bookLabel = language === 'tr' ? 'REZERVASYON' : 'BOOK NOW'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'}`}>
        <div className="px-5 md:px-10">
          <div className={`relative rounded-2xl border backdrop-blur-md transition-all duration-300 ${
            isScrolled ? 'border-white/20 bg-black/70 shadow-2xl' : 'border-white/20 bg-black/55 shadow-lg'
          }`}>
            {/* Sheen overlay */}
            <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-0'
            }`} />

            <div className={`relative flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'px-5 md:px-8 py-3' : 'px-5 md:px-8 py-4'
            }`}>
              {/* Logo */}
              <Link href="/" className="shrink-0">
                <Image
                  src="/serenity_logo.png"
                  alt="Serenity İskele"
                  width={400}
                  height={160}
                  className={`object-contain transition-all duration-300 ${isScrolled ? 'h-9' : 'h-11'} w-auto`}
                  priority
                />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[12px] md:text-[13px] tracking-[0.18em] uppercase font-medium transition ${
                      isActive(link.href) ? 'text-cyan-200' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute left-0 -bottom-2 h-[2px] bg-cyan-200 rounded-full transition-all duration-300 ${
                      isActive(link.href) ? 'w-full opacity-100' : 'w-0 opacity-0 hover:w-full hover:opacity-100'
                    }`} />
                  </Link>
                ))}
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Language toggle */}
                <div className={`hidden sm:flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-300 ${
                  isScrolled ? 'border border-white/20 bg-white/5' : 'border border-white/15'
                }`}>
                  <button
                    type="button"
                    onClick={() => language !== 'tr' && toggleLanguage()}
                    className={`text-[13px] tracking-[0.18em] uppercase font-medium transition ${
                      language === 'tr' ? 'text-cyan-200' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    TR
                  </button>
                  <span className="text-white/25">|</span>
                  <button
                    type="button"
                    onClick={() => language !== 'en' && toggleLanguage()}
                    className={`text-[13px] tracking-[0.18em] uppercase font-medium transition ${
                      language === 'en' ? 'text-cyan-200' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* CTA — hide on rezervasyon page */}
                {pathname !== '/rezervasyon' && (
                  <Link
                    href="/rezervasyon"
                    className={`hidden md:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[13px] tracking-[0.2em] uppercase font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700 transition ${
                      isScrolled ? 'px-5 py-2.5' : 'px-6 py-3'
                    }`}
                  >
                    {bookLabel}
                  </Link>
                )}

                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className={`md:hidden inline-flex w-10 h-10 items-center justify-center rounded-full transition ${
                    isScrolled ? 'border border-white/20 bg-white/10 hover:bg-white/15' : 'border border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                  aria-label="Open menu"
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
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-[#0b0f17] border-l border-white/10 p-6">
            <div className="flex items-center justify-between mb-8">
              <Image
                src="/serenity_logo.png"
                alt="Serenity İskele"
                width={160}
                height={64}
                className="h-14 w-auto object-contain"
              />
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

            <nav className="flex flex-col gap-2">
              {links.map((link) => (
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

            <div className="mt-6 pt-6 border-t border-white/10 flex gap-4">
              <button
                onClick={() => { language !== 'tr' && toggleLanguage(); setMobileMenuOpen(false) }}
                className={`text-sm tracking-widest uppercase font-medium ${language === 'tr' ? 'text-cyan-300' : 'text-white/50'}`}
              >
                TR
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => { language !== 'en' && toggleLanguage(); setMobileMenuOpen(false) }}
                className={`text-sm tracking-widest uppercase font-medium ${language === 'en' ? 'text-cyan-300' : 'text-white/50'}`}
              >
                EN
              </button>
            </div>

            {pathname !== '/rezervasyon' && (
              <Link
                href="/rezervasyon"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 w-full flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm tracking-widest uppercase font-semibold py-3 shadow-lg"
              >
                {bookLabel}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
