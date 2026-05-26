import React from 'react';
import './globals.css';

export const metadata = {
  title: "Cổng bình chọn HUIT's Iconic 2024",
  description: "Bình chọn HUIT's Warrior",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-radial-gradient min-h-screen flex flex-col justify-between">
        
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full bg-[#272B34] h-[60px] flex justify-center items-center box-shadow-12 px-6">
          <div className="w-full max-w-[1200px] flex justify-between items-center">
            
            {/* Brand Logo Group */}
            <div className="flex items-center gap-3">
              <a href="/" className="font-bold text-[18px] tracking-widest text-[#E11D48] hover:opacity-90">
                EVENTISTA
              </a>
              <span className="text-white/40">|</span>
              <span className="font-semibold text-caption1 tracking-wide text-neutral-grey text-[13px]">
                HUIT'S ICONIC
              </span>
            </div>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-white hover:text-secondary text-[14px] font-medium transition-colors">
                Trang bình chọn
              </a>
              <a href="/bang-xep-hang" className="text-white/80 hover:text-secondary text-[14px] font-medium transition-colors">
                Bảng xếp hạng
              </a>
              <a href="/the-le" className="text-white/80 hover:text-secondary text-[14px] font-medium transition-colors">
                Hướng dẫn & Thể lệ
              </a>
            </nav>

            {/* Login button */}
            <div className="flex items-center gap-3">
              <a href="/dang-nhap" className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] hover:text-secondary border border-white/20 hover:border-secondary transition-all rounded-full text-white text-[14px] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Đăng nhập
              </a>
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-[#030612] border-t border-white/5 py-10 px-6 mt-12">
          <div className="max-w-[1200px] mx-auto flex flex-col items-center space-y-6">
            
            {/* Quick Links */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
              <div>
                <a href="https://eventistax.com/huong-dan-thanh-toan" target="_blank" rel="noopener noreferrer" className="text-[13px] text-neutral-grey hover:text-white transition-colors">
                  Hướng dẫn thanh toán
                </a>
              </div>
              <div>
                <a href="https://eventistax.com/chinh-sach-rieng-tu" target="_blank" rel="noopener noreferrer" className="text-[13px] text-neutral-grey hover:text-white transition-colors">
                  Chính sách quyền riêng tư
                </a>
              </div>
              <div>
                <a href="https://eventistax.com/dieu-khoan-su-dung" target="_blank" rel="noopener noreferrer" className="text-[13px] text-neutral-grey hover:text-white transition-colors">
                  Điều khoản sử dụng
                </a>
              </div>
              <div>
                <a href="https://eventistax.com/dieu-kien-van-chuyen" target="_blank" rel="noopener noreferrer" className="text-[13px] text-neutral-grey hover:text-white transition-colors">
                  Điều kiện vận chuyển và giao nhận
                </a>
              </div>
            </div>

            {/* Separator */}
            <div className="w-full h-[1px] bg-white/5"></div>

            {/* Copyright & Support */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div>
                <span className="text-[14px] font-bold text-rose-500 tracking-wider">EVENTISTA</span>
                <p className="text-[12px] text-neutral-grey mt-1">
                  Eventista là nền tảng công nghệ giúp các doanh nghiệp tối ưu hóa nguồn doanh thu sự kiện...
                </p>
              </div>
              <div className="text-[12px] text-neutral-grey">
                <p>Hỗ trợ: support@eventista.vn</p>
                <p className="mt-0.5">Hotline: +84 90 1946686</p>
              </div>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
