'use client';

import React, { useEffect, useState } from 'react';
import { Banner } from '@huitfest/shared';

type AdminBanner = Banner & {
  isActive?: boolean;
};

type BannerFormProps = {
  title: string;
  formTitle: string;
  formImageUrl: string;
  formLink: string;
  formActive: boolean;
  setFormTitle: (value: string) => void;
  setFormImageUrl: (value: string) => void;
  setFormLink: (value: string) => void;
  setFormActive: (value: boolean) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

function BannerModal({
  title,
  formTitle,
  formImageUrl,
  formLink,
  formActive,
  setFormTitle,
  setFormImageUrl,
  setFormLink,
  setFormActive,
  onClose,
  onSubmit,
}: BannerFormProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#10211d]/60 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="w-full max-w-[620px] rounded-lg border border-[#dce5e1] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#edf2f0] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quan ly giao dien</p>
            <h3 className="mt-1 text-xl font-black text-[#18211f]">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-[#dce5e1] px-3 py-2 text-sm font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e]">
            Dong
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#52605b]">Tieu de banner</span>
            <input className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formTitle} onChange={(event) => setFormTitle(event.target.value)} required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#52605b]">Duong dan anh</span>
            <input className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formImageUrl} onChange={(event) => setFormImageUrl(event.target.value)} required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#52605b]">Lien ket khi bam</span>
            <input className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formLink} onChange={(event) => setFormLink(event.target.value)} />
          </label>

          <div className="flex items-center justify-between rounded-lg border border-[#dce5e1] bg-[#fbfdfc] p-4">
            <div>
              <p className="text-sm font-black text-[#18211f]">Hien thi banner</p>
              <p className="mt-1 text-xs font-medium text-[#6b7773]">Tat de an khoi trang chu nhung van giu trong admin.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormActive(!formActive)}
              className={`relative h-7 w-14 rounded-full transition ${formActive ? 'bg-[#0f766e]' : 'bg-[#c9d6d1]'}`}
              aria-pressed={formActive}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${formActive ? 'left-8' : 'left-1'}`} />
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#dce5e1] bg-[#f4f7f6]">
            <div className="aspect-[1440/768] w-full">
              <img src={formImageUrl || '/original_assets/image974c.jpg'} alt="" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#edf2f0] pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#dce5e1] bg-white px-4 py-2.5 text-sm font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e]">
            Huy
          </button>
          <button type="submit" className="rounded-lg bg-[#123c34] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f766e]">
            Luu banner
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<AdminBanner | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formActive, setFormActive] = useState(true);

  async function loadBanners() {
    try {
      const res = await fetch('http://localhost:5000/api/banners');
      if (res.ok) setBanners(await res.json());
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
    setFormActive(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (banner: AdminBanner) => {
    setSelectedBanner(banner);
    setFormTitle(banner.title);
    setFormImageUrl(banner.imageUrl);
    setFormLink(banner.link || '');
    setFormActive(banner.isActive ?? true);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, imageUrl: formImageUrl, link: formLink, isActive: formActive }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        loadBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedBanner) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${selectedBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, imageUrl: formImageUrl, link: formLink, isActive: formActive }),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        loadBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ban co chac chan muon xoa banner nay khong?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) loadBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (banner: AdminBanner) => {
    const nextActive = !(banner.isActive ?? true);
    setBanners((prev) =>
      prev.map((item) => item.id === banner.id ? { ...item, isActive: nextActive } : item)
    );

    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (!res.ok) loadBanners();
    } catch (err) {
      console.error(err);
      loadBanners();
    }
  };

  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(search.toLowerCase())
  );
  const activeCount = banners.filter((banner) => banner.isActive !== false).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quan ly giao dien</p>
          <h2 className="mt-1 text-2xl font-black text-[#18211f]">Banner trang chu</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#6b7773]">Quan ly banner dau trang va chu dong an hien tung banner.</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e45136] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c83f28]">
          <span className="text-lg leading-none">+</span>
          Them banner
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Tong banner</p>
          <p className="mt-2 text-3xl font-black text-[#18211f]">{banners.length}</p>
        </div>
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Dang hien thi</p>
          <p className="mt-2 text-3xl font-black text-[#18211f]">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Goi y kich thuoc</p>
          <p className="mt-2 text-lg font-black text-[#18211f]">1440 x 768+</p>
          <p className="mt-1 text-sm text-[#6b7773]">Anh qua nho se bi phong to va mo tren man hinh lon.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#dce5e1] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#edf2f0] p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa098]" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <input
              type="text"
              placeholder="Tim kiem banner..."
              className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] pl-10 pr-3 text-sm font-semibold text-[#18211f] outline-none transition placeholder:text-[#9aa9a4] focus:border-[#0f766e] focus:bg-white"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <p className="text-sm font-semibold text-[#6b7773]">{filteredBanners.length} ket qua</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-xs font-black uppercase tracking-[0.12em] text-[#7a8b85]">
                <th className="px-5 py-4">Anh xem truoc</th>
                <th className="px-5 py-4">Tieu de</th>
                <th className="px-5 py-4">Lien ket</th>
                <th className="px-5 py-4">Trang thai</th>
                <th className="px-5 py-4 text-right">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f0]">
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="transition hover:bg-[#fbfdfc]">
                  <td className="px-5 py-4">
                    <div className="h-16 w-32 overflow-hidden rounded-lg border border-[#dce5e1] bg-[#f4f7f6]">
                      <img src={banner.imageUrl} className="h-full w-full object-contain" alt={banner.title} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-black text-[#18211f]">{banner.title}</p>
                    <p className="mt-1 max-w-[360px] truncate text-xs font-medium text-[#7a8b85]">{banner.imageUrl}</p>
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-4 text-sm font-bold text-[#0f766e]">{banner.link || '#'}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black transition ${
                        banner.isActive !== false
                          ? 'border-[#b9d8cf] bg-[#edf8f4] text-[#0f766e]'
                          : 'border-[#d8dedc] bg-[#f4f7f6] text-[#7a8b85]'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${banner.isActive !== false ? 'bg-[#18a058]' : 'bg-[#9aa9a4]'}`} />
                      {banner.isActive !== false ? 'Dang hien' : 'Dang an'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(banner)} className="rounded-lg border border-[#dce5e1] bg-white px-3 py-2 text-sm font-bold text-[#0f766e] transition hover:border-[#0f766e]">
                        Sua
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="rounded-lg border border-[#f0c9bd] bg-[#fff5f2] px-3 py-2 text-sm font-bold text-[#c83f28] transition hover:border-[#e45136]">
                        Xoa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isAddModalOpen && (
        <BannerModal
          title="Them banner"
          formTitle={formTitle}
          formImageUrl={formImageUrl}
          formLink={formLink}
          formActive={formActive}
          setFormTitle={setFormTitle}
          setFormImageUrl={setFormImageUrl}
          setFormLink={setFormLink}
          setFormActive={setFormActive}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {isEditModalOpen && (
        <BannerModal
          title="Sua banner"
          formTitle={formTitle}
          formImageUrl={formImageUrl}
          formLink={formLink}
          formActive={formActive}
          setFormTitle={setFormTitle}
          setFormImageUrl={setFormImageUrl}
          setFormLink={setFormLink}
          setFormActive={setFormActive}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
