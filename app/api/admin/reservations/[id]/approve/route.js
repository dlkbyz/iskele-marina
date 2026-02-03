// app/api/admin/reservations/[id]/approve/route.js
import { supabase } from '@/lib/supabase'
import { sendReservationConfirmation } from '@/lib/emailService'
import crypto from 'crypto'

export async function POST(request, { params }) {
  const { id } = params

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
        durum: 'onaylandı',
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
    await sendReservationConfirmation({
      ...updated,
      erisme_kodu
    })

    return Response.json({
      success: true,
      message: 'Rezervasyon onaylandı ve e-mail gönderildi',
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