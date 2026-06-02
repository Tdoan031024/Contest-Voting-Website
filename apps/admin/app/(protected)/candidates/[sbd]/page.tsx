'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Candidate } from '@huitfest/shared';
import { apiUrl, formatAssetUrl } from '../../../api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const tableLabels: Record<string, string> = {
  HIGH_SCHOOL: 'Bảng học sinh',
  STUDENT: 'Bảng sinh viên, học viên',
  ENTERPRISE: 'Bảng cá nhân, tổ chức, doanh nghiệp',
};

function displayValue(value?: string | number | boolean | null) {
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  return value || 'Chưa cập nhật';
}

function Badge({
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
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${classes[tone]}`}>
      {children}
    </span>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | number | boolean | null }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-line text-sm font-bold leading-6 text-slate-800">{displayValue(value)}</p>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        {description ? <p className="mt-1 text-xs font-semibold text-slate-500">{description}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function roundTone(round?: string): 'green' | 'blue' | 'orange' | 'slate' {
  if (!round) return 'slate';
  if (round.includes('chung')) return 'orange';
  if (round.includes('bán')) return 'blue';
  if (round.includes('loại')) return 'green';
  return 'slate';
}

export default function CandidateDetailAdminPage() {
  const params = useParams();
  const sbd = params.sbd as string;
  const [project, setProject] = useState<Candidate | null>(null);
  const [projects, setProjects] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      const [detailRes, listRes] = await Promise.all([
        fetch(apiUrl(`/api/candidates/${sbd}`)),
        fetch(apiUrl('/api/candidates')),
      ]);
      if (detailRes.ok) setProject(await detailRes.json());
      if (listRes.ok) setProjects(await listRes.json());
      setIsLoading(false);
    }

    loadProject().catch(() => setIsLoading(false));
  }, [sbd]);

  const rank = useMemo(() => {
    const sorted = [...projects].sort((a, b) => b.votes - a.votes);
    const index = sorted.findIndex((item) => item.sbd === sbd);
    return index >= 0 ? index + 1 : null;
  }, [projects, sbd]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
        Đang tải hồ sơ dự án...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Không tìm thấy dự án</h2>
        <Link href="/candidates" className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const tableLabel = project.contestTableLabel || tableLabels[project.contestTable || ''] || 'Chưa phân bảng';
  const hasMissingInfo = !project.teamName || !project.leaderName || !project.contestTable;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/candidates" className="inline-flex items-center gap-2 text-xs font-black text-slate-500 transition hover:text-emerald-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Quay lại danh sách
            </Link>
            <div className="flex flex-wrap gap-2">
              <a href={`${SITE_URL}/thi-sinh/${project.sbd}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700">
                Xem ngoài website
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[420px_1fr]">
          <div className="bg-slate-950 p-5">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
              <img src={formatAssetUrl(project.imageUrl)} alt={project.name} className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Hồ sơ dự án dự thi</p>
                <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">{project.name}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{project.description || 'Chưa cập nhật mô tả ngắn.'}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>Mã {project.sbd}</Badge>
                  <Badge tone="blue">{tableLabel}</Badge>
                  <Badge tone={roundTone(project.currentRound)}>{project.currentRound || 'Vòng loại'}</Badge>
                  {hasMissingInfo ? <Badge tone="red">Thiếu thông tin</Badge> : <Badge tone="green">Đủ hồ sơ</Badge>}
                </div>
              </div>

              <div className="grid min-w-[260px] grid-cols-2 gap-3">
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-500">Điểm bình chọn</p>
                  <p className="mt-2 text-3xl font-black tabular-nums text-[#e45136]">{project.votes.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Thứ hạng</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{rank ? `#${rank}` : '-'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <InfoItem label="Nhóm dự thi" value={project.teamName} />
              <InfoItem label="Trưởng nhóm" value={project.leaderName} />
              <InfoItem label="Lĩnh vực" value={project.sector} />
              <InfoItem label="Trạng thái" value={project.status} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <SectionCard title="Thông tin nhóm dự thi" description="Thông tin định danh, liên hệ và thành viên đại diện hồ sơ.">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem label="Tên nhóm" value={project.teamName} />
              <InfoItem label="Đơn vị / trường" value={project.representativeSchool} />
              <InfoItem label="Trưởng nhóm" value={project.leaderName} />
              <InfoItem label="Số điện thoại" value={project.leaderPhone} />
              <InfoItem label="Email" value={project.leaderEmail} />
              <InfoItem label="Cố vấn" value={project.advisorName} />
              <InfoItem label="Thành viên" value={project.members} />
              <InfoItem label="Cam kết sở hữu trí tuệ" value={project.intellectualPropertyCommitment} />
            </div>
          </SectionCard>

          <SectionCard title="Thuyết minh dự án" description="Nội dung mô tả chi tiết, định hướng giải pháp và giá trị đề xuất.">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {project.biography || project.description || 'Chưa cập nhật nội dung thuyết minh.'}
              </p>
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-5">
          <SectionCard title="Phân loại & tiến độ">
            <div className="space-y-3">
              <InfoItem label="Bảng thi" value={tableLabel} />
              <InfoItem label="Lĩnh vực" value={project.sector} />
              <InfoItem label="Vòng hiện tại" value={project.currentRound} />
              <InfoItem label="Trạng thái hồ sơ" value={project.status} />
              <InfoItem label="Địa điểm triển khai" value={project.implementationLocation} />
            </div>
          </SectionCard>

          <SectionCard title="Nhu cầu & kỳ vọng">
            <div className="space-y-3">
              <InfoItem label="Nhu cầu hỗ trợ" value={project.supportNeeds} />
              <InfoItem label="Kỳ vọng sau cuộc thi" value={project.expectations} />
            </div>
          </SectionCard>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-950">Thao tác nhanh</h2>
            <div className="mt-4 grid gap-2">
              <Link href="/candidates" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-black text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700">
                Quay lại danh sách
              </Link>
              <a href={`${SITE_URL}/thi-sinh/${project.sbd}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-slate-900 px-4 py-3 text-center text-xs font-black text-white shadow-sm transition hover:bg-emerald-700">
                Xem trang công khai
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
