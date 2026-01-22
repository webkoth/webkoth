import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ru']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If pathname is root, redirect to default locale
  if (pathname === '/') {
    // Try to detect locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language')
    let detectedLocale = defaultLocale

    if (acceptLanguage) {
      // Simple detection: check if Russian is preferred
      if (acceptLanguage.includes('ru')) {
        detectedLocale = 'ru'
      }
    }

    return NextResponse.redirect(
      new URL(`/${detectedLocale}`, request.url)
    )
  }

  // If pathname doesn't have a locale, redirect to default locale
  if (!pathnameHasLocale) {
    // Don't redirect API routes, _next, or static files
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    )
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
     * - images (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)',
  ],
}
