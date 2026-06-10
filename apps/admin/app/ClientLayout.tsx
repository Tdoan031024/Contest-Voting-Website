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
      { href: '/users', label: 'Quản lý người dùng', icon: usersIcon },
      { href: '/sponsors', label: 'Nhà tài trợ', icon: sponsorsIcon },
    ],
  },
  {
    title: 'Quản lý giao diện',
    items: [
      { href: '/banners', label: 'Banner quảng cáo', icon: bannerIcon },
      { href: '/introduction', label: 'Thông tin cuộc thi', icon: introIcon },
      { href: '/timeline', label: 'Thời gian cuộc thi', icon: timelineIcon },
      { href: '/guides', label: 'Thông tin Hướng dẫn', icon: guidesIcon },
    ],
  },
  {
    title: 'Cài đặt',
    items: [
      { href: '/settings', label: 'Cấu hình hệ thống', icon: settingsIcon },
    ],
  },
];

const navItems = navGroups.flatMap((group) => group.items);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = React.useState(280);
  const [isResizing, setIsResizing] = React.useState(false);

  React.useEffect(() => {
    const savedWidth = localStorage.getItem('admin_sidebar_width');
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth, 10));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Xóa cookie xác thực
      document.cookie = "HUIT_AUTH_V1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Có thể gọi thêm API logout nếu cần
      await fetch('/admin/api/admin/logout', { method: 'POST' }).catch(() => null);
    } catch (error) {
      console.error(error);
    } finally {
      window.location.href = '/admin/login';
    }
  };

  // Helper function to check if active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
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
    if (isResizing) {
      let newWidth = mouseMoveEvent.clientX;
      if (newWidth < 140) {
        newWidth = 80;
      } else {
        if (newWidth < 200) {
          newWidth = 200;
        }
        if (newWidth > 450) {
          newWidth = 450;
        }
      }
      setSidebarWidth(newWidth);
      localStorage.setItem('admin_sidebar_width', newWidth.toString());
    }
  }, [isResizing]);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const isCollapsed = sidebarWidth <= 120;

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[#f5f7fa] ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
      {/* Sidebar - macOS Styled */}
      <aside 
        style={{ width: `${sidebarWidth}px` }}
        className={`relative hidden h-screen shrink-0 border-r border-slate-200/60 bg-white/80 backdrop-blur-xl lg:flex lg:flex-col shadow-[1px_0_0_rgba(0,0,0,0.01)] ${
          isResizing ? '' : 'transition-[width] duration-200 ease-in-out'
        }`}
      >
        
        {/* Brand header */}
        <div className={`shrink-0 border-b border-slate-100/60 transition-all duration-200 ${
          isCollapsed ? 'px-0 py-6 flex justify-center' : 'px-6 py-6'
        }`}>
          <Link href="/" className={`flex items-center gap-3 select-none active:scale-[0.98] transition-transform duration-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
              <img src="/admin/uploads/logo-startup.png" alt="Logo" className="h-full w-full object-contain p-1" />
            </div>
            {!isCollapsed && (
              <span className="transition-opacity duration-200 animate-in fade-in">
                <span className="block text-[13px] font-semibold text-slate-800 tracking-wide font-heading leading-tight whitespace-nowrap">HUIT STARTUP</span>
                <span className="block text-[10px] font-medium text-slate-400 mt-0.5 leading-none whitespace-nowrap">Hệ thống quản trị</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation list */}
        <nav className={`min-h-0 flex-1 space-y-6 overflow-y-auto py-5 select-none transition-all duration-200 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              {!isCollapsed && (
                <p className="px-4 text-[10px] font-medium uppercase tracking-wider text-slate-400 font-heading pb-1 truncate animate-in fade-in">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center rounded-xl transition-all duration-200 ${
                        isCollapsed ? 'justify-center p-2.5 mx-1' : 'gap-3 px-4 py-2 mx-2'
                      } text-xs ${
                        active
                           ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-semibold border border-[var(--primary)]/5 shadow-sm'
                           : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[var(--primary)]'
                       }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={`transition-colors duration-200 flex items-center justify-center shrink-0 ${active ? 'text-[var(--primary)]' : 'text-slate-400 group-hover:text-[var(--primary)]'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate animate-in fade-in">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Account Section */}
        <div className={`shrink-0 transition-all duration-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div className={`group relative rounded-2xl border border-slate-100 bg-slate-50/50 transition-all duration-300 hover:bg-white hover:shadow-md ${
            isCollapsed ? 'p-2 flex flex-col items-center justify-center' : 'p-4'
          }`}>
            {!isCollapsed && (
              <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400 font-heading animate-in fade-in">Tài khoản quản trị</p>
            )}
            
            <div className={`mt-2 flex items-center justify-between gap-3 ${isCollapsed ? 'mt-0 justify-center w-full' : ''}`}>
              {isCollapsed ? (
                <div className="relative h-8 w-8 select-none">
                  <div className="absolute inset-0 overflow-hidden rounded-full border border-slate-200 bg-white flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
                    <img src="/admin/uploads/logo-startup.png" alt="AD" className="h-full w-full object-contain p-0.5" />
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 grid place-items-center rounded-full text-red-500 hover:bg-red-50 transition-all duration-200"
                    title="Đăng xuất"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0">
                      <img src="/admin/uploads/logo-startup.png" alt="AD" className="h-full w-full object-contain p-0.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-slate-700 font-heading">Administrator</span>
                      <span className="block text-[9px] font-medium text-slate-400 mt-0.5">Quản trị viên</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0"
                    title="Đăng xuất"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-slate-300/50 active:bg-slate-400/80 transition-colors z-30 select-none ${
            isResizing ? 'bg-slate-400/80' : ''
          }`}
        />
      </aside>

      {/* Main Panel */}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        
        {/* Top Header - macOS styled toolbar */}
        <header className="z-20 shrink-0 border-b border-slate-200/50 bg-white/80 px-6 py-4 backdrop-blur-md flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm select-none">
          <div className="space-y-1">
            <h1 className="text-sm md:text-base font-black tracking-wide font-heading leading-tight">
              <span className="typewriter-title">Hệ thống quản lý bình chọn HUIT STARTUP</span>
            </h1>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500">
              Quản trị nội dung, cấu hình và dữ liệu bình chọn
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link 
              href={SITE_URL} 
              target="_blank" 
              className="rounded-xl border border-slate-200/60 bg-white px-4 py-2 text-[11px] font-bold text-[var(--text-primary)] shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] active:scale-[0.98]"
            >
              Xem trang chủ
            </Link>
          </div>

          {/* Mobile navigation row (scrollable horizontally) */}
          <nav className="flex gap-1.5 overflow-x-auto lg:hidden w-full pb-1 mt-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition border shadow-sm ${
                    active 
                      ? 'bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--primary)]/20' 
                      : 'bg-white text-[#64748B] border-slate-200/60 hover:bg-slate-50'
                  }`}
                >
                  <span className="h-3.5 w-3.5 flex items-center justify-center">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Content viewport wrapper */}
        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1280px] animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
