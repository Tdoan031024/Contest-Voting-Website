'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Candidate, Sponsor } from '@huitfest/shared';
import { apiUrl } from '../api';

function MetricCard({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  accent: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{note}</p>
    </article>
  );
}

export default function OverviewPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [gateOpen, setGateOpen] = useState(true);
  const [eventTitle, setEventTitle] = useState('HUIT Startup 2026');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [candRes, sponRes, setRes] = await Promise.all([
          fetch(apiUrl('/api/candidates')),
          fetch(apiUrl('/api/sponsors')),
          fetch(apiUrl('/api/settings')),
        ]);

        if (candRes.ok) setCandidates(await candRes.json());
        if (sponRes.ok) setSponsors(await sponRes.json());
        if (setRes.ok) {
          const settings = await setRes.json();
          setGateOpen(settings.isGateOpen);
          setEventTitle(settings.eventTitle);
        }
      } catch (err) {
        console.error('Failed to load admin overview data.', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  const rankedCandidates = useMemo(() => [...candidates].sort((a, b) => b.votes - a.votes), [candidates]);
  const leadingCandidate = rankedCandidates[0] || null;
  const topFive = rankedCandidates.slice(0, 5);
  const maxVotes = Math.max(...topFive.map((candidate) => candidate.votes), 1);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="relative overflow-hidden rounded-[32px] border border-[rgba(0,106,209,0.14)] bg-[linear-gradient(135deg,#061b44_0%,#0c4ea3_40%,#13a4c7_100%)] p-6 text-white shadow-[0_30px_70px_rgba(6,27,68,0.22)]">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-200/15 blur-3xl" />
        <div className="relative grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-100/80">Tổng quan hệ thống</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight">{eventTitle}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
              Bảng điều hành được làm lại theo hướng trực quan hơn, tập trung vào dữ liệu vận hành chính: tình trạng cổng vote, tổng lượt bình chọn, dự án dẫn đầu và mức độ sẵn sàng nội dung.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${gateOpen ? 'bg-emerald-400/18 text-emerald-100' : 'bg-rose-400/16 text-rose-100'}`}>
                {gateOpen ? 'Cổng bình chọn đang mở' : 'Cổng bình chọn đang đóng'}
              </span>
              <span className="rounded-full bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/90">
                {isLoading ? 'Đang tải dữ liệu' : `${candidates.length} dự án đang hiển thị`}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">Tổng vote</p>
              <p className="mt-3 text-3xl font-black">{totalVotes.toLocaleString()}</p>
              <p className="mt-2 text-sm text-white/75">Cập nhật từ dữ liệu thời gian thực.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">Nhà tài trợ</p>
              <p className="mt-3 text-3xl font-black">{sponsors.length}</p>
              <p className="mt-2 text-sm text-white/75">Đang đồng bộ trên hệ thống công khai.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">Dự án dẫn đầu</p>
              <p className="mt-3 text-xl font-black">{leadingCandidate ? leadingCandidate.name : 'Chưa có dữ liệu'}</p>
              <p className="mt-2 text-sm text-white/75">{leadingCandidate ? `${leadingCandidate.votes.toLocaleString()} vote · Mã dự án ${leadingCandidate.sbd}` : 'Đang chờ dữ liệu từ API.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Dự án" value={String(candidates.length)} note="Tổng số dự án đang công khai trên website." accent="linear-gradient(90deg, #0ea5e9, #38bdf8)" />
        <MetricCard label="Tổng vote" value={totalVotes.toLocaleString()} note="Bao gồm cả vote miễn phí và gói trả phí." accent="linear-gradient(90deg, #2563eb, #22d3ee)" />
        <MetricCard label="Trạng thái cổng" value={gateOpen ? 'Mở' : 'Đóng'} note="Điều khiển trực tiếp tại mục Thiết lập hệ thống." accent="linear-gradient(90deg, #10b981, #34d399)" />
        <MetricCard label="Sponsor" value={String(sponsors.length)} note="Đơn vị tài trợ và đối tác đồng hành hiện có." accent="linear-gradient(90deg, #f59e0b, #fbbf24)" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.95fr]">
        <article className="admin-card !rounded-[28px] !p-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950">Top dự án nổi bật</h2>
              <p className="mt-1 text-sm text-slate-500">Danh sách này giúp admin theo dõi nhanh mức độ tăng trưởng bình chọn.</p>
            </div>
            <span className="rounded-full bg-[#F0F7FF] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#006AD1]">Top 5</span>
          </div>

          <div className="mt-5 space-y-4">
            {topFive.map((candidate, index) => (
              <div key={candidate.id} className="rounded-[22px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-sm font-black text-[#006AD1] shadow-sm">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-slate-950">{candidate.name}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Mã dự án {candidate.sbd}</p>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-black text-emerald-600">{candidate.votes.toLocaleString()}</p>
                    <p className="text-xs font-semibold text-slate-500">lượt bình chọn</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card !rounded-[28px] !p-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black tracking-tight text-slate-950">Vận hành hôm nay</h2>
            <p className="mt-1 text-sm text-slate-500">Tóm tắt nhanh để kiểm tra trạng thái hệ thống trước khi thao tác.</p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ['Nguồn dữ liệu dự án', candidates.length > 0 ? 'Đã tải thành công' : 'Đang chờ API'],
              ['Dự án dẫn đầu', leadingCandidate ? `SBD ${leadingCandidate.sbd}` : 'Chưa xác định'],
              ['Đồng bộ sponsor', sponsors.length > 0 ? 'Sẵn sàng hiển thị' : 'Chưa có dữ liệu'],
              ['Cổng bình chọn', gateOpen ? 'Cho phép người dùng vote' : 'Tạm dừng vote'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-600">{label}</span>
                <span className="text-sm font-black text-slate-950">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-[#D7ECFF] bg-[#F8FBFF] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#006AD1]">Khuyến nghị thao tác</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nếu chuẩn bị mở cổng bình chọn, hãy kiểm tra lại phần Tin tức, Banner, Thời gian và Thiết lập hệ thống để tránh thông tin lệch giữa admin và website public.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
