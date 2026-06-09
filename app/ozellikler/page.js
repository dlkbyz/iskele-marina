import { fetchHeroSlot } from '@/lib/heroSlot'
import OzelliklerClient from './OzelliklerClient'

export const revalidate = 0

export default async function OzelliklerPage() {
  const heroImage = await fetchHeroSlot('ozellikler_hero', '/salon.png')
  return <OzelliklerClient initialHeroImage={heroImage} />
}
