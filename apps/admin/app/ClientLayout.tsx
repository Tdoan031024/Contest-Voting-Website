'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const dashboardIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

const candidatesIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const usersIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 11h-6" />
    <path d="M19 8v6" />
  </svg>
);

const sponsorsIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 14 9 5 9-5" />
    <path d="m3 11 9 5 9-5" />
  </svg>
);

const bannerIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8" cy="10" r="1.5" />
    <path d="m21 15-5-5L5 19" />
  </svg>
);

const timelineIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v5l3 2" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const settingsIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

const introIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const guidesIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const navGroups = [
  {
    title: 'Quản lý',
    items: [
      { href: '/', label: 'Tổng quan', icon: dashboardIcon },
      { href: '/candidates', label: 'Dự án', icon: candidatesIcon },
      { href: '/users', label: 'Người dùng', icon: usersIcon },
      { href: '/sponsors', label: 'Nhà tài trợ', icon: sponsorsIcon },
      { href: '/news', label: 'Tin tức', icon: introIcon },
    ],
  },
  {
    title: 'Nội dung',
    items: [
      { href: '/banners', label: 'Banner', icon: bannerIcon },
      { href: '/introduction', label: 'Thông tin cuộc thi', icon: introIcon },
      { href: '/timeline', label: 'Mốc thời gian', icon: timelineIcon },
      { href: '/guides', label: 'Hướng dẫn', icon: guidesIcon },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { href: '/settings', label: 'Cấu hình', icon: settingsIcon },
    ],
  },
];

const navItems = navGroups.flatMap((group) => group.items);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Tổng quan', description: 'Theo dõi trạng thái nền tảng và dữ liệu vận hành.' },
  '/candidates': { title: 'Dự án', description: 'Quản lý danh sách dự án, điểm bình chọn và hồ sơ hiển thị.' },
  '/users': { title: 'Người dùng', description: 'Kiểm soát tài khoản và phân quyền truy cập hệ thống.' },
  '/sponsors': { title: 'Nhà tài trợ', description: 'Cập nhật đối tác đồng hành và tài nguyên thương hiệu.' },
  '/news': { title: 'Tin tức', description: 'Quản trị nội dung cập nhật và thông báo quan trọng.' },
  '/banners': { title: 'Banner', description: 'Điều chỉnh hình ảnh chiến dịch và điểm chạm chính.' },
  '/introduction': { title: 'Thông tin cuộc thi', description: 'Quản lý phần giới thiệu và nội dung landing page.' },
  '/timeline': { title: 'Mốc thời gian', description: 'Cập nhật lịch trình và trạng thái các vòng thi.' },
  '/guides': { title: 'Hướng dẫn', description: 'Tối ưu tài liệu hướng dẫn và thể lệ bình chọn.' },
  '/settings': { title: 'Cấu hình', description: 'Thiết lập hệ thống, promotion và trạng thái hoạt động.' },
};

