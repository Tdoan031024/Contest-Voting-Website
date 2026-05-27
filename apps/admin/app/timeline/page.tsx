'use client';

import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '@huitfest/shared';

export default function TimelineAdminPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Form states
  const [formDate, setFormDate] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(false);

  async function loadTimeline() {
    try {
      const res = await fetch('http://localhost:5000/api/timeline');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load timeline from backend API.', err);
    }
  }

  useEffect(() => {
    loadTimeline();
  }, []);

  const openAddModal = () => {
    setFormDate('');
    setFormTitle('');
    setFormDesc('');
    setFormActive(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (ev: TimelineEvent) => {
    setSelectedEvent(ev);
    setFormDate(ev.date);
    setFormTitle(ev.title);
    setFormDesc(ev.description);
    setFormActive(ev.isActive);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Partial<TimelineEvent> = {
      date: formDate,
      title: formTitle,
      description: formDesc,
      isActive: formActive
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        alert('Thêm mốc thời gian thành công!');
        setIsAddModalOpen(false);
        loadTimeline();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Thao tác thất bại, kiểm tra kết nối API.');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const fieldsToUpdate: Partial<TimelineEvent> = {
      date: formDate,
      title: formTitle,
      description: formDesc,
      isActive: formActive
    };

    try {
      const res = await fetch(`http://localhost:5000/api/admin/timeline/${selectedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate)
      });
      if (res.ok) {
        alert('Cập nhật mốc thời gian thành công!');
        setIsEditModalOpen(false);
        loadTimeline();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Thao tác thất bại, kiểm tra kết nối API.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mốc thời gian này không?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/timeline/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Xóa mốc thời gian thành công!');
        loadTimeline();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Thao tác thất bại, kiểm tra kết nối API.');
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] font-bold text-slate-100">Quản lý Lộ trình</h1>
          <p className="text-[14px] text-slate-400 mt-1">Danh sách các giai đoạn, vòng thi và thời gian của HUIT's Iconic.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium text-[14px] transition-colors"
        >
          + Thêm mốc thời gian
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="w-full max-w-[400px]">
        <input 
          type="text" 
          placeholder="Tìm kiếm mốc thời gian..." 
          className="w-full h-[40px] px-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Timeline Table */}
      <div className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full border-collapse text-left text-slate-200">
          <thead className="bg-slate-700/50 text-[13px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3.5">Vòng thi / Tiêu đề</th>
              <th className="px-6 py-3.5">Thời gian diễn ra</th>
              <th className="px-6 py-3.5">Mô tả</th>
              <th className="px-6 py-3.5">Kích hoạt (Trạng thái)</th>
              <th className="px-6 py-3.5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-[14px]">
            {filteredEvents.map(ev => (
              <tr key={ev.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-100">{ev.title}</td>
                <td className="px-6 py-4 text-blue-400 font-medium">{ev.date}</td>
                <td className="px-6 py-4 max-w-[300px] truncate text-slate-400">{ev.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    ev.isActive 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {ev.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => openEditModal(ev)}
                    className="text-blue-400 hover:text-blue-300 font-medium text-[13px]"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(ev.id)}
                    className="text-red-400 hover:text-red-300 font-medium text-[13px]"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD TIMELINE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Thêm Mốc thời gian</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Tên vòng thi / Tiêu đề</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formTitle} onChange={e => setFormTitle(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Thời gian diễn ra (Ví dụ: 03/11/2024 - 15/11/2024)</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formDate} onChange={e => setFormDate(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Mô tả ngắn</label>
              <textarea className="h-20 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px] resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} required />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
              <div>
                <p className="font-semibold text-[13px] text-slate-200">Kích hoạt hiển thị</p>
                <p className="text-[11px] text-slate-400">Đánh dấu đây là vòng thi hiện tại.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded accent-blue-600" checked={formActive} onChange={e => setFormActive(e.target.checked)} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 text-[14px]">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[14px] font-medium">Lưu</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT TIMELINE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleEditSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Sửa Mốc thời gian</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Tên vòng thi / Tiêu đề</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formTitle} onChange={e => setFormTitle(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Thời gian diễn ra</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formDate} onChange={e => setFormDate(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Mô tả ngắn</label>
              <textarea className="h-20 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px] resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} required />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
              <div>
                <p className="font-semibold text-[13px] text-slate-200">Kích hoạt hiển thị</p>
                <p className="text-[11px] text-slate-400">Đánh dấu đây là vòng thi hiện tại.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded accent-blue-600" checked={formActive} onChange={e => setFormActive(e.target.checked)} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 text-[14px]">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[14px] font-medium">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
