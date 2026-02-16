'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '../../lib/supabase'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '@/lib/LanguageContext'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'

export const dynamic = 'force-dynamic'

// Modal Component ekle - dosyanın başına (import'lardan sonra)

function Modal({ isOpen, onClose, type, data }) {
  if (!isOpen) return null

  const configs = {
    available: {
      icon: '✅',
      title: 'Harika Haber!',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      textColor: 'text-emerald-900'
    },
    unavailable: {
      icon: '❌',
      title: 'Üzgünüz',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      textColor: 'text-red-900'
    },
    success: {
      icon: '🎉',
      title: 'Rezervasyon Alındı!',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      iconBg: 'bg-cyan-100',
      textColor: 'text-cyan-900'
    },
    error: {
      icon: '⚠️',
      title: 'Hata Oluştu',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      textColor: 'text-orange-900'
    }
  }

  const config = configs[type] || configs.error

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${config.color} p-8 text-center`}>
          <div className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <span className="text-5xl">{config.icon}</span>
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">{config.title}</h2>
        </div>

        {/* Content */}
        <div className="p-8">
          {type === 'available' && (
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Seçtiğiniz tarihler <span className="font-bold text-emerald-600">müsait!</span>
              </p>
              <p className="text-gray-600 text-sm">
                Rezervasyon formunu doldurup gönderebilirsiniz.
              </p>
            </div>
          )}

          {type === 'unavailable' && (
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {data?.message ? (
                  data.message
                ) : (
                  <>
                    Seçtiğiniz tarihler için rezervasyon <span className="font-bold text-red-600">mevcuttur.</span>
                  </>
                )}
              </p>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Lütfen farklı tarihler seçiniz veya bizimle iletişime geçiniz:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                  <a
                    href="https://wa.me/905301234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all text-xs tracking-wider uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp ile Sor
                  </a>
                  <a
                    href="/iletisim"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all text-xs tracking-wider uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    İletişim Formu
                  </a>
                </div>
              </div>
            </div>
          )}

          {type === 'success' && data && (
            <div className="space-y-4">
              <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-4`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Rezervasyon No:</span>
                  <span className={`text-lg font-bold ${config.textColor}`}>#{data.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">Toplam Tutar:</span>
                  <span className={`text-xl font-bold ${config.textColor}`}>{data.fiyat}</span>
                </div>
              </div>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                Talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.
              </p>
            </div>
          )}

          {type === 'error' && data && (
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                {data.message}
              </p>
              <p className="text-gray-600 text-sm">
                Lütfen tekrar deneyiniz veya bizimle iletişime geçiniz.
              </p>
            </div>
          )}

          {/* Button */}
          <button
            onClick={onClose}
            className={`w-full mt-6 py-4 bg-gradient-to-r ${config.color} text-white rounded-xl font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
          >
            TAMAM
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

function RezervasyonContent() {
  const searchParams = useSearchParams()
  const { formatPrice, convertPrice, currency, currencies } = useCurrency()
  const { language } = useLanguage()
  
  // Çok adımlı form state
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    giris: '',
    cikis: '',
    kisiSayisi: '2',
    mesaj: ''
  })
const [toplamFiyat, setToplamFiyat] = useState(0)
const [gunSayisi, setGunSayisi] = useState(0)
const [fiyatDetay, setFiyatDetay] = useState(null)
const [fiyatLoading, setFiyatLoading] = useState(false)

// BURAYA EKLE 👇
const [loading, setLoading] = useState(false)
const [success, setSuccess] = useState(false)
const [modal, setModal] = useState({
  isOpen: false,
  type: 'available',
  data: null
})
const [isAvailable, setIsAvailable] = useState(false)

// Dinamik fiyat hesaplama
useEffect(() => {
  if (formData.giris && formData.cikis) {
    hesaplaFiyat()
  }
}, [formData.giris, formData.cikis])

const hesaplaFiyat = async () => {
  if (!formData.giris || !formData.cikis) return

  const girisDate = new Date(formData.giris)
  const cikisDate = new Date(formData.cikis)
  const gun = Math.ceil((cikisDate - girisDate) / (1000 * 60 * 60 * 24))

  if (gun <= 0) {
    setGunSayisi(0)
    setToplamFiyat(0)
    setFiyatDetay(null)
    return
  }

  setGunSayisi(gun)
  setFiyatLoading(true)

  try {
    const response = await fetch('/api/fiyat/hesapla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        giris_tarihi: formData.giris,
        cikis_tarihi: formData.cikis
      })
    })

    const result = await response.json()

    if (result.success) {
      setToplamFiyat(parseFloat(result.toplamFiyat))
      setFiyatDetay(result.gunlukDetay)
    } else {
      // Fallback: Varsayılan fiyat
      setToplamFiyat(gun * 150)
      setFiyatDetay(null)
    }
  } catch (error) {
    console.error('Fiyat hesaplama hatası:', error)
    // Fallback: Varsayılan fiyat
    setToplamFiyat(gun * 150)
    setFiyatDetay(null)
  } finally {
    setFiyatLoading(false)
  }
}

  
  const content = {
    tr: {
      hero: {
        title: 'Rezervasyon',
        subtitle: 'Hayalinizdeki tatil bir adım uzağınızda'
      },
      form: {
        personalTitle: 'Kişisel Bilgiler',
        personalDesc: 'Sizinle iletişime geçebilmemiz için',
        name: 'Ad',
        surname: 'Soyad',
        email: 'E-posta',
        phone: 'Telefon',
        reservationTitle: 'Rezervasyon Detayları',
        reservationDesc: 'Tatilinizin tarih ve kişi bilgileri',
        checkIn: 'Giriş Tarihi',
        checkOut: 'Çıkış Tarihi',
        guests: 'Kişi Sayısı',
        message: 'Özel İstekler / Notlar',
        messagePlaceholder: 'Özel istekleriniz veya sorularınız varsa buraya yazabilirsiniz...',
        submit: 'Rezervasyon Talebini Gönder',
        sending: 'Gönderiliyor...',
        required: '* ile işaretli alanlar zorunludur',
        successTitle: 'Rezervasyon Talebiniz Alındı!',
        successDesc: 'En kısa sürede size geri dönüş yapacağız.'
      },
      summary: {
        title: 'Rezervasyon Özeti',
        nights: 'Gece Sayısı',
        nightsUnit: 'gece',
        pricePerNight: 'Gecelik Fiyat',
        guestCount: 'Kişi Sayısı',
        guestUnit: 'kişi',
        total: 'Toplam Tutar'
      },
      info: {
        title: 'Neden Serenity İskele?',
        item1: 'Talebinizi aldıktan sonra en kısa sürede size dönüş yapacağız',
        item2: 'Müsaitlik durumunu kontrol ederek onay vereceğiz',
        item3: 'Check-in: 14:00 | Check-out: 12:00',
        item4: 'Nakit veya banka transferi ile ödeme',
        item5: 'Giriş tarihinden 7 gün öncesine kadar ücretsiz iptal'
      },
      contact: {
        title: 'Sorularınız mı var?',
        desc: 'Rezervasyonunuz hakkında sorularınız için bize ulaşın',
        whatsapp: 'WhatsApp ile İletişim'
      }
    },
    en: {
      hero: {
        title: 'Reservation',
        subtitle: 'Your dream vacation is just one step away'
      },
      form: {
        personalTitle: 'Personal Information',
        personalDesc: 'So we can contact you',
        name: 'First Name',
        surname: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        reservationTitle: 'Reservation Details',
        reservationDesc: 'Date and guest information',
        checkIn: 'Check-in Date',
        checkOut: 'Check-out Date',
        guests: 'Number of Guests',
        message: 'Special Requests / Notes',
        messagePlaceholder: 'You can write your special requests or questions here...',
        submit: 'Submit Reservation Request',
        sending: 'Sending...',
        required: '* Required fields',
        successTitle: 'Your Reservation Request Received!',
        successDesc: 'We will get back to you as soon as possible.'
      },
      summary: {
        title: 'Reservation Summary',
        nights: 'Number of Nights',
        nightsUnit: 'nights',
        pricePerNight: 'Price per Night',
        guestCount: 'Guests',
        guestUnit: 'guests',
        total: 'Total Amount'
      },
      info: {
        title: 'Why Serenity İskele?',
        item1: 'We will contact you as soon as we receive your request',
        item2: 'We will check availability and confirm',
        item3: 'Check-in: 2:00 PM | Check-out: 12:00 PM',
        item4: 'Payment by cash or bank transfer',
        item5: 'Free cancellation up to 7 days before check-in'
      },
      contact: {
        title: 'Have questions?',
        desc: 'Contact us about your reservation',
        whatsapp: 'Contact via WhatsApp'
      }
    }
  }

  const t = content[language] || content.tr

  useEffect(() => {
    const giris = searchParams.get('giris')
    const cikis = searchParams.get('cikis')
    const yetiskin = searchParams.get('yetiskin')

    if (giris || cikis || yetiskin) {
      setFormData(prev => ({
        ...prev,
        giris: giris || prev.giris,
        cikis: cikis || prev.cikis,
        kisiSayisi: yetiskin || prev.kisiSayisi
      }))

      // Anasayfadan tarihlerle gelindiyse otomatik müsaitlik kontrolü yap
      if (giris && cikis) {
        hesaplaFiyat(giris, cikis)
        // Otomatik müsaitlik kontrolü
        checkAvailability(giris, cikis, false).then(available => {
          if (available) {
            setIsAvailable(true)
            console.log('Anasayfadan gelen tarihler müsait, form açılıyor')
          } else {
            console.log('Anasayfadan gelen tarihler müsait değil')
          }
        })
      }
    }
  }, [searchParams])

const handleChange = (e) => {
  const { name, value } = e.target
  
  // Tarih değiştiğinde müsaitlik durumunu sıfırla
  if (name === 'giris' || name === 'cikis') {
    setIsAvailable(false)
  }
  
  // Telefon için özel format
  if (name === 'telefon') {
    const formatted = formatTelefon(value)
    setFormData(prev => ({
      ...prev,
      [name]: formatted
    }))
  }
  // Ad ve Soyad için baş harf büyük
  else if (name === 'ad' || name === 'soyad') {
    const formatted = formatIsim(value)
    setFormData(prev => ({
      ...prev,
      [name]: formatted
    }))
  }
  // Diğer alanlar normal
  else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (name === 'giris' || name === 'cikis') {
    hesaplaFiyat(
      name === 'giris' ? value : formData.giris,
      name === 'cikis' ? value : formData.cikis
    )
  }
}

// Fiyat hesaplama async fonksiyon yukarıda tanımlı

const formatTelefon = (value) => {
  // Sadece rakamları al
  const cleaned = value.replace(/\D/g, '')
  
  // (xxx) zzz-zzzz formatına çevir
  if (cleaned.length <= 3) {
    return cleaned
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }
}


const formatIsim = (value) => {
  // Her kelimenin ilk harfini büyük yap
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const checkAvailability = async (giris, cikis, showModal = true) => {
  try {
    // Tarih validasyonu
    if (!giris || !cikis) {
      console.error('Giriş veya çıkış tarihi eksik')
      setIsAvailable(false)
      return false
    }

    const girisDate = new Date(giris)
    const cikisDate = new Date(cikis)

    // Geçersiz tarih kontrolü
    if (isNaN(girisDate.getTime()) || isNaN(cikisDate.getTime())) {
      console.error('Geçersiz tarih formatı')
      setIsAvailable(false)
      return false
    }

    // Hem 'onaylandı' hem de 'beklemede' durumundaki rezervasyonları kontrol et
    console.log('Supabase sorgusu başlatılıyor...')
    const { data: existingReservations, error } = await supabase
      .from('rezervasyonlar')
      .select('giris_tarihi, cikis_tarihi, durum, ad, soyad')
      .in('durum', ['onaylandı', 'beklemede'])

    console.log('Supabase sorgu sonucu:', { data: existingReservations, error })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Null/undefined kontrolü
    const reservations = existingReservations || []

    const conflictingReservations = reservations.filter(reservation => {
      const existingGiris = new Date(reservation.giris_tarihi)
      const existingCikis = new Date(reservation.cikis_tarihi)

      return (
        (girisDate >= existingGiris && girisDate < existingCikis) ||
        (cikisDate > existingGiris && cikisDate <= existingCikis) ||
        (girisDate <= existingGiris && cikisDate >= existingCikis)
      )
    })

    const hasConflict = conflictingReservations.length > 0

    // isAvailable state'ini güncelle
    setIsAvailable(!hasConflict)

    if (showModal) {
      setModal({
        isOpen: true,
        type: hasConflict ? 'unavailable' : 'available',
        data: hasConflict ? { 
          conflictingDates: conflictingReservations.map(r => ({
            giris: r.giris_tarihi,
            cikis: r.cikis_tarihi,
            durum: r.durum
          }))
        } : null
      })
    }

    return !hasConflict
  } catch (error) {
    console.error('Müsaitlik kontrolü hatası:', error)
    console.error('Hata detayı:', JSON.stringify(error, null, 2))
    console.error('Hata mesajı:', error.message)
    console.error('Hata kodu:', error.code)
    setIsAvailable(false)
    if (showModal) {
      setModal({
        isOpen: true,
        type: 'error',
        data: { message: 'Müsaitlik kontrolü sırasında bir hata oluştu.' }
      })
    }
    return false
  }
}

// 3. handleAvailabilityCheck güncelle
const handleAvailabilityCheck = async (e) => {
  e.preventDefault()
  
  if (!formData.giris || !formData.cikis) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Lütfen giriş ve çıkış tarihlerini seçiniz.' }
    })
    return
  }

  if (new Date(formData.giris) >= new Date(formData.cikis)) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Çıkış tarihi, giriş tarihinden sonra olmalıdır.' }
    })
    return
  }

  setLoading(true)
  await checkAvailability(formData.giris, formData.cikis, true)
  setLoading(false)
}

// 4. handleSubmit güncelle
const handleSubmit = async (e) => {
  e.preventDefault()
    // VALIDASYON EKLE 👇
  // Ad Soyad kontrolü
  if (!formData.ad.trim() || !formData.soyad.trim()) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Lütfen ad ve soyadınızı giriniz.' }
    })
    return
  }
  
  // Email kontrolü
  if (!formData.email.trim()) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Lütfen e-posta adresinizi giriniz.' }
    })
    return
  }
  
  // Email format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Lütfen geçerli bir e-posta adresi giriniz.' }
    })
    return
  }
  
  // Telefon kontrolü (en az 10 rakam)
  const telefonRakamlar = formData.telefon.replace(/\D/g, '')
  if (telefonRakamlar.length < 10) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Lütfen geçerli bir telefon numarası giriniz.' }
    })
    return
  }
  
  // Tarih kontrolü
  if (!formData.giris || !formData.cikis) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Lütfen giriş ve çıkış tarihlerini seçiniz.' }
    })
    return
  }
  
  if (new Date(formData.giris) >= new Date(formData.cikis)) {
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: 'Çıkış tarihi, giriş tarihinden sonra olmalıdır.' }
    })
    return
  }
  setLoading(true)

  try {
    console.log('Form submit başladı...', formData)

    // ÖNEMLİ: Son müsaitlik kontrolü - Form doldurulurken tarihler alınmış olabilir
    console.log('Son müsaitlik kontrolü yapılıyor...')
    const available = await checkAvailability(formData.giris, formData.cikis, false)
    
    if (!available) {
      setModal({
        isOpen: true,
        type: 'unavailable',
        data: { 
          message: 'Form doldururken bu tarihler için başka bir rezervasyon yapılmış. Lütfen farklı tarihler seçiniz.'
        }
      })
      setLoading(false)
      return
    }

    console.log('Tarihler müsait, rezervasyon kaydediliyor...')

    // Supabase'e kaydet
    const { data: rezervasyonData, error: dbError } = await supabase
      .from('rezervasyonlar')
      .insert([
        {
          ad: formData.ad,
          soyad: formData.soyad,
          email: formData.email,
          telefon: formData.telefon,
          giris_tarihi: formData.giris,
          cikis_tarihi: formData.cikis,
          kisi_sayisi: parseInt(formData.kisiSayisi),
          toplam_fiyat: toplamFiyat,
          mesaj: formData.mesaj,
          durum: 'beklemede',
          odeme_durumu: 'bekliyor'
        }
      ])
      .select()

    if (dbError) {
      console.error('Supabase hatası:', dbError)
      throw dbError
    }

    console.log('Supabase kaydı başarılı:', rezervasyonData)
    
    // Ödeme işlemini başlat
    const odemeResponse = await fetch('/api/odeme/baslat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rezervasyonId: rezervasyonData[0].id,
        kartBilgileri: {} // Gerçek entegrasyonda kart bilgileri buraya gelecek
      })
    })

    const odemeData = await odemeResponse.json()

    if (!odemeData.success) {
      throw new Error(odemeData.error || 'Ödeme başlatılamadı')
    }

    setLoading(false)

    // Banka sayfasına yönlendir
    window.location.href = odemeData.redirectUrl
    
  } catch (error) {
    console.error('Genel hata:', error)
    setLoading(false)
    setModal({
      isOpen: true,
      type: 'error',
      data: { message: error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.' }
    })
  }
}

// 5. Modal'ı kapatma fonksiyonu
const closeModal = () => {
  setModal({ isOpen: false, type: 'available', data: null })
}


  const bugun = new Date().toISOString().split('T')[0]

  return (
    <>
      <Navbar />

      {/* HERO SECTION - With Background Image & Floating Form */}
      <section className="relative h-[450px] overflow-visible" style={{
        backgroundImage: 'url("https://uvadqixzovxsjrzjayom.supabase.co/storage/v1/object/public/mainpage/iskele1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

        {/* Content - Top Section */}
        <div className="relative container mx-auto px-4 pt-20 flex flex-col justify-start">
          <div className="text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <span className="text-sm font-semibold text-cyan-300">✨ Rezervasyon</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-2 drop-shadow-2xl" style={{ fontFamily: 'Georgia, serif' }}>
              Rezervasyon
            </h1>
            <p className="text-lg text-gray-100 font-light drop-shadow-lg">
              Hayalinizdeki tatil bir adım uzağınızda
            </p>
          </div>
        </div>

        {/* Floating Form Container - Positioned lower */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-full px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleAvailabilityCheck} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Giriş Tarihi */}
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-bold mb-2">
                    {t.form.checkIn} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="giris"
                    value={formData.giris}
                    onChange={handleChange}
                    min={bugun}
                    required
                     lang="tr-TR"
                    className="w-full px-3 py-2.5 border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg font-light text-gray-900 text-sm"
                  />
                </div>

                {/* Çıkış Tarihi */}
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-bold mb-2">
                    {t.form.checkOut} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="cikis"
                    value={formData.cikis}
                    onChange={handleChange}
                    min={formData.giris || bugun}
                    required
                     lang="tr-TR"
                    className="w-full px-3 py-2.5 border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg font-light text-gray-900 text-sm"
                  />
                </div>

                {/* Kişi Sayısı */}
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-gray-700 font-bold mb-2">
                    {t.form.guests} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="kisiSayisi"
                    value={formData.kisiSayisi}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg font-light text-gray-900 text-sm"
                  >
                    <option value="1">1 {t.summary.guestUnit}</option>
                    <option value="2">2 {t.summary.guestUnit}</option>
                    <option value="3">3 {t.summary.guestUnit}</option>
                    <option value="4">4 {t.summary.guestUnit}</option>
                    <option value="5">5 {t.summary.guestUnit}</option>
                  </select>
                </div>

                {/* Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 rounded-lg shadow-lg ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transform hover:scale-105'
                    }`}
                  >
                    {loading ? 'KONTROL EDİLİYOR...' : 'MÜSAİTLİK KONTROL'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* MAIN FORM SECTION - Sadece müsait olduğunda göster */}
      {isAvailable && (
        <section className="pt-40 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Müsaitlik Onay Mesajı */}
              <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-1">Seçtiğiniz Tarihler Müsait!</h3>
                    <p className="text-green-700 text-sm">
                      {new Date(formData.giris).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(formData.cikis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihleri için rezervasyon yapabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-12">
              {/* Sol: Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl border-l-4 border-cyan-500 overflow-hidden p-10">
                  <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Kişisel Bilgiler */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-serif text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                            {t.form.personalTitle}
                          </h2>
                          <p className="text-sm text-gray-600 font-light">{t.form.personalDesc}</p>
                        </div>
                      </div>
                      <div className="h-[2px] bg-gradient-to-r from-cyan-500 to-transparent mb-8"></div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.name} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="ad"
                            value={formData.ad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900"
                            placeholder="Adınız"
                          />
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.surname} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="soyad"
                            value={formData.soyad}
                            onChange={handleChange}
                            required
                             lang="tr-TR"
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900"
                            placeholder="Soyadınız"
                          />
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.email} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900"
                            placeholder="E-posta"
                          />
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.phone} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleChange}
                            required
                             lang="tr-TR"
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900"
                            placeholder="(5xx) 8xx-xxxx" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rezervasyon Detayları */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-serif text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                            {t.form.reservationTitle}
                          </h2>
                          <p className="text-sm text-gray-600 font-light">{t.form.reservationDesc}</p>
                        </div>
                      </div>
                      <div className="h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-8"></div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.checkIn} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="giris"
                            value={formData.giris}
                            onChange={handleChange}
                            min={bugun}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.checkOut} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="cikis"
                            value={formData.cikis}
                            onChange={handleChange}
                            min={formData.giris || bugun}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.guests} <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="kisiSayisi"
                            value={formData.kisiSayisi}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900"
                          >
                            <option value="1">1 {t.summary.guestUnit}</option>
                            <option value="2">2 {t.summary.guestUnit}</option>
                            <option value="3">3 {t.summary.guestUnit}</option>
                            <option value="4">4 {t.summary.guestUnit}</option>
                            <option value="5">5 {t.summary.guestUnit}</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs tracking-[0.15em] uppercase text-gray-700 font-bold mb-3">
                            {t.form.message}
                          </label>
                          <textarea
                            name="mesaj"
                            value={formData.mesaj}
                            onChange={handleChange}
                            rows="5"
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition rounded-lg bg-gray-50 font-light text-gray-900 resize-none"
                            placeholder={t.form.messagePlaceholder}
                          ></textarea>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 mt-10 rounded-lg shadow-lg ${
                          loading
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transform hover:scale-105'
                        }`}
                      >
                        {loading ? t.form.sending : t.form.submit}
                      </button>

                      <p className="text-center text-gray-500 text-xs mt-6 font-light tracking-wide">
                        {t.form.required}
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sağ: Özet & Bilgiler */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-8">
                  {/* Fiyat Özeti */}
                  {gunSayisi > 0 && (
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-2xl p-8 shadow-lg">
                      <h3 className="text-sm tracking-[0.2em] uppercase text-cyan-900 mb-6 font-bold">
                        {t.summary.title}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-cyan-200">
                          <span className="text-cyan-700 font-light">{t.summary.nights}</span>
                          <span className="font-bold text-gray-900">{gunSayisi} {t.summary.nightsUnit}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-cyan-200">
                          <span className="text-cyan-700 font-light">{t.summary.pricePerNight}</span>
                          <span className="font-bold text-gray-900">{formatPrice(145)}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-cyan-200">
                          <span className="text-cyan-700 font-light">{t.summary.guestCount}</span>
                          <span className="font-bold text-gray-900">{formData.kisiSayisi} {t.summary.guestUnit}</span>
                        </div>
                        <div className="flex justify-between pt-4 bg-white rounded-lg p-4 border-2 border-cyan-300">
                          <span className="text-sm tracking-[0.15em] uppercase font-bold text-gray-800">{t.summary.total}</span>
                          <span className="text-2xl font-bold text-cyan-600">{formatPrice(toplamFiyat)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bilgiler */}
                  <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-sm tracking-[0.2em] uppercase text-purple-900 mb-6 font-bold">
                      {t.info.title}
                    </h3>
                    <ul className="space-y-4 text-sm text-gray-700 font-light leading-relaxed">
                      {[t.info.item1, t.info.item2, t.info.item3, t.info.item4, t.info.item5].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-purple-600 font-bold mr-3">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WhatsApp */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-8 text-center shadow-lg">
                    <h3 className="text-lg font-serif text-emerald-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                      {t.contact.title}
                    </h3>
                    <p className="text-sm text-emerald-700 font-light mb-6">
                      {t.contact.desc}
                    </p>
                    <a
                      href="https://wa.me/905331234567?text=Merhaba, rezervasyon hakkında bilgi almak istiyorum."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-lg text-sm tracking-[0.2em] uppercase font-bold transition-all transform hover:scale-105 shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      {t.contact.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Eğer henüz müsaitlik kontrolü yapılmadıysa bilgilendirme göster */}
      {!isAvailable && (
        <section className="pt-40 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border-t-4 border-cyan-500">
                <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif text-gray-900 mb-4">Müsaitlik Kontrolü Gerekli</h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Rezervasyon formunu doldurmadan önce lütfen yukarıdaki alanda tarih seçerek müsaitlik kontrolü yapınız.
                </p>
                <div className="inline-flex items-center gap-2 text-cyan-600 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Yukarı kaydırarak tarih seçin
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm tracking-[0.2em] uppercase font-light mb-2">Serenity İskele</p>
          <p className="text-gray-400 text-xs font-light">© 2025 Serenity İskele - Luxury Vacation Rentals</p>
        </div>
      </footer>

      <Modal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        data={modal.data}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
      `}</style>
    </>
  )
}
export default function Rezervasyon() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Yükleniyor...</p>
        </div>
      </div>
    }>
      <RezervasyonContent />
    </Suspense>
  )
}
