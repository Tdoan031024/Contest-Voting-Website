'use client';

import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '@huitfest/shared';
import { apiUrl } from '../api';

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
      const res = await fetch(apiUrl('/api/timeline'));
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
      const res = await fetch(apiUrl('/api/admin/timeline'), {
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
      const res = await fetch(apiUrl(`/api/admin/timeline/${selectedEvent.id}`), {
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
      const res = await fetch(apiUrl(`/api/admin/timeline/${id}`), {
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
    <div className="flex flex-col space-y-4">
      
      {/* Title Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quản lý lộ trình</p>
          <h1 className="text-lg font-black text-[#123c34]">Lộ trình cuộc thi</h1>
          <p className="text-xs text-[#6b7773] mt-0.5">Danh sách các giai đoạn, vòng thi và thời gian diễn ra của HUIT's Iconic.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-3.5 py-2 bg-[#e45136] hover:bg-[#c83f28] rounded-lg text-white font-bold text-[11px] shadow transition active:scale-[0.98]"
        >
          + Thêm mốc thời gian mới
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="w-full max-w-md">
        <input 
          type="text" 
          placeholder="Tìm kiếm mốc thời gian theo tiêu đề, mô tả..." 
          className="w-full h-9 px-4 rounded-lg bg-white border border-[#dce5e1] text-[#18211f] placeholder-[#9aa9a4] text-xs focus:outline-none focus:border-[#0f766e] transition-colors shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Timeline Table */}
      <div className="w-full bg-white border border-[#dce5e1] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left text-[#18211f]">
          <thead className="bg-[#fbfdfc] text-[10px] font-black uppercase tracking-wider text-[#7a8b85] border-b border-[#edf2f0]">
            <tr>
              <th className="px-5 py-3">Vòng thi / Tiêu đề</th>
              <th className="px-5 py-3">Thời gian diễn ra</th>
              <th className="px-5 py-3">Mô tả chi tiết</th>
              <th className="px-5 py-3">Trạng thái hoạt động</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2f0] text-xs">
            {filteredEvents.map(ev => (
              <tr key={ev.id} className="hover:bg-[#edf4f1]/20 transition-colors">
                <td className="px-5 py-2.5 font-bold text-[#123c34]">{ev.title}</td>
                <td className="px-5 py-2.5 text-[#0f766e] font-semibold">{ev.date}</td>
                <td className="px-5 py-2.5 max-w-[300px] truncate text-[#6b7773] font-medium">{ev.description}</td>
                <td className="px-5 py-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    ev.isActive 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {ev.isActive ? 'ĐANG HOẠT ĐỘNG' : 'CHƯA KÍCH HOẠT'}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button 
                      onClick={() => openEditModal(ev)}
                      className="rounded-lg border border-[#dce5e1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#0f766e] transition hover:bg-[#edf4f1] hover:border-[#0f766e]"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(ev.id)}
                      className="rounded-lg border border-[#f0c9bd] bg-[#fff5f2] px-2.5 py-1 text-[11px] font-bold text-[#c83f28] transition hover:bg-[#e45136]/10 hover:border-[#e45136]"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD TIMELINE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#10211d]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <form onSubmit={handleAddSubmit} className="bg-white border border-[#dce5e1] p-5 rounded-xl w-full max-w-[420px] flex flex-col space-y-3.5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-black text-[#123c34] border-b border-[#edf2f0] pb-2.5">Thêm mốc thời gian mới</h3>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tên vòng thi / Tiêu đề</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formTitle} onChange={e => setFormTitle(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Thời gian diễn ra (Ví dụ: 03/11/2024 - 15/11/2024)</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formDate} onChange={e => setFormDate(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Mô tả chi tiết</label>
              <textarea className="h-20 p-3 rounded-xl bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} required />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#fbfdfc] border border-[#dce5e1] rounded-xl shadow-sm">
              <div>
                <p className="font-bold text-xs text-[#123c34]">Đặt làm vòng thi hiện tại</p>
                <p className="text-[10px] text-[#6b7773]">Hiển thị huy hiệu Đang hoạt động trên trang chủ.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded accent-[#0f766e] cursor-pointer" checked={formActive} onChange={e => setFormActive(e.target.checked)} />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#edf2f0]">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3.5 py-1.5 border border-[#dce5e1] hover:bg-[#edf4f1] rounded-lg text-[#52605b] text-[10px] font-bold transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-3.5 py-1.5 bg-[#123c34] hover:bg-[#0f766e] rounded-lg text-white text-[10px] font-bold shadow transition-colors">Thêm mới</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT TIMELINE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#10211d]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <form onSubmit={handleEditSubmit} className="bg-white border border-[#dce5e1] p-5 rounded-xl w-full max-w-[420px] flex flex-col space-y-3.5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-black text-[#123c34] border-b border-[#edf2f0] pb-2.5">Chỉnh sửa mốc thời gian</h3>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tên vòng thi / Tiêu đề</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formTitle} onChange={e => setFormTitle(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Thời gian diễn ra</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formDate} onChange={e => setFormDate(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Mô tả chi tiết</label>
              <textarea className="h-20 p-3 rounded-xl bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} required />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#fbfdfc] border border-[#dce5e1] rounded-xl shadow-sm">
              <div>
                <p className="font-bold text-xs text-[#123c34]">Đặt làm vòng thi hiện tại</p>
                <p className="text-[10px] text-[#6b7773]">Hiển thị huy hiệu Đang hoạt động trên trang chủ.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded accent-[#0f766e] cursor-pointer" checked={formActive} onChange={e => setFormActive(e.target.checked)} />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#edf2f0]">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-3.5 py-1.5 border border-[#dce5e1] hover:bg-[#edf4f1] rounded-lg text-[#52605b] text-[10px] font-bold transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-3.5 py-1.5 bg-[#123c34] hover:bg-[#0f766e] rounded-xl text-white text-[10px] font-bold shadow transition-colors">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
