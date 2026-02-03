import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { rezervasyonId, kartBilgileri } = body

    // Validasyon
    if (!rezervasyonId || !kartBilgileri) {
      return NextResponse.json(
        { success: false, error: 'Eksik bilgi' },
        { status: 400 }
      )
    }

    // Rezervasyonu kontrol et
    const { data: rezervasyon, error: rezervasyonError } = await supabase
      .from('rezervasyonlar')
      .select('*')
      .eq('id', rezervasyonId)
      .single()

    if (rezervasyonError || !rezervasyon) {
      return NextResponse.json(
        { success: false, error: 'Rezervasyon bulunamadı' },
        { status: 404 }
      )
    }

    // BURAYA BANKA ENTEGRASYONU GELECEKOdeme kaydı oluştur
    const { data: odeme, error: odemeError } = await supabase
      .from('odemeler')
      .insert([
        {
          rezervasyon_id: rezervasyonId,
          tutar: rezervasyon.toplam_fiyat,
          durum: 'beklemede', // beklemede, basarili, basarisiz
          odeme_yontemi: 'kredi_karti',
          banka_islem_id: null, // Banka'dan gelecek
          islem_tarihi: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (odemeError) {
      console.error('Ödeme kaydı hatası:', odemeError)
      return NextResponse.json(
        { success: false, error: 'Ödeme kaydı oluşturulamadı' },
        { status: 500 }
      )
    }

    // BANKA ENTEGRASYONU SONRASI:
    // 1. Banka API'sine istek gönder
    // 2. Dönüş URL'sini al
    // 3. Ödeme ID'sini kaydet
    
    // ŞİMDİLİK SİMÜLASYON:
    // Gerçek entegrasyonda buradan banka sayfasına yönlendirme URL'si gelecek
    const bankaUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/odeme/bekleme?rezervasyonId=${rezervasyonId}`

    return NextResponse.json({
      success: true,
      odemeId: odeme.id,
      redirectUrl: bankaUrl,
      message: 'Ödeme işlemi başlatıldı'
    })

  } catch (error) {
    console.error('Ödeme başlatma hatası:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
