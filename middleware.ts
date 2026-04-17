import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('auth_session')?.value
  const session = cookie ? await decrypt(cookie) : null
  
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
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 4. Protect all other routes (Dashboard, etc.)
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 5. If authenticated but no organization, redirect to setup
  if (!session.orgId && !pathname.startsWith('/setup-organization')) {
    return NextResponse.redirect(new URL('/setup-organization', request.url))
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
