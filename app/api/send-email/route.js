import { NextResponse } from 'next/server'
import { emailTemplates } from '@/lib/emailTemplates'

// Resend'i optional yapıyoruz
let resend = null
try {
  const { Resend } = await import('resend')
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
} catch (error) {
  console.log('⚠️ Resend yüklü değil veya API key yok - Demo modda çalışıyor')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Email type'ına göre template seç
    let emailContent
    let recipientEmail
    let adminEmail = 'dilekamir@gmail.com'

    switch (type) {
      case 'reservation_confirmation':
        emailContent = emailTemplates.reservationConfirmation(data)
        recipientEmail = data.email
        break
      
      case 'payment_success':
        emailContent = emailTemplates.paymentSuccess(data)
        recipientEmail = data.email
        break
      
      case 'check_in_reminder':
        emailContent = emailTemplates.checkInReminder(data)
        recipientEmail = data.email
        break
      
      case 'admin_notification':
        emailContent = emailTemplates.adminNotification(data)
        recipientEmail = adminEmail
        break
      
      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz email tipi' },
          { status: 400 }
        )
    }

    // Resend varsa gerçek email gönder
    if (resend && process.env.RESEND_API_KEY) {
      try {
        // TEST MODE: Resend ücretsiz hesabında sadece kayıtlı emaile gönderilebilir
        const testMode = !process.env.RESEND_DOMAIN_VERIFIED
        const emailTo = testMode ? 'dilek.amir@gmail.com' : recipientEmail
        
        const emailData = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Serenity İskele <onboarding@resend.dev>',
          to: emailTo,
          subject: testMode ? `[TEST - ${recipientEmail}] ${emailContent.subject}` : emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        })

        console.log('✅ Email başarıyla gönderildi:', emailData)

        return NextResponse.json({
          success: true,
          message: testMode ? `Email test modda gönderildi → ${emailTo}` : 'Email başarıyla gönderildi',
          id: emailData.id,
          to: testMode ? `${emailTo} (orijinal: ${recipientEmail})` : recipientEmail,
          testMode
        })
      } catch (resendError) {
        console.error('❌ Resend hatası:', resendError)
        throw resendError
      }
    } else {
      // DEMO MODE: Email gönderme simülasyonu
      console.log('📧 DEMO MODE - Email gönderildi (simülasyon):', {
        type,
        to: recipientEmail,
        subject: emailContent.subject,
        preview: emailContent.text?.substring(0, 100)
      })

      return NextResponse.json({
        success: true,
        message: 'Email gönderildi (DEMO MODE)',
        demo: true,
        to: recipientEmail,
        subject: emailContent.subject,
        note: 'Resend API key eklemek için .env.local dosyasına RESEND_API_KEY=xxx ekleyin'
      })
    }

  } catch (error) {
    console.error('❌ Email gönderme hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Email gönderilemedi',
        details: error
      },
      { status: 500 }
    )
  }
}
