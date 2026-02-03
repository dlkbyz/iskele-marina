'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [language, setLanguage] = useState('TR')

  // Booking states
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const [checking, setChecking] = useState(false)
  const [availabilityMsg, setAvailabilityMsg] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]

  const handleCheckAvailability = async () => {
    setAvailabilityMsg('')

    if (!checkIn || !checkOut) {
      setAvailabilityMsg(
        language === 'TR' ? 'Lütfen giriş ve çıkış tarihini seçin.' : 'Please select check-in and check-out dates.'
      )
      return
    }

    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)

    if (outDate <= inDate) {
      setAvailabilityMsg(
        language === 'TR'
          ? 'Çıkış tarihi giriş tarihinden sonra olmalıdır.'
          : 'Check-out must be after check-in.'
      )
      return
    }

    try {
      setChecking(true)
      await new Promise((r) => setTimeout(r, 700))

      setAvailabilityMsg(
        language === 'TR'
          ? `Kontrol edildi: ${checkIn} - ${checkOut}, ${adults} yetişkin, ${children} çocuk.`
          : `Checked: ${checkIn} - ${checkOut}, ${adults} adults, ${children} children.`
      )
    } finally {
      setChecking(false)
    }
  }

  const content = {
    TR: {
      navLinks: [
        { label: 'ANA SAYFA', href: '/' },
        { label: 'GALERİ', href: '/galeri' },
        { label: 'ÖZELLİKLER', href: '/ozellikler' },
        { label: 'YORUMLAR', href: '/yorumlar' },
        { label: 'İLETİŞİM', href: '/iletisim' },
        { label: 'REZERVASYON', href: '/rezervasyon' }
      ],
      hero: {
        title: "İskele White Residence",
        subtitle: 'Gecelik $145\'den',
        checkIn: 'Giriş',
        checkOut: 'Çıkış',
        adults: 'Yetişkin',
        children: 'Çocuk',
        checkButton: 'Müsaitlik Kontrol'
      },
      welcome: {
        badge: 'Hoş Geldiniz',
        title: 'Premium Konaklama',
        description:
          "Bu sadece bir tatilden fazlası, hatırlamaya değer ve tekrar gelmeye devam edeceğiniz bir deneyim. Güzel İskele, Kuzey Kıbrıs'ta yer alan residence'ımız, benzersiz konfor ve lüks sunar."
      },
      features: [
        { icon: '🛏️', title: 'Geniş Yatak', desc: 'Konforlu king-size yataklar' },
        { icon: '📶', title: 'Hızlı WiFi', desc: 'Yüksek hızlı internet' },
        { icon: '🔒', title: 'Kasa', desc: 'Odada güvenlik kasası' },
        { icon: '🛁', title: 'Banyo', desc: 'Modern banyo olanakları' },
        { icon: '🏋️', title: 'Egzersiz', desc: 'Tam donanımlı spor salonu' },
        { icon: '🍷', title: 'İçecekler', desc: 'Mini bar dahil' }
      ],
      banners: {
        breakfast: { title: 'Kahvaltı', button: 'Daha Fazla' },
        menu: { title: 'Menümüz', button: 'Daha Fazla' }
      },
      testimonial: {
        quote: '"',
        title: 'Harika bir buluş',
        text:
          'Muhteşem bir deneyimdi. Konum mükemmel, ev çok temiz ve konforlu. Kesinlikle tekrar geleceğiz. Her şey için teşekkürler!',
        author: 'Ahmet Yılmaz'
      },
      newsletter: {
        title: 'Haftalık Bültenimize Katılın',
        desc: 'Özel teklifler ve haberlerden haberdar olun',
        placeholder: 'E-posta adresiniz',
        button: 'Kayıt Ol'
      },
      footer: {
        about: {
          title: 'Hakkımızda',
          desc:
            "İskele White Residence'a hoş geldiniz, konfor her şeydir. Güzel oda sunumları, basit rezervasyon seçenekleri."
        },
        contact: 'İletişim',
        social: 'Sosyal Medya',
        copyright: '© 2025 İskele White Residence'
      }
    },
    EN: {
      navLinks: [
        { label: 'HOME', href: '/' },
        { label: 'GALLERY', href: '/galeri' },
        { label: 'FEATURES', href: '/ozellikler' },
        { label: 'REVIEWS', href: '/yorumlar' },
        { label: 'CONTACT', href: '/iletisim' },
        { label: 'RESERVATION', href: '/rezervasyon' }
      ],
      hero: {
        title: 'İskele White Residence',
        subtitle: 'from $145 per night',
        checkIn: 'Check-in',
        checkOut: 'Check-out',
        adults: 'Adults',
        children: 'Children',
        checkButton: 'Check Availability'
      },
      welcome: {
        badge: 'Welcome',
        title: 'Premium Accommodation',
        description:
          "This is more than a vacation, it's an experience worth remembering & one you'll keep coming back to. Located in beautiful İskele, Northern Cyprus, our residence offers unparalleled comfort and luxury."
      },
      features: [
        { icon: '🛏️', title: 'Large Bed', desc: 'Comfortable king-size beds' },
        { icon: '📶', title: 'Fast WiFi', desc: 'High-speed internet' },
        { icon: '🔒', title: 'Safe', desc: 'In-room safety deposit box' },
        { icon: '🛁', title: 'Bath', desc: 'Modern bathroom amenities' },
        { icon: '🏋️', title: 'Exercise', desc: 'Fully equipped gym' },
        { icon: '🍷', title: 'Drinks', desc: 'Mini bar included' }
      ],
      banners: {
        breakfast: { title: 'Breakfast', button: 'Read More' },
        menu: { title: 'Our Menu', button: 'Read More' }
      },
      testimonial: {
        quote: '"',
        title: 'A great find',
        text:
          'Wonderful experience. The location was perfect, the apartment was very clean and comfortable. We will definitely come back. Thank you for everything!',
        author: 'Andreas Mjøs'
      },
      newsletter: {
        title: 'Join our Weekly Newsletter',
        desc: 'Stay updated with exclusive offers and news',
        placeholder: 'Your email address',
        button: 'Sign me up'
      },
      footer: {
        about: {
          title: 'About',
          desc:
            "Welcome to İskele White Residence, where comfort is everything. Beautiful room presentations, straightforward booking & reservation options."
        },
        contact: 'Contact',
        social: 'Get Social',
        copyright: '© 2025 İskele White Residence'
      }
    }
  }

  const navLinks = content[language].navLinks
  const t = content[language]

  return (
    <>
      {/* SIDEBAR MENU */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-[#f8f6f3] z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 pt-24 lg:pt-0`}
      >
        {/* GRID: üst / orta / alt */}
        <div className="h-full grid grid-rows-[auto_1fr_auto] px-8 py-6 lg:py-16">
          {/* ÜST: Logo + Dil */}
          <div className="text-center">
            <Link href="/" className="block mb-8">
              <div className="w-full max-w-xs mx-auto">
                <svg viewBox="0 0 200 100" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                  {/* Ana Text */}
                  <text 
                    x="100" 
                    y="65" 
                    fontFamily="Georgia, serif" 
                    fontSize="42" 
                    fontWeight="300"
                    textAnchor="middle" 
                    fill="#1f2937"
                    letterSpacing="2"
                  >
                    Serenity
                  </text>
                  
                  {/* Alt Text */}
                  <text 
                    x="100" 
                    y="92" 
                    fontFamily="Georgia, serif" 
                    fontSize="12" 
                    fontWeight="300"
                    textAnchor="middle" 
                    fill="#06b6d4"
                    letterSpacing="2"
                  >
                    ISKELE
                  </text>
                </svg>
              </div>
            </Link>

            <div className="flex items-center justify-center space-x-3 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('TR')}
                className={`tracking-[0.2em] uppercase font-light transition ${
                  language === 'TR' ? 'text-[#c4a574] font-normal' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                TR
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`tracking-[0.2em] uppercase font-light transition ${
                  language === 'EN' ? 'text-[#c4a574] font-normal' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* ORTA: Menü + Rezervasyon (tam ortada) */}
          <div className="flex items-center justify-center">
            <div className="w-full">
              <nav className="flex flex-col gap-3 text-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative group inline-block py-2 text-xs tracking-[0.2em] uppercase text-gray-600 hover:text-[#c4a574] font-light transition-colors"
                  >
                    {link.label}
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[1px] bg-[#c4a574] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>

              <div className="mt-8">
                <Link
                  href="/rezervasyon"
                  className="block text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all text-xs tracking-[0.2em] uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 rounded"
                >
                  {language === 'TR' ? 'REZERVASYON YAP' : 'BOOK NOW'}
                </Link>
              </div>
            </div>
          </div>

          {/* ALT: Social + Contact */}
          <div>
            <div className="flex space-x-4 mb-6 justify-center">
              <a href="#" className="text-gray-600 hover:text-[#c4a574] transition" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-[#c4a574] transition" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-[#c4a574] transition" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            <div className="text-center text-[11px] text-gray-600 space-y-1.5 font-light leading-relaxed">
              <p>A: Yeni İskele, KKTC</p>
              <p>
                P:{' '}
                <a href="tel:+905331234567" className="hover:text-[#c4a574] transition">
                  +90 533 123 45 67
                </a>
              </p>
              <p>App: Viber, WhatsApp</p>
              <p>
                E:{' '}
                <a href="mailto:info@iskelewhite.com" className="hover:text-[#c4a574] transition">
                  info@iskelewhite.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-40 w-10 h-10 bg-white border border-gray-300 rounded flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Main Content */}
      <div className="lg:ml-64 pt-20 lg:pt-0">
        {/* HERO SECTION */}
        <section className="relative h-screen pt-24 lg:pt-0">
          <div className="absolute inset-0 z-0">
            <img
              src="https://uvadqixzovxsjrzjayom.supabase.co/storage/v1/object/public/mainpage/h4-rev-img-2-1536x864.jpg?w=1920&h=1080&fit=crop"
              alt="İskele White Residence"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center text-white">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif mb-4"
              style={{
                fontFamily: 'Georgia, serif',
                fontWeight: 100,
                lineHeight: 1.4,
                letterSpacing: '0.02em'
              }}
            >
              {t.hero.title}
            </h1>
            <p className="text-2xl md:text-3xl font-light">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Booking Widget */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-white via-cyan-50 to-blue-50 py-8 border-t border-cyan-100">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-gray-600 mb-2 font-light">
                    {t.hero.checkIn}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={todayStr}
                    className="w-full px-0 py-2 border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none text-sm bg-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-gray-600 mb-2 font-light">
                    {t.hero.checkOut}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || todayStr}
                    className="w-full px-0 py-2 border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none text-sm bg-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-gray-600 mb-2 font-light">
                    {t.hero.adults}
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-0 py-2 border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none text-sm bg-transparent transition"
                  >
                    <option value={1}>1 {language === 'TR' ? 'Yetişkin' : 'Adult'}</option>
                    <option value={2}>2 {language === 'TR' ? 'Yetişkin' : 'Adults'}</option>
                    <option value={3}>3 {language === 'TR' ? 'Yetişkin' : 'Adults'}</option>
                    <option value={4}>4 {language === 'TR' ? 'Yetişkin' : 'Adults'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-gray-600 mb-2 font-light">
                    {t.hero.children}
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-0 py-2 border-0 border-b-2 border-cyan-300 focus:border-cyan-600 outline-none text-sm bg-transparent transition"
                  >
                    <option value={0}>0 {language === 'TR' ? 'Çocuk' : 'Children'}</option>
                    <option value={1}>1 {language === 'TR' ? 'Çocuk' : 'Child'}</option>
                    <option value={2}>2 {language === 'TR' ? 'Çocuk' : 'Children'}</option>
                    <option value={3}>3 {language === 'TR' ? 'Çocuk' : 'Children'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-gray-600 mb-2 font-light opacity-0">
                    .
                  </label>
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={checking}
                    className="w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all text-xs tracking-[0.2em] uppercase font-light shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 rounded"
                  >
                    {checking ? (language === 'TR' ? 'Kontrol ediliyor...' : 'Checking...') : t.hero.checkButton}
                  </button>
                </div>
              </div>

              {/* Result + Reservation CTA */}
              {availabilityMsg ? (
                <div className="max-w-4xl mx-auto mt-4 text-center">
                  <p className="text-sm text-gray-700">{availabilityMsg}</p>

                  {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) ? (
                    <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const qs = new URLSearchParams({
                            giris: checkIn,
                            cikis: checkOut,
                            yetiskin: String(adults),
                            cocuk: String(children)
                          }).toString()

                          router.push(`/rezervasyon?${qs}`)
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all text-xs tracking-[0.2em] uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 rounded"
                      >
                        {language === 'TR' ? 'Rezervasyon Yap' : 'Book Now'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setAvailabilityMsg('')}
                        className="px-6 py-3 bg-white/70 hover:bg-white transition-all text-xs tracking-[0.2em] uppercase font-light shadow border border-cyan-200 rounded"
                      >
                        {language === 'TR' ? 'Kapat' : 'Close'}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* WELCOME SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4 font-light">
                {t.welcome.badge}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                {t.welcome.title}
              </h2>
              <div className="w-12 h-[1px] bg-gray-400 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                {t.welcome.description}
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
              {t.features.map((feature, i) => (
                <div
                  key={i}
                  className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 group-hover:border-cyan-500 rounded-full flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm tracking-[0.2em] uppercase text-gray-900 mb-2 font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMAGE BANNERS */}
        <section className="py-0">
          <div className="grid md:grid-cols-2">
            <div className="relative h-96 md:h-[500px] group overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop"
                alt="Breakfast"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div>
                  <h3 className="text-4xl font-serif mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    {t.banners.breakfast.title}
                  </h3>
                  <button
                    type="button"
                    className="px-8 py-3 border border-white hover:bg-white hover:text-gray-900 transition text-xs tracking-[0.2em] uppercase font-light rounded"
                  >
                    {t.banners.breakfast.button}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative h-96 md:h-[500px] group overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
                alt="Our Menu"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div>
                  <h3 className="text-4xl font-serif mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    {t.banners.menu.title}
                  </h3>
                  <button
                    type="button"
                    className="px-8 py-3 border border-white hover:bg-white hover:text-gray-900 transition text-xs tracking-[0.2em] uppercase font-light rounded"
                  >
                    {t.banners.menu.button}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-5xl mb-6">{t.testimonial.quote}</div>
              <h3 className="text-3xl font-serif text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                {t.testimonial.title}
              </h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">{t.testimonial.text}</p>
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500 font-light">{t.testimonial.author}</p>
            </div>
          </div>
        </section>

        {/* MAP SECTION */}
        <section className="py-0">
          <div className="h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52220.89364405693!2d33.87899!3d35.29333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de178ddb1d5d1f%3A0x9a71c2c746663a8e!2sIskele%2C%20Cyprus!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-16 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-3xl font-serif text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                {t.newsletter.title}
              </h3>
              <p className="text-cyan-100 mb-8">{t.newsletter.desc}</p>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 px-4 py-3 border-0 border-b-2 border-white/30 focus:border-white outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60 text-sm rounded"
                />
                <button
                  type="button"
                  className="px-8 py-3 bg-white text-cyan-600 hover:bg-gray-100 transition text-xs tracking-[0.2em] uppercase font-semibold shadow-lg hover:shadow-xl rounded"
                >
                  {t.newsletter.button}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#2c2c2c] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <h4 className="text-sm tracking-[0.2em] uppercase mb-6 font-light">{t.footer.about.title}</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{t.footer.about.desc}</p>
              </div>

              <div>
                <h4 className="text-sm tracking-[0.2em] uppercase mb-6 font-light">{t.footer.contact}</h4>
                <div className="space-y-2 text-sm text-gray-400 font-light">
                  <p>A: İskele, KKTC</p>
                  <p>
                    P:{' '}
                    <a href="tel:+905331234567" className="hover:text-white transition">
                      +90 533 123 45 67
                    </a>
                  </p>
                  <p>
                    E:{' '}
                    <a href="mailto:info@iskelewhite.com" className="hover:text-white transition">
                      info@iskelewhite.com
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm tracking-[0.2em] uppercase mb-6 font-light">{t.footer.social}</h4>
                <div className="flex space-x-3">
                  <a href="#" className="w-10 h-10 border border-gray-600 hover:border-white flex items-center justify-center transition rounded">
                    <span className="text-sm">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 border border-gray-600 hover:border-white flex items-center justify-center transition rounded">
                    <span className="text-sm">ig</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-xs text-gray-500 tracking-[0.1em] uppercase font-light">{t.footer.copyright}</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
      `}</style>
    </>
  )
}