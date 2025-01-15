import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('token')?.value

  if (currentUser && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/post-page', request.url))
  }
  if (currentUser && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/post-page', request.url))
  }

  if (!currentUser && request.nextUrl.pathname.startsWith('/post-page')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}