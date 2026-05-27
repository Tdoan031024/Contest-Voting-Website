'use client';

import React, { useState, useEffect } from 'react';
import { Banner } from '@huitfest/shared';

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLink, setFormLink] = useState('');

  async function loadBanners() {
    try {
      const res = await fetch('http://localhost:5000/api/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error('Failed to load banners from backend API.', err);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setFormTitle('');
    setFormImageUrl('/original_assets/image974c.jpg');
    setFormLink('#');
    setIsAddModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setSelectedBanner(b);
    setFormTitle(b.title);
    setFormImageUrl(b.imageUrl);
    setFormLink(b.link || '');
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner: Partial<Banner> = {
      title: formTitle,
      imageUrl: formImageUrl,
      link: formLink
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner)
      });
      if (res.ok) {
        alert('Thêm banner thành công!');
        setIsAddModalOpen(false);
        loadBanners();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Thao tác thất bại, kiểm tra kết nối API.');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;

    const fieldsToUpdate: Partial<Banner> = {
      title: formTitle,
      imageUrl: formImageUrl,
      link: formLink
    };

    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${selectedBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate)
      });
      if (res.ok) {
        alert('Cập nhật banner thành công!');
        setIsEditModalOpen(false);
        loadBanners();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Thao tác thất bại, kiểm tra kết nối API.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này không?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Xóa banner thành công!');
        loadBanners();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Thao tác thất bại, kiểm tra kết nối API.');
  };

  const filteredBanners = banners.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] font-bold text-slate-100">Quản lý Ảnh Banner</h1>
          <p className="text-[14px] text-slate-400 mt-1">Danh sách các banner trượt ở trang chủ của cổng bình chọn.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium text-[14px] transition-colors"
        >
          + Thêm Banner
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="w-full max-w-[400px]">
        <input 
          type="text" 
          placeholder="Tìm kiếm banner..." 
          className="w-full h-[40px] px-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Banners Table */}
      <div className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full border-collapse text-left text-slate-200">
          <thead className="bg-slate-700/50 text-[13px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3.5">Ảnh xem trước</th>
              <th className="px-6 py-3.5">Tiêu đề Banner</th>
              <th className="px-6 py-3.5">Đường dẫn đích (Link)</th>
              <th className="px-6 py-3.5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-[14px]">
            {filteredBanners.map(b => (
              <tr key={b.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-24 h-12 rounded overflow-hidden border border-slate-600 bg-slate-900">
                    <img src={b.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-100">{b.title}</td>
                <td className="px-6 py-4 text-blue-400 truncate max-w-[200px]">{b.link || '#'}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => openEditModal(b)}
                    className="text-blue-400 hover:text-blue-300 font-medium text-[13px]"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(b.id)}
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

      {/* ADD BANNER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Thêm Banner</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Tiêu đề Banner</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formTitle} onChange={e => setFormTitle(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Đường dẫn ảnh Banner (URL)</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formImageUrl} onChange={e => setFormImageUrl(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Liên kết chuyển hướng khi Click</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formLink} onChange={e => setFormLink(e.target.value)} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 text-[14px]">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[14px] font-medium">Lưu</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT BANNER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleEditSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Sửa Banner</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Tiêu đề Banner</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formTitle} onChange={e => setFormTitle(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Đường dẫn ảnh Banner (URL)</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formImageUrl} onChange={e => setFormImageUrl(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Liên kết chuyển hướng khi Click</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formLink} onChange={e => setFormLink(e.target.value)} />
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
