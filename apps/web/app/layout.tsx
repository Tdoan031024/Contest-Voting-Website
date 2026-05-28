'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentHash, setCurrentHash] = useState('');
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          if (typeof document !== 'undefined') {
            document.title = data.eventTitle ? `Cổng bình chọn - ${data.eventTitle}` : "Cổng bình chọn HUIT's Iconic";
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
          <title>{settings.eventTitle} - Bảo trì hệ thống</title>
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
        <title>{settings?.eventTitle ? `Cổng bình chọn - ${settings.eventTitle}` : "Cổng bình chọn HUIT's Iconic"}</title>
        <meta name="description" content={settings?.eventTitle ? `Bình chọn ${settings.eventTitle}` : "Bình chọn HUIT's Warrior"} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        
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
        <main>
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
              <div className="absolute h-[80px] top-0 left-0 right-0 w-full flex justify-center bg-[#030612]/75 backdrop-blur-[12px] border-b border-white/5 box-shadow-12">
                <div className="sc-1a037b37-0 RKByV flex w-full md:justify-between items-center h-full">
                  <div className="flex-1 flex md:flex-auto items-center h-full">

                    {/* Mobile Menu Icon */}
                    <div className="flex items-center sm-desktop:hidden h-[80px]">
                      <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="focus:outline-none sc-f65501b1-0 eCoCwA fill-icon-brand-light dark:fill-icon-brand-dark h-[80px] pl-[20px] pr-1 w-[48px] flex justify-center items-center bg-transparent border-0 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z" fill="#79BCC2"></path>
                          <path d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z" fill="#79BCC2"></path>
                          <path d="M3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17H3Z" fill="#79BCC2"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Logo Section */}
                    <div className="h-full flex items-center gap-1 md:gap-[40px]">
                      <Link className="focus:outline-none w-[105px] sm:w-[139px] flex items-center" href="/">
                        <img alt="Eventista" width="139" height="16" className="mobile:max-w-[105px]" src="/images/eventista.7a1126d5.svg" />
                      </Link>
                      <img alt="HUIT's Iconic" width="115" height="36" className="object-contain max-h-[60px] mobile:max-w-[60px]" src="/images/imageb821.png" />
                    </div>
                  </div>

                  {/* Desktop Navigation Links */}
                  <div className="flex items-center gap-1 md:gap-[28px] mobile:pr-1 h-full">
                    <div className="items-center hidden sm-desktop:flex h-full">
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/' ? 'text-[#79BCC2] font-bold' : 'text-white/85 hover:text-[#79BCC2] font-normal'}`}>
                          Trang chủ
                        </p>
                        {pathname === '/' && <div className="h-[3.5px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] shadow-[0_0_8px_#79BCC2] bottom-3"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/gioi-thieu">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/gioi-thieu' ? 'text-[#79BCC2] font-bold' : 'text-white/85 hover:text-[#79BCC2] font-normal'}`}>
                          Giới thiệu
                        </p>
                        {pathname === '/gioi-thieu' && <div className="h-[3.5px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] shadow-[0_0_8px_#79BCC2] bottom-3"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/bang-xep-hang">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/bang-xep-hang' ? 'text-[#79BCC2] font-bold' : 'text-white/85 hover:text-[#79BCC2] font-normal'}`}>
                          Bảng xếp hạng
                        </p>
                        {pathname === '/bang-xep-hang' && <div className="h-[3.5px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] shadow-[0_0_8px_#79BCC2] bottom-3"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center flex items-center h-full" href="/the-le">
                        <p className={`text-caption1 leading-[23px] transition-colors duration-200 ${pathname === '/the-le' ? 'text-[#79BCC2] font-bold' : 'text-white/85 hover:text-[#79BCC2] font-normal'}`}>
                          Hướng dẫn
                        </p>
                        {pathname === '/the-le' && <div className="h-[3.5px] rounded-sm w-[24px] absolute left-[calc(50%-12px)] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] shadow-[0_0_8px_#79BCC2] bottom-3"></div>}
                      </Link>
                    </div>

                    {/* Desktop Login Button */}
                    <Link id="loginHeaderBtn" href="/dang-nhap" className="group hidden sm:flex cursor-pointer gap-2 relative justify-center items-center fill-white hover:text-[#79BCC2] transition-colors h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <p className="text-caption1 font-medium leading-[23px] text-white group-hover:text-[#79BCC2] transition-colors">Đăng nhập</p>
                    </Link>

                    {/* Mobile Login Button */}
                    <Link id="loginHeaderBtnMobile" href="/dang-nhap" className="flex sm:hidden cursor-pointer justify-center items-center fill-white p-2 hover:border-[#79BCC2]/50 hover:bg-[#79BCC2]/10 transition-all rounded-full" style={{ height: '36px', width: '36px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Dropdown Navigation Menu */}
              {mobileMenuOpen && (
                <div className="flex flex-col absolute top-[80px] left-0 right-0 bg-[#030612]/95 backdrop-blur-[16px] p-4 z-50 w-full sm-desktop:hidden border-b border-white/10 space-y-3">
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/' ? 'text-[#79BCC2] font-bold' : 'text-white/80 hover:text-[#79BCC2]'}`} href="/" onClick={() => setMobileMenuOpen(false)}>
                    Trang chủ
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/gioi-thieu' ? 'text-[#79BCC2] font-bold' : 'text-white/80 hover:text-[#79BCC2]'}`} href="/gioi-thieu" onClick={() => setMobileMenuOpen(false)}>
                    Giới thiệu
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/bang-xep-hang' ? 'text-[#79BCC2] font-bold' : 'text-white/80 hover:text-[#79BCC2]'}`} href="/bang-xep-hang" onClick={() => setMobileMenuOpen(false)}>
                    Bảng xếp hạng
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center transition-all ${pathname === '/the-le' ? 'text-[#79BCC2] font-bold' : 'text-white/80 hover:text-[#79BCC2]'}`} href="/the-le" onClick={() => setMobileMenuOpen(false)}>
                    Hướng dẫn
                  </Link>
                  <Link className={`focus:outline-none py-2 block text-center font-bold transition-all ${pathname === '/dang-nhap' ? 'text-[#79BCC2]' : 'text-white hover:text-[#79BCC2]'}`} href="/dang-nhap" onClick={() => setMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
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
                  <img alt="Provider" width="176" height="20" className="object-contain my-[10px]" src="/images/eventista.7a1126d5.svg" />
                  <div className="max-w-[884px] pt-1.5">
                    <p className="text-body text-neutral-grey text-center text-[12px] leading-relaxed">
                      Eventista là nền tảng công nghệ giúp các doanh nghiệp tối đa hóa nguồn doanh thu sự kiện từ cộng đồng, với hệ sinh thái giải pháp đa dạng: nền tảng bình chọn trực tuyến, nền tảng phân phối vé và vật phẩm &amp; quà lưu niệm, ứng dụng tương tác giữa nghệ sĩ và người hâm mộ.... Eventista hiện là đối tác chiến lược của Sen Vàng Entertainment, Uni Corp, TNA Entertainment,.... trở thành nền tảng quan trọng mang lại hiệu quả kinh doanh vượt trội cho các doanh nghiệp trong ngành giải trí.
                    </p>
                  </div>
                </div>

                <div className="max-w-[1248px] w-full flex gap-3 px-0 sm:px-3 flex-col sm:flex-row flex-wrap justify-between pt-4">
                  <div className="flex flex-col space-y-2 max-w-[300px]">
                    <span className="text-button text-white text-[18px] font-bold">Hỗ trợ</span>
                    <div className="flex flex-col gap-1 text-[13px] text-white/70">
                      <p>Email: <a href={`mailto:${settings?.contactEmail || 'support@eventista.vn'}`} className="hover:underline">{settings?.contactEmail || 'support@eventista.vn'}</a></p>
                      <p>Website: <a href="https://eventista.vn/" target="_blank" className="hover:underline">Eventista.vn</a></p>
                      <p>Hotline: <br /><a href="tel:+84 90 1946686" className="hover:underline">+84 90 1946686</a></p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 max-w-[300px]">
                    <span className="text-button text-white text-[18px] font-bold">Chứng nhận bởi</span>
                    <div className="w-[186px]">
                      <a target="_blank" rel="noopener noreferrer" href="http://online.gov.vn/Home/WebDetails/108397">
                        <img alt="Bộ công thương" width="87" height="32" src="/images/image7872.png" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 max-w-[300px]">
                    <span className="text-button text-white text-[18px] font-bold">Kết nối với chúng tôi</span>
                    <div className="flex space-x-2">
                      <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/eventista.vn">
                        <img alt="Facebook" width="32" height="32" src="/images/imaged2ec.png" />
                      </a>
                      <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@eventista.vn">
                        <img alt="Tiktok" width="32" height="32" src="/images/image7782.png" />
                      </a>
                      <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/eventistavn">
                        <img alt="LinkedIn" width="32" height="32" src="/images/image87ff.png" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 max-w-[300px] w-full">
                    <span className="text-button text-white text-[18px] font-bold">Phương thức thanh toán</span>
                    <div className="flex flex-wrap gap-2">
                      <img alt="Momo" width="32" height="32" src="/images/imagedd52.png" />
                      <img alt="Vnpay" width="32" height="32" src="/images/image37ad.png" />
                      <img alt="Zalopay" width="32" height="32" src="/images/image0667.png" />
                      <img alt="Visa" width="32" height="32" src="/images/image19f4.png" />
                      <img alt="Mastercard" width="32" height="32" src="/images/image3a16.png" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
