'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Candidate, WebUser } from '@huitfest/shared';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAlert } from '../../AlertProvider';
import { apiUrl } from '../../api';
import VoteModal from '../../VoteModal';

function getCandidateImageUrl(url?: string | null) {
  if (!url) return '/duan/anhmauduan.png';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads/')) return apiUrl(url);
  return url;
}

function getStoredUser(): WebUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('huit_web_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function parseVN(dStr: string | undefined | null) {
  if (!dStr) return new Date();
  let val = dStr.trim();
  if (!val.includes('Z') && !/\+\d{2}:?\d{2}$/.test(val) && !/-\d{2}:?\d{2}$/.test(val)) {
    val = `${val}+07:00`;
  }
  return new Date(val);
}

function formatDateTime(dStr: string | undefined | null) {
  if (!dStr) return '';
  const date = parseVN(dStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  const utc7 = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return `${pad(utc7.getUTCHours())}:${pad(utc7.getUTCMinutes())} ngày ${pad(utc7.getUTCDate())}/${pad(utc7.getUTCMonth() + 1)}/${utc7.getUTCFullYear()}`;
}

export default function CandidateDetailPage() {
  const { showAlert } = useAlert();
  const params = useParams();
  const sbd = params.sbd as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<WebUser | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());

    async function loadData() {
      setIsLoading(true);
      const [candidateRes, settingsRes] = await Promise.all([
        fetch(apiUrl('/api/candidates/' + sbd)),
        fetch(apiUrl('/api/settings')),
      ]);

      if (candidateRes.ok) {
        const data = await candidateRes.json();
        setCandidate(data);
        if (data) {
          setActiveImage(getCandidateImageUrl(data.imageUrl));
        }
      }

      if (settingsRes.ok) {
        setSettings(await settingsRes.json());
      }
      setIsLoading(false);
    }

    loadData().catch(() => setIsLoading(false));

    const interval = setInterval(async () => {
      try {
        const [candidateRes, settingsRes] = await Promise.all([
          fetch(apiUrl('/api/candidates/' + sbd)),
          fetch(apiUrl('/api/settings')),
        ]);
        if (candidateRes.ok) {
          const data = await candidateRes.json();
          setCandidate(data);
        }
        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }
      } catch (err) {
        console.error('Polling details failed', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sbd]);
  const showcaseUrls = useMemo(() => {
    if (!candidate || !candidate.showcaseImages) return [];
    return candidate.showcaseImages.split(',').map(url => url.trim()).filter(Boolean);
  }, [candidate?.showcaseImages]);

  const allImages = useMemo(() => {
    if (!candidate) return [];
    const list: string[] = [];
    if (candidate.imageUrl) list.push(getCandidateImageUrl(candidate.imageUrl));
    showcaseUrls.forEach(url => {
      const normalizedUrl = getCandidateImageUrl(url);
      if (normalizedUrl && !list.includes(normalizedUrl)) {
        list.push(normalizedUrl);
      }
    });
    return list;
  }, [candidate?.imageUrl, showcaseUrls]);

  const isGateOpen = useMemo(() => {
    if (!settings) return true;
    if (!settings.isGateOpen) return false;
    const now = new Date();
    const start = new Date(settings.startDate);
    const end = new Date(settings.endDate);
    return now >= start && now <= end;
  }, [settings]);

  const handleOpenLightbox = (imgUrl: string) => {
    const idx = allImages.indexOf(imgUrl);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setIsLightboxOpen(true);
  };

  const handlePrevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightboxCloseRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Tab' && lightboxRef.current) {
        const controls = Array.from(lightboxRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (first && last && e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (first && last && !e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lightboxTriggerRef.current?.focus();
    };
  }, [isLightboxOpen, allImages]);

  const handleVote = () => {
    if (!candidate) return;
    if (!isGateOpen) {
      showAlert('Cổng bình chọn hiện đang đóng hoặc chưa đến thời gian mở cổng.', 'warning', 'Cổng bình chọn');
      return;
    }
    setIsVoteModalOpen(true);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showAlert('Đã sao chép đường dẫn dự án.', 'success', 'Chia sẻ');
    } catch {
      showAlert('Không thể sao chép tự động. Hãy sao chép đường dẫn trên thanh địa chỉ.', 'warning', 'Chia sẻ');
    }
  };

  if (isLoading) {
    return <main className="project-detail-page min-h-[60vh] bg-[var(--site-bg)] px-4 py-12 text-center text-sm font-semibold text-[var(--site-muted)]">Đang tải hồ sơ dự án...</main>;
  }

  if (!candidate) {
    return (
      <main className="project-detail-page min-h-[60vh] bg-[var(--site-bg)] px-4 py-12 text-center">
        <h1 className="text-xl font-black text-[var(--site-text)]">Không tìm thấy dự án</h1>
        <Link href="/" className="mt-4 inline-block text-sm font-bold text-[var(--site-primary)]">Quay lại trang chủ</Link>
      </main>
    );
  }

  return (
    <main className="project-detail-page bg-[var(--site-bg)] pb-28">

      <section className="project-detail-hero px-4 py-8 text-white">
        <nav className="mx-auto mb-5 max-w-6xl text-sm text-white/70" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">Dự án</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page" className="text-white">{candidate.name}</span>
        </nav>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[420px_1fr]">
          <div className="flex flex-col gap-3">
            <button
              ref={lightboxTriggerRef}
              type="button"
              onClick={() => handleOpenLightbox(activeImage || getCandidateImageUrl(candidate.imageUrl))}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-zoom-in relative group text-left"
              aria-label={`Phóng to ảnh dự án ${candidate.name}`}
            >
              <img 
                src={activeImage || getCandidateImageUrl(candidate.imageUrl)}
                alt={candidate.name} 
                className="aspect-[4/3] w-full object-cover transition duration-300 ease-in-out group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </button>
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allImages.map((imgUrl, index) => {
                  const isActive = (activeImage || getCandidateImageUrl(candidate.imageUrl)) === imgUrl;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`h-11 w-14 rounded-lg overflow-hidden border-2 bg-white/5 transition duration-150 active:scale-95 shrink-0 ${
                        isActive ? 'border-[#79d4bd] scale-105 shadow-md shadow-[#79d4bd]/20' : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img src={imgUrl} alt={`${candidate.name} image ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Hồ sơ dự án HUIT Startup 2026</p>
            <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">{candidate.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/75">{candidate.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ['Mã dự án', candidate.sbd],
                ['Bảng thi', candidate.contestTableLabel || candidate.contestTable || 'Chưa phân bảng'],
                ['Vòng hiện tại', candidate.currentRound || 'Vòng loại'],
                ['Điểm bình chọn', candidate.votes.toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 relative overflow-hidden">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{label}</p>
                  <p className="mt-1 text-sm font-black">{value}</p>
                  {label === 'Điểm bình chọn' && settings?.activeVotingPromotion && (
                    <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-300 animate-pulse">
                      x{settings.activeVotingPromotion.multiplier}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="rounded-[18px] border border-[var(--site-line)] bg-[var(--site-card)] p-5 shadow-sm">
            <h2 className="text-lg font-black text-[var(--site-text)]">Thông tin nhóm dự thi</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Tên nhóm', candidate.teamName || 'Chưa cập nhật'],
                ['Trưởng nhóm', candidate.leaderName || 'Chưa cập nhật'],
                ['Đơn vị / trường', candidate.representativeSchool || 'Chưa cập nhật'],
                ['Lĩnh vực', candidate.sector || 'Chưa cập nhật'],
                ['Email liên hệ', candidate.leaderEmail || 'Chưa cập nhật'],
                ['Số điện thoại', candidate.leaderPhone || 'Chưa cập nhật'],
                ['Cố vấn', candidate.advisorName || 'Chưa cập nhật'],
                ['Trạng thái', candidate.status || 'Đang cập nhật'],
                ['Thành viên nhóm', candidate.members || 'Chưa cập nhật'],
              ].map(([label, value]) => (
                <div key={label} className={`rounded-xl bg-[var(--site-soft)] p-3 ${label === 'Thành viên nhóm' || label === 'Đơn vị / trường' ? 'sm:col-span-2' : ''}`}>
                  <p className="text-[13px] font-semibold text-[var(--site-muted)]">{label}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--site-text)] whitespace-pre-line">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-[var(--site-line)] bg-[var(--site-card)] p-5 shadow-sm">
            <h2 className="text-lg font-black text-[var(--site-text)]">Thuyết minh dự án</h2>
            <p className="mt-3 whitespace-pre-line text-base leading-7 text-[var(--site-muted)]">{candidate.biography || candidate.description}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-[var(--site-line)] bg-[var(--site-card)] p-5 shadow-sm">
              <h3 className="font-black text-[var(--site-text)]">Nhu cầu hỗ trợ</h3>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-[var(--site-muted)]">{candidate.supportNeeds || 'Chưa cập nhật nhu cầu hỗ trợ.'}</p>
            </div>
            <div className="rounded-[18px] border border-[var(--site-line)] bg-[var(--site-card)] p-5 shadow-sm">
              <h3 className="font-black text-[var(--site-text)]">Kỳ vọng sau cuộc thi</h3>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-[var(--site-muted)]">{candidate.expectations || 'Chưa cập nhật kỳ vọng.'}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[18px] border border-[var(--site-line)] bg-[var(--site-card)] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--site-primary)]">Thí sinh được yêu thích nhất</p>
            <h2 className="mt-2 text-lg font-black text-[var(--site-text)]">Bình chọn cho dự án</h2>
            <div className="mt-4 rounded-xl bg-[var(--site-soft)] p-4">
              <p className="text-sm font-black text-[var(--site-text)]">Mỗi lần bình chọn cộng 1 lượt cho dự án.</p>
              <p className="mt-2 text-[13px] leading-5 text-[var(--site-muted)]">
                Mỗi tài khoản có 2 lượt miễn phí mỗi ngày cho toàn bộ dự án. Dùng hết 2 lượt thì không thể vote cho dự án khác cho đến ngày hôm sau.
              </p>
            </div>
            <button
              onClick={handleVote}
              disabled={!isGateOpen}
              className={`mt-4 h-11 w-full rounded-lg text-sm font-black transition-all duration-200 shadow ${isGateOpen
                  ? 'bg-gradient-to-r from-primary to-secondary dark:bg-neutral-white dark:from-transparent dark:to-transparent text-white dark:text-primary hover:opacity-90 active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }`}
            >
              {isGateOpen ? 'Bình chọn miễn phí' : 'Cổng bình chọn đã đóng'}
            </button>
            {!currentUser && (
              <Link href={`/dang-nhap?redirect=/thi-sinh/${candidate.sbd}`} className="mt-3 block text-center text-sm font-bold text-[var(--site-primary)]">
                Đăng nhập ngay để dùng lượt miễn phí
              </Link>
            )}
          </div>

          <button onClick={copyLink} className="h-11 w-full rounded-xl border border-[var(--site-line)] bg-[var(--site-card)] text-sm font-bold text-[var(--site-text)] hover:border-[var(--site-primary)]">
            Sao chép liên kết dự án
          </button>
        </aside>
      </section>

      {isLightboxOpen && (
        <div 
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Bộ sưu tập ảnh dự án ${candidate.name}`}
          className="fixed inset-0 z-[1200] flex flex-col items-center justify-center bg-black/80 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            ref={lightboxCloseRef}
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/25 text-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            title="Đóng (ESC)"
            aria-label="Đóng bộ sưu tập ảnh"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Left Arrow */}
          {allImages.length > 1 && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 z-50 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/25 text-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
              title="Ảnh trước (Mũi tên trái)"
              aria-label="Xem ảnh trước"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Large Image */}
          <div 
            className="relative flex items-center justify-center max-w-[90vw] max-h-[80vh] p-2"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          >
            <img 
              src={allImages[lightboxIndex]} 
              alt={`${candidate.name} - Ảnh ${lightboxIndex + 1}`} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none animate-in zoom-in-95 duration-200" 
            />
          </div>

          {/* Right Arrow */}
          {allImages.length > 1 && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 z-50 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/25 text-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
              title="Ảnh tiếp theo (Mũi tên phải)"
              aria-label="Xem ảnh tiếp theo"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Image index display / caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-center border border-white/10">
            <p className="text-xs font-bold text-white/90">
              Hình ảnh {lightboxIndex + 1} / {allImages.length}
            </p>
          </div>
        </div>
      )}

      {isVoteModalOpen && (
        <VoteModal
          candidate={candidate}
          onClose={() => setIsVoteModalOpen(false)}
          onSuccess={(updatedCandidate) => {
            setCandidate(updatedCandidate);
          }}
        />
      )}
    </main>
  );
}

