import './globals.css'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { CurrencyProvider } from './context/CurrencyContext'
import { LanguageProvider } from '@/lib/LanguageContext'
import { generateMetadata as getMetadata } from '@/lib/metadata'
import WhatsAppFloat from './components/WhatsAppFloat'

export const metadata = getMetadata('home')

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans bg-cream text-ink">
        <LanguageProvider>
          <CurrencyProvider>
            {children}
            <WhatsAppFloat />
            <div id="datepicker-portal" />
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
