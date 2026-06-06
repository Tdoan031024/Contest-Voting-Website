'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Candidate } from '@huitfest/shared';
import { apiUrl, formatAssetUrl } from '../../api';

const tableLabels: Record<string, string> = {
  HIGH_SCHOOL: 'Bảng học sinh',
  STUDENT: 'Bảng sinh viên, học viên',
  ENTERPRISE: 'Bảng cá nhân, tổ chức, doanh nghiệp',
};

const emptyProject: Partial<Candidate> = {
  sbd: '',
  name: '',
  votes: 0,
  imageUrl: '/original_assets/image389b.png',
  description: '',
  biography: '',
  contestTable: 'STUDENT',
  contestTableLabel: tableLabels.STUDENT,
  sector: '',
  status: 'Đang cập nhật',
  currentRound: 'Vòng loại',
  teamName: '',
  representativeSchool: '',
  leaderName: '',
  leaderPhone: '',
  leaderEmail: '',
  advisorName: '',
  members: '',
  supportNeeds: '',
  expectations: '',
  implementationLocation: '',
  intellectualPropertyCommitment: true,
};

function Pill({
  children,
  tone = 'slate',
}: {
  children: React.ReactNode;
  tone?: 'green' | 'blue' | 'orange' | 'red' | 'slate';
}) {
  const classes = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-sky-200 bg-sky-50 text-sky-700',
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none ${classes[tone]}`}>
      {children}
    </span>
  );
}

function ActionButton({
  title,
  tone,
  children,
  onClick,
  href,
}: {
  title: string;
  tone: 'view' | 'edit' | 'delete';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const classes = {
    view: 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700',
    edit: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100',
    delete: 'border-red-200 bg-red-50 text-red-600 hover:border-red-400 hover:bg-red-100',
  };
  const className = `grid h-9 w-9 place-items-center rounded-lg border transition ${classes[tone]}`;

  if (href) {
    return (
      <Link href={href} title={title} aria-label={title} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} title={title} aria-label={title} className={className}>
      {children}
    </button>
  );
}

function roundTone(round?: string): 'green' | 'blue' | 'orange' | 'slate' {
  if (!round) return 'slate';
  if (round.includes('chung')) return 'orange';
  if (round.includes('bán')) return 'blue';
  if (round.includes('loại')) return 'green';
  return 'slate';
}

function ProjectModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
}: {
  title: string;
  form: Partial<Candidate>;
  setForm: (value: Partial<Candidate>) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const update = (key: keyof Candidate, value: any) => {
    const next = { ...form, [key]: value };
    if (key === 'contestTable') next.contestTableLabel = tableLabels[value] || value;
    setForm(next);
  };

  const inputClass = 'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white';
  const labelText = 'text-[10px] font-black uppercase tracking-[0.12em] text-slate-500';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="mx-auto my-6 w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Hồ sơ dự án dự thi</p>
            <h3 className="mt-1 text-xl font-black text-slate-900">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-700">
            Đóng
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="space-y-1.5 md:col-span-2">
            <span className={labelText}>Tên dự án</span>
            <input className={inputClass} value={form.name || ''} onChange={(event) => update('name', event.target.value)} required />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Mã dự án / SBD</span>
            <input className={inputClass} value={form.sbd || ''} onChange={(event) => update('sbd', event.target.value)} required />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Bảng thi</span>
            <select className={inputClass} value={form.contestTable || 'STUDENT'} onChange={(event) => update('contestTable', event.target.value)}>
              <option value="HIGH_SCHOOL">Bảng học sinh</option>
              <option value="STUDENT">Bảng sinh viên, học viên</option>
              <option value="ENTERPRISE">Bảng cá nhân, tổ chức, doanh nghiệp</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Lĩnh vực</span>
            <input className={inputClass} value={form.sector || ''} onChange={(event) => update('sector', event.target.value)} placeholder="AI, thực phẩm, giáo dục..." />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Vòng hiện tại</span>
            <select className={inputClass} value={form.currentRound || 'Vòng loại'} onChange={(event) => update('currentRound', event.target.value)}>
              <option>Vòng loại</option>
              <option>Vòng bán kết</option>
              <option>Vòng chung kết</option>
              <option>Bình chọn online</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Trạng thái</span>
            <input className={inputClass} value={form.status || ''} onChange={(event) => update('status', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Điểm bình chọn</span>
            <input type="number" min={0} className={inputClass} value={form.votes || 0} onChange={(event) => update('votes', Number(event.target.value))} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Đường dẫn ảnh</span>
            <input className={inputClass} value={form.imageUrl || ''} onChange={(event) => update('imageUrl', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Tên nhóm</span>
            <input className={inputClass} value={form.teamName || ''} onChange={(event) => update('teamName', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Đơn vị / trường</span>
            <input className={inputClass} value={form.representativeSchool || ''} onChange={(event) => update('representativeSchool', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Trưởng nhóm</span>
            <input className={inputClass} value={form.leaderName || ''} onChange={(event) => update('leaderName', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>SĐT trưởng nhóm</span>
            <input className={inputClass} value={form.leaderPhone || ''} onChange={(event) => update('leaderPhone', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Email trưởng nhóm</span>
            <input type="email" className={inputClass} value={form.leaderEmail || ''} onChange={(event) => update('leaderEmail', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Cố vấn</span>
            <input className={inputClass} value={form.advisorName || ''} onChange={(event) => update('advisorName', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Thành viên nhóm</span>
            <input className={inputClass} value={form.members || ''} onChange={(event) => update('members', event.target.value)} placeholder="Tên các thành viên..." />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Địa điểm triển khai</span>
            <input className={inputClass} value={form.implementationLocation || ''} onChange={(event) => update('implementationLocation', event.target.value)} placeholder="Ví dụ: TP. Hồ Chí Minh" />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Cam kết sở hữu trí tuệ</span>
            <select className={inputClass} value={form.intellectualPropertyCommitment === false ? 'false' : 'true'} onChange={(event) => update('intellectualPropertyCommitment', event.target.value === 'true')}>
              <option value="true">Có cam kết</option>
              <option value="false">Không cam kết</option>
            </select>
          </label>
          <label className="space-y-1.5 md:col-span-3">
            <span className={labelText}>Mô tả ngắn</span>
            <textarea className="h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white" value={form.description || ''} onChange={(event) => update('description', event.target.value)} required />
          </label>
          <label className="space-y-1.5 md:col-span-3">
            <span className={labelText}>Thuyết minh / nội dung chi tiết</span>
            <textarea className="h-28 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white" value={form.biography || ''} onChange={(event) => update('biography', event.target.value)} />
          </label>
          <label className="space-y-1.5 md:col-span-3">
            <span className={labelText}>Nhu cầu hỗ trợ</span>
            <textarea className="h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white" value={form.supportNeeds || ''} onChange={(event) => update('supportNeeds', event.target.value)} placeholder="Nhu cầu về vốn, công nghệ, mentor, mặt bằng..." />
          </label>
          <label className="space-y-1.5 md:col-span-3">
            <span className={labelText}>Kỳ vọng sau cuộc thi</span>
            <textarea className="h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white" value={form.expectations || ''} onChange={(event) => update('expectations', event.target.value)} placeholder="Kết nối đầu tư, thương mại hóa sản phẩm, truyền thông..." />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-700">
            Hủy
          </button>
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700">
            Lưu hồ sơ
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CandidatesAdminPage() {
  const [projects, setProjects] = useState<Candidate[]>([]);
  const [search, setSearch] = useState('');
  const [tableFilter, setTableFilter] = useState('ALL');
  const [roundFilter, setRoundFilter] = useState('ALL');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedProject, setSelectedProject] = useState<Candidate | null>(null);
  const [form, setForm] = useState<Partial<Candidate>>(emptyProject);

  useEffect(() => {
    async function loadProjects() {
      const res = await fetch(apiUrl('/api/candidates'));
      if (res.ok) setProjects(await res.json());
    }
    loadProjects().catch(() => setProjects([]));
  }, []);

  const rankedProjects = useMemo(() => [...projects].sort((a, b) => b.votes - a.votes), [projects]);

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return rankedProjects
      .filter((project) => tableFilter === 'ALL' || project.contestTable === tableFilter)
      .filter((project) => roundFilter === 'ALL' || project.currentRound === roundFilter)
      .filter((project) =>
        !keyword ||
        project.name.toLowerCase().includes(keyword) ||
        project.sbd.toLowerCase().includes(keyword) ||
        (project.teamName || '').toLowerCase().includes(keyword) ||
        (project.leaderName || '').toLowerCase().includes(keyword) ||
        (project.representativeSchool || '').toLowerCase().includes(keyword)
      );
  }, [rankedProjects, roundFilter, search, tableFilter]);

  const totalVotes = projects.reduce((sum, project) => sum + project.votes, 0);
  const missingInfo = projects.filter((project) => !project.teamName || !project.leaderName || !project.contestTable).length;
  const leadingProject = rankedProjects[0];

  const openAddModal = () => {
    setSelectedProject(null);
    setForm({ ...emptyProject });
    setModalMode('add');
  };

  const openEditModal = (project: Candidate) => {
    setSelectedProject(project);
    setForm({ ...emptyProject, ...project });
    setModalMode('edit');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isEdit = modalMode === 'edit' && selectedProject;
    const endpoint = isEdit ? `/api/admin/candidates/${selectedProject.id}` : '/api/admin/candidates';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(apiUrl(endpoint), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert('Không thể lưu hồ sơ dự án. Vui lòng kiểm tra backend.');
      return;
    }

    const saved = await res.json();
    setProjects((prev) => isEdit ? prev.map((project) => project.id === saved.id ? saved : project) : [saved, ...prev]);
    setModalMode(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa hồ sơ dự án này khỏi hệ thống?')) return;
    const res = await fetch(apiUrl(`/api/admin/candidates/${id}`), { method: 'DELETE' });
    if (res.ok) setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return (
    <div className="w-full max-w-full space-y-5">
      <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Quản lý cuộc thi</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Danh sách dự án tham gia HUIT Startup</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Quản lý hồ sơ dự án, nhóm dự thi, vòng thi và điểm bình chọn. Ưu tiên xem nhanh trạng thái, điểm và thao tác xử lý.
            </p>
          </div>
          <button onClick={openAddModal} className="h-11 rounded-xl bg-[#e45136] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#c83f28]">
            Thêm dự án mới
          </button>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-4 md:divide-x md:divide-y-0">
          {[
            ['Tổng dự án', projects.length.toLocaleString(), 'Hồ sơ trong hệ thống'],
            ['Thiếu thông tin', missingInfo.toLocaleString(), 'Cần bổ sung nhóm/trưởng nhóm'],
            ['Tổng điểm', totalVotes.toLocaleString(), 'Điểm bình chọn toàn hệ thống'],
            ['Dẫn đầu', leadingProject?.name || 'Chưa có', leadingProject ? `Mã ${leadingProject.sbd}` : 'Chưa có dữ liệu'],
          ].map(([label, value, note]) => (
            <div key={label} className="p-5 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
              <p className="mt-2 truncate text-2xl font-black text-slate-950">{value}</p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-500">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_200px_180px_110px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên dự án, mã, nhóm, trưởng nhóm hoặc đơn vị..."
            className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white"
          />
          <select value={tableFilter} onChange={(event) => setTableFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-emerald-600">
            <option value="ALL">Tất cả bảng thi</option>
            <option value="HIGH_SCHOOL">Bảng học sinh</option>
            <option value="STUDENT">Bảng sinh viên</option>
            <option value="ENTERPRISE">Bảng doanh nghiệp</option>
          </select>
          <select value={roundFilter} onChange={(event) => setRoundFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-emerald-600">
            <option value="ALL">Tất cả vòng</option>
            <option>Vòng loại</option>
            <option>Vòng bán kết</option>
            <option>Vòng chung kết</option>
            <option>Bình chọn online</option>
          </select>
          <div className="flex h-11 items-center justify-center rounded-xl bg-slate-50 text-xs font-black text-slate-500">
            {filteredProjects.length.toLocaleString()} kết quả
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                <th className="px-5 py-4">Hồ sơ</th>
                <th className="px-5 py-4">Phân loại</th>
                <th className="px-5 py-4">Đại diện</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Điểm</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProjects.map((project) => {
                const rank = rankedProjects.findIndex((item) => item.id === project.id) + 1;
                const hasMissingInfo = !project.teamName || !project.leaderName || !project.contestTable;
                const projectTableLabel = project.contestTableLabel || tableLabels[project.contestTable || ''] || 'Chưa phân bảng';
 
                return (
                  <tr key={project.id} className="align-middle transition hover:bg-emerald-50/35">
                    <td className="px-5 py-4">
                      <div className="flex min-w-[240px] items-center gap-3">
                        <img src={formatAssetUrl(project.imageUrl)} alt={project.name} className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="max-w-[150px] truncate font-black text-slate-950">{project.name}</p>
                            <Pill>Mã {project.sbd}</Pill>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Pill tone="green">Hạng #{rank}</Pill>
                            {hasMissingInfo ? <Pill tone="red">Thiếu thông tin</Pill> : <Pill tone="blue">Đủ hồ sơ</Pill>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-[150px]">
                        <p className="truncate font-bold text-slate-900">{projectTableLabel}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">{project.sector || 'Chưa cập nhật lĩnh vực'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-[160px]">
                        <p className="truncate font-bold text-slate-900">{project.teamName || 'Chưa cập nhật nhóm'}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{project.leaderName || 'Chưa có trưởng nhóm'}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{project.representativeSchool || 'Chưa cập nhật đơn vị'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <Pill tone={roundTone(project.currentRound)}>{project.currentRound || 'Vòng loại'}</Pill>
                        <p className="max-w-[110px] truncate text-xs font-semibold text-slate-600">{project.status || 'Đang cập nhật'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-xl font-black tabular-nums text-[#e45136]">{project.votes.toLocaleString()}</p>
                      <p className="text-[11px] font-semibold text-slate-400">điểm</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        <ActionButton href={`/candidates/${project.sbd}`} title="Xem chi tiết" tone="view">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </ActionButton>
                        <ActionButton onClick={() => openEditModal(project)} title="Chỉnh sửa" tone="edit">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(project.id)} title="Xóa hồ sơ" tone="delete">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm font-semibold text-slate-500">
                    Không có dự án phù hợp bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalMode && (
        <ProjectModal
          title={modalMode === 'add' ? 'Thêm dự án dự thi' : 'Cập nhật hồ sơ dự án'}
          form={form}
          setForm={setForm}
          onClose={() => setModalMode(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
