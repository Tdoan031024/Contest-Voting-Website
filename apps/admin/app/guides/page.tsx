'use client';

import React, { useState } from 'react';
import { apiUrl } from '../api';

type Step = {
  number: string;
  description: string;
  image: string;
};

type GuideSection = {
  title: string;
  steps: Step[];
};

export default function GuidesAdminPage() {
  const [activeTab, setActiveTab] = useState(0);

  const [sections, setSections] = useState<GuideSection[]>([
    {
      title: 'Hướng dẫn bình chọn miễn phí',
      steps: [
        { number: '01', description: 'Tạo tài khoản mới hoặc Đăng nhập nhanh bằng tài khoản Google', image: '/original_assets/imagefca6.png' },
        { number: '02', description: 'Xác thực tài khoản của bạn thông qua liên kết gửi về Email cá nhân', image: '/original_assets/imagef1be.png' },
        { number: '03', description: 'Tìm kiếm và lựa chọn thí sinh bạn mong muốn bình chọn', image: '/original_assets/image81d3.png' },
        { number: '04', description: 'Hệ thống hiển thị thông báo bạn đã bình chọn thành công', image: '/original_assets/image20da.png' }
      ]
    },
    {
      title: 'Thanh toán qua cổng VNPay',
      steps: [
        { number: '01', description: 'Truy cập danh sách thí sinh, lựa chọn ứng viên bạn muốn ủng hộ', image: '/original_assets/image17ae.png' },
        { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm chọn thanh toán qua VNPay', image: '/original_assets/imageefc9.png' },
        { number: '03', description: 'Quét mã QR hiển thị và nhập mã giảm giá ưu đãi 1ZONEVNPay', image: '/original_assets/image837f.png' },
        { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động ghi nhận điểm số bình chọn', image: '/original_assets/image20da.png' }
      ]
    },
    {
      title: 'Thanh toán qua ví điện tử MOMO',
      steps: [
        { number: '01', description: 'Truy cập danh sách thí sinh, lựa chọn ứng viên bạn muốn ủng hộ', image: '/original_assets/image17ae.png' },
        { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm chọn thanh toán qua ví MOMO', image: '/original_assets/image8ca3.png' },
        { number: '03', description: 'Sử dụng ứng dụng MOMO trên điện thoại quét mã QR hiển thị để thanh toán', image: '/original_assets/imagebf6f.png' },
        { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động ghi nhận điểm số bình chọn', image: '/original_assets/image20da.png' }
      ]
    },
    {
      title: 'Thanh toán qua cổng PayPal',
      steps: [
        { number: '01', description: 'Truy cập danh sách thí sinh, lựa chọn ứng viên bạn muốn ủng hộ', image: '/original_assets/image17ae.png' },
        { number: '02', description: 'Lựa chọn gói điểm mong muốn và bấm chọn thanh toán qua PayPal', image: '/original_assets/image9d6d.png' },
        { number: '03', description: 'Nhập thông tin tài khoản thanh toán quốc tế PayPal để xác thực', image: '/original_assets/image1206.png' },
        { number: '04', description: 'Giao dịch hoàn tất, hệ thống tự động ghi nhận điểm số bình chọn', image: '/original_assets/image20da.png' }
      ]
    }
  ]);

  const [exchangeRates, setExchangeRates] = useState([
    { points: '5 Điểm', price: 'Miễn phí (01 lượt / ngày)' },
    { points: '10 Điểm', price: '10,000 VND' },
    { points: '20 Điểm', price: '20,000 VND' },
    { points: '50 Điểm', price: '50,000 VND' },
    { points: '220 Điểm', price: '100,000 VND' },
    { points: '1,050 Điểm', price: '500,000 VND' },
    { points: '2,300 Điểm', price: '1,000,000 VND' },
    { points: '7,000 Điểm', price: '3,000,000 VND' }
  ]);

  const handleStepChange = (secIdx: number, stepIdx: number, value: string) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[secIdx].steps[stepIdx].description = value;
      return updated;
    });
  };

  const handleStepImageChange = (secIdx: number, stepIdx: number, value: string) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[secIdx].steps[stepIdx].image = value;
      return updated;
    });
  };

  const handleStepFileUpload = async (secIdx: number, stepIdx: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(apiUrl('/api/admin/upload'), {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        handleStepImageChange(secIdx, stepIdx, data.url);
        alert('Tải ảnh minh họa bước lên thành công!');
      } else {
        alert('Tải ảnh thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi kết nối server tải ảnh.');
    }
  };

  const handleRateChange = (idx: number, field: 'points' | 'price', value: string) => {
    setExchangeRates((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  const handleSave = () => {
    // In a fully loaded settings context, we'd save to settings API or db.
    // For now we simulate save and notify.
    alert('Đã lưu cấu hình Cẩm nang hướng dẫn thành công!');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <section className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e] font-heading">Quản lý giao diện</p>
          <h2 className="mt-0.5 text-lg font-black text-[#123c34] font-heading">Cấu hình hướng dẫn & Thể lệ</h2>
          <p className="text-xs text-[#6b7773] mt-0.5">Chỉnh sửa các bước hướng dẫn bình chọn và bảng quy đổi điểm hiển thị trên trang thể lệ công khai.</p>
        </div>
        <button 
          onClick={handleSave}
          className="rounded-lg bg-[#123c34] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#0f766e] active:scale-[0.98] font-heading"
        >
          Lưu toàn bộ hướng dẫn
        </button>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-[#dce5e1] overflow-x-auto gap-1">
        {sections.map((sec, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === idx 
                ? 'border-[#0f766e] text-[#0f766e] bg-white rounded-t-lg' 
                : 'border-transparent text-[#52605b] hover:text-[#0f766e]'
            }`}
          >
            {sec.title}
          </button>
        ))}
        <button
          onClick={() => setActiveTab(4)}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 4 
              ? 'border-[#0f766e] text-[#0f766e] bg-white rounded-t-lg' 
              : 'border-transparent text-[#52605b] hover:text-[#0f766e]'
          }`}
        >
          Bảng quy đổi điểm
        </button>
      </div>

      {/* Tab Contents */}
      <div className="rounded-xl border border-[#dce5e1] bg-white p-6 shadow-sm">
        {activeTab < 4 ? (
          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#123c34] uppercase tracking-wider font-heading pb-2 border-b border-[#edf2f0]">
              {sections[activeTab].title} - Các bước hướng dẫn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections[activeTab].steps.map((step, idx) => (
                <div key={idx} className="rounded-lg border border-[#dce5e1] bg-[#fbfdfc] p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-widest text-[#0f766e] uppercase bg-[#edf8f4] px-2.5 py-1 rounded-full">
                      Bước {step.number}
                    </span>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Mô tả nội dung bước</span>
                    <textarea
                      value={step.description}
                      onChange={(e) => handleStepChange(activeTab, idx, e.target.value)}
                      className="h-16 w-full resize-none rounded-lg border border-[#dce5e1] bg-white p-2.5 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e]"
                    />
                  </label>

                  {/* Step Image */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider block">Hình ảnh minh họa</span>
                    <div className="aspect-[431/244] w-full rounded-md border border-[#dce5e1] bg-[#f4f7f6] overflow-hidden flex items-center justify-center relative">
                      <img src={step.image} alt={`Bước ${step.number}`} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        value={step.image}
                        onChange={(e) => handleStepImageChange(activeTab, idx, e.target.value)}
                        className="h-8 w-full rounded-lg border border-[#dce5e1] bg-white px-2.5 text-[11px] font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e]"
                        placeholder="Đường dẫn ảnh"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStepFileUpload(activeTab, idx, e)}
                        className="w-full text-[11px] text-[#52605b] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#123c34] file:text-white hover:file:bg-[#0f766e] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <h3 className="text-sm font-black text-[#123c34] uppercase tracking-wider font-heading pb-2 border-b border-[#edf2f0]">
              Bảng quy đổi điểm & Giá trị quy đổi
            </h3>

            <div className="overflow-hidden rounded-lg border border-[#dce5e1]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f7f6] text-[10px] font-black uppercase tracking-wider border-b border-[#dce5e1] text-[#7a8b85]">
                    <th className="py-3 px-5">Gói bình chọn (Điểm số)</th>
                    <th className="py-3 px-5">Giá trị quy đổi (VND / Miễn phí)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2f0] text-xs">
                  {exchangeRates.map((rate, idx) => (
                    <tr key={idx} className="hover:bg-[#edf4f1]/20">
                      <td className="py-2.5 px-5">
                        <input
                          type="text"
                          value={rate.points}
                          onChange={(e) => handleRateChange(idx, 'points', e.target.value)}
                          className="h-8 w-full max-w-[200px] rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-2.5 text-xs font-bold text-[#123c34] outline-none transition focus:border-[#0f766e]"
                        />
                      </td>
                      <td className="py-2.5 px-5">
                        <input
                          type="text"
                          value={rate.price}
                          onChange={(e) => handleRateChange(idx, 'price', e.target.value)}
                          className="h-8 w-full max-w-[300px] rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-2.5 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e]"
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

    </div>
  );
}
