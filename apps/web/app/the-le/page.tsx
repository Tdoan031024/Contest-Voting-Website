'use client';

import React from 'react';

interface Step {
  number: string;
  description: string;
  image: string;
}

interface SectionConfig {
  title: string;
  icon: React.ReactNode;
  steps: Step[];
}

export default function TheLePage() {
  const sections: SectionConfig[] = [
    {
      title: 'Hướng dẫn bình chọn miễn phí',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      steps: [
        { number: '01', description: 'Tạo tài khoản mới hoặc Đăng nhập nhanh bằng tài khoản Google', image: '/original_assets/imagefca6.png' },
        { number: '02', description: 'Xác thực tài khoản của bạn thông qua liên kết gửi về Email cá nhân', image: '/original_assets/imagef1be.png' },
        { number: '03', description: 'Tìm kiếm và lựa chọn thí sinh bạn mong muốn bình chọn', image: '/original_assets/image81d3.png' },
        { number: '04', description: 'Hệ thống hiển thị thông báo bạn đã bình chọn thành công', image: '/original_assets/image20da.png' }
      ]
    },
    {
      title: 'Thanh toán qua cổng VNPay',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      ),
      steps: [
        { number: '01', description: 'Truy cập danh sách thí sinh, lựa chọn ứng viên bạn muốn ủng hộ', image: '/original_assets/image17ae.png' },
        { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm chọn thanh toán qua VNPay', image: '/original_assets/imageefc9.png' },
        { number: '03', description: 'Quét mã QR hiển thị và nhập mã giảm giá ưu đãi 1ZONEVNPay', image: '/original_assets/image837f.png' },
        { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động ghi nhận điểm số bình chọn', image: '/original_assets/image20da.png' }
      ]
    },
    {
      title: 'Thanh toán qua ví điện tử MOMO',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="9" cy="12" r="1.5"></circle>
          <circle cx="15" cy="12" r="1.5"></circle>
          <path d="M8 15h8"></path>
        </svg>
      ),
      steps: [
        { number: '01', description: 'Truy cập danh sách thí sinh, lựa chọn ứng viên bạn muốn ủng hộ', image: '/original_assets/image17ae.png' },
        { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm chọn thanh toán qua ví MOMO', image: '/original_assets/image8ca3.png' },
        { number: '03', description: 'Sử dụng ứng dụng MOMO trên điện thoại quét mã QR hiển thị để thanh toán', image: '/original_assets/imagebf6f.png' },
        { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động ghi nhận điểm số bình chọn', image: '/original_assets/image20da.png' }
      ]
    },
    {
      title: 'Thanh toán qua cổng PayPal',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
          <path d="M6 17h12"></path>
        </svg>
      ),
      steps: [
        { number: '01', description: 'Truy cập danh sách thí sinh, lựa chọn ứng viên bạn muốn ủng hộ', image: '/original_assets/image17ae.png' },
        { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm chọn thanh toán qua PayPal', image: '/original_assets/image9d6d.png' },
        { number: '03', description: 'Nhập thông tin tài khoản thanh toán quốc tế PayPal để xác thực', image: '/original_assets/image1206.png' },
        { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động ghi nhận điểm số bình chọn', image: '/original_assets/image20da.png' }
      ]
    }
  ];

  const exchangeRates = [
    { points: '5 Điểm', price: 'Miễn phí (01 lượt / ngày)' },
    { points: '10 Điểm', price: '10,000 VND' },
    { points: '20 Điểm', price: '20,000 VND' },
    { points: '50 Điểm', price: '50,000 VND' },
    { points: '220 Điểm', price: '100,000 VND' },
    { points: '1,050 Điểm', price: '500,000 VND' },
    { points: '2,300 Điểm', price: '1,000,000 VND' },
    { points: '7,000 Điểm', price: '3,000,000 VND' }
  ];

  return (
    <>
      <main className="bg-radial-gradient flex-1 min-h-screen py-12 sm:py-20 relative overflow-hidden">
        
        {/* Decorative ambient neon background glows */}
        <div className="absolute top-[5%] left-[-15%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#0A2FFF]/8 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[40%] right-[-15%] w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-[#79BCC2]/8 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-[#0A2FFF]/6 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none"></div>

        {/* Global Wrapper */}
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Main Title Center */}
          <div className="flex flex-col space-y-3 text-center mb-16 sm:mb-24">
            <span className="text-[#79BCC2] text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase">
              Cẩm nang bình chọn chính thức
            </span>
            <h2 className="text-[28px] sm:text-[46px] tracking-[-1px] font-extrabold uppercase text-white bg-gradient-to-r from-white via-white/95 to-[#79BCC2] bg-clip-text text-transparent leading-none">
              HƯỚNG DẪN BÌNH CHỌN
            </h2>
            <h3 className="text-[14px] sm:text-[18px] tracking-[0.2em] uppercase font-medium text-white/40">
              HUIT's Iconic
            </h3>
            <div className="h-[3.5px] w-[70px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-3.5"></div>
          </div>

          {/* Iterate sections */}
          <div className="space-y-20 sm:space-y-28">
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-8 sm:space-y-10">
                
                {/* Section Header with Line Divider */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-[#79BCC2]/10 rounded-xl border border-[#79BCC2]/20">
                      {section.icon}
                    </div>
                    <h4 className="text-[18px] sm:text-[22px] font-extrabold text-white uppercase tracking-wider">
                      {section.title}
                    </h4>
                  </div>
                </div>

                {/* 2x2 Step Bento Lưới Lớn (Legible image text sizes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {section.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col justify-between backdrop-blur-md bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-[#79BCC2]/30 rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(10,47,255,0.08)]"
                    >
                      {/* Step Header */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-black tracking-widest text-[#79BCC2] uppercase bg-[#79BCC2]/10 px-3 py-1 rounded-full border border-[#79BCC2]/20">
                            Bước {step.number}
                          </span>
                        </div>
                        <p className="text-[14px] sm:text-[15px] font-semibold text-white/90 leading-relaxed mb-5 group-hover:text-white transition-colors">
                          {step.description}
                        </p>
                      </div>

                      {/* Framed image mockup */}
                      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 aspect-[431/244] w-full shadow-2xl">
                        <img
                          alt={`Bước ${step.number}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                          src={step.image}
                        />
                        {/* Hover shadow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* Exchange point Section */}
          <div className="mt-24 sm:mt-32 pt-12 sm:pt-16 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-8 sm:mb-10">
              <div className="p-2.5 bg-[#79BCC2]/10 rounded-xl border border-[#79BCC2]/20 text-[#79BCC2]">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h4 className="text-[18px] sm:text-[22px] font-extrabold text-white uppercase tracking-wider">
                Bảng Quy đổi điểm &amp; Giá trị quy đổi
              </h4>
            </div>

            {/* Glassmorphic Table (Full Width) */}
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between w-full max-w-5xl mx-auto">
              <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <p className="text-[13px] text-white/50 leading-relaxed">
                  Điểm bình chọn được tự động quy đổi ngay khi hệ thống Momo hoặc VNPay xác nhận thanh toán giao dịch thành công. Mỗi tài khoản có 01 lượt bình chọn miễn phí hàng ngày (được làm mới sau 00:00).
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.04] text-white/60 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider border-b border-white/5">
                      <th className="py-4 px-6">Gói bình chọn</th>
                      <th className="py-4 px-6 text-right">Giá trị tương ứng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {exchangeRates.map((rate, index) => (
                      <tr
                        key={index}
                        className="text-[13px] sm:text-[14px] text-white/80 hover:bg-[#79BCC2]/5 transition-all duration-150"
                      >
                        <td className="py-3.5 px-6 font-semibold flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#79BCC2] shadow-[0_0_8px_#79BCC2]"></span>
                          {rate.points}
                        </td>
                        <td className="py-3.5 px-6 text-right font-medium text-white">
                          {rate.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
