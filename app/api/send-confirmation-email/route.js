import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { ad, soyad, email, giris_tarihi, cikis_tarihi, kisi_sayisi, toplam_fiyat, durum, mesaj } = body;

    // Duruma göre email içeriği
    const isApproved = durum === 'onaylandı' || durum === 'onaylandi';
    const isCancelled = durum === 'iptal';
    const isCompleted = durum === 'tamamlandi' || durum === 'tamamlandı';
    
    let subject = '';
    let headerColor = '';
    let headerBg = '';
    let statusBg = '';
    let statusBorder = '';
    let statusTitle = '';
    let statusText = '';
    
    if (isCompleted) {
      subject = '⭐ Teşekkürler! - Serenity İskele';
      headerBg = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      headerColor = 'white';
      statusBg = '#f5f3ff';
      statusBorder = '#8b5cf6';
      statusTitle = '🙏 Bizi Tercih Ettiğiniz İçin Teşekkürler!';
      statusText = 'Konaklamanız tamamlandı. Sizlerle tanışmak bizim için keyifliydi!';
    } else if (isApproved) {
      subject = '✅ Rezervasyonunuz Onaylandı - Serenity İskele';
      headerBg = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      headerColor = 'white';
      statusBg = '#ecfdf5';
      statusBorder = '#10b981';
      statusTitle = '🎉 Rezervasyonunuz Onaylandı!';
      statusText = 'Rezervasyonunuz başarıyla onaylanmıştır. Sizi ağırlamak için sabırsızlanıyoruz!';
    } else {
      subject = '❌ Rezervasyon Talebi Hakkında - Serenity İskele';
      headerBg = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      headerColor = 'white';
      statusBg = '#fee2e2';
      statusBorder = '#ef4444';
      statusTitle = '😔 Rezervasyon İptal Edildi';
      statusText = mesaj || 'Rezervasyonunuz maalesef iptal edilmiştir.';
    }

    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6; 
      color: #1f2937; 
      background: #f3f4f6;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header { 
      background: ${headerBg}; 
      color: ${headerColor}; 
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .content { 
      padding: 40px 30px;
    }
    .status-banner {
      background: ${statusBg};
      border-left: 4px solid ${statusBorder};
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .status-banner h2 {
      color: #1f2937;
      font-size: 20px;
      margin-bottom: 10px;
    }
    .status-banner p {
      color: #4b5563;
      font-size: 15px;
    }
    .info-card { 
      background: #f9fafb; 
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;
      border-left: 4px solid #0891b2;
    }
    .info-label { 
      font-weight: 600; 
      color: #0891b2;
      font-size: 13px;
      display: block;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-value { 
      color: #1f2937;
      font-size: 16px;
      font-weight: 500;
    }
    .price-box {
      background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      margin: 20px 0;
    }
    .price-value {
      font-size: 36px;
      font-weight: 700;
      margin-top: 10px;
    }
    .message-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      border-radius: 12px;
      margin-top: 20px;
    }
    .instructions {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      border-radius: 12px;
      margin-top: 20px;
    }
    .instructions h3 {
      color: #1e40af;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .instructions ul {
      color: #1e3a8a;
      margin-left: 20px;
    }
    .instructions li {
      margin-bottom: 8px;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .contact-info {
      background: #f0fdf4;
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 20px;
      margin-top: 20px;
      text-align: center;
    }
    a { color: #0891b2; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>${isCompleted ? '⭐ Teşekkürler!' : isApproved ? '✅ Rezervasyonunuz Onaylandı!' : '❌ Rezervasyon İptal'}</h1>
      <p style="font-size: 16px; opacity: 0.95;">Serenity İskele - White Residence</p>
    </div>
    
    <div class="content">
      <div class="status-banner">
        <h2>${statusTitle}</h2>
        <p>${isCompleted 
          ? `Sayın ${ad} ${soyad}, konaklamanız tamamlandı. Bizi tercih ettiğiniz ve bu güzel anıları bizimle paylaştığınız için teşekkür ederiz!`
          : isApproved
          ? `Sayın ${ad} ${soyad}, rezervasyon talebiniz onaylanmıştır. Sizi aramızda görmekten mutluluk duyacağız!`
          : `Sayın ${ad} ${soyad}, rezervasyonunuz iptal edilmiştir. ${mesaj || ''}`
        }</p>
      </div>
      
      <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 20px;">Rezervasyon Detayları</h3>
      
      <div class="info-card">
        <span class="info-label">📅 Giriş Tarihi</span>
        <div class="info-value">${new Date(giris_tarihi).toLocaleDateString('tr-TR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
      </div>
      
      <div class="info-card">
        <span class="info-label">📅 Çıkış Tarihi</span>
        <div class="info-value">${new Date(cikis_tarihi).toLocaleDateString('tr-TR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
      </div>
      
      <div class="info-card">
        <span class="info-label">👥 Misafir Sayısı</span>
        <div class="info-value">${kisi_sayisi} Kişi</div>
      </div>
      
      <div class="price-box">
        <div style="font-size: 16px; opacity: 0.95;">Toplam Tutar</div>
        <div class="price-value">$${toplam_fiyat}</div>
      </div>
      
      ${isCompleted ? `
        <div class="instructions" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e;">⭐ Deneyiminizi Paylaşın!</h3>
          <p style="color: #78350f; margin-top: 10px;">
            Konaklamanız hakkında görüşlerinizi duymak bizim için çok değerli. Lütfen web sitemizi ziyaret ederek 
            yorumunuzu bırakın ve gelecek misafirlerimize yardımcı olun!
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="http://localhost:3000" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
              color: white; padding: 12px 30px; border-radius: 8px; font-weight: 600; text-decoration: none;">
              Yorum Yap
            </a>
          </div>
        </div>
      ` : isApproved ? `
        <div class="instructions">
          <h3>📋 Giriş Bilgilendirmesi</h3>
          <ul>
            <li><strong>Check-in:</strong> 14:00 (Erken giriş için lütfen önceden bilgi verin)</li>
            <li><strong>Check-out:</strong> 12:00</li>
            <li><strong>Adres:</strong> White Residence, İskele, Kuzey Kıbrıs</li>
            <li><strong>Ödeme:</strong> Nakit veya banka transferi ile giriş sırasında</li>
          </ul>
        </div>
        
        <div class="message-box">
          <span class="info-label" style="color: #92400e;">⚠️ Önemli Hatırlatma</span>
          <div style="color: #78350f; margin-top: 10px;">
            Lütfen gelişinizden <strong>1 gün önce</strong> bize ulaşarak giriş saatinizi teyit ediniz.
          </div>
        </div>
      ` : `
        <div class="message-box">
          <span class="info-label" style="color: #92400e;">💡 Alternatif Tarihler</span>
          <div style="color: #78350f; margin-top: 10px;">
            Farklı tarihler için bizimle iletişime geçebilirsiniz. Size en uygun seçenekleri sunmaktan mutluluk duyarız.
          </div>
        </div>
      `}
      
      <div class="contact-info">
        <h3 style="color: #065f46; margin-bottom: 15px;">📞 İletişim</h3>
        <p style="color: #047857; margin-bottom: 10px;">
          <strong>WhatsApp:</strong> <a href="https://wa.me/905331234567" style="color: #059669;">+90 533 123 45 67</a>
        </p>
        <p style="color: #047857;">
          <strong>Email:</strong> <a href="mailto:dilekamir@gmail.com" style="color: #059669;">info@serenityiskele.com</a>
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p style="font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
        Serenity İskele - White Residence
      </p>
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">
        İskele, Kuzey Kıbrıs
      </p>
      <p style="font-size: 13px; color: #9ca3af;">
        Bu e-posta rezervasyon durumunuz hakkında bilgilendirme amaçlıdır.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const data = await resend.emails.send({
      from: 'Serenity İskele <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: emailHTML
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}