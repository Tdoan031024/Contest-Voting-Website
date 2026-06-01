import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SESSION_PATH = '/admin';

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: SESSION_PATH,
    maxAge: 0,
  });

  return response;
}
