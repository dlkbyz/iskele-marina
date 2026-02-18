// app/api/admin/reservations/[id]/reject/route.js
import { createClient } from '@supabase/supabase-js'
import { sendCancellationEmail } from '@/lib/emailService'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request, { params }) {
  const { id } = await params
  const supabase = getAdminClient()
  const { refundAmount = 0, reason = 'Müsaitlik sorunu' } = await request.json()

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

    // 2. Rezervasyonu iptal et
    const { data: updated, error: updateError } = await supabase
      .from('rezervasyonlar')
      .update({
        durum: 'iptal',
        iptal_tarihi: new Date().toISOString(),
        iptal_nedeni: reason,
        iade_tutar: refundAmount
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // 3. İptal e-maili gönder
    let emailGonderildi = false
    try {
      await sendCancellationEmail(updated, refundAmount)
      emailGonderildi = true
    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError)
    }

    // 4. Email durumunu kaydet
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
      message: emailGonderildi
        ? 'Rezervasyon iptal edildi ve e-mail gönderildi'
        : 'Rezervasyon iptal edildi ancak e-mail gönderilemedi',
      data: updated
    })

  } catch (error) {
    console.error('Reject error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}