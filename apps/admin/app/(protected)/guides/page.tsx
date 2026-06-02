'use client';

import React, { useEffect, useState } from 'react';
import { apiUrl, formatAssetUrl } from '../../api';

type Step = {
  number: string;
  description: string;
  image: string;
};

type GuideSection = {
  title: string;
  steps: Step[];
};

type ExchangeRate = {
  points: string;
  price: string;
};

const defaultSections: GuideSection[] = [
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

function normalizeRates(rawRates: any[]): ExchangeRate[] {
  const rates = rawRates
    .map((rate) => ({
      points: String(rate.pointsLabel || rate.label || (rate.points ? `${Number(rate.points).toLocaleString('vi-VN')} Điểm` : '')),
      price: String(rate.priceLabel || (Number(rate.price) > 0 ? `${Number(rate.price).toLocaleString('vi-VN')} VND` : 'Miễn phí (01 lượt / ngày)')),
    }))
    .filter((rate) => rate.points && rate.price);
  return rates.length > 0 ? rates : defaultExchangeRates;
}

export default function GuidesAdminPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [sections, setSections] = useState<GuideSection[]>(defaultSections);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(defaultExchangeRates);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/settings'));
        if (!res.ok) return;
        const data = await res.json();

        const validGuideSections = Array.isArray(data.guideSections)
          ? data.guideSections.filter((section: any) => Array.isArray(section.steps) && section.steps.length > 0)
          : [];

        if (validGuideSections.length > 0) {
          setSections(validGuideSections.map((section: any, index: number) => ({
            title: section.title || `Mục ${index + 1}`,
            steps: section.steps,
          })));
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

  const handleSectionTitleChange = (sectionIndex: number, value: string) => {
    setSections((prev) => prev.map((section, index) => index === sectionIndex ? { ...section, title: value } : section));
  };

  const handleStepChange = (sectionIndex: number, stepIndex: number, value: string) => {
    setSections((prev) => prev.map((section, index) => {
      if (index !== sectionIndex) return section;
      return {
        ...section,
        steps: section.steps.map((step, idx) => idx === stepIndex ? { ...step, description: value } : step),
      };
    }));
  };

  const handleStepImageChange = (sectionIndex: number, stepIndex: number, value: string) => {
    setSections((prev) => prev.map((section, index) => {
      if (index !== sectionIndex) return section;
      return {
        ...section,
        steps: section.steps.map((step, idx) => idx === stepIndex ? { ...step, image: value } : step),
      };
    }));
  };

  const handleStepFileUpload = async (sectionIndex: number, stepIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(apiUrl('/api/admin/upload'), {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        alert('Tải ảnh thất bại.');
        return;
      }

      const data = await res.json();
      handleStepImageChange(sectionIndex, stepIndex, data.url);
      alert('Tải ảnh minh họa thành công.');
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối server tải ảnh.');
    }
  };

  const handleRateChange = (index: number, field: 'points' | 'price', value: string) => {
    setExchangeRates((prev) => prev.map((rate, idx) => idx === index ? { ...rate, [field]: value } : rate));
  };

  const handleResetDefaults = () => {
    if (!confirm('Khôi phục nội dung hướng dẫn mặc định?')) return;
    setSections(defaultSections);
    setExchangeRates(defaultExchangeRates);
    setActiveTab(0);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/settings'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideSections: sections, exchangeRates }),
      });
      if (res.ok) {
        alert('Đã lưu cấu hình Hướng dẫn & Thể lệ thành công.');
        return;
      }
    } catch (err) {
      console.error('Failed to save guide settings', err);
    }
    alert('Không thể lưu cấu hình Hướng dẫn & Thể lệ.');
  };

  const isRateTab = activeTab === sections.length;
  const activeSection = sections[activeTab];

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Quản lý giao diện</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">Cấu hình Hướng dẫn & Thể lệ</h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
            Chỉnh sửa 4 nhóm hướng dẫn bình chọn và bảng quy đổi điểm hiển thị ở trang Hướng dẫn & Thể lệ của website chính.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleResetDefaults}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            Khôi phục mặc định
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white shadow transition hover:bg-emerald-700"
          >
            Lưu toàn bộ
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-3">
          {sections.map((section, index) => (
            <button
              key={`${section.title}-${index}`}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap rounded-t-xl border-b-2 px-4 py-3 text-xs font-black transition ${
                activeTab === index
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-emerald-700'
              }`}
            >
              {section.title}
            </button>
          ))}
          <button
            onClick={() => setActiveTab(sections.length)}
            className={`whitespace-nowrap rounded-t-xl border-b-2 px-4 py-3 text-xs font-black transition ${
              isRateTab
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-emerald-700'
            }`}
          >
            Bảng quy đổi điểm
          </button>
        </div>

        <div className="p-5">
          {!isRateTab && activeSection ? (
            <div className="space-y-5">
              <label className="block space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Tiêu đề nhóm hướng dẫn</span>
                <input
                  value={activeSection.title}
                  onChange={(event) => handleSectionTitleChange(activeTab, event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </label>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {activeSection.steps.map((step, stepIndex) => (
                  <div key={`${step.number}-${stepIndex}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700">
                        Bước {step.number}
                      </span>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Nội dung bước</span>
                      <textarea
                        value={step.description}
                        onChange={(event) => handleStepChange(activeTab, stepIndex, event.target.value)}
                        className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold leading-5 text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </label>

                    <div className="mt-4 space-y-2">
                      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Ảnh minh họa</span>
                      <div className="aspect-[431/244] overflow-hidden rounded-xl border border-slate-200 bg-white">
                        {step.image ? (
                          <img src={formatAssetUrl(step.image)} alt={`Bước ${step.number}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-xs font-semibold text-slate-400">Chưa có ảnh</div>
                        )}
                      </div>
                      <input
                        value={step.image}
                        onChange={(event) => handleStepImageChange(activeTab, stepIndex, event.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600"
                        placeholder="Đường dẫn ảnh"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleStepFileUpload(activeTab, stepIndex, event)}
                        className="w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-black file:text-white hover:file:bg-emerald-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900">Bảng quy đổi điểm</h3>
                <p className="mt-1 text-xs text-slate-500">Các giá trị này hiển thị ở trang Hướng dẫn & Thể lệ công khai.</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-5 py-3">Gói bình chọn</th>
                      <th className="px-5 py-3">Giá trị quy đổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {exchangeRates.map((rate, index) => (
                      <tr key={index} className="hover:bg-emerald-50/40">
                        <td className="px-5 py-3">
                          <input
                            value={rate.points}
                            onChange={(event) => handleRateChange(index, 'points', event.target.value)}
                            className="h-9 w-full max-w-[220px] rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-emerald-600"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <input
                            value={rate.price}
                            onChange={(event) => handleRateChange(index, 'price', event.target.value)}
                            className="h-9 w-full max-w-[320px] rounded-xl border border-slate-200 bg-white px-3 font-semibold text-slate-800 outline-none focus:border-emerald-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
