'use client';

import React, { useState, useEffect } from 'react';
import { Candidate } from '@huitfest/shared';

const INITIAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Nguyễn Thanh Tân', votes: 106100, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150', description: 'Thí sinh tài năng của HUIT\'s Iconic 2024.' },
  { id: '2', sbd: '089', name: 'Nguyễn Đình Tú', votes: 62215, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150', description: 'Chiến binh bản lĩnh mang màu sắc nhiệt huyết.' },
  { id: '3', sbd: '024', name: 'Lê Ngọc Yến Vy', votes: 22800, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', description: 'Đại diện cho vẻ đẹp tri thức và sự duyên dáng.' },
  { id: '4', sbd: '096', name: 'Võ Bá Thiện', votes: 20590, imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', description: 'Nụ cười tỏa nắng cùng trái tim ấm áp.' },
  { id: '5', sbd: '018', name: 'Trần Tuyết Ngân', votes: 16070, imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150', description: 'Gương mặt cá tính đầy bứt phá.' },
  { id: '6', sbd: '095', name: 'Nguyễn Thị Cẩm Thanh', votes: 8410, imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150', description: 'Sự kết hợp hoàn hảo giữa năng động và dịu dàng.' },
];

export default function CandidatesAdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_MOCK_CANDIDATES);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Form fields state
  const [formName, setFormName] = useState('');
  const [formSbd, setFormSbd] = useState('');
  const [formVotes, setFormVotes] = useState(0);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');

  useEffect(() => {
    async function loadFromApi() {
      try {
        const res = await fetch('http://localhost:5000/api/candidates');
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        }
      } catch (e) {
        console.log('Backend API offline, showing local mock admin candidates.');
      }
    }
    loadFromApi();
  }, []);

  const openAddModal = () => {
    setFormName('');
    setFormSbd('');
    setFormVotes(0);
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150');
    setIsAddModalOpen(true);
  };

  const openEditModal = (c: Candidate) => {
    setSelectedCandidate(c);
    setFormName(c.name);
    setFormSbd(c.sbd);
    setFormVotes(c.votes);
    setFormDesc(c.description);
    setFormImage(c.imageUrl);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCandidate: Partial<Candidate> = {
      name: formName,
      sbd: formSbd,
      votes: formVotes,
      description: formDesc,
      imageUrl: formImage
    };

    // Try posting to NestJS
    try {
      const res = await fetch('http://localhost:5000/api/admin/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCandidate),
      });
      if (res.ok) {
        const added = await res.json();
        setCandidates(prev => [...prev, added]);
        setIsAddModalOpen(false);
        alert('Thêm thí sinh thành công!');
        return;
      }
    } catch (err) {}

    // Fallback local mock state update
    const addedMock: Candidate = {
      id: (candidates.length + 1).toString(),
      name: formName,
      sbd: formSbd,
      votes: formVotes,
      description: formDesc,
      imageUrl: formImage
    };
    setCandidates([...candidates, addedMock]);
    setIsAddModalOpen(false);
    alert('Thêm thí sinh offline thành công!');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const fieldsToUpdate: Partial<Candidate> = {
      name: formName,
      sbd: formSbd,
      votes: formVotes,
      description: formDesc,
      imageUrl: formImage
    };

    // Try put request to NestJS
    try {
      const res = await fetch(`http://localhost:5000/api/admin/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? updated : c));
        setIsEditModalOpen(false);
        alert('Cập nhật thí sinh thành công!');
        return;
      }
    } catch (err) {}

    // Fallback local mock state update
    setCandidates(prev =>
      prev.map(c => c.id === selectedCandidate.id ? { ...c, ...fieldsToUpdate } : c)
    );
    setIsEditModalOpen(false);
    alert('Cập nhật thí sinh offline thành công!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thí sinh này không?')) return;

    // Try delete request to NestJS
    try {
      const res = await fetch(`http://localhost:5000/api/admin/candidates/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCandidates(prev => prev.filter(c => c.id !== id));
        alert('Xóa thí sinh thành công!');
        return;
      }
    } catch (err) {}

    // Fallback local mock state update
    setCandidates(prev => prev.filter(c => c.id !== id));
    alert('Xóa thí sinh offline thành công!');
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.sbd.includes(search)
  );

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] font-bold text-slate-100">Quản lý Thí sinh</h1>
          <p className="text-[14px] text-slate-400 mt-1">Danh sách tất cả thí sinh tham gia HUIT's Iconic 2024.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium text-[14px] transition-colors"
        >
          + Thêm thí sinh
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="w-full max-w-[400px]">
        <input 
          type="text" 
          placeholder="Tìm kiếm thí sinh theo tên hoặc SBD..." 
          className="w-full h-[40px] px-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Candidates Table */}
      <div className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full border-collapse text-left text-slate-200">
          <thead className="bg-slate-700/50 text-[13px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3.5">Ảnh</th>
              <th className="px-6 py-3.5">SBD</th>
              <th className="px-6 py-3.5">Họ và Tên</th>
              <th className="px-6 py-3.5">Số phiếu</th>
              <th className="px-6 py-3.5">Mô tả</th>
              <th className="px-6 py-3.5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-[14px]">
            {filteredCandidates.map(c => (
              <tr key={c.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4">
                  <img src={c.imageUrl} className="w-10 h-10 object-cover object-top rounded-full border border-slate-600" alt="" />
                </td>
                <td className="px-6 py-4 font-bold text-blue-400">{c.sbd}</td>
                <td className="px-6 py-4 font-semibold text-slate-100">{c.name}</td>
                <td className="px-6 py-4">{c.votes.toLocaleString()}</td>
                <td className="px-6 py-4 max-w-[250px] truncate text-slate-400">{c.description}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => openEditModal(c)}
                    className="text-blue-400 hover:text-blue-300 font-medium text-[13px]"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(c.id)}
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

      {/* ADD CANDIDATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Thêm Thí sinh</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Họ và Tên</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formName} onChange={e => setFormName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[12px] text-slate-400 font-medium">Số báo danh (SBD)</label>
                <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formSbd} onChange={e => setFormSbd(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[12px] text-slate-400 font-medium">Số phiếu ban đầu</label>
                <input type="number" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formVotes} onChange={e => setFormVotes(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Đường dẫn ảnh đại diện</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formImage} onChange={e => setFormImage(e.target.value)} />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Mô tả ngắn</label>
              <textarea className="h-20 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px] resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} required />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 text-[14px]">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[14px] font-medium">Lưu</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT CANDIDATE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleEditSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-[460px] flex flex-col space-y-4">
            <h3 className="text-[18px] font-bold text-white border-b border-slate-700 pb-2">Sửa Thí sinh</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Họ và Tên</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formName} onChange={e => setFormName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[12px] text-slate-400 font-medium">Số báo danh (SBD)</label>
                <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formSbd} onChange={e => setFormSbd(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[12px] text-slate-400 font-medium">Số phiếu bình chọn</label>
                <input type="number" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formVotes} onChange={e => setFormVotes(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Đường dẫn ảnh đại diện</label>
              <input type="text" className="h-10 px-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px]" value={formImage} onChange={e => setFormImage(e.target.value)} />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px] text-slate-400 font-medium">Mô tả ngắn</label>
              <textarea className="h-20 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500 text-[14px] resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} required />
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
