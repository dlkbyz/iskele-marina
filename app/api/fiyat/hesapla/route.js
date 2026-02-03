import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { giris_tarihi, cikis_tarihi } = await request.json()

    if (!giris_tarihi || !cikis_tarihi) {
      return NextResponse.json(
        { success: false, error: 'Tarihler gerekli' },
        { status: 400 }
      )
    }

    const startDate = new Date(giris_tarihi)
    const endDate = new Date(cikis_tarihi)
    const gunSayisi = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

    if (gunSayisi <= 0) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz tarih aralığı' },
        { status: 400 }
      )
    }

    // Tüm fiyat ayarlarını çek
    const { data: fiyatlar, error } = await supabase
      .from('fiyat_ayarlari')
      .select('*')
      .eq('aktif', true)

    if (error) throw error

    let toplamFiyat = 0
    const gunlukDetay = []

    // Her gün için fiyat hesapla
    for (let i = 0; i < gunSayisi; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayOfWeek = currentDate.getDay() // 0=Pazar, 6=Cumartesi

      let gunlukFiyat = null
      let fiyatTipi = 'varsayilan'

      // Öncelik sırası: Özel Tarih > Sezon > Hafta Sonu > Varsayılan

      // 1. Özel tarih kontrolü
      const ozelTarih = fiyatlar?.find(f => 
        f.tip === 'ozel_tarih' &&
        dateStr >= f.baslangic_tarihi &&
        dateStr <= f.bitis_tarihi
      )
      if (ozelTarih) {
        gunlukFiyat = parseFloat(ozelTarih.fiyat)
        fiyatTipi = 'ozel_tarih'
      }

      // 2. Sezon kontrolü
      if (!gunlukFiyat) {
        const sezon = fiyatlar?.find(f => 
          f.tip === 'sezon' &&
          dateStr >= f.baslangic_tarihi &&
          dateStr <= f.bitis_tarihi
        )
        if (sezon) {
          gunlukFiyat = parseFloat(sezon.fiyat)
          fiyatTipi = 'sezon'
        }
      }

      // 3. Hafta sonu kontrolü (Cuma=5, Cumartesi=6)
      if (!gunlukFiyat && (dayOfWeek === 5 || dayOfWeek === 6)) {
        const haftaSonu = fiyatlar?.find(f => f.tip === 'hafta_sonu')
        if (haftaSonu) {
          gunlukFiyat = parseFloat(haftaSonu.fiyat)
          fiyatTipi = 'hafta_sonu'
        }
      }

      // 4. Varsayılan fiyat
      if (!gunlukFiyat) {
        const varsayilan = fiyatlar?.find(f => f.tip === 'varsayilan')
        gunlukFiyat = varsayilan ? parseFloat(varsayilan.fiyat) : 150.00
      }

      toplamFiyat += gunlukFiyat
      gunlukDetay.push({
        tarih: dateStr,
        fiyat: gunlukFiyat,
        tip: fiyatTipi
      })
    }

    return NextResponse.json({
      success: true,
      gunSayisi,
      toplamFiyat: toplamFiyat.toFixed(2),
      ortalamaGunluk: (toplamFiyat / gunSayisi).toFixed(2),
      gunlukDetay
    })

  } catch (error) {
    console.error('Fiyat hesaplama hatası:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
