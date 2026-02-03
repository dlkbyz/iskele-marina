'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Galeri() {
  const router = useRouter()
  const pathname = usePathname()
  const [language, setLanguage] = useState('TR')
  const [selectedImage, setSelectedImage] = useState(null)
  const [fotolar, setFotolar] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    loadFotolar()
  }, [])

  const loadFotolar = async () => {
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .eq('aktif', true)
        .order('sira', { ascending: true })

      if (error) throw error
      setFotolar(data || [])
    } catch (error) {
      console.error('Hata:', error)
    } finally {
      setLoading(false)
    }
  }

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
      gallery: {
        badge: 'Galeri',
        title: 'Fotoğraf Galerisi',
        description: 'Serenity Iskele\'den görüntüler ve detaylar'
      },
      footer: {
        about: {
          title: 'Hakkımızda',
          desc: "Serenity Iskele'e hoş geldiniz, konfor her şeydir. Güzel oda sunumları, basit rezervasyon seçenekleri."
        },
        contact: 'İletişim',
        social: 'Sosyal Medya',
        copyright: '© 2025 Serenity Iskele'
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
      gallery: {
        badge: 'Gallery',
        title: 'Photo Gallery',
        description: 'Views and details from Serenity Iskele'
      },
      footer: {
        about: {
          title: 'About',
          desc: "Welcome to Serenity Iskele, where comfort is everything. Beautiful room presentations, straightforward booking options."
        },
        contact: 'Contact',
        social: 'Get Social',
        copyright: '© 2025 Serenity Iskele'
      }
    }
  }

  const t = content[language]
  const navLinks = t.navLinks
  const isActive = (href) => pathname === href

  // Fallback fotoğraflar - Profesyonel iç mekan
  const fallbackImages = [
    { image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=1000&fit=crop', baslik: 'Living Room' },
    { image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=1200&fit=crop', baslik: 'Bedroom' },
    { image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=900&fit=crop', baslik: 'Modern Kitchen' },
    { image_url: 'https://images.unsplash.com/photo-1552938397-2ff2b0f5fdd4?w=800&h=600&fit=crop', baslik: 'Bathroom' },
    { image_url: 'https://images.unsplash.com/photo-1565183938294-7563f3ce68c5?w=800&h=1000&fit=crop', baslik: 'Bedroom Design' },
    { image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', baslik: 'Living Space' }
  ]

  const displayImages = fotolar.length > 0 ? fotolar : fallbackImages

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
              <nav className="flex items-center gap-8">
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
                    'lg:hidden inline-flex w-10 h-10 items-center justify-center rounded-full transition',
                    isScrolled
                      ? 'border border-white/20 bg-white/10 hover:bg-white/15'
                      : 'border border-white/15 bg-white/5 hover:bg-white/10'
                  ].join(' ')}
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

            <nav className="flex flex-col gap-2">
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
          </div>
        </div>
      )}

      <main className="pt-0">
        {/* HERO SECTION */}
        <section className="relative h-80 md:h-96 mt-0">
          <div className="absolute inset-0">
            <img
              src="https://uvadqixzovxsjrzjayom.supabase.co/storage/v1/object/public/mainpage/kibris-altinkum-plaji.jpg"
              alt="Gallery Hero"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1631049307038-da5ec5d27288?w=1920&h=1080&fit=crop"
              }}
            />
            <div className="absolute inset-0 bg-black/18" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/6 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
            <div className="px-6 py-5 md:px-10 md:py-7 rounded-2xl bg-black/22 backdrop-blur-md border border-white/15 shadow-2xl">
              <p className="text-xs tracking-[0.3em] uppercase text-white/90 mb-3 font-light">{t.gallery.badge}</p>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-serif mb-3 text-white"
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                  textShadow: '0 10px 34px rgba(0,0,0,0.75)'
                }}
              >
                {t.gallery.title}
              </h1>

              <p
                className="text-sm md:text-base font-medium text-white/95 tracking-wide"
                style={{
                  textShadow: '0 6px 22px rgba(0,0,0,0.70)'
                }}
              >
                {t.gallery.description}
              </p>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
                <p className="text-gray-600 mt-4 font-light">Yükleniyor...</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {displayImages.map((img, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 break-inside-avoid cursor-pointer"
                    onClick={() => setSelectedImage(img.image_url)}
                  >
                    <img
                      src={img.image_url}
                      alt={img.baslik || `Gallery ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-white text-5xl">🔍</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <h4 className="text-sm tracking-[0.3em] uppercase mb-8 font-bold text-cyan-400">{t.footer.about.title}</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{t.footer.about.desc}</p>
              </div>

              <div>
                <h4 className="text-sm tracking-[0.3em] uppercase mb-8 font-bold text-cyan-400">{t.footer.contact}</h4>
                <div className="space-y-4 text-sm text-gray-400 font-light">
                  <div>
                    <p className="text-gray-500 text-xs tracking-[0.1em] uppercase mb-2">Adres</p>
                    <p>İskele, KKTC</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs tracking-[0.1em] uppercase mb-2">Telefon</p>
                    <a href="tel:+905331234567" className="hover:text-cyan-400 transition">
                      +90 533 123 45 67
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs tracking-[0.1em] uppercase mb-2">Email</p>
                    <a href="mailto:info@serenity-iskele.com" className="hover:text-cyan-400 transition">
                      info@serenity-iskele.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm tracking-[0.3em] uppercase mb-8 font-bold text-cyan-400">{t.footer.social}</h4>
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
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-xs text-gray-500 tracking-[0.1em] uppercase font-light">{t.footer.copyright}</p>
            </div>
          </div>
        </footer>
      </main>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        
        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
      `}</style>
    </>
  )
}