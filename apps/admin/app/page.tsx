'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Candidate, Sponsor } from '@huitfest/shared';

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
          fetch('http://localhost:5000/api/candidates'),
          fetch('http://localhost:5000/api/sponsors'),
          fetch('http://localhost:5000/api/settings'),
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
      name: 'Tong phieu bau',
      value: totalVotes.toLocaleString(),
      detail: 'Cap nhat tu API thoi gian thuc',
      type: 'votes' as const,
    },
    {
      name: 'Thi sinh',
      value: candidates.length.toString(),
      detail: 'Ho so dang hien thi',
      type: 'users' as const,
    },
    {
      name: 'Dang dan dau',
      value: leadingCandidate ? leadingCandidate.name : 'Chua co du lieu',
      detail: leadingCandidate ? `${leadingCandidate.votes.toLocaleString()} phieu` : '0 phieu',
      type: 'leader' as const,
    },
    {
      name: 'Cong binh chon',
      value: gateOpen ? 'Dang mo' : 'Dang dong',
      detail: eventTitle,
      type: 'gate' as const,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-lg border border-[#dce5e1] bg-[#123c34] text-white shadow-sm">
        <div className="flex flex-col gap-8 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9bd8cf]">Dashboard</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">{eventTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Theo doi luot binh chon, trang thai cong va cac ho so noi bat trong mot man hinh lam viec tap trung.
            </p>
          </div>
          <div className="grid min-w-[260px] grid-cols-2 gap-3 rounded-lg bg-white/8 p-3">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs text-white/60">Nha tai tro</p>
              <p className="mt-1 text-2xl font-black">{sponsors.length}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs text-white/60">Trang thai</p>
              <p className="mt-1 text-sm font-black uppercase text-[#9bd8cf]">{gateOpen ? 'Online' : 'Paused'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.name} className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">{stat.name}</p>
                <p className="mt-3 truncate text-2xl font-black text-[#18211f]">{isLoading ? '...' : stat.value}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#edf4f1] text-[#0f766e]">
                <StatIcon type={stat.type} />
              </span>
            </div>
            <p className="mt-4 truncate text-sm font-medium text-[#6b7773]">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-lg border border-[#dce5e1] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black text-[#18211f]">Top binh chon</h3>
              <p className="text-sm text-[#6b7773]">So sanh nhanh cac thi sinh co luot vote cao nhat.</p>
            </div>
            <span className="rounded-full bg-[#fff2e8] px-3 py-1 text-xs font-bold text-[#b4492f]">Top {Math.min(rankedCandidates.length, 6)}</span>
          </div>

          <div className="mt-6 space-y-4">
            {rankedCandidates.slice(0, 6).map((candidate, index) => (
              <div key={candidate.id} className="grid grid-cols-[44px_1fr_auto] items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f4f7f6] text-sm font-black text-[#123c34]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-sm font-bold text-[#18211f]">{candidate.name}</p>
                    <p className="shrink-0 text-sm font-black text-[#0f766e]">{candidate.votes.toLocaleString()}</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf4f1]">
                    <div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${Math.max((candidate.votes / maxVotes) * 100, 4)}%` }} />
                  </div>
                </div>
                <span className="rounded-full bg-[#edf4f1] px-2.5 py-1 text-xs font-bold text-[#52605b]">SBD {candidate.sbd}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-[#dce5e1] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-[#18211f]">Van hanh hom nay</h3>
          <div className="mt-5 space-y-3">
            {[
              ['Du lieu ung vien', candidates.length > 0 ? 'Da tai' : 'Dang cho API'],
              ['Dong bo nha tai tro', sponsors.length > 0 ? 'San sang' : 'Chua co du lieu'],
              ['Trang thai cong', gateOpen ? 'Cho phep vote' : 'Tam dung vote'],
              ['Muc uu tien', leadingCandidate ? `Theo doi ${leadingCandidate.sbd}` : 'Kiem tra du lieu'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-[#edf2f0] bg-[#fbfdfc] px-4 py-3">
                <span className="text-sm font-semibold text-[#52605b]">{label}</span>
                <span className="text-right text-sm font-black text-[#18211f]">{value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
