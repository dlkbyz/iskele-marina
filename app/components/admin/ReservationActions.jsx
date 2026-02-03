// components/admin/ReservationActions.jsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReservationActions({ reservation, onStatusChange }) {
  const [loading, setLoading] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [refundAmount, setRefundAmount] = useState(reservation.toplam_fiyat || 0)
  const [rejectReason, setRejectReason] = useState('')

  // Onay
  const handleApprove = async () => {
    if (window.confirm(`${reservation.ad} ${reservation.soyad} için rezervasyonu onaylamak istediğinize emin misiniz?`)) {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/reservations/${reservation.id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) throw new Error('Approval failed')

        const data = await response.json()
        alert(`✅ Rezervasyon onaylandı!\nErişim Kodu: ${data.data.erisme_kodu}`)
        onStatusChange(data.data)
      } catch (error) {
        alert(`❌ Hata: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  // İptal
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Lütfen iptal nedenini girin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundAmount: parseFloat(refundAmount),
          reason: rejectReason
        })
      })

      if (!response.ok) throw new Error('Rejection failed')

      const data = await response.json()
      alert(`✅ Rezervasyon iptal edildi ve e-mail gönderildi`)
      onStatusChange(data.data)
      setShowRejectModal(false)
    } catch (error) {
      alert(`❌ Hata: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const durum = reservation.durum || 'beklemede'

  if (durum === 'onaylandı') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
        <span className="text-lg">✅</span>
        Onaylandı
        <span className="ml-2 text-xs bg-green-200 px-2 py-1 rounded">
          {reservation.erisme_kodu}
        </span>
      </div>
    )
  }

  if (durum === 'iptal') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
        <span className="text-lg">❌</span>
        İptal Edildi
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-2">
        {/* ONAYLA BUTTON */}
        <button
          onClick={handleApprove}
          disabled={loading}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? 'İşleniyor...' : '✅ Onayla'}
        </button>

        {/* İPTAL BUTTON */}
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          ❌ İptal
        </button>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Rezervasyonu İptal Et</h3>

            <div className="space-y-4">
              {/* İptal Nedeni */}
              <div>
                <label className="block text-sm font-medium mb-2">İptal Nedeni</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Müsaitlik sorunu, müşteri isteği, vb..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  rows="3"
                />
              </div>

              {/* İade Tutarı */}
              <div>
                <label className="block text-sm font-medium mb-2">İade Tutarı ($)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  min="0"
                  max={reservation.toplam_fiyat}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Toplam: ${reservation.toplam_fiyat}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  İptal Et
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Gönderiliyor...' : 'Onayla & İptal Et'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}