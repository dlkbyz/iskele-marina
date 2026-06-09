import { supabase } from '@/lib/supabase'
import HomeClient from './HomeClient'

/* Her istekte taze fetch — admin'den slot değişirse hemen yansır */
export const revalidate = 0

const SLOT_FALLBACKS = {
  hero:          '/salon.png',
  karsilama:     '/living.png',
  konfor_bg:     '/salon.png',
  yatak_odasi:   '/yatak_odasi.png',
  suite_detay:   '/salon.png',
  cocuk_odasi:   '/salon.png',
  manzara_bg:    '/salon.png',
  hakkimizda_bg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=900&fit=crop',
}

async function fetchSlotImages() {
  const slotImages = { ...SLOT_FALLBACKS }
  try {
    const { data } = await supabase
      .from('galeri')
      .select('kullanim_yerleri, image_url, sira')
      .not('kullanim_yerleri', 'is', null)
      .eq('aktif', true)
      .order('sira', { ascending: true })

    if (data) {
      const claimed = new Set()
      data.forEach(row => {
        ;(row.kullanim_yerleri || []).forEach(slot => {
          if (!claimed.has(slot) && row.image_url) {
            slotImages[slot] = row.image_url
            claimed.add(slot)
          }
        })
      })
    }
  } catch (e) {
    console.warn('Slot SSR fetch:', e)
  }
  return slotImages
}

export default async function HomePage() {
  const initialSlotImages = await fetchSlotImages()
  return <HomeClient initialSlotImages={initialSlotImages} />
}
