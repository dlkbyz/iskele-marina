'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AvailabilityCalendar() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null })

  useEffect(() => {
    loadReservations()
  }, [])

  const formatDateLocal = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const normalizeDbDate = (value) => {
    if (!value) return null
    return String(value).substring(0, 10)
  }

  const displayDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(`${dateStr}T00:00:00`)
    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const loadReservations = async () => {
    try {
      const { data } = await supabase
        .from('rezervasyonlar')
        .select('*')
        .eq('durum', 'onaylandi')
      setReservations(data || [])
    } catch (error) {
      console.error('Error loading reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const isDateBooked = (dateStr) => {
    return reservations.some((r) => {
      const start = normalizeDbDate(r.giris_tarihi)
      const end = normalizeDbDate(r.cikis_tarihi)
      if (!start || !end) return false
      return dateStr >= start && dateStr <= end
    })
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = formatDateLocal(date)
    
    if (!selectedDates.start) {
      setSelectedDates({ start: dateStr, end: null })
    } else if (!selectedDates.end) {
      if (dateStr >= selectedDates.start) {
        setSelectedDates({ ...selectedDates, end: dateStr })
      }
    }
  }

  const handleReserve = () => {
    if (selectedDates.start && selectedDates.end) {
      router.push(`/rezervasyon?giris=${selectedDates.start}&cikis=${selectedDates.end}`)
    }
  }

  const quickReserve = () => {
    if (selectedDates.start && selectedDates.end) {
      handleReserve()
    } else {
      router.push('/rezervasyon')
    }
  }

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const today = new Date().setHours(0, 0, 0, 0)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = date.toISOString().split('T')[0]
    const dateTime = date.setHours(0, 0, 0, 0)
    const isPast = dateTime < today
    const isBooked = isDateBooked(dateStr)
    const isStart = selectedDates.start === dateStr
    const isEnd = selectedDates.end === dateStr
    const isInRange = selectedDates.start && selectedDates.end &&
                      dateStr >= selectedDates.start && dateStr <= selectedDates.end

    let bgColor = 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
    if (isPast) {
      bgColor = 'bg-gray-100 text-gray-400 cursor-not-allowed'
    } else if (isBooked) {
      bgColor = 'bg-red-100 text-red-700 cursor-not-allowed'
    }
    if (isStart || isEnd) {
      bgColor = 'bg-blue-500 text-white cursor-pointer font-bold'
    } else if (isInRange) {
      bgColor = 'bg-blue-200 text-blue-800'
    }

    days.push(
      <button
        key={day}
        onClick={() => !isPast && !isBooked && handleDateClick(day)}
        disabled={isPast || isBooked}
        className={`aspect-square rounded-lg ${bgColor} border border-gray-200 transition`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-2 hover:bg-gray-100 rounded-lg transition"
        >
          ← Önceki
        </button>
        <h2 className="text-2xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-2 hover:bg-gray-100 rounded-lg transition"
        >
          Sonraki →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(d => (
          <div key={d} className="text-center text-sm font-semibold text-gray-600">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2 mb-6">
          {days}
        </div>
      )}

      {/* Legend + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-sm border-t pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Müsait</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Dolu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Seçildi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Geçmiş</span>
          </div>
        </div>
        <button
          onClick={quickReserve}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-semibold whitespace-nowrap"
        >
          Hemen Rezervasyon Yap →
        </button>
      </div>

      {/* Selection info and action */}
      {selectedDates.start && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Giriş:</strong> {displayDate(selectedDates.start)}
            {selectedDates.end && (
              <>
                <br />
                <strong>Çıkış:</strong> {displayDate(selectedDates.end)}
              </>
            )}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDates({ start: null, end: null })}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Temizle
            </button>
            {selectedDates.end && (
              <button
                onClick={handleReserve}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                🎫 Rezervasyon Yap
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
