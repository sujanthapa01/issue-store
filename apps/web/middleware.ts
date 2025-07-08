import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value;
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const isAuthPage = pathname === '/auth';
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/main') ||
    pathname.startsWith('/profile');

  if (!token && isProtectedRoute) {
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/main/:path*', '/auth'],
};
