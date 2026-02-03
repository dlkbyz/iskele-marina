'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function OdemeBekleme() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const rezervasyonId = searchParams.get('rezervasyonId')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Simülasyon: 5 saniye sonra başarı sayfasına yönlendir
          setTimeout(() => {
            router.push(`/odeme/basarili?rezervasyonId=${rezervasyonId}`)
          }, 1000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [rezervasyonId, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Animated Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-white mb-2">Ödeme İşleminiz</h2>
            <p className="text-blue-100 text-sm">Banka sayfasına yönlendiriliyorsunuz</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Loading Spinner */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{countdown}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold text-blue-900 mb-3">ÖNEML İ BİLGİLER</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Güvenli ödeme sayfasına yönlendiriliyorsunuz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Rezervasyon No: <strong>#{rezervasyonId || 'XXX'}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Lütfen bu pencereyi kapatmayınız</span>
                </li>
              </ul>
            </div>

            {/* Progress Steps */}
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Rezervasyon Oluşturuldu</p>
                  <p className="text-xs text-gray-500">Bilgileriniz kaydedildi</p>
                </div>
              </div>
              <div className="ml-4 w-0.5 h-8 bg-gradient-to-b from-green-500 to-blue-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Ödeme Sayfasına Yönlendirme</p>
                  <p className="text-xs text-gray-500">Lütfen bekleyiniz...</p>
                </div>
              </div>
              <div className="ml-4 w-0.5 h-8 bg-gray-200"></div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">3</div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-gray-400">Ödeme Onayı</p>
                  <p className="text-xs text-gray-400">Sonraki adım</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-4">
              Sorun mu yaşıyorsunuz?
            </p>
            <Link 
              href="/iletisim" 
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Bizimle İletişime Geçin →
            </Link>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            <svg className="w-4 h-4 inline-block mr-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Güvenli 256-bit SSL şifrelemesi
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
