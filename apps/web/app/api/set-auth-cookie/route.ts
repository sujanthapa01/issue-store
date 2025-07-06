import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { access_token, refresh_token } = await req.json();

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  // Set HTTP-only cookies
  response.cookies.set('sb-access-token', access_token, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
  });

  response.cookies.set('sb-refresh-token', refresh_token, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
