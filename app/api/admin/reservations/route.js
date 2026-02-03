import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, checkIn, checkOut, guests } = body;

    // Email gönder
    const data = await resend.emails.send({
      from: 'Serenity İskele <onboarding@resend.dev>',
      to: 'your-email@example.com', // KENDİ MAİLİNİ YAZ
      replyTo: email,
      subject: `🏖️ Yeni Rezervasyon Talebi - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6; 
              color: #333; 
              background: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); 
              color: white; 
              padding: 30px 20px;
              text-align: center;
            }
            .header h2 {
              margin: 0;
              font-size: 24px;
            }
            .content { 
              padding: 30px 20px;
            }
            .info-row { 
              margin: 15px 0; 
              padding: 15px; 
              background: #f9fafb; 
              border-radius: 8px;
              border-left: 4px solid #0891b2;
            }
            .label { 
              font-weight: 600; 
              color: #0891b2;
              display: block;
              margin-bottom: 5px;
            }
            .value { 
              color: #333;
              font-size: 15px;
            }
            .message-box {
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              margin-top: 20px;
              border-left: 4px solid #0891b2;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🏖️ Serenity İskele - Yeni Rezervasyon Talebi</h2>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">👤 Misafir Adı</span>
                <span class="value">${name}</span>
              </div>
              <div class="info-row">
                <span class="label">📧 Email</span>
                <span class="value"><a href="mailto:${email}">${email}</a></span>
              </div>
              <div class="info-row">
                <span class="label">📱 Telefon</span>
                <span class="value"><a href="tel:${phone}">${phone}</a></span>
              </div>
              <div class="info-row">
                <span class="label">📅 Check-in Tarihi</span>
                <span class="value">${new Date(checkIn).toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div class="info-row">
                <span class="label">📅 Check-out Tarihi</span>
                <span class="value">${new Date(checkOut).toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div class="info-row">
                <span class="label">👥 Misafir Sayısı</span>
                <span class="value">${guests} kişi</span>
              </div>
              
              ${message ? `
                <div class="message-box">
                  <span class="label">💬 Misafir Mesajı</span>
                  <div class="value" style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Bu mail otomatik olarak rezervasyon formundan gönderilmiştir.</p>
              <p><strong>Serenity İskele</strong> | İskele, Kuzey Kıbrıs</p>
            </div>
          </div>
        </body>
        </html>
      `
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