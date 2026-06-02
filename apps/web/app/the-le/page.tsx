'use client';

import React, { useEffect, useState } from 'react';
import { apiUrl } from '../api';

interface Step {
  number: string;
  description: string;
  image: string;
}

interface SectionConfig {
  title: string;
  steps: Step[];
}

interface ExchangeRate {
  points: string;
  price: string;
}

const defaultSections: SectionConfig[] = [
  {
    title: 'Hướng dẫn bình chọn miễn phí',
    steps: [
      { number: '01', description: 'Tạo tài khoản mới hoặc đăng nhập nhanh bằng tài khoản Google.', image: '/original_assets/imagefca6.png' },
      { number: '02', description: 'Đăng nhập tài khoản để nhận lượt bình chọn miễn phí hằng ngày.', image: '/original_assets/imagef1be.png' },
      { number: '03', description: 'Tìm kiếm và lựa chọn dự án hoặc thí sinh bạn muốn bình chọn.', image: '/original_assets/image81d3.png' },
      { number: '04', description: 'Chọn gói 5 điểm miễn phí, hệ thống ghi nhận điểm sau khi xác nhận thành công.', image: '/original_assets/image20da.png' },
    ],
  },
  {
    title: 'Thanh toán qua cổng VNPay',
    steps: [
      { number: '01', description: 'Truy cập danh sách dự án, chọn hồ sơ bạn muốn ủng hộ.', image: '/original_assets/image17ae.png' },
      { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm thanh toán qua VNPay.', image: '/original_assets/imageefc9.png' },
      { number: '03', description: 'Quét mã QR hoặc nhập thông tin thanh toán theo hướng dẫn của cổng VNPay.', image: '/original_assets/image837f.png' },
      { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động cộng điểm và lưu lịch sử bình chọn.', image: '/original_assets/image20da.png' },
    ],
  },
  {
    title: 'Thanh toán qua ví điện tử MOMO',
    steps: [
      { number: '01', description: 'Truy cập danh sách dự án, chọn hồ sơ bạn muốn ủng hộ.', image: '/original_assets/image17ae.png' },
      { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm thanh toán qua ví MOMO.', image: '/original_assets/image8ca3.png' },
      { number: '03', description: 'Sử dụng ứng dụng MOMO trên điện thoại để quét mã QR thanh toán.', image: '/original_assets/imagebf6f.png' },
      { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động cộng điểm và lưu lịch sử bình chọn.', image: '/original_assets/image20da.png' },
    ],
  },
  {
    title: 'Thanh toán qua cổng PayPal',
    steps: [
      { number: '01', description: 'Truy cập danh sách dự án, chọn hồ sơ bạn muốn ủng hộ.', image: '/original_assets/image17ae.png' },
      { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm thanh toán qua PayPal.', image: '/original_assets/image9d6d.png' },
      { number: '03', description: 'Nhập thông tin tài khoản PayPal để xác thực giao dịch.', image: '/original_assets/image1206.png' },
      { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động cộng điểm và lưu lịch sử bình chọn.', image: '/original_assets/image20da.png' },
    ],
  },
];

const defaultExchangeRates: ExchangeRate[] = [
  { points: '5 Điểm', price: 'Miễn phí (01 lượt / ngày)' },
  { points: '10 Điểm', price: '10,000 VND' },
  { points: '20 Điểm', price: '20,000 VND' },
  { points: '50 Điểm', price: '50,000 VND' },
  { points: '220 Điểm', price: '100,000 VND' },
  { points: '1,050 Điểm', price: '500,000 VND' },
  { points: '2,300 Điểm', price: '1,000,000 VND' },
  { points: '7,000 Điểm', price: '3,000,000 VND' },
];

function normalizeSections(rawSections: any[]): SectionConfig[] {
  const stepSections = rawSections.filter((section) => Array.isArray(section.steps) && section.steps.length > 0);
  if (stepSections.length === 0) return defaultSections;
  return stepSections.map((section, index) => ({
    title: section.title || `Mục ${index + 1}`,
    steps: section.steps,
  }));
}

function normalizeRates(rawRates: any[]): ExchangeRate[] {
  const rates = rawRates
    .map((rate) => ({
      points: String(rate.pointsLabel || rate.label || (rate.points ? `${Number(rate.points).toLocaleString('vi-VN')} Điểm` : '')),
      price: String(rate.priceLabel || (Number(rate.price) > 0 ? `${Number(rate.price).toLocaleString('vi-VN')} VND` : 'Miễn phí (01 lượt / ngày)')),
    }))
    .filter((rate) => rate.points && rate.price);
  return rates.length > 0 ? rates : defaultExchangeRates;
}

const sectionIcons = [
  (
    <svg key="heart" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  (
    <svg key="card" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  (
    <svg key="wallet" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <path d="M8 15h8" />
    </svg>
  ),
];

export default function TheLePage() {
  const [sections, setSections] = useState<SectionConfig[]>(defaultSections);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(defaultExchangeRates);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/settings'));
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.guideSections) && data.guideSections.length > 0) {
          setSections(normalizeSections(data.guideSections));
        }
        if (Array.isArray(data.exchangeRates) && data.exchangeRates.length > 0) {
          setExchangeRates(normalizeRates(data.exchangeRates));
        }
      } catch (err) {
        console.error('Failed to load guide settings', err);
      }
    }

    loadSettings();
  }, []);

  return (
    <>
      <style>{`
        .iUzfqH {
          background-image: url(/media-platform.1vote.vn/uploads/tAtj0/1727187460437.jpg);
          background-color: #030612;
          background-attachment: fixed;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>
      <main className="sc-908a50-0 iUzfqH flex-1 min-h-screen pb-16 mt-[-80px] pt-[128px] sm:pt-[160px] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col space-y-3 text-center mb-16 sm:mb-24">
            <span className="text-[#79BCC2] text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase">
              Cẩm nang bình chọn chính thức
            </span>
            <h2 className="text-[28px] sm:text-[46px] tracking-[-1px] font-extrabold uppercase text-white leading-none">
              Hướng dẫn & Thể lệ
            </h2>
            <h3 className="text-[14px] sm:text-[18px] tracking-[0.2em] uppercase font-medium text-white/50">
              HUIT STARTUP
            </h3>
            <div className="h-[3.5px] w-[70px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-3.5" />
          </div>

          <div className="space-y-20 sm:space-y-28">
            {sections.map((section, sIdx) => (
              <div key={`${section.title}-${sIdx}`} className="space-y-8 sm:space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-[#79BCC2]/10 rounded-xl border border-[#79BCC2]/20">
                      {sectionIcons[sIdx % sectionIcons.length]}
                    </div>
                    <h4 className="text-[18px] sm:text-[22px] font-extrabold text-white uppercase tracking-wider">
                      {section.title}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {section.steps.map((step, idx) => (
                    <div
                      key={`${step.number}-${idx}`}
                      className="group flex flex-col justify-between backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 hover:border-[#79BCC2]/30 rounded-[20px] p-6 transition-all duration-300"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-black tracking-widest text-[#79BCC2] uppercase bg-[#79BCC2]/10 px-3 py-1 rounded-full border border-[#79BCC2]/20">
                            Bước {step.number}
                          </span>
                        </div>
                        <p className="text-[14px] sm:text-[15px] font-semibold text-white/90 leading-relaxed mb-5 whitespace-pre-line text-justify">
                          {step.description}
                        </p>
                      </div>

                      {step.image ? (
                        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 aspect-[431/244] w-full shadow-2xl">
                          <img
                            alt={`Bước ${step.number}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            src={step.image}
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 sm:mt-32 pt-12 sm:pt-16 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-8 sm:mb-10">
              <div className="p-2.5 bg-[#79BCC2]/10 rounded-xl border border-[#79BCC2]/20 text-[#79BCC2]">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h4 className="text-[18px] sm:text-[22px] font-extrabold text-white uppercase tracking-wider">
                Bảng quy đổi điểm & giá trị quy đổi
              </h4>
            </div>

            <div className="backdrop-blur-md bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl mx-auto">
              <div className="p-6 border-b border-white/10">
                <p className="text-[13px] text-white/60 leading-relaxed">
                  Điểm bình chọn được tự động cộng sau khi hệ thống xác nhận giao dịch thành công. Giá hiển thị đã bao gồm VAT 10%.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.05] text-white/60 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider border-b border-white/10">
                      <th className="py-4 px-6">Gói bình chọn</th>
                      <th className="py-4 px-6 text-right">Giá trị tương ứng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {exchangeRates.map((rate, index) => (
                      <tr key={index} className="text-[13px] sm:text-[14px] text-white/80 hover:bg-[#79BCC2]/5 transition-all duration-150">
                        <td className="py-3.5 px-6 font-semibold flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#79BCC2] shadow-[0_0_8px_#79BCC2]" />
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
