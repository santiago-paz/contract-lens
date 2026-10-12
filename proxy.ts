import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

/** Set by the landing's EN / DE switch (components/landing/LanguageContext.tsx). */
const LANGUAGE_COOKIE = 'cl_lang'

/**
 * Whether the landing should open in German. The visitor's own pick wins; with
 * none, the first language of English or German in the browser's list decides,
 * highest quality first. Anything else (or no header at all, as with crawlers)
 * gets English.
 */
function prefersGerman(request: NextRequest): boolean {
  const picked = request.cookies.get(LANGUAGE_COOKIE)?.value
  if (picked === 'de') return true
  if (picked === 'en') return false

  const ranked = (request.headers.get('accept-language') ?? '')
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const quality = params.map((param) => param.trim()).find((param) => param.startsWith('q='))
      return { tag: tag.toLowerCase(), q: quality ? Number(quality.slice(2)) : 1 }
    })
    .filter(({ tag, q }) => tag && q > 0)
    .sort((a, b) => b.q - a.q)

  const first = ranked.find(({ tag }) => /^(de|en)(-|$)/.test(tag))
  return first ? first.tag.startsWith('de') : false
}

export async function proxy(request: NextRequest) {
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
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.avif') ||
    pathname.endsWith('.mp4') ||
    pathname.endsWith('.webm') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next()
  }

  // 1b. Allow file-based metadata routes — social crawlers fetch these
  // unauthenticated, so redirecting them to /login breaks link previews.
  if (
    pathname.startsWith('/opengraph-image') ||
    pathname.startsWith('/twitter-image') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest'
  ) {
    return NextResponse.next()
  }

  // 2. Allow Landing Page. `/` is English and `/de` is German. A visitor whose
  // browser prefers German, and who has not picked English, gets `/de` served
  // from `/`, so the address stays short and everyone else still sees English.
  if (pathname === '/') {
    const response = prefersGerman(request)
      ? NextResponse.rewrite(new URL('/de', request.url))
      : NextResponse.next()
    response.headers.append('Vary', 'Accept-Language, Cookie')
    return response
  }

  if (pathname === '/de') {
    return NextResponse.next()
  }

  // 3. Let /register answer for itself. Public sign-up is closed, so the page
  // serves the form to a live invitation link and a 404 to everyone else.
  if (pathname === '/register') {
    return NextResponse.next()
  }

  // 4. Handle the Login page
  if (pathname === '/login') {
    // If already logged in and no redirect param, go to dashboard
    if (session && !request.nextUrl.searchParams.has('redirect')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 5. Allow invite pages (public for accepting invitations)
  if (pathname.startsWith('/invite')) {
    return NextResponse.next()
  }

  // 6. Protect all other routes (Dashboard, etc.)
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 7. If authenticated but no organization, redirect to setup
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
