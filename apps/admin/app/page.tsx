'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Candidate, Sponsor } from '@huitfest/shared';
import { apiUrl } from './api';

function StatIcon({ type }: { type: 'votes' | 'users' | 'leader' | 'gate' }) {
  const paths = {
    votes: <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></>,
    leader: <><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M5 4H3v2a3 3 0 0 0 3 3" /><path d="M19 4h2v2a3 3 0 0 1-3 3" /></>,
    gate: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}

export default function OverviewPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [gateOpen, setGateOpen] = useState(true);
  const [eventTitle, setEventTitle] = useState("HUIT's Iconic 2024");
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
  const maxVotes = Math.max(...rankedCandidates.slice(0, 6).map((candidate) => candidate.votes), 1);

  const stats = [
    {
      name: 'Tổng phiếu bầu',
      value: totalVotes.toLocaleString(),
      detail: 'Cập nhật từ API thời gian thực',
      type: 'votes' as const,
    },
    {
      name: 'Thí sinh',
      value: candidates.length.toString(),
      detail: 'Hồ sơ đang hiển thị công khai',
      type: 'users' as const,
    },
    {
      name: 'Thí sinh dẫn đầu',
      value: leadingCandidate ? leadingCandidate.name : 'Chưa có dữ liệu',
      detail: leadingCandidate ? `${leadingCandidate.votes.toLocaleString()} phiếu` : '0 phiếu',
      type: 'leader' as const,
    },
    {
      name: 'Cổng bình chọn',
      value: gateOpen ? 'Đang mở' : 'Đang đóng',
      detail: eventTitle,
      type: 'gate' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-teal-500/10 bg-gradient-to-r from-[#123c34] to-[#0f766e] text-white shadow-md relative">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-white/5 blur-2xl pointer-events-none -mr-12 -mt-12"></div>
        <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9bd8cf]">Bảng điều khiển</p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight">{eventTitle}</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              Theo dõi lượt bình chọn, trạng thái cổng bình chọn và các hồ sơ ứng viên nổi bật trong màn hình làm việc tập trung.
            </p>
          </div>
          <div className="grid min-w-[240px] grid-cols-2 gap-2 rounded-lg bg-white/5 p-2 backdrop-blur-sm border border-white/10">
            <div className="rounded bg-white/10 p-2.5 border border-white/5 text-center">
              <p className="text-[10px] text-white/70 font-medium">Nhà tài trợ</p>
              <p className="mt-0.5 text-lg font-black font-heading">{sponsors.length}</p>
            </div>
            <div className="rounded bg-white/10 p-2.5 border border-white/5 text-center">
              <p className="text-[10px] text-white/70 font-medium">Cổng bình chọn</p>
              <p className="mt-0.5 text-xs font-bold uppercase text-[#9bd8cf] tracking-wider font-heading">{gateOpen ? 'Mở' : 'Đóng'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.name} className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm hover:shadow transition-all duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85] font-heading">{stat.name}</p>
                <p className="mt-2 truncate text-xl font-black text-[#123c34] font-heading">{isLoading ? '...' : stat.value}</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf4f1] text-[#0f766e] shadow-sm">
                <StatIcon type={stat.type} />
              </span>
            </div>
            <p className="mt-3 truncate text-[10px] font-semibold text-[#6b7773]">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#edf2f0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123c34]">Top bình chọn</h3>
              <p className="text-[10px] font-semibold text-[#7a8b85]">So sánh nhanh các thí sinh có lượt bình chọn cao nhất.</p>
            </div>
            <span className="rounded-full bg-[#fff2e8] px-2 py-0.5 text-[10px] font-bold text-[#b4492f] font-heading">Top {Math.min(rankedCandidates.length, 6)}</span>
          </div>

          <div className="mt-4 space-y-3">
            {rankedCandidates.slice(0, 6).map((candidate, index) => (
              <div key={candidate.id} className="grid grid-cols-[32px_1fr_auto] items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-[#edf4f1] text-xs font-bold text-[#123c34] font-heading">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-bold text-[#18211f]">{candidate.name}</p>
                    <p className="shrink-0 text-xs font-black text-[#0f766e] font-heading">{candidate.votes.toLocaleString()} vote</p>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#edf4f1]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#0f766e] to-[#79bcc2]" style={{ width: `${Math.max((candidate.votes / maxVotes) * 100, 4)}%` }} />
                  </div>
                </div>
                <span className="rounded-full bg-[#edf4f1] px-2 py-0.5 text-[10px] font-bold text-[#52605b] border border-[#dce5e1] font-heading">SBD {candidate.sbd}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#123c34] border-b border-[#edf2f0] pb-3">Vận hành hôm nay</h3>
            <div className="mt-4 space-y-2">
              {[
                ['Dữ liệu ứng viên', candidates.length > 0 ? 'Đã tải thành công' : 'Đang chờ API...'],
                ['Đồng bộ nhà tài trợ', sponsors.length > 0 ? 'Sẵn sàng' : 'Chưa có dữ liệu'],
                ['Trạng thái cổng', gateOpen ? 'Cho phép bình chọn' : 'Tạm dừng bình chọn'],
                ['Mức ưu tiên hàng đầu', leadingCandidate ? `Giám sát SBD ${leadingCandidate.sbd}` : 'Kiểm tra kết nối'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-[#edf2f0] bg-[#fbfdfc] px-3.5 py-2.5 hover:bg-[#edf4f1]/30 transition-colors duration-200">
                  <span className="text-[11px] font-bold text-[#52605b]">{label}</span>
                  <span className="text-right text-[11px] font-bold text-[#123c34]">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#edf2f0] text-center">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7a8b85]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Máy chủ API đang hoạt động bình thường
            </span>
          </div>
        </article>
      </section>
    </div>
  );
}
