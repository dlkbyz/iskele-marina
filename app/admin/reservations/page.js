// app/admin/reservations/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('beklemede') // beklemede, onaylandı, iptal

  // Rezervasyonları getir
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('rezervasyonlar')
          .select('*')
          .order('created_at', { ascending: false })

        if (filter && filter !== 'tum') {
          query = query.eq('durum', filter)
        }

        const { data, error } = await query

        if (error) throw error

        setReservations(data || [])
      } catch (error) {
        console.error('Error fetching reservations:', error)
        alert('Hata: Rezervasyonlar yüklenirken bir sorun oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [filter])

  // Status değiştiğinde listeyi güncelle
  const handleStatusChange = (updatedReservation) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === updatedReservation.id ? updatedReservation : res
      )
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasyonlar</h1>
          <p className="text-gray-600">Beklemede olan rezervasyonları onayla veya iptal et</p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { value: 'beklemede', label: '📋 Beklemede', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
            { value: 'onaylandı', label: '✅ Onaylandı', color: 'bg-green-100 text-green-700 border-green-300' },
            { value: 'iptal', label: '❌ İptal', color: 'bg-red-100 text-red-700 border-red-300' },
            { value: 'tum', label: '📊 Tümü', color: 'bg-blue-100 text-blue-700 border-blue-300' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium transition border ${
                filter === btn.value
                  ? `${btn.color} border-current`
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <div className="text-4xl">⏳</div>
            </div>
            <span className="ml-4 text-gray-600">Yükleniyor...</span>
          </div>
        )}

        {/* TABLE */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {reservations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-lg">Gösterilecek rezervasyon yok</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İsim</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tarihler</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kişi</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tutar</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Durum</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {res.ad} {res.soyad}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <a href={`mailto:${res.email}`} className="text-blue-500 hover:underline">
                            {res.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(res.giris_tarihi)} - {formatDate(res.cikis_tarihi)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {res.kisi_sayisi}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ${res.toplam_fiyat}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {res.durum === 'beklemede' && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              📋 Beklemede
                            </span>
                          )}
                          {res.durum === 'onaylandı' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              ✅ Onaylandı
                            </span>
                          )}
                          {res.durum === 'iptal' && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              ❌ İptal
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {res.durum === 'beklemede' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(res.id, 'onaylandı')}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                              >
                                Onayla
                              </button>
                              <button
                                onClick={() => handleStatusChange(res.id, 'iptal')}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                              >
                                İptal
                              </button>
                            </>
                          )}
                          {res.durum === 'onaylandı' && (
                            <button
                              onClick={() => handleStatusChange(res.id, 'iptal')}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                            >
                              İptal Et
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        {!loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Beklemede', count: reservations.filter(r => r.durum === 'beklemede').length, color: 'bg-yellow-50 border-yellow-200' },
              { label: 'Onaylandı', count: reservations.filter(r => r.durum === 'onaylandı').length, color: 'bg-green-50 border-green-200' },
              { label: 'İptal', count: reservations.filter(r => r.durum === 'iptal').length, color: 'bg-red-50 border-red-200' }
            ].map((stat) => (
              <div key={stat.label} className={`p-4 rounded-lg border ${stat.color}`}>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}