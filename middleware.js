import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Admin paneline erişim kontrolü
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session')

    if (!session) {
      // Giriş yapmamış, login sayfasına yönlendir
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Gerçek uygulamada session'ı database'den doğrulayın
    // const isValid = await validateSession(session.value)
    // if (!isValid) return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
