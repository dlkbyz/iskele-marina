'use client'

import Link from 'next/link'
import {
  BedDouble, Bath, Users, Wifi, Snowflake, ChefHat, Tv, WashingMachine,
  Sun as SunIcon, Car, Droplets, Sparkles, Dumbbell, UtensilsCrossed,
  Coffee, ShoppingBasket, Baby, ShieldCheck, MapPin, Plane, ChevronRight,
} from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ChapterMarker, GoldDivider, Eyebrow, useHeroSlot } from '../components/SiteShell'

export default function Ozellikler() {
  const { language } = useLanguage()
  const tr = language === 'tr'
  const heroImage = useHeroSlot('ozellikler_hero', '/h4-rev-img-2-1536x864.jpg')

  const stats = tr
    ? [
        { value: '2',    label: 'Yatak Odası' },
        { value: '5',    label: 'Kişilik Kapasite' },
        { value: '85m²', label: 'Kullanım Alanı' },
        { value: '5dk',  label: 'Plaja Mesafe' },
      ]
    : [
        { value: '2',    label: 'Bedrooms' },
        { value: '5',    label: 'Guest Capacity' },
        { value: '85m²', label: 'Living Space' },
        { value: '5min', label: 'To Beach' },
      ]

  /* Daire içi olanaklar */
  const apartmentFeatures = [
    { Icon: BedDouble,       title: tr ? '2 Yatak Odası'       : '2 Bedrooms',          desc: tr ? 'Geniş ve konforlu yatak odaları'           : 'Spacious and comfortable bedrooms' },
    { Icon: Bath,            title: tr ? '1 Banyo'             : '1 Bathroom',          desc: tr ? 'Modern ve temiz banyo'                     : 'Modern and clean bathroom' },
    { Icon: Users,           title: tr ? '5 Kişilik Kapasite'  : '5 Guests Capacity',   desc: tr ? 'Rahatça 5 kişi konaklayabilir'             : 'Comfortable for up to 5 people' },
    { Icon: Wifi,            title: tr ? 'Hızlı WiFi'          : 'Fast WiFi',           desc: tr ? 'Fiber internet bağlantısı'                 : 'Fiber internet connection' },
    { Icon: Snowflake,       title: tr ? 'Klima'               : 'Air Conditioning',    desc: tr ? 'Her odada bireysel klima'                  : 'AC in every room' },
    { Icon: ChefHat,         title: tr ? 'Donanımlı Mutfak'    : 'Equipped Kitchen',    desc: tr ? 'Buzdolabı, fırın, ocak, su ısıtıcı'        : 'Fridge, oven, cooktop, kettle' },
    { Icon: Tv,              title: tr ? 'Smart TV'            : 'Smart TV',            desc: tr ? 'Netflix ve YouTube destekli'               : 'Netflix and YouTube ready' },
    { Icon: WashingMachine,  title: tr ? 'Çamaşır Makinesi'    : 'Washing Machine',     desc: tr ? 'Kendi çamaşırlarınızı yıkayın'             : 'Wash your own laundry' },
    { Icon: SunIcon,         title: tr ? 'Manzaralı Balkon'    : 'Scenic Balcony',      desc: tr ? 'Geniş, ferah ve manzaralı'                 : 'Wide, airy and scenic' },
    { Icon: Car,             title: tr ? 'Otopark'             : 'Parking',             desc: tr ? 'Ücretsiz kapalı otopark'                   : 'Free covered parking' },
  ]

  /* Kompleks olanakları */
  const complexFeatures = [
    { Icon: Droplets,        title: tr ? 'Açık Yüzme Havuzu'   : 'Outdoor Pool',        desc: tr ? 'Yetişkin ve çocuk havuzu'                  : 'Adult and children pools' },
    { Icon: Droplets,        title: tr ? 'Kapalı Yüzme Havuzu' : 'Indoor Pool',         desc: tr ? '4 mevsim yüzme imkânı'                     : 'Year-round swimming' },
    { Icon: Sparkles,        title: tr ? 'SPA & Sauna'         : 'SPA & Sauna',         desc: tr ? 'Profesyonel SPA hizmetleri'                : 'Professional SPA services' },
    { Icon: Dumbbell,        title: tr ? 'Spor Salonu'         : 'Gym',                 desc: tr ? 'Modern fitness ekipmanları'                : 'Modern fitness equipment' },
    { Icon: UtensilsCrossed, title: tr ? '4 Restoran'          : '4 Restaurants',       desc: tr ? 'Farklı mutfaklardan lezzetler'             : 'Cuisines from around the world' },
    { Icon: Coffee,          title: tr ? 'Cafe'                : 'Café',                desc: tr ? 'Taze kahve ve tatlı keyfi'                 : 'Fresh coffee and desserts' },
    { Icon: ShoppingBasket,  title: tr ? 'Market'              : 'Market',              desc: tr ? 'Temel ihtiyaçlar için market'              : 'In-house grocery market' },
    { Icon: Baby,            title: tr ? 'Çocuk Oyun Alanı'    : 'Kids Play Area',      desc: tr ? 'Güvenli ve eğlenceli alan'                 : 'Safe and fun play area' },
    { Icon: ShieldCheck,     title: tr ? '7/24 Güvenlik'       : '24/7 Security',       desc: tr ? 'Kamera sistemi ve güvenlik'                : 'CCTV and security personnel' },
    { Icon: SunIcon,         title: tr ? 'Plaja 5 Dakika'      : '5 Min to Beach',      desc: tr ? 'Yürüyerek plaja ulaşım'                    : 'Walk to the beach in minutes' },
  ]

  /* Konum avantajları */
  const locationFeatures = [
    { Icon: SunIcon,         title: tr ? 'Plaja 5 Dakika'      : '5 Min to Beach',      desc: tr ? 'Yürüyerek kolayca ulaşabileceğiniz mesafede' : 'Easy walking distance' },
    { Icon: ShoppingBasket,  title: tr ? 'Market Kompleks İçinde' : 'Market Inside',    desc: tr ? 'İhtiyaçlarınız için market hemen yanınızda'  : 'Supermarket next door' },
    { Icon: UtensilsCrossed, title: tr ? 'Yemek Seçenekleri'   : 'Dining Options',      desc: tr ? '4 farklı restoran ve cafe içeride'           : '4 restaurants and cafes' },
    { Icon: Plane,           title: tr ? 'Ercan Havalimanı'    : 'Ercan Airport',       desc: tr ? 'Yaklaşık 45 dakika uzaklıkta'                : 'About 45 min away' },
  ]

  return (
    <>
      <Navbar />

      <main className="bg-cream">
        {/* ============================ HERO ============================ */}
        <section className="relative h-[600px] md:h-[680px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Features hero"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(22,59,52,0.5) 0%, rgba(22,59,52,0.2) 40%, rgba(22,59,52,0.6) 100%)' }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-24">
            <ChapterMarker number="02" label={tr ? 'Olanaklar' : 'Amenities'} tone="cream" />
            <h1
              className="font-display text-cream text-5xl md:text-7xl font-light leading-[1.05] mt-6 max-w-4xl"
              style={{ textShadow: '0 4px 24px rgba(22,59,52,0.5)' }}
            >
              {tr ? (
                <>Konfor, lüks &{' '}<em className="font-display italic text-gold-300 not-italic">huzur</em></>
              ) : (
                <>Comfort, luxury &{' '}<em className="font-display italic text-gold-300 not-italic">serenity</em></>
              )}
            </h1>
            <div className="my-6">
              <GoldDivider />
            </div>
            <p
              className="max-w-2xl text-cream/85 text-base md:text-lg font-light"
              style={{ textShadow: '0 2px 12px rgba(22,59,52,0.5)' }}
            >
              {tr
                ? 'Tatil deneyiminizi unutulmaz kılacak her detay düşünüldü.'
                : 'Every detail considered to make your stay unforgettable.'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-12 max-w-4xl w-full">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-cream/10 backdrop-blur-md border border-gold-300/25 rounded-2xl p-4 md:p-5 transition-all duration-500 hover:bg-cream/15 hover:border-gold-300/50"
                >
                  <div className="font-display text-3xl md:text-4xl font-light text-cream mb-1">
                    {s.value}
                  </div>
                  <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-gold-200 font-semibold">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========== 02.1 — DAİRE İÇİ OLANAKLAR =========== */}
        <section className="py-28 md:py-32 bg-cream">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-14">
              <Eyebrow className="mb-4">{tr ? 'Daire İçi' : 'In Apartment'}</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl text-sea-900 font-light leading-tight">
                {tr ? 'Daire Olanakları' : 'Apartment Features'}
              </h2>
              <div className="mt-5 flex justify-center">
                <GoldDivider />
              </div>
              <p className="mt-6 text-lg text-ink-soft font-light max-w-2xl mx-auto">
                {tr
                  ? 'Rahat ve konforlu bir yaşam için gereken tüm donanımlar.'
                  : 'Everything you need for a comfortable stay.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {apartmentFeatures.map(({ Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="group relative bg-cream rounded-2xl p-6 border border-gold-300/20 hover:border-gold-500/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-15px_rgba(22,59,52,0.35)] overflow-hidden"
                  style={{ animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.06}s both` }}
                >
                  <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold-500/40 group-hover:border-gold-500 transition" />
                  <div className="relative w-11 h-11 mb-4 flex items-center justify-center rounded-full bg-sand-50 border border-gold-500/40 group-hover:bg-gold-50 group-hover:border-gold-500 transition">
                    <Icon className="w-5 h-5 text-sea-800 group-hover:text-gold-700 transition" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-sea-900 font-semibold mb-2">
                    {title}
                  </h3>
                  <p className="text-[13px] text-mute font-light leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========== 02.2 — KOMPLEKS OLANAKLARI =========== */}
        <section className="relative py-28 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/h4-rev-img-3-1536x864.jpg"
              alt="Complex"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 50%' }}
            />
            <div className="absolute inset-0 bg-sea-900/65" />
          </div>

          <div className="relative z-10 container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-14">
              <Eyebrow tone="cream" className="mb-4">{tr ? 'Kompleks' : 'Complex'}</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl text-cream font-light leading-tight">
                {tr ? 'Kompleks Olanakları' : 'Complex Amenities'}
              </h2>
              <div className="mt-5 flex justify-center">
                <GoldDivider />
              </div>
              <p className="mt-6 text-lg text-cream/80 font-light max-w-2xl mx-auto">
                {tr
                  ? 'Unutulmaz bir tatil deneyimi için tasarlanmış tüm olanaklar.'
                  : 'Every amenity designed for an unforgettable vacation.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {complexFeatures.map(({ Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="group relative bg-cream/95 backdrop-blur rounded-2xl p-6 border border-gold-300/30 hover:border-gold-500/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-15px_rgba(22,59,52,0.5)] overflow-hidden"
                  style={{ animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.06}s both` }}
                >
                  <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold-500/40 group-hover:border-gold-500 transition" />
                  <div className="relative w-11 h-11 mb-4 flex items-center justify-center rounded-full bg-sand-50 border border-gold-500/40 group-hover:bg-gold-50 group-hover:border-gold-500 transition">
                    <Icon className="w-5 h-5 text-sea-800 group-hover:text-gold-700 transition" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-sea-900 font-semibold mb-2">
                    {title}
                  </h3>
                  <p className="text-[13px] text-mute font-light leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========== 02.3 — KONUM AVANTAJLARI =========== */}
        <section className="py-28 md:py-32 bg-sand-50">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-14">
              <Eyebrow className="mb-4">{tr ? 'Konum' : 'Location'}</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl text-sea-900 font-light leading-tight">
                {tr ? 'Konum Avantajları' : 'Location Advantages'}
              </h2>
              <div className="mt-5 flex justify-center">
                <GoldDivider />
              </div>
              <p className="mt-6 text-lg text-ink-soft font-light max-w-2xl mx-auto">
                {tr
                  ? 'Her şeye yakın, her zaman uygun bir konumda.'
                  : 'Close to everything, always convenient.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {locationFeatures.map(({ Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="group relative flex items-start gap-5 p-7 rounded-2xl bg-cream border border-gold-300/30 hover:border-gold-500/60 shadow-[0_15px_40px_-15px_rgba(22,59,52,0.18)] hover:shadow-[0_25px_60px_-20px_rgba(22,59,52,0.32)] transition-all duration-500 hover:-translate-y-1"
                  style={{ animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s both` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-sea-900 flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                    <Icon className="w-6 h-6 text-gold-300" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-display font-medium text-sea-900 mb-1.5">
                      {title}
                    </h3>
                    <p className="text-sm text-mute font-light leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <MapPin className="w-4 h-4 text-gold-500 mt-1 opacity-50 group-hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========== CTA =========== */}
        <section className="relative py-24 md:py-28 bg-sea-900 overflow-hidden">
          <div className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sea-400/10 blur-3xl" />

          <div className="relative container mx-auto px-6 text-center max-w-3xl">
            <Sparkles className="w-7 h-7 text-gold-300 mx-auto mb-5" />
            <Eyebrow tone="cream" className="mb-4">
              {tr ? 'Hazırsınız' : 'Ready when you are'}
            </Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl text-cream font-light leading-tight mb-6">
              {tr ? 'Şimdi rezervasyon yapın' : 'Reserve your stay'}
            </h2>
            <div className="flex justify-center mb-7">
              <GoldDivider />
            </div>
            <p className="text-cream/75 text-base md:text-lg font-light mb-10 max-w-xl mx-auto">
              {tr
                ? 'Bu olanakların ve butik atmosferin tadını çıkarın.'
                : 'Enjoy all these amenities and the boutique atmosphere.'}
            </p>
            <Link
              href="/rezervasyon"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gold-500 text-sea-900 hover:bg-gold-300 transition-all text-[12px] tracking-[0.28em] uppercase font-semibold shadow-[0_10px_30px_rgba(201,169,97,0.35)] hover:shadow-[0_14px_40px_rgba(201,169,97,0.5)]"
            >
              {tr ? 'Rezervasyon Yap' : 'Book Now'}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
