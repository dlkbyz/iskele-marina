'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Languages, Menu, X, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

const navLinks = {
  tr: [
    { label: 'ANA SAYFA', href: '/' },
    { label: 'GALERİ', href: '/galeri' },
    { label: 'ÖZELLİKLER', href: '/ozellikler' },
    { label: 'YORUMLAR', href: '/yorumlar' },
    { label: 'İLETİŞİM', href: '/iletisim' },
  ],
  en: [
    { label: 'HOME', href: '/' },
    { label: 'GALLERY', href: '/galeri' },
    { label: 'FEATURES', href: '/ozellikler' },
    { label: 'REVIEWS', href: '/yorumlar' },
    { label: 'CONTACT', href: '/iletisim' },
  ],
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
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))
  const bookLabel = language === 'tr' ? 'REZERVASYON' : 'BOOK NOW'

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled ? 'pt-3' : 'pt-4',
        ].join(' ')}
      >
        <div className="px-4 md:px-8">
          <div
            className={[
              'relative rounded-full border backdrop-blur-md transition-all duration-500',
              isScrolled
                ? 'border-gold-300/25 bg-sea-900/95 shadow-[0_8px_40px_rgba(19,64,59,0.5)]'
                : 'border-gold-300/20 bg-sea-900/90 shadow-[0_6px_30px_rgba(19,64,59,0.4)]',
            ].join(' ')}
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-cream/8 to-transparent opacity-60" />

            <div
              className={[
                'relative flex items-center justify-between transition-all duration-500',
                isScrolled ? 'px-5 md:px-7 py-2.5' : 'px-5 md:px-7 py-3',
              ].join(' ')}
            >
              {/* Logo */}
              <Link href="/" className="shrink-0">
                <Image
                  src="/serenity_logo.png"
                  alt="Serenity İskele"
                  width={400}
                  height={160}
                  className={`object-contain transition-all duration-500 ${isScrolled ? 'h-9' : 'h-11'} w-auto`}
                  priority
                />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-9">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      'relative text-[12px] tracking-[0.22em] uppercase font-medium transition-colors',
                      isActive(link.href) ? 'text-gold-300' : 'text-cream/85 hover:text-gold-300',
                    ].join(' ')}
                  >
                    {link.label}
                    <span
                      className={[
                        'absolute left-0 -bottom-2 h-px bg-gold-500 transition-all duration-300',
                        isActive(link.href) ? 'w-full opacity-100' : 'w-0 opacity-0',
                      ].join(' ')}
                    />
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold-300/25 bg-cream/5 px-3.5 py-2 text-[12px] tracking-[0.2em] uppercase font-medium text-cream hover:text-gold-300 hover:border-gold-300/50 transition"
                  aria-label="Toggle language"
                >
                  <Languages className="w-3.5 h-3.5" />
                  {language === 'tr' ? 'TR' : 'EN'}
                </button>

                {pathname !== '/rezervasyon' && (
                  <Link
                    href="/rezervasyon"
                    className={[
                      'hidden md:inline-flex items-center justify-center gap-2 rounded-full',
                      'bg-gold-500 hover:bg-gold-300 text-sea-900',
                      'text-[12px] tracking-[0.26em] uppercase font-semibold shadow-[0_8px_24px_rgba(201,169,97,0.35)] hover:shadow-[0_10px_28px_rgba(201,169,97,0.55)] transition-all',
                      isScrolled ? 'px-5 py-2.5' : 'px-6 py-3',
                    ].join(' ')}
                  >
                    {bookLabel}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden inline-flex w-10 h-10 items-center justify-center rounded-full border border-gold-300/25 bg-cream/5 hover:bg-cream/10 transition"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-cream" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-sea-900/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-sea-900 border-l border-gold-300/15 p-6">
            <div className="flex items-center justify-between mb-10">
              <Image
                src="/serenity_logo.png"
                alt="Serenity İskele"
                width={160}
                height={64}
                className="h-12 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-gold-300/25 bg-cream/5 hover:bg-cream/10 transition flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-cream" />
              </button>
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-300/30 px-4 py-2 text-[12px] tracking-[0.22em] uppercase font-medium text-cream"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === 'tr' ? 'Türkçe' : 'English'}
            </button>

            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3.5 rounded-xl text-[13px] tracking-[0.22em] uppercase font-medium transition ${
                    isActive(link.href)
                      ? 'bg-gold-500/10 text-gold-300 border-l-2 border-gold-500'
                      : 'text-cream/85 hover:bg-cream/5 hover:text-gold-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {pathname !== '/rezervasyon' && (
              <div className="mt-10">
                <Link
                  href="/rezervasyon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gold-500 text-sea-900 text-[12px] tracking-[0.28em] uppercase font-semibold shadow-lg hover:bg-gold-300 transition"
                >
                  {bookLabel}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
