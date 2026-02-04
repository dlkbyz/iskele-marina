'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Intersection Observer hook for scroll animations
function useInView() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  
  return [ref, isInView]
}

export default function Ozellikler() {
  const pathname = usePathname()
  const [language, setLanguage] = useState('TR')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredFeature, setHoveredFeature] = useState(null)

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
        title: 'Tüm Olanaklar Dahil',
        description: 'Tatil deneyiminizi unutulmaz kılacak tüm detaylar',
        subtitle: 'Konfor, lüks ve huzurun buluştuğu yer'
      },
      sections: {
        apartment: {
          badge: 'DAİRE İÇİ',
          title: 'Daire Olanakları',
          desc: 'Rahat ve konforlu bir yaşam için gereken tüm donanımlar'
        },
        complex: {
          badge: 'KOMPLEKS',
          title: 'Kompleks Olanakları',
          desc: 'Unutulmaz bir tatil deneyimi için tasarlanmış tüm olanaklar'
        },
        location: {
          badge: 'KONUM',
          title: 'Konum Avantajları',
          desc: 'Her şeye yakın, her zaman uygun bir konumda'
        }
      },
      stats: {
        rooms: { value: '2', label: 'Yatak Odası' },
        guests: { value: '5', label: 'Kişilik Kapasite' },
        size: { value: '85m²', label: 'Kullanım Alanı' },
        beach: { value: '5dk', label: 'Plaja Mesafe' }
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
        title: 'All Amenities Included',
        description: 'Every detail to make your vacation unforgettable',
        subtitle: 'Where comfort, luxury and peace meet'
      },
      sections: {
        apartment: {
          badge: 'IN APARTMENT',
          title: 'Apartment Features',
          desc: 'All amenities needed for a comfortable stay'
        },
        complex: {
          badge: 'COMPLEX',
          title: 'Complex Amenities',
          desc: 'All facilities designed for an unforgettable vacation experience'
        },
        location: {
          badge: 'LOCATION',
          title: 'Location Advantages',
          desc: 'Close to everything, always convenient'
        }
      },
      stats: {
        rooms: { value: '2', label: 'Bedrooms' },
        guests: { value: '5', label: 'Guest Capacity' },
        size: { value: '85m²', label: 'Living Space' },
        beach: { value: '5min', label: 'To Beach' }
      }
    }
  }

  const t = content[language]
  const navLinks = t.navLinks
  const isActive = (href) => pathname === href

  const evOzellikleri = [
    { icon: '🛏️', baslik: language === 'TR' ? '2 Yatak Odası' : '2 Bedrooms', aciklama: language === 'TR' ? 'Geniş ve konforlu yatak odaları' : 'Spacious and comfortable bedrooms', category: 'comfort' },
    { icon: '🛁', baslik: language === 'TR' ? '1 Banyo' : '1 Bathroom', aciklama: language === 'TR' ? 'Modern ve temiz banyo' : 'Modern and clean bathroom', category: 'comfort' },
    { icon: '👥', baslik: language === 'TR' ? '5 Kişilik' : 'Up to 5 Guests', aciklama: language === 'TR' ? 'Rahatça 5 kişi kalabilir' : 'Comfortable for 5 people', category: 'comfort' },
    { icon: '📶', baslik: language === 'TR' ? 'Hızlı WiFi' : 'Fast WiFi', aciklama: language === 'TR' ? 'Fiber internet bağlantısı' : 'Fiber internet connection', category: 'tech' },
    { icon: '❄️', baslik: language === 'TR' ? 'Klima' : 'Air Conditioning', aciklama: language === 'TR' ? 'Her odada klima mevcut' : 'AC in all rooms', category: 'comfort' },
    { icon: '🍳', baslik: language === 'TR' ? 'Tam Donanımlı Mutfak' : 'Fully Equipped Kitchen', aciklama: language === 'TR' ? 'Buzdolabı, fırın, ocak, su ısıtıcı' : 'Fridge, oven, cooktop, kettle', category: 'kitchen' },
    { icon: '📺', baslik: language === 'TR' ? 'Smart TV' : 'Smart TV', aciklama: language === 'TR' ? 'Netflix ve YouTube destekli' : 'Netflix and YouTube enabled', category: 'tech' },
    { icon: '🧺', baslik: language === 'TR' ? 'Çamaşır Makinesi' : 'Washing Machine', aciklama: language === 'TR' ? 'Kendi çamaşırlarınızı yıkayın' : 'Wash your own laundry', category: 'comfort' },
    { icon: '🏖️', baslik: language === 'TR' ? 'Balkon' : 'Balcony', aciklama: language === 'TR' ? 'Geniş ve manzaralı balkon' : 'Wide and scenic balcony', category: 'comfort' },
    { icon: '🅿️', baslik: language === 'TR' ? 'Otopark' : 'Parking', aciklama: language === 'TR' ? 'Ücretsiz kapalı otopark' : 'Free covered parking', category: 'extra' },
  ]

  const kompleksOzellikleri = [
    { icon: '🏊', baslik: language === 'TR' ? 'Açık Yüzme Havuzu' : 'Outdoor Pool', aciklama: language === 'TR' ? 'Yetişkin ve çocuk havuzu' : 'Adult and children pools', gradient: 'from-blue-400 to-cyan-500' },
    { icon: '🏊', baslik: language === 'TR' ? 'Kapalı Yüzme Havuzu' : 'Indoor Pool', aciklama: language === 'TR' ? '4 mevsim yüzme imkanı' : '4 season swimming', gradient: 'from-cyan-400 to-blue-500' },
    { icon: '💆', baslik: language === 'TR' ? 'SPA & Sauna' : 'SPA & Sauna', aciklama: language === 'TR' ? 'Profesyonel SPA hizmetleri' : 'Professional SPA services', gradient: 'from-purple-400 to-pink-500' },
    { icon: '🏋️', baslik: language === 'TR' ? 'Spor Salonu' : 'Gym', aciklama: language === 'TR' ? 'Modern fitness ekipmanları' : 'Modern fitness equipment', gradient: 'from-orange-400 to-red-500' },
    { icon: '🍽️', baslik: language === 'TR' ? '4 Restoran' : '4 Restaurants', aciklama: language === 'TR' ? 'Çeşitli mutfaklar ve lezzetler' : 'Various cuisines', gradient: 'from-amber-400 to-orange-500' },
    { icon: '☕', baslik: language === 'TR' ? 'Cafe' : 'Cafe', aciklama: language === 'TR' ? 'Kahve ve tatlı keyfi' : 'Coffee and desserts', gradient: 'from-brown-400 to-amber-600' },
    { icon: '🛒', baslik: language === 'TR' ? 'Market' : 'Supermarket', aciklama: language === 'TR' ? 'Temel ihtiyaçlar için market' : 'Basic needs market', gradient: 'from-green-400 to-emerald-500' },
    { icon: '👶', baslik: language === 'TR' ? 'Çocuk Oyun Alanı' : 'Kids Play Area', aciklama: language === 'TR' ? 'Güvenli ve eğlenceli alan' : 'Safe and fun area', gradient: 'from-pink-400 to-rose-500' },
    { icon: '🔒', baslik: language === 'TR' ? '7/24 Güvenlik' : '24/7 Security', aciklama: language === 'TR' ? 'Kamera sistemi ve güvenlik' : 'Camera and security system', gradient: 'from-slate-400 to-gray-600' },
    { icon: '🏖️', baslik: language === 'TR' ? 'Plaja 5 Dakika' : '5 Min to Beach', aciklama: language === 'TR' ? 'Yürüyerek plaja ulaşım' : 'Walking distance to beach', gradient: 'from-sky-400 to-blue-500' },
  ]

  const konumAvantajlari = [
    { 
      icon: '🏖️', 
      baslik: language === 'TR' ? 'Plaja 5 Dakika' : '5 Min to Beach', 
      aciklama: language === 'TR' ? 'Yürüyerek kolayca ulaşabileceğiniz mesafede' : 'Easy walking distance',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      icon: '🛒', 
      baslik: language === 'TR' ? 'Market Kompleks İçinde' : 'Market Inside', 
      aciklama: language === 'TR' ? 'İhtiyaçlarınız için market hemen yanınızda' : 'Supermarket next door',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      icon: '🍽️', 
      baslik: language === 'TR' ? 'Yemek Seçenekleri' : 'Dining Options', 
      aciklama: language === 'TR' ? '4 farklı restoran ve cafe içeride' : '4 restaurants and cafes',
      color: 'from-orange-500 to-amber-600'
    },
    { 
      icon: '✈️', 
      baslik: language === 'TR' ? 'Ercan Havalimanı' : 'Airport', 
      aciklama: language === 'TR' ? 'Yaklaşık 45 dakika uzaklıkta' : 'About 45 min away',
      color: 'from-purple-500 to-indigo-600'
    },
  ]

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
        {/* HERO SECTION - Geliştirilmiş */}
        <section className="relative h-[500px] md:h-[600px] -mt-16 pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop"
              alt="Features Hero"
              className="w-full h-full object-cover scale-105 animate-[zoom_20s_ease-in-out_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 inline-block px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
              <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/90 font-light">
                {t.hero.subtitle}
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
              className="text-lg md:text-xl font-light text-white/95 tracking-wide max-w-2xl mb-12 animate-[fadeIn_1.5s_ease-out]"
              style={{
                textShadow: '0 6px 22px rgba(0,0,0,0.70)'
              }}
            >
              {t.hero.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl w-full animate-[fadeIn_2s_ease-out]">
              {Object.entries(t.stats).map(([key, stat]) => (
                <div key={key} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white/80 tracking-wider uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-[scroll_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Daire İçi Olanaklar - Geliştirilmiş */}
            <div className="mb-32">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <p className="text-xs tracking-[0.3em] uppercase text-cyan-600 font-medium">{t.sections.apartment.badge}</p>
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}>
                  {t.sections.apartment.title}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-cyan-500"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-cyan-500"></div>
                </div>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
                  {t.sections.apartment.desc}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {evOzellikleri.map((ozellik, index) => (
                  <div
                    key={index}
                    className="group relative bg-white p-7 rounded-3xl shadow-md border border-gray-100 hover:border-cyan-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden cursor-pointer"
                    style={{ 
                      animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`
                    }}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    {/* Gradient Background on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Animated Circle Background */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/5 rounded-full transition-all duration-700 group-hover:scale-150 group-hover:bg-cyan-500/10" />
                    
                    <div className="relative z-10">
                      <div className="text-5xl mb-5 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12 inline-block">
                        {ozellik.icon}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2 tracking-wide group-hover:text-cyan-600 transition-colors duration-300">
                        {ozellik.baslik}
                      </h3>
                      <p className="text-sm text-gray-600 font-light leading-relaxed">
                        {ozellik.aciklama}
                      </p>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                ))}
              </div>
            </div>

            {/* Kompleks Olanakları - Daha Renkli */}
            <div className="mb-32 relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 rounded-[3rem] -z-10"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-3xl -z-10"></div>

              <div className="py-20 px-4 sm:px-8">
                <div className="text-center mb-16">
                  <div className="inline-block mb-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                      <p className="text-xs tracking-[0.3em] uppercase text-purple-600 font-medium">{t.sections.complex.badge}</p>
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}>
                    {t.sections.complex.title}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-purple-500"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-purple-500"></div>
                  </div>
                  <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
                    {t.sections.complex.desc}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  {kompleksOzellikleri.map((ozellik, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 backdrop-blur-sm p-7 rounded-3xl shadow-lg border border-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden cursor-pointer"
                      style={{ 
                        animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`
                      }}
                    >
                      {/* Dynamic gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${ozellik.gradient} opacity-0 group-hover:opacity-15 rounded-3xl transition-all duration-500`}></div>
                      
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${ozellik.gradient} blur-2xl opacity-10 group-hover:scale-150 transition-transform duration-1000`}></div>
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-gradient-to-r ${ozellik.gradient} animate-[float_3s_ease-in-out_infinite]`}></div>
                        <div className={`absolute top-3/4 right-1/4 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${ozellik.gradient} animate-[float_4s_ease-in-out_infinite]`}></div>
                      </div>

                      <div className="relative z-10">
                        <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${ozellik.gradient} mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-2xl`}>
                          <span className="text-4xl filter drop-shadow-lg">{ozellik.icon}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                          {ozellik.baslik}
                        </h3>
                        <p className="text-sm text-gray-600 font-light leading-relaxed">
                          {ozellik.aciklama}
                        </p>
                      </div>

                      {/* Animated corner decoration */}
                      <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${ozellik.gradient} opacity-0 group-hover:opacity-20 rounded-tr-full transition-all duration-500 transform -translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Konum Avantajları - Daha Modern */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <p className="text-xs tracking-[0.3em] uppercase text-emerald-600 font-medium">{t.sections.location.badge}</p>
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}>
                  {t.sections.location.title}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-emerald-500"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-emerald-500"></div>
                </div>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
                  {t.sections.location.desc}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {konumAvantajlari.map((avantaj, index) => (
                  <div 
                    key={index} 
                    className="group relative flex items-center space-x-6 p-8 rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${avantaj.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Icon container with gradient */}
                    <div className="relative">
                      <div className={`w-20 h-20 bg-gradient-to-br ${avantaj.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                        <span className="text-3xl filter drop-shadow-sm">{avantaj.icon}</span>
                      </div>
                      {/* Pulse effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${avantaj.color} rounded-2xl opacity-0 group-hover:opacity-30 animate-ping`}></div>
                    </div>

                    <div className="relative flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 transition-all duration-300">
                        {avantaj.baslik}
                      </h3>
                      <p className="text-gray-600 font-light leading-relaxed">{avantaj.aciklama}</p>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section - Geliştirilmiş */}
            <div className="max-w-5xl mx-auto relative">
              {/* Animated background circles */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="relative bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-[2.5rem] p-1 shadow-2xl">
                <div className="bg-gradient-to-r from-cyan-500/95 via-blue-600/95 to-purple-600/95 rounded-[2.4rem] p-12 md:p-16 text-white text-center backdrop-blur-sm">
                  <div className="mb-6">
                    <span className="inline-block text-6xl mb-4 animate-bounce">✨</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif mb-6" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}>
                    {language === 'TR' ? 'Hemen Rezervasyon Yapın' : 'Book Now'}
                  </h2>
                  <p className="text-lg md:text-xl mb-10 text-white/95 font-light max-w-2xl mx-auto">
                    {language === 'TR' ? 'Tüm bu olanakların tadını çıkarın ve unutulmaz bir tatil deneyimi yaşayın' : 'Enjoy all these amazing amenities and experience an unforgettable vacation'}
                  </p>
                  <Link
                    href="/rezervasyon"
                    className="group inline-flex items-center gap-3 px-12 py-5 bg-white text-cyan-600 hover:bg-gray-50 transition-all text-sm tracking-[0.2em] uppercase font-bold shadow-2xl hover:shadow-3xl rounded-full hover:scale-105 duration-300"
                  >
                    <span>{language === 'TR' ? 'Rezervasyon Yap' : 'Book Now'}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

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
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(40px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
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