import React from 'react';

export default function RulesPage() {
  return (
    <div className="w-full max-w-[800px] mx-auto px-6 py-16 flex flex-col">
      <div className="text-center mb-12">
        <h1 className="text-[28px] sm:text-[42px] font-extrabold uppercase tracking-wide text-white">
          Hướng dẫn &amp; Thể lệ
        </h1>
        <p className="text-[16px] sm:text-[22px] text-secondary font-medium tracking-widest uppercase mt-2">
          HUIT's Iconic
        </p>
      </div>

      <div className="w-full bg-[rgba(222,222,222,0.04)] border border-white/5 p-6 sm:p-10 rounded-[24px] flex flex-col space-y-8">
        
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-[18px]">
            1
          </div>
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold text-white uppercase">Bước 1: Chọn thí sinh yêu thích</h3>
            <p className="text-[14px] text-white/70 mt-1">
              Truy cập vào trang chủ "Trang bình chọn", tìm kiếm thí sinh bạn muốn bình chọn bằng cách nhập Tên hoặc Số báo danh (SBD).
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-[18px]">
            2
          </div>
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold text-white uppercase">Bước 2: Click nút Bình chọn</h3>
            <p className="text-[14px] text-white/70 mt-1">
              Bấm vào nút "Bình chọn" dưới thẻ thí sinh hoặc nhấn trực tiếp để đi tới trang thông tin chi tiết của thí sinh đó.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-[18px]">
            3
          </div>
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold text-white uppercase">Bước 3: Đăng nhập &amp; Xác nhận</h3>
            <p className="text-[14px] text-white/70 mt-1">
              Xác thực thông tin tài khoản qua Google hoặc Đăng nhập trực tiếp và bấm xác nhận hoàn thành bình chọn. Mỗi lượt bình chọn sẽ được cộng vào điểm số hiển thị theo thời gian thực.
            </p>
          </div>
        </div>

        {/* Rules note alert box */}
        <div className="p-4 rounded-[16px] bg-[rgba(10,47,255,0.06)] border border-primary/20 text-white/80 text-[13px] leading-relaxed">
          <span className="font-bold text-secondary">Lưu ý quan trọng:</span> Cổng bình chọn sẽ tự động đóng lại vào lúc 23h59 ngày 10/11/2024. Mọi hành vi gian lận (sử dụng bot hoặc giả lập số điện thoại ảo) sẽ bị hệ thống tự động lọc và loại trừ điểm số hợp lệ.
        </div>

      </div>
    </div>
  );
}
