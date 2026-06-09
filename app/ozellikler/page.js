import { fetchHeroSlot } from '@/lib/heroSlot'
import OzelliklerClient from './OzelliklerClient'

export const revalidate = 0

export default async function OzelliklerPage() {
  const heroImage = await fetchHeroSlot('ozellikler_hero', '/h4-rev-img-2-1536x864.jpg')
  return <OzelliklerClient initialHeroImage={heroImage} />
}
