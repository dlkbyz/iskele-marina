'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '../components/Footer'

export default function KullanimKosullari() {
  const { language } = useLanguage()
  const tr = language === 'tr'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center space-x-3 w-fit">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Serenity <span className="font-light text-cyan-600">İskele</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {tr ? 'Kullanım Koşulları' : 'Terms of Use'}
        </h1>
        <p className="text-gray-500 mb-10">
          {tr ? 'Son güncelleme: Şubat 2026' : 'Last updated: February 2026'}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {tr ? '1. Rezervasyon Koşulları' : '1. Reservation Terms'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {tr
                ? 'Rezervasyon, onay e-postası alındıktan sonra kesinleşir. Minimum konaklama süresi 3 gecedir. Rezervasyon kapasitesi maksimum kişi sayısını aşamaz.'
                : 'A reservation is confirmed upon receipt of the confirmation email. Minimum stay is 3 nights. The number of guests may not exceed the maximum capacity.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {tr ? '2. İptal ve İade Politikası' : '2. Cancellation & Refund Policy'}
            </h2>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>
                {tr
                  ? '30 gün veya daha önce: %100 iade'
                  : '30 days or more in advance: 100% refund'}
              </li>
              <li>
                {tr
                  ? '15-29 gün önce: %50 iade'
                  : '15-29 days in advance: 50% refund'}
              </li>
              <li>
                {tr
                  ? '14 gün veya daha az: İade yapılmaz'
                  : '14 days or less: No refund'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {tr ? '3. Check-in / Check-out' : '3. Check-in / Check-out'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {tr
                ? 'Check-in saati 14:00, check-out saati 11:00\'dir. Erken check-in veya geç check-out talebi önceden bildirilmesi ve uygunluk durumuna göre değerlendirilir.'
                : 'Check-in time is 14:00, check-out time is 11:00. Early check-in or late check-out requests must be communicated in advance and are subject to availability.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {tr ? '4. Mülk Kullanım Kuralları' : '4. Property Rules'}
            </h2>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>{tr ? 'Sigara içilmez (iç mekânlarda)' : 'No smoking indoors'}</li>
              <li>{tr ? 'Evcil hayvan kabul edilmez' : 'No pets allowed'}</li>
              <li>{tr ? 'Parti ve gürültülü etkinlik yasaktır' : 'Parties and loud events are not permitted'}</li>
              <li>{tr ? 'Mülke verilen hasarlar kiracı tarafından karşılanır' : 'Guests are responsible for any damage to the property'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {tr ? '5. Sorumluluk' : '5. Liability'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {tr
                ? 'Serenity İskele, misafirin kontrolü dışındaki durumlardan (doğal afet, elektrik kesintisi vb.) kaynaklanan aksaklıklardan sorumlu tutulamaz.'
                : 'Serenity İskele cannot be held responsible for disruptions caused by circumstances beyond the guest\'s control (natural disasters, power outages, etc.).'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {tr ? '6. İletişim' : '6. Contact'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {tr ? 'Sorularınız için ' : 'For inquiries, please visit '}
              <Link href="/iletisim" className="text-cyan-600 hover:underline">
                {tr ? 'iletişim sayfamızı' : 'our contact page'}
              </Link>
              {tr ? ' ziyaret edebilirsiniz.' : '.'}
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tr ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
