import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('auth_session')?.value
  const { pathname } = request.nextUrl

  // 1. Allow public assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/screenshots-app') ||
    pathname.startsWith('/api') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next()
  }

  // 2. Allow Landing Page
  if (pathname === '/') {
    return NextResponse.next()
  }

  // 3. Handle Login Page
  if (pathname === '/login') {
    // If already logged in, redirect to dashboard
    if (currentUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 4. Protect all other routes (Dashboard, etc.)
  if (!currentUser) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
