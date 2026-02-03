// lib/emailService.js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Rezervasyon onayı e-maili
 */
export const sendReservationConfirmation = async (reservation) => {
  const {
    ad,
    soyad,
    email,
    giris_tarihi,
    cikis_tarihi,
    kisi_sayisi,
    toplam_fiyat,
    erisme_kodu
  } = reservation

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rezervasyon Onayı</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #00a8e8 0%, #0085c9 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .details {
          background: #f9f9f9;
          border-left: 4px solid #00a8e8;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          font-size: 14px;
        }
        .detail-label {
          font-weight: bold;
          color: #666;
        }
        .detail-value {
          color: #333;
        }
        .access-code {
          background: #e8f4f8;
          border: 2px solid #00a8e8;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        }
        .access-code-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }
        .access-code-value {
          font-size: 24px;
          font-weight: bold;
          color: #00a8e8;
          letter-spacing: 2px;
        }
        .important {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
          font-size: 14px;
        }
        .important ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .important li {
          margin: 5px 0;
        }
        .contact-info {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 5px;
          font-size: 13px;
          margin: 20px 0;
        }
        .contact-info strong {
          display: block;
          margin-bottom: 10px;
          color: #00a8e8;
        }
        .contact-info a {
          color: #00a8e8;
          text-decoration: none;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Rezervasyonunuz Onaylandı!</h1>
          <p>Serenity İskele - Premium Konaklama</p>
        </div>

        <div class="content">
          <div class="greeting">
            <p>Merhaba <strong>${ad} ${soyad}</strong>,</p>
            <p>Serenity İskele'ye yaptığınız rezervasyon başarıyla onaylanmıştır. Aşağıda rezervasyonunuzun detaylarını bulabilirsiniz.</p>
          </div>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">📅 Giriş Tarihi:</span>
              <span class="detail-value">${new Date(giris_tarihi).toLocaleDateString('tr-TR')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Çıkış Tarihi:</span>
              <span class="detail-value">${new Date(cikis_tarihi).toLocaleDateString('tr-TR')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👥 Kişi Sayısı:</span>
              <span class="detail-value">${kisi_sayisi} kişi</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💰 Toplam Tutar:</span>
              <span class="detail-value"><strong>$${toplam_fiyat}</strong></span>
            </div>
          </div>

          <div class="access-code">
            <div class="access-code-label">🔑 Check-in Erişim Kodu</div>
            <div class="access-code-value">${erisme_kodu}</div>
          </div>

          <div class="important">
            <strong>⚠️ Önemli Bilgiler:</strong>
            <ul>
              <li>Check-in: 14:00</li>
              <li>Check-out: 12:00</li>
              <li>Erişim kodunuzu güvende saklayın</li>
              <li>Sorun yaşanırsa WhatsApp'tan iletişime geçin</li>
            </ul>
          </div>

          <div class="contact-info">
            <strong>📞 İletişim Bilgileri:</strong>
            Telefon: +90 533 123 45 67<br>
            Email: info@serenity-iskele.com<br>
            WhatsApp: <a href="https://wa.me/905331234567" target="_blank">Canlı Sohbet</a>
          </div>
        </div>

        <div class="footer">
          <p>© 2025 Serenity İskele. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const data = await resend.emails.send({
      from: 'Serenity İskele <onboarding@resend.dev>',
      to: email,
      subject: '✅ Serenity İskele - Rezervasyonunuz Onaylandı',
      html: htmlContent
    })

    console.log(`✅ Onay e-maili gönderildi: ${email}`)
    return true
  } catch (error) {
    console.error(`❌ Email gönderme hatası:`, error)
    throw error
  }
}

/**
 * Rezervasyon iptal e-maili
 */
export const sendCancellationEmail = async (reservation, refundAmount) => {
  const { ad, soyad, email, giris_tarihi, cikis_tarihi } = reservation

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px; }
        .details { background: #f9f9f9; border-left: 4px solid #ff6b6b; padding: 15px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .refund-box { background: #e8f5e9; border: 2px solid #4caf50; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .refund-amount { font-size: 24px; font-weight: bold; color: #4caf50; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Rezervasyonunuz İptal Edildi</h1>
        </div>
        <div class="content">
          <p>Merhaba ${ad} ${soyad},</p>
          <p>Üzücü olmakla birlikte, sizin rezervasyonunuz aşağıdaki tarihler için iptal edilmiştir:</p>
          
          <div class="details">
            <div class="detail-row">
              <strong>Giriş Tarihi:</strong>
              <span>${new Date(giris_tarihi).toLocaleDateString('tr-TR')}</span>
            </div>
            <div class="detail-row">
              <strong>Çıkış Tarihi:</strong>
              <span>${new Date(cikis_tarihi).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>

          <div class="refund-box">
            <p style="margin: 0 0 10px 0;">💰 İade Tutarı:</p>
            <div class="refund-amount">$${refundAmount}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px;">3-5 iş günü içinde iade yapılacaktır</p>
          </div>

          <p>Eğer sorularınız varsa, lütfen bize ulaşın: info@serenity-iskele.com</p>
        </div>
        <div class="footer">
          <p>© 2025 Serenity İskele</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'Serenity İskele <onboarding@resend.dev>',
      to: email,
      subject: '❌ Serenity İskele - Rezervasyonunuz İptal Edildi',
      html: htmlContent
    })

    console.log(`✅ İptal e-maili gönderildi: ${email}`)
    return true
  } catch (error) {
    console.error(`❌ Email gönderme hatası:`, error)
    throw error
  }
}

/**
 * Check-in Hatırlatması (1 gün önce)
 */
export const sendCheckInReminder = async (reservation) => {
  const { ad, soyad, email, giris_tarihi, erisme_kodu } = reservation

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #00a8e8 0%, #0085c9 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px; }
        .code-box { background: #e8f4f8; border: 2px solid #00a8e8; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .code { font-size: 20px; font-weight: bold; color: #00a8e8; letter-spacing: 2px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 Yarın Geliş Yapıyorsunuz!</h1>
        </div>
        <div class="content">
          <p>Merhaba ${ad},</p>
          <p>Serenity İskele'ye geliş yapmak üzere olduğunuzu hatırlatmak istiyoruz. Aşağıda check-in bilgileriniz bulunmaktadır.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>📅 Check-in Tarihi:</strong> ${new Date(giris_tarihi).toLocaleDateString('tr-TR')}</p>
            <p><strong>⏰ Check-in Saati:</strong> 14:00</p>
          </div>

          <div class="code-box">
            <p style="margin: 0 0 10px 0;">🔑 Erişim Kodunuz:</p>
            <div class="code">${erisme_kodu}</div>
          </div>

          <p>Herhangi bir sorun için WhatsApp'tan +90 533 123 45 67 numarasından iletişime geçebilirsiniz.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'Serenity İskele <onboarding@resend.dev>',
      to: email,
      subject: '🔔 Serenity İskele - Yarın Geliş Yapıyorsunuz',
      html: htmlContent
    })

    return true
  } catch (error) {
    console.error(`❌ Reminder email gönderme hatası:`, error)
    throw error
  }
}