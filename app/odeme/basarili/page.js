'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function OdemeBasarili() {
  const searchParams = useSearchParams()
  const [rezervasyon, setRezervasyon] = useState(null)
  const rezervasyonId = searchParams.get('rezervasyonId')

  useEffect(() => {
    // Confetti animasyonu
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Simülasyon: Rezervasyon bilgisi
    setRezervasyon({
      id: rezervasyonId || '1234',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      email: 'ahmet@example.com',
      giris: '2025-07-15',
      cikis: '2025-07-22',
      kisiSayisi: 4,
      toplamFiyat: '€1,015',
      odemeZamani: new Date().toLocaleString('tr-TR')
    })

    return () => clearInterval(interval)
  }, [rezervasyonId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-10 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Ödeme Başarılı!
              </h1>
              <p className="text-emerald-100 text-lg">
                Rezervasyonunuz onaylandı 🎉
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-10">
            {/* Rezervasyon Detayları */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-emerald-200">
                <h2 className="text-sm tracking-[0.2em] uppercase text-emerald-900 font-bold">
                  REZERVASYON BİLGİLERİ
                </h2>
                <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                  ONAYLANDI
                </span>
              </div>

              {rezervasyon && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-emerald-700 mb-2 font-semibold">REZERVASYON NO</p>
                    <p className="text-2xl font-bold text-gray-900">#{rezervasyon.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 mb-2 font-semibold">TOPLAM TUTAR</p>
                    <p className="text-2xl font-bold text-emerald-600">{rezervasyon.toplamFiyat}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 mb-2 font-semibold">GİRİŞ TARİHİ</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(rezervasyon.giris).toLocaleDateString('tr-TR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 mb-2 font-semibold">ÇIKIŞ TARİHİ</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(rezervasyon.cikis).toLocaleDateString('tr-TR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 mb-2 font-semibold">KİŞİ SAYISI</p>
                    <p className="text-lg font-semibold text-gray-900">{rezervasyon.kisiSayisi} Kişi</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 mb-2 font-semibold">ÖDEME ZAMANI</p>
                    <p className="text-lg font-semibold text-gray-900">{rezervasyon.odemeZamani}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bilgilendirme */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                SONRAKI ADIMLAR
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">1.</span>
                  <span>Rezervasyon onayınız e-posta adresinize gönderildi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">2.</span>
                  <span>Check-in saati <strong>14:00</strong>, Check-out saati <strong>12:00</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">3.</span>
                  <span>Giriş tarihinden 24 saat önce size hatırlatma mesajı göndereceğiz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">4.</span>
                  <span>Sorularınız için WhatsApp hattımızdan bize ulaşabilirsiniz</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/"
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                ANA SAYFA
              </Link>
              <a
                href={rezervasyon ? `mailto:${rezervasyon.email}?subject=Rezervasyon%20Onayı%20-%20${rezervasyon.id}` : '#'}
                className="flex items-center justify-center px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-xl font-bold text-sm tracking-wider uppercase transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-POSTA GÖR
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-serif text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Sorularınız mı var?
          </h3>
          <p className="text-green-100 mb-6">
            WhatsApp üzerinden 7/24 size yardımcı olabiliriz
          </p>
          <a
            href="https://wa.me/905331234567?text=Merhaba, rezervasyon hakkında bilgi almak istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-green-600 rounded-full font-bold text-sm tracking-wider uppercase transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WHATSAPP İLE İLETİŞİM
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  )
}
