'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Candidate, Sponsor } from '@huitfest/shared';
import { apiUrl, formatAssetUrl } from '../api';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Skeleton({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-slate-200/80', className)} />;
}

function useAnimatedNumber(value: number, duration = 900) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let frame = 0;
    const start = displayValue;
    const diff = value - start;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + diff * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return displayValue;
}

function AnimatedMetric({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) {
  const animated = useAnimatedNumber(value);
  return <>{animated.toLocaleString()}{suffix}</>;
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v2a4 4 0 0 1-4 4h-1" />
      <path d="M7 5H4v2a4 4 0 0 0 4 4h1" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function TrendChip({
  label,
  tone,
}: {
  label: string;
  tone: 'blue' | 'green' | 'amber';
}) {
  const styles = {
    blue: 'border-blue-200/70 bg-blue-50 text-blue-700',
    green: 'border-emerald-200/70 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200/70 bg-amber-50 text-amber-700',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold', styles[tone])}>
      {label}
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
  note,
  chip,
  accent,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  note: string;
  chip?: React.ReactNode;
  accent: string;
  loading?: boolean;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-700 shadow-sm">
          {icon}
        </div>
        {chip}
      </div>
      <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-2 min-h-[48px]">
        {loading ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <p className="text-[40px] font-extrabold leading-none tracking-[-0.05em] text-slate-950">
            {typeof value === 'number' ? <AnimatedMetric value={value} /> : value}
          </p>
        )}
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-500">{note}</p>
    </article>
  );
}

function TopBadge({ index }: { index: number }) {
  const badges = [
    { label: 'Top 1', className: 'border-amber-200 bg-amber-50 text-amber-700' },
    { label: 'Top 2', className: 'border-slate-200 bg-slate-100 text-slate-700' },
    { label: 'Top 3', className: 'border-orange-200 bg-orange-50 text-orange-700' },
  ];

  const badge = badges[index] || { label: `Top ${index + 1}`, className: 'border-blue-200 bg-blue-50 text-blue-700' };

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold', badge.className)}>
      {badge.label}
    </span>
  );
}

function StatusCard({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: 'success' | 'warning' | 'neutral';
  label: string;
  value: string;
}) {
  const styles = {
    success: 'border-emerald-200/80 bg-emerald-50/70 text-emerald-700',
    warning: 'border-amber-200/80 bg-amber-50/70 text-amber-700',
    neutral: 'border-slate-200/80 bg-slate-50/80 text-slate-700',
  };

  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-white/90 p-4 shadow-sm transition duration-200 hover:-translate-y-[1px] hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border', styles[tone])}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-1 text-[15px] font-extrabold tracking-[-0.02em] text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function formatRemaining(endDate?: string | null) {
  if (!endDate) return null;
  const end = new Date(endDate).getTime();
  if (!Number.isFinite(end)) return null;
  const diff = end - Date.now();
  if (diff <= 0) return 'Đã kết thúc';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) return `${days} ngày ${hours} giờ`;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  return `${minutes} phút`;
}

