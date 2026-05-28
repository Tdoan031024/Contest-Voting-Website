'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsAdminPage() {
  // Gate settings state
  const [isGateOpen, setIsGateOpen] = useState(true);
  const [startDate, setStartDate] = useState('2024-10-20T00:00');
  const [endDate, setEndDate] = useState('2024-11-24T23:59');
  const [maxVotesPerPhone, setMaxVotesPerPhone] = useState(5);

  // General settings state
  const [eventTitle, setEventTitle] = useState("HUIT's Iconic 2024");
  const [organizer, setOrganizer] = useState("Trường Đại học Công Thương TP.HCM (HUIT)");
  const [contactEmail, setContactEmail] = useState("support@voting.vn");

  // Maintenance state
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        if (res.ok) {
          const data = await res.json();
          setIsGateOpen(data.isGateOpen);
          setStartDate(data.startDate);
          setEndDate(data.endDate);
          setMaxVotesPerPhone(data.maxVotesPerPhone);
          setEventTitle(data.eventTitle);
          setOrganizer(data.organizer);
          setContactEmail(data.contactEmail);
          setIsMaintenanceMode(data.isMaintenanceMode);
        }
      } catch (err) {
        console.error('Failed to load system settings from backend, using defaults.', err);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      isGateOpen,
      startDate,
      endDate,
      maxVotesPerPhone,
      eventTitle,
      organizer,
      contactEmail,
      isMaintenanceMode
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        alert('Đã lưu cấu hình hệ thống thành công!');
        return;
      }
    } catch (err) {
      console.error('Failed to save settings to API.', err);
    }
    alert('Không thể kết nối đến backend API. Lưu cấu hình thất bại!');
  };

  const handleResetVotes = async () => {
    const confirm1 = confirm('CẢNH BÁO NGUY HIỂM: Bạn có chắc chắn muốn đặt lại (RESET) toàn bộ số phiếu bình chọn của tất cả các thí sinh về 0 không?');
    if (!confirm1) return;
    const confirm2 = confirm('XÁC NHẬN LẦN CUỐI: Hành động này sẽ xóa sạch số lượt vote hiện tại và không thể khôi phục lại được. Nhấn OK để thực hiện.');
    if (!confirm2) return;

    try {
      const res = await fetch('http://localhost:5000/api/admin/settings/reset-votes', {
        method: 'POST'
      });
      if (res.ok) {
        alert('Đã thiết lập lại toàn bộ điểm bình chọn của thí sinh về 0 thành công!');
        return;
      }
    } catch (err) {
      console.error('Failed to reset votes on API.', err);
    }
    alert('Không thể kết nối đến backend API. Đặt lại số phiếu thất bại!');
  };

  return (
    <div className="flex flex-col space-y-4 max-w-4xl">
      
      {/* Title Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Thiết lập hệ thống</p>
          <h1 className="text-lg font-black text-[#123c34]">Cấu hình cổng bình chọn</h1>
          <p className="text-xs text-[#6b7773] mt-0.5">Điều chỉnh thời gian mở cổng bình chọn, giới hạn lượt vote và thiết lập bảo trì.</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4">
        
        {/* Voting Gate Settings Block */}
        <div className="bg-white border border-[#dce5e1] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#123c34] border-b border-[#edf2f0] pb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0f766e]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Thời gian & Cổng bình chọn
          </h3>
          
          <div className="flex items-center justify-between p-3 bg-[#fbfdfc] rounded-xl border border-[#dce5e1] shadow-sm">
            <div>
              <p className="font-bold text-xs text-[#123c34]">Trạng thái cổng bình chọn</p>
              <p className="text-[10px] text-[#6b7773]">Cho phép hoặc tạm đóng cổng bình chọn đối với công chúng.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsGateOpen(!isGateOpen)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative flex items-center ${isGateOpen ? 'bg-emerald-600' : 'bg-slate-200'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 absolute ${isGateOpen ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Thời gian bắt đầu mở cổng</label>
              <input 
                type="datetime-local" 
                className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Thời gian đóng cổng bình chọn</label>
              <input 
                type="datetime-local" 
                className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5 w-full md:w-1/2">
            <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Giới hạn số phiếu bầu / mỗi số điện thoại</label>
            <input 
              type="number" 
              className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
              value={maxVotesPerPhone} 
              onChange={e => setMaxVotesPerPhone(Number(e.target.value))} 
              min={1}
            />
            <p className="text-[10px] text-[#6b7773]">Số lượng bầu chọn tối đa mà một số điện thoại có thể thực hiện trong toàn sự kiện.</p>
          </div>
        </div>

        {/* General Settings Block */}
        <div className="bg-white border border-[#dce5e1] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#123c34] border-b border-[#edf2f0] pb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0f766e]"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Thông tin chương trình & Liên hệ
          </h3>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tên sự kiện / Cuộc thi</label>
            <input 
              type="text" 
              className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
              value={eventTitle} 
              onChange={e => setEventTitle(e.target.value)} 
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đơn vị tổ chức</label>
            <input 
              type="text" 
              className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
              value={organizer} 
              onChange={e => setOrganizer(e.target.value)} 
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5 w-full md:w-1/2">
            <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Email hỗ trợ kỹ thuật</label>
            <input 
              type="email" 
              className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
              value={contactEmail} 
              onChange={e => setContactEmail(e.target.value)} 
              required
            />
          </div>
        </div>

        {/* System Maintenance Block */}
        <div className="bg-white border border-[#dce5e1] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#123c34] border-b border-[#edf2f0] pb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0f766e]"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Vận hành hệ thống & Khôi phục dữ liệu
          </h3>

          <div className="flex items-center justify-between p-3 bg-[#fbfdfc] rounded-xl border border-[#dce5e1] shadow-sm">
            <div>
              <p className="font-bold text-xs text-[#123c34]">Chế độ bảo trì (Maintenance Mode)</p>
              <p className="text-[10px] text-[#6b7773]">Tạm dừng truy cập và hiển thị trang thông báo bảo trì đối với người dùng public.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative flex items-center ${isMaintenanceMode ? 'bg-red-600' : 'bg-slate-200'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 absolute ${isMaintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
            <div>
              <p className="font-bold text-red-700 text-xs">Đặt lại toàn bộ số phiếu bình chọn</p>
              <p className="text-[10px] text-red-600/80 font-medium">Đặt số phiếu bình chọn của tất cả các thí sinh về 0. Hành động này không thể khôi phục!</p>
            </div>
            <button
              type="button"
              onClick={handleResetVotes}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold text-[10px] transition-colors shadow self-start md:self-auto active:scale-[0.98]"
            >
              Reset toàn bộ vote
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="submit" 
            className="px-5 py-2 bg-[#123c34] hover:bg-[#0f766e] rounded-lg text-white text-[11px] font-bold transition shadow active:scale-[0.98]"
          >
            Lưu cấu hình hệ thống
          </button>
        </div>

      </form>
    </div>
  );
}
