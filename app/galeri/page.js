import { supabase } from '@/lib/supabase'
import { fetchHeroSlot } from '@/lib/heroSlot'
import GaleriClient from './GaleriClient'

export const revalidate = 0

export default async function GaleriPage() {
  let initialFotolar = []
  try {
    const { data } = await supabase
      .from('galeri')
      .select('*')
      .eq('aktif', true)
      .order('sira', { ascending: true })
    initialFotolar = data || []
  } catch (e) {
    console.warn('Galeri SSR fetch:', e)
  }

  const heroImage = await fetchHeroSlot('galeri_hero', '/salon.png')

  return <GaleriClient initialFotolar={initialFotolar} initialHeroImage={heroImage} />
}
