import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// DEMO: Gerçek uygulamada Supabase veya database kullanın
const ADMIN_USERS = [
  {
    email: 'admin@serenity.com',
    // SHA-256 hash of 'admin123'
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
  }
]

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt:', { email, passwordLength: password?.length })

    // Validasyon
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Kullanıcıyı kontrol et
    const user = ADMIN_USERS.find(u => u.email === email)
    
    console.log('User found:', !!user)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }

    // Şifreyi kontrol et
    const inputPasswordHash = hashPassword(password)
    
    console.log('Password hash match:', inputPasswordHash === user.passwordHash)
    console.log('Input hash:', inputPasswordHash)
    console.log('Expected hash:', user.passwordHash)
    
    if (inputPasswordHash !== user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }

    // Session token oluştur
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 gün

    // Cookie ayarla
    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      user: { email: user.email }
    })

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    })

    // Gerçek uygulamada sessionToken'ı database'e kaydedin
    // await supabase.from('admin_sessions').insert([{ token: sessionToken, email: user.email, expires_at: expiresAt }])

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
