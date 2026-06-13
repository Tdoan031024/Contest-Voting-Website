import { NextResponse } from 'next/server';
import crypto from 'crypto';
import os from 'os';
import http from 'http';
import https from 'https';

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

// Helper to make native HTTP/HTTPS requests with SSL ignore capability
function performRequest(
  urlStr: string,
  options: { method?: string; headers?: Record<string, string> },
  body?: string
): Promise<{ ok: boolean; status: number; data: any }> {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlStr);
      const isHttps = parsedUrl.protocol === 'https:';
      const reqModule = isHttps ? https : http;

      const reqOptions: any = {
        method: options.method || 'GET',
        headers: options.headers || {},
        rejectUnauthorized: false, // Force bypass SSL certificate validation for internal/direct IP calls
      };

      const req = reqModule.request(urlStr, reqOptions, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          let parsedData = null;
          try {
            parsedData = responseBody ? JSON.parse(responseBody) : null;
          } catch (e) {
            // responseBody might not be JSON, which is okay
          }
          resolve({
            ok: res.statusCode ? (res.statusCode >= 200 && res.statusCode < 300) : false,
            status: res.statusCode || 500,
            data: parsedData,
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (body) {
        req.write(body);
      }
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

// Fallback logic that tries multiple internal IP candidates to bypass server-side DNS resolution issues
async function fetchWithIpFallback(
  urlStr: string,
  options: { method?: string; headers?: Record<string, string> },
  body?: string
): Promise<{ ok: boolean; status: number; data: any }> {
  const parsedUrl = new URL(urlStr);
  const hostname = parsedUrl.hostname;

  // If the hostname is already an IP, localhost, or not matching production domain, execute directly
  if (hostname === 'localhost' || hostname === '127.0.0.1' || /^[0-9.]+$/.test(hostname)) {
    return performRequest(urlStr, options, body);
  }

  // Gather IP candidates for direct VirtualHost access
  const ipCandidates = new Set<string>();

  // 1. Fetch IPs of local non-loopback network interfaces
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const list = interfaces[name];
      if (list) {
        for (const net of list) {
          if (net.family === 'IPv4' && !net.internal) {
            ipCandidates.add(net.address);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error reading network interfaces:', err);
  }

  // 2. Add server's public IP address as a known fallback candidate
  ipCandidates.add('202.92.5.25');

  // 3. Add loopback address as a last-resort candidate
  ipCandidates.add('127.0.0.1');

  const candidatesList = Array.from(ipCandidates);
  let lastError: any = null;

  for (const ip of candidatesList) {
    // Keep original protocol (https or http), port, path, and search parameters
    const targetUrl = `${parsedUrl.protocol}//${ip}${parsedUrl.port ? `:${parsedUrl.port}` : ''}${parsedUrl.pathname}${parsedUrl.search}`;
    const fetchHeaders = {
      ...options.headers,
      Host: hostname, // Overwrite Host header so Apache routes to the correct virtual host
    };

    try {
      console.log(`[DNS Fallback] Trying to fetch from IP: ${ip} (${targetUrl})`);
      const result = await performRequest(targetUrl, { ...options, headers: fetchHeaders }, body);

      // If Apache returned a default 404 HTML document (VirtualHost mismatch), try the next candidate
      if (result.status === 404 && (!result.data || typeof result.data !== 'object')) {
        console.warn(`[DNS Fallback] IP ${ip} returned 404 HTML/text, trying next candidate`);
        continue;
      }

      console.log(`[DNS Fallback] Request succeeded using IP: ${ip} (Status: ${result.status})`);
      return result;
    } catch (err: any) {
      console.warn(`[DNS Fallback] Request failed for IP ${ip}: ${err.message || err}`);
      lastError = err;
      // Proceed to try the next candidate
    }
  }

  throw lastError || new Error('All IP candidates failed to connect');
}

export async function POST(request: Request) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'HuitMedia2026';

  const defaultApiUrl = `http://127.0.0.1:${process.env.API_PORT || '5000'}`;

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

  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let authResult;
  try {
    authResult = await fetchWithIpFallback(
      `${apiBaseUrl}/api/admin/login`,
      {
        method: 'POST',
        headers: fetchHeaders,
      },
      JSON.stringify({
        username: payload.username,
        password: payload.password,
      })
    );
  } catch (err: any) {
    console.error('Fetch error details:', err);
    const causeMessage = err.cause ? ` (Cause: ${err.cause.message || err.cause.code || err.cause})` : '';
    return NextResponse.json(
      { ok: false, message: `Không thể kết nối API (${apiBaseUrl}): ${err.message || err}${causeMessage}` },
      { status: 502 }
    );
  }

  const authData = authResult.data;
  if (!authResult.ok || !authData?.ok) {
    return NextResponse.json(
      { ok: false, message: authData?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.' },
      { status: authResult.status || 401 }
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

