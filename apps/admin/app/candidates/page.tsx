'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Candidate } from '@huitfest/shared';

const INITIAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Nguyễn Thanh Tân', votes: 106100, imageUrl: '/original_assets/image389b.png', description: "Thí sinh tài năng của HUIT's Iconic 2024." },
  { id: '2', sbd: '089', name: 'Nguyễn Đình Tú', votes: 62215, imageUrl: '/original_assets/image725f.png', description: "Chiến binh bản lĩnh mang màu sắc nhiệt huyết." },
  { id: '3', sbd: '024', name: 'Lê Ngọc Yến Vy', votes: 22800, imageUrl: '/original_assets/image940e.jpg', description: "Đại diện cho vẻ đẹp tri thức và sự duyên dáng." },
];

function CandidateModal({
  title,
  formName,
  formSbd,
  formVotes,
  formDesc,
  formImage,
  setFormName,
  setFormSbd,
  setFormVotes,
  setFormDesc,
  setFormImage,
  onClose,
  onSubmit,
}: {
  title: string;
  formName: string;
  formSbd: string;
  formVotes: number;
  formDesc: string;
  formImage: string;
  setFormName: (value: string) => void;
  setFormSbd: (value: string) => void;
  setFormVotes: (value: number) => void;
  setFormDesc: (value: string) => void;
  setFormImage: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#10211d]/60 p-4 backdrop-blur-sm transition-all duration-300">
      <form onSubmit={onSubmit} className="w-full max-w-[500px] rounded-xl border border-[#dce5e1] bg-white p-5 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-3 border-b border-[#edf2f0] pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Thông tin ứng viên</p>
            <h3 className="mt-0.5 text-base font-black text-[#123c34]">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded border border-[#dce5e1] px-2.5 py-1 text-[10px] font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e] transition-colors">
            Đóng
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Họ và tên</span>
            <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formName} onChange={(event) => setFormName(event.target.value)} required />
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Số báo danh (SBD)</span>
            <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formSbd} onChange={(event) => setFormSbd(event.target.value)} required />
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Số phiếu bình chọn</span>
            <input type="number" className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formVotes} onChange={(event) => setFormVotes(Number(event.target.value))} min={0} />
          </label>

          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Đường dẫn ảnh đại diện</span>
            <input className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formImage} onChange={(event) => setFormImage(event.target.value)} />
          </label>

          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-[10px] font-bold text-[#52605b] uppercase tracking-wider">Mô tả ngắn</span>
            <textarea className="h-20 w-full resize-none rounded-lg border border-[#dce5e1] bg-[#fbfdfc] p-2.5 text-xs font-medium text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formDesc} onChange={(event) => setFormDesc(event.target.value)} required />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-[#edf2f0] pt-3.5">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#dce5e1] bg-white px-3.5 py-2 text-[10px] font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e] transition-colors">
            Hủy bỏ
          </button>
          <button type="submit" className="rounded-lg bg-[#123c34] px-3.5 py-2 text-[10px] font-bold text-white shadow transition hover:bg-[#0f766e]">
            Lưu hồ sơ
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CandidatesAdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_MOCK_CANDIDATES);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [formName, setFormName] = useState('');
  const [formSbd, setFormSbd] = useState('');
  const [formVotes, setFormVotes] = useState(0);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');

  useEffect(() => {
    async function loadFromApi() {
      try {
        const res = await fetch('http://localhost:5000/api/candidates');
        if (res.ok) setCandidates(await res.json());
      } catch (e) {
        console.log('Backend API offline, showing local mock admin candidates.');
      }
    }

    loadFromApi();
  }, []);

  const rankedCandidates = useMemo(() => [...candidates].sort((a, b) => b.votes - a.votes), [candidates]);
  const filteredCandidates = rankedCandidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(search.toLowerCase()) || candidate.sbd.includes(search)
  );
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  const openAddModal = () => {
    setFormName('');
    setFormSbd('');
    setFormVotes(0);
    setFormDesc('');
    setFormImage('/original_assets/image389b.png');
    setIsAddModalOpen(true);
  };

  const openEditModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFormName(candidate.name);
    setFormSbd(candidate.sbd);
    setFormVotes(candidate.votes);
    setFormDesc(candidate.description);
    setFormImage(candidate.imageUrl);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newCandidate: Partial<Candidate> = {
      name: formName,
      sbd: formSbd,
      votes: formVotes,
      description: formDesc,
      imageUrl: formImage,
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCandidate),
      });
      if (res.ok) {
        const added = await res.json();
        setCandidates((prev) => [...prev, added]);
        setIsAddModalOpen(false);
        alert('Thêm thí sinh thành công!');
        return;
      }
    } catch (err) {}

    setCandidates((prev) => [...prev, { id: Date.now().toString(), name: formName, sbd: formSbd, votes: formVotes, description: formDesc, imageUrl: formImage }]);
    setIsAddModalOpen(false);
    alert('Thêm thí sinh offline thành công!');
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCandidate) return;

    const fieldsToUpdate: Partial<Candidate> = {
      name: formName,
      sbd: formSbd,
      votes: formVotes,
      description: formDesc,
      imageUrl: formImage,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/admin/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidates((prev) => prev.map((candidate) => candidate.id === selectedCandidate.id ? updated : candidate));
        setIsEditModalOpen(false);
        alert('Cập nhật hồ sơ thí sinh thành công!');
        return;
      }
    } catch (err) {}

    setCandidates((prev) => prev.map((candidate) => candidate.id === selectedCandidate.id ? { ...candidate, ...fieldsToUpdate } : candidate));
    setIsEditModalOpen(false);
    alert('Cập nhật hồ sơ offline thành công!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thí sinh này khỏi hệ thống bình chọn không?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/candidates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
        alert('Xóa thí sinh thành công!');
        return;
      }
    } catch (err) {}

    setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
    alert('Xóa thí sinh offline thành công!');
  };

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e] font-heading">Quản lý dữ liệu</p>
          <h2 className="mt-0.5 text-lg font-black text-[#123c34]">Danh sách thí sinh</h2>
          <p className="text-xs text-[#6b7773] mt-0.5">Theo dõi hồ sơ, số báo danh và lượt bình chọn của thí sinh.</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e45136] px-3.5 py-2 text-[11px] font-bold text-white shadow transition hover:bg-[#c83f28] active:scale-[0.98] font-heading">
          <span className="text-sm leading-none">+</span>
          Thêm thí sinh mới
        </button>
      </section>

      <section className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        <div className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85] font-heading">Tổng số thí sinh</p>
          <p className="mt-1 text-2xl font-black text-[#123c34] font-heading">{candidates.length}</p>
        </div>
        <div className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85] font-heading">Tổng số phiếu bầu</p>
          <p className="mt-1 text-2xl font-black text-[#123c34] font-heading">{totalVotes.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85] font-heading">Ứng viên dẫn đầu</p>
          <p className="mt-1 truncate text-xl font-black text-[#e45136] font-heading">{rankedCandidates[0]?.name || 'Chưa có'}</p>
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
              placeholder="Tìm theo tên hoặc số báo danh (SBD)..."
              className="h-9 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] pl-9 pr-3 text-xs font-semibold text-[#18211f] outline-none transition placeholder:text-[#9aa9a4] focus:border-[#0f766e] focus:bg-white"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <p className="text-[10px] font-bold text-[#6b7773] uppercase tracking-wider font-heading">{filteredCandidates.length} kết quả tìm thấy</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-[10px] font-black uppercase tracking-[0.12em] text-[#7a8b85] font-heading">
                <th className="px-5 py-3">Thí sinh</th>
                <th className="px-5 py-3">SBD</th>
                <th className="px-5 py-3">Số phiếu bầu</th>
                <th className="px-5 py-3">Mô tả</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f0] text-xs">
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="transition hover:bg-[#edf4f1]/20">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-[#dce5e1] bg-[#edf4f1]">
                        <img src={candidate.imageUrl} className="h-full w-full object-cover object-top" alt={candidate.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#123c34]">{candidate.name}</p>
                        <p className="text-[10px] font-semibold text-[#0f766e]">Xếp hạng #{index + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="rounded-full bg-[#edf4f1] px-2.5 py-0.5 text-[10px] font-bold text-[#0f766e] border border-teal-500/10 font-heading">{candidate.sbd}</span>
                  </td>
                  <td className="px-5 py-2.5 text-xs font-black text-[#123c34] font-heading">{candidate.votes.toLocaleString()}</td>
                  <td className="max-w-[320px] truncate px-5 py-2.5 text-[11px] font-semibold text-[#6b7773]">{candidate.description}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEditModal(candidate)} className="rounded-lg border border-[#dce5e1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#0f766e] transition hover:bg-[#edf4f1] hover:border-[#0f766e]">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(candidate.id)} className="rounded-lg border border-[#f0c9bd] bg-[#fff5f2] px-2.5 py-1 text-[11px] font-bold text-[#c83f28] transition hover:bg-[#e45136]/10 hover:border-[#e45136]">
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
        <CandidateModal
          title="Thêm thí sinh mới"
          formName={formName}
          formSbd={formSbd}
          formVotes={formVotes}
          formDesc={formDesc}
          formImage={formImage}
          setFormName={setFormName}
          setFormSbd={setFormSbd}
          setFormVotes={setFormVotes}
          setFormDesc={setFormDesc}
          setFormImage={setFormImage}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {isEditModalOpen && (
        <CandidateModal
          title="Chỉnh sửa hồ sơ thí sinh"
          formName={formName}
          formSbd={formSbd}
          formVotes={formVotes}
          formDesc={formDesc}
          formImage={formImage}
          setFormName={setFormName}
          setFormSbd={setFormSbd}
          setFormVotes={setFormVotes}
          setFormDesc={setFormDesc}
          setFormImage={setFormImage}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
