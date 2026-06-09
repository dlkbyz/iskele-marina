'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Shared ornamental + brand components used across all sub-pages
 * to keep the "Akdeniz lüks butik" design language consistent.
 */

/**
 * Galeri slot foto'sunu çeker; bulamazsa fallback verir.
 * Kullanım: const hero = useHeroSlot('ozellikler_hero', '/fallback.jpg')
 */
export function useHeroSlot(slotKey, fallback) {
  const [src, setSrc] = useState(fallback)
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const { data } = await supabase
          .from('galeri')
          .select('image_url')
          .contains('kullanim_yerleri', [slotKey])
          .eq('aktif', true)
          .order('sira', { ascending: true })
          .limit(1)
          .maybeSingle()
        if (!cancelled && data?.image_url) setSrc(data.image_url)
      } catch (e) { console.warn('Hero slot:', slotKey, e) }
    }
    load()
    return () => { cancelled = true }
  }, [slotKey])
  return src
}

export function GoldDivider({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="block h-px w-10 bg-gold-500/60" />
      <span className="block h-1.5 w-1.5 rotate-45 bg-gold-500" />
      <span className="block h-px w-10 bg-gold-500/60" />
    </div>
  )
}

export function Eyebrow({ children, tone = 'gold', className = '' }) {
  const color = tone === 'cream' ? 'text-gold-300' : 'text-gold-600'
  return (
    <p className={`text-[11px] tracking-[0.32em] uppercase font-medium ${color} ${className}`}>
      {children}
    </p>
  )
}

/**
 * Magazine-style chapter marker — "01 · CHAPTER NAME"
 */
export function ChapterMarker({ label, tone = 'gold' }) {
  const color = tone === 'cream' ? 'text-gold-300' : 'text-gold-600'
  return (
    <div className={`inline-flex items-center gap-3 ${color}`}>
      <span className="block h-px w-8 bg-current opacity-50" />
      <span className="text-[10px] tracking-[0.32em] uppercase font-medium">{label}</span>
    </div>
  )
}

/* Brand icons (Instagram/Facebook removed from lucide for trademark reasons) */
export const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
  </svg>
)

export const IconFacebook = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

/**
 * Section page-header used by sub-routes (galeri, özellikler, yorumlar, iletisim).
 * Provides the same cinematic hero treatment as the home hero, but lighter.
 */
export function PageHero({ number, label, title, subtitle, image, fallbackImage = '/salon.png' }) {
  return (
    <section className="relative h-[480px] md:h-[560px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={image || fallbackImage}
          alt={title}
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 45%' }}
          onError={(e) => { e.currentTarget.src = fallbackImage }}
        />
        {/* dim gradients */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(19,64,59,0.55) 0%, rgba(19,64,59,0.25) 40%, rgba(19,64,59,0.55) 100%)' }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-20">
        <div className="mb-6">
          <ChapterMarker number={number} label={label} tone="cream" />
        </div>
        <h1
          className="font-display text-cream text-5xl md:text-7xl font-light leading-[1.05] max-w-4xl"
          style={{ textShadow: '0 4px 24px rgba(19,64,59,0.5)' }}
        >
          {title}
        </h1>
        <div className="my-6">
          <GoldDivider />
        </div>
        {subtitle ? (
          <p
            className="max-w-xl text-cream/85 text-base md:text-lg font-light leading-relaxed"
            style={{ textShadow: '0 2px 12px rgba(19,64,59,0.5)' }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  )
}
