import React from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: "Admin Dashboard - HUIT's Iconic",
  description: "HUIT's Iconic Voting Platform Management Dashboard",
};

const dashboardIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="8" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="15" width="7" height="6" rx="1.5" />
  </svg>
);

const candidatesIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const usersIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 11h-6" />
    <path d="M19 8v6" />
  </svg>
);

const sponsorsIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 14 9 5 9-5" />
    <path d="m3 11 9 5 9-5" />
  </svg>
);

const bannerIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8" cy="10" r="1.5" />
    <path d="m21 15-5-5L5 19" />
  </svg>
);

const timelineIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 8v5l3 2" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const settingsIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 1 1-2.83 2.83l-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.06a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.06a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 1 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.06a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A1.7 1.7 0 0 0 19.4 9c.15.32.48.64 1 .95H21a2 2 0 1 1 0 4h-.06a1.7 1.7 0 0 0-1.55 1Z" />
  </svg>
);

const navGroups = [
  {
    title: 'Quan ly',
    items: [
      { href: '/', label: 'Tong quan', icon: dashboardIcon },
      { href: '/candidates', label: 'Thi sinh', icon: candidatesIcon },
      { href: '/users', label: 'Quan ly nguoi dung', icon: usersIcon },
      { href: '/sponsors', label: 'Nha tai tro', icon: sponsorsIcon },
    ],
  },
  {
    title: 'Quan ly giao dien',
    items: [
      { href: '/banners', label: 'Banner', icon: bannerIcon },
      { href: '/timeline', label: 'Lo trinh', icon: timelineIcon },
    ],
  },
  {
    title: 'Cai dat',
    items: [
      { href: '/settings', label: 'Cau hinh', icon: settingsIcon },
    ],
  },
];

const navItems = navGroups.flatMap((group) => group.items);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="h-screen overflow-hidden bg-[#f4f7f6] text-[#18211f]">
        <div className="flex h-screen overflow-hidden">
          <aside className="hidden h-screen w-[280px] shrink-0 border-r border-[#dce5e1] bg-[#fbfdfc] lg:flex lg:flex-col">
            <div className="shrink-0 px-4 py-5">
              <Link href="/" className="flex items-center gap-3 rounded-lg px-2 py-2">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#123c34] text-sm font-black text-white shadow-sm">HI</span>
                <span>
                  <span className="block text-[13px] font-black uppercase tracking-[0.18em] text-[#123c34]">HUIT Iconic</span>
                  <span className="block text-xs font-medium text-[#6b7773]">Voting Admin</span>
                </span>
              </Link>
            </div>

            <nav className="min-h-0 flex-1 space-y-7 overflow-y-auto px-4 pb-5">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#92a39d]">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-[#52605b] transition hover:bg-[#edf4f1] hover:text-[#123c34]"
                      >
                        <span className="text-[#8aa098] transition group-hover:text-[#0f766e]">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="shrink-0 p-4">
              <div className="rounded-lg border border-[#dce5e1] bg-[#f3f8f6] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a8b85]">Tai khoan</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e45136] text-sm font-bold text-white">AD</span>
                  <span>
                    <span className="block text-sm font-bold text-[#18211f]">Administrator</span>
                    <span className="block text-xs text-[#6b7773]">Super Admin</span>
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
            <header className="z-20 shrink-0 border-b border-[#dce5e1] bg-[#f8fbfa]/90 px-4 py-4 backdrop-blur md:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">Admin control center</p>
                  <h1 className="mt-1 text-xl font-black text-[#18211f]">Quan ly cong binh chon</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#b9d8cf] bg-white px-3 py-2 text-xs font-bold text-[#166556]">
                    <span className="h-2 w-2 rounded-full bg-[#18a058]" />
                    He thong online
                  </span>
                  <Link href="http://localhost:3000" className="rounded-lg border border-[#dce5e1] bg-white px-4 py-2 text-sm font-bold text-[#18211f] shadow-sm transition hover:border-[#0f766e] hover:text-[#0f766e]">
                    Xem trang web
                  </Link>
                </div>
              </div>

              <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#52605b] shadow-sm">
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
              <div className="mx-auto w-full max-w-[1420px]">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
