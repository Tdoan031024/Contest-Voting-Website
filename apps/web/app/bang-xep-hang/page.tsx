'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Candidate } from '@huitfest/shared';
import Link from 'next/link';
import { useAlert } from '../AlertProvider';
import { apiUrl } from '../api';

// once=true: stays visible after first intersection, never hides again
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect(); // fire once only
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
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
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function RankingPage() {
  const { showAlert } = useAlert();
  const [candidates, setCandidates] = useState<Candidate[]>(LOCAL_MOCK_CANDIDATES);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Scroll animation refs
  const titleSection = useInView(0.2);
  const podiumSection = useInView(0.1);
  const listSection = useInView(0.05);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    async function loadCandidates() {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl('/api/candidates'));
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        }
      } catch (err) {
        console.log('NestJS Backend API offline, using local mock data.');
      } finally {
        setIsLoading(false);
      }
    }
    loadCandidates();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(apiUrl('/api/candidates'));
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        }
      } catch (err) {
        console.log('Poll candidates failed');
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/settings'));
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.log('Load settings failed');
      }
    }
    loadSettings();
    const interval = setInterval(loadSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  const isGateCurrentlyOpen = () => {
    if (!settings) return true;
    if (!settings.isGateOpen) return false;

    const now = new Date();
    const start = new Date(settings.startDate);
    const end = new Date(settings.endDate);
    return now >= start && now <= end;
  };

  const handleVote = async (sbd: string, name: string) => {
    if (!isGateCurrentlyOpen()) {
      showAlert("Cổng bình chọn hiện đang đóng hoặc chưa đến thời gian mở cổng. Vui lòng quay lại sau!", "warning", "Cổng bình chọn");
      return;
    }

    const user = getStoredUser();
    if (!user) {
      showAlert("Bạn cần đăng nhập tài khoản khán giả trước khi thực hiện bình chọn.", "warning", "Yêu cầu đăng nhập");
      window.location.href = `/dang-nhap?redirect=/bang-xep-hang`;
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/candidates/${sbd}/vote`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: user.phone,
          userId: user.id,
          packageId: 'free-5'
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidates(prev => prev.map(c => c.sbd === sbd ? updated : c));
        showAlert(`Bình chọn thành công cho ${name}!`, "success", "Bình chọn thành công");
        return;
      } else {
        const errorData = await res.json().catch(() => null);
        showAlert(errorData?.message || "Không thể thực hiện bình chọn.", "error", "Lỗi bình chọn");
        return;
      }
    } catch (err) {
      console.log('NestJS Backend API offline, executing client-side mock vote.', err);
    }

    setCandidates(prev =>
      prev.map(c => c.sbd === sbd ? { ...c, votes: c.votes + 5 } : c)
    );
    showAlert(`Bình chọn offline thành công cho ${name}!`, "success", "Bình chọn thành công");
  };

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  const filteredCandidates = sortedCandidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.sbd.includes(search)
  );

  const top3 = sortedCandidates.slice(0, 3);
  // Order for staggered display: Rank 2, Rank 1, Rank 3
  const podiumOrder = [1, 0, 2];
  const orderedTop3 = podiumOrder
    .map(idx => top3[idx])
    .filter(c => c !== undefined);

  const renderProjectCard = (c: Candidate, rank: number, featured = false, animationDelay = '0ms') => {
    const rankLabel = rank <= 3 ? `Top ${rank}` : `Hạng ${rank}`;
    const rankTone =
      rank === 1
        ? 'from-[#FFE066] to-[#F59E0B] text-[#1B1600]'
        : rank === 2
          ? 'from-[#E5E7EB] to-[#94A3B8] text-[#101827]'
          : rank === 3
            ? 'from-[#FDBA74] to-[#B45309] text-white'
            : 'from-[#0A2FFF] to-[#79BCC2] text-white';

    return (
      <div
        key={c.id}
        className={`group h-full w-full ${featured ? 'max-w-[420px]' : ''} ${listSection.visible || podiumSection.visible ? 'anim-up' : ''}`}
        style={{ animationDelay }}
      >
        <div className="cand-card relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-[10px]">
          <Link className="relative block aspect-[16/9] overflow-hidden bg-[#071034]" href={`/thi-sinh/${c.sbd}`}>
            <img
              alt={c.name}
              className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
              src={c.imageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03071F]/88 via-transparent to-transparent" />
            <div className={`absolute left-4 top-4 rounded-full bg-gradient-to-r ${rankTone} px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider shadow-lg`}>
              {rankLabel}
            </div>
            <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur-md">
              MDB {c.sbd}
            </div>
          </Link>

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#79BCC2]">Dự án khởi nghiệp</p>
                <Link href={`/thi-sinh/${c.sbd}`} className="mt-1 block">
                  <h3 className="line-clamp-2 text-[20px] font-extrabold leading-tight text-white transition group-hover:text-[#79BCC2]">
                    {c.name}
                  </h3>
                </Link>
              </div>
              <div className="shrink-0 rounded-2xl border border-[#FDE047]/25 bg-[#FDE047]/10 px-3 py-2 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#FDE68A]">Bình chọn</p>
                <p className="text-[18px] font-black text-[#FDE047] drop-shadow-[0_0_14px_rgba(253,224,71,0.4)]">
                  {c.votes.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 min-h-[42px] text-[14px] leading-relaxed text-white/72 text-justify">
              {c.description || 'Thông tin giới thiệu dự án đang được cập nhật.'}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => handleVote(c.sbd, c.name)}
                className={`vote-btn flex min-h-[46px] flex-1 items-center justify-center rounded-xl border-0 px-4 text-[14px] font-extrabold uppercase tracking-wider ${
                  isGateCurrentlyOpen()
                    ? 'bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] text-white'
                    : 'cursor-not-allowed bg-slate-700/50 text-slate-400 opacity-60'
                }`}
              >
                {isGateCurrentlyOpen() ? 'Bình chọn dự án' : 'Đã đóng'}
              </button>
              <Link
                href={`/thi-sinh/${c.sbd}`}
                className="flex min-h-[46px] items-center justify-center rounded-xl border border-white/15 bg-white/8 px-4 text-[13px] font-bold uppercase tracking-wider text-white transition hover:border-[#79BCC2]/60 hover:bg-white/12"
              >
                Chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @media (min-width: 812px) {
          .iUzfqH {
            background-image: url(/background/background.png);
            background-color: white;
            background-attachment: fixed;
            background-size: cover;
            background-repeat: no-repeat;
          }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(10,47,255,0); }
          50%       { box-shadow: 0 0 28px 4px rgba(10,47,255,0.18); }
        }
        @keyframes underlineExpand {
          from { width: 0; }
          to   { width: 40px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        .anim-up    { animation: fadeSlideUp   0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-down  { animation: fadeSlideDown  0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-scale { animation: scaleIn        0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-d50   { animation-delay:  50ms; }
        .anim-d100  { animation-delay: 100ms; }
        .anim-d150  { animation-delay: 150ms; }
        .anim-d200  { animation-delay: 200ms; }
        .anim-d300  { animation-delay: 300ms; }
        .anim-d400  { animation-delay: 400ms; }
        .anim-d500  { animation-delay: 500ms; }
        /* Podium card hover */
        .podium-card {
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.4s ease,
                      background-color 0.3s ease;
        }
        .podium-card:hover {
          transform: translateY(-10px) scale(1.04);
          box-shadow: 0 24px 60px rgba(0,0,0,0.3), 0 0 30px rgba(121,188,194,0.18);
        }
        /* Candidate card hover */
        .cand-card {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.35s ease,
                      background-color 0.3s ease;
        }
        .cand-card:hover {
          transform: translateY(-7px) scale(1.02);
          box-shadow: 0 16px 40px rgba(0,0,0,0.25), 0 0 20px rgba(121,188,194,0.12);
        }
        /* Vote button effects */
        .vote-btn {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease,
                      opacity 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .vote-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 20px rgba(10,47,255,0.35);
        }
        .vote-btn:active:not(:disabled) { transform: scale(0.97); }
        /* Search bar focus */
        .search-bar {
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .search-bar:focus-within {
          box-shadow: 0 0 0 2px rgba(121,188,194,0.35), 0 4px 20px rgba(121,188,194,0.12);
          border-color: rgba(121,188,194,0.5) !important;
        }
        .orb-pulse {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>

      <main className="sc-908a50-0 iUzfqH flex-1">

        {/* Ambient glow orbs */}
        <div className="orb-pulse fixed top-20 -left-20 w-[350px] h-[350px] rounded-full bg-[#0A2FFF]/8 blur-[120px] pointer-events-none z-0" />
        <div className="orb-pulse fixed -bottom-10 -right-10 w-[400px] h-[400px] rounded-full bg-[#79BCC2]/6 blur-[130px] pointer-events-none z-0" style={{ animationDelay: '5s' }} />

        {/* Content Wrap */}
        <div className="relative z-10">
          <div className="sc-1a037b37-0 hfAPBN relative">
            <div className="flex flex-col items-center py-3 sm:py-[40px]">

              {/* Leaderboard title */}
              <div ref={titleSection.ref} className="flex flex-col space-y-[24px] text-center">
                <div className="flex flex-col space-y-1.5">
                  <h2 className={`text-[22px] sm:text-[42px] tracking-[-1px] leading-[27px] sm:leading-[52px] font-extrabold uppercase text-white ${titleSection.visible ? 'anim-up anim-d100' : ''}`}>
                    Bảng xếp hạng dự án
                  </h2>
                  <h3 className={`text-[16px] sm:text-[28px] py-1 leading-[24px] uppercase font-semibold text-[#79BCC2] ${titleSection.visible ? 'anim-up anim-d200' : ''}`}>
                    HUIT STARTUP LẦN THỨ VII 2026
                  </h3>
                  <div
                    className="h-[3px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-2 transition-all duration-[1200ms] ease-out"
                    style={{ width: titleSection.visible ? '60px' : '0px' }}
                  />
                </div>
              </div>

              {/* Search Bar matching sample web */}
              <div className={`max-w-[615px] w-full mt-3 sm:mt-[24px] ${titleSection.visible ? 'anim-up anim-d300' : ''}`}>
                <div className="search-bar flex items-center space-x-[8px] rounded-[20px] px-[8px] py-[7px] border border-grey-lightGrey1 dark:border-grey-darkGrey bg-grey-lightGrey2 dark:bg-grey-dimGrey h-[60px] !px-2 rounded-[40px] w-full">
                  <div className="fill-neutral-neutral1 dark:fill-neutral-white pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                      <path d="M0 7.4353C0 6.52222 0.171549 5.66724 0.514648 4.87036C0.857747 4.06795 1.33366 3.36239 1.94238 2.75366C2.55111 2.14494 3.25391 1.66903 4.05078 1.32593C4.85319 0.982829 5.71094 0.811279 6.62402 0.811279C7.53711 0.811279 8.39209 0.982829 9.18896 1.32593C9.99137 1.66903 10.6969 2.14494 11.3057 2.75366C11.9144 3.36239 12.3903 4.06795 12.7334 4.87036C13.0765 5.66724 13.248 6.52222 13.248 7.4353C13.248 8.19344 13.1263 8.91284 12.8828 9.59351C12.6449 10.2742 12.3128 10.8912 11.8867 11.4446L15.9458 15.5286C16.0343 15.6171 16.1007 15.7195 16.145 15.8357C16.1948 15.9519 16.2197 16.0764 16.2197 16.2092C16.2197 16.3918 16.1782 16.5579 16.0952 16.7073C16.0177 16.8567 15.9071 16.9729 15.7632 17.0559C15.6193 17.1444 15.4533 17.1887 15.2651 17.1887C15.1323 17.1887 15.005 17.1638 14.8833 17.114C14.7671 17.0697 14.6592 17.0006 14.5596 16.9065L10.4756 12.8142C9.93327 13.2016 9.33561 13.5059 8.68262 13.7273C8.02962 13.9486 7.34342 14.0593 6.62402 14.0593C5.71094 14.0593 4.85319 13.8878 4.05078 13.5447C3.25391 13.2016 2.55111 12.7257 1.94238 12.1169C1.33366 11.5082 0.857747 10.8054 0.514648 10.0085C0.171549 9.20614 0 8.34839 0 7.4353ZM1.41943 7.4353C1.41943 8.1547 1.55225 8.82983 1.81787 9.46069C2.08903 10.086 2.46257 10.6366 2.93848 11.1125C3.41992 11.5885 3.97331 11.962 4.59863 12.2332C5.22949 12.5043 5.90462 12.6399 6.62402 12.6399C7.34342 12.6399 8.01579 12.5043 8.64111 12.2332C9.27197 11.962 9.82536 11.5885 10.3013 11.1125C10.7772 10.6366 11.1507 10.086 11.4219 9.46069C11.693 8.82983 11.8286 8.1547 11.8286 7.4353C11.8286 6.7159 11.693 6.04354 11.4219 5.41821C11.1507 4.78735 10.7772 4.23397 10.3013 3.75806C9.82536 3.27661 9.27197 2.90308 8.64111 2.63745C8.01579 2.36629 7.34342 2.23071 6.62402 2.23071C5.90462 2.23071 5.22949 2.36629 4.59863 2.63745C3.97331 2.90308 3.41992 3.27661 2.93848 3.75806C2.46257 4.23397 2.08903 4.78735 1.81787 5.41821C1.55225 6.04354 1.41943 6.7159 1.41943 7.4353Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <input
                    className="w-full bg-transparent focus:outline-none text-neutral-neutral1 dark:text-neutral-white placeholder:text-neutral-neutral1 dark:placeholder:text-neutral-white pl-2 text-[14px]"
                    placeholder="Tìm kiếm dự án theo tên hoặc MDB..."
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>


              {isLoading ? (
                <div className="flex justify-center items-center py-20 text-white">
                  Đang tải bảng xếp hạng dự án...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-20 text-white/50">
                  Không tìm thấy dự án phù hợp
                </div>
              ) : (
                <>
                  {/* Featured ranking cards */}
                  {!search && orderedTop3.length > 0 && (
                    <div ref={podiumSection.ref} className="w-full max-w-[1360px] mx-auto px-4 mb-14 mt-8">
                      <div className="mb-6 flex flex-col gap-2 text-center">
                        <p className={`text-[12px] font-bold uppercase tracking-[0.28em] text-[#79BCC2] ${podiumSection.visible ? 'anim-up' : ''}`}>
                          Dự án nổi bật
                        </p>
                        <h3 className={`text-[22px] sm:text-[34px] font-extrabold uppercase text-white ${podiumSection.visible ? 'anim-up anim-d100' : ''}`}>
                          Top dự án được bình chọn nhiều nhất
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {orderedTop3.map((c, idx) => {
                          const originalRank = sortedCandidates.findIndex(x => x.sbd === c.sbd) + 1;
                          return renderProjectCard(c, originalRank, true, `${idx * 110}ms`);
                        })}
                      </div>
                    </div>
                  )}
                  {/* Section Title for Full Grid */}
                  {!search && (
                    <div ref={listSection.ref} className="flex flex-col items-center mb-8 sm:mb-12">
                      <h3 className={`text-[18px] sm:text-[28px] tracking-wide font-bold uppercase text-white ${listSection.visible ? 'anim-up' : ''}`}>
                        Danh sách xếp hạng đầy đủ
                      </h3>
                      <div
                        className="h-[2.5px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] rounded-full mt-2 transition-all duration-[1000ms] ease-out"
                        style={{ width: listSection.visible ? '50px' : '0px' }}
                      />
                    </div>
                  )}

                  <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-[1360px] mx-auto px-4">
                    {filteredCandidates.map((c) => {
                      const rank = sortedCandidates.findIndex(x => x.sbd === c.sbd) + 1;
                      return renderProjectCard(c, rank, false, `${(rank - 1) * 70}ms`);
                    })}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* Mobile Background bottom overlay */}
        <div className="fixed left-0 top-0 right-0 supports-[height:100cqh]:h-[100cqh] supports-[height:100dvh]:h-[100dvh] sm:hidden -z-50">
          <img alt="" className="absolute top-0 max-w-[1920px] max-h-[1080px] h-[1920px] w-[1080px]" src="/original_assets/image87ce.jpg" />
        </div>

      </main>
    </>
  );
}

