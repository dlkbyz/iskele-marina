// Email Template Helper Functions

export const emailTemplates = {
  // 1. Rezervasyon Onayı (Müşteriye)
  reservationConfirmation: (data) => {
    const { ad, soyad, email, giris_tarihi, cikis_tarihi, kisi_sayisi, toplam_fiyat, id } = data
    
    return {
      subject: `🎉 Rezervasyon Onayı - #${id} | Serenity İskele`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); padding: 40px 20px; text-center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; }
    .content { padding: 40px 30px; }
    .success-badge { background: #10b981; color: white; display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
    .greeting { font-size: 18px; color: #1f2937; margin-bottom: 20px; font-weight: 500; }
    .message { color: #6b7280; line-height: 1.6; margin-bottom: 30px; }
    .details-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border-left: 4px solid #06b6d4; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(6, 182, 212, 0.2); }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 14px; font-weight: 500; }
    .detail-value { color: #1e293b; font-size: 14px; font-weight: 600; }
    .total-row { background: white; padding: 16px; border-radius: 8px; margin-top: 16px; }
    .total-label { color: #0f172a; font-size: 16px; font-weight: 700; }
    .total-value { color: #06b6d4; font-size: 24px; font-weight: 700; }
    .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .info-box h3 { margin: 0 0 12px; color: #92400e; font-size: 14px; font-weight: 600; }
    .info-box ul { margin: 0; padding-left: 20px; color: #78350f; }
    .info-box li { margin-bottom: 8px; font-size: 14px; }
    .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; text-align: center; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { color: #64748b; font-size: 13px; margin: 8px 0; }
    .social-links { margin: 20px 0; }
    .social-links a { display: inline-block; margin: 0 10px; color: #06b6d4; text-decoration: none; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🏖️ Serenity İskele</h1>
      <p>Luxury Vacation Rentals</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="success-badge">✓ Rezervasyon Onaylandı</div>
      
      <div class="greeting">
        Merhaba ${ad} ${soyad},
      </div>

      <div class="message">
        <p>Rezervasyonunuz başarıyla oluşturuldu ve onaylandı! İskele White Residence'da sizi ağırlamaktan mutluluk duyacağız.</p>
      </div>

      <!-- Reservation Details -->
      <div class="details-card">
        <h2 style="margin: 0 0 20px; color: #0f172a; font-size: 18px;">📋 Rezervasyon Detayları</h2>
        
        <div class="detail-row">
          <span class="detail-label">Rezervasyon No:</span>
          <span class="detail-value">#${id}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Giriş Tarihi:</span>
          <span class="detail-value">${new Date(giris_tarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Çıkış Tarihi:</span>
          <span class="detail-value">${new Date(cikis_tarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Kişi Sayısı:</span>
          <span class="detail-value">${kisi_sayisi} Kişi</span>
        </div>

        <div class="total-row detail-row">
          <span class="total-label">Toplam Tutar:</span>
          <span class="total-value">€${toplam_fiyat}</span>
        </div>
      </div>

      <!-- Important Info -->
      <div class="info-box">
        <h3>⏰ Önemli Bilgiler</h3>
        <ul>
          <li><strong>Check-in:</strong> 14:00</li>
          <li><strong>Check-out:</strong> 12:00</li>
          <li><strong>Adres:</strong> İskele White Residence, Girne, KKTC</li>
          <li>Giriş günü size SMS ile konum ve talimatlar gönderilecektir</li>
        </ul>
      </div>

      <div class="message">
        <p>Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p>
      </div>

      <center>
        <a href="https://wa.me/905331234567?text=Merhaba,%20rezervasyon%20numaram%20${id}" class="button">
          💬 WhatsApp ile İletişim
        </a>
      </center>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        <strong>Serenity İskele</strong><br>
        İskele White Residence, Girne, KKTC
      </div>
      <div class="social-links">
        <a href="#">Instagram</a> • <a href="#">Facebook</a> • <a href="#">Website</a>
      </div>
      <div class="footer-text" style="margin-top: 20px; font-size: 11px; color: #94a3b8;">
        Bu email ${email} adresine gönderilmiştir.<br>
        © 2025 Serenity İskele. Tüm hakları saklıdır.
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `Rezervasyon Onayı - #${id}

Merhaba ${ad} ${soyad},

Rezervasyonunuz başarıyla onaylandı!

Rezervasyon Detayları:
- Rezervasyon No: #${id}
- Giriş: ${new Date(giris_tarihi).toLocaleDateString('tr-TR')}
- Çıkış: ${new Date(cikis_tarihi).toLocaleDateString('tr-TR')}
- Kişi Sayısı: ${kisi_sayisi}
- Toplam: €${toplam_fiyat}

Check-in: 14:00 | Check-out: 12:00

İyi tatiller dileriz!
Serenity İskele
`
    }
  },

  // 2. Ödeme Başarılı (Müşteriye)
  paymentSuccess: (data) => {
    const { ad, soyad, id, toplam_fiyat, odeme_tarihi } = data
    
    return {
      subject: `✅ Ödeme Alındı - #${id} | Serenity İskele`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-center; }
    .header-icon { font-size: 64px; margin-bottom: 16px; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .success-message { background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .success-message h2 { margin: 0 0 12px; color: #065f46; font-size: 18px; }
    .success-message p { margin: 0; color: #047857; line-height: 1.6; }
    .payment-details { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 14px; }
    .detail-value { color: #0f172a; font-size: 14px; font-weight: 600; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-icon">✓</div>
      <h1>Ödeme Başarılı!</h1>
    </div>

    <div class="content">
      <div class="success-message">
        <h2>Merhaba ${ad} ${soyad},</h2>
        <p>Ödemeniz başarıyla alındı. Rezervasyonunuz kesinleşmiştir.</p>
      </div>

      <div class="payment-details">
        <h3 style="margin: 0 0 16px; color: #0f172a;">Ödeme Detayları</h3>
        <div class="detail-row">
          <span class="detail-label">Rezervasyon No:</span>
          <span class="detail-value">#${id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tutar:</span>
          <span class="detail-value">€${toplam_fiyat}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tarih:</span>
          <span class="detail-value">${new Date(odeme_tarihi).toLocaleString('tr-TR')}</span>
        </div>
      </div>

      <p style="color: #6b7280; line-height: 1.6;">
        Faturanız email adresinize ayrıca gönderilecektir.
      </p>
    </div>

    <div class="footer">
      <p style="color: #64748b; font-size: 13px; margin: 0;">
        © 2025 Serenity İskele
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `Ödeme Başarılı - #${id}\n\nMerhaba ${ad} ${soyad},\n\nÖdemeniz başarıyla alındı.\nTutar: €${toplam_fiyat}\nTarih: ${new Date(odeme_tarihi).toLocaleString('tr-TR')}\n\nTeşekkür ederiz!\nSerenity İskele`
    }
  },

  // 3. Check-in Hatırlatması (1 gün önce)
  checkInReminder: (data) => {
    const { ad, soyad, giris_tarihi, id } = data
    
    return {
      subject: `⏰ Yarın Check-in Günü! - #${id} | Serenity İskele`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-center; color: white; }
    .content { padding: 40px 30px; }
    .reminder-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
    .info-item { background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; }
    .info-label { color: #64748b; font-size: 12px; margin-bottom: 8px; }
    .info-value { color: #0f172a; font-size: 18px; font-weight: 700; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 32px;">⏰</h1>
      <h2 style="margin: 16px 0 0; font-size: 24px;">Yarın Check-in!</h2>
    </div>

    <div class="content">
      <p style="font-size: 18px; color: #1f2937; font-weight: 500;">Merhaba ${ad} ${soyad},</p>
      
      <div class="reminder-box">
        <p style="margin: 0; color: #92400e; font-size: 15px;">
          <strong>Yarın check-in gününüz!</strong><br>
          Sizi Serenity İskele'de ağırlamak için hazırız.
        </p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">CHECK-IN SAAT</div>
          <div class="info-value">14:00</div>
        </div>
        <div class="info-item">
          <div class="info-label">REZERVASYON NO</div>
          <div class="info-value">#${id}</div>
        </div>
      </div>

      <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; color: #0c4a6e; font-size: 16px;">📍 Adres Bilgileri</h3>
        <p style="margin: 0; color: #075985;">
          İskele White Residence<br>
          Girne, KKTC<br><br>
          <a href="https://maps.google.com/?q=Iskele+White+Residence" style="color: #06b6d4; text-decoration: none; font-weight: 600;">📍 Google Maps'te Aç</a>
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; color: #475569; font-size: 14px;">
          <strong>💡 Öneriler:</strong><br>
          • Kimlik kartınızı yanınıza almayı unutmayın<br>
          • Sorularınız için bize WhatsApp'tan ulaşabilirsiniz<br>
          • Havalimanından transfer hizmeti için bizimle iletişime geçin
        </p>
      </div>

      <center>
        <a href="https://wa.me/905331234567" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0;">
          💬 WhatsApp ile İletişim
        </a>
      </center>

      <p style="color: #6b7280; text-align: center; margin-top: 32px;">
        İyi yolculuklar! 🌴
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `Yarın Check-in Günü!\n\nMerhaba ${ad} ${soyad},\n\nYarın ${new Date(giris_tarihi).toLocaleDateString('tr-TR')} tarihinde sizi Serenity İskele'de ağırlayacağız.\n\nCheck-in Saati: 14:00\nRezervasyon No: #${id}\n\nİyi yolculuklar!\nSerenity İskele`
    }
  },

  // 4. Admin Bildirimi (Yeni Rezervasyon)
  adminNotification: (data) => {
    const { ad, soyad, email, telefon, giris_tarihi, cikis_tarihi, kisi_sayisi, toplam_fiyat, id } = data
    
    return {
      subject: `🔔 Yeni Rezervasyon #${id} - ${ad} ${soyad}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; font-family: monospace; background: #0f172a; color: #e2e8f0; }
    .container { max-width: 700px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px; }
    .alert-badge { background: #fef2f2; color: #dc2626; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 700; display: inline-block; margin-bottom: 12px; }
    .data-table { background: #1e293b; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .data-row { padding: 12px 0; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; }
    .data-row:last-child { border-bottom: none; }
    .label { color: #94a3b8; }
    .value { color: #f1f5f9; font-weight: 600; }
    .action-btn { display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="alert-badge">🔔 YENİ REZERVASYON</div>
      <h1 style="margin: 0; color: white; font-size: 24px;">Admin Bildirimi</h1>
    </div>

    <div class="data-table">
      <h2 style="margin: 0 0 20px; color: #f1f5f9; font-size: 18px;">Rezervasyon #${id}</h2>
      <div class="data-row">
        <span class="label">Ad Soyad:</span>
        <span class="value">${ad} ${soyad}</span>
      </div>
      <div class="data-row">
        <span class="label">Email:</span>
        <span class="value">${email}</span>
      </div>
      <div class="data-row">
        <span class="label">Telefon:</span>
        <span class="value">${telefon}</span>
      </div>
      <div class="data-row">
        <span class="label">Giriş - Çıkış:</span>
        <span class="value">${new Date(giris_tarihi).toLocaleDateString('tr-TR')} - ${new Date(cikis_tarihi).toLocaleDateString('tr-TR')}</span>
      </div>
      <div class="data-row">
        <span class="label">Kişi Sayısı:</span>
        <span class="value">${kisi_sayisi}</span>
      </div>
      <div class="data-row">
        <span class="label">Toplam:</span>
        <span class="value" style="color: #10b981; font-size: 20px;">€${toplam_fiyat}</span>
      </div>
    </div>

    <center>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/dashboard" class="action-btn">
        Admin Panele Git →
      </a>
    </center>

    <p style="color: #64748b; text-align: center; margin-top: 32px; font-size: 12px;">
      Bu bir otomatik bildirimdir.
    </p>
  </div>
</body>
</html>
      `,
      text: `YENİ REZERVASYON #${id}\n\n${ad} ${soyad}\nEmail: ${email}\nTelefon: ${telefon}\nTarih: ${new Date(giris_tarihi).toLocaleDateString('tr-TR')} - ${new Date(cikis_tarihi).toLocaleDateString('tr-TR')}\nKişi: ${kisi_sayisi}\nToplam: €${toplam_fiyat}`
    }
  }
}
