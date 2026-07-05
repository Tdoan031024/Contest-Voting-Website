'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { Candidate } from '@huitfest/shared';
import { apiUrl, formatAssetUrl } from '../../api';

type VotingPromotion = {
  id: string;
  name: string;
  multiplier: number;
  startAt: string;
  endAt: string;
  isEnabled: boolean;
  appliesTo: 'FREE' | 'PAID' | 'ALL';
  note?: string;
};

function createPromotionDraft(): VotingPromotion {
  const now = new Date();
  const start = new Date(now.getTime() + 10 * 60 * 1000);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const toLocalInput = (value: Date) => {
    const offset = value.getTimezoneOffset();
    const local = new Date(value.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  return {
    id: `promo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: 'Khung giờ nhân điểm',
    multiplier: 2,
    startAt: toLocalInput(start),
    endAt: toLocalInput(end),
    isEnabled: true,
    appliesTo: 'FREE',
    note: '',
  };
}

const tableLabels: Record<string, string> = {
  HIGH_SCHOOL: 'Bảng học sinh',
  STUDENT: 'Bảng sinh viên, học viên',
  ENTERPRISE: 'Bảng cá nhân, tổ chức, doanh nghiệp',
};

const emptyProject: Partial<Candidate> = {
  sbd: '',
  name: '',
  votes: 0,
  imageUrl: '/duan/anhmauduan.png',
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
  showcaseImages: '',
};

function Pill({
  children,
  tone = 'slate',
}: {
  children: React.ReactNode;
  tone?: 'green' | 'blue' | 'orange' | 'red' | 'slate';
}) {
  const classes = {
    green: 'border-emerald-200/80 bg-emerald-50 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
    blue: 'border-sky-200/80 bg-sky-50 text-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
    orange: 'border-orange-200/80 bg-orange-50 text-orange-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
    red: 'border-rose-200/80 bg-rose-50 text-rose-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
    slate: 'border-slate-200/80 bg-slate-50 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-extrabold leading-none tracking-[-0.01em] ${classes[tone]}`}>
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
    view: 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
    edit: 'border-emerald-200/80 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100',
    delete: 'border-rose-200/80 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100',
  };
  const className = `grid h-9 w-9 place-items-center rounded-lg border shadow-sm transition duration-150 hover:-translate-y-[1px] ${classes[tone]}`;

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

function parseMembers(membersStr: string, isEnterprise: boolean): any[] {
  if (!membersStr || !membersStr.trim()) return [];
  const lines = membersStr.split('\n').map(line => line.trim()).filter(Boolean);
  return lines.map((line) => {
    let cleanLine = line.replace(/^\d+[\.\/\-\s]*/, '').trim();
    const parts = cleanLine.split(/\s*-\s*/).map(p => p.trim());
    if (isEnterprise) {
      return {
        fullName: parts[0] || '',
        dob: parts[1] || '',
        role: parts[2] || '',
        company: parts[3] || '',
        phone: parts[4] || '',
        email: parts[5] || '',
        experience: parts[6] || '',
      };
    } else {
      return {
        fullName: parts[0] || '',
        studentId: parts[1] || '',
        school: parts[2] || '',
        phone: parts[3] || '',
        email: parts[4] || '',
      };
    }
  });
}

function serializeMembers(membersList: any[], isEnterprise: boolean): string {
  return membersList
    .map((m, index) => {
      const parts = isEnterprise ? [
        m.fullName || '',
        m.dob || '',
        m.role || '',
        m.company || '',
        m.phone || '',
        m.email || '',
        m.experience || ''
      ] : [
        m.fullName || '',
        m.studentId || '',
        m.school || '',
        m.phone || '',
        m.email || ''
      ];
      const content = parts.map(p => p.trim()).join(' - ');
      return `${index + 1}. ${content}`;
    })
    .join('\n');
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
    if (key === 'sbd') {
      const sbdVal = value?.trim();
      if (sbdVal && (!form.imageUrl || form.imageUrl === '/duan/anhmauduan.png' || form.imageUrl.startsWith('/duan/'))) {
        next.imageUrl = `/duan/${sbdVal}/main.jpg`;
      }
    }
    setForm(next);
  };

  const modalFileRef = useRef<HTMLInputElement>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | 'main' | null>(null);

  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingIndex === null) return;
    const sbd = form.sbd?.trim() || 'temp';
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadRes = await fetch(apiUrl(`/api/admin/candidates/${sbd}/upload`), {
      method: 'POST',
      body: formData,
    });
    if (uploadRes.ok) {
      const { url } = await uploadRes.json();
      if (uploadingIndex === 'main') {
        update('imageUrl', url);
      } else {
        const indexToUpdate = uploadingIndex as number;
        // Cập nhật cục bộ và lưu
        const newList = [...showcaseList];
        newList[indexToUpdate] = url;
        setShowcaseList(newList);
        update('showcaseImages', newList.filter(Boolean).join(','));
      }
      alert('Tải ảnh lên thành công!');
    } else {
      alert('Tải ảnh thất bại. Vui lòng kiểm tra backend.');
    }
    setUploadingIndex(null);
    if (modalFileRef.current) modalFileRef.current.value = '';
  };

  const isEnterprise = form.contestTable === 'ENTERPRISE';
  const [membersList, setMembersList] = useState<any[]>(() => {
    return parseMembers(form.members || '', isEnterprise);
  });

  const handleMemberFieldChange = (index: number, field: string, value: string) => {
    const newList = membersList.map((m, idx) => {
      if (idx === index) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setMembersList(newList);
    update('members', serializeMembers(newList, form.contestTable === 'ENTERPRISE'));
  };

  const handleAddMember = () => {
    const isEnt = form.contestTable === 'ENTERPRISE';
    const newMember = isEnt ? {
      fullName: '',
      dob: '',
      role: '',
      company: '',
      phone: '',
      email: '',
      experience: '',
    } : {
      fullName: '',
      studentId: '',
      school: '',
      phone: '',
      email: '',
    };
    const newList = [...membersList, newMember];
    setMembersList(newList);
    update('members', serializeMembers(newList, isEnt));
  };

  const handleRemoveMember = (index: number) => {
    const newList = membersList.filter((_, idx) => idx !== index);
    setMembersList(newList);
    update('members', serializeMembers(newList, form.contestTable === 'ENTERPRISE'));
  };

  const [showcaseList, setShowcaseList] = useState<string[]>(() => {
    return (form.showcaseImages || '').split(',').map(img => img.trim()).filter(Boolean);
  });

  const handleShowcaseChange = (index: number, value: string) => {
    const newList = [...showcaseList];
    newList[index] = value;
    setShowcaseList(newList);
    update('showcaseImages', newList.filter(Boolean).join(','));
  };

  const handleAddShowcase = () => {
    if (showcaseList.length >= 5) return;
    const sbd = form.sbd?.trim() || 'TEMP';
    const nextIndex = showcaseList.length + 1;
    const newUrl = `/duan/${sbd}/${nextIndex}.jpg`;
    const newList = [...showcaseList, newUrl];
    setShowcaseList(newList);
    update('showcaseImages', newList.filter(Boolean).join(','));
  };

  const handleRemoveShowcase = (index: number) => {
    const newList = showcaseList.filter((_, idx) => idx !== index);
    setShowcaseList(newList);
    update('showcaseImages', newList.filter(Boolean).join(','));
  };

  const inputClass = 'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white';
  const rowInputClass = 'h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white';
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
            <span className={labelText}>Tên dự án <span className="text-red-500 font-bold">*</span></span>
            <input className={inputClass} value={form.name || ''} onChange={(event) => update('name', event.target.value)} required />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Mã dự án / SBD <span className="text-red-500 font-bold">*</span></span>
            <input className={inputClass} value={form.sbd || ''} onChange={(event) => update('sbd', event.target.value)} required />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Bảng thi</span>
            <select
              className={inputClass}
              value={form.contestTable || 'STUDENT'}
              onChange={(event) => {
                const val = event.target.value;
                const oldIsEnterprise = form.contestTable === 'ENTERPRISE';
                const newIsEnterprise = val === 'ENTERPRISE';
                update('contestTable', val);
                
                const currentSerialized = serializeMembers(membersList, oldIsEnterprise);
                const newParsed = parseMembers(currentSerialized, newIsEnterprise);
                setMembersList(newParsed);
                update('members', serializeMembers(newParsed, newIsEnterprise));
              }}
            >
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
          <div className="space-y-1.5">
            <span className={labelText}>Đường dẫn ảnh</span>
            <div className="flex gap-2">
              <input className={inputClass} value={form.imageUrl || ''} onChange={(event) => update('imageUrl', event.target.value)} />
              <button
                type="button"
                onClick={() => {
                  setUploadingIndex('main');
                  modalFileRef.current?.click();
                }}
                className="h-10 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
              >
                Tải lên
              </button>
            </div>
          </div>
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
            <input type="tel" pattern="0[0-9]{9,10}" title="Số điện thoại phải gồm 10 hoặc 11 chữ số và bắt đầu bằng số 0" placeholder="Ví dụ: 0987654321" className={inputClass} value={form.leaderPhone || ''} onChange={(event) => update('leaderPhone', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Email trưởng nhóm</span>
            <input type="email" placeholder="Ví dụ: email@domain.com" className={inputClass} value={form.leaderEmail || ''} onChange={(event) => update('leaderEmail', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelText}>Cố vấn</span>
            <input className={inputClass} value={form.advisorName || ''} onChange={(event) => update('advisorName', event.target.value)} />
          </label>

          {/* Showcase Images Gallery */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 md:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className={labelText}>Hình ảnh trưng bày dự án</span>
                <span className="text-[10px] font-bold text-slate-400 italic">Tối đa 5 hình ảnh để trưng bày trên trang chi tiết</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={showcaseList.length >= 5}
                  onClick={handleAddShowcase}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-slate-700 transition duration-150 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Thêm ảnh ({showcaseList.length}/5)
                </button>
              </div>
            </div>

            {showcaseList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white py-6 px-4 text-center">
                <p className="text-xs font-semibold text-slate-400">Chưa có hình ảnh trưng bày nào.</p>
                <p className="mt-1 text-[10px] text-slate-400">Nhấn nút "Thêm ảnh" ở trên để tải lên tối đa 5 hình ảnh.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {showcaseList.map((url, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative hover:border-slate-300 transition">
                    <div className="h-12 w-16 shrink-0 border border-slate-100 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                      {url ? (
                        <img src={formatAssetUrl(url)} alt={`Trưng bày ${index + 1}`} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold text-center px-1">Chưa có ảnh</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Đường dẫn ảnh #{index + 1}</span>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Ví dụ: /duan/anh1.png hoặc link ảnh online"
                          className={rowInputClass}
                          value={url}
                          onChange={(e) => handleShowcaseChange(index, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadingIndex(index);
                            modalFileRef.current?.click();
                          }}
                          className="h-9 shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
                        >
                          Tải lên
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveShowcase(index)}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-1.5 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                      title="Xóa ảnh"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 md:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className={labelText}>Thành viên nhóm</span>
                <span className="text-[10px] font-bold text-slate-400 italic">Không bao gồm Trưởng nhóm</span>
              </div>
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition duration-150 ease-in-out active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Thêm thành viên
              </button>
            </div>

            {membersList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white py-8 px-4 text-center">
                <p className="text-xs font-semibold text-slate-400">Chưa có thành viên nào trong danh sách.</p>
                <p className="mt-1 text-[10px] text-slate-400">Nhấn nút "Thêm thành viên" ở trên để bắt đầu.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {membersList.map((member, index) => (
                  <div key={index} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 hover:shadow transition duration-150">
                    <div className="absolute right-3 top-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-1.5 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                        title="Xóa thành viên"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] font-black text-emerald-700 mb-3 flex items-center gap-1.5">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                        {index + 1}
                      </span>
                      Thành viên #{index + 1}
                    </p>

                    {form.contestTable === 'ENTERPRISE' ? (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                        <label className="space-y-1 col-span-1 sm:col-span-2 md:col-span-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ và tên <span className="text-red-500 font-bold">*</span></span>
                          <input
                            required
                            type="text"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            className={rowInputClass}
                            value={member.fullName || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'fullName', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ngày sinh</span>
                          <input
                            type="text"
                            placeholder="Ví dụ: 01/01/1990"
                            className={rowInputClass}
                            value={member.dob || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'dob', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chức vụ trong dự án</span>
                          <input
                            type="text"
                            placeholder="Ví dụ: Lập trình viên"
                            className={rowInputClass}
                            value={member.role || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'role', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Đơn vị công tác</span>
                          <input
                            type="text"
                            placeholder="Ví dụ: Công ty A"
                            className={rowInputClass}
                            value={member.company || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'company', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</span>
                          <input
                            type="tel"
                            pattern="0[0-9]{9,10}"
                            title="Số điện thoại phải gồm 10 hoặc 11 chữ số và bắt đầu bằng số 0"
                            placeholder="Ví dụ: 0987654321"
                            className={rowInputClass}
                            value={member.phone || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'phone', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</span>
                          <input
                            type="email"
                            placeholder="Ví dụ: email@domain.com"
                            className={rowInputClass}
                            value={member.email || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'email', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1 col-span-1 sm:col-span-2 md:col-span-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chuyên môn/kinh nghiệm</span>
                          <input
                            type="text"
                            placeholder="Ví dụ: 3 năm kinh nghiệm lập trình React"
                            className={rowInputClass}
                            value={member.experience || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'experience', e.target.value)}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
                        <label className="space-y-1 col-span-1 sm:col-span-2 md:col-span-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ và tên <span className="text-red-500 font-bold">*</span></span>
                          <input
                            required
                            type="text"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            className={rowInputClass}
                            value={member.fullName || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'fullName', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">MSHS/MSSV</span>
                          <input
                            type="text"
                            placeholder="Ví dụ: 2001211234"
                            className={rowInputClass}
                            value={member.studentId || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'studentId', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1 col-span-1 sm:col-span-2 md:col-span-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trường học</span>
                          <input
                            type="text"
                            placeholder="Ví dụ: ĐH Công Thương"
                            className={rowInputClass}
                            value={member.school || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'school', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</span>
                          <input
                            type="tel"
                            pattern="0[0-9]{9,10}"
                            title="Số điện thoại phải gồm 10 hoặc 11 chữ số và bắt đầu bằng số 0"
                            placeholder="Ví dụ: 0987654321"
                            className={rowInputClass}
                            value={member.phone || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'phone', e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</span>
                          <input
                            type="email"
                            placeholder="Ví dụ: email@domain.com"
                            className={rowInputClass}
                            value={member.email || ''}
                            onChange={(e) => handleMemberFieldChange(index, 'email', e.target.value)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

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
            <span className={labelText}>Mô tả ngắn <span className="text-red-500 font-bold">*</span></span>
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
        <input
          type="file"
          ref={modalFileRef}
          onChange={handleModalFileUpload}
          accept="image/*"
          className="hidden"
        />
      </form>
    </div>
  );
}

const csvHeadersMap: Record<string, string> = {
  'SBD': 'sbd',
  'Tên dự án': 'name',
  'Bảng thi': 'contestTable',
  'Lĩnh vực': 'sector',
  'Vòng hiện tại': 'currentRound',
  'Trạng thái': 'status',
  'Điểm bình chọn': 'votes',
  'Đường dẫn ảnh': 'imageUrl',
  'Tên nhóm': 'teamName',
  'Đơn vị trường': 'representativeSchool',
  'Trưởng nhóm': 'leaderName',
  'SĐT trưởng nhóm': 'leaderPhone',
  'Email trưởng nhóm': 'leaderEmail',
  'Cố vấn': 'advisorName',
  'Thành viên nhóm': 'members',
  'Hình ảnh trưng bày': 'showcaseImages',
  'Địa điểm triển khai': 'implementationLocation',
  'Cam kết sở hữu trí tuệ': 'intellectualPropertyCommitment',
  'Mô tả ngắn': 'description',
  'Thuyết minh chi tiết': 'biography',
  'Nhu cầu hỗ trợ': 'supportNeeds',
  'Kỳ vọng sau cuộc thi': 'expectations',
};

function parseCSVText(text: string): Record<string, string>[] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal);
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentVal);
      lines.push(row);
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal);
    lines.push(row);
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.trim());
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i];
    if (values.length === 1 && values[0] === '') continue;
    
    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] ? values[j].trim() : '';
    }
    result.push(obj);
  }

  return result;
}

function escapeCSVValue(val: any): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

function ImportModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorLogs([]);
    setSuccessMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsedRows = parseCSVText(text);

        if (parsedRows.length === 0) {
          alert('File CSV trống hoặc không đúng định dạng!');
          return;
        }

        const candidates = parsedRows.map((row) => {
          const item: any = {};
          
          for (const [colName, fieldKey] of Object.entries(csvHeadersMap)) {
            const val = row[colName] || '';
            if (fieldKey === 'intellectualPropertyCommitment') {
              item[fieldKey] = val.toLowerCase() === 'có' || val.toLowerCase() === 'true' || val === '1';
            } else if (fieldKey === 'votes') {
              item[fieldKey] = Number(val) || 0;
            } else {
              item[fieldKey] = val;
            }
          }
          return item;
        }).filter(item => item.sbd && item.name);

        setFileData(candidates);
      } catch (err: any) {
        alert('Lỗi đọc file: ' + err.message);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'SBD',
      'Tên dự án',
      'Bảng thi',
      'Lĩnh vực',
      'Vòng hiện tại',
      'Trạng thái',
      'Điểm bình chọn',
      'Đường dẫn ảnh',
      'Tên nhóm',
      'Đơn vị trường',
      'Trưởng nhóm',
      'SĐT trưởng nhóm',
      'Email trưởng nhóm',
      'Cố vấn',
      'Thành viên nhóm',
      'Hình ảnh trưng bày',
      'Địa điểm triển khai',
      'Cam kết sở hữu trí tuệ',
      'Mô tả ngắn',
      'Thuyết minh chi tiết',
      'Nhu cầu hỗ trợ',
      'Kỳ vọng sau cuộc thi'
    ];

    const sampleRow = [
      'SBD001',
      'Dự án 1',
      'STUDENT',
      'Công nghệ thông tin',
      'Vòng loại',
      'Đang cập nhật',
      '150',
      '/duan/anhmauduan.png',
      'Nhóm CNTT HUIT',
      'Đại học Công Thương',
      'Nguyễn Văn A',
      '0987654321',
      'nguyenvana@gmail.com',
      'Thầy Advisor',
      '1. Nguyễn Văn B - 2001211234 - ĐH Công Thương\n2. Nguyễn Văn C - 2001215678 - ĐH Công Thương',
      '/duan/SBD001/1.jpg,/duan/SBD001/2.jpg',
      'TP.HCM',
      'Có',
      'Mô tả ngắn dự án công nghệ thông tin tuyển dụng việc làm.',
      'Thuyết minh chi tiết dự án công nghệ thông tin gồm đầy đủ kế hoạch kinh doanh và lộ trình phát triển.',
      'Hỗ trợ vốn và kết nối doanh nghiệp',
      'Thương mại hóa sản phẩm'
    ];

    const csvContent = '\uFEFF' + [headers.join(','), sampleRow.map(escapeCSVValue).join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'candidates_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (fileData.length === 0) {
      alert('Vui lòng chọn file CSV chứa dữ liệu hợp lệ trước!');
      return;
    }

    setLoading(true);
    setErrorLogs([]);
    setSuccessMsg('');

    try {
      const res = await fetch(apiUrl('/api/admin/candidates/bulk'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData),
      });

      if (!res.ok) {
        throw new Error('Lỗi từ hệ thống server hoặc chưa đăng nhập quản trị.');
      }

      const result = await res.json();
      if (result.errors && result.errors.length > 0) {
        setErrorLogs(result.errors);
      }
      setSuccessMsg(`Đã nhập thành công ${result.successCount}/${fileData.length} dự án!`);
      if (result.successCount > 0) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorLogs([err.message || 'Lỗi không xác định khi tải lên hệ thống.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Nhập dữ liệu dự án</p>
            <h3 className="mt-1 text-xl font-black text-slate-900">Nhập danh sách từ CSV</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-700">
            Đóng
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-800">Tải tệp tin CSV mẫu để điền thông tin</p>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Đảm bảo cấu trúc cột và định dạng tiếng Việt đúng chuẩn.</p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="shrink-0 flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-500 transition animate-pulse"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Tải CSV mẫu
            </button>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
            <p className="mt-2 text-xs font-bold text-slate-700">Kéo thả hoặc nhấp để chọn tệp tin CSV</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Chỉ chấp nhận file định dạng .csv</p>
            {fileName && (
              <div className="mt-3 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-bold">
                Tệp đã chọn: {fileName} ({fileData.length} dòng hợp lệ)
              </div>
            )}
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
            {successMsg}
          </div>
        )}

        {errorLogs.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2 max-h-40 overflow-y-auto">
            <p className="text-xs font-bold text-red-800 uppercase tracking-wide">Danh sách lỗi / cảnh báo:</p>
            <ul className="list-disc list-inside text-[11px] text-red-700 font-semibold space-y-1">
              {errorLogs.map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-700">
            Hủy
          </button>
          <button
            type="button"
            disabled={loading || fileData.length === 0}
            onClick={handleImport}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>Nhập dữ liệu ({fileData.length})</>
            )}
          </button>
        </div>
      </div>
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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-06-20T23:59');
  const [votingPromotions, setVotingPromotions] = useState<VotingPromotion[]>([]);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [showPromotionManager, setShowPromotionManager] = useState(false);

  const loadProjects = async () => {
    try {
      const res = await fetch(apiUrl('/api/candidates'));
      if (res.ok) setProjects(await res.json());
    } catch {
      setProjects([]);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/admin/settings'));
        if (!res.ok) return;
        const data = await res.json();
        setIsRegistrationOpen(data.isRegistrationOpen ?? true);
        setRegistrationDeadline(data.registrationDeadline || '2026-06-20T23:59');
        setVotingPromotions(Array.isArray(data.votingPromotions) ? data.votingPromotions : []);
      } catch {}
    }

    loadSettings();
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

  const missingInfo = projects.filter((project) => !project.teamName || !project.leaderName || !project.contestTable).length;
  const activePromotion = useMemo(() => {
    const now = Date.now();
    return votingPromotions.find((promotion) => {
      if (!promotion.isEnabled) return false;
      const start = new Date(promotion.startAt).getTime();
      const end = new Date(promotion.endAt).getTime();
      return Number.isFinite(start) && Number.isFinite(end) && start <= now && end >= now;
    }) || null;
  }, [votingPromotions]);

  const saveVotingSettings = async (
    nextPromotions = votingPromotions,
    nextRegistrationOpen = isRegistrationOpen,
    nextRegistrationDeadline = registrationDeadline,
  ) => {
    setSettingsSaving(true);
    try {
      const currentRes = await fetch(apiUrl('/api/admin/settings'));
      if (!currentRes.ok) throw new Error('load_failed');
      const currentSettings = await currentRes.json();
      const res = await fetch(apiUrl('/api/admin/settings'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentSettings,
          isRegistrationOpen: nextRegistrationOpen,
          registrationDeadline: nextRegistrationDeadline,
          votingPromotions: nextPromotions,
        }),
      });
      if (!res.ok) throw new Error('save_failed');
    } catch {
      alert('Khong the luu cau hinh promotion / dang ky. Vui long kiem tra backend.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const updatePromotion = (id: string, field: keyof VotingPromotion, value: string | number | boolean) => {
    setVotingPromotions((prev) => prev.map((promotion) => (
      promotion.id === id ? { ...promotion, [field]: value } : promotion
    )));
  };

  const addPromotion = () => {
    setVotingPromotions((prev) => [...prev, createPromotionDraft()]);
  };

  const removePromotion = (id: string) => {
    setVotingPromotions((prev) => prev.filter((promotion) => promotion.id !== id));
  };

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
    
    if (isEdit) {
      alert('Cập nhật hồ sơ dự án thành công!');
    } else {
      alert('Thêm dự án mới thành công!');
    }
    
    setModalMode(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa hồ sơ dự án này khỏi hệ thống?')) return;
    const res = await fetch(apiUrl(`/api/admin/candidates/${id}`), { method: 'DELETE' });
    if (res.ok) setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const handleExportCandidates = () => {
    const headers = [
      'SBD',
      'Tên dự án',
      'Bảng thi',
      'Lĩnh vực',
      'Vòng hiện tại',
      'Trạng thái',
      'Điểm bình chọn',
      'Đường dẫn ảnh',
      'Tên nhóm',
      'Đơn vị trường',
      'Trưởng nhóm',
      'SĐT trưởng nhóm',
      'Email trưởng nhóm',
      'Cố vấn',
      'Thành viên nhóm',
      'Hình ảnh trưng bày',
      'Địa điểm triển khai',
      'Cam kết sở hữu trí tuệ',
      'Mô tả ngắn',
      'Thuyết minh chi tiết',
      'Nhu cầu hỗ trợ',
      'Kỳ vọng sau cuộc thi'
    ];

    const csvRows = [headers.join(',')];

    for (const project of projects) {
      const row = [
        escapeCSVValue(project.sbd),
        escapeCSVValue(project.name),
        escapeCSVValue(project.contestTable),
        escapeCSVValue(project.sector),
        escapeCSVValue(project.currentRound),
        escapeCSVValue(project.status),
        escapeCSVValue(project.votes),
        escapeCSVValue(project.imageUrl),
        escapeCSVValue(project.teamName),
        escapeCSVValue(project.representativeSchool),
        escapeCSVValue(project.leaderName),
        escapeCSVValue(project.leaderPhone),
        escapeCSVValue(project.leaderEmail),
        escapeCSVValue(project.advisorName),
        escapeCSVValue(project.members),
        escapeCSVValue(project.showcaseImages),
        escapeCSVValue(project.implementationLocation),
        project.intellectualPropertyCommitment ? 'Có' : 'Không',
        escapeCSVValue(project.description),
        escapeCSVValue(project.biography),
        escapeCSVValue(project.supportNeeds),
        escapeCSVValue(project.expectations)
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `candidates_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-full space-y-3.5">
      <section className="admin-card overflow-hidden p-0">
        <div className="flex flex-col gap-2.5 border-b border-slate-200/70 px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--primary-strong)]">Quản lý cuộc thi</p>
            <h2 className="mt-0.5 text-[20px] font-extrabold tracking-[-0.04em] text-slate-950">Danh sách dự án tham gia</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button onClick={handleExportCandidates} className="admin-btn admin-btn-secondary !h-8 !min-h-0 px-2.5 text-xs gap-1.5 rounded-lg">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Xuất
            </button>
            <button onClick={() => setIsImportModalOpen(true)} className="admin-btn admin-btn-secondary !h-8 !min-h-0 px-2.5 text-xs gap-1.5 rounded-lg">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="8 10 12 14 16 10" />
                <line x1="12" y1="14" x2="12" y2="2" />
              </svg>
              Nhập
            </button>
            <button onClick={openAddModal} className="admin-btn admin-btn-primary min-w-[132px]">
              Thêm dự án mới
            </button>
          </div>
        </div>

        <div className="grid gap-2 p-3 xl:grid-cols-6">
          {[
            ['Tổng dự án', projects.length.toLocaleString()],
            ['Thiếu thông tin', missingInfo.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="dashboard-stat-card flex min-h-[104px] flex-col justify-center xl:col-span-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-1.5 text-[20px] font-extrabold tracking-[-0.04em] text-slate-950">{value}</p>
              </div>
            </div>
          ))}

          <div className="dashboard-stat-card flex min-h-[118px] flex-col justify-between xl:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Đăng ký</p>
                <p className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-slate-950">
                  {isRegistrationOpen ? 'Đang mở' : 'Đang đóng'}
                </p>
              </div>
              <button
                type="button"
                disabled={settingsSaving}
                onClick={async () => {
                  const nextValue = !isRegistrationOpen;
                  setIsRegistrationOpen(nextValue);
                  await saveVotingSettings(votingPromotions, nextValue, registrationDeadline);
                }}
                className={`relative mt-1 flex h-7 w-12 items-center rounded-full transition ${isRegistrationOpen ? 'bg-emerald-500' : 'bg-slate-300'} ${settingsSaving ? 'opacity-60' : ''}`}
              >
                <span className={`absolute h-5 w-5 rounded-full bg-white shadow-md transition ${isRegistrationOpen ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Hạn đăng ký</label>
              <input
                type="datetime-local"
                value={registrationDeadline}
                onChange={(event) => setRegistrationDeadline(event.target.value)}
                onBlur={() => saveVotingSettings(votingPromotions, isRegistrationOpen, registrationDeadline)}
                className="admin-input"
              />
            </div>
          </div>

          <div className="dashboard-stat-card flex min-h-[118px] flex-col justify-between xl:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Promotion</p>
                <p className="mt-2 truncate text-[22px] font-extrabold tracking-[-0.04em] text-slate-950">
                  {activePromotion ? `x${activePromotion.multiplier}` : 'Chưa chạy'}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{votingPromotions.length} khung giờ</p>
              </div>
              <button type="button" onClick={() => setShowPromotionManager((prev) => !prev)} className="admin-btn admin-btn-secondary min-w-[82px]">
                {showPromotionManager ? 'Thu gọn' : 'Quản lý'}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={addPromotion} className="admin-btn admin-btn-secondary flex-1">
                + Thêm
              </button>
              <button type="button" disabled={settingsSaving} onClick={() => saveVotingSettings()} className="admin-btn admin-btn-primary flex-1">
                {settingsSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>

        {showPromotionManager && (
          <div className="border-t border-slate-200/70 px-3 py-3">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Promotion chi tiết</p>
                <p className="mt-1 text-[13px] font-medium text-slate-500">Quản lý khung giờ nhân điểm mà không làm nặng màn hình chính.</p>
              </div>
              <button type="button" onClick={addPromotion} className="admin-btn admin-btn-secondary">
                + Thêm promotion
              </button>
            </div>

            <div className="grid gap-2 xl:grid-cols-2">
              {votingPromotions.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-sm font-medium text-slate-500">
                  Chưa có promotion nhân điểm nào.
                </div>
              ) : (
                votingPromotions.map((promotion) => (
                  <div key={promotion.id} className="rounded-[14px] border border-slate-200 bg-white/90 p-3 shadow-sm">
                    <div className="grid gap-2">
                      <input value={promotion.name} onChange={(event) => updatePromotion(promotion.id, 'name', event.target.value)} className="admin-input" />
                      <div className="grid grid-cols-1 gap-2">
                        <label className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Hệ số nhân điểm:</span>
                          <input type="number" min={2} max={10} value={promotion.multiplier} onChange={(event) => updatePromotion(promotion.id, 'multiplier', Number(event.target.value))} className="admin-input" />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 gap-2 2xl:grid-cols-2">
                        <input type="datetime-local" value={promotion.startAt} onChange={(event) => updatePromotion(promotion.id, 'startAt', event.target.value)} className="admin-input" />
                        <input type="datetime-local" value={promotion.endAt} onChange={(event) => updatePromotion(promotion.id, 'endAt', event.target.value)} className="admin-input" />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <input type="checkbox" checked={promotion.isEnabled} onChange={(event) => updatePromotion(promotion.id, 'isEnabled', event.target.checked)} />
                          Kích hoạt
                        </label>
                        <button type="button" onClick={() => removePromotion(promotion.id)} className="admin-btn admin-btn-danger !h-8 px-3">
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>

      <section className="dashboard-filter-bar p-2.5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_170px_110px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên dự án, mã, nhóm, trưởng nhóm hoặc đơn vị..."
            className="admin-input min-w-0"
          />
          <select value={tableFilter} onChange={(event) => setTableFilter(event.target.value)} className="admin-select px-3 text-xs font-bold text-slate-700">
            <option value="ALL">Tất cả bảng thi</option>
            <option value="HIGH_SCHOOL">Bảng học sinh</option>
            <option value="STUDENT">Bảng sinh viên</option>
            <option value="ENTERPRISE">Bảng doanh nghiệp</option>
          </select>
          <select value={roundFilter} onChange={(event) => setRoundFilter(event.target.value)} className="admin-select px-3 text-xs font-bold text-slate-700">
            <option value="ALL">Tất cả vòng</option>
            <option>Vòng loại</option>
            <option>Vòng bán kết</option>
            <option>Vòng chung kết</option>
          </select>
          <div className="flex h-[38px] items-center justify-center rounded-[12px] border border-slate-200 bg-white text-[11px] font-black text-slate-500 shadow-sm">
            {filteredProjects.length.toLocaleString()} kết quả
          </div>
        </div>
      </section>

      <section className="admin-card overflow-hidden p-0">
        <div className="w-full overflow-x-auto">
          <table className="dashboard-table min-w-[860px] text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                <th className="px-4 py-3">Dự án</th>
                <th className="px-4 py-3">Đại diện</th>
                <th className="px-4 py-3">Vòng thi</th>
                <th className="px-4 py-3 text-right">Điểm bình chọn</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProjects.map((project) => {
                const projectTableLabel = project.contestTableLabel || tableLabels[project.contestTable || ''] || 'Chưa phân bảng';
 
                return (
                  <tr key={project.id} className="align-middle transition hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <img src={formatAssetUrl(project.imageUrl)} alt={project.name} className="h-11 w-11 shrink-0 rounded-[14px] border border-slate-200 object-cover shadow-sm" />
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-extrabold tracking-[-0.02em] text-slate-950">{project.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                              {project.sbd}
                            </span>
                            <span className="rounded-md border border-emerald-200/80 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                              {projectTableLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-[180px]">
                        <p className="truncate text-[13px] font-bold text-slate-900">{project.leaderName || 'Chưa có đại diện'}</p>
                        <p className="mt-0.5 truncate text-[12px] text-slate-500 font-medium">{project.representativeSchool || 'Chưa cập nhật đơn vị'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={roundTone(project.currentRound)}>{project.currentRound || 'Vòng loại'}</Pill>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-[20px] font-bold tracking-[-0.02em] tabular-nums text-slate-800">{project.votes.toLocaleString()}</p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">điểm</p>
                    </td>
                    <td className="px-4 py-3">
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
                  <td colSpan={5} className="px-5 py-12 text-center text-sm font-semibold text-slate-500">
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

      {isImportModalOpen && (
        <ImportModal
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            loadProjects();
          }}
        />
      )}
    </div>
  );
}
