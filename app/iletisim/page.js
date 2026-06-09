import { fetchHeroSlot } from '@/lib/heroSlot'
import IletisimClient from './IletisimClient'

export const revalidate = 0

export default async function IletisimPage() {
  const heroImage = await fetchHeroSlot('iletisim_hero', '/salon.png')
  return <IletisimClient initialHeroImage={heroImage} />
}
