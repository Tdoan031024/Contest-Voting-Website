'use client';

import React, { useState, useEffect } from 'react';
import { Sponsor } from '@huitfest/shared';

const INITIAL_MOCK_SPONSORS: Sponsor[] = [
  {
    id: 's1',
    name: 'Eventista',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150&h=80',
    tier: 'PLATINUM',
  },
  {
    id: 's2',
    name: 'HUIT Media',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150&h=80',
    tier: 'GOLD',
  },
  {
    id: 's3',
    name: 'Sen Vàng Entertainment',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150&h=80',
    tier: 'SILVER',
  },
];

const TIER_COLORS = {
  PLATINUM: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  GOLD: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  SILVER: 'bg-slate-400/10 text-slate-300 border-slate-400/20',
  PARTNER: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(INITIAL_MOCK_SPONSORS);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  
  // Form fields state
  const [formName, setFormName] = useState('');
  const [formTier, setFormTier] = useState<Sponsor['tier']>('PLATINUM');
  const [formLogoUrl, setFormLogoUrl] = useState('');

  useEffect(() => {
    async function loadFromApi() {
      try {
        const res = await fetch('http://localhost:5000/api/sponsors');
        if (res.ok) {
          const data = await res.json();
          setSponsors(data);
        }
      } catch (e) {
        console.log('Backend API offline, showing local mock admin sponsors.');
      }
    }
    loadFromApi();
  }, []);

  const openAddModal = () => {
    setFormName('');
    setFormTier('PLATINUM');
    setFormLogoUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150&h=80');
    setIsAddModalOpen(true);
  };

  const openEditModal = (s: Sponsor) => {
    setSelectedSponsor(s);
    setFormName(s.name);
    setFormTier(s.tier);
    setFormLogoUrl(s.logoUrl);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSponsor: Partial<Sponsor> = {
      name: formName,
      tier: formTier,
      logoUrl: formLogoUrl
    };

    // Try posting to NestJS
    try {
      const res = await fetch('http://localhost:5000/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSponsor),
      });
      if (res.ok) {
        const added = await res.json();
        setSponsors(prev => [...prev, added]);
        setIsAddModalOpen(false);
        alert('Thêm nhà tài trợ thành công!');
        return;
      }
    } catch (err) {}

    // Fallback local mock state update
    const addedMock: Sponsor = {
      id: 's' + (sponsors.length + 1),
      name: formName,
      tier: formTier,
      logoUrl: formLogoUrl
    };
    setSponsors([...sponsors, addedMock]);
    setIsAddModalOpen(false);
    alert('Thêm nhà tài trợ offline thành công!');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSponsor) return;

    const fieldsToUpdate: Partial<Sponsor> = {
      name: formName,
      tier: formTier,
      logoUrl: formLogoUrl
    };

    // Try put request to NestJS
    try {
      const res = await fetch(`http://localhost:5000/api/admin/sponsors/${selectedSponsor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate),
      });
      if (res.ok) {
        const updated = await res.json();
        setSponsors(prev => prev.map(s => s.id === selectedSponsor.id ? updated : s));
        setIsEditModalOpen(false);
        alert('Cập nhật nhà tài trợ thành công!');
        return;
      }
    } catch (err) {}

    // Fallback local mock state update
    setSponsors(prev =>
      prev.map(s => s.id === selectedSponsor.id ? { ...s, ...fieldsToUpdate } : s)
    );
    setIsEditModalOpen(false);
    alert('Cập nhật nhà tài trợ offline thành công!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhà tài trợ này không?')) return;

    // Try delete request to NestJS
    try {
      const res = await fetch(`http://localhost:5000/api/admin/sponsors/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSponsors(prev => prev.filter(s => s.id !== id));
        alert('Xóa nhà tài trợ thành công!');
        return;
      }
    } catch (err) {}

    // Fallback local mock state update
    setSponsors(prev => prev.filter(s => s.id !== id));
    alert('Xóa nhà tài trợ offline thành công!');
  };

  const filteredSponsors = sponsors.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.tier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] font-bold text-slate-100">Quản lý Nhà tài trợ</h1>
          <p className="text-[14px] text-slate-400 mt-1">Danh sách nhà tài trợ đồng hành cùng sự kiện HUIT's Iconic 2024.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium text-[14px] transition-colors"
        >
          + Thêm nhà tài trợ
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="w-full max-w-[400px]">
        <input 
          type="text" 
          placeholder="Tìm kiếm nhà tài trợ theo tên hoặc phân hạng..." 
          className="w-full h-[40px] px-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Sponsors Table */}
      <div className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full border-collapse text-left text-slate-200">
          <thead className="bg-slate-700/50 text-[13px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3.5">Logo</th>
              <th className="px-6 py-3.5">Tên nhà tài trợ</th>
              <th className="px-6 py-3.5">Phân hạng (Tier)</th>
              <th className="px-6 py-3.5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-[14px]">
            {filteredSponsors.map(s => (
              <tr key={s.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="bg-white p-1 rounded border border-slate-600 flex items-center justify-center w-16 h-10 overflow-hidden">
                    <img src={s.logoUrl} className="max-w-full max-h-full object-contain" alt={s.name} />
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-100">{s.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold border ${TIER_COLORS[s.tier]}`}>
                    {s.tier}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => openEditModal(s)}
                    className="text-blue-400 hover:text-blue-300 font-medium text-[13px]"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(s.id)}
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

      {/* ADD SPONSOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Thêm Nhà tài trợ</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Tên nhà tài trợ</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formName} onChange={e => setFormName(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Phân hạng (Tier)</label>
              <select 
                className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
                value={formTier}
                onChange={e => setFormTier(e.target.value as Sponsor['tier'])}
              >
                <option value="PLATINUM">PLATINUM</option>
                <option value="GOLD">GOLD</option>
                <option value="SILVER">SILVER</option>
                <option value="PARTNER">PARTNER</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Đường dẫn logo (URL)</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formLogoUrl} onChange={e => setFormLogoUrl(e.target.value)} required />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 text-[14px]">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[14px] font-medium">Lưu</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT SPONSOR MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleEditSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Sửa Nhà tài trợ</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Tên nhà tài trợ</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formName} onChange={e => setFormName(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Phân hạng (Tier)</label>
              <select 
                className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]"
                value={formTier}
                onChange={e => setFormTier(e.target.value as Sponsor['tier'])}
              >
                <option value="PLATINUM">PLATINUM</option>
                <option value="GOLD">GOLD</option>
                <option value="SILVER">SILVER</option>
                <option value="PARTNER">PARTNER</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Đường dẫn logo (URL)</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formLogoUrl} onChange={e => setFormLogoUrl(e.target.value)} required />
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
