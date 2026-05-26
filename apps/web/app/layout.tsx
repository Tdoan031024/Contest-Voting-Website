'use client';

import React, { useState } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cổng bình chọn HUIT's Iconic</title>
        <meta name="description" content="Bình chọn HUIT's Warrior" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        
        {/* Load original CSS files copied from Binhchon mirror */}
        <link rel="stylesheet" href="/css/82aef30d151230ac.css" />
        <link rel="stylesheet" href="/css/be16ba848ed13f21.css" />
        <link rel="stylesheet" href="/css/431944509084d071.css" />
        <link rel="stylesheet" href="/eventista-platform-api.1vote.vn/v1/internal/tenants/tAtj0/colors.css" />
        
        <style>{`
          /* Custom overrides for monorepo layouts */
          body {
            background-color: #030612 !important;
            margin: 0;
            font-family: 'Inter', sans-serif;
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
          <div className="sticky-outer-wrapper">
            <div className="sticky-inner-wrapper" style={{ position: 'relative', top: '0px', zIndex: 1001 }}>
              <div className="absolute h-[60px] top-0 left-0 right-0 w-full flex justify-center bg-[#272B34] box-shadow-12">
                <div className="sc-1a037b37-0 RKByV flex w-full md:justify-between">
                  <div className="flex-1 flex md:flex-auto">
                    
                    {/* Mobile Menu Icon */}
                    <div className="flex items-center sm-desktop:hidden h-[60px]">
                      <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="focus:outline-none sc-f65501b1-0 eCoCwA fill-icon-brand-light dark:fill-icon-brand-dark h-[60px] pl-[20px] pr-1 w-[48px] flex justify-center items-center bg-transparent border-0 cursor-pointer"
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
                        <img alt="Eventista" width="139" height="16" className="mobile:max-w-[105px]" src="/images/eventista.7a1126d5.svg"/>
                      </Link>
                      <img alt="HUIT's Iconic" width="115" height="36" className="object-contain max-h-[60px] mobile:max-w-[60px]" src="/images/imageb821.png"/>
                    </div>
                  </div>

                  {/* Desktop Navigation Links */}
                  <div className="flex items-center gap-1 md:gap-[28px] mobile:pr-1">
                    <div className="items-center hidden sm-desktop:flex">
                      <Link className="focus:outline-none px-3 relative text-center py-[20px]" href="/">
                        <p className={`text-caption1 leading-[23px] text-white py-[8px] ${pathname === '/' ? 'font-bold' : 'font-normal'}`}>
                          Trang bình chọn
                        </p>
                        {pathname === '/' && <div className="h-[3.5px] rounded-sm w-[24px] absolute left-[calc(50%-10px)] bg-primary bottom-2"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center py-[20px]" href="/bang-xep-hang">
                        <p className={`text-caption1 leading-[23px] text-white py-[8px] ${pathname === '/bang-xep-hang' ? 'font-bold' : 'font-normal'}`}>
                          Bảng xếp hạng
                        </p>
                        {pathname === '/bang-xep-hang' && <div className="h-[3.5px] rounded-sm w-[24px] absolute left-[calc(50%-10px)] bg-primary bottom-2"></div>}
                      </Link>
                      <Link className="focus:outline-none px-3 relative text-center py-[20px]" href="/the-le">
                        <p className={`text-caption1 leading-[23px] text-white py-[8px] ${pathname === '/the-le' ? 'font-bold' : 'font-normal'}`}>
                          Hướng dẫn &amp; Thể lệ
                        </p>
                        {pathname === '/the-le' && <div className="h-[3.5px] rounded-sm w-[24px] absolute left-[calc(50%-10px)] bg-primary bottom-2"></div>}
                      </Link>
                    </div>

                    {/* Desktop Login Button */}
                    <Link id="loginHeaderBtn" href="/dang-nhap" className="hidden sm:flex cursor-pointer gap-2 relative justify-center items-center fill-white hover:text-[#79BCC2] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <p className="text-caption1 font-medium leading-[23px] text-white">Đăng nhập</p>
                    </Link>

                    {/* Mobile Login Button */}
                    <Link id="loginHeaderBtnMobile" href="/dang-nhap" className="flex sm:hidden cursor-pointer justify-center items-center fill-white p-2 hover:bg-neutral-neutral1/20 transition-all rounded-full" style={{ height: '36px', width: '36px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown Navigation Menu */}
          {mobileMenuOpen && (
            <div className="flex flex-col absolute top-[60px] left-0 right-0 bg-[#272B34] p-4 z-50 w-full sm-desktop:hidden border-b border-white/10 space-y-3">
              <Link className="focus:outline-none py-2 text-white block text-center" href="/" onClick={() => setMobileMenuOpen(false)}>
                Trang bình chọn
              </Link>
              <Link className="focus:outline-none py-2 text-white block text-center" href="/bang-xep-hang" onClick={() => setMobileMenuOpen(false)}>
                Bảng xếp hạng
              </Link>
              <Link className="focus:outline-none py-2 text-white block text-center" href="/the-le" onClick={() => setMobileMenuOpen(false)}>
                Hướng dẫn &amp; Thể lệ
              </Link>
            </div>
          )}

          {/* Main Children View */}
          {children}

          {/* Footer identical to sample website */}
          <div className="relative bg-footer-gradient mt-4 sm:mt-[85px] border-t border-white/5">
            <div className="sc-1a037b37-0 ekqPrV">
              <div className="flex flex-col space-y-6 py-8 items-center">
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="text-left sm:text-center">
                    <a className="focus:outline-none" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/huong-dan-thanh-toan">
                      <p className="text-title-1 text-neutral-grey text-[13px] hover:underline">Hướng dẫn thanh toán</p>
                    </a>
                  </div>
                  <div className="text-left sm:text-center">
                    <a className="focus:outline-none" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/chinh-sach-rieng-tu">
                      <p className="text-title-1 text-neutral-grey text-[13px] hover:underline">Chính sách quyền riêng tư</p>
                    </a>
                  </div>
                  <div className="text-left sm:text-center">
                    <a className="focus:outline-none" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/dieu-khoan-su-dung">
                      <p className="text-title-1 text-neutral-grey text-[13px] hover:underline">Điều khoản sử dụng</p>
                    </a>
                  </div>
                  <div className="text-left sm:text-center">
                    <a className="focus:outline-none" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/dieu-kien-van-chuyen">
                      <p className="text-title-1 text-neutral-grey text-[13px] hover:underline">Điều kiện vận chuyển và giao nhận</p>
                    </a>
                  </div>
                  <div className="text-left sm:text-center">
                    <a className="focus:outline-none" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/doi-tra">
                      <p className="text-title-1 text-neutral-grey text-[13px] hover:underline">Chính sách đổi trả và hoàn tiền</p>
                    </a>
                  </div>
                  <div className="text-left sm:text-center">
                    <a className="focus:outline-none" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/cau-hoi-thuong-gap">
                      <p className="text-title-1 text-neutral-grey text-[13px] hover:underline">Câu hỏi thường gặp</p>
                    </a>
                  </div>
                </div>

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
                      <p>Email: <a href="mailto:support@eventista.vn" className="hover:underline">support@eventista.vn</a></p>
                      <p>Website: <a href="https://eventista.vn/" target="_blank" className="hover:underline">Eventista.vn</a></p>
                      <p>Hotline: <br/><a href="tel:+84 90 1946686" className="hover:underline">+84 90 1946686</a></p>
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

                <div className="max-w-[1248px] w-full px-0 sm:px-3 flex flex-col md:flex-row gap-8 justify-between pt-6 border-t border-white/5">
                  <div className="space-y-2 max-w-[378px] text-[12px] text-neutral-grey/70">
                    <p className="font-semibold text-neutral-grey text-[13px]">Eventista Việt Nam</p>
                    <p className="leading-relaxed">1A Trần Thánh Tông, Phường Bạch Đằng, Quận Hai Bà Trưng, Hà Nội Công ty TNHH Eventista.</p>
                    <p className="leading-relaxed">GPĐKKD số 0110372057 do Sở KHĐT TP Hà Nội cấp ngày 31/05/2022</p>
                  </div>
                  <div className="space-y-2 max-w-[378px] text-[12px] text-neutral-grey/70">
                    <p className="font-semibold text-neutral-grey text-[13px]">Eventista Limited Company HongKong:</p>
                    <p className="leading-relaxed">SUITE C, LEVEL 7, WORLD TRUST TOWER, 50 STANLEY STREET, CENTRAL, HONG KONG</p>
                    <p className="leading-relaxed">Business Reg Number: 75914577-000-11-23-7. Shorten BRN: 3338407</p>
                  </div>
                  <div className="space-y-2 max-w-[378px] text-[12px] text-neutral-grey/70">
                    <p className="font-semibold text-neutral-grey text-[13px]">Eventista Global Company Limited United KingDom:</p>
                    <p className="leading-relaxed">71-75 Shelton Street Covent Garden London, WC2H 9JQ, UNITED KINGDOM</p>
                    <p className="leading-relaxed">Business Reg Number: 15533570</p>
                  </div>
                </div>

                <div className="text-center pt-6">
                  <p className="text-[12px] text-white/50">@2024 Bản quyền thuộc về Eventista</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
