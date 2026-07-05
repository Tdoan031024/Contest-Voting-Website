'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Candidate } from '@huitfest/shared';
import Link from 'next/link';
import { useAlert } from '../AlertProvider';
import { apiUrl } from '../api';
import VoteModal from '../VoteModal';
const PROJECT_FALLBACK_IMAGE = '/duan/anhmauduan.png';

function getCandidateImageUrl(url?: string | null) {
  if (!url) return PROJECT_FALLBACK_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads/')) return apiUrl(url);
  return url;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);
  return count;
}

const LOCAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Dự án Nông nghiệp xanh', votes: 106100, imageUrl: '/original_assets/image389b.png', description: 'Giải pháp ứng dụng công nghệ để tối ưu sản xuất nông nghiệp bền vững.' },
  { id: '2', sbd: '089', name: 'Nền tảng học tập thông minh', votes: 62215, imageUrl: '/original_assets/image725f.png', description: 'Ứng dụng AI hỗ trợ cá nhân hóa lộ trình học tập cho học sinh, sinh viên.' },
  { id: '3', sbd: '024', name: 'Sản phẩm tái chế sáng tạo', votes: 22800, imageUrl: '/original_assets/image940e.jpg', description: 'Dự án biến vật liệu tái chế thành sản phẩm có giá trị thương mại.' },
  { id: '4', sbd: '096', name: 'Chăm sóc sức khỏe cộng đồng', votes: 20590, imageUrl: '/original_assets/image8681.png', description: 'Mô hình kết nối tư vấn sức khỏe và theo dõi chỉ số cơ bản từ xa.' },
  { id: '5', sbd: '018', name: 'Du lịch trải nghiệm địa phương', votes: 16070, imageUrl: '/original_assets/imageada2.png', description: 'Nền tảng quảng bá văn hóa bản địa và tour trải nghiệm cho giới trẻ.' },
  { id: '6', sbd: '095', name: 'Thương mại xanh cho SME', votes: 8410, imageUrl: '/original_assets/image4706.png', description: 'Giải pháp chuyển đổi số cho hộ kinh doanh và doanh nghiệp vừa và nhỏ.' },
];

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('huit_web_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// Skeleton Card component
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line long" />
        <div className="skeleton skeleton-btn" style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}

