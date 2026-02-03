// app/api/admin/reservations/[id]/reject/route.js
import { supabase } from '@/lib/supabase'
import { sendCancellationEmail } from '@/lib/emailService'

export async function POST(request, { params }) {
  const { id } = params
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
    await sendCancellationEmail(updated, refundAmount)

    return Response.json({
      success: true,
      message: 'Rezervasyon iptal edildi ve e-mail gönderildi',
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