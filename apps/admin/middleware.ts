import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has('admin_session');
  const basePath = '/admin';
  const normalizedPath = pathname.startsWith(basePath) ? pathname.slice(basePath.length) || '/' : pathname;

  // Kiểm tra login page (Next.js với basePath có thể trả về /login hoặc /admin/login)
  const isLoginPage = normalizedPath === '/login' || normalizedPath.endsWith('/login');
  
  // Bỏ qua các file tĩnh quan trọng
  const isStatic = normalizedPath.includes('.') || 
                   normalizedPath.startsWith('/_next') || 
                   normalizedPath.startsWith('/static') ||
                   normalizedPath.startsWith('/api/');

  if (!isAuthenticated && !isLoginPage && !isStatic) {
    // Chuyển hướng tuyệt đối
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