// Podium Item component
function PodiumItem({ candidate, rank, maxVotes, onVote, isGateOpen }: {
  candidate: Candidate;
  rank: number;
  maxVotes: number;
  onVote: (c: Candidate) => void;
  isGateOpen: boolean;
}) {
  const podiumRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (podiumRef.current) obs.observe(podiumRef.current);
    return () => obs.disconnect();
  }, []);
  const votesDisplay = useCountUp(candidate.votes, 1500, visible);
  const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : 'rank-3';
  const rankTone = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'standard';

  return (
    <div ref={podiumRef} className={`podium-item ${rankClass}`} style={{ animationDelay: `${(rank - 1) * 100}ms` }}>
      
      {/* Startup Project Card (Structured identically to the CandidateCard below) */}
      <div className="project-card-clear project-showcase-card relative w-full border transition-all duration-300 overflow-hidden flex flex-col">
        {/* Project banner image */}
        <div className="project-card-media project-showcase-media relative block w-full aspect-[16/8.6]">
          <div className="project-media-shell m-2 mb-0 relative h-[calc(100%-8px)] overflow-hidden rounded-[13px] bg-black/15 border border-white/10">
            {rank === 1 && <div className="podium-crown">👑</div>}
            <img
              alt={candidate.name}
              className="project-media-image object-cover object-center w-full h-full"
              src={getCandidateImageUrl(candidate.imageUrl)}
              loading="lazy"
              onError={(event) => {
                const target = event.currentTarget;
                if (!target.dataset.fallbackApplied) {
                  target.dataset.fallbackApplied = 'true';
                  target.src = PROJECT_FALLBACK_IMAGE;
                }
              }}
            />
          </div>
        </div>

        {/* Project details */}
        <div className="project-card-body project-showcase-body flex flex-1 flex-col px-3 pt-3 pb-3">
          <div className="project-card-meta">
            <span className="project-card-code-badge">Mã dự án: {candidate.sbd}</span>
            <span className={`project-rank-badge ${rankTone}`}>Top {rank}</span>
          </div>

          <div className="project-title-group">
            <h3 className="project-card-title">
              <Link href={`/thi-sinh/${candidate.sbd}`} className="focus:outline-none">
                {candidate.name}
              </Link>
            </h3>
          </div>

          <div className="project-vote-stat">
            <div>
              <p className="project-vote-stat-label">Lượt bình chọn</p>
              <p className="project-vote-stat-value">
                {visible ? votesDisplay.toLocaleString() : candidate.votes.toLocaleString()}
              </p>
            </div>
          </div>

          <p className="project-card-description mt-2 line-clamp-2 min-h-[42px] text-left">
            {candidate.description || 'Ý tưởng khởi nghiệp đang được cập nhật thông tin giới thiệu.'}
          </p>

          <div className="project-card-actions flex items-center gap-2">
            <button
              onClick={() => onVote(candidate)}
              disabled={!isGateOpen}
              aria-label={isGateOpen ? `Bình chọn cho dự án ${candidate.name}` : 'Cổng bình chọn đã đóng'}
              className={`project-vote-button sc-7f525aa4-0 eyRkL flex items-center justify-center gap-2 rounded-xl py-2.5 w-full border-0 cursor-pointer transition-all hover-shine-effect ${isGateOpen
                  ? 'active bg-primary dark:bg-neutral-white hover:opacity-90 active:scale-[0.98]'
                  : 'disabled bg-slate-200 dark:bg-slate-800/50 cursor-not-allowed'
                }`}
            >
              <span className="project-vote-button-glow" aria-hidden="true" />
              <p className={`project-vote-button-label text-[11px] leading-[16px] font-bold uppercase tracking-wider ${isGateOpen
                  ? 'text-neutral-white dark:text-primary'
                  : 'text-slate-500 dark:text-slate-400'
                }`}>
                {isGateOpen ? 'Bình chọn' : 'Đã đóng'}
              </p>
            </button>
            <Link
              href={`/thi-sinh/${candidate.sbd}`}
              className="ranking-detail-button flex min-h-[40px] items-center justify-center rounded-xl px-4 font-bold uppercase tracking-wider transition whitespace-nowrap"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Pedestal block under the card */}
      <div className="podium-pedestal">
        <div className="podium-pedestal-num">{rank}</div>
        <div className="podium-pedestal-label">
          {rank === 1 ? 'Quán quân' : rank === 2 ? 'Hạng 2' : 'Hạng 3'}
        </div>
      </div>
    </div>
  );
}

