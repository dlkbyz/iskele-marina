import { createClient } from '@supabase/supabase-js'
import YorumlarClient from './YorumlarClient'
import { fetchHeroSlot } from '@/lib/heroSlot'

export const revalidate = 0

export default async function YorumlarPage() {
  let initialReviews = []

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data } = await supabase
      .from('yorumlar')
      .select('*')
      .eq('onaylandi', true)
      .order('created_at', { ascending: false })

    initialReviews = data || []
  } catch (error) {
    console.error('Yorumlar sunucudan yüklenemedi:', error)
  }

  const heroImage = await fetchHeroSlot('yorumlar_hero', '/h4-rev-img-3-1536x864.jpg')

  return <YorumlarClient initialReviews={initialReviews} initialHeroImage={heroImage} />
}
