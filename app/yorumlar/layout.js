import { generateMetadata as getMetadata } from '@/lib/metadata'

export const metadata = getMetadata('yorumlar')

export default function YorumlarLayout({ children }) {
  return children
}
