'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiUrl } from './api';

const dashboardIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

const candidatesIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const usersIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 11h-6" />
    <path d="M19 8v6" />
  </svg>
);

const sponsorsIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 14 9 5 9-5" />
    <path d="m3 11 9 5 9-5" />
  </svg>
);

const newsIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
    <path d="M4 4h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" />
    <path d="M8 8h8" />
    <path d="M8 12h8" />
  </svg>
);

const votesIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const bannerIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8" cy="10" r="1.5" />
    <path d="m21 15-5-5L5 19" />
  </svg>
);

const introIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const timelineIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v5l3 2" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const settingsIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

const guidesIcon = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      { href: '/votes', label: 'Lịch sử các lượt vote', icon: votesIcon },
      { href: '/users', label: 'Người dùng', icon: usersIcon },
      { href: '/sponsors', label: 'Nhà tài trợ', icon: sponsorsIcon },
      { href: '/news', label: 'Tin tức', icon: newsIcon },
    ],
  },
  {
    title: 'Nội dung',
    items: [
      { href: '/banners', label: 'Banner', icon: bannerIcon },
      { href: '/introduction', label: 'Thông tin cuộc thi', icon: introIcon },
      { href: '/timeline', label: 'Mốc thời gian', icon: timelineIcon },
      { href: '/guides', label: 'Hướng dẫn', icon: guidesIcon },
      { href: '/settings', label: 'Cài đặt', icon: settingsIcon },
    ],
  },
];

const navItems = navGroups.flatMap((group) => group.items);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Tổng quan', description: 'Theo dõi trạng thái nền tảng và dữ liệu vận hành.' },
  '/candidates': { title: 'Dự án', description: 'Quản lý danh sách dự án, điểm bình chọn và hồ sơ hiển thị.' },
  '/votes': { title: 'Lịch sử bình chọn', description: 'Theo dõi nhật ký phiếu bầu chi tiết và xuất dữ liệu đối soát.' },
  '/users': { title: 'Người dùng', description: 'Kiểm soát tài khoản và phân quyền truy cập hệ thống.' },
  '/sponsors': { title: 'Nhà tài trợ', description: 'Cập nhật đối tác đồng hành và tài nguyên thương hiệu.' },
  '/news': { title: 'Tin tức', description: 'Quản trị nội dung cập nhật và thông báo quan trọng.' },
  '/banners': { title: 'Banner', description: 'Điều chỉnh hình ảnh chiến dịch và điểm chạm chính.' },
  '/introduction': { title: 'Thông tin cuộc thi', description: 'Quản lý phần giới thiệu và nội dung landing page.' },
  '/timeline': { title: 'Mốc thời gian', description: 'Cập nhật lịch trình và trạng thái các vòng thi.' },
  '/guides': { title: 'Hướng dẫn', description: 'Cấu hình nội dung hướng dẫn bình chọn và bảng quy đổi điểm.' },
  '/settings': { title: 'Cài đặt', description: 'Thiết lập hệ thống, promotion và trạng thái hoạt động.' },
};

function getPageMeta(pathname: string) {
  const matched = Object.keys(pageMeta)
    .filter((key) => (key === '/' ? pathname === '/' : pathname.startsWith(key)))
    .sort((a, b) => b.length - a.length)[0];
  return pageMeta[matched || '/'];
}

function BellButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<any>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/admin/settings'));
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
    const interval = setInterval(loadSettings, 30000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alerts: Array<{ id: string; type: 'info' | 'warning' | 'success'; message: string }> = [];

  if (settings) {
    if (settings.isGateOpen) {
      alerts.push({
        id: 'gate-open',
        type: 'success',
        message: 'Cổng bình chọn đang mở và cho phép bỏ phiếu.',
      });
    } else {
      alerts.push({
        id: 'gate-closed',
        type: 'warning',
        message: 'Cổng bình chọn đang đóng. Vui lòng mở cổng để người dùng vote.',
      });
    }

    if (settings.isRegistrationOpen) {
      const deadlineStr = (() => {
        if (!settings.registrationDeadline) return 'Chưa cài đặt';
        let val = settings.registrationDeadline.trim();
        if (!val.includes('Z') && !/\+\d{2}:?\d{2}$/.test(val) && !/-\d{2}:?\d{2}$/.test(val)) val = `${val}+07:00`;
        const d = new Date(val);
        try {
          const parts = Object.fromEntries(
            new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Ho_Chi_Minh',
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit', hour12: false,
            }).formatToParts(d).map((p) => [p.type, p.value])
          );
          return `${parts.hour}:${parts.minute} ngày ${parts.day}/${parts.month}/${parts.year}`;
        } catch { return val; }
      })();
      alerts.push({
        id: 'reg-open',
        type: 'info',
        message: `Đang nhận hồ sơ đăng ký dự án. Hạn chót: ${deadlineStr}.`,
      });
    } else {
      alerts.push({
        id: 'reg-closed',
        type: 'warning',
        message: 'Hạn nhận hồ sơ đăng ký dự án đã kết thúc.',
      });
    }

    const now = Date.now();
    const activePromo = Array.isArray(settings.votingPromotions)
      ? settings.votingPromotions.find((p: any) => {
          if (!p.isEnabled) return false;
          const start = new Date(p.startAt).getTime();
          const end = new Date(p.endAt).getTime();
          return start <= now && end >= now;
        })
      : null;

    if (activePromo) {
      alerts.push({
        id: 'promo-active',
        type: 'success',
        message: `Đang diễn ra sự kiện nhân điểm (Hệ số x${activePromo.multiplier}).`,
      });
    }
  }

  const badgeCount = alerts.filter(a => a.type === 'warning').length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative grid h-10 w-10 place-items-center rounded-[14px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary-strong)] ${isOpen ? 'border-[var(--primary)] bg-slate-50' : ''}`}
        aria-label="Thông báo"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
        {badgeCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white leading-none">
            {badgeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[320px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-slate-100 px-3 py-2">
            <h3 className="text-xs font-bold text-slate-900">Trạng thái hệ thống</h3>
          </div>
          <div className="mt-1 max-h-[280px] overflow-y-auto space-y-1">
            {alerts.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-slate-400">
                Đang tải dữ liệu cấu hình...
              </div>
            ) : (
              alerts.map((alert) => {
                let iconColor = 'bg-blue-500';
                let iconSvg = (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                );

                if (alert.type === 'success') {
                  iconColor = 'bg-emerald-500';
                  iconSvg = (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  );
                } else if (alert.type === 'warning') {
                  iconColor = 'bg-amber-500';
                  iconSvg = (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  );
                }

                return (
                  <div key={alert.id} className="flex gap-2.5 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${iconColor}`}>
                      {iconSvg}
                    </span>
                    <p className="text-[12px] font-semibold text-slate-700 leading-relaxed">{alert.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentMeta = getPageMeta(pathname);
  const [sidebarWidth, setSidebarWidth] = React.useState(238);
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

  const startResizing = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (event: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = event.clientX;
      if (newWidth < 148) {
        newWidth = 88;
      } else {
        if (newWidth < 204) newWidth = 204;
        if (newWidth > 296) newWidth = 296;
      }
      setSidebarWidth(newWidth);
      localStorage.setItem('admin_sidebar_width', newWidth.toString());
    },
    [isResizing],
  );

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
        <div className={`border-b border-slate-200/60 ${isCollapsed ? 'px-3 py-4' : 'px-4 py-4'}`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3' : 'justify-between gap-3'}`}>
            <Link href="/" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white shadow-sm">
                <img src="/admin/uploads/logo-startup.png" alt="HUIT Startup" className="h-full w-full object-contain p-1.5" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-extrabold text-slate-900">HUIT STARTUP</p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">Dashboard quản trị</p>
                </div>
              )}
            </Link>

            <button
              onClick={toggleSidebar}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isCollapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
              </svg>
            </button>
          </div>
        </div>

        <nav className={`min-h-0 flex-1 space-y-4 overflow-y-auto px-2 pb-3 pt-3 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navGroups.map((group) => (
            <section key={group.title} className="space-y-2">
              {!isCollapsed && <p className="px-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{group.title}</p>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={`group flex items-center rounded-[12px] border transition-all duration-200 ${isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'} ${active
                        ? 'border-blue-100 bg-blue-50 text-[var(--primary-strong)] shadow-[0_8px_20px_rgba(21,101,216,0.08)]'
                        : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      <span className={`flex shrink-0 items-center justify-center ${active ? 'text-[var(--primary)]' : 'text-slate-400 group-hover:text-slate-700'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate text-[13px] font-semibold">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-200/60`}>
          <div className={`rounded-[14px] border border-slate-200 bg-white/92 shadow-sm ${isCollapsed ? 'p-2' : 'p-3'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-slate-200 bg-slate-50">
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
                <button type="button" className="grid h-8 w-8 place-items-center rounded-[10px] text-slate-500 transition hover:bg-slate-100" aria-label="Tài khoản">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-[12px] border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                Đăng xuất
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
        <header className="sticky top-0 z-20 border-b border-white/70 bg-[rgba(248,251,255,0.9)] px-5 py-3 backdrop-blur-xl md:px-6">
          <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h1 className="text-[17px] font-extrabold leading-tight text-slate-950">{currentMeta.title}</h1>
                <p className="mt-0.5 text-[13px] font-medium text-slate-500">{currentMeta.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href={SITE_URL} target="_blank" className="admin-btn admin-btn-secondary">
                  Xem trang chủ
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </Link>
                <BellButton />
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto pb-0.5 lg:hidden">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-[14px] border px-3 py-2 text-[12px] font-semibold shadow-sm transition ${active
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

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-4 md:px-6 md:py-4">
          <div className="mx-auto w-full max-w-[1320px] space-y-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
