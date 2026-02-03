import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Bu endpoint her gün çalıştırılmalı (Cron job veya Vercel Cron)
// Yarın check-in olan rezervasyonlara hatırlatma gönderir

export async function GET(request) {
  try {
    // Güvenlik: Sadece cron job veya belirli bir secret key ile erişilebilir
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'your-secret-key'}`
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Yarın tarihi hesapla
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    // Yarın check-in olan rezervasyonları getir
    const { data: rezervasyonlar, error } = await supabase
      .from('rezervasyonlar')
      .select('*')
      .eq('giris_tarihi', tomorrowStr)
      .eq('durum', 'onaylandı')

    if (error) throw error

    console.log(`${tomorrowStr} için ${rezervasyonlar?.length || 0} rezervasyon bulundu`)

    // Her rezervasyon için hatırlatma email'i gönder
    const results = []
    for (const rezervasyon of (rezervasyonlar || [])) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'check_in_reminder',
            data: rezervasyon
          })
        })

        const emailResult = await response.json()
        
        results.push({
          rezervasyonId: rezervasyon.id,
          email: rezervasyon.email,
          success: emailResult.success,
          error: emailResult.error || null
        })

        console.log(`✅ Hatırlatma gönderildi: #${rezervasyon.id} - ${rezervasyon.email}`)
      } catch (emailError) {
        console.error(`❌ Email hatası: #${rezervasyon.id}`, emailError)
        results.push({
          rezervasyonId: rezervasyon.id,
          email: rezervasyon.email,
          success: false,
          error: emailError.message
        })
      }
    }

    return NextResponse.json({
      success: true,
      date: tomorrowStr,
      count: rezervasyonlar?.length || 0,
      results: results
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    )
  }
}
