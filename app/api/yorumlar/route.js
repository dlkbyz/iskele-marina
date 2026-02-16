import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// GET - Onaylanmış yorumları getir
export async function GET() {
  try {
    const supabaseAdmin = getAdminClient()
    const { data, error } = await supabaseAdmin
      .from('yorumlar')
      .select('*')
      .eq('onaylandi', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Yorumlar getirilemedi:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yeni yorum ekle
export async function POST(request) {
  try {
    const body = await request.json()
    const { ad, email, puan, baslik, yorum } = body

    if (!ad || !email || !puan || !yorum) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    if (puan < 1 || puan > 5) {
      return NextResponse.json({ error: 'Puan 1-5 arasında olmalıdır' }, { status: 400 })
    }

    const supabaseAdmin = getAdminClient()
    const { error } = await supabaseAdmin
      .from('yorumlar')
      .insert([{ ad, email, puan, baslik, yorum, onaylandi: false }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Yorum eklenemedi:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
