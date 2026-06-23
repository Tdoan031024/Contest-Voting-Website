'use client';

import React, { useState, useEffect } from 'react';
import { apiUrl, formatAssetUrl } from '../../api';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  thumbnailUrl: string | null;
  category: string;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NewsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Tin tức');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [activeEditorTab, setActiveEditorTab] = useState<'edit' | 'preview'>('edit');

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/admin/posts'));
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách bài viết:', e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openAddModal = () => {
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Tin tức');
    setFormThumbnailUrl('');
    setFormSummary('');
    setFormContent('');
    setFormIsActive(true);
    setActiveEditorTab('edit');
    setModalMode('add');
  };

  const openEditModal = (p: Post) => {
    setSelectedPost(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormCategory(p.category);
    setFormThumbnailUrl(p.thumbnailUrl || '');
    setFormSummary(p.summary || '');
    setFormContent(p.content);
    setFormIsActive(p.isActive);
    setActiveEditorTab('edit');
    setModalMode('edit');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      title: formTitle,
      slug: formSlug || undefined,
      category: formCategory,
      thumbnailUrl: formThumbnailUrl || undefined,
      summary: formSummary || undefined,
      content: formContent,
      isActive: formIsActive,
    };

    try {
      const res = await fetch(apiUrl('/api/admin/posts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        setModalMode(null);
        alert('Tạo bài viết mới thành công!');
        loadPosts();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Không thể kết nối đến server để tạo bài viết.');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    const fieldsToUpdate = {
      title: formTitle,
      slug: formSlug || undefined,
      category: formCategory,
      thumbnailUrl: formThumbnailUrl,
      summary: formSummary,
      content: formContent,
      isActive: formIsActive,
    };

    try {
      const res = await fetch(apiUrl(`/api/admin/posts/${selectedPost.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate),
      });
      if (res.ok) {
        setModalMode(null);
        alert('Cập nhật bài viết thành công!');
        loadPosts();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Không thể kết nối đến server để cập nhật bài viết.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không? Thao tác này không thể khôi phục.')) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/posts/${id}`), {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Xóa bài viết thành công!');
        loadPosts();
        return;
      }
    } catch (err) {
      console.error(err);
    }
    alert('Không thể kết nối đến server để xóa bài viết.');
  };

  const insertTag = (startTag: string, endTag: string) => {
    const textarea = document.getElementById('post-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = startTag + selected + endTag;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setFormContent(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + selected.length);
    }, 0);
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header section */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Cổng thông tin</p>
          <h1 className="text-lg font-black text-[#123c34]">Tin tức &amp; Thông báo</h1>
          <p className="text-xs text-[#6b7773] mt-0.5">Quản lý và soạn thảo tin tức, hoạt động, thông báo đăng tải lên website chính.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-3.5 py-2 bg-[#e45136] hover:bg-[#c83f28] rounded-lg text-white font-bold text-[11px] shadow transition active:scale-[0.98]"
        >
          + Viết bài mới
        </button>
      </div>

      {/* Filter / Search bar */}
      <div className="w-full max-w-md">
        <input 
          type="text" 
          placeholder="Tìm kiếm bài viết theo tiêu đề hoặc danh mục..." 
          className="w-full h-9 px-4 rounded-lg bg-white border border-[#dce5e1] text-[#18211f] placeholder-[#9aa9a4] text-xs focus:outline-none focus:border-[#0f766e] transition-colors shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Posts Table */}
      <div className="w-full bg-white border border-[#dce5e1] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left text-[#18211f]">
          <thead className="bg-[#fbfdfc] text-[10px] font-black uppercase tracking-wider text-[#7a8b85] border-b border-[#edf2f0]">
            <tr>
              <th className="px-5 py-3 w-20">Ảnh bìa</th>
              <th className="px-5 py-3">Tiêu đề bài viết</th>
              <th className="px-5 py-3 w-32">Danh mục</th>
              <th className="px-5 py-3 w-24">Lượt xem</th>
              <th className="px-5 py-3 w-28">Trạng thái</th>
              <th className="px-5 py-3 w-28">Ngày viết</th>
              <th className="px-5 py-3 text-center w-24">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2f0] text-xs">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm font-semibold text-[#7a8b85]">
                  Đang tải danh sách bài viết...
                </td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm font-semibold text-[#7a8b85]">
                  Chưa có bài viết nào được tạo hoặc phù hợp bộ lọc.
                </td>
              </tr>
            ) : (
              filteredPosts.map(p => (
                <tr key={p.id} className="hover:bg-[#edf4f1]/20 transition-colors">
                  <td className="px-5 py-2.5">
                    <div className="bg-slate-100 rounded border border-[#dce5e1] w-14 h-9 overflow-hidden flex items-center justify-center shadow-sm">
                      <img src={formatAssetUrl(p.thumbnailUrl) || '/uploads/baner.jpg'} className="w-full h-full object-cover" alt="Thumb" />
                    </div>
                  </td>
                  <td className="px-5 py-2.5 font-bold text-[#123c34] max-w-sm truncate" title={p.title}>{p.title}</td>
                  <td className="px-5 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      p.category === 'Thông báo' 
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700' 
                        : 'border-teal-200 bg-teal-50 text-teal-700'
                    }`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 font-semibold text-slate-500">👁️ {p.views.toLocaleString()}</td>
                  <td className="px-5 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {p.isActive ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-slate-500 font-semibold">{formatDate(p.createdAt)}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="grid h-7 w-7 place-items-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100 transition"
                        title="Chỉnh sửa bài viết"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="grid h-7 w-7 place-items-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:border-red-400 hover:bg-red-100 transition"
                        title="Xóa bài viết"
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 bg-[#10211d]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={modalMode === 'add' ? handleAddSubmit : handleEditSubmit} className="bg-white border border-[#dce5e1] p-5 rounded-xl w-full max-w-4xl flex flex-col space-y-3.5 my-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-black text-[#123c34] border-b border-[#edf2f0] pb-2.5">
              {modalMode === 'add' ? 'Viết bài viết mới' : 'Chỉnh sửa bài viết'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Left Column - Meta */}
              <div className="flex flex-col space-y-3 md:col-span-1 border-r border-slate-100 pr-3.5">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Tiêu đề bài viết *</label>
                  <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formTitle} onChange={e => setFormTitle(e.target.value)} required placeholder="Nhập tiêu đề..." />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Slug (Đường dẫn URL)</label>
                  <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formSlug} onChange={e => setFormSlug(e.target.value)} placeholder="Tự sinh nếu để trống..." />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Danh mục *</label>
                  <select 
                    className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                  >
                    <option value="Tin tức">Tin tức (Mặc định)</option>
                    <option value="Thông báo">Thông báo</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Ảnh đại diện (URL)</label>
                  <input type="text" className="h-9 px-3 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold" value={formThumbnailUrl} onChange={e => setFormThumbnailUrl(e.target.value)} placeholder="Nhập URL ảnh đại diện..." />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Hoặc tải ảnh từ máy tính</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-[11px] text-[#52605b] file:mr-3 file:py-1.5 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#123c34] file:text-white hover:file:bg-[#0f766e] cursor-pointer"
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
                          setFormThumbnailUrl(data.url);
                        } else {
                          alert('Tải ảnh đại diện thất bại.');
                        }
                      } catch (err) {
                        console.error(err);
                        alert('Có lỗi xảy ra khi tải ảnh.');
                      }
                    }}
                  />
                </div>

                {formThumbnailUrl && (
                  <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative mt-1 flex items-center justify-center">
                    <img src={formatAssetUrl(formThumbnailUrl)} className="max-w-full max-h-full object-contain" alt="Preview Thumbnail" />
                    <button type="button" onClick={() => setFormThumbnailUrl('')} className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold" title="Xóa ảnh">X</button>
                  </div>
                )}

                <div className="flex items-center justify-between p-2.5 bg-[#fbfdfc] rounded-xl border border-[#dce5e1] mt-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-[#123c34]">Trạng thái hiển thị</span>
                    <span className="text-[9px] text-[#6b7773]">Hiển thị ngay trên website</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(!formIsActive)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formIsActive ? 'bg-[#0f766e]' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formIsActive ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Right Column - Editor / Content */}
              <div className="flex flex-col space-y-3 md:col-span-2">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Mô tả tóm tắt ngắn *</label>
                  <textarea rows={2} className="px-3 py-2 rounded-lg bg-[#fbfdfc] border border-[#dce5e1] text-[#18211f] focus:outline-none focus:border-[#0f766e] text-xs font-semibold resize-none" value={formSummary} onChange={e => setFormSummary(e.target.value)} required placeholder="Giới thiệu tóm tắt khoảng 2-3 câu..." />
                </div>

                <div className="flex flex-col flex-1 min-h-[300px]">
                  <div className="flex justify-between items-center bg-[#fbfdfc] border border-[#dce5e1] border-b-0 rounded-t-lg px-3 py-1.5">
                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className="px-2 py-1 rounded hover:bg-slate-200 font-black text-xs border border-slate-200 bg-white" title="In đậm (Bold)">B</button>
                      <button type="button" onClick={() => insertTag('<em>', '</em>')} className="px-2 py-1 rounded hover:bg-slate-200 italic text-xs border border-slate-200 bg-white" title="In nghiêng (Italic)">I</button>
                      <button type="button" onClick={() => insertTag('<h3>', '</h3>')} className="px-2 py-1 rounded hover:bg-slate-200 font-bold text-xs border border-slate-200 bg-white" title="Tiêu đề (Heading H3)">H3</button>
                      <button type="button" onClick={() => insertTag('<p>', '</p>')} className="px-2 py-1 rounded hover:bg-slate-200 text-xs border border-slate-200 bg-white" title="Đoạn văn (Paragraph)">P</button>
                      <button type="button" onClick={() => {
                        const url = prompt('Nhập địa chỉ URL liên kết:', 'https://');
                        if (url) insertTag(`<a href="${url}" class="text-[var(--site-primary)] hover:underline" target="_blank">`, '</a>');
                      }} className="px-2 py-1 rounded hover:bg-slate-200 text-xs border border-slate-200 bg-white text-blue-600 font-bold" title="Thêm liên kết">Link</button>
                      <button type="button" onClick={() => {
                        const url = prompt('Nhập địa chỉ URL của ảnh:', 'https://');
                        if (url) insertTag(`<img src="${url}" alt="Ảnh" class="max-w-full rounded-xl my-4 mx-auto block shadow-md" />`, '');
                      }} className="px-2 py-1 rounded hover:bg-slate-200 text-xs border border-slate-200 bg-white text-emerald-600 font-bold" title="Thêm ảnh">Image</button>
                      <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="px-2 py-1 rounded hover:bg-slate-200 text-xs border border-slate-200 bg-white font-mono" title="Danh sách (List)">List</button>
                    </div>

                    {/* View Switcher */}
                    <div className="flex border border-slate-200 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab('edit')}
                        className={`px-3 py-1 text-[10px] font-bold transition ${activeEditorTab === 'edit' ? 'bg-[#123c34] text-white' : 'bg-white text-slate-600'}`}
                      >
                        Soạn thảo
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab('preview')}
                        className={`px-3 py-1 text-[10px] font-bold transition ${activeEditorTab === 'preview' ? 'bg-[#123c34] text-white' : 'bg-white text-slate-600'}`}
                      >
                        Xem trước
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-[260px] border border-[#dce5e1] rounded-b-lg overflow-hidden bg-white">
                    {activeEditorTab === 'edit' ? (
                      <textarea
                        id="post-content-textarea"
                        className="flex-1 w-full p-3 text-xs font-mono focus:outline-none resize-none leading-relaxed"
                        value={formContent}
                        onChange={e => setFormContent(e.target.value)}
                        placeholder="Nhập nội dung chi tiết bài viết (chấp nhận thẻ HTML, dùng thanh công cụ ở trên để định dạng nhanh)..."
                        required
                      />
                    ) : (
                      <div className="flex-1 p-3 overflow-y-auto max-h-[360px] text-slate-800 text-sm leading-relaxed prose max-w-none">
                        {formContent ? (
                          <div dangerouslySetInnerHTML={{ __html: formContent }} />
                        ) : (
                          <p className="text-slate-400 text-xs italic">Nội dung xem trước sẽ hiển thị ở đây sau khi bạn viết nội dung.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#edf2f0]">
              <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-1.5 border border-[#dce5e1] hover:bg-[#edf4f1] rounded-lg text-[#52605b] text-[10px] font-bold transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-3.5 py-1.5 bg-[#123c34] hover:bg-[#0f766e] rounded-lg text-white text-[10px] font-bold shadow transition-colors">Lưu lại</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
