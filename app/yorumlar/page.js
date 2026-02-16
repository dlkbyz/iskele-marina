import { createClient } from '@supabase/supabase-js'
import YorumlarClient from './YorumlarClient'

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

  return <YorumlarClient initialReviews={initialReviews} />
}
