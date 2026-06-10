'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertProvider } from './AlertProvider';
import { apiUrl } from './api';

export interface SystemSettings {
  isGateOpen: boolean;
  startDate: string;
  endDate: string;
  maxVotesPerPhone: number;
  eventTitle: string;
  organizer: string;
  contactEmail: string;
  isMaintenanceMode: boolean;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fullSiteTitle = "HUIT STARTUP - Đổi mới sáng tạo hướng tới phát triển bền vững";
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentHash, setCurrentHash] = useState('');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const readUser = () => {
      if (typeof window !== 'undefined') {
        const rawUser = localStorage.getItem('huit_web_user');
        if (rawUser) {
          try {
            setCurrentUser(JSON.parse(rawUser));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };
    readUser();
    const interval = setInterval(readUser, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('huit_web_user');
      localStorage.removeItem('huit_web_token');
      setCurrentUser(null);
      window.location.reload();
    }
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(apiUrl('/api/settings'));
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          if (typeof document !== 'undefined') {
            document.title = fullSiteTitle;
          }
        }
      } catch (err) {
        console.error("Failed to fetch system settings", err);
      }
    }
    fetchSettings();
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => {
        setCurrentHash(window.location.hash);
      };
      window.addEventListener('hashchange', handleHashChange);
      const interval = setInterval(() => {
        if (window.location.hash !== currentHash) {
          setCurrentHash(window.location.hash);
        }
      }, 200);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        clearInterval(interval);
      };
    }
  }, [currentHash]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Nếu scroll xuống và lớn hơn 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrolledDown(true);
      } else {
        // Nếu scroll lên
        setScrolledDown(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  if (settings?.isMaintenanceMode) {
    return (
      <html lang="vi">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{fullSiteTitle} - Bảo trì hệ thống</title>
          <link rel="stylesheet" href="/css/82aef30d151230ac.css" />
          <link rel="stylesheet" href="/css/be16ba848ed13f21.css" />
          <link rel="stylesheet" href="/css/431944509084d071.css" />
          <style>{`
            body {
              background-color: #030612 !important;
              color: #ffffff;
              font-family: Inter, sans-serif;
              margin: 0;
            }
          `}</style>
        </head>
        <body className="dark bg-[#030612] flex items-center justify-center min-h-screen p-4 overflow-hidden relative">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-md w-full text-center z-10 bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="#79BCC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-[spin_10s_linear_infinite]">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-wide uppercase">{settings.eventTitle}</h1>
            <p className="text-[12px] text-cyan-400/80 font-medium mt-1 uppercase tracking-wider">{settings.organizer}</p>
            
            <div className="h-[1px] w-full bg-white/10 my-6"></div>
            
            <h2 className="text-lg font-semibold text-slate-100">Hệ thống đang bảo trì</h2>
            <p className="text-[14px] text-slate-400 mt-2 leading-relaxed">
              Chúng tôi đang tiến hành nâng cấp định kỳ để cải thiện trải nghiệm bình chọn của bạn. Cổng bình chọn sẽ sớm hoạt động trở lại.
            </p>
            
            <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-xl w-full text-left">
              <p className="text-[12px] text-slate-400">Đơn vị hỗ trợ kỹ thuật:</p>
              <p className="text-[14px] font-medium text-slate-200 mt-0.5">Email: <a href={`mailto:${settings.contactEmail}`} className="text-[#79BCC2] hover:underline">{settings.contactEmail}</a></p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullSiteTitle}</title>
        <meta name="description" content={settings?.eventTitle ? `Bình chọn ${settings.eventTitle}` : "Bình chọn HUIT STARTUP"} />
        <link rel="icon" href="/favicon.png" type="image/png" />
        
        {/* Load Google Fonts Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Load original CSS files copied from Binhchon mirror */}
        <link rel="stylesheet" href="/css/82aef30d151230ac.css" />
        <link rel="stylesheet" href="/css/be16ba848ed13f21.css" />
        <link rel="stylesheet" href="/css/431944509084d071.css" />
        <link rel="stylesheet" href="/eventista-platform-api.1vote.vn/v1/internal/tenants/tAtj0/colors.css" />

        <style suppressHydrationWarning>{`
          /* Custom overrides for monorepo layouts */
          body {
            background-color: #030612 !important;
            margin: 0;
            font-family: Inter, sans-serif;
          }
          .RKByV {
            padding: 0px 128px;
            padding-top: 0;
            width: calc(1311px + 128px * 2);
            margin-left: auto;
            margin-right: auto;
          }
          @media (max-width: 1504px) {
            .RKByV { width: 1312px; padding: 0px 0px; }
          }
          @media (max-width: 1312px) {
            .RKByV { width: 1110px; padding: 0px 0px; }
          }
          @media (max-width: 1199px) {
            .RKByV { width: calc(984px + 69px * 2); padding: 0px 0px; }
          }
          @media (max-width: 1121px) {
            .RKByV { width: calc(744px + 37px * 2); padding: 0px 37px; }
          }
          @media (max-width: 812px) {
            .RKByV { width: 100%; padding: 0px 0px; margin-left: 0; margin-right: 0; }
          }
          .ekqPrV {
            padding: 0px 128px;
            padding-top: 0;
            width: calc(1311px + 128px * 2);
            margin-left: auto;
            margin-right: auto;
          }
          @media (max-width: 1504px) {
            .ekqPrV { width: 1312px; padding: 0px 0px; }
          }
          @media (max-width: 1312px) {
            .ekqPrV { width: 1110px; padding: 0px 0px; }
          }
          @media (max-width: 1199px) {
            .ekqPrV { width: calc(984px + 69px * 2); padding: 0px 0px; }
          }
          @media (max-width: 1121px) {
            .ekqPrV { width: calc(744px + 37px * 2); padding: 0px 37px; }
          }
          @media (max-width: 812px) {
            .ekqPrV { width: auto; padding: 0px 16px; margin-left: auto; margin-right: auto; }
          }
        `}</style>
      </head>
      <body className="dark">
        <AlertProvider>
          <main suppressHydrationWarning>
          {/* Header section identical to sample website */}
          <div className="sticky-outer-wrapper" style={{ height: '80px' }}>
            <div 
              className="sticky-inner-wrapper" 
              style={{ 
                position: 'fixed', 
                top: '0px', 
                left: '0px', 
                right: '0px', 
                zIndex: 1001,
                transform: scrolledDown ? 'translateY(-65px)' : 'translateY(0px)',
                transition: 'transform 0.3s ease-in-out',
                height: '80px'
              }}
            >
              <div className="absolute h-[80px] top-0 left-0 right-0 w-full flex justify-center bg-white border-b border-slate-200 shadow-sm">
                <div className="sc-1a037b37-0 RKByV flex w-full md:justify-between items-center h-full">
                  <div className="flex-1 flex md:flex-auto items-center h-full">

                    {/* Mobile Menu Icon */}
                    <div className="flex items-center sm-desktop:hidden h-[80px]">
                      <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="focus:outline-none sc-f65501b1-0 eCoCwA h-[80px] pl-[20px] pr-1 w-[48px] flex justify-center items-center bg-transparent border-0 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z" fill="#334155"></path>
                          <path d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z" fill="#334155"></path>
                          <path d="M3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17H3Z" fill="#334155"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Logo Section */}
                    <div className="h-full flex items-center gap-1 md:gap-[40px]">
                      <Link className="focus:outline-none w-[105px] sm:w-[139px] flex items-center" href="/">
                        <img alt="IEC" width="139" height="28" className="mobile:max-w-[105px] object-contain" src="/images/ieclogo.png" />
                      </Link>
                      <img alt="HUIT STARTUP" width="125" height="36" className="object-contain max-h-[60px] mobile:max-w-[72px]" src="/images/startuplogo.png" />
                    </div>
                  </div>

                  {/* Desktop Navigation Links */}
                  <div className="flex items-center gap-1 md:gap-[28px] mobile:pr-1 h-full">
                    <div className="items-center hidden sm-desktop:flex h-full">
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF] font-normal'}`}>
                          Trang chủ
                        </p>
                        {pathname === '/' && <div className="h-[3px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#00C6FF] bottom-3"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/gioi-thieu">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/gioi-thieu' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF] font-normal'}`}>
                          Giới thiệu
                        </p>
                        {pathname === '/gioi-thieu' && <div className="h-[3px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#00C6FF] bottom-3"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/thoi-gian">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/thoi-gian' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF] font-normal'}`}>
                          Thời gian
                        </p>
                        {pathname === '/thoi-gian' && <div className="h-[3px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#00C6FF] bottom-3"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/bang-xep-hang">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/bang-xep-hang' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF] font-normal'}`}>
                          Bảng xếp hạng
                        </p>
                        {pathname === '/bang-xep-hang' && <div className="h-[3px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#00C6FF] bottom-3"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/the-le">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/the-le' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF] font-normal'}`}>
                          Hướng dẫn
                        </p>
                        {pathname === '/the-le' && <div className="h-[3px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#00C6FF] bottom-3"></div>}
                      </Link>
                    </div>

                    {/* Desktop User Status/Login Button */}
                    {currentUser ? (
                      <div className="hidden sm:flex items-center gap-3 h-full">
                        <div className="flex items-center gap-2 text-slate-800">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A2FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: '#0A2FFF' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          <span className="text-caption1 font-bold leading-[23px] text-slate-800 max-w-[150px] truncate">{currentUser.fullName}</span>
                        </div>
                        <button onClick={handleLogout} className="text-caption1 font-medium text-red-600 hover:text-red-800 hover:underline transition-colors bg-transparent border-0 outline-none cursor-pointer">
                          Đăng xuất
                        </button>
                      </div>
                    ) : (
                      <Link id="loginHeaderBtn" href="/dang-nhap" className="group hidden sm:flex cursor-pointer gap-2 relative justify-center items-center text-slate-800 hover:text-[#0A2FFF] transition-colors h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: 'currentColor' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <p className="text-caption1 font-medium leading-[23px] text-slate-800 group-hover:text-[#0A2FFF] transition-colors">Đăng nhập</p>
                      </Link>
                    )}

                    {/* Mobile User Status/Login Button */}
                    {currentUser ? (
                      <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex sm:hidden cursor-pointer justify-center items-center p-2 hover:border-[#0A2FFF]/50 hover:bg-[#0A2FFF]/10 transition-all rounded-full text-[#0A2FFF] border-[#0A2FFF]/30 bg-[#0A2FFF]/5"
                        style={{ height: '36px', width: '36px', border: '1px solid rgba(10, 47, 255, 0.3)' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" style={{ stroke: 'currentColor' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </button>
                    ) : (
                      <Link id="loginHeaderBtnMobile" href="/dang-nhap" className="flex sm:hidden cursor-pointer justify-center items-center p-2 hover:border-[#0A2FFF]/50 hover:bg-[#0A2FFF]/10 transition-all rounded-full text-slate-800 hover:text-[#0A2FFF]" style={{ height: '36px', width: '36px', border: '1px solid rgba(0,0,0,0.15)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" style={{ stroke: 'currentColor' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Dropdown Navigation Menu */}
              {mobileMenuOpen && (
                <div className="flex flex-col absolute top-[80px] left-0 right-0 bg-white/95 backdrop-blur-[16px] p-4 z-50 w-full sm-desktop:hidden border-b border-black/10 space-y-3">
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF]'}`} href="/" onClick={() => setMobileMenuOpen(false)}>
                    Trang chủ
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/gioi-thieu' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF]'}`} href="/gioi-thieu" onClick={() => setMobileMenuOpen(false)}>
                    Giới thiệu
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/thoi-gian' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF]'}`} href="/thoi-gian" onClick={() => setMobileMenuOpen(false)}>
                    Thời gian
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/bang-xep-hang' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF]'}`} href="/bang-xep-hang" onClick={() => setMobileMenuOpen(false)}>
                    Bảng xếp hạng
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/the-le' ? 'text-[#0A2FFF] font-bold' : 'text-slate-800 hover:text-[#0A2FFF]'}`} href="/the-le" onClick={() => setMobileMenuOpen(false)}>
                    Hướng dẫn
                  </Link>
                  {currentUser ? (
                    <>
                      <div className="py-2 text-center text-slate-800 font-semibold border-t border-slate-100">
                        Xin chào, <span className="text-[#0A2FFF]">{currentUser.fullName}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="py-2 block w-full text-center text-red-600 hover:text-red-800 font-bold transition-all border-b border-slate-100 bg-transparent border-0 cursor-pointer"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <Link className={`focus:outline-none py-2 block text-center font-bold transition-all ${pathname === '/dang-nhap' ? 'text-[#0A2FFF]' : 'text-slate-800 hover:text-[#0A2FFF]'}`} href="/dang-nhap" onClick={() => setMobileMenuOpen(false)}>
                      Đăng nhập
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Children View */}
          {children}

          {/* Footer identical to sample website */}
          <div className="relative bg-footer-gradient border-t border-white/5">
            <div className="sc-1a037b37-0 ekqPrV">
              <div className="flex flex-col space-y-6 py-8 items-center">
                <div className="flex flex-col items-start sm:items-center space-y-1 sm:space-y-0 justify-center">
                  <img alt="HUIT STARTUP" width="176" height="40" className="object-contain my-[10px]" src="/images/startuplogo.png" />
                  <div className="max-w-[884px] pt-1.5">
                    <p className="text-body text-neutral-grey text-center text-[12px] leading-relaxed">
                      Cuộc thi HUIT Startup lần thứ 7 năm 2026 cấp Thành phố với chủ đề “Đổi mới sáng tạo hướng tới phát triển bền vững” nhằm tìm kiếm và ươm tạo các ý tưởng, dự án sáng tạo của học sinh, sinh viên, học viên và doanh nghiệp; góp phần giải quyết các vấn đề xã hội và thúc đẩy phát triển bền vững.
                    </p>
                  </div>
                </div>

                <div className="max-w-[1248px] w-full flex gap-3 px-0 sm:px-3 flex-col sm:flex-row flex-wrap justify-between pt-4">
                  <div className="flex flex-col space-y-2 max-w-[300px]">
                    <span className="text-button text-white text-[18px] font-bold">Hỗ trợ</span>
                    <div className="flex flex-col gap-1 text-[13px] text-white/70">
                      <p>Email: <a href="mailto:iec@huit.edu.vn" className="hover:underline">iec@huit.edu.vn</a></p>
                      <p>Website: <a href="https://iec.huit.edu.vn" target="_blank" rel="noopener noreferrer" className="hover:underline">https://iec.huit.edu.vn</a></p>
                      <p>Hotline: Điện thoại 0963 621 124 hoặc (028) 3816 3318 - 142</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 max-w-[300px]">
                    <span className="text-button text-white text-[18px] font-bold">Kết nối với chúng tôi</span>
                    <div className="flex space-x-2">
                      <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/huit.startup">
                        <img alt="Facebook" width="32" height="32" src="/images/imaged2ec.png" />
                      </a>
                      <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@huit_media">
                        <img alt="Tiktok" width="32" height="32" src="/images/image7782.png" />
                      </a>
                      <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/dh_congthuong/">
                        <img alt="Instagram" width="32" height="32" src="/images/instagram.png" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 max-w-[300px] w-full">
                    <span className="text-button text-white text-[18px] font-bold">Phương thức thanh toán</span>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[13px] text-white/90 font-medium hover:bg-white/10 hover:border-[#79BCC2]/30 transition-all duration-300 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
                          <rect x="2" y="2" width="20" height="20" rx="3" />
                          <rect x="6" y="6" width="4" height="4" />
                          <rect x="14" y="6" width="4" height="4" />
                          <rect x="6" y="14" width="4" height="4" />
                          <rect x="14" y="14" width="4" height="4" />
                        </svg>
                        <span>Chuyển khoản QR (Sepay)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          </main>
        </AlertProvider>
      </body>
    </html>
  );
}
