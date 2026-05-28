'use client';

import React, { useEffect, useState } from 'react';

export default function IntroductionAdminPage() {
  const [aboutTitle, setAboutTitle] = useState('Về HUIT\'s Iconic 2024');
  const [aboutDescription, setAboutDescription] = useState(
    "HUIT's Iconic là cuộc thi tìm kiếm gương mặt đại diện và tài năng sinh viên Trường Đại học Công Thương TP. Hồ Chí Minh (HUIT). Cuộc thi nhằm tôn vinh nét đẹp tri thức, phong cách tự tin, tài năng nổi bật cùng tinh thần trách nhiệm với cộng đồng của thế hệ trẻ HUIT. Đây là bệ phóng giúp các bạn sinh viên tỏa sáng, khẳng định bản thân và phát triển kỹ năng toàn diện trong thời đại mới."
  );
  const [statsCandidates, setStatsCandidates] = useState('20+');
  const [statsVotes, setStatsVotes] = useState('100K+');
  const [statsViews, setStatsViews] = useState('30M+');
  const [aboutImageUrl, setAboutImageUrl] = useState('/original_assets/image17ae.png');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.aboutTitle) setAboutTitle(data.aboutTitle);
          if (data.aboutDescription) setAboutDescription(data.aboutDescription);
          if (data.statsCandidates) setStatsCandidates(data.statsCandidates);
          if (data.statsVotes) setStatsVotes(data.statsVotes);
          if (data.statsViews) setStatsViews(data.statsViews);
          if (data.aboutImageUrl) setAboutImageUrl(data.aboutImageUrl);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aboutTitle,
          aboutDescription,
          statsCandidates,
          statsVotes,
          statsViews,
          aboutImageUrl,
        }),
      });
      if (res.ok) {
        alert('Cập nhật thông tin giới thiệu thành công!');
      } else {
        alert('Cập nhật thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setAboutImageUrl(data.url);
        alert('Tải ảnh giới thiệu lên thành công!');
      } else {
        alert('Tải ảnh thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi kết nối server tải ảnh.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <section className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e] font-heading">Quản lý giao diện</p>
          <h2 className="mt-0.5 text-lg font-black text-[#123c34] font-heading">Cấu hình thông tin giới thiệu</h2>
          <p className="text-xs text-[#6b7773] mt-0.5">Chỉnh sửa nội dung giới thiệu cuộc thi và các chỉ số thống kê trên trang chủ.</p>
        </div>
      </section>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Preview & Image */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-[#dce5e1] bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#123c34] uppercase tracking-wider font-heading pb-2 border-b border-[#edf2f0]">Hình ảnh giới thiệu</h3>
            
            <div className="overflow-hidden rounded-lg border border-[#dce5e1] bg-[#f4f7f6] aspect-[4/3] flex items-center justify-center relative group">
              <img 
                src={aboutImageUrl || '/original_assets/image17ae.png'} 
                alt="About Preview" 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider block mb-1">Đường dẫn hình ảnh</span>
                <input 
                  type="text" 
                  value={aboutImageUrl} 
                  onChange={(e) => setAboutImageUrl(e.target.value)} 
                  className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" 
                  required 
                />
              </label>
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider block">Tải ảnh mới lên</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="w-full text-xs text-[#52605b] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#123c34] file:text-white hover:file:bg-[#0f766e] cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Content Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#dce5e1] bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#123c34] uppercase tracking-wider font-heading pb-2 border-b border-[#edf2f0]">Nội dung chi tiết</h3>
            
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tiêu đề chính</span>
                <input 
                  type="text" 
                  value={aboutTitle} 
                  onChange={(e) => setAboutTitle(e.target.value)} 
                  className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-bold text-[#123c34] outline-none transition focus:border-[#0f766e] focus:bg-white" 
                  required 
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Nội dung giới thiệu</span>
                <textarea 
                  value={aboutDescription} 
                  onChange={(e) => setAboutDescription(e.target.value)} 
                  className="h-32 w-full resize-none rounded-lg border border-[#dce5e1] bg-[#fbfdfc] p-3 text-xs font-semibold text-[#18211f] leading-relaxed outline-none transition focus:border-[#0f766e] focus:bg-white" 
                  required 
                />
              </label>

              {/* Stats Counters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <label className="block space-y-1.5">
                  <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Số lượng thí sinh</span>
                  <input 
                    type="text" 
                    value={statsCandidates} 
                    onChange={(e) => setStatsCandidates(e.target.value)} 
                    className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-bold text-[#0f766e] outline-none transition focus:border-[#0f766e] focus:bg-white" 
                    placeholder="Ví dụ: 20+" 
                    required 
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tổng số bình chọn</span>
                  <input 
                    type="text" 
                    value={statsVotes} 
                    onChange={(e) => setStatsVotes(e.target.value)} 
                    className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-bold text-[#0f766e] outline-none transition focus:border-[#0f766e] focus:bg-white" 
                    placeholder="Ví dụ: 100K+" 
                    required 
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tổng số lượt xem</span>
                  <input 
                    type="text" 
                    value={statsViews} 
                    onChange={(e) => setStatsViews(e.target.value)} 
                    className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-bold text-[#0f766e] outline-none transition focus:border-[#0f766e] focus:bg-white" 
                    placeholder="Ví dụ: 30M+" 
                    required 
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-[#edf2f0]">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="rounded-lg bg-[#123c34] px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#0f766e] disabled:opacity-50 font-heading"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
