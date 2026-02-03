import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// Bu endpoint banka tarafından çağrılacak
export async function POST(request) {
  try {
    const body = await request.json()
    
    // BANKA ENTEGRASYONUNA GÖRE DEĞİŞECEK
    // Her bankanın farklı parametreleri olabilir
    const {
      odemeId,
      bankaIslemId,
      durum, // 'success', 'fail', 'cancel'
      hataMesaji,
      bankaKodu,
      // ... diğer banka parametreleri
    } = body

    console.log('Banka callback aldı:', body)

    // Ödeme kaydını güncelle
    const { data: odeme, error: odemeError } = await supabase
      .from('odemeler')
      .update({
        durum: durum === 'success' ? 'basarili' : 'basarisiz',
        banka_islem_id: bankaIslemId,
        hata_mesaji: hataMesaji,
        banka_kodu: bankaKodu,
        guncelleme_tarihi: new Date().toISOString()
      })
      .eq('id', odemeId)
      .select()
      .single()

    if (odemeError) {
      console.error('Ödeme güncelleme hatası:', odemeError)
      return NextResponse.json(
        { success: false, error: 'Ödeme güncellenemedi' },
        { status: 500 }
      )
    }

    // Ödeme başarılıysa rezervasyonu onayla
    if (durum === 'success') {
      const { error: rezervasyonError } = await supabase
        .from('rezervasyonlar')
        .update({ 
          durum: 'onaylandı',
          odeme_durumu: 'odendi'
        })
        .eq('id', odeme.rezervasyon_id)

      if (rezervasyonError) {
        console.error('Rezervasyon güncelleme hatası:', rezervasyonError)
      }

      // Ödeme başarılı email'i gönder
      try {
        const { data: rezervasyon } = await supabase
          .from('rezervasyonlar')
          .select('*')
          .eq('id', odeme.rezervasyon_id)
          .single()

        if (rezervasyon) {
          // Müşteriye ödeme onay email'i
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment_success',
              data: {
                ...rezervasyon,
                odeme_tarihi: new Date().toISOString()
              }
            })
          })

          // Admin'e bildirim
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'admin_notification',
              data: rezervasyon
            })
          })
        }
      } catch (emailError) {
        console.error('Email gönderme hatası:', emailError)
        // Email hatas ı ödemeyitermin etmesin
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Callback işlendi',
      odeme: odeme
    })

  } catch (error) {
    console.error('Callback hatası:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

// GET endpoint - Kullanıcı banka sayfasından döndüğünde
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const odemeId = searchParams.get('odemeId')
    const durum = searchParams.get('durum')
    
    if (!odemeId) {
      return NextResponse.redirect(
        new URL('/odeme/hata?mesaj=Geçersiz ödeme', request.url)
      )
    }

    // Ödeme durumunu kontrol et
    const { data: odeme, error } = await supabase
      .from('odemeler')
      .select('*, rezervasyonlar(*)')
      .eq('id', odemeId)
      .single()

    if (error || !odeme) {
      return NextResponse.redirect(
        new URL('/odeme/hata?mesaj=Ödeme bulunamadı', request.url)
      )
    }

    // Duruma göre yönlendir
    if (odeme.durum === 'basarili' || durum === 'success') {
      return NextResponse.redirect(
        new URL(`/odeme/basarili?rezervasyonId=${odeme.rezervasyon_id}`, request.url)
      )
    } else {
      return NextResponse.redirect(
        new URL(
          `/odeme/hata?rezervasyonId=${odeme.rezervasyon_id}&mesaj=${encodeURIComponent(odeme.hata_mesaji || 'Ödeme başarısız')}`,
          request.url
        )
      )
    }

  } catch (error) {
    console.error('Callback GET hatası:', error)
    return NextResponse.redirect(
      new URL('/odeme/hata?mesaj=Bir hata oluştu', request.url)
    )
  }
}
