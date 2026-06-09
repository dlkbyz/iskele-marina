'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ImageOff, Search } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ChapterMarker, GoldDivider, Eyebrow } from '../components/SiteShell'

export default function GaleriClient({ initialFotolar = [], initialHeroImage }) {
  const { language } = useLanguage()
  const tr = language === 'tr'

  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fotolar] = useState(initialFotolar)
  const loading = false

  /* Fallback — kullanıcının yerel mekan görselleri */
  const fallbackImages = [
    { image_url: '/salon.png', baslik: tr ? 'Yaşam Alanı' : 'Living Space' },
    { image_url: '/yatak_odasi.png', baslik: tr ? 'Yatak Odası' : 'Bedroom' },
    { image_url: '/living.png', baslik: tr ? 'Oturma Odası' : 'Living Room' },
    { image_url: '/salon.png', baslik: tr ? 'Çocuk Odası' : 'Kids Room' },
    { image_url: '/salon.png', baslik: tr ? 'Suite Detayları' : 'Suite Details' },
    { image_url: '/main_bedroom.png', baslik: tr ? 'TV Duvarı' : 'TV Wall' },
    { image_url: '/salon.png', baslik: tr ? 'Genel Görünüm' : 'Overview' },
    { image_url: '/salon.png', baslik: tr ? 'Atmosfer' : 'Atmosphere' },
    { image_url: '/salon.png', baslik: tr ? 'Detay' : 'Detail' },
  ]

  const displayImages = fotolar.length > 0 ? fotolar : fallbackImages
  const heroImage = initialHeroImage || '/salon.png'

  const openLightbox = (img, index) => {
    setSelectedImage(img.image_url)
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }, [])

  const navigateImage = useCallback(
    (direction) => {
      const newIndex =
        direction === 'next'
          ? (selectedIndex + 1) % displayImages.length
          : (selectedIndex - 1 + displayImages.length) % displayImages.length
      setSelectedIndex(newIndex)
      setSelectedImage(displayImages[newIndex].image_url)
    },
    [selectedIndex, displayImages]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (!selectedImage) return
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') navigateImage('prev')
      else if (e.key === 'ArrowRight') navigateImage('next')
    },
    [selectedImage, closeLightbox, navigateImage]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <Navbar />

      <main className="bg-cream">
        {/* ============================ HERO ============================ */}
        <section className="relative h-[520px] md:h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Gallery hero"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(19,64,59,0.55) 0%, rgba(19,64,59,0.25) 45%, rgba(19,64,59,0.65) 100%)' }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-24">
            <ChapterMarker number="01" label={tr ? 'Galeri' : 'Gallery'} tone="cream" />
            <h1
              className="font-display text-cream text-5xl md:text-7xl font-light leading-[1.05] mt-6 max-w-3xl"
              style={{ textShadow: '0 4px 24px rgba(19,64,59,0.5)' }}
            >
              {tr ? 'Mekândan kareler.' : 'Frames from the space.'}
            </h1>
            <div className="my-6">
              <GoldDivider />
            </div>
            <p
              className="max-w-xl text-cream/85 text-base md:text-lg font-light"
              style={{ textShadow: '0 2px 12px rgba(19,64,59,0.5)' }}
            >
              {tr
                ? "Serenity İskele'nin atmosferini, sıcaklığını ve detaylarını paylaşıyoruz."
                : "Discover the atmosphere, warmth and details of Serenity İskele."}
            </p>
          </div>
        </section>

        {/* ============================ MASONRY ============================ */}
        <section className="py-24 md:py-32 bg-cream">
          <div className="container mx-auto px-6 max-w-7xl">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                <p className="text-mute mt-4 font-light tracking-wider text-sm">
                  {tr ? 'Yükleniyor…' : 'Loading…'}
                </p>
              </div>
            ) : displayImages.length === 0 ? (
              <div className="text-center py-20">
                <ImageOff className="w-12 h-12 text-gold-500/50 mx-auto mb-4" />
                <p className="text-mute font-light">
                  {tr ? 'Henüz görsel yok.' : 'No images yet.'}
                </p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-6 space-y-5 md:space-y-6">
                {displayImages.map((img, index) => (
                  <div
                    key={index}
                    className="group relative break-inside-avoid overflow-hidden rounded-2xl shadow-[0_15px_40px_-15px_rgba(19,64,59,0.25)] hover:shadow-[0_30px_70px_-20px_rgba(19,64,59,0.45)] transition-all duration-700 cursor-pointer border border-gold-300/20"
                    onClick={() => openLightbox(img, index)}
                    style={{ animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s both` }}
                  >
                    <img
                      src={img.image_url}
                      alt={img.baslik || `Gallery ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-[1.4s] group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                    {/* Hover overlay — sadece view ikonu */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sea-900/60 via-sea-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-end justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                      <div className="w-11 h-11 rounded-full bg-gold-500 text-sea-900 flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ============================ LIGHTBOX ============================ */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-sea-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 md:top-8 md:right-8 w-12 h-12 rounded-full bg-cream/10 hover:bg-gold-500 border border-gold-300/30 text-cream hover:text-sea-900 flex items-center justify-center transition-all duration-300 z-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('prev') }}
            className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-cream/10 hover:bg-gold-500 border border-gold-300/30 text-cream hover:text-sea-900 flex items-center justify-center transition-all duration-300 z-50"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('next') }}
            className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-cream/10 hover:bg-gold-500 border border-gold-300/30 text-cream hover:text-sea-900 flex items-center justify-center transition-all duration-300 z-50"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[88vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 inline-flex items-center gap-3 bg-cream/10 backdrop-blur-md border border-gold-300/30 px-5 py-2.5 rounded-full">
              <span className="text-[11px] tracking-[0.32em] uppercase text-gold-300 font-semibold">
                {selectedIndex + 1} / {displayImages.length}
              </span>
            </div>
          </div>

          {/* Help text */}
          <div className="absolute bottom-5 left-5 text-cream/50 text-[10px] tracking-[0.22em] uppercase space-y-1">
            <p>← → {tr ? 'Yön Tuşları' : 'Arrows'}</p>
            <p>ESC {tr ? 'Kapat' : 'Close'}</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