export default function OverviewPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [gateOpen, setGateOpen] = useState(true);
  const [eventTitle, setEventTitle] = useState('HUIT Startup 2026');
  const [endDate, setEndDate] = useState<string | null>(null);
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
          setEndDate(settings.endDate || null);
        }
      } catch (err) {
        console.error('Failed to load admin overview data.', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const totalVotes = useMemo(
    () => candidates.reduce((sum, candidate) => sum + candidate.votes, 0),
    [candidates],
  );
  const rankedCandidates = useMemo(() => [...candidates].sort((a, b) => b.votes - a.votes), [candidates]);
  const leadingCandidate = rankedCandidates[0] || null;
  const topFive = rankedCandidates.slice(0, 5);
  const remaining = formatRemaining(endDate);

  const operationalStatus = [
    {
      label: 'Nguồn dữ liệu dự án',
      value: candidates.length > 0 ? 'Đã tải thành công' : 'Đang chờ API',
      tone: candidates.length > 0 ? 'success' as const : 'warning' as const,
      icon: candidates.length > 0 ? <CheckIcon /> : <WarningIcon />,
    },
    {
      label: 'Cổng bình chọn',
      value: gateOpen ? 'Cho phép người dùng vote' : 'Tạm dừng vote',
      tone: gateOpen ? 'success' as const : 'warning' as const,
      icon: gateOpen ? <CheckIcon /> : <PauseIcon />,
    },
    {
      label: 'Đồng bộ sponsor',
      value: sponsors.length > 0 ? 'Sẵn sàng hiển thị' : 'Chưa có dữ liệu',
      tone: sponsors.length > 0 ? 'success' as const : 'neutral' as const,
      icon: sponsors.length > 0 ? <CheckIcon /> : <WarningIcon />,
    },
    {
      label: 'Dự án dẫn đầu',
      value: leadingCandidate ? `SBD ${leadingCandidate.sbd}` : 'Chưa xác định',
      tone: leadingCandidate ? 'success' as const : 'neutral' as const,
      icon: leadingCandidate ? <TrophyIcon /> : <WarningIcon />,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-8">
      <section className="relative overflow-hidden rounded-[30px] border border-[rgba(21,101,216,0.14)] bg-[linear-gradient(135deg,#0b2047_0%,#123d85_55%,#1787b8_100%)] px-7 py-7 text-white shadow-[0_26px_60px_rgba(15,23,42,0.18)]">
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/90">
                Tổng quan hệ thống
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]',
                  gateOpen
                    ? 'border-emerald-300/20 bg-emerald-400/15 text-emerald-100'
                    : 'border-rose-300/20 bg-rose-400/15 text-rose-100',
                )}
              >
                {gateOpen ? 'Cổng bình chọn đang mở' : 'Cổng bình chọn đang đóng'}
              </span>
            </div>

            <h1 className="mt-4 max-w-4xl text-[clamp(28px,3.1vw,42px)] font-extrabold leading-[1.04] tracking-[-0.05em] text-white">
              {eventTitle}
            </h1>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:max-w-[780px] xl:grid-cols-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-[92px] w-full bg-white/15" />
                  <Skeleton className="h-[92px] w-full bg-white/15" />
                  <Skeleton className="h-[92px] w-full bg-white/15" />
                  <Skeleton className="h-[92px] w-full bg-white/15" />
                </>
              ) : (
                <>
                  <div className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">Dự án</p>
                    <p className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-white">
                      <AnimatedMetric value={candidates.length} />
                    </p>
                    <p className="mt-1 text-xs font-medium text-white/70">Đang hiển thị</p>
                  </div>
                  <div className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">Tổng vote</p>
                    <p className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-white">
                      <AnimatedMetric value={totalVotes} />
                    </p>
                    <p className="mt-1 text-xs font-medium text-white/70">Cập nhật realtime</p>
                  </div>
                  <div className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">Dẫn đầu</p>
                    <p className="mt-2 truncate text-[18px] font-extrabold tracking-[-0.03em] text-white">
                      {leadingCandidate ? leadingCandidate.sbd : '--'}
                    </p>
                    <p className="mt-1 text-xs font-medium text-white/70">{leadingCandidate ? `${leadingCandidate.votes.toLocaleString()} lượt bình chọn` : 'Chưa có dữ liệu'}</p>
                  </div>
                  <div className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">Thời gian còn lại</p>
                    <p className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-white">
                      {remaining || '--'}
                    </p>
                    <p className="mt-1 text-xs font-medium text-white/70">{remaining ? 'Theo cấu hình hiện tại' : 'Không có mốc kết thúc'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <TrophyIcon />
                </div>
                <TrendChip label={leadingCandidate ? 'Top 1' : 'No data'} tone="blue" />
              </div>
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">Dự án dẫn đầu</p>
              <p className="mt-2 line-clamp-2 text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white">
                {leadingCandidate ? leadingCandidate.name : 'Chưa có dữ liệu'}
              </p>
              <p className="mt-2 text-sm font-medium text-white/72">
                {leadingCandidate ? `${leadingCandidate.votes.toLocaleString()} vote • Mã dự án ${leadingCandidate.sbd}` : 'Đang chờ dữ liệu từ API.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
              <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <SparkIcon />
                </div>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">Nhà tài trợ</p>
                <p className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-white">
                  {isLoading ? '--' : <AnimatedMetric value={sponsors.length} />}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <ClockIcon />
                </div>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">Trạng thái</p>
                <p className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] text-white">
                  {gateOpen ? 'Mở' : 'Đóng'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<FolderIcon />}
          label="Dự án"
          value={candidates.length}
          note="Số lượng dự án đang công khai trên website."
          chip={<TrendChip label="Live" tone="blue" />}
          accent="linear-gradient(90deg, #38bdf8, #0ea5e9)"
          loading={isLoading}
        />
        <MetricCard
          icon={<SparkIcon />}
          label="Tổng lượt vote"
          value={totalVotes}
          note="Bao gồm cả bình chọn miễn phí và các gói đã ghi nhận."
          chip={<TrendChip label="Realtime" tone="green" />}
          accent="linear-gradient(90deg, #2563eb, #22d3ee)"
          loading={isLoading}
        />
        <MetricCard
          icon={gateOpen ? <CheckIcon /> : <PauseIcon />}
          label="Trạng thái cổng"
          value={gateOpen ? 'Mở' : 'Đóng'}
          note="Điều khiển trực tiếp tại mục Thiết lập hệ thống."
          chip={<TrendChip label={gateOpen ? 'Đang hoạt động' : 'Tạm dừng'} tone={gateOpen ? 'green' : 'amber'} />}
          accent="linear-gradient(90deg, #22c55e, #34d399)"
          loading={isLoading}
        />
        <MetricCard
          icon={<TrophyIcon />}
          label="Dự án dẫn đầu"
          value={leadingCandidate ? leadingCandidate.votes : 0}
          note={leadingCandidate ? `${leadingCandidate.name} đang đứng đầu bảng xếp hạng.` : 'Sẽ hiển thị khi có dữ liệu bình chọn.'}
          chip={<TrendChip label={leadingCandidate ? `SBD ${leadingCandidate.sbd}` : 'No data'} tone="amber" />}
          accent="linear-gradient(90deg, #f59e0b, #fbbf24)"
          loading={isLoading}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <article className="admin-card overflow-hidden !rounded-[28px] !p-0">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-7 py-6">
            <div>
              <h2 className="text-[30px] font-extrabold tracking-[-0.04em] text-slate-950">Top dự án nổi bật</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-500">Theo dõi nhanh những dự án đang dẫn đầu về mức độ quan tâm.</p>
            </div>
            <span className="rounded-full border border-blue-200/70 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
              Top 5
            </span>
          </div>

          <div className="px-5 py-5">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="rounded-[24px] border border-slate-200/80 bg-white p-5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-[20px]" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topFive.map((candidate, index) => {
                  const isLeader = index === 0;
                  return (
                    <div
                      key={candidate.id}
                      className={cn(
                        'group rounded-[24px] border bg-white px-5 py-4 shadow-sm transition duration-200 hover:-translate-y-[1px] hover:shadow-md',
                        isLeader
                          ? 'border-blue-200/80 bg-[linear-gradient(135deg,rgba(239,246,255,0.96),rgba(255,255,255,0.96))] shadow-[0_18px_36px_rgba(37,99,235,0.08)]'
                          : 'border-slate-200/80',
                      )}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="relative">
                            <img
                              src={formatAssetUrl(candidate.imageUrl)}
                              alt={candidate.name}
                              className="h-16 w-16 rounded-[20px] border border-slate-200 object-cover shadow-sm"
                            />
                            <span className="absolute -right-2 -top-2">
                              <TopBadge index={index} />
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-[22px] font-extrabold tracking-[-0.03em] text-slate-950">{candidate.name}</p>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                Mã dự án {candidate.sbd}
                              </span>
                              {isLeader && <TrendChip label="Dẫn đầu" tone="blue" />}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className={cn('text-[34px] font-extrabold tracking-[-0.05em]', isLeader ? 'text-blue-700' : 'text-slate-950')}>
                            <AnimatedMetric value={candidate.votes} />
                          </p>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">lượt bình chọn</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </article>

        <article className="admin-card !rounded-[28px] !p-0">
          <div className="border-b border-slate-100 px-7 py-6">
            <h2 className="text-[30px] font-extrabold tracking-[-0.04em] text-slate-950">Vận hành hôm nay</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">Kiểm tra nhanh các trạng thái hệ thống quan trọng trước khi thao tác.</p>
          </div>

          <div className="space-y-4 px-5 py-5">
            {isLoading ? (
              <>
                <Skeleton className="h-[82px] w-full" />
                <Skeleton className="h-[82px] w-full" />
                <Skeleton className="h-[82px] w-full" />
                <Skeleton className="h-[82px] w-full" />
              </>
            ) : (
              operationalStatus.map((item) => (
                <StatusCard key={item.label} icon={item.icon} tone={item.tone} label={item.label} value={item.value} />
              ))
            )}

            <div className="rounded-[24px] border border-blue-200/80 bg-[linear-gradient(180deg,#f8fbff,#f3f8ff)] p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-200/80 bg-white text-blue-700">
                  <SparkIcon />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Khuyến nghị thao tác</p>
                  <p className="mt-2 text-sm font-medium leading-7 text-slate-600">
                    Nếu chuẩn bị mở cổng bình chọn, hãy kiểm tra lại phần Tin tức, Banner, Thời gian và Thiết lập hệ thống để tránh lệch thông tin giữa admin và website public.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