function getPageMeta(pathname: string) {
  const matched = Object.keys(pageMeta)
    .filter((key) => key === '/' ? pathname === '/' : pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  return pageMeta[matched || '/'];
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentMeta = getPageMeta(pathname);
  const [sidebarWidth, setSidebarWidth] = React.useState(292);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const savedWidth = localStorage.getItem('admin_sidebar_width');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth, 10));
    const savedCollapsed = localStorage.getItem('admin_sidebar_collapsed');
    if (savedCollapsed) setIsSidebarCollapsed(savedCollapsed === 'true');
  }, []);

  const toggleSidebar = () => {
    const nextState = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextState);
    localStorage.setItem('admin_sidebar_collapsed', String(nextState));
  };

  const handleLogout = async () => {
    try {
      document.cookie = 'HUIT_AUTH_V1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      await fetch('/admin/api/admin/logout', { method: 'POST' }).catch(() => null);
    } catch (error) {
      console.error(error);
    } finally {
      window.location.href = '/admin/login';
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback((mouseMoveEvent: MouseEvent) => {
    if (!isResizing) return;
    let newWidth = mouseMoveEvent.clientX;
    if (newWidth < 148) {
      newWidth = 88;
    } else {
      if (newWidth < 228) newWidth = 228;
      if (newWidth > 420) newWidth = 420;
    }
    setSidebarWidth(newWidth);
    localStorage.setItem('admin_sidebar_width', newWidth.toString());
  }, [isResizing]);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const isCollapsed = isSidebarCollapsed || sidebarWidth <= 120;

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-transparent ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
      <aside
        style={{ width: isCollapsed ? '88px' : `${sidebarWidth}px` }}
        className={`admin-shell-surface relative hidden h-screen shrink-0 overflow-hidden border-r border-white/70 lg:flex lg:flex-col ${isResizing ? '' : 'transition-[width] duration-300 ease-out'}`}
      >
        <div className={`border-b border-slate-200/60 ${isCollapsed ? 'px-3 py-5' : 'px-5 py-5'}`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3' : 'justify-between gap-4'}`}>
            <Link href="/" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <img src="/admin/uploads/logo-startup.png" alt="HUIT Startup" className="h-full w-full object-contain p-1.5" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-extrabold text-slate-900">HUIT STARTUP</p>
                  <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">Dashboard quản trị bình chọn</p>
                </div>
              )}
            </Link>

            <button
              onClick={toggleSidebar}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isCollapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
              </svg>
            </button>
          </div>
        </div>

        <div className="px-3 py-4">
          <div className={`rounded-2xl border border-slate-200/80 bg-[linear-gradient(135deg,rgba(21,101,216,0.08),rgba(255,255,255,0.9))] ${isCollapsed ? 'px-2 py-3 text-center' : 'px-4 py-4'}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary-strong)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </div>
            {!isCollapsed && (
              <>
                <p className="mt-3 text-sm font-extrabold text-slate-900">Nền tảng đang sẵn sàng vận hành</p>
                <p className="mt-1 text-[12px] font-medium leading-5 text-slate-500">
                  Quản lý dự án, nội dung, promotion và trạng thái mở cổng từ một nơi.
                </p>
              </>
            )}
          </div>
        </div>

        <nav className={`min-h-0 flex-1 space-y-6 overflow-y-auto pb-5 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navGroups.map((group) => (
            <section key={group.title} className="space-y-2">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={`group flex items-center rounded-2xl border transition-all duration-200 ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'} ${active
                        ? 'border-[rgba(21,101,216,0.14)] bg-[linear-gradient(135deg,rgba(21,101,216,0.12),rgba(255,255,255,0.94))] text-[var(--primary-strong)] shadow-[0_10px_28px_rgba(21,101,216,0.12)]'
                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900'
                        }`}
                    >
                      <span className={`flex shrink-0 items-center justify-center ${active ? 'text-[var(--primary)]' : 'text-slate-400 group-hover:text-slate-700'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="truncate text-[13px] font-bold tracking-[-0.01em]">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-200/60`}>
          <div className={`rounded-2xl border border-slate-200 bg-white/90 shadow-sm ${isCollapsed ? 'p-2' : 'p-3.5'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img src="/admin/uploads/logo-startup.png" alt="Administrator" className="h-full w-full object-contain p-1" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-extrabold text-slate-900">Administrator</p>
                    <p className="truncate text-[11px] font-medium text-slate-500">Quản trị viên hệ thống</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  Đăng xuất
                </button>
              )}
            </div>
            {isCollapsed && (
              <button
                onClick={handleLogout}
                className="mt-2 grid h-9 w-full place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            className={`absolute right-0 top-0 z-30 h-full w-1 cursor-col-resize transition-colors ${isResizing ? 'bg-[var(--primary)]/50' : 'hover:bg-slate-300/70'}`}
          />
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-[rgba(248,251,255,0.72)] px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  Admin workspace
                </div>
                <h1 className="text-[28px] font-extrabold leading-tight text-slate-950">{currentMeta.title}</h1>
                <p className="mt-1 text-sm font-medium text-slate-500">{currentMeta.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white/88 px-4 py-3 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Hệ thống</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">Bình chọn HUIT Startup</p>
                </div>
                <Link
                  href={SITE_URL}
                  target="_blank"
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-[12px] font-extrabold text-slate-700 shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary-strong)]"
                >
                  Xem trang chủ
                </Link>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-bold shadow-sm transition ${active
                      ? 'border-[rgba(21,101,216,0.16)] bg-[var(--primary-soft)] text-[var(--primary-strong)]'
                      : 'border-slate-200 bg-white text-slate-600'
                      }`}
                  >
                    <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1380px] space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
