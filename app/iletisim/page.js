import { fetchHeroSlot } from '@/lib/heroSlot'
import IletisimClient from './IletisimClient'

export const revalidate = 0

export default async function IletisimPage() {
  const heroImage = await fetchHeroSlot('iletisim_hero', '/h4-rev-img-1-1536x864.jpg')
  return <IletisimClient initialHeroImage={heroImage} />
}
