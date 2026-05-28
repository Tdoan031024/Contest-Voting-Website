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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#10211d]/60 p-4 backdrop-blur-sm transition-all duration-300">
      <form onSubmit={onSubmit} className="w-full max-w-[500px] rounded-xl border border-[#dce5e1] bg-white p-5 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-3 border-b border-[#edf2f0] pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quản lý giao diện</p>
            <h3 className="mt-0.5 text-base font-black text-[#123c34]">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded border border-[#dce5e1] px-2.5 py-1 text-[10px] font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e] transition-colors">
            Đóng
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tiêu đề banner</span>
            <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formTitle} onChange={(event) => setFormTitle(event.target.value)} required />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đường dẫn hình ảnh</span>
            <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formImageUrl} onChange={(event) => setFormImageUrl(event.target.value)} required />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Liên kết điều hướng khi bấm</span>
            <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formLink} onChange={(event) => setFormLink(event.target.value)} />
          </label>

          <div className="flex items-center justify-between rounded-lg border border-[#dce5e1] bg-[#fbfdfc] p-3 shadow-sm">
            <div>
              <p className="text-xs font-bold text-[#123c34]">Trạng thái hiển thị banner</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[#6b7773]">Tắt để ẩn khỏi trang chủ nhưng vẫn lưu trong admin.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormActive(!formActive)}
              className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${formActive ? 'bg-[#0f766e]' : 'bg-[#c9d6d1]'}`}
              aria-pressed={formActive}
            >
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${formActive ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#dce5e1] bg-[#f4f7f6]">
            <div className="aspect-[16/9] w-full p-2 flex items-center justify-center">
              <img src={formImageUrl || '/original_assets/image974c.jpg'} alt="Xem trước" className="h-full w-full object-contain rounded-md shadow-sm" />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-[#edf2f0] pt-3.5">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#dce5e1] bg-white px-3.5 py-2 text-[10px] font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e] transition-colors">
            Hủy bỏ
          </button>
          <button type="submit" className="rounded-lg bg-[#123c34] px-3.5 py-2 text-[10px] font-bold text-white shadow transition hover:bg-[#0f766e]">
            Lưu banner
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
        alert('Thêm banner thành công!');
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
        alert('Cập nhật banner thành công!');
        loadBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này không?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Xóa banner thành công!');
        loadBanners();
      }
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
    <div className="space-y-4">
      <section className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quản lý giao diện</p>
          <h2 className="mt-0.5 text-lg font-black text-[#123c34]">Banner trang chủ</h2>
          <p className="text-xs text-[#6b7773] mt-0.5">Quản lý banner đầu trang công khai và ẩn hiện nhanh.</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e45136] px-3.5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#c83f28] active:scale-[0.98]">
          <span className="text-lg leading-none">+</span>
          Thêm banner mới
        </button>
      </section>

      <section className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        <div className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Tổng số banner</p>
          <p className="mt-1 text-2xl font-black text-[#123c34]">{banners.length}</p>
        </div>
        <div className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Đang hiển thị</p>
          <p className="mt-1 text-2xl font-black text-[#0f766e]">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Khuyên dùng</p>
          <p className="mt-1 text-sm font-black text-[#123c34]">Tỷ lệ 16:9 / 1440x768</p>
          <p className="mt-0.5 text-[10px] text-[#6b7773]">Nên dùng ảnh sắc nét để có giao diện trang chủ tốt nhất.</p>
        </div>
      </section>

      <section className="rounded-xl border border-[#dce5e1] bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#edf2f0] p-3.5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8aa098]" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề banner..."
              className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] pl-9 pr-3 text-xs font-semibold text-[#18211f] outline-none transition placeholder:text-[#9aa9a4] focus:border-[#0f766e] focus:bg-white"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <p className="text-[10px] font-bold text-[#6b7773] uppercase tracking-wider">{filteredBanners.length} banner tìm thấy</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-[10px] font-black uppercase tracking-[0.12em] text-[#7a8b85]">
                <th className="px-5 py-3">Hình ảnh xem trước</th>
                <th className="px-5 py-3">Tiêu đề</th>
                <th className="px-5 py-3">Đường dẫn liên kết</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f0] text-xs">
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="transition hover:bg-[#edf4f1]/20">
                  <td className="px-5 py-2.5">
                    <div className="h-10 w-20 overflow-hidden rounded-lg border border-[#dce5e1] bg-[#f4f7f6] p-1 flex items-center justify-center shadow-sm">
                      <img src={banner.imageUrl} className="h-full w-full object-contain rounded-md" alt={banner.title} />
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <p className="text-xs font-bold text-[#123c34]">{banner.title}</p>
                    <p className="mt-0.5 max-w-[360px] truncate text-[10px] font-semibold text-[#7a8b85]">{banner.imageUrl}</p>
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-2.5 text-[10px] font-bold text-[#0f766e]">{banner.link || '#'}</td>
                  <td className="px-5 py-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-all ${
                        banner.isActive !== false
                          ? 'border-[#b9d8cf] bg-[#edf8f4] text-[#0f766e]'
                          : 'border-[#d8dedc] bg-[#f4f7f6] text-[#7a8b85]'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${banner.isActive !== false ? 'bg-[#18a058] animate-pulse' : 'bg-[#9aa9a4]'}`} />
                      {banner.isActive !== false ? 'Đang hiện' : 'Đang ẩn'}
                    </button>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEditModal(banner)} className="rounded-lg border border-[#dce5e1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#0f766e] transition hover:bg-[#edf4f1] hover:border-[#0f766e]">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="rounded-lg border border-[#f0c9bd] bg-[#fff5f2] px-2.5 py-1 text-[11px] font-bold text-[#c83f28] transition hover:bg-[#e45136]/10 hover:border-[#e45136]">
                        Xóa
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
          title="Thêm banner mới"
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
          title="Chỉnh sửa banner"
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
