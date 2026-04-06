import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['fr', 'gb', 'de', 'pl', 'us']
const defaultLocale = 'us'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's an asset or API call that escaped the matcher
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  // For now we always use the defaultLocale 'us' as the prefix if none is provided
  // In a more advanced setup, we would detect the user's preferred language from the 'accept-language' header
  const url = new URL(`/${defaultLocale}${pathname === '/' ? '' : pathname}`, request.url)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static assets
    '/((?!api|_next/static|_next/image|favicon.ico|admin|images|icon.webp|robots.txt).*)',
  ],
}
