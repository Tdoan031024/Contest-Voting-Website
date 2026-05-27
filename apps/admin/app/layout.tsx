import React from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: "Admin Dashboard - HUIT's Iconic",
  description: "HUIT's Iconic Voting Platform Management Dashboard",
};

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-900 text-slate-100 flex min-h-screen">
        
        {/* Sidebar Container */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between flex-shrink-0">
          <div className="flex flex-col">
            {/* Sidebar Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-700">
              <span className="font-extrabold text-[16px] tracking-wider text-blue-500">
                HUIT ICONIC ADMIN
              </span>
            </div>
            
            {/* Nav Menu */}
            <nav className="flex flex-col p-4 space-y-1">
              <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-[14px] font-medium text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>
                <span>Tổng quan</span>
              </Link>
              <Link href="/candidates" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-[14px] font-medium text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>Thí sinh</span>
              </Link>
              <Link href="/sponsors" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-[14px] font-medium text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                <span>Nhà tài trợ</span>
              </Link>
              <Link href="/banners" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-[14px] font-medium text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <span>Ảnh Banner</span>
              </Link>
              <Link href="/timeline" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-[14px] font-medium text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>Lộ trình</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-[14px] font-medium text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span>Cấu hình cổng</span>
              </Link>
            </nav>
          </div>
          
          {/* Admin User Info Footer */}
          <div className="p-4 border-t border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[14px]">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-slate-100">Administrator</span>
              <span className="text-[11px] text-slate-400">Super Admin</span>
            </div>
          </div>
        </aside>
 
        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header */}
          <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8 flex-shrink-0">
            <h2 className="text-[14px] sm:text-[16px] font-semibold text-slate-200 uppercase tracking-wider">
              Hệ thống Quản lý HUIT fest
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-[13px] px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                Hệ thống: ONLINE
              </span>
            </div>
          </header>
 
          {/* Main View Area */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
 
        </div>
 
      </body>
    </html>
  );
}
