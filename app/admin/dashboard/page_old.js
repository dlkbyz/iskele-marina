'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const router = useRouter()
  const [rezervasyonlar, setRezervasyonlar] = useState([])
  const [mesajlar, setMesajlar] = useState([])
  const [yorumlar, setYorumlar] = useState([])
  const [galeriFotolar, setGaleriFotolar] = useState([])
  const [abone, setAbone] = useState([])
  const [activeTab, setActiveTab] = useState('rezervasyonlar')
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  
  // Grafik dataları
  const [monthlyData, setMonthlyData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  
  // Hızlı işlem ve takvim state'leri
  const [quickActionLoading, setQuickActionLoading] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoveredReservation, setHoveredReservation] = useState(null)

  useEffect(() => {
    // Auth kontrolü
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin')
      return
    }

    // Verileri yükle
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Rezervasyonları yükle
      const { data: rezervasyonData, error: rezervasyonError } = await supabase
        .from('rezervasyonlar')
        .select('*')
        .order('created_at', { ascending: false })

      if (rezervasyonError) throw rezervasyonError
      setRezervasyonlar(rezervasyonData || [])

      // Mesajları yükle
      const { data: mesajData, error: mesajError } = await supabase
        .from('iletisim_mesajlari')
        .select('*')
        .order('created_at', { ascending: false })

      if (mesajError) throw mesajError
      setMesajlar(mesajData || [])

      // Yorumları yükle
      const { data: yorumData, error: yorumError } = await supabase
        .from('yorumlar')
        .select('*')
        .order('created_at', { ascending: false })

      if (yorumError) throw yorumError
      setYorumlar(yorumData || [])

      // Galeri fotoğraflarını yükle
      const { data: galeriData, error: galeriError } = await supabase
        .from('galeri')
        .select('*')
        .order('sira', { ascending: true })

      if (galeriError) throw galeriError
      setGaleriFotolar(galeriData || [])

      // Aboneleri yükle
      const { data: aboneData, error: aboneError } = await supabase
        .from('newsletter_aboneler')
        .select('*')
        .order('created_at', { ascending: false })

      if (aboneError) {
        console.log('Newsletter table yok henüz - sorun değil')
        setAbone([])
      } else {
        setAbone(aboneData || [])
      }

      // Grafik dataları hazırla
      prepareChartData(rezervasyonData || [])

      setLoading(false)
    } catch (error) {
      console.error('Hata:', error)
      setLoading(false)
    }
  }

  const prepareChartData = (data) => {
    // Aylık rezervasyon trendi (son 6 ay)
    const months = ['Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak']
    const monthlyCount = months.map((month, index) => {
      const monthIndex = (new Date().getMonth() - 5 + index + 12) % 12
      const count = data.filter(r => {
        const date = new Date(r.created_at)
        return date.getMonth() === monthIndex
      }).length
      return { ay: month, rezervasyon: count }
    })
    setMonthlyData(monthlyCount)

    // Durum dağılımı
    const beklemede = data.filter(r => r.durum === 'beklemede').length
    const onaylandi = data.filter(r => r.durum === 'onaylandi').length
    const iptal = data.filter(r => r.durum === 'iptal').length
    
    setStatusData([
      { name: 'Beklemede', value: beklemede, color: '#f59e0b' },
      { name: 'Onaylandı', value: onaylandi, color: '#10b981' },
      { name: 'İptal', value: iptal, color: '#ef4444' }
    ])

    // Aylık gelir (son 6 ay)
    const revenueByMonth = months.map((month, index) => {
      const monthIndex = (new Date().getMonth() - 5 + index + 12) % 12
      const revenue = data
        .filter(r => {
          const date = new Date(r.created_at)
          return date.getMonth() === monthIndex && r.durum === 'onaylandi'
        })
        .reduce((sum, r) => sum + (r.toplam_fiyat || 0), 0)
      return { ay: month, gelir: revenue }
    })
    setRevenueData(revenueByMonth)
  }

  const handleFotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadLoading(true)

      // Dosya adını oluştur
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // Supabase Storage'a yükle
      const { data, error: uploadError } = await supabase.storage
        .from('galeri')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: false 
        })

      if (uploadError) {
        console.error('Storage error:', uploadError)
        throw new Error(`Storage hatası: ${uploadError.message}`)
      }

      if (!data) {
        throw new Error('Dosya yüklenemedi')
      }

      // Public URL'i al
      const { data: publicUrlData } = supabase.storage
        .from('galeri')
        .getPublicUrl(filePath)

      const imageUrl = publicUrlData?.publicUrl

      if (!imageUrl) {
        throw new Error('Public URL alınamadı')
      }

      // Veritabanına ekle
      const { error: dbError, data: dbData } = await supabase
        .from('galeri')
        .insert({
          image_url: imageUrl,
          baslik: file.name.split('.')[0],
          aciklama: '',
          sira: galeriFotolar.length,
          aktif: true
        })
        .select()

      if (dbError) {
        console.error('DB error:', dbError)
        throw new Error(`Veritabanı hatası: ${dbError.message}`)
      }

      alert('✅ Fotoğraf başarıyla yüklendi!')
      // Input'u temizle
      e.target.value = ''
      loadData()
    } catch (error) {
      console.error('Hata:', error)
      alert(`❌ Hata: ${error.message}`)
    } finally {
      setUploadLoading(false)
    }
  }

  const deleteFoto = async (id, imageUrl) => {
    if (!confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) return

    try {
      // Storage'dan sil
      const filePath = imageUrl.split('/').pop()
      await supabase.storage.from('galeri').remove([`galeri/${filePath}`])

      // Veritabanından sil
      const { error } = await supabase
        .from('galeri')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Fotoğraf silindi!')
      loadData()
    } catch (error) {
      console.error('Hata:', error)
      alert('Fotoğraf silinirken hata oluştu!')
    }
  }

  const updateRezervasyonDurum = async (id, yeniDurum) => {
    try {
      const { error } = await supabase
        .from('rezervasyonlar')
        .update({ durum: yeniDurum })
        .eq('id', id)

      if (error) throw error

      // Listeyi güncelle
      loadData()
      alert('Durum güncellendi!')
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu!')
    }
  }

  const updateMesajOkundu = async (id) => {
    try {
      const { error } = await supabase
        .from('iletisim_mesajlari')
        .update({ okundu: true })
        .eq('id', id)

      if (error) throw error

      loadData()
    } catch (error) {
      console.error('Hata:', error)
    }
  }

  const updateYorumOnayla = async (id, onayDurumu) => {
    try {
      const { error } = await supabase
        .from('yorumlar')
        .update({ onaylandi: onayDurumu })
        .eq('id', id)

      if (error) throw error

      loadData()
      alert(onayDurumu ? 'Yorum onaylandı!' : 'Yorum gizlendi!')
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu!')
    }
  }

  const deleteYorum = async (id) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('yorumlar')
        .delete()
        .eq('id', id)

      if (error) throw error

      loadData()
      alert('Yorum silindi!')
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu!')
    }
  }

  const deleteAbone = async (id) => {
    if (!confirm('Bu aboneyi listeden çıkarmak istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('newsletter_aboneler')
        .delete()
        .eq('id', id)

      if (error) throw error

      loadData()
      alert('Abone listeden çıkarıldı!')
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu!')
    }
  }

  const exportAboneler = () => {
    if (abone.length === 0) {
      alert('Dışa aktarılacak abone yok!')
      return
    }

    const csv = [
      ['Email', 'Tarih', 'Durum'],
      ...abone.map(a => [
        a.email,
        new Date(a.created_at).toLocaleDateString('tr-TR'),
        a.aktif ? 'Aktif' : 'Pasif'
      ])
    ]
    .map(row => row.join(','))
    .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `abone-listesi-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleQuickApprove = async (rezervasyon) => {
    if (!confirm(`${rezervasyon.ad} ${rezervasyon.soyad} için rezervasyonu onaylamak istediğinizden emin misiniz?`)) {
      return
    }

    try {
      setQuickActionLoading(rezervasyon.id)

      // 1. Supabase'de durumu güncelle
      const { error: updateError } = await supabase
        .from('rezervasyonlar')
        .update({ durum: 'onaylandi' })
        .eq('id', rezervasyon.id)

      if (updateError) throw updateError

      // 2. Onay emaili gönder
      try {
        const emailResponse = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: rezervasyon.email,
            ad: rezervasyon.ad,
            soyad: rezervasyon.soyad,
            giris_tarihi: rezervasyon.giris_tarihi,
            cikis_tarihi: rezervasyon.cikis_tarihi,
            kisi_sayisi: rezervasyon.kisi_sayisi,
            toplam_fiyat: rezervasyon.toplam_fiyat,
            rezervasyon_id: rezervasyon.id,
            durum: 'onaylandi'
          })
        })

        const emailData = await emailResponse.json()
        
        if (emailData.success) {
          console.log('✅ Onay emaili gönderildi!')
        } else {
          console.error('❌ Email gönderilemedi:', emailData.error)
        }
      } catch (emailError) {
        console.error('❌ Email hatası:', emailError)
      }

      alert(`✅ Rezervasyon onaylandı!\n\n${rezervasyon.ad} ${rezervasyon.soyad} adına onay emaili gönderildi.`)
      await loadData()
      setQuickActionLoading(null)

    } catch (error) {
      console.error('Hata:', error)
      alert('❌ Bir hata oluştu! Lütfen tekrar deneyin.')
      setQuickActionLoading(null)
    }
  }

  const handleQuickReject = async (rezervasyon) => {
    const reason = prompt(
      `${rezervasyon.ad} ${rezervasyon.soyad} için rezervasyonu reddetmek istediğinizden emin misiniz?\n\nRed nedeni (opsiyonel):`,
      ''
    )
    
    if (reason === null) return

    try {
      setQuickActionLoading(rezervasyon.id)

      const { error: updateError } = await supabase
        .from('rezervasyonlar')
        .update({ 
          durum: 'iptal',
          mesaj: reason ? `Red nedeni: ${reason}` : rezervasyon.mesaj
        })
        .eq('id', rezervasyon.id)

      if (updateError) throw updateError

      try {
        await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: rezervasyon.email,
            ad: rezervasyon.ad,
            soyad: rezervasyon.soyad,
            giris_tarihi: rezervasyon.giris_tarihi,
            cikis_tarihi: rezervasyon.cikis_tarihi,
            kisi_sayisi: rezervasyon.kisi_sayisi,
            toplam_fiyat: rezervasyon.toplam_fiyat,
            rezervasyon_id: rezervasyon.id,
            durum: 'iptal',
            red_nedeni: reason
          })
        })
      } catch (emailError) {
        console.error('❌ Email hatası:', emailError)
      }

      alert(`❌ Rezervasyon reddedildi!\n\n${rezervasyon.ad} ${rezervasyon.soyad} adına bilgilendirme emaili gönderildi.`)
      await loadData()
      setQuickActionLoading(null)

    } catch (error) {
      console.error('Hata:', error)
      alert('❌ Bir hata oluştu! Lütfen tekrar deneyin.')
      setQuickActionLoading(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value)
  }

  // Takvim helper fonksiyonları
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const getReservationForDay = (day) => {
    if (!day) return null
    return rezervasyonlar.find(rez => {
      const giris = new Date(rez.giris_tarihi)
      const cikis = new Date(rez.cikis_tarihi)
      return day >= giris && day < cikis && (rez.durum === 'onaylandi' || rez.durum === 'beklemede')
    })
  }

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // Pazartesi = 1, Pazar = 0
    let startDay = firstDay.getDay()
    startDay = startDay === 0 ? 6 : startDay - 1 // Pazartesi'den başlat
    
    const days = []
    
    // Önceki ayın günlerini ekle (boş)
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    
    // Bu ayın günlerini ekle
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    // Kalan günleri tamamla (42 = 6 hafta)
    while (days.length < 42) {
      days.push(null)
    }
    
    return days
  }

  const calendarDays = getCalendarDays()

  const currentMonthReservations = rezervasyonlar.filter(rez => {
    const giris = new Date(rez.giris_tarihi)
    const cikis = new Date(rez.cikis_tarihi)
    return (
      (giris.getMonth() === currentMonth.getMonth() && giris.getFullYear() === currentMonth.getFullYear()) ||
      (cikis.getMonth() === currentMonth.getMonth() && cikis.getFullYear() === currentMonth.getFullYear())
    )
  }).sort((a, b) => new Date(a.giris_tarihi) - new Date(b.giris_tarihi))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
          <p className="mt-4 text-gray-600 font-light">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // İstatistikler
  const toplamGelir = rezervasyonlar
    .filter(r => r.durum === 'onaylandi')
    .reduce((sum, r) => sum + (r.toplam_fiyat || 0), 0)

  const buAyGelir = rezervasyonlar
    .filter(r => {
      const date = new Date(r.created_at)
      return date.getMonth() === new Date().getMonth() && r.durum === 'onaylandi'
    })
    .reduce((sum, r) => sum + (r.toplam_fiyat || 0), 0)

  const stats = [
    {
      label: 'Beklemede',
      value: rezervasyonlar.filter(r => r.durum === 'beklemede').length,
      color: 'from-yellow-500 to-orange-500',
      icon: '⏳'
    },
    {
      label: 'Onaylı',
      value: rezervasyonlar.filter(r => r.durum === 'onaylandi').length,
      color: 'from-green-500 to-emerald-500',
      icon: '✓'
    },
    {
      label: 'Bu Ay Gelir',
      value: formatCurrency(buAyGelir),
      color: 'from-blue-500 to-cyan-500',
      icon: '💰'
    },
    {
      label: 'Toplam Gelir',
      value: formatCurrency(toplamGelir),
      color: 'from-purple-500 to-pink-500',
      icon: '📈'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Admin Paneli
            </h1>
            <p className="text-sm text-gray-500 mt-1">Serenity Iskele</p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/" 
              className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition font-medium text-sm"
            >
              ← Ana Sayfa
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition font-medium text-sm shadow-lg hover:shadow-xl"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90`}></div>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-light opacity-90">{stat.label}</h3>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hızlı İşlemler */}
        {rezervasyonlar.filter(r => r.durum === 'beklemede').length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Onay Bekleyen Rezervasyonlar</h3>
                  <p className="text-sm text-gray-600">
                    {rezervasyonlar.filter(r => r.durum === 'beklemede').length} rezervasyon hızlı işlem bekliyor
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rezervasyonlar
                .filter(r => r.durum === 'beklemede')
                .slice(0, 4)
                .map((rez) => {
                  const giris = new Date(rez.giris_tarihi)
                  const cikis = new Date(rez.cikis_tarihi)
                  const nights = Math.ceil((cikis - giris) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <div
                      key={rez.id}
                      className="bg-white rounded-xl border-2 border-orange-200 p-5 hover:shadow-lg transition duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {rez.ad} {rez.soyad}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">{rez.email}</p>
                          <p className="text-sm text-gray-600">{rez.telefon}</p>
                        </div>
                        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded">
                          Yeni
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tarih</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {giris.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                            {' - '}
                            {cikis.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Gece</p>
                          <p className="text-sm font-semibold text-gray-900">{nights} gece</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Kişi</p>
                          <p className="text-sm font-semibold text-gray-900">{rez.kisi_sayisi} kişi</p>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Toplam Tutar</span>
                          <span className="text-xl font-bold text-cyan-600">{formatCurrency(rez.toplam_fiyat)}</span>
                        </div>
                      </div>

                      {rez.mesaj && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Özel İstek</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{rez.mesaj}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuickApprove(rez)}
                          disabled={quickActionLoading === rez.id}
                          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {quickActionLoading === rez.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>İşleniyor...</span>
                            </>
                          ) : (
                            <>
                              <span>✓</span>
                              <span>ONAYLA</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleQuickReject(rez)}
                          disabled={quickActionLoading === rez.id}
                          className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {quickActionLoading === rez.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>İşleniyor...</span>
                            </>
                          ) : (
                            <>
                              <span>✕</span>
                              <span>REDDET</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>

            {rezervasyonlar.filter(r => r.durum === 'beklemede').length > 4 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveTab('rezervasyonlar')}
                  className="px-6 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition"
                >
                  +{rezervasyonlar.filter(r => r.durum === 'beklemede').length - 4} rezervasyon daha göster →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 mb-8 flex flex-wrap gap-2 overflow-x-auto">
          {[
            { id: 'rezervasyonlar', label: 'Rezervasyonlar', count: rezervasyonlar.length, icon: '📅' },
            { id: 'istatistikler', label: 'İstatistikler', count: '', icon: '📊' },
            { id: 'takvim', label: 'Takvim', count: '', icon: '📆' },
            { id: 'mesajlar', label: 'İletişim', count: mesajlar.filter(m => !m.okundu).length, icon: '💌' },
            { id: 'yorumlar', label: 'Yorumlar', count: yorumlar.filter(y => !y.onaylandi).length, icon: '⭐' },
            { id: 'newsletter', label: 'Newsletter', count: abone.length, icon: '📧' },
            { id: 'galeri', label: 'Galeri', count: galeriFotolar.length, icon: '📸' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-medium transition duration-300 flex items-center justify-center space-x-1.5 whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== '' && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/30' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Takvim Tab */}
        {activeTab === 'takvim' && (
          <div className="space-y-6">
            {/* Takvim Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">📅</span>
                  Doluluk Takvimi
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
                    {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Renk Açıklaması */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-700">Dolu (Onaylı)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-700">Beklemede</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-700">Müsait</span>
                </div>
              </div>

              {/* Takvim Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Gün başlıkları */}
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((gun) => (
                  <div key={gun} className="text-center font-bold text-gray-600 py-2 text-sm">
                    {gun}
                  </div>
                ))}

                {/* Takvim günleri */}
                {calendarDays.map((day, index) => {
                  const rezervasyon = getReservationForDay(day)
                  const isToday = day && isSameDay(day, new Date())
                  const isPast = day && day < new Date().setHours(0, 0, 0, 0)
                  
                  return (
                    <div
                      key={index}
                      className={`
                        relative aspect-square rounded-lg border-2 transition duration-200 cursor-pointer
                        ${!day ? 'bg-gray-50 border-gray-100' : ''}
                        ${day && !rezervasyon ? 'bg-white border-gray-200 hover:border-cyan-400 hover:shadow-md' : ''}
                        ${rezervasyon?.durum === 'onaylandi' ? 'bg-green-100 border-green-400 hover:shadow-lg' : ''}
                        ${rezervasyon?.durum === 'beklemede' ? 'bg-yellow-100 border-yellow-400 hover:shadow-lg' : ''}
                        ${isToday ? 'ring-2 ring-cyan-500' : ''}
                        ${isPast && !rezervasyon ? 'opacity-50' : ''}
                      `}
                      onMouseEnter={() => rezervasyon && setHoveredReservation(rezervasyon)}
                      onMouseLeave={() => setHoveredReservation(null)}
                    >
                      {day && (
                        <>
                          <div className="absolute top-1 left-1 right-1 flex justify-between items-start">
                            <span className={`text-sm font-semibold ${
                              rezervasyon ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {day.getDate()}
                            </span>
                            {rezervasyon && (
                              <span className="text-xs">
                                {rezervasyon.durum === 'onaylandi' ? '✓' : '⏳'}
                              </span>
                            )}
                          </div>
                          {rezervasyon && (
                            <div className="absolute bottom-1 left-1 right-1">
                              <p className="text-[10px] font-semibold text-gray-900 truncate">
                                {rezervasyon.ad}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Hover Detay Kartı */}
            {hoveredReservation && (
              <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Rezervasyon Detayı</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    hoveredReservation.durum === 'onaylandi' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {hoveredReservation.durum === 'onaylandi' ? '✓ Onaylı' : '⏳ Beklemede'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Misafir</p>
                    <p className="font-semibold text-gray-900">
                      {hoveredReservation.ad} {hoveredReservation.soyad}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Giriş</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {new Date(hoveredReservation.giris_tarihi).toLocaleDateString('tr-TR', { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Çıkış</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {new Date(hoveredReservation.cikis_tarihi).toLocaleDateString('tr-TR', { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Kişi Sayısı</p>
                      <p className="font-semibold text-gray-900">{hoveredReservation.kisi_sayisi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Toplam</p>
                      <p className="font-semibold text-cyan-600">{formatCurrency(hoveredReservation.toplam_fiyat)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">İletişim</p>
                    <p className="text-sm text-gray-900">{hoveredReservation.email}</p>
                    <p className="text-sm text-gray-600">{hoveredReservation.telefon}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bu Ayki Rezervasyonlar Listesi */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} Rezervasyonları
                </h3>
              </div>
              <div className="overflow-x-auto">
                {currentMonthReservations.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    Bu ay için rezervasyon yok
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Misafir</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Gece</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kişi</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tutar</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentMonthReservations.map((rez) => {
                        const nights = Math.ceil(
                          (new Date(rez.cikis_tarihi) - new Date(rez.giris_tarihi)) / (1000 * 60 * 60 * 24)
                        )
                        return (
                          <tr key={rez.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {rez.ad} {rez.soyad}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(rez.giris_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                              {' - '}
                              {new Date(rez.cikis_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{nights}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{rez.kisi_sayisi}</td>
                            <td className="px-6 py-4 text-sm font-bold text-cyan-600">
                              {formatCurrency(rez.toplam_fiyat)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                rez.durum === 'onaylandi' ? 'bg-green-100 text-green-800' :
                                rez.durum === 'iptal' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {rez.durum === 'beklemede' ? '⏳ Beklemede' :
                                 rez.durum === 'onaylandi' ? '✓ Onaylandı' : '✕ İptal'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* İstatistikler Tab */}
        {activeTab === 'istatistikler' && (
          <div className="space-y-8">
            {/* Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Aylık Rezervasyon Trendi */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📈</span> Aylık Rezervasyon Trendi
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="ay" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rezervasyon" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Rezervasyon"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Durum Dağılımı */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🥧</span> Rezervasyon Durumları
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Aylık Gelir Grafiği */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💰</span> Aylık Gelir Trendi
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="ay" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar 
                    dataKey="gelir" 
                    fill="#8b5cf6" 
                    radius={[8, 8, 0, 0]}
                    name="Gelir"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Rezervasyonlar Tab */}
        {activeTab === 'rezervasyonlar' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Tarih</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Ad Soyad</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">İletişim</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Giriş - Çıkış</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Kişi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Fiyat</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Durum</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rezervasyonlar.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        Henüz rezervasyon yok
                      </td>
                    </tr>
                  ) : (
                    rezervasyonlar.map((rez) => (
                      <tr key={rez.id} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(rez.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {rez.ad} {rez.soyad}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="font-medium">{rez.email}</div>
                          <div className="text-xs text-gray-500">{rez.telefon}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{new Date(rez.giris_tarihi).toLocaleDateString('tr-TR')}</div>
                          <div className="text-xs text-gray-500">{new Date(rez.cikis_tarihi).toLocaleDateString('tr-TR')}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {rez.kisi_sayisi}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-cyan-600">
                          {formatCurrency(rez.toplam_fiyat)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            rez.durum === 'onaylandi' ? 'bg-green-100 text-green-800' :
                            rez.durum === 'iptal' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rez.durum === 'beklemede' ? '⏳ Beklemede' :
                             rez.durum === 'onaylandi' ? '✓ Onaylandı' : '✕ İptal'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={rez.durum}
                            onChange={(e) => updateRezervasyonDurum(rez.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:border-gray-400 transition"
                          >
                            <option value="beklemede">Beklemede</option>
                            <option value="onaylandi">Onayla</option>
                            <option value="iptal">İptal Et</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mesajlar Tab */}
        {activeTab === 'mesajlar' && (
          <div className="space-y-4">
            {mesajlar.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">Henüz mesaj yok</p>
              </div>
            ) : (
              mesajlar.map((mesaj) => (
                <div
                  key={mesaj.id}
                  className={`bg-white rounded-2xl shadow-lg border-l-4 p-6 hover:shadow-xl transition duration-300 ${
                    !mesaj.okundu ? 'border-l-cyan-500 bg-gradient-to-r from-cyan-50 to-white' : 'border-l-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {mesaj.ad} {mesaj.soyad}
                        </h3>
                        {!mesaj.okundu && (
                          <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{mesaj.email}</p>
                      {mesaj.telefon && <p className="text-sm text-gray-600">{mesaj.telefon}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(mesaj.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700">
                      📌 {mesaj.konu}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{mesaj.mesaj}</p>
                  {!mesaj.okundu && (
                    <button
                      onClick={() => updateMesajOkundu(mesaj.id)}
                      className="px-4 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-lg transition font-medium text-sm"
                    >
                      ✓ Okundu işaretle
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Yorumlar Tab */}
        {activeTab === 'yorumlar' && (
          <div className="space-y-4">
            {yorumlar.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">Henüz yorum yok</p>
              </div>
            ) : (
              yorumlar.map((yorum) => (
                <div
                  key={yorum.id}
                  className={`bg-white rounded-2xl shadow-lg border-l-4 p-6 hover:shadow-xl transition duration-300 ${
                    yorum.onaylandi ? 'border-l-green-500' : 'border-l-orange-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{yorum.baslik}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          yorum.onaylandi 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {yorum.onaylandi ? '✓ Onaylı' : '⏳ Beklemede'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{yorum.ad} • {yorum.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(yorum.created_at).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    {/* Yıldızlar */}
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= yorum.puan ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{yorum.yorum}</p>

                  <div className="flex space-x-2 flex-wrap gap-2">
                    {!yorum.onaylandi ? (
                      <button
                        onClick={() => updateYorumOnayla(yorum.id, true)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition font-medium text-sm shadow-lg hover:shadow-xl"
                      >
                        ✓ Onayla
                      </button>
                    ) : (
                      <button
                        onClick={() => updateYorumOnayla(yorum.id, false)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition font-medium text-sm shadow-lg hover:shadow-xl"
                      >
                        ✗ Gizle
                      </button>
                    )}
                    <button
                      onClick={() => deleteYorum(yorum.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition font-medium text-sm shadow-lg hover:shadow-xl"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-cyan-500">
                <p className="text-gray-600 text-sm mb-2">Toplam Abone</p>
                <p className="text-4xl font-bold text-cyan-600">{abone.length}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-green-500">
                <p className="text-gray-600 text-sm mb-2">Aktif Abone</p>
                <p className="text-4xl font-bold text-green-600">{abone.filter(a => a.aktif).length}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-red-500">
                <p className="text-gray-600 text-sm mb-2">Pasif Abone</p>
                <p className="text-4xl font-bold text-red-600">{abone.filter(a => !a.aktif).length}</p>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <button
                onClick={exportAboneler}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition font-medium shadow-lg hover:shadow-xl"
              >
                📥 CSV Olarak İndir
              </button>
            </div>

            {/* Abone Listesi */}
            {abone.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">Henüz abone yok</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Tarih</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">Durum</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 tracking-wide uppercase">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {abone.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50 transition duration-200">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {a.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(a.created_at).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              a.aktif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {a.aktif ? '✓ Aktif' : '○ Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => deleteAbone(a.id)}
                              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium text-sm"
                            >
                              🗑️ Kaldır
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Galeri Tab */}
        {activeTab === 'galeri' && (
          <div className="space-y-6">
            {/* Yükleme Bölümü */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-cyan-300 p-8">
              <div className="text-center">
                <input
                  type="file"
                  id="fotoUpload"
                  accept="image/*"
                  onChange={handleFotoUpload}
                  disabled={uploadLoading}
                  className="hidden"
                />
                <div className="text-5xl mb-4">📸</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fotoğraf Yükle</h3>
                <p className="text-gray-600 mb-4">
                  {uploadLoading ? 'Yükleniyor...' : 'Fotoğraf seçmek için tıkla'}
                </p>
                <button
                  onClick={() => document.getElementById('fotoUpload').click()}
                  type="button"
                  disabled={uploadLoading}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadLoading ? 'Yükleniyor...' : '📁 Dosya Seç'}
                </button>
              </div>
            </div>

            {/* Fotoğraflar Grid */}
            {galeriFotolar.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">Henüz galeri fotoğrafı yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galeriFotolar.map((foto) => (
                  <div
                    key={foto.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={foto.image_url}
                        alt={foto.baslik}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{foto.baslik}</h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Sıra: {foto.sira}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteFoto(foto.id, foto.image_url)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition font-medium text-sm"
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }
      `}</style>
    </div>
  )
}