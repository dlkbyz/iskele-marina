import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const rezervasyonId = searchParams.get('rezervasyonId')

    if (!rezervasyonId) {
      return NextResponse.json(
        { success: false, error: 'Rezervasyon ID gerekli' },
        { status: 400 }
      )
    }

    // Rezervasyon ve ödeme bilgisini getir
    const { data: odeme, error } = await supabase
      .from('odemeler')
      .select(`
        *,
        rezervasyonlar (
          id,
          ad,
          soyad,
          email,
          giris_tarihi,
          cikis_tarihi,
          kisi_sayisi,
          toplam_fiyat,
          durum,
          odeme_durumu
        )
      `)
      .eq('rezervasyon_id', rezervasyonId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Ödeme durumu sorgu hatası:', error)
      return NextResponse.json(
        { success: false, error: 'Ödeme bilgisi bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      odeme: {
        id: odeme.id,
        durum: odeme.durum,
        tutar: odeme.tutar,
        odeme_yontemi: odeme.odeme_yontemi,
        banka_islem_id: odeme.banka_islem_id,
        islem_tarihi: odeme.islem_tarihi,
        hata_mesaji: odeme.hata_mesaji
      },
      rezervasyon: odeme.rezervasyonlar
    })

  } catch (error) {
    console.error('Durum kontrol hatası:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
