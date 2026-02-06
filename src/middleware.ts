import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin panel and API routes - require admin token
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Skip login page and login API
    if (pathname === '/admin' || pathname === '/admin/login' || pathname === '/api/admin/auth/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('token')?.value
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Mudur panel and API routes - require mudur token
  if (pathname.startsWith('/mudur') || pathname.startsWith('/api/mudur')) {
    // Skip login page and login API
    if (pathname === '/mudur' || pathname === '/mudur/login' || pathname === '/api/mudur/auth/login') {
      return NextResponse.next()
    }

    const mudurToken = request.cookies.get('mudur_token')?.value
    if (!mudurToken) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/mudur', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/mudur/:path*',
    '/api/admin/:path*',
    '/api/mudur/:path*',
  ],
}
