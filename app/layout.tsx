import './globals.css'
import { CurrencyProvider } from './context/CurrencyContext'
import { LanguageProvider } from '@/lib/LanguageContext'
import { generateMetadata as getMetadata } from '@/lib/metadata'
import WhatsAppFloat from './components/WhatsAppFloat'

export const metadata = getMetadata('home')


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <LanguageProvider>
          <CurrencyProvider>
            {children}
            <WhatsAppFloat />
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}