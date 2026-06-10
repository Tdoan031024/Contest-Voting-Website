'use client';

import React, { useState, useEffect } from 'react';
import { Sponsor } from '@huitfest/shared';
import { apiUrl, formatAssetUrl } from '../../api';

const TIER_COLORS = {
  PLATINUM: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  GOLD: 'bg-amber-50 text-amber-700 border-amber-200',
  SILVER: 'bg-slate-50 text-slate-700 border-slate-200',
  PARTNER: 'bg-teal-50 text-teal-700 border-teal-200',
};

function DetailModal({
  sponsor,
  onClose,
}: {
  sponsor: Sponsor;
  onClose: () => void;
}) {
  const labelText = 'text-[9px] font-black uppercase tracking-[0.14em] text-slate-400';
  const valText = 'text-xs font-bold text-slate-800 mt-1';
  const TIER_LABELS: Record<string, string> = {
    PLATINUM: 'PLATINUM (Bạch Kim)',
    GOLD: 'GOLD (Vàng)',
    SILVER: 'SILVER (Bạc)',
    PARTNER: 'PARTNER (Đối tác)',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="mx-auto my-12 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg border border-slate-200 flex items-center justify-center w-20 h-12 overflow-hidden shadow">
              <img src={formatAssetUrl(sponsor.logoUrl)} className="max-w-full max-h-full object-contain" alt={sponsor.name} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Chi tiết đối tác</p>
              <h3 className="text-base font-black text-slate-900">{sponsor.name}</h3>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-700">
            Đóng
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2">
            <p className={labelText}>ID Đối tác / Nhà tài trợ</p>
            <p className="text-[11px] font-mono font-bold text-slate-700 mt-1">{sponsor.id}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2 sm:col-span-1">
            <p className={labelText}>Tên đối tác / Nhà tài trợ</p>
            <p className={valText}>{sponsor.name}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2 sm:col-span-1">
            <p className={labelText}>Phân hạng (Tier)</p>
            <span className={`inline-block mt-2 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
              sponsor.tier === 'PLATINUM' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' :
              sponsor.tier === 'GOLD' ? 'border-amber-200 bg-amber-50 text-amber-700' :
              sponsor.tier === 'SILVER' ? 'border-slate-200 bg-slate-50 text-slate-700' :
              'border-teal-200 bg-teal-50 text-teal-700'
            }`}>
              {TIER_LABELS[sponsor.tier] || sponsor.tier}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2 sm:col-span-1">
            <p className={labelText}>Người liên hệ đại diện</p>
            <p className={valText}>{sponsor.contactPerson || 'Chưa cập nhật'}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2 sm:col-span-1">
            <p className={labelText}>Số điện thoại</p>
            <p className={valText}>{sponsor.phone || 'Chưa cập nhật'}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2 sm:col-span-1">
            <p className={labelText}>Email liên hệ</p>
            <p className={valText}>{sponsor.email || 'Chưa cập nhật'}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2 sm:col-span-1">
            <p className={labelText}>Website liên kết</p>
            <p className="text-xs font-bold text-slate-800 mt-1">
              {sponsor.websiteUrl ? (
                <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline inline-flex items-center gap-1">
                  {sponsor.websiteUrl}
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : 'Chưa cập nhật'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 col-span-2">
            <p className={labelText}>Giới thiệu / Mô tả đối tác</p>
            <p className="text-xs font-semibold text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
              {sponsor.description || 'Chưa có thông tin giới thiệu chi tiết.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-emerald-700 transition">
            Đóng chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  
  // Form fields state
  const [formName, setFormName] = useState('');
  const [formTier, setFormTier] = useState<Sponsor['tier']>('PLATINUM');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formWebsiteUrl, setFormWebsiteUrl] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');

  const loadFromApi = async () => {
    try {
      const res = await fetch(apiUrl('/api/sponsors'));
      if (res.ok) {
        const data = await res.json();
        setSponsors(data);
      }
    } catch (e) {
      console.log('Lỗi tải danh sách nhà tài trợ:', e);
      setSponsors([]);
    }
  };

  useEffect(() => {
    loadFromApi();
  }, []);

  const openAddModal = () => {
    setFormName('');
    setFormTier('PLATINUM');
    setFormLogoUrl('/images/eventista.7a1126d5.svg');
    setFormDescription('');
    setFormWebsiteUrl('');
    setFormEmail('');
    setFormPhone('');
    setFormContactPerson('');
    setModalMode('add');
  };

  const openEditModal = (s: Sponsor) => {
    setSelectedSponsor(s);
    setFormName(s.name);
    setFormTier(s.tier);
    setFormLogoUrl(s.logoUrl);
    setFormDescription(s.description || '');
    setFormWebsiteUrl(s.websiteUrl || '');
    setFormEmail(s.email || '');
    setFormPhone(s.phone || '');
    setFormContactPerson(s.contactPerson || '');
    setModalMode('edit');
  };

  const openDetailModal = (s: Sponsor) => {
    setSelectedSponsor(s);
    setModalMode('detail');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSponsor: Partial<Sponsor> = {
      name: formName,
      tier: formTier,
      logoUrl: formLogoUrl,
      description: formDescription || undefined,
      websiteUrl: formWebsiteUrl || undefined,
      email: formEmail || undefined,
      phone: formPhone || undefined,
      contactPerson: formContactPerson || undefined,
    };

    try {
      const res = await fetch(apiUrl('/api/admin/sponsors'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSponsor),
      });
      if (res.ok) {
        setModalMode(null);
        alert('Thêm nhà tài trợ thành công!');
        loadFromApi();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Không thể kết nối đến server để thêm nhà tài trợ.');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSponsor) return;

    const fieldsToUpdate: Partial<Sponsor> = {
      name: formName,
      tier: formTier,
      logoUrl: formLogoUrl,
      description: formDescription || '',
      websiteUrl: formWebsiteUrl || '',
      email: formEmail || '',
      phone: formPhone || '',
      contactPerson: formContactPerson || '',
    };

    try {
      const res = await fetch(apiUrl(`/api/admin/sponsors/${selectedSponsor.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate),
      });
      if (res.ok) {
        setModalMode(null);
        alert('Cập nhật nhà tài trợ thành công!');
        loadFromApi();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Không thể kết nối đến server để cập nhật nhà tài trợ.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhà tài trợ này không? Hành động này không thể hoàn tác.')) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/sponsors/${id}`), {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Xóa nhà tài trợ thành công!');
        loadFromApi();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Không thể kết nối đến server để xóa nhà tài trợ.');
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
              <th className="px-5 py-3 min-w-[220px]">Tên Nhà Tài Trợ</th>
              <th className="px-5 py-3">Phân hạng</th>
              <th className="px-5 py-3 text-center">Hành động</th>
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
                <td className="px-5 py-2.5 font-bold text-[#123c34] whitespace-nowrap">{s.name}</td>
                <td className="px-5 py-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${TIER_COLORS[s.tier] || TIER_COLORS.PARTNER}`}>
                    {s.tier}
                  </span>
                </td>
                <td className="px-5 py-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openDetailModal(s)}
                      className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 transition"
                      title="Xem chi tiết"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className="grid h-7 w-7 place-items-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100 transition"
                      title="Chỉnh sửa"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="grid h-7 w-7 place-items-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:border-red-400 hover:bg-red-100 transition"
                      title="Xóa đối tác"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSponsors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm font-semibold text-[#7a8b85]">
                  Chưa có nhà tài trợ nào phù hợp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD SPONSOR MODAL */}
      {modalMode === 'add' && (
        <div className="fixed inset-0 bg-[#10211d]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <form onSubmit={handleAddSubmit} className="bg-white border border-[#dce5e1] p-5 rounded-xl w-full max-w-lg flex flex-col space-y-3.5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-black text-[#123c34] border-b border-[#edf2f0] pb-2.5">Thêm nhà tài trợ mới</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tên nhà tài trợ *</label>
                <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formName} onChange={e => setFormName(e.target.value)} required />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-end">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đường dẫn logo (URL) *</label>
                    <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formLogoUrl} onChange={e => setFormLogoUrl(e.target.value)} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Hoặc tải logo từ máy tính</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-xs text-[#52605b] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#123c34] file:text-white hover:file:bg-[#0f766e] cursor-pointer"
                      onChange={async (event) => {
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
                            setFormLogoUrl(data.url);
                          } else {
                            alert('Tải logo lên thất bại.');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Có lỗi xảy ra khi tải logo.');
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Phân hạng (Tier) *</label>
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
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Người liên hệ</label>
                <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formContactPerson} onChange={e => setFormContactPerson(e.target.value)} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Số điện thoại liên hệ</label>
                <input type="tel" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formPhone} onChange={e => setFormPhone(e.target.value)} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Email liên hệ</label>
                <input type="email" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formEmail} onChange={e => setFormEmail(e.target.value)} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Website liên kết (URL)</label>
                <input type="url" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formWebsiteUrl} onChange={e => setFormWebsiteUrl(e.target.value)} placeholder="https://example.com" />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Mô tả / Giới thiệu đối tác</label>
                <textarea rows={3} className="px-3 py-2 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold resize-none" value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Nhập thông tin giới thiệu ngắn về nhà tài trợ..." />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#edf2f0]">
              <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-1.5 border border-[#dce5e1] hover:bg-[#edf4f1] rounded-lg text-[#52605b] text-[10px] font-bold transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-3.5 py-1.5 bg-[#123c34] hover:bg-[#0f766e] rounded-lg text-white text-[10px] font-bold shadow transition-colors">Thêm mới</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT SPONSOR MODAL */}
      {modalMode === 'edit' && (
        <div className="fixed inset-0 bg-[#10211d]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <form onSubmit={handleEditSubmit} className="bg-white border border-[#dce5e1] p-5 rounded-xl w-full max-w-lg flex flex-col space-y-3.5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-black text-[#123c34] border-b border-[#edf2f0] pb-2.5">Chỉnh sửa nhà tài trợ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tên nhà tài trợ *</label>
                <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formName} onChange={e => setFormName(e.target.value)} required />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-end">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đường dẫn logo (URL) *</label>
                    <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formLogoUrl} onChange={e => setFormLogoUrl(e.target.value)} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Hoặc tải logo từ máy tính</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-xs text-[#52605b] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#123c34] file:text-white hover:file:bg-[#0f766e] cursor-pointer"
                      onChange={async (event) => {
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
                            setFormLogoUrl(data.url);
                          } else {
                            alert('Tải logo lên thất bại.');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Có lỗi xảy ra khi tải logo.');
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Phân hạng (Tier) *</label>
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
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Người liên hệ</label>
                <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formContactPerson} onChange={e => setFormContactPerson(e.target.value)} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Số điện thoại liên hệ</label>
                <input type="tel" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formPhone} onChange={e => setFormPhone(e.target.value)} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Email liên hệ</label>
                <input type="email" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formEmail} onChange={e => setFormEmail(e.target.value)} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Website liên kết (URL)</label>
                <input type="url" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formWebsiteUrl} onChange={e => setFormWebsiteUrl(e.target.value)} placeholder="https://example.com" />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Mô tả / Giới thiệu đối tác</label>
                <textarea rows={3} className="px-3 py-2 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold resize-none" value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Nhập thông tin giới thiệu ngắn về nhà tài trợ..." />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#edf2f0]">
              <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-1.5 border border-[#dce5e1] hover:bg-[#edf4f1] rounded-lg text-[#52605b] text-[10px] font-bold transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-3.5 py-1.5 bg-[#123c34] hover:bg-[#0f766e] rounded-lg text-white text-[10px] font-bold shadow transition-colors">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}

      {/* DETAIL MODAL */}
      {modalMode === 'detail' && selectedSponsor && (
        <DetailModal
          sponsor={selectedSponsor}
          onClose={() => setModalMode(null)}
        />
      )}

    </div>
  );
}