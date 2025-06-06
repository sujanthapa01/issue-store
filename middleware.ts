import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value
  const url = req.nextUrl.clone()
  const pathname = url.pathname

  const isAuthPage = pathname === '/auth'
  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/main')


  // Redirect unauthenticated users trying to access protected routes
  if (!token && isProtectedRoute) {
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from the auth page
  if (token && isAuthPage) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/main/:path*', '/auth'],
}