// Regular candidate card
function CandidateCard({ c, rank, maxVotes, visible, animationDelay, onVote, isGateOpen }: {
  c: Candidate;
  rank: number;
  maxVotes: number;
  visible: boolean;
  animationDelay: string;
  onVote: (c: Candidate) => void;
  isGateOpen: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const votesDisplay = useCountUp(c.votes, 1400, inView);
  const rankTone = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'standard';
  const candidateImage = getCandidateImageUrl(c.imageUrl);

  return (
    <div
      ref={cardRef}
      style={{ animationDelay }}
      className={`project-card-item h-full group w-full transition-all duration-300 ${visible ? 'anim-up' : ''}`}
    >
      <div className="project-card-clear project-showcase-card relative h-full rounded-[20px] border transition-all duration-300 overflow-hidden">
        {/* Project banner image */}
        <div className="project-card-media project-showcase-media relative block w-full aspect-[16/8.6]">
          <div className="project-media-shell m-2 mb-0 relative h-[calc(100%-8px)] overflow-hidden rounded-[13px] bg-black/15 border border-white/10">
            <img
              alt={c.name}
              className="project-media-image object-cover object-center w-full h-full"
              src={candidateImage}
              loading="lazy"
              onError={(event) => {
                const target = event.currentTarget;
                if (!target.dataset.fallbackApplied) {
                  target.dataset.fallbackApplied = 'true';
                  target.src = PROJECT_FALLBACK_IMAGE;
                }
              }}
            />
          </div>
        </div>

        {/* Project details */}
        <div className="project-card-body project-showcase-body flex flex-1 flex-col px-3 pt-3 pb-3">
          <div className="project-card-meta">
            <span className="project-card-code-badge">Mã dự án: {c.sbd}</span>
            <span className={`project-rank-badge ${rankTone}`}>Top {rank}</span>
          </div>

          <div className="project-title-group">
            <h3 className="project-card-title">
              <Link href={`/thi-sinh/${c.sbd}`} className="focus:outline-none">
                {c.name}
              </Link>
            </h3>
          </div>

          <div className="project-vote-stat">
            <div>
              <p className="project-vote-stat-label">Lượt bình chọn</p>
              <p className="project-vote-stat-value">
                {inView ? votesDisplay.toLocaleString() : c.votes.toLocaleString()}
              </p>
            </div>
          </div>

          <p className="project-card-description mt-2 line-clamp-2 min-h-[42px] text-left">
            {c.description || 'Ý tưởng khởi nghiệp đang được cập nhật thông tin giới thiệu.'}
          </p>

          <div className="project-card-actions flex items-center gap-2">
            <button
              onClick={() => onVote(c)}
              disabled={!isGateOpen}
              aria-label={isGateOpen ? `Bình chọn cho dự án ${c.name}` : 'Cổng bình chọn đã đóng'}
              className={`project-vote-button sc-7f525aa4-0 eyRkL flex items-center justify-center gap-2 rounded-xl py-2.5 w-full border-0 cursor-pointer transition-all hover-shine-effect ${isGateOpen
                  ? 'active bg-primary dark:bg-neutral-white hover:opacity-90 active:scale-[0.98]'
                  : 'disabled bg-slate-200 dark:bg-slate-800/50 cursor-not-allowed'
                }`}
            >
              <span className="project-vote-button-glow" aria-hidden="true" />
              <p className={`project-vote-button-label text-[11px] leading-[16px] font-bold uppercase tracking-wider ${isGateOpen
                  ? 'text-neutral-white dark:text-primary'
                  : 'text-slate-500 dark:text-slate-400'
                }`}>
                {isGateOpen ? 'Bình chọn' : 'Đã đóng'}
              </p>
            </button>
            <Link
              href={`/thi-sinh/${c.sbd}`}
              className="ranking-detail-button flex min-h-[40px] items-center justify-center rounded-xl px-4 font-bold uppercase tracking-wider transition whitespace-nowrap"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RankingPage() {
  const { showAlert } = useAlert();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeVoteCandidate, setActiveVoteCandidate] = useState<Candidate | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'ALL' | 'HIGH_SCHOOL' | 'STUDENT' | 'ENTERPRISE'>('ALL');
  const [sortBy, setSortBy] = useState<'votes' | 'sbd'>('votes');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  const titleSection = useInView(0.2);
  const podiumSection = useInView(0.1);
  const listSection = useInView(0.05);

  useEffect(() => {
    async function loadCandidates() {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl('/api/candidates'));
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        } else {
          setCandidates(LOCAL_MOCK_CANDIDATES);
        }
      } catch { setCandidates(LOCAL_MOCK_CANDIDATES); console.log('Using local mock data.'); }
      finally { setIsLoading(false); }
    }
    loadCandidates();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(apiUrl('/api/candidates'));
        if (res.ok) { const data = await res.json(); setCandidates(data); }
      } catch { }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/settings'));
        if (res.ok) { setSettings(await res.json()); }
      } catch { }
    }
    loadSettings();
    const interval = setInterval(loadSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  const isGateOpen = (() => {
    if (!settings) return true;
    if (!settings.isGateOpen) return false;
    const now = new Date();
    return now >= new Date(settings.startDate) && now <= new Date(settings.endDate);
  })();

  const handleVote = (c: Candidate) => {
    if (!isGateOpen) {
      showAlert('Cổng bình chọn hiện đang đóng hoặc chưa đến thời gian mở cổng. Vui lòng quay lại sau!', 'warning', 'Cổng bình chọn');
      return;
    }
    setActiveVoteCandidate(c);
  };

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const filteredCandidates = candidates
    .filter(c => category === 'ALL' || c.contestTable === category)
    .filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase()) || c.sbd.includes(search.trim()))
    .sort((a, b) => sortBy === 'votes'
      ? b.votes - a.votes
      : a.sbd.localeCompare(b.sbd, 'vi', { numeric: true }));
  const top3 = sortedCandidates.slice(0, 3);
  const desktopPodiumOrder = [1, 0, 2].map(i => top3[i]).filter(Boolean);
  const mobilePodiumOrder = top3.filter(Boolean);
  const maxVotes = sortedCandidates[0]?.votes || 1;
  const showPodium = !search.trim() && category === 'ALL' && sortBy === 'votes';
  const listCandidates = showPodium
    ? filteredCandidates.filter(c => sortedCandidates.findIndex(item => item.sbd === c.sbd) >= 3)
    : filteredCandidates;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        .anim-up { animation: fadeSlideUp 0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-d50  { animation-delay:  50ms; }
        .anim-d100 { animation-delay: 100ms; }
        .anim-d150 { animation-delay: 150ms; }
        .anim-d200 { animation-delay: 200ms; }
        .anim-d300 { animation-delay: 300ms; }
        .cand-card { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease; }
        .cand-card:hover { transform: translateY(-7px) scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.25); }
        .vote-btn { transition: transform 0.25s ease, box-shadow 0.25s ease; position: relative; overflow: hidden; }
        .vote-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); box-shadow: 0 6px 20px rgba(10,47,255,0.35); }
        .vote-btn:active:not(:disabled) { transform: scale(0.97); }
        .orb-pulse { animation: float 10s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .ranking-control-panel {
          position: sticky;
          top: 84px;
          z-index: 50;
          max-width: 980px;
          margin-inline: auto;
          padding-top: 14px;
          padding-bottom: 12px;
          border: 1px solid var(--site-line);
          border-radius: 22px;
          background: color-mix(in srgb, var(--site-card) 90%, transparent);
          box-shadow: 0 16px 42px rgba(15,23,42,.10);
          backdrop-filter: blur(18px) saturate(1.25);
        }
        .ranking-filter-toolbar {
          max-width: 860px;
          margin: 12px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .ranking-filter-pills { display: flex; flex-wrap: wrap; gap: 7px; }
        .ranking-filter-pill {
          min-height: 38px;
          padding: 0 14px;
          border: 1px solid var(--site-line);
          border-radius: 999px;
          background: var(--site-soft);
          color: var(--site-muted);
          font-size: 12px;
          font-weight: 750;
          transition: .2s ease;
        }
        .ranking-filter-pill:hover { border-color: var(--site-primary); color: var(--site-primary); }
        .ranking-filter-pill.active {
          border-color: transparent;
          background: linear-gradient(135deg, #0A2FFF, #2870df);
          color: #fff;
          box-shadow: 0 7px 18px rgba(10,47,255,.22);
        }
        .ranking-sort-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--site-muted);
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }
        .ranking-sort-label select {
          height: 38px;
          padding: 0 30px 0 12px;
          border: 1px solid var(--site-line);
          border-radius: 11px;
          background: var(--site-card);
          color: var(--site-text);
          font-size: 12px;
          font-weight: 700;
        }
        .ranking-result-count {
          margin: 8px 0 0;
          color: var(--site-muted);
          text-align: center;
          font-size: 12px;
        }
        .ranking-page-modern .empty-state h3 { color: var(--site-text) !important; }
        .ranking-page-modern .empty-state p { color: var(--site-muted) !important; }
        .ranking-reset-button {
          margin-top: 16px;
          min-height: 42px;
          padding: 0 24px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, #0A2FFF, #79BCC2);
          color: #fff;
          font-weight: 750;
        }
        .ranking-page-modern .project-card-description { font-size: 15px !important; line-height: 1.65 !important; }
        .ranking-page-modern .project-vote-stat-label { font-size: 12px !important; }
        .ranking-page-modern .project-vote-button-label { font-size: 13px !important; line-height: 18px !important; }
        .ranking-detail-button {
          border: 1px solid var(--site-line);
          background: var(--site-card);
          color: var(--site-text) !important;
          font-size: 13px;
        }
        .ranking-detail-button:hover { border-color: #79BCC2; background: var(--site-soft); }
        .ranking-page-modern button:focus-visible,
        .ranking-page-modern a:focus-visible,
        .ranking-page-modern input:focus-visible,
        .ranking-page-modern select:focus-visible {
          outline: 3px solid rgba(40,112,223,.25) !important;
          outline-offset: 3px !important;
        }
        @media (max-width: 760px) {
          .ranking-control-panel { top: 84px; border-radius: 16px; padding-inline: 12px !important; }
          .ranking-filter-toolbar { flex-direction: column; align-items: stretch; }
          .ranking-filter-pills { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); }
          .ranking-filter-pill { padding-inline: 8px; }
          .ranking-sort-label { justify-content: space-between; }
          .ranking-sort-label select { flex: 1; max-width: 230px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-up, .orb-pulse, .podium-crown { animation: none !important; }
        }
      `}</style>

      <main className="sc-908a50-0 iUzfqH theme-page ranking-page-modern flex-1">
        <div className="orb-pulse fixed top-20 -left-20 w-[350px] h-[350px] rounded-full bg-[#0A2FFF]/8 blur-[120px] pointer-events-none z-0" />
        <div className="orb-pulse fixed -bottom-10 -right-10 w-[400px] h-[400px] rounded-full bg-[#79BCC2]/6 blur-[130px] pointer-events-none z-0" style={{ animationDelay: '5s' }} />

        <div className="relative z-10">
          <div className="sc-1a037b37-0 hfAPBN relative">
            <div className="flex flex-col items-center py-3 sm:py-[40px]">

              {/* Title section with Live Badge */}
              <div ref={titleSection.ref} className="flex flex-col items-center space-y-[24px] text-center w-full">
                <div className="flex flex-col items-center space-y-1.5">

                  <h1 className={`ranking-title text-[26px] sm:text-[44px] tracking-[-1px] leading-[32px] sm:leading-[54px] font-extrabold uppercase ${titleSection.visible ? 'anim-up anim-d100' : ''}`}>
                    Bảng xếp hạng dự án
                  </h1>
                  <p className={`text-[16px] sm:text-[28px] py-1 leading-[24px] uppercase font-semibold text-[#79BCC2] ${titleSection.visible ? 'anim-up anim-d200' : ''}`}>
                    HUIT STARTUP LẦN THỨ VII 2026
                  </p>
                  <div
                    className="h-[3px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-2 transition-all duration-[1200ms] ease-out"
                    style={{ width: titleSection.visible ? '60px' : '0px' }}
                  />
                </div>
              </div>

              {/* Enhanced Search Bar */}
              <div className={`ranking-control-panel w-full mt-4 sm:mt-6 px-4 ${titleSection.visible ? 'anim-up anim-d300' : ''}`}>
                <div className="search-enhanced">
                  <span className="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <line x1="20" y1="20" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm dự án theo tên hoặc MDB... vd: '085', 'Nông nghiệp'"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    aria-label="Tìm dự án theo tên hoặc mã dự án"
                  />
                  {search && (
                    <button type="button" className="search-clear" onClick={() => setSearch('')} aria-label="Xóa nội dung tìm kiếm">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="ranking-filter-toolbar">
                  <div className="ranking-filter-pills" role="group" aria-label="Lọc dự án theo bảng thi">
                    {[
                      ['ALL', 'Tất cả'],
                      ['HIGH_SCHOOL', 'Học sinh'],
                      ['STUDENT', 'Sinh viên'],
                      ['ENTERPRISE', 'Doanh nghiệp']
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={`ranking-filter-pill ${category === value ? 'active' : ''}`}
                        aria-pressed={category === value}
                        onClick={() => setCategory(value as typeof category)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <label className="ranking-sort-label">
                    <span>Sắp xếp</span>
                    <select value={sortBy} onChange={event => setSortBy(event.target.value as typeof sortBy)}>
                      <option value="votes">Nhiều phiếu nhất</option>
                      <option value="sbd">Mã dự án tăng dần</option>
                    </select>
                  </label>
                </div>
                <p className="ranking-result-count" aria-live="polite">
                  {filteredCandidates.length > 0 ? `${filteredCandidates.length} dự án phù hợp` : 'Không tìm thấy dự án phù hợp'}
                </p>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="w-full max-w-[1360px] mx-auto px-4 mt-8">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                  </div>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="empty-state mt-8">
                  <div className="empty-state-icon" style={{ fontSize: 56, filter: 'grayscale(0.5)' }}>🔍</div>
                  <h3>Không tìm thấy dự án</h3>
                  <p>Thử đổi từ khóa, bảng thi hoặc cách sắp xếp</p>
                  <button onClick={() => { setSearch(''); setCategory('ALL'); setSortBy('votes'); }} className="ranking-reset-button">
                    Xem tất cả dự án
                  </button>
                </div>
              ) : (
                <>
                  {/* OLYMPIC PODIUM — Only show when not searching */}
                  {showPodium && desktopPodiumOrder.length > 0 && (
                    <div ref={podiumSection.ref} className="w-full max-w-[1360px] mx-auto px-4 mb-10 mt-8">
                      <div className="mb-6 flex flex-col gap-2 text-center">
                        <p className={`text-[12px] font-bold uppercase tracking-[0.28em] text-[#79BCC2] ${podiumSection.visible ? 'anim-up' : ''}`}>
                          🏆 Dự án nổi bật nhất
                        </p>
                        <h2 className={`ranking-title text-[22px] sm:text-[34px] font-extrabold uppercase ${podiumSection.visible ? 'anim-up anim-d100' : ''}`}>
                          Bục vinh danh
                        </h2>
                      </div>

                      {/* Olympic Podium */}
                      <>
                        <div className="podium-3 hidden md:flex">
                          {desktopPodiumOrder[0] && (
                            <PodiumItem candidate={desktopPodiumOrder[0]} rank={2} maxVotes={maxVotes} onVote={handleVote} isGateOpen={isGateOpen} />
                          )}
                          {desktopPodiumOrder[1] && (
                            <PodiumItem candidate={desktopPodiumOrder[1]} rank={1} maxVotes={maxVotes} onVote={handleVote} isGateOpen={isGateOpen} />
                          )}
                          {desktopPodiumOrder[2] && (
                            <PodiumItem candidate={desktopPodiumOrder[2]} rank={3} maxVotes={maxVotes} onVote={handleVote} isGateOpen={isGateOpen} />
                          )}
                        </div>
                        <div className="podium-3 flex md:hidden">
                          {mobilePodiumOrder[0] && (
                            <PodiumItem candidate={mobilePodiumOrder[0]} rank={1} maxVotes={maxVotes} onVote={handleVote} isGateOpen={isGateOpen} />
                          )}
                          {mobilePodiumOrder[1] && (
                            <PodiumItem candidate={mobilePodiumOrder[1]} rank={2} maxVotes={maxVotes} onVote={handleVote} isGateOpen={isGateOpen} />
                          )}
                          {mobilePodiumOrder[2] && (
                            <PodiumItem candidate={mobilePodiumOrder[2]} rank={3} maxVotes={maxVotes} onVote={handleVote} isGateOpen={isGateOpen} />
                          )}
                        </div>
                      </>
                    </div>
                  )}

                  {/* Full Ranking List */}
                  {listCandidates.length > 0 && (
                    <div id="danh-sach-du-an" ref={listSection.ref} className="flex scroll-mt-28 flex-col items-center mb-8 sm:mb-12">
                      <h2 className={`ranking-title text-[18px] sm:text-[28px] tracking-wide font-bold uppercase ${listSection.visible ? 'anim-up' : ''}`}>
                        {showPodium ? 'Các vị trí tiếp theo' : 'Danh sách dự án'}
                      </h2>
                      <div
                        className="h-[2.5px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] rounded-full mt-2 transition-all duration-[1000ms] ease-out"
                        style={{ width: listSection.visible ? '50px' : '0px' }}
                      />
                    </div>
                  )}

                  <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-[1360px] mx-auto px-4">
                    {listCandidates.map((c) => {
                      const rank = sortedCandidates.findIndex(x => x.sbd === c.sbd) + 1;
                      return (
                        <CandidateCard
                          key={c.id}
                          c={c}
                          rank={rank}
                          maxVotes={maxVotes}
                          visible={listSection.visible || !!search || category !== 'ALL' || sortBy !== 'votes'}
                          animationDelay={`${(rank - 1) * 70}ms`}
                          onVote={handleVote}
                          isGateOpen={isGateOpen}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {activeVoteCandidate && (
        <VoteModal
          candidate={activeVoteCandidate}
          onClose={() => setActiveVoteCandidate(null)}
          onSuccess={(updatedCandidate) => {
            setCandidates((prev) => prev.map((c) => c.sbd === updatedCandidate.sbd ? updatedCandidate : c));
          }}
        />
      )}
    </>
  );
}
