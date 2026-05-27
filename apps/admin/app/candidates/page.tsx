'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Candidate } from '@huitfest/shared';

const INITIAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Nguyen Thanh Tan', votes: 106100, imageUrl: '/original_assets/image389b.png', description: "Thi sinh cua HUIT's Iconic 2024." },
  { id: '2', sbd: '089', name: 'Nguyen Dinh Tu', votes: 62215, imageUrl: '/original_assets/image725f.png', description: "Thi sinh cua HUIT's Iconic 2024." },
  { id: '3', sbd: '024', name: 'Le Ngoc Yen Vy', votes: 22800, imageUrl: '/original_assets/image940e.jpg', description: "Thi sinh cua HUIT's Iconic 2024." },
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#10211d]/60 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="w-full max-w-[560px] rounded-lg border border-[#dce5e1] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#edf2f0] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">Ho so thi sinh</p>
            <h3 className="mt-1 text-xl font-black text-[#18211f]">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-[#dce5e1] px-3 py-2 text-sm font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e]">
            Dong
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-[#52605b]">Ho va ten</span>
            <input className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formName} onChange={(event) => setFormName(event.target.value)} required />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-[#52605b]">So bao danh</span>
            <input className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formSbd} onChange={(event) => setFormSbd(event.target.value)} required />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-[#52605b]">So phieu</span>
            <input type="number" className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formVotes} onChange={(event) => setFormVotes(Number(event.target.value))} min={0} />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-[#52605b]">Duong dan anh</span>
            <input className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formImage} onChange={(event) => setFormImage(event.target.value)} />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-[#52605b]">Mo ta ngan</span>
            <textarea className="h-24 w-full resize-none rounded-lg border border-[#dce5e1] bg-[#fbfdfc] p-3 text-sm font-medium text-[#18211f] outline-none transition focus:border-[#0f766e] focus:bg-white" value={formDesc} onChange={(event) => setFormDesc(event.target.value)} required />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#edf2f0] pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#dce5e1] bg-white px-4 py-2.5 text-sm font-bold text-[#52605b] hover:border-[#0f766e] hover:text-[#0f766e]">
            Huy
          </button>
          <button type="submit" className="rounded-lg bg-[#123c34] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f766e]">
            Luu ho so
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
        return;
      }
    } catch (err) {}

    setCandidates((prev) => [...prev, { id: Date.now().toString(), name: formName, sbd: formSbd, votes: formVotes, description: formDesc, imageUrl: formImage }]);
    setIsAddModalOpen(false);
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
        return;
      }
    } catch (err) {}

    setCandidates((prev) => prev.map((candidate) => candidate.id === selectedCandidate.id ? { ...candidate, ...fieldsToUpdate } : candidate));
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ban co chac chan muon xoa thi sinh nay?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/candidates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
        return;
      }
    } catch (err) {}

    setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quan ly du lieu</p>
          <h2 className="mt-1 text-2xl font-black text-[#18211f]">Thi sinh</h2>
          <p className="mt-1 text-sm text-[#6b7773]">Theo doi ho so, so bao danh va luot binh chon hien tai.</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e45136] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c83f28]">
          <span className="text-lg leading-none">+</span>
          Them thi sinh
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Tong thi sinh</p>
          <p className="mt-2 text-3xl font-black text-[#18211f]">{candidates.length}</p>
        </div>
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Tong phieu</p>
          <p className="mt-2 text-3xl font-black text-[#18211f]">{totalVotes.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Dang dan dau</p>
          <p className="mt-2 truncate text-2xl font-black text-[#18211f]">{rankedCandidates[0]?.name || 'Chua co'}</p>
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
              placeholder="Tim theo ten hoac SBD..."
              className="h-11 w-full rounded-lg border border-[#dce5e1] bg-[#fbfdfc] pl-10 pr-3 text-sm font-semibold text-[#18211f] outline-none transition placeholder:text-[#9aa9a4] focus:border-[#0f766e] focus:bg-white"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <p className="text-sm font-semibold text-[#6b7773]">{filteredCandidates.length} ket qua</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-xs font-black uppercase tracking-[0.12em] text-[#7a8b85]">
                <th className="px-5 py-4">Thi sinh</th>
                <th className="px-5 py-4">SBD</th>
                <th className="px-5 py-4">So phieu</th>
                <th className="px-5 py-4">Mo ta</th>
                <th className="px-5 py-4 text-right">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f0]">
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="transition hover:bg-[#fbfdfc]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#dce5e1] bg-[#edf4f1]">
                        <img src={candidate.imageUrl} className="h-full w-full object-cover object-top" alt={candidate.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#18211f]">{candidate.name}</p>
                        <p className="text-xs font-semibold text-[#7a8b85]">Hang #{index + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-sm font-black text-[#0f766e]">{candidate.sbd}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-black text-[#18211f]">{candidate.votes.toLocaleString()}</td>
                  <td className="max-w-[320px] truncate px-5 py-4 text-sm font-medium text-[#6b7773]">{candidate.description}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(candidate)} className="rounded-lg border border-[#dce5e1] bg-white px-3 py-2 text-sm font-bold text-[#0f766e] transition hover:border-[#0f766e]">
                        Sua
                      </button>
                      <button onClick={() => handleDelete(candidate.id)} className="rounded-lg border border-[#f0c9bd] bg-[#fff5f2] px-3 py-2 text-sm font-bold text-[#c83f28] transition hover:border-[#e45136]">
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
        <CandidateModal
          title="Them thi sinh"
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
          title="Sua thi sinh"
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
