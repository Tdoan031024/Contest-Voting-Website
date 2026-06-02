'use client';

import React, { useState, useEffect } from 'react';
import { Sponsor } from '@huitfest/shared';
import { apiUrl, formatAssetUrl } from '../../api';

const INITIAL_MOCK_SPONSORS: Sponsor[] = [
  {
    id: 's1',
    name: 'Eventista',
    logoUrl: '/images/eventista.7a1126d5.svg',
    tier: 'PLATINUM',
  },
  {
    id: 's2',
    name: 'HUIT Media',
    logoUrl: '/images/imageb821.png',
    tier: 'GOLD',
  },
  {
    id: 's3',
    name: 'Sen Vàng Entertainment',
    logoUrl: '/images/image5999.jpg',
    tier: 'SILVER',
  },
];

const TIER_COLORS = {
  PLATINUM: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  GOLD: 'bg-amber-50 text-amber-700 border-amber-200',
  SILVER: 'bg-slate-50 text-slate-700 border-slate-200',
  PARTNER: 'bg-teal-50 text-teal-700 border-teal-200',
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
        const res = await fetch(apiUrl('/api/sponsors'));
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
    setFormLogoUrl('/images/eventista.7a1126d5.svg');
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
      const res = await fetch(apiUrl('/api/admin/sponsors'), {
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
      id: 's' + Date.now(),
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
      const res = await fetch(apiUrl(`/api/admin/sponsors/${selectedSponsor.id}`), {
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
      const res = await fetch(apiUrl(`/api/admin/sponsors/${id}`), {
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
    <div className="flex flex-col space-y-4">
      
      {/* Title Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quản lý đối tác</p>
          <h1 className="text-lg font-black text-[#123c34]">Nhà tài trợ & Đối tác</h1>
          <p className="text-xs text-[#6b7773] mt-0.5">Danh sách nhà tài trợ đồng hành cùng sự kiện HUIT's Iconic 2024.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-3.5 py-2 bg-[#e45136] hover:bg-[#c83f28] rounded-lg text-white font-bold text-[11px] shadow transition active:scale-[0.98]"
        >
          + Thêm nhà tài trợ mới
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="w-full max-w-md">
        <input 
          type="text" 
          placeholder="Tìm kiếm nhà tài trợ theo tên hoặc phân hạng..." 
          className="w-full h-9 px-4 rounded-lg bg-white border border-[#dce5e1] text-[#18211f] placeholder-[#9aa9a4] text-xs focus:outline-none focus:border-[#0f766e] transition-colors shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Sponsors Table */}
      <div className="w-full bg-white border border-[#dce5e1] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left text-[#18211f]">
          <thead className="bg-[#fbfdfc] text-[10px] font-black uppercase tracking-wider text-[#7a8b85] border-b border-[#edf2f0]">
            <tr>
              <th className="px-5 py-3">Logo</th>
              <th className="px-5 py-3">Tên nhà tài trợ</th>
              <th className="px-5 py-3">Phân hạng (Tier)</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2f0] text-xs">
            {filteredSponsors.map(s => (
              <tr key={s.id} className="hover:bg-[#edf4f1]/20 transition-colors">
                <td className="px-5 py-2.5">
                  <div className="bg-white p-1 rounded-lg border border-[#dce5e1] flex items-center justify-center w-16 h-9 overflow-hidden shadow-sm">
                    <img src={formatAssetUrl(s.logoUrl)} className="max-w-full max-h-full object-contain" alt={s.name} />
                  </div>
                </td>
                <td className="px-5 py-2.5 font-bold text-[#123c34]">{s.name}</td>
                <td className="px-5 py-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${TIER_COLORS[s.tier] || TIER_COLORS.PARTNER}`}>
                    {s.tier}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button 
                      onClick={() => openEditModal(s)}
                      className="rounded-lg border border-[#dce5e1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#0f766e] transition hover:bg-[#edf4f1] hover:border-[#0f766e]"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
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

      {/* ADD SPONSOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#10211d]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <form onSubmit={handleAddSubmit} className="bg-white border border-[#dce5e1] p-5 rounded-xl w-full max-w-[420px] flex flex-col space-y-3.5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-black text-[#123c34] border-b border-[#edf2f0] pb-2.5">Thêm nhà tài trợ mới</h3>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tên nhà tài trợ</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formName} onChange={e => setFormName(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Phân hạng (Tier)</label>
              <select 
                className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
                value={formTier}
                onChange={e => setFormTier(e.target.value as Sponsor['tier'])}
              >
                <option value="PLATINUM">PLATINUM (Bạch Kim)</option>
                <option value="GOLD">GOLD (Vàng)</option>
                <option value="SILVER">SILVER (Bạc)</option>
                <option value="PARTNER">PARTNER (Đối tác)</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đường dẫn logo (URL)</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formLogoUrl} onChange={e => setFormLogoUrl(e.target.value)} required />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#edf2f0]">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3.5 py-1.5 border border-[#dce5e1] hover:bg-[#edf4f1] rounded-lg text-[#52605b] text-[10px] font-bold transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-3.5 py-1.5 bg-[#123c34] hover:bg-[#0f766e] rounded-lg text-white text-[10px] font-bold shadow transition-colors">Thêm mới</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT SPONSOR MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#10211d]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <form onSubmit={handleEditSubmit} className="bg-white border border-[#dce5e1] p-5 rounded-xl w-full max-w-[420px] flex flex-col space-y-3.5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-black text-[#123c34] border-b border-[#edf2f0] pb-2.5">Chỉnh sửa nhà tài trợ</h3>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tên nhà tài trợ</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formName} onChange={e => setFormName(e.target.value)} required />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Phân hạng (Tier)</label>
              <select 
                className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
                value={formTier}
                onChange={e => setFormTier(e.target.value as Sponsor['tier'])}
              >
                <option value="PLATINUM">PLATINUM (Bạch Kim)</option>
                <option value="GOLD">GOLD (Vàng)</option>
                <option value="SILVER">SILVER (Bạc)</option>
                <option value="PARTNER">PARTNER (Đối tác)</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đường dẫn logo (URL)</label>
              <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formLogoUrl} onChange={e => setFormLogoUrl(e.target.value)} required />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#edf2f0]">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-3.5 py-1.5 border border-[#dce5e1] hover:bg-[#edf4f1] rounded-lg text-[#52605b] text-[10px] font-bold transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-3.5 py-1.5 bg-[#123c34] hover:bg-[#0f766e] rounded-lg text-white text-[10px] font-bold shadow transition-colors">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}