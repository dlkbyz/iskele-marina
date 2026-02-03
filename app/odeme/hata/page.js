'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function OdemeHata() {
  const searchParams = useSearchParams()
  const hataMesaji = searchParams.get('mesaj') || 'Ödeme işlemi sırasında bir hata oluştu.'
  const rezervasyonId = searchParams.get('rezervasyonId')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-shake">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Ödeme Başarısız
              </h1>
              <p className="text-red-100 text-lg">
                İşleminiz tamamlanamadı
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-10">
            {/* Hata Mesajı */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-red-900 mb-2">HATA DETAYI</h3>
                  <p className="text-sm text-red-800">{hataMesaji}</p>
                </div>
              </div>
            </div>

            {/* Rezervasyon Bilgisi */}
            {rezervasyonId && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Rezervasyon Numaranız:</p>
                <p className="text-2xl font-bold text-gray-900">#{rezervasyonId}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Rezervasyonunuz kaydedildi ancak ödeme alınamadı. Lütfen tekrar deneyiniz.
                </p>
              </div>
            )}

            {/* Olası Sebepler */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-sm font-bold text-orange-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                OLASI SEBEPLER
              </h3>
              <ul className="space-y-3 text-sm text-orange-800">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  <span>Yetersiz bakiye veya kart limiti</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  <span>Hatalı kart bilgileri (kart numarası, CVV, son kullanma tarihi)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  <span>3D Secure doğrulama başarısız</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  <span>İnternet bağlantısı sorunu</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  <span>Banka tarafında geçici teknik sorun</span>
                </li>
              </ul>
            </div>

            {/* Öneriler */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                ÖNERİLER
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">1.</span>
                  <span>Kart bilgilerinizi kontrol edin ve tekrar deneyin</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">2.</span>
                  <span>Farklı bir kart ile ödeme yapabilirsiniz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">3.</span>
                  <span>Bankanızla iletişime geçerek kart durumunu kontrol edin</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">4.</span>
                  <span>Sorun devam ederse bize WhatsApp üzerinden ulaşın</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href={rezervasyonId ? `/rezervasyon?rezervasyonId=${rezervasyonId}` : '/rezervasyon'}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                TEKRAR DENE
              </Link>
              <a
                href="https://wa.me/905331234567?text=Merhaba, ödeme işlemimde sorun yaşıyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WHATSAPP DESTEK
              </a>
            </div>

            {/* Ana Sayfa Linki */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 underline">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>

        {/* Güvenlik Bilgisi */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
          <p className="text-xs text-gray-600">
            <svg className="w-4 h-4 inline-block mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Tüm ödemeler 256-bit SSL şifrelemesi ile güvence altındadır.
            <br />
            Kart bilgileriniz hiçbir şekilde saklanmaz.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
