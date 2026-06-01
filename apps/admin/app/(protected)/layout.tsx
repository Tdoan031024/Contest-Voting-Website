import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

function base64UrlToBuffer(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64');
}

function timingSafeEqual(a: Buffer, b: Buffer) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function verifySessionToken(token: string, secret: string) {
  const parts = token.split('.');
  if (parts.length < 3) return false;

  const signature = parts.pop();
  const expiresAt = parts.pop();
  const username = parts.join('.');
  if (!signature || !expiresAt) return false;
  const expiresAtNumber = Number(expiresAt);

  if (!username || !Number.isFinite(expiresAtNumber)) return false;
  if (expiresAtNumber * 1000 < Date.now()) return false;

  const payload = `${username}.${expiresAt}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  const actual = base64UrlToBuffer(signature);

  return timingSafeEqual(expected, actual);
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('admin_session')?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const isAuthenticated = !!(token && secret && verifySessionToken(token, secret));

  if (!isAuthenticated) {
    redirect('/login');
  }

  return children;
}
