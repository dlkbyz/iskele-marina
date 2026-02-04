'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

// Recharts'ı dynamic import ile yükle (SSR devre dışı)
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false })
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })

export default function ModernAdminDashboard() {
  const router = useRouter()
  const [rezervasyonlar, setRezervasyonlar] = useState([])
  const [mesajlar, setMesajlar] = useState([])
  const [yorumlar, setYorumlar] = useState([])
  const [galeriFotolar, setGaleriFotolar] = useState([])
  const [abone, setAbone] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [toast, setToast] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [messageFilter, setMessageFilter] = useState('all')
  const [commentFilter, setCommentFilter] = useState('all')
  const [reservationFilter, setReservationFilter] = useState('all')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  // Grafik dataları
  const [monthlyData, setMonthlyData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  
  // Hızlı işlem ve takvim state'leri
  const [quickActionLoading, setQuickActionLoading] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoveredReservation, setHoveredReservation] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [showDayModal, setShowDayModal] = useState(false)
  const [blockedDates, setBlockedDates] = useState([])
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [blockReason, setBlockReason] = useState('')

  // Fiyatlandırma state'leri
  const [fiyatlar, setFiyatlar] = useState([])
  const [showFiyatModal, setShowFiyatModal] = useState(false)
  const [editingFiyat, setEditingFiyat] = useState(null)
  const [fiyatForm, setFiyatForm] = useState({
    tip: 'varsayilan',
    fiyat: '',
    baslangic_tarihi: '',
    bitis_tarihi: '',
    aciklama: ''
  })

  // Galeri state'leri
  const [showGaleriModal, setShowGaleriModal] = useState(false)
  const [editingGaleri, setEditingGaleri] = useState(null)
  const [galeriForm, setGaleriForm] = useState({ baslik: '', aciklama: '' })
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [
        rezervasyonRes,
        mesajRes,
        yorumRes,
        galeriRes,
        aboneRes
      ] = await Promise.all([
        supabase.from('rezervasyonlar').select('*').order('created_at', { ascending: false }),
        supabase.from('iletisim_mesajlari').select('*').order('created_at', { ascending: false }),
        supabase.from('yorumlar').select('*').order('created_at', { ascending: false }),
        supabase.from('galeri').select('*').order('sira', { ascending: true }),
        supabase.from('newsletter_aboneler').select('*').order('created_at', { ascending: false })
      ])

      if (rezervasyonRes.error) throw rezervasyonRes.error
      setRezervasyonlar(rezervasyonRes.data || [])

      if (mesajRes.error) throw mesajRes.error
      setMesajlar(mesajRes.data || [])

      if (yorumRes.error) throw yorumRes.error
      setYorumlar(yorumRes.data || [])

      if (galeriRes.error) throw galeriRes.error
      setGaleriFotolar(galeriRes.data || [])

      setAbone(aboneRes.data || [])

      // Fiyatları çek
      const fiyatRes = await supabase
        .from('fiyat_ayarlari')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!fiyatRes.error) {
        setFiyatlar(fiyatRes.data || [])
      }

      prepareChartData(rezervasyonRes.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Hata:', error)
      setLoading(false)
    }
  }

  const prepareChartData = (data) => {
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

    const beklemede = data.filter(r => r.durum === 'beklemede').length
    const onaylandi = data.filter(r => r.durum === 'onaylandi').length
    const iptal = data.filter(r => r.durum === 'iptal').length
    
    setStatusData([
      { name: 'Beklemede', value: beklemede, color: '#f59e0b' },
      { name: 'Onaylandı', value: onaylandi, color: '#10b981' },
      { name: 'İptal', value: iptal, color: '#ef4444' }
    ])

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
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('galeri')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: false 
        })

      if (uploadError) throw new Error(`Storage hatası: ${uploadError.message}`)
      if (!data) throw new Error('Dosya yüklenemedi')

      const { data: publicUrlData } = supabase.storage
        .from('galeri')
        .getPublicUrl(filePath)

      const imageUrl = publicUrlData?.publicUrl
      if (!imageUrl) throw new Error('Public URL alınamadı')

      const { error: dbError } = await supabase
        .from('galeri')
        .insert({
          image_url: imageUrl,
          baslik: file.name.split('.')[0],
          aciklama: '',
          sira: galeriFotolar.length,
          aktif: true
        })
        .select()

      if (dbError) throw new Error(`Veritabanı hatası: ${dbError.message}`)

      showToast('Fotoğraf başarıyla yüklendi!', 'success')
      e.target.value = ''
      loadData()
    } catch (error) {
      showToast(`Hata: ${error.message}`, 'error')
    } finally {
      setUploadLoading(false)
    }
  }

  const deleteFoto = async (id, imageUrl) => {
    if (!confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) return

    try {
      const filePath = imageUrl.split('/').pop()
      await supabase.storage.from('galeri').remove([`galeri/${filePath}`])
      const { error } = await supabase.from('galeri').delete().eq('id', id)
      if (error) throw error
      showToast('Fotoğraf silindi', 'success')
      loadData()
    } catch (error) {
      showToast('Fotoğraf silinirken hata oluştu', 'error')
    }
  }

  const handleGaleriDuzenle = (foto) => {
    setEditingGaleri(foto)
    setGaleriForm({ baslik: foto.baslik, aciklama: foto.aciklama || '' })
    setShowGaleriModal(true)
  }

  const handleGaleriKaydet = async () => {
    if (!galeriForm.baslik.trim()) {
      showToast('Başlık gerekli', 'error')
      return
    }

    try {
      const { error } = await supabase
        .from('galeri')
        .update({ baslik: galeriForm.baslik, aciklama: galeriForm.aciklama })
        .eq('id', editingGaleri.id)

      if (error) throw error

      showToast('Güncellendi', 'success')
      setShowGaleriModal(false)
      setEditingGaleri(null)
      setGaleriForm({ baslik: '', aciklama: '' })
      loadData()
    } catch (error) {
      showToast('Hata oluştu', 'error')
    }
  }

  const handleSiraDegistir = async (foto, yon) => {
    const currentIndex = galeriFotolar.findIndex(f => f.id === foto.id)
    if ((yon === 'up' && currentIndex === 0) || (yon === 'down' && currentIndex === galeriFotolar.length - 1)) return

    const swapIndex = yon === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapFoto = galeriFotolar[swapIndex]

    try {
      await supabase.from('galeri').update({ sira: swapFoto.sira }).eq('id', foto.id)
      await supabase.from('galeri').update({ sira: foto.sira }).eq('id', swapFoto.id)
      loadData()
    } catch (error) {
      showToast('Sıralama hatası', 'error')
    }
  }

  const updateRezervasyonDurum = async (id, yeniDurum) => {
    const rezervasyon = rezervasyonlar.find(r => r.id === id)
    if (!rezervasyon) return

    let reason = ''
    if (yeniDurum === 'iptal') {
      reason = prompt(`${rezervasyon.ad} ${rezervasyon.soyad} için rezervasyonu iptal etme nedeniniz (opsiyonel, müşteriye gönderilecek):`, '')
      if (reason === null) return
    }

    try {
      const { error } = await supabase
        .from('rezervasyonlar')
        .update({ 
          durum: yeniDurum,
          mesaj: yeniDurum === 'iptal' && reason ? `İptal nedeni: ${reason}` : rezervasyon.mesaj
        })
        .eq('id', id)
      if (error) throw error

      // Durum değişikliğine göre email gönder
      try {
        let emailType = 'onay' // default
        let emailData = { ...rezervasyon, durum: yeniDurum }

        if (yeniDurum === 'onaylandi') {
          emailType = 'onay'
        } else if (yeniDurum === 'iptal') {
          emailType = 'iptal'
          emailData.red_nedeni = reason
        } else if (yeniDurum === 'tamamlandi') {
          emailType = 'tamamlandi'
        }

        const response = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        })

        if (!response.ok) {
          console.error('Email gönderimi başarısız')
        }
      } catch (emailError) {
        console.error('Email gönderilirken hata:', emailError)
      }

      loadData()
      showToast(`Durum ${yeniDurum === 'onaylandi' ? 'onaylandı' : yeniDurum === 'iptal' ? 'iptal edildi' : 'güncellendi'} ve email gönderildi!`, 'success')
    } catch (error) {
      showToast('Durum güncellenirken bir hata oluştu!', 'error')
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
      showToast(onayDurumu ? 'Yorum onaylandı' : 'Yorum gizlendi', 'success')
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    }
  }

  const deleteMesaj = async (id) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return
    try {
      const { error } = await supabase.from('iletisim_mesajlari').delete().eq('id', id)
      if (error) throw error
      loadData()
      showToast('Mesaj silindi', 'success')
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    }
  }

  const deleteYorum = async (id) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return
    try {
      const { error } = await supabase.from('yorumlar').delete().eq('id', id)
      if (error) throw error
      loadData()
      showToast('Yorum silindi', 'success')
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    }
  }

  const deleteAbone = async (id) => {
    if (!confirm('Bu aboneyi listeden çıkarmak istediğinizden emin misiniz?')) return
    try {
      const { error } = await supabase.from('newsletter_aboneler').delete().eq('id', id)
      if (error) throw error
      loadData()
      showToast('Abone listeden çıkarıldı', 'success')
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    }
  }

  const exportAboneler = () => {
    if (abone.length === 0) {
      showToast('Dışa aktarılacak abone yok', 'error')
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
    if (!confirm(`${rezervasyon.ad} ${rezervasyon.soyad} için rezervasyonu onaylamak istediğinizden emin misiniz?`)) return

    try {
      setQuickActionLoading(rezervasyon.id)
      const { error: updateError } = await supabase
        .from('rezervasyonlar')
        .update({ durum: 'onaylandi' })
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
            durum: 'onaylandi'
          })
        })
      } catch (emailError) {
        console.error('Email hatası:', emailError)
      }

      showToast('Rezervasyon onaylandı', 'success')
      await loadData()
      setQuickActionLoading(null)
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
      setQuickActionLoading(null)
    }
  }

  const handleQuickReject = async (rezervasyon) => {
    const reason = prompt(`${rezervasyon.ad} ${rezervasyon.soyad} için rezervasyonu reddetmek istediğinizden emin misiniz?\n\nRed nedeni (opsiyonel, müşteriye gönderilecek):`, '')
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

      // İptal e-postası gönder
      try {
        await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...rezervasyon,
            durum: 'iptal',
            red_nedeni: reason
          })
        })
      } catch (emailError) {
        console.error('Reddetme e-postası gönderilirken hata:', emailError)
      }

      showToast('Rezervasyon reddedildi', 'success')
      await loadData()
      setQuickActionLoading(null)
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
      setQuickActionLoading(null)
    }
  }

  const handleLogout = async () => {
    try {
      // API'ye logout isteği gönder
      await fetch('/api/admin/logout', {
        method: 'POST'
      })
      
      // Eski localStorage auth'u da temizle
      localStorage.removeItem('adminAuth')
      
      // Login sayfasına yönlendir
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Hata olsa bile logout yap
      localStorage.removeItem('adminAuth')
      router.push('/admin/login')
    }
  }

  const sendEmail = async (rezervasyon, emailType) => {
    try {
      setQuickActionLoading(rezervasyon.id)
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          data: {
            ...rezervasyon,
            odeme_tarihi: new Date().toISOString()
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        if (result.demo) {
          showToast(`📧 DEMO: Email simüle edildi → ${result.to}`, 'success')
        } else {
          showToast(`✅ Email gönderildi → ${result.to}`, 'success')
        }
      } else {
        showToast(`❌ Hata: ${result.error}`, 'error')
      }
    } catch (error) {
      console.error('Email error:', error)
      showToast('Email gönderme hatası', 'error')
    } finally {
      setQuickActionLoading(null)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value)
  }

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
    let startDay = firstDay.getDay()
    startDay = startDay === 0 ? 6 : startDay - 1
    const days = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i))
    while (days.length < 42) days.push(null)
    return days
  }

  const getMonthStats = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    let bookedDays = 0
    let revenue = 0
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = new Date(year, month, i).toLocaleDateString('en-CA')
      const hasReservation = rezervasyonlar.find(r => 
        dayStr >= r.giris_tarihi && 
        dayStr < r.cikis_tarihi && 
        r.durum === 'onaylandi'
      )
      if (hasReservation) bookedDays++
    }
    
    const monthRevenue = rezervasyonlar
      .filter(r => {
        const giris = new Date(r.giris_tarihi)
        return giris.getMonth() === month && giris.getFullYear() === year && r.durum === 'onaylandi'
      })
      .reduce((sum, r) => sum + parseFloat(r.toplam_fiyat || 0), 0)
    
    return {
      occupancyRate: Math.round((bookedDays / daysInMonth) * 100),
      bookedDays,
      totalDays: daysInMonth,
      revenue: monthRevenue
    }
  }

  const isDateBlocked = (date) => {
    if (!date) return false
    const dateStr = date.toLocaleDateString('en-CA')
    return blockedDates.some(blocked => blocked.date === dateStr)
  }

  const handleDayClick = (day) => {
    if (!day) return
    setSelectedDay(day)
    setShowDayModal(true)
  }

  const handleBlockDate = () => {
    if (!selectedDay || !blockReason.trim()) return
    
    const dateStr = selectedDay.toLocaleDateString('en-CA')
    setBlockedDates(prev => [...prev, { date: dateStr, reason: blockReason }])
    setBlockReason('')
    setShowBlockModal(false)
    showToast('Tarih bloklandı', 'success')
  }

  const handleUnblockDate = (dateStr) => {
    setBlockedDates(prev => prev.filter(b => b.date !== dateStr))
    showToast('Tarih bloğu kaldırıldı', 'success')
  }

  // Fiyat yönetimi fonksiyonları
  const handleFiyatKaydet = async () => {
    try {
      if (!fiyatForm.fiyat || parseFloat(fiyatForm.fiyat) <= 0) {
        showToast('Geçerli bir fiyat girin', 'error')
        return
      }

      if ((fiyatForm.tip === 'sezon' || fiyatForm.tip === 'ozel_tarih') && 
          (!fiyatForm.baslangic_tarihi || !fiyatForm.bitis_tarihi)) {
        showToast('Tarih aralığı gerekli', 'error')
        return
      }

      const fiyatData = {
        tip: fiyatForm.tip,
        fiyat: parseFloat(fiyatForm.fiyat),
        aciklama: fiyatForm.aciklama,
        aktif: true
      }

      if (fiyatForm.tip === 'sezon' || fiyatForm.tip === 'ozel_tarih') {
        fiyatData.baslangic_tarihi = fiyatForm.baslangic_tarihi
        fiyatData.bitis_tarihi = fiyatForm.bitis_tarihi
      }

      let result
      if (editingFiyat) {
        result = await supabase
          .from('fiyat_ayarlari')
          .update(fiyatData)
          .eq('id', editingFiyat.id)
      } else {
        result = await supabase
          .from('fiyat_ayarlari')
          .insert([fiyatData])
      }

      if (result.error) throw result.error

      showToast(editingFiyat ? 'Fiyat güncellendi' : 'Fiyat eklendi', 'success')
      setShowFiyatModal(false)
      setEditingFiyat(null)
      setFiyatForm({ tip: 'varsayilan', fiyat: '', baslangic_tarihi: '', bitis_tarihi: '', aciklama: '' })
      loadData() // Yenile
    } catch (error) {
      console.error('Fiyat kaydetme hatası:', error)
      showToast('Hata oluştu', 'error')
    }
  }

  const handleFiyatSil = async (id) => {
    if (!confirm('Bu fiyat ayarını silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('fiyat_ayarlari')
        .delete()
        .eq('id', id)

      if (error) throw error

      showToast('Fiyat silindi', 'success')
      loadData()
    } catch (error) {
      console.error('Fiyat silme hatası:', error)
      showToast('Hata oluştu', 'error')
    }
  }

  const handleFiyatDuzenle = (fiyat) => {
    setEditingFiyat(fiyat)
    setFiyatForm({
      tip: fiyat.tip,
      fiyat: fiyat.fiyat,
      baslangic_tarihi: fiyat.baslangic_tarihi || '',
      bitis_tarihi: fiyat.bitis_tarihi || '',
      aciklama: fiyat.aciklama || ''
    })
    setShowFiyatModal(true)
  }

  const handleFiyatAktifDegistir = async (id, aktif) => {
    try {
      const { error } = await supabase
        .from('fiyat_ayarlari')
        .update({ aktif: !aktif })
        .eq('id', id)

      if (error) throw error

      showToast(aktif ? 'Fiyat pasif edildi' : 'Fiyat aktif edildi', 'success')
      loadData()
    } catch (error) {
      console.error('Fiyat güncelleme hatası:', error)
      showToast('Hata oluştu', 'error')
    }
  }

  const calendarDays = getCalendarDays()
  const monthStats = getMonthStats()
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse"></div>
          </div>
          <p className="mt-6 text-slate-400 font-light tracking-wide">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  const toplamGelir = rezervasyonlar.filter(r => r.durum === 'onaylandi').reduce((sum, r) => sum + (r.toplam_fiyat || 0), 0)
  const buAyGelir = rezervasyonlar.filter(r => {
    const date = new Date(r.created_at)
    return date.getMonth() === new Date().getMonth() && r.durum === 'onaylandi'
  }).reduce((sum, r) => sum + (r.toplam_fiyat || 0), 0)

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { id: 'rezervasyonlar', icon: '📅', label: 'Rezervasyonlar', badge: rezervasyonlar.filter(r => r.durum === 'beklemede').length },
    { id: 'takvim', icon: '📆', label: 'Takvim', badge: null },
    { id: 'fiyatlandirma', icon: '💰', label: 'Fiyatlandırma', badge: null },
    { id: 'istatistikler', icon: '📈', label: 'İstatistikler', badge: null },
    { id: 'mesajlar', icon: '💌', label: 'Mesajlar', badge: mesajlar.filter(m => !m.okundu).length },
    { id: 'yorumlar', icon: '⭐', label: 'Yorumlar', badge: yorumlar.filter(y => !y.onaylandi).length },
    { id: 'newsletter', icon: '📧', label: 'Newsletter', badge: abone.length },
    { id: 'galeri', icon: '📸', label: 'Galeri', badge: galeriFotolar.length }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-colors duration-300 ${isDarkMode ? 'from-slate-950 via-slate-900 to-slate-950' : 'from-gray-50 via-white to-gray-100'}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full backdrop-blur-xl border-r transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800/50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Serenity
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-800/50 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${isDarkMode ? 'from-cyan-500/20 to-blue-500/20 text-cyan-400' : 'from-cyan-50 to-blue-50 text-cyan-600'} shadow-lg`
                    : isDarkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    {item.badge !== null && item.badge > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === item.id ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800/50' : 'border-gray-200'}`}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2 ${isDarkMode ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
              {sidebarOpen && <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <span className="text-xl">🚪</span>
              {sidebarOpen && <span className="font-medium">Çıkış Yap</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white/80 border-gray-200'}`}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <a href="/" className={`px-4 py-2 rounded-lg transition text-sm font-medium ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
              ← Ana Sayfa
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Dashboard Home */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded font-bold">+12%</span>
                  </div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wide`}>Bekleyen</p>
                  <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rezervasyonlar.filter(r => r.durum === 'beklemede').length}</span>
                </div>

                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded font-bold">+12%</span>
                  </div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wide`}>Onaylanan</p>
                  <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rezervasyonlar.filter(r => r.durum === 'onaylandi').length}</span>
                </div>

                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded font-bold">+12%</span>
                  </div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wide`}>Toplam Gelir</p>
                  <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(buAyGelir).replace(' ', '')}</span>
                </div>

                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded font-bold">+12%</span>
                  </div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wide`}>Aktif Doluluk</p>
                  <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>%78</span>
                </div>
              </div>

              {/* Gelişmiş Analytics - Yeni Kartlar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ortalama Rezervasyon Süresi */}
                <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${isDarkMode ? 'bg-blue-700/40' : 'bg-blue-500/20'} rounded-lg flex items-center justify-center`}>
                      <span className="text-xl">📆</span>
                    </div>
                    <span className={`text-xs px-2 py-1 ${isDarkMode ? 'bg-blue-700/40 text-blue-300' : 'bg-blue-500/20 text-blue-600'} rounded font-bold`}>
                      Ortalama
                    </span>
                  </div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>Konaklama Süresi</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      {Math.round(rezervasyonlar.reduce((acc, r) => {
                        const gun = Math.ceil((new Date(r.cikis_tarihi) - new Date(r.giris_tarihi)) / (1000 * 60 * 60 * 24))
                        return acc + gun
                      }, 0) / (rezervasyonlar.length || 1))}
                    </span>
                    <span className={`text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>gün</span>
                  </div>
                </div>

                {/* Toplam Misafir */}
                <div className={`${isDarkMode ? 'bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${isDarkMode ? 'bg-emerald-700/40' : 'bg-emerald-500/20'} rounded-lg flex items-center justify-center`}>
                      <span className="text-xl">👥</span>
                    </div>
                    <span className={`text-xs px-2 py-1 ${isDarkMode ? 'bg-emerald-700/40 text-emerald-300' : 'bg-emerald-500/20 text-emerald-600'} rounded font-bold`}>
                      Bu Ay
                    </span>
                  </div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>Toplam Misafir</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-emerald-900'}`}>
                      {rezervasyonlar
                        .filter(r => new Date(r.giris_tarihi).getMonth() === new Date().getMonth())
                        .reduce((acc, r) => acc + (r.kisi_sayisi || 0), 0)}
                    </span>
                    <span className={`text-lg ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>kişi</span>
                  </div>
                </div>

                {/* Ortalama Gelir */}
                <div className={`${isDarkMode ? 'bg-gradient-to-br from-amber-900 to-amber-800 border-amber-700' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${isDarkMode ? 'bg-amber-700/40' : 'bg-amber-500/20'} rounded-lg flex items-center justify-center`}>
                      <span className="text-xl">💵</span>
                    </div>
                    <span className={`text-xs px-2 py-1 ${isDarkMode ? 'bg-amber-700/40 text-amber-300' : 'bg-amber-500/20 text-amber-600'} rounded font-bold`}>
                      Ort.
                    </span>
                  </div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>Rezervasyon Başına</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>
                      ${Math.round(rezervasyonlar.reduce((acc, r) => acc + (r.toplam_fiyat || 0), 0) / (rezervasyonlar.length || 1))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pending Reservations - Compact */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol: Grafik */}
                <div className={`lg:col-span-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gelir Analizi</h3>
                    <select className={`px-3 py-1.5 text-sm rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                      <option>Son 6 Ay</option>
                      <option>Son 3 Ay</option>
                      <option>Bu Yıl</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#f1f5f9"} vertical={false} />
                        <XAxis 
                          dataKey="ay" 
                          stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
                          style={{ fontSize: '12px' }} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
                          style={{ fontSize: '12px' }} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                            borderRadius: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rezervasyon" 
                          stroke="#06b6d4" 
                          strokeWidth={3}
                          dot={{ fill: '#06b6d4', r: 4 }}
                          fill="url(#colorRevenue)"
                        />
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sağ: Son İstekler */}
                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Son İstekler</h3>
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                    {rezervasyonlar
                      .filter(r => r.durum === 'beklemede')
                      .slice(0, 5)
                      .map((rez) => {
                        const giris = new Date(rez.giris_tarihi)
                        
                        return (
                          <div
                            key={rez.id}
                            className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <h4 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>{rez.ad} {rez.soyad}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-xs flex items-center gap-1`}>
                                    📅 {giris.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                  </span>
                                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-xs flex items-center gap-1`}>
                                    👥 {rez.kisi_sayisi} Kişi
                                  </span>
                                </div>
                              </div>
                              <span className="text-cyan-400 font-bold text-sm ml-2">{formatCurrency(rez.toplam_fiyat).replace(' ', '')}</span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleQuickApprove(rez)}
                                disabled={quickActionLoading === rez.id}
                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs transition disabled:opacity-50"
                              >
                                {quickActionLoading === rez.id ? '...' : 'Onayla'}
                              </button>
                              <button
                                onClick={() => handleQuickReject(rez)}
                                disabled={quickActionLoading === rez.id}
                                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xs transition disabled:opacity-50"
                              >
                                {quickActionLoading === rez.id ? '...' : 'Reddet'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                      {rezervasyonlar.filter(r => r.durum === 'beklemede').length === 0 && (
                        <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-center py-8 text-sm`}>
                          Bekleyen rezervasyon yok
                        </div>
                      )}
                  </div>

                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                    <span>📈</span> Aylık Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                      <XAxis dataKey="ay" stroke={isDarkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '12px' }} />
                      <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px', color: isDarkMode ? '#fff' : '#0f172a' }}
                      />
                      <Line type="monotone" dataKey="rezervasyon" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200 shadow-sm'} backdrop-blur-xl border rounded-2xl p-6`}>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                    <span>🥧</span> Durum Dağılımı
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px', color: isDarkMode ? '#fff' : '#0f172a' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200 shadow-sm'} backdrop-blur-xl border rounded-2xl p-6`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                  <span>💰</span> Gelir Trendi
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                    <XAxis dataKey="ay" stroke={isDarkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '12px' }} />
                    <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px', color: isDarkMode ? '#fff' : '#0f172a' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Bar dataKey="gelir" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

         
                 {/* Takvim Tab */}
                 {activeTab === 'takvim' && (
                   <div className="space-y-6">
                     {/* Aylık İstatistikler */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-sm opacity-90">Doluluk Oranı</span>
                           <span className="text-2xl">📊</span>
                         </div>
                         <div className="text-3xl font-bold">{monthStats.occupancyRate}%</div>
                         <div className="text-xs opacity-75 mt-1">{monthStats.bookedDays}/{monthStats.totalDays} gün</div>
                       </div>

                       <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-sm opacity-90">Aylık Gelir</span>
                           <span className="text-2xl">💰</span>
                         </div>
                         <div className="text-3xl font-bold">${monthStats.revenue.toFixed(0)}</div>
                         <div className="text-xs opacity-75 mt-1">Bu ay</div>
                       </div>

                       <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-sm opacity-90">Rezervasyonlar</span>
                           <span className="text-2xl">📅</span>
                         </div>
                         <div className="text-3xl font-bold">{currentMonthReservations.length}</div>
                         <div className="text-xs opacity-75 mt-1">Bu ay</div>
                       </div>

                       <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-sm opacity-90">Bloklu Günler</span>
                           <span className="text-2xl">🚫</span>
                         </div>
                         <div className="text-3xl font-bold">{blockedDates.length}</div>
                         <div className="text-xs opacity-75 mt-1">Bakım/Temizlik</div>
                       </div>
                     </div>

                     {/* Takvim Header */}
                     <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-4 max-w-5xl mx-auto`}>
                       <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                         <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
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
                           <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} min-w-[140px] text-center capitalize`}>
                             {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                           </span>
                           <button
                             onClick={() => setCurrentMonth(new Date())}
                             className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                           >
                             Bugün
                           </button>
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
                       <div className={`flex flex-wrap gap-4 mb-4 p-3 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-xl`}>
                         <div className="flex items-center">
                           <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-green-600 mr-2 shadow"></div>
                           <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Dolu (Onaylı)</span>
                         </div>
                         <div className="flex items-center">
                           <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-400 to-yellow-600 mr-2 shadow"></div>
                           <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Beklemede</span>
                         </div>
                         <div className="flex items-center">
                           <div className="w-4 h-4 rounded bg-gradient-to-r from-red-400 to-red-600 mr-2 shadow"></div>
                           <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Bloklu</span>
                         </div>
                         <div className="flex items-center">
                           <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                           <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Müsait</span>
                         </div>
                       </div>
         
                       {/* Takvim Grid */}
                       <div className="grid grid-cols-7 gap-2">
                         {/* Gün başlıkları */}
                         {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((gun) => (
                           <div key={gun} className={`text-center font-bold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} py-2 text-sm`}>
                             {gun}
                           </div>
                         ))}
         
                         {/* Takvim günleri */}
                         {calendarDays.map((day, index) => {
                           const dayStr = day ? day.toLocaleDateString('en-CA') : null
                           const rezervasyon = day ? rezervasyonlar.find(r => dayStr >= r.giris_tarihi && dayStr < r.cikis_tarihi && (r.durum === 'onaylandi' || r.durum === 'beklemede')) : null
                           const isBlocked = day && isDateBlocked(day)
                           const blockedInfo = isBlocked ? blockedDates.find(b => b.date === dayStr) : null
                           
                           const isToday = day && isSameDay(day, new Date())
                           const isPast = day && day < new Date().setHours(0, 0, 0, 0)
                           
                           return (
                             <div
                               key={index}
                               onClick={() => handleDayClick(day)}
                               className={`
                                 relative h-28 md:h-32 rounded-xl border-2 transition-all duration-200 cursor-pointer transform hover:scale-105
                                 ${!day ? (isDarkMode ? 'bg-slate-800/20 border-slate-800/50' : 'bg-gray-50/50 border-gray-100') : ''}
                                 ${day && !rezervasyon && !isBlocked ? (isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-cyan-500 hover:shadow-cyan-500/20' : 'bg-white border-gray-200 hover:border-cyan-400 hover:shadow-lg') : ''}
                                 ${rezervasyon?.durum === 'onaylandi' ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-500 hover:shadow-xl hover:shadow-green-500/30 text-white' : ''}
                                 ${rezervasyon?.durum === 'beklemede' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/30 text-gray-900' : ''}
                                 ${isBlocked ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-500 hover:shadow-xl hover:shadow-red-500/30 text-white' : ''}
                                 ${isToday ? 'ring-4 ring-cyan-400 ring-offset-2' : ''}
                                 ${isPast && !rezervasyon && !isBlocked ? 'opacity-40' : ''}
                               `}
                               onMouseEnter={() => rezervasyon && setHoveredReservation(rezervasyon)}
                               onMouseLeave={() => setHoveredReservation(null)}
                             >
                               {day && (
                                 <>
                                   <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                                     <span className={`text-sm font-bold ${
                                       rezervasyon || isBlocked ? 'text-white' : (isDarkMode ? 'text-slate-300' : 'text-gray-700')
                                     }`}>
                                       {day.getDate()}
                                     </span>
                                     {rezervasyon && (
                                       <span className="text-xs bg-white/20 rounded px-1.5 py-0.5 backdrop-blur">
                                         {rezervasyon.durum === 'onaylandi' ? '✓' : '⏳'}
                                       </span>
                                     )}
                                     {isBlocked && (
                                       <span className="text-lg">🚫</span>
                                     )}
                                   </div>
                                   {rezervasyon && (
                                     <div className="absolute bottom-2 left-2 right-2">
                                       <p className="text-xs font-bold truncate">
                                         {rezervasyon.ad} {rezervasyon.soyad}
                                       </p>
                                       <p className="text-[10px] opacity-90">
                                         {rezervasyon.kisi_sayisi} kişi
                                       </p>
                                     </div>
                                   )}
                                   {isBlocked && blockedInfo && (
                                     <div className="absolute bottom-2 left-2 right-2">
                                       <p className="text-xs font-bold truncate">
                                         {blockedInfo.reason}
                                       </p>
                                     </div>
                                   )}
                                   {!rezervasyon && !isBlocked && !isPast && (
                                     <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                       <span className="text-2xl">+</span>
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

                     {/* Gün Detay Modal */}
                     {showDayModal && selectedDay && (
                       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDayModal(false)}>
                         <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                           <div className="flex items-center justify-between mb-6">
                             <h3 className="text-2xl font-bold text-gray-900">
                               {selectedDay.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                             </h3>
                             <button onClick={() => setShowDayModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                               ×
                             </button>
                           </div>

                           {(() => {
                             const dayStr = selectedDay.toLocaleDateString('en-CA')
                             const dayReservation = rezervasyonlar.find(r => 
                               dayStr >= r.giris_tarihi && 
                               dayStr < r.cikis_tarihi && 
                               (r.durum === 'onaylandi' || r.durum === 'beklemede')
                             )
                             const isBlocked = isDateBlocked(selectedDay)
                             const blockedInfo = blockedDates.find(b => b.date === dayStr)

                             if (dayReservation) {
                               return (
                                 <div className="space-y-4">
                                   <div className={`p-4 rounded-xl ${dayReservation.durum === 'onaylandi' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                     <div className="flex items-center justify-between mb-2">
                                       <span className={`text-sm font-bold ${dayReservation.durum === 'onaylandi' ? 'text-green-800' : 'text-yellow-800'}`}>
                                         {dayReservation.durum === 'onaylandi' ? '✅ Onaylı Rezervasyon' : '⏳ Bekleyen Rezervasyon'}
                                       </span>
                                     </div>
                                     <div className="space-y-2 text-sm">
                                       <p><strong>Misafir:</strong> {dayReservation.ad} {dayReservation.soyad}</p>
                                       <p><strong>Tarih:</strong> {new Date(dayReservation.giris_tarihi).toLocaleDateString('tr-TR')} - {new Date(dayReservation.cikis_tarihi).toLocaleDateString('tr-TR')}</p>
                                       <p><strong>Kişi:</strong> {dayReservation.kisi_sayisi}</p>
                                       <p><strong>Fiyat:</strong> {formatCurrency(dayReservation.toplam_fiyat)}</p>
                                       <p><strong>İletişim:</strong> {dayReservation.telefon}</p>
                                     </div>
                                   </div>
                                   <button
                                     onClick={() => {
                                       setActiveTab('rezervasyonlar')
                                       setShowDayModal(false)
                                     }}
                                     className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition"
                                   >
                                     Detayları Görüntüle
                                   </button>
                                 </div>
                               )
                             } else if (isBlocked) {
                               return (
                                 <div className="space-y-4">
                                   <div className="p-4 rounded-xl bg-red-50">
                                     <div className="flex items-center gap-2 mb-2">
                                       <span className="text-2xl">🚫</span>
                                       <span className="text-sm font-bold text-red-800">Bloklu Tarih</span>
                                     </div>
                                     <p className="text-sm text-red-700">{blockedInfo?.reason}</p>
                                   </div>
                                   <button
                                     onClick={() => {
                                       handleUnblockDate(dayStr)
                                       setShowDayModal(false)
                                     }}
                                     className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
                                   >
                                     Bloğu Kaldır
                                   </button>
                                 </div>
                               )
                             } else {
                               return (
                                 <div className="space-y-4">
                                   <div className="p-4 rounded-xl bg-green-50 text-center">
                                     <span className="text-4xl mb-2 block">✨</span>
                                     <p className="text-sm font-bold text-green-800">Bu gün müsait</p>
                                   </div>
                                   <div className="space-y-2">
                                     <button
                                       onClick={() => {
                                         setShowDayModal(false)
                                         setActiveTab('rezervasyonlar')
                                         // Burada rezervasyon formu açılabilir
                                       }}
                                       className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg"
                                     >
                                       ➕ Rezervasyon Ekle
                                     </button>
                                     <button
                                       onClick={() => {
                                         setShowDayModal(false)
                                         setShowBlockModal(true)
                                       }}
                                       className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg"
                                     >
                                       🚫 Tarihi Blokla
                                     </button>
                                   </div>
                                 </div>
                               )
                             }
                           })()}
                         </div>
                       </div>
                     )}

                     {/* Tarih Bloklama Modal */}
                     {showBlockModal && selectedDay && (
                       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowBlockModal(false)}>
                         <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                           <h3 className="text-2xl font-bold text-gray-900 mb-6">Tarihi Blokla</h3>
                           
                           <div className="mb-4">
                             <p className="text-sm text-gray-600 mb-2">Tarih:</p>
                             <p className="text-lg font-bold text-gray-900">
                               {selectedDay.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                             </p>
                           </div>

                           <div className="mb-6">
                             <label className="block text-sm font-medium text-gray-700 mb-2">
                               Sebep (Bakım, Temizlik, vb.)
                             </label>
                             <input
                               type="text"
                               value={blockReason}
                               onChange={(e) => setBlockReason(e.target.value)}
                               placeholder="Örn: Bakım çalışması"
                               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                             />
                           </div>

                           <div className="flex gap-3">
                             <button
                               onClick={() => setShowBlockModal(false)}
                               className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
                             >
                               İptal
                             </button>
                             <button
                               onClick={handleBlockDate}
                               disabled={!blockReason.trim()}
                               className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                               Blokla
                             </button>
                           </div>
                         </div>
                       </div>
                     )}


                     {/* Bu Ayki Rezervasyonlar Listesi */}
                     <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                       <div className="p-6 border-b border-gray-200">
                         <h3 className="text-lg font-bold text-gray-900 capitalize">
                           {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} Rezervasyonları
                         </h3>
                       </div>
                       <div className="overflow-x-auto">
                         {/* Listeyi filtrelerken ayı kapsayan rezervasyonları da dahil edelim */}
                         {rezervasyonlar.filter(rez => {
                           const rGiris = new Date(rez.giris_tarihi);
                           const rCikis = new Date(rez.cikis_tarihi);
                           const aybasi = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                           const aysonu = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                           // Rezervasyon bu ayın içinde mi veya bu ayı kapsıyor mu?
                           return (rGiris <= aysonu && rCikis >= aybasi) && (rez.durum === 'onaylandi' || rez.durum === 'beklemede');
                         }).length === 0 ? (
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
                               {rezervasyonlar.filter(rez => {
                                 const rGiris = new Date(rez.giris_tarihi);
                                 const rCikis = new Date(rez.cikis_tarihi);
                                 const aybasi = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                                 const aysonu = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                                 return (rGiris <= aysonu && rCikis >= aybasi) && (rez.durum === 'onaylandi' || rez.durum === 'beklemede');
                               }).sort((a, b) => new Date(a.giris_tarihi) - new Date(b.giris_tarihi))
                               .map((rez) => {
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

                 {/* Fiyatlandırma Tab */}
                 {activeTab === 'fiyatlandirma' && (
                   <div className="space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                       <div>
                         <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
                           <span>💰</span> Dinamik Fiyatlandırma
                         </h3>
                         <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                           Tarih ve sezona göre fiyat yönetimi
                         </p>
                       </div>
                       <button
                         onClick={() => {
                           setEditingFiyat(null)
                           setFiyatForm({ tip: 'varsayilan', fiyat: '', baslangic_tarihi: '', bitis_tarihi: '', aciklama: '' })
                           setShowFiyatModal(true)
                         }}
                         className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2"
                       >
                         <span>➕</span> Yeni Fiyat Ekle
                       </button>
                     </div>

                     {/* Fiyat İstatistikleri */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="text-sm opacity-90 mb-2">Varsayılan Fiyat</div>
                         <div className="text-3xl font-bold">
                           ${fiyatlar.find(f => f.tip === 'varsayilan')?.fiyat || 150}
                         </div>
                         <div className="text-xs opacity-75 mt-1">Günlük</div>
                       </div>

                       <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="text-sm opacity-90 mb-2">Hafta Sonu</div>
                         <div className="text-3xl font-bold">
                           ${fiyatlar.find(f => f.tip === 'hafta_sonu')?.fiyat || '-'}
                         </div>
                         <div className="text-xs opacity-75 mt-1">Cuma-Cumartesi</div>
                       </div>

                       <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="text-sm opacity-90 mb-2">Sezon Fiyatları</div>
                         <div className="text-3xl font-bold">
                           {fiyatlar.filter(f => f.tip === 'sezon' && f.aktif).length}
                         </div>
                         <div className="text-xs opacity-75 mt-1">Aktif Sezon</div>
                       </div>

                       <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                         <div className="text-sm opacity-90 mb-2">Özel Tarihler</div>
                         <div className="text-3xl font-bold">
                           {fiyatlar.filter(f => f.tip === 'ozel_tarih' && f.aktif).length}
                         </div>
                         <div className="text-xs opacity-75 mt-1">Bayram/Yılbaşı</div>
                       </div>
                     </div>

                     {/* Fiyat Listesi */}
                     <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border overflow-hidden`}>
                       <div className="overflow-x-auto">
                         <table className="w-full">
                           <thead className={isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}>
                             <tr>
                               <th className={`px-6 py-4 text-left text-xs font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 Tip
                               </th>
                               <th className={`px-6 py-4 text-left text-xs font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 Fiyat
                               </th>
                               <th className={`px-6 py-4 text-left text-xs font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 Tarih Aralığı
                               </th>
                               <th className={`px-6 py-4 text-left text-xs font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 Açıklama
                               </th>
                               <th className={`px-6 py-4 text-left text-xs font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 Durum
                               </th>
                               <th className={`px-6 py-4 text-right text-xs font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 İşlemler
                               </th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-200">
                             {fiyatlar.map((fiyat) => (
                               <tr key={fiyat.id} className={isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}>
                                 <td className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                     fiyat.tip === 'varsayilan' ? 'bg-green-100 text-green-800' :
                                     fiyat.tip === 'hafta_sonu' ? 'bg-blue-100 text-blue-800' :
                                     fiyat.tip === 'sezon' ? 'bg-purple-100 text-purple-800' :
                                     'bg-orange-100 text-orange-800'
                                   }`}>
                                     {fiyat.tip === 'varsayilan' ? '🏠 Varsayılan' :
                                      fiyat.tip === 'hafta_sonu' ? '📅 Hafta Sonu' :
                                      fiyat.tip === 'sezon' ? '🌞 Sezon' :
                                      '⭐ Özel Tarih'}
                                   </span>
                                 </td>
                                 <td className={`px-6 py-4 font-bold text-lg ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                   ${fiyat.fiyat}
                                 </td>
                                 <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                   {fiyat.baslangic_tarihi && fiyat.bitis_tarihi ? (
                                     <>
                                       {new Date(fiyat.baslangic_tarihi).toLocaleDateString('tr-TR')}
                                       {' - '}
                                       {new Date(fiyat.bitis_tarihi).toLocaleDateString('tr-TR')}
                                     </>
                                   ) : '-'}
                                 </td>
                                 <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                   {fiyat.aciklama || '-'}
                                 </td>
                                 <td className="px-6 py-4">
                                   <button
                                     onClick={() => handleFiyatAktifDegistir(fiyat.id, fiyat.aktif)}
                                     className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                       fiyat.aktif 
                                         ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                     }`}
                                   >
                                     {fiyat.aktif ? '✓ Aktif' : '✗ Pasif'}
                                   </button>
                                 </td>
                                 <td className="px-6 py-4 text-right space-x-2">
                                   <button
                                     onClick={() => handleFiyatDuzenle(fiyat)}
                                     className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                   >
                                     ✏️ Düzenle
                                   </button>
                                   <button
                                     onClick={() => handleFiyatSil(fiyat.id)}
                                     className="text-red-600 hover:text-red-800 font-medium text-sm"
                                   >
                                     🗑️ Sil
                                   </button>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </div>
                   </div>
                 )}
         
                 {/* İstatistikler Tab */}
                 {activeTab === 'istatistikler' && (
                   <div className="space-y-8">
                     {/* Header Section */}
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div>
                          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Performans Analizi
                          </h3>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            Rezervasyon trendleri ve gelir raporları
                          </p>
                        </div>
                     </div>

                     {/* Grafikler Grid */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {/* Aylık Rezervasyon Trendi */}
                       <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 shadow-sm`}>
                         <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                              <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">📈</span> 
                              Aylık Rezervasyon
                            </h3>
                         </div>
                         <div className="h-[300px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={monthlyData}>
                               <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#f1f5f9"} vertical={false} />
                               <XAxis 
                                 dataKey="ay" 
                                 stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
                                 style={{ fontSize: '12px' }} 
                                 tickLine={false}
                                 axisLine={false}
                                 dy={10}
                               />
                               <YAxis 
                                 stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
                                 style={{ fontSize: '12px' }} 
                                 tickLine={false}
                                 axisLine={false}
                                 dx={-10}
                               />
                               <Tooltip 
                                 contentStyle={{ 
                                   backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                                   border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                                   borderRadius: '12px', 
                                   color: isDarkMode ? '#fff' : '#0f172a',
                                   boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                 }}
                                 cursor={{ stroke: isDarkMode ? '#475569' : '#cbd5e1', strokeWidth: 2 }}
                               />
                               <Line 
                                 type="monotone" 
                                 dataKey="rezervasyon" 
                                 stroke="#06b6d4" 
                                 strokeWidth={4}
                                 dot={{ fill: '#06b6d4', r: 4, strokeWidth: 2, stroke: isDarkMode ? '#0f172a' : '#fff' }}
                                 activeDot={{ r: 8, strokeWidth: 0 }}
                                 name="Rezervasyon"
                               />
                             </LineChart>
                           </ResponsiveContainer>
                         </div>
                       </div>
         
                       {/* Durum Dağılımı */}
                       <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 shadow-sm`}>
                         <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">🥧</span> 
                              Rezervasyon Durumları
                            </h3>
                         </div>
                         <div className="h-[300px] w-full flex items-center justify-center">
                           <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                               <Pie
                                 data={statusData}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={80}
                                 outerRadius={110}
                                 paddingAngle={5}
                                 dataKey="value"
                               >
                                 {statusData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                 ))}
                               </Pie>
                               <Tooltip 
                                 contentStyle={{ 
                                   backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                                   border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                                   borderRadius: '12px', 
                                   color: isDarkMode ? '#fff' : '#0f172a'
                                 }}
                               />
                               <Legend 
                                 verticalAlign="bottom" 
                                 height={36}
                                 iconType="circle"
                                 formatter={(value) => <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>{value}</span>}
                               />
                             </PieChart>
                           </ResponsiveContainer>
                         </div>
                       </div>
                     </div>
         
                     {/* Aylık Gelir Grafiği */}
                     <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 shadow-sm`}>
                       <div className="flex items-center justify-between mb-6">
                          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">💰</span> 
                            Aylık Gelir Analizi
                          </h3>
                       </div>
                       <div className="h-[400px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                             <defs>
                               <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                                 <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
                               </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#f1f5f9"} vertical={false} />
                             <XAxis 
                               dataKey="ay" 
                               stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
                               style={{ fontSize: '12px' }} 
                               tickLine={false}
                               axisLine={false}
                               dy={10}
                             />
                             <YAxis 
                               stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
                               style={{ fontSize: '12px' }} 
                               tickLine={false}
                               axisLine={false}
                               dx={-10}
                             />
                             <Tooltip 
                               contentStyle={{ 
                                 backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                                 border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                                 borderRadius: '12px', 
                                 color: isDarkMode ? '#fff' : '#0f172a',
                                 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                               }}
                               cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9', opacity: 0.4 }}
                               formatter={(value) => [formatCurrency(value), 'Gelir']}
                             />
                             <Bar 
                               dataKey="gelir" 
                               fill="url(#colorRevenue)" 
                               radius={[8, 8, 0, 0]}
                               barSize={50}
                               name="Gelir"
                             />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </div>
                   </div>
                 )}
         
                 {/* Rezervasyonlar Tab */}
                 {activeTab === 'rezervasyonlar' && (
                   <div className="space-y-6">
                     {/* Filter Tabs */}
                     <div className="flex justify-end gap-2 overflow-x-auto pb-2">
                       {['all', 'onaylandi', 'beklemede', 'iptal'].map((filter) => (
                         <button
                           key={filter}
                           onClick={() => setReservationFilter(filter)}
                           className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize whitespace-nowrap ${
                             reservationFilter === filter
                               ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                               : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                           }`}
                         >
                           {filter === 'all' ? 'Tümü' : filter === 'onaylandi' ? 'Onaylandı' : filter === 'beklemede' ? 'Beklemede' : 'İptal'}
                           <span className="ml-2 text-xs opacity-75">
                             ({filter === 'all' ? rezervasyonlar.length : rezervasyonlar.filter(r => r.durum === filter).length})
                           </span>
                         </button>
                       ))}
                     </div>

                   <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border overflow-hidden`}>
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'} border-b`}>
                           <tr>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Tarih</th>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Ad Soyad</th>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>İletişim</th>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Giriş - Çıkış</th>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Kişi</th>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Fiyat</th>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Durum</th>
                             <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>İşlem</th>
                           </tr>
                         </thead>
                         <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                           {rezervasyonlar.length === 0 ? (
                             <tr>
                               <td colSpan="8" className={`px-6 py-12 text-center ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                 Henüz rezervasyon yok
                               </td>
                             </tr>
                           ) : (
                             rezervasyonlar
                               .filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter)
                               .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                               .map((rez) => (
                               <tr key={rez.id} className={`${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'} transition duration-200`}>
                                 <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                   {new Date(rez.created_at).toLocaleDateString('tr-TR')}
                                 </td>
                                 <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                   {rez.ad} {rez.soyad}
                                 </td>
                                 <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                   <div className="font-medium">{rez.email}</div>
                                   <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>{rez.telefon}</div>
                                 </td>
                                 <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                   <div>{new Date(rez.giris_tarihi).toLocaleDateString('tr-TR')}</div>
                                   <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>{new Date(rez.cikis_tarihi).toLocaleDateString('tr-TR')}</div>
                                 </td>
                                 <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
                                   <div className="flex gap-2">
                                     <select
                                       value={rez.durum}
                                       onChange={(e) => updateRezervasyonDurum(rez.id, e.target.value)}
                                       className={`px-3 py-2 border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:border-gray-400 transition`}
                                     >
                                       <option value="beklemede">Beklemede</option>
                                       <option value="onaylandi">Onayla</option>
                                       <option value="iptal">İptal Et</option>
                                     </select>
                                     
                                     {/* Email Gönder Dropdown */}
                                     <div className="relative">
                                       <button
                                         onClick={(e) => {
                                           e.stopPropagation()
                                           // Toggle dropdown (basit versiyon)
                                           const dropdown = e.currentTarget.nextElementSibling
                                           dropdown.classList.toggle('hidden')
                                         }}
                                         disabled={quickActionLoading === rez.id}
                                         className={`px-3 py-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg text-sm font-medium transition disabled:opacity-50`}
                                         title="Email Gönder"
                                       >
                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                         </svg>
                                       </button>
                                       <div className={`hidden absolute right-0 mt-2 w-56 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50`}>
                                         <button
                                           onClick={() => sendEmail(rez, 'reservation_confirmation')}
                                           className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-gray-100 text-gray-700'} transition`}
                                         >
                                           📧 Rezervasyon Onayı
                                         </button>
                                         <button
                                           onClick={() => sendEmail(rez, 'payment_success')}
                                           className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-gray-100 text-gray-700'} transition`}
                                         >
                                           💳 Ödeme Onayı
                                         </button>
                                         <button
                                           onClick={() => sendEmail(rez, 'check_in_reminder')}
                                           className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-gray-100 text-gray-700'} transition`}
                                         >
                                           ⏰ Check-in Hatırlatması
                                         </button>
                                       </div>
                                     </div>
                                   </div>
                                 </td>
                               </tr>
                             ))
                           )}
                         </tbody>
                       </table>
                     </div>
                     
                     {/* Pagination Controls */}
                     {rezervasyonlar.filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter).length > itemsPerPage && (
                       <div className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                         <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                           Toplam {rezervasyonlar.filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter).length} kayıttan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, rezervasyonlar.filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter).length)} arası gösteriliyor
                         </span>
                         <div className="flex gap-2">
                           <button
                             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                             disabled={currentPage === 1}
                             className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                               currentPage === 1
                                 ? 'opacity-50 cursor-not-allowed'
                                 : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
                             }`}
                           >
                             Önceki
                           </button>
                           
                           <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                             {currentPage} / {Math.ceil(rezervasyonlar.filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter).length / itemsPerPage)}
                           </span>

                           <button
                             onClick={() => setCurrentPage(p => Math.min(Math.ceil(rezervasyonlar.filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter).length / itemsPerPage), p + 1))}
                             disabled={currentPage === Math.ceil(rezervasyonlar.filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter).length / itemsPerPage)}
                             className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                               currentPage === Math.ceil(rezervasyonlar.filter(rez => reservationFilter === 'all' || rez.durum === reservationFilter).length / itemsPerPage)
                                 ? 'opacity-50 cursor-not-allowed'
                                 : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
                             }`}
                           >
                             Sonraki
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                   </div>
                 )}
         
                 {/* Mesajlar Tab */}
                 {activeTab === 'mesajlar' && (
                   <div className="space-y-6">
                     {/* Filter Bar */}
                     <div className="flex gap-2 overflow-x-auto pb-2">
                       {['all', 'unread', 'read'].map((filter) => (
                         <button
                           key={filter}
                           onClick={() => setMessageFilter(filter)}
                           className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                             messageFilter === filter
                               ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                               : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                           }`}
                         >
                           {filter === 'all' ? 'Tümü' : filter === 'unread' ? 'Okunmamış' : 'Okunmuş'}
                         </button>
                       ))}
                     </div>

                     {/* Messages List */}
                     <div className="space-y-4">
                       {mesajlar
                         .filter(m => {
                           if (messageFilter === 'unread') return !m.okundu
                           if (messageFilter === 'read') return m.okundu
                           return true
                         })
                         .length === 0 ? (
                       <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-12 text-center`}>
                         <div className="text-6xl mb-4">📭</div>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-lg`}>
                           {messageFilter === 'all' ? 'Henüz mesaj yok' : messageFilter === 'unread' ? 'Okunmamış mesaj yok' : 'Okunmuş mesaj yok'}
                         </p>
                       </div>
                     ) : (
                       mesajlar
                         .filter(m => {
                           if (messageFilter === 'unread') return !m.okundu
                           if (messageFilter === 'read') return m.okundu
                           return true
                         })
                         .map((mesaj) => (
                         <div
                           key={mesaj.id}
                           className={`group relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${
                             !mesaj.okundu ? (isDarkMode ? 'bg-slate-800/30 border-l-4 border-l-cyan-500' : 'bg-cyan-50/30 border-l-4 border-l-cyan-500') : ''
                           }`}
                         >
                           <div className="flex flex-col md:flex-row gap-6">
                             {/* Avatar & Info */}
                             <div className="flex items-start gap-4 min-w-[200px]">
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                                 !mesaj.okundu 
                                   ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                                   : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'
                               }`}>
                                 {mesaj.ad.charAt(0)}{mesaj.soyad.charAt(0)}
                               </div>
                               <div>
                                 <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                   {mesaj.ad} {mesaj.soyad}
                                 </h3>
                                 <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{mesaj.email}</p>
                                 {mesaj.telefon && (
                                   <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{mesaj.telefon}</p>
                                 )}
                               </div>
                             </div>

                             {/* Content */}
                             <div className="flex-1">
                               <div className="flex items-center justify-between mb-2">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                   isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-800'
                                 }`}>
                                   {mesaj.konu}
                                 </span>
                                 <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                   {new Date(mesaj.created_at).toLocaleDateString('tr-TR', {
                                     day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                   })}
                                 </span>
                               </div>
                               <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 {mesaj.mesaj}
                               </p>
                             </div>

                             {/* Actions */}
                             <div className="flex md:flex-col gap-2 justify-end md:justify-start min-w-[120px]">
                               {!mesaj.okundu && (
                                 <button
                                   onClick={() => updateMesajOkundu(mesaj.id)}
                                   className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                                 >
                                   <span>✓</span> Okundu
                                 </button>
                               )}
                               <button
                                 onClick={() => deleteMesaj(mesaj.id)}
                                 className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                                   isDarkMode 
                                     ? 'bg-slate-800 text-slate-400 hover:bg-red-900/30 hover:text-red-400' 
                                     : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                 }`}
                               >
                                 <span>🗑️</span> Sil
                               </button>
                               <a
                                 href={`mailto:${mesaj.email}`}
                                 className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                                   isDarkMode 
                                     ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' 
                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                 }`}
                               >
                                 <span>↩️</span> Yanıtla
                               </a>
                             </div>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                   </div>
                 )}
         
                 {/* Yorumlar Tab */}
                 {activeTab === 'yorumlar' && (
                   <div className="space-y-6">
                     {/* Filter Bar */}
                     <div className="flex gap-2 overflow-x-auto pb-2">
                       {['all', 'approved', 'pending'].map((filter) => (
                         <button
                           key={filter}
                           onClick={() => setCommentFilter(filter)}
                           className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                             commentFilter === filter
                               ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                               : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                           }`}
                         >
                           {filter === 'all' ? 'Tümü' : filter === 'approved' ? 'Onaylı' : 'Bekleyen'}
                         </button>
                       ))}
                     </div>

                     {/* Comments List */}
                     <div className="space-y-4">
                       {yorumlar
                         .filter(y => {
                           if (commentFilter === 'approved') return y.onaylandi
                           if (commentFilter === 'pending') return !y.onaylandi
                           return true
                         })
                         .length === 0 ? (
                       <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-12 text-center`}>
                         <div className="text-6xl mb-4">💬</div>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-lg`}>
                           {commentFilter === 'all' ? 'Henüz yorum yok' : commentFilter === 'approved' ? 'Onaylı yorum yok' : 'Bekleyen yorum yok'}
                         </p>
                       </div>
                     ) : (
                       yorumlar
                         .filter(y => {
                           if (commentFilter === 'approved') return y.onaylandi
                           if (commentFilter === 'pending') return !y.onaylandi
                           return true
                         })
                         .map((yorum) => (
                         <div
                           key={yorum.id}
                           className={`group relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${
                             yorum.onaylandi 
                               ? (isDarkMode ? 'bg-slate-800/30 border-l-4 border-l-green-500' : 'bg-green-50/30 border-l-4 border-l-green-500')
                               : (isDarkMode ? 'bg-slate-800/30 border-l-4 border-l-orange-500' : 'bg-orange-50/30 border-l-4 border-l-orange-500')
                           }`}
                         >
                           <div className="flex flex-col md:flex-row gap-6">
                             {/* User Info */}
                             <div className="flex items-start gap-4 min-w-[200px]">
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                                 yorum.onaylandi 
                                   ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                                   : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                               }`}>
                                 {yorum.ad.charAt(0)}
                               </div>
                               <div>
                                 <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{yorum.ad}</h3>
                                 <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{yorum.email}</p>
                                 <div className="flex mt-1">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                     <svg
                                       key={star}
                                       className={`w-4 h-4 ${star <= yorum.puan ? 'text-yellow-400' : (isDarkMode ? 'text-slate-700' : 'text-gray-300')}`}
                                       fill="currentColor"
                                       viewBox="0 0 20 20"
                                     >
                                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                     </svg>
                                   ))}
                                 </div>
                               </div>
                             </div>

                             {/* Content */}
                             <div className="flex-1">
                               <div className="flex items-center justify-between mb-2">
                                 <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{yorum.baslik}</h4>
                                 <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                   {new Date(yorum.created_at).toLocaleDateString('tr-TR', {
                                     day: 'numeric', month: 'long', year: 'numeric'
                                   })}
                                 </span>
                               </div>
                               <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                 {yorum.yorum}
                               </p>
                             </div>

                             {/* Actions */}
                             <div className="flex md:flex-col gap-2 justify-end md:justify-start min-w-[120px]">
                               {!yorum.onaylandi ? (
                                 <button
                                   onClick={() => updateYorumOnayla(yorum.id, true)}
                                   className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                 >
                                   <span>✓</span> Onayla
                                 </button>
                               ) : (
                                 <button
                                   onClick={() => updateYorumOnayla(yorum.id, false)}
                                   className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                 >
                                   <span>✕</span> Gizle
                                 </button>
                               )}
                               <button
                                 onClick={() => deleteYorum(yorum.id)}
                                 className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                                   isDarkMode 
                                     ? 'bg-slate-800 text-slate-400 hover:bg-red-900/30 hover:text-red-400' 
                                     : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                 }`}
                               >
                                 <span>🗑️</span> Sil
                               </button>
                             </div>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                   </div>
                 )}
         
                 {/* Newsletter Tab */}
                 {activeTab === 'newsletter' && (
                   <div className="space-y-6">
                     {/* İstatistikler */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-lg p-6 border-l-4 border-l-cyan-500`}>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm mb-2`}>Toplam Abone</p>
                         <p className="text-4xl font-bold text-cyan-600">{abone.length}</p>
                       </div>
                       <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-lg p-6 border-l-4 border-l-green-500`}>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm mb-2`}>Aktif Abone</p>
                         <p className="text-4xl font-bold text-green-600">{abone.filter(a => a.aktif).length}</p>
                       </div>
                       <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-lg p-6 border-l-4 border-l-red-500`}>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm mb-2`}>Pasif Abone</p>
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
                       <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-lg p-12 text-center`}>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-lg`}>Henüz abone yok</p>
                       </div>
                     ) : (
                       <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border overflow-hidden`}>
                         <div className="overflow-x-auto">
                           <table className="w-full">
                             <thead className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'} border-b`}>
                               <tr>
                                 <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Email</th>
                                 <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Tarih</th>
                                 <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>Durum</th>
                                 <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} tracking-wide uppercase`}>İşlem</th>
                               </tr>
                             </thead>
                             <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                               {abone.map((a) => (
                                 <tr key={a.id} className={`${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'} transition duration-200`}>
                                   <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                     {a.email}
                                   </td>
                                   <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                     {new Date(a.created_at).toLocaleDateString('tr-TR')}
                                   </td>
                                   <td className="px-6 py-4">
                                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                       a.aktif ? 'bg-green-100 text-green-800' : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-800')
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
                     <div className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-cyan-300'} rounded-2xl shadow-lg border-2 border-dashed p-8`}>
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
                         <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Fotoğraf Yükle</h3>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
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
                       <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-lg p-12 text-center`}>
                         <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-lg`}>Henüz galeri fotoğrafı yok</p>
                       </div>
                     ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {galeriFotolar.map((foto, index) => (
                           <div
                             key={foto.id}
                             className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300`}
                           >
                             <div className="relative h-64 overflow-hidden bg-gray-100 group">
                               <img
                                 src={foto.image_url}
                                 alt={foto.baslik}
                                 className="w-full h-full object-cover hover:scale-110 transition duration-300 cursor-pointer"
                                 onClick={() => setPreviewImage(foto)}
                               />
                               {/* Önizleme overlay */}
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                 <button
                                   onClick={() => setPreviewImage(foto)}
                                   className="px-4 py-2 bg-white/90 rounded-lg text-sm font-medium hover:bg-white transition"
                                 >
                                   🔍 Önizle
                                 </button>
                               </div>
                             </div>
                             <div className="p-4">
                               <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{foto.baslik}</h3>
                               <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mb-3`}>
                                 Sıra: {foto.sira} {foto.aciklama && `• ${foto.aciklama}`}
                               </p>
                               <div className="flex gap-2">
                                 {/* Sıralama Butonları */}
                                 <div className="flex gap-1">
                                   <button
                                     onClick={() => handleSiraDegistir(foto, 'up')}
                                     disabled={index === 0}
                                     className={`px-2 py-2 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition text-sm disabled:opacity-30 disabled:cursor-not-allowed`}
                                     title="Yukarı taşı"
                                   >
                                     ⬆️
                                   </button>
                                   <button
                                     onClick={() => handleSiraDegistir(foto, 'down')}
                                     disabled={index === galeriFotolar.length - 1}
                                     className={`px-2 py-2 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition text-sm disabled:opacity-30 disabled:cursor-not-allowed`}
                                     title="Aşağı taşı"
                                   >
                                     ⬇️
                                   </button>
                                 </div>
                                 
                                 {/* Düzenle */}
                                 <button
                                   onClick={() => handleGaleriDuzenle(foto)}
                                   className={`flex-1 px-3 py-2 ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'} text-white rounded-lg transition font-medium text-sm`}
                                 >
                                   ✏️ Düzenle
                                 </button>
                                 
                                 {/* Sil */}
                                 <button
                                   onClick={() => deleteFoto(foto.id, foto.image_url)}
                                   className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition font-medium text-sm"
                                 >
                                   🗑️
                                 </button>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
          {/* For brevity, keeping the same structure as before but with dark theme */}
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white font-medium z-50 transition-all duration-300 transform translate-y-0 flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <span className="text-xl">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {/* Fiyat Ekleme/Düzenleme Modal */}
      {showFiyatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setShowFiyatModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingFiyat ? '✏️ Fiyat Düzenle' : '➕ Yeni Fiyat Ekle'}
              </h3>
              <button onClick={() => setShowFiyatModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Tipi</label>
                <select
                  value={fiyatForm.tip}
                  onChange={(e) => setFiyatForm({ ...fiyatForm, tip: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="varsayilan">🏠 Varsayılan (Günlük)</option>
                  <option value="hafta_sonu">📅 Hafta Sonu (Cuma-Cumartesi)</option>
                  <option value="sezon">🌞 Sezon (Tarih Aralığı)</option>
                  <option value="ozel_tarih">⭐ Özel Tarih (Bayram, Yılbaşı vb.)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fiyatForm.fiyat}
                  onChange={(e) => setFiyatForm({ ...fiyatForm, fiyat: e.target.value })}
                  placeholder="150.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              {(fiyatForm.tip === 'sezon' || fiyatForm.tip === 'ozel_tarih') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      value={fiyatForm.baslangic_tarihi}
                      onChange={(e) => setFiyatForm({ ...fiyatForm, baslangic_tarihi: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                    <input
                      type="date"
                      value={fiyatForm.bitis_tarihi}
                      onChange={(e) => setFiyatForm({ ...fiyatForm, bitis_tarihi: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (Opsiyonel)</label>
                <input
                  type="text"
                  value={fiyatForm.aciklama}
                  onChange={(e) => setFiyatForm({ ...fiyatForm, aciklama: e.target.value })}
                  placeholder="Örn: Yaz sezonu fiyatı"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFiyatModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                İptal
              </button>
              <button
                onClick={handleFiyatKaydet}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg"
              >
                {editingFiyat ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galeri Düzenleme Modal */}
      {showGaleriModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setShowGaleriModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">✏️ Fotoğraf Düzenle</h3>
              <button onClick={() => setShowGaleriModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={galeriForm.baslik}
                  onChange={(e) => setGaleriForm({ ...galeriForm, baslik: e.target.value })}
                  placeholder="Örn: Marina Manzarası"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={galeriForm.aciklama}
                  onChange={(e) => setGaleriForm({ ...galeriForm, aciklama: e.target.value })}
                  placeholder="Fotoğraf hakkında kısa açıklama..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGaleriModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                İptal
              </button>
              <button
                onClick={handleGaleriKaydet}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galeri Önizleme Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={() => setPreviewImage(null)}>
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition z-10"
          >
            ×
          </button>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage.image_url}
              alt={previewImage.baslik}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <h3 className="text-2xl font-bold text-white mb-2">{previewImage.baslik}</h3>
              {previewImage.aciklama && (
                <p className="text-gray-300">{previewImage.aciklama}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#475569' : '#cbd5e1'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#64748b' : '#94a3b8'};
        }
      `}</style>
    </div>
  )
}