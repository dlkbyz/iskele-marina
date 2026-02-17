import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { ad_soyad, email, telefon, konu, mesaj } = body

    if (!ad_soyad || !email || !mesaj) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const supabaseAdmin = getAdminClient()
    const { error } = await supabaseAdmin
      .from('iletisim_mesajlari')
      .insert([{ soyad: ad_soyad, email, telefon, konu, mesaj, okundu: false }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('İletişim formu hatası:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
