import { supabase } from './supabase'

/**
 * Server-side: galeri tablosundan slot foto'sunu çek, yoksa fallback ver.
 * Anasayfa dışındaki sayfalarda hero foto'larını SSR ile yüklemek için.
 */
export async function fetchHeroSlot(slotKey, fallback) {
  try {
    const { data } = await supabase
      .from('galeri')
      .select('image_url')
      .contains('kullanim_yerleri', [slotKey])
      .eq('aktif', true)
      .order('sira', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (data?.image_url) return data.image_url
  } catch (e) {
    console.warn('fetchHeroSlot:', slotKey, e)
  }
  return fallback
}
