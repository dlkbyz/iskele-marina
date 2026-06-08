import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Geliştirme modunda auth check'i atla (login takılması yaşanmaması için)
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // Production: admin sayfaları için cookie kontrolü
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session')

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
