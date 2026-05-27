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
    const confirm1 = confirm('CẢNH BÁO NGUY HIỂM: Bạn có chắc chắn muốn RESET toàn bộ số phiếu bình chọn của các thí sinh về 0?');
    if (!confirm1) return;
    const confirm2 = confirm('XÁC NHẬN LẦN CUỐI: Hành động này không thể hoàn tác. Nhấn OK để thực hiện reset.');
    if (!confirm2) return;

    try {
      const res = await fetch('http://localhost:5000/api/admin/settings/reset-votes', {
        method: 'POST'
      });
      if (res.ok) {
        alert('Đã reset toàn bộ điểm bình chọn của thí sinh về 0 thành công!');
        return;
      }
    } catch (err) {
      console.error('Failed to reset votes on API.', err);
    }
    alert('Không thể kết nối đến backend API. Đặt lại số phiếu thất bại!');
  };

  return (
    <div className="flex flex-col space-y-8 max-w-4xl">
      
      {/* Title Header */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-100">Cấu hình Cổng bình chọn</h1>
        <p className="text-[14px] text-slate-400 mt-1">Quản lý trạng thái cổng bình chọn, thời gian và các cài đặt hệ thống.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Voting Gate Settings Block */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
          <h3 className="text-[16px] font-bold text-blue-400 border-b border-slate-700 pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Thiết lập Cổng Bình chọn
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div>
              <p className="font-semibold text-slate-200 text-[14px]">Trạng thái cổng bình chọn</p>
              <p className="text-[12px] text-slate-400">Cho phép hoặc chặn người dùng bình chọn cho thí sinh.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsGateOpen(!isGateOpen)}
              className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${isGateOpen ? 'bg-green-600' : 'bg-slate-600'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white transition-transform absolute ${isGateOpen ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-[13px] font-medium text-slate-300">Thời gian bắt đầu</label>
              <input 
                type="datetime-local" 
                className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[13px] font-medium text-slate-300">Thời gian kết thúc</label>
              <input 
                type="datetime-local" 
                className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-full md:w-1/2">
            <label className="text-[13px] font-medium text-slate-300">Giới hạn số phiếu bầu / số điện thoại</label>
            <input 
              type="number" 
              className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
              value={maxVotesPerPhone} 
              onChange={e => setMaxVotesPerPhone(Number(e.target.value))} 
              min={1}
            />
            <p className="text-[11px] text-slate-400">Số lượng bình chọn tối đa mỗi số điện thoại được thực hiện trong suốt sự kiện.</p>
          </div>
        </div>

        {/* General Settings Block */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
          <h3 className="text-[16px] font-bold text-blue-400 border-b border-slate-700 pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Thông tin Sự kiện
          </h3>

          <div className="flex flex-col space-y-2">
            <label className="text-[13px] font-medium text-slate-300">Tên sự kiện / Cuộc thi</label>
            <input 
              type="text" 
              className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
              value={eventTitle} 
              onChange={e => setEventTitle(e.target.value)} 
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-[13px] font-medium text-slate-300">Đơn vị tổ chức</label>
            <input 
              type="text" 
              className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
              value={organizer} 
              onChange={e => setOrganizer(e.target.value)} 
              required
            />
          </div>

          <div className="flex flex-col space-y-2 w-full md:w-1/2">
            <label className="text-[13px] font-medium text-slate-300">Email hỗ trợ kỹ thuật</label>
            <input 
              type="email" 
              className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
              value={contactEmail} 
              onChange={e => setContactEmail(e.target.value)} 
              required
            />
          </div>
        </div>

        {/* System Maintenance Block */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
          <h3 className="text-[16px] font-bold text-blue-400 border-b border-slate-700 pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Cấu hình Hệ thống & Bảo mật
          </h3>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div>
              <p className="font-semibold text-slate-200 text-[14px]">Chế độ bảo trì (Maintenance Mode)</p>
              <p className="text-[12px] text-slate-400">Hiển thị màn hình thông báo bảo trì đối với người dùng truy cập web public.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
              className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${isMaintenanceMode ? 'bg-red-600' : 'bg-slate-600'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white transition-transform absolute ${isMaintenanceMode ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-red-400 text-[14px]">Xóa trắng dữ liệu bình chọn</p>
              <p className="text-[12px] text-slate-400">Reset toàn bộ số lượt vote của các thí sinh về 0. Thao tác cực kỳ nguy hiểm!</p>
            </div>
            <button
              type="button"
              onClick={handleResetVotes}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium text-[13px] transition-colors"
            >
              Reset toàn bộ vote
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[14px] font-semibold transition-colors shadow-md"
          >
            Lưu tất cả thay đổi
          </button>
        </div>

      </form>
    </div>
  );
}
