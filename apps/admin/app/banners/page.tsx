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
      <form onSubmit={onSubmit} className="w-full max-w-[850px] rounded-xl border border-[#dce5e1] bg-white p-5 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-3 border-b border-[#edf2f0] pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quản lý giao diện</p>
            <h3 className="mt-0.5 text-base font-black text-[#123c34]">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded border border-[#dce5e1] px-2.5 py-1 text-[10px] font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e] transition-colors">
            Đóng
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Preview Area */}
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider block">Xem trước hiển thị</span>
            <div className="overflow-hidden rounded-lg border border-[#dce5e1] bg-[#f4f7f6] flex-1 flex items-center justify-center min-h-[220px] md:min-h-[280px]">
              {formImageUrl && formImageUrl.toLowerCase().endsWith('.mp4') ? (
                <video src={formImageUrl} controls className="max-h-[280px] w-full object-contain rounded-md shadow-sm" />
              ) : (
                <img src={formImageUrl || '/original_assets/image974c.jpg'} alt="Xem trước" className="max-h-[280px] w-full object-contain rounded-md shadow-sm" />
              )}
            </div>
          </div>

          {/* Right Column: Fields */}
          <div className="space-y-3.5">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tiêu đề banner</span>
              <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formTitle} onChange={(event) => setFormTitle(event.target.value)} required />
            </label>

            <div className="space-y-1.5">
              <label className="block space-y-1.5">
                <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đường dẫn hình ảnh</span>
                <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formImageUrl} onChange={(event) => setFormImageUrl(event.target.value)} required />
              </label>
              <div className="block space-y-1.5">
                <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider block">Hoặc tải file từ máy tính</span>
                <input
                  type="file"
                  accept="image/*,video/mp4"
                  className="w-full text-xs text-[#52605b] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#123c34] file:text-white hover:file:bg-[#0f766e] cursor-pointer"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                      const res = await fetch('http://localhost:5000/api/admin/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setFormImageUrl(data.url);
                      } else {
                        alert('Tải ảnh/video lên thất bại.');
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Có lỗi xảy ra khi kết nối server tải ảnh.');
                    }
                  }}
                />
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Liên kết điều hướng khi bấm</span>
              <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formLink} onChange={(event) => setFormLink(event.target.value)} />
            </label>
   
            <div className="flex items-center justify-between rounded-lg border border-[#dce5e1] bg-[#fbfdfc] p-3 shadow-sm">
              <div>
                <p className="text-xs font-bold text-[#123c34]">Trạng thái hiển thị banner</p>
                <p className="mt-0.5 text-[9px] font-semibold text-[#6b7773]">Tắt để ẩn khỏi trang chủ nhưng vẫn lưu trong admin.</p>
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
      if (res.ok) {
        alert(nextActive ? 'Hiển thị banner thành công!' : 'Ẩn banner thành công!');
      } else {
        alert('Thay đổi trạng thái banner thất bại!');
        loadBanners();
      }
    } catch (err) {
      console.error(err);
      alert('Thay đổi trạng thái banner thất bại!');
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5 bg-[#fbfdfc]">
          {filteredBanners.map((banner) => (
            <div key={banner.id} className="group relative rounded-xl border border-[#dce5e1] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              
              {/* Image Preview Block */}
              <div className="relative aspect-[16/9] w-full bg-[#f4f7f6] border-b border-[#edf2f0] overflow-hidden flex items-center justify-center">
                {banner.imageUrl && banner.imageUrl.toLowerCase().endsWith('.mp4') ? (
                  <video src={banner.imageUrl} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" muted loop playsInline autoPlay />
                ) : (
                  <img src={banner.imageUrl} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" alt={banner.title} />
                )}
              </div>

              {/* Banner Details */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-[#123c34] line-clamp-1 group-hover:text-[#0f766e] transition-colors">{banner.title}</h4>
                  <p className="text-[10px] text-[#7a8b85] font-semibold truncate" title={banner.imageUrl}>Tệp: {banner.imageUrl}</p>
                  <p className="text-[10px] text-[#0f766e] font-bold truncate">Liên kết: {banner.link || '#'}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 pt-3 border-t border-[#edf2f0]">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    title={banner.isActive !== false ? 'Bấm để ẩn banner khỏi trang chủ' : 'Bấm để hiển thị banner lên trang chủ'}
                    className={`rounded-lg px-2 py-1.5 text-[10px] font-bold transition flex-1 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md active:scale-[0.97] text-white ${
                      banner.isActive !== false
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-slate-400 hover:bg-slate-500'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${banner.isActive !== false ? 'bg-emerald-200 animate-pulse' : 'bg-slate-200'}`} />
                    {banner.isActive !== false ? 'Hiện' : 'Ẩn'}
                  </button>
                  <button
                    onClick={() => openEditModal(banner)}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 px-2 py-1.5 text-[10px] font-bold text-white transition shadow-sm hover:shadow-md active:scale-[0.97] flex-1 flex items-center justify-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="rounded-lg bg-rose-500 hover:bg-rose-600 px-2.5 py-1.5 text-[10px] font-bold text-white transition shadow-sm hover:shadow-md active:scale-[0.97] flex-1 flex items-center justify-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>

            </div>
          ))}
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
