// SEO Metadata Helper
export const siteConfig = {
  name: 'Serenity İskele - White Residence',
  description: 'Kuzey Kıbrıs İskele\'de lüks tatil evi kiralama. Denize sıfır, modern, tam donanımlı villa. Muhteşem deniz manzarası ile unutulmaz bir tatil deneyimi.',
  url: 'https://serenityiskele.com',
  ogImage: '/images/og-image.jpg',
  keywords: ['kuzey kıbrıs', 'iskele', 'tatil evi', 'villa kiralama', 'lüks konaklama', 'deniz manzaralı', 'white residence', 'tatil', 'kiralık ev'],
  locale: 'tr_TR',
  type: 'website',
  phone: '+90 533 XXX XX XX',
  email: 'info@serenityiskele.com',
  address: 'İskele, Kuzey Kıbrıs',
  coordinates: {
    lat: 35.2883,
    lng: 33.9167
  },
  socialMedia: {
    instagram: 'https://instagram.com/serenityiskele',
    facebook: 'https://facebook.com/serenityiskele',
    whatsapp: 'https://wa.me/905XXXXXXXXX'
  },
  priceRange: '$$'
}

export function generateMetadata(page) {
  const pages = {
    home: {
      title: 'Serenity İskele - Kuzey Kıbrıs Lüks Tatil Evi',
      description: 'İskele White Residence\'ta denize sıfır, lüks tatil evi. 4+1, havuzlu, full donanımlı villa kiralama. Muhteşem Akdeniz manzarası ile unutulmaz tatil.',
      keywords: [...siteConfig.keywords, 'anasayfa', 'villa kiralık'],
      ogTitle: 'Serenity İskele | Kuzey Kıbrıs\'ın En Lüks Tatil Evi',
      ogDescription: 'Denize sıfır lokasyonda, modern tasarım ve lüks konforla unutulmaz bir tatil deneyimi.',
      canonical: siteConfig.url
    },
    galeri: {
      title: 'Galeri - Serenity İskele Tatil Evi Fotoğrafları',
      description: 'Serenity İskele White Residence tatil evinin iç mekan, dış mekan, havuz ve deniz manzarası fotoğrafları. Lüks villa görüntüleri.',
      keywords: [...siteConfig.keywords, 'galeri', 'fotoğraflar', 'villa görüntüleri'],
      ogTitle: 'Serenity İskele Galeri | Villa Fotoğrafları',
      ogDescription: 'Lüks tatil evimizin her köşesini keşfedin. İç mekan, havuz ve muhteşem deniz manzarası.',
      canonical: `${siteConfig.url}/galeri`
    },
    ozellikler: {
      title: 'Özellikler - Villa İmkanları ve Olanaklar | Serenity İskele',
      description: 'Serenity İskele tatil evinin tüm özellikleri: Özel havuz, deniz manzarası, full donanımlı mutfak, klima, Wi-Fi ve daha fazlası.',
      keywords: [...siteConfig.keywords, 'özellikler', 'olanaklar', 'imkanlar'],
      ogTitle: 'Villa Özellikleri | Serenity İskele',
      ogDescription: 'Modern konfor ve lüks olanaklar: Özel havuz, deniz manzarası, full donanım.',
      canonical: `${siteConfig.url}/ozellikler`
    },
    rezervasyon: {
      title: 'Online Rezervasyon - Serenity İskele Tatil Evi',
      description: 'Serenity İskele White Residence için online rezervasyon yapın. Müsaitlik sorgulama, fiyat hesaplama ve güvenli ödeme.',
      keywords: [...siteConfig.keywords, 'rezervasyon', 'online booking', 'tatil rezervasyonu'],
      ogTitle: 'Online Rezervasyon | Serenity İskele',
      ogDescription: 'Hemen rezervasyon yapın ve rüya tatilinizi planlayın. Online ödeme ve anında onay.',
      canonical: `${siteConfig.url}/rezervasyon`
    },
    iletisim: {
      title: 'İletişim - Serenity İskele Tatil Evi',
      description: 'Serenity İskele ile iletişime geçin. Rezervasyon, bilgi ve sorularınız için bize ulaşın. WhatsApp, telefon ve e-posta.',
      keywords: [...siteConfig.keywords, 'iletişim', 'telefon', 'adres', 'whatsapp'],
      ogTitle: 'İletişim | Serenity İskele',
      ogDescription: 'Sorularınız için bize ulaşın. 7/24 WhatsApp desteği ve hızlı yanıt.',
      canonical: `${siteConfig.url}/iletisim`
    }
  }

  const pageData = pages[page] || pages.home

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords.join(', '),
    authors: [{ name: 'Serenity İskele' }],
    creator: 'Serenity İskele',
    publisher: 'Serenity İskele',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageData.canonical,
    },
    openGraph: {
      title: pageData.ogTitle,
      description: pageData.ogDescription,
      url: pageData.canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        }
      ],
      locale: siteConfig.locale,
      type: siteConfig.type,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.ogTitle,
      description: pageData.ogDescription,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  }
}

// Structured Data (JSON-LD) Generator
export function generateStructuredData(type = 'home') {
  const baseData = {
    '@context': 'https://schema.org',
  }

  if (type === 'home' || type === 'organization') {
    return {
      ...baseData,
      '@type': 'LodgingBusiness',
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'İskele',
        addressRegion: 'Kuzey Kıbrıs',
        addressCountry: 'CY'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.coordinates.lat,
        longitude: siteConfig.coordinates.lng
      },
      image: siteConfig.ogImage,
      priceRange: siteConfig.priceRange,
      starRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Özel Havuz', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Deniz Manzarası', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Klima', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Otopark', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Full Donanımlı Mutfak', value: true }
      ],
      sameAs: [
        siteConfig.socialMedia.instagram,
        siteConfig.socialMedia.facebook
      ]
    }
  }

  if (type === 'breadcrumb') {
    return {
      ...baseData,
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Anasayfa',
          item: siteConfig.url
        }
      ]
    }
  }

  return baseData
}

// Helper: Add breadcrumb item
export function addBreadcrumb(breadcrumbData, name, url, position) {
  breadcrumbData.itemListElement.push({
    '@type': 'ListItem',
    position,
    name,
    item: url
  })
  return breadcrumbData
}
