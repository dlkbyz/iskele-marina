// app/api/admin/reservations/[id]/approve/route.js
import { createClient } from '@supabase/supabase-js'
import { sendReservationConfirmation } from '@/lib/emailService'
import crypto from 'crypto'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(_, { params }) {
  const { id } = await params
  const supabase = getAdminClient()

  try {
    // 1. Rezervasyonu getir
    const { data: reservation, error: fetchError } = await supabase
      .from('rezervasyonlar')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !reservation) {
      return Response.json(
        { error: 'Rezervasyon bulunamadı' },
        { status: 404 }
      )
    }

    // 2. Check-in Erişim Kodu oluştur (6 haneli)
    const erisme_kodu = crypto.randomInt(100000, 999999).toString()

    // 3. Rezervasyonu güncelle
    const { data: updated, error: updateError } = await supabase
      .from('rezervasyonlar')
      .update({
        durum: 'onaylandi',
        erisme_kodu: erisme_kodu,
        onay_tarihi: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // 4. Onay e-maili gönder
    let emailGonderildi = false
    let emailHata = null
    try {
      await sendReservationConfirmation({ ...updated, erisme_kodu })
      emailGonderildi = true
    } catch (emailError) {
      emailHata = emailError.message || String(emailError)
      console.error('Email gönderme hatası:', emailError)
    }

    // 5. Email durumunu kaydet
    await supabase
      .from('rezervasyonlar')
      .update({
        email_gonderildi: emailGonderildi,
        email_tarihi: new Date().toISOString()
      })
      .eq('id', id)

    return Response.json({
      success: true,
      emailGonderildi,
      emailHata,
      message: emailGonderildi
        ? 'Rezervasyon onaylandı ve e-mail gönderildi'
        : `Rezervasyon onaylandı ancak e-mail gönderilemedi: ${emailHata}`,
      data: updated
    })

  } catch (error) {
    console.error('Approve error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}