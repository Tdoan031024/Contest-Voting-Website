import { NextResponse } from 'next/server';
import crypto from 'crypto';

type LoginPayload = {
  username?: string;
  password?: string;
  rememberMe?: boolean;
};

const SESSION_COOKIE = 'admin_session';
const SESSION_PATH = '/admin';
const DEFAULT_SESSION_SECONDS = 60 * 60 * 8;
const REMEMBER_SESSION_SECONDS = 60 * 60 * 24 * 30;

function toBase64Url(value: Buffer) {
  return value
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}


function createSessionToken(username: string, expiresAt: number, secret: string) {
  const payload = `${username}.${expiresAt}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest();
  return `${payload}.${toBase64Url(signature)}`;
}

export async function POST(request: Request) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'HuitMedia2026';

  const host = request.headers.get('host') || 'localhost:3001';
  const defaultApiUrl = host.includes('huitmedia.edu.vn')
    ? 'https://startup.huitmedia.edu.vn'
    : 'http://localhost:5000';

  const apiBaseUrl =
    process.env.ADMIN_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    defaultApiUrl;

  const payload = (await request.json().catch(() => null)) as LoginPayload | null;

  if (!payload?.username || !payload?.password) {
    return NextResponse.json(
      { ok: false, message: 'Vui lòng nhập đầy đủ thông tin đăng nhập.' },
      { status: 400 }
    );
  }

  let authResponse;
  try {
    authResponse = await fetch(`${apiBaseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    });
  } catch (err: any) {
    console.error('Fetch error details:', err);
    return NextResponse.json(
      { ok: false, message: `Không thể kết nối API (${apiBaseUrl}): ${err.message || err}` },
      { status: 502 }
    );
  }

  const authData = await authResponse.json().catch(() => null);
  if (!authResponse.ok || !authData?.ok) {
    return NextResponse.json(
      { ok: false, message: authData?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.' },
      { status: authResponse.status || 401 }
    );
  }

  const adminUsername = authData?.admin?.username || payload.username;

  const rememberMe = payload.rememberMe === true;
  const sessionSeconds = rememberMe ? REMEMBER_SESSION_SECONDS : DEFAULT_SESSION_SECONDS;
  const expiresAt = Math.floor(Date.now() / 1000) + sessionSeconds;
  const token = createSessionToken(adminUsername, expiresAt, sessionSecret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: SESSION_PATH,
    maxAge: rememberMe ? sessionSeconds : undefined,
  });

  return response;
}
