'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Candidate, VotePackage, WebUser } from '@huitfest/shared';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAlert } from '../../AlertProvider';
import { apiUrl } from '../../api';

function formatMoney(value: number) {
  if (!value) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function getStoredUser(): WebUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('huit_web_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function CandidateDetailPage() {
  const { showAlert } = useAlert();
  const params = useParams();
  const sbd = params.sbd as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [packages, setPackages] = useState<VotePackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState('free-5');
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<WebUser | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setCurrentUser(getStoredUser());

    async function loadData() {
      setIsLoading(true);
      const [candidateRes, packageRes, settingsRes] = await Promise.all([
        fetch(apiUrl(`/api/candidates/${sbd}`)),
        fetch(apiUrl('/api/voting/packages')),
        fetch(apiUrl('/api/settings')),
      ]);

      if (candidateRes.ok) {
        const data = await candidateRes.json();
        setCandidate(data);
        if (data) {
          setActiveImage(data.imageUrl || '');
        }
      }
      if (packageRes.ok) {
        const data = await packageRes.json();
        setPackages(data);
        setSelectedPackageId(data[0]?.id || 'free-5');
      }
      if (settingsRes.ok) setSettings(await settingsRes.json());
      setIsLoading(false);
    }

    loadData().catch(() => setIsLoading(false));
  }, [sbd]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === selectedPackageId) || packages[0],
    [packages, selectedPackageId]
  );

  const showcaseUrls = useMemo(() => {
    if (!candidate || !candidate.showcaseImages) return [];
    return candidate.showcaseImages.split(',').map(url => url.trim()).filter(Boolean);
  }, [candidate?.showcaseImages]);

  const allImages = useMemo(() => {
    if (!candidate) return [];
    const list: string[] = [];
    if (candidate.imageUrl) list.push(candidate.imageUrl);
    showcaseUrls.forEach(url => {
      if (url && !list.includes(url)) {
        list.push(url);
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, allImages]);

  const handleVote = async () => {
    if (!candidate || !selectedPackage) return;
    if (!isGateOpen) {
      showAlert('Cổng bình chọn hiện đang đóng hoặc chưa đến thời gian mở cổng.', 'warning', 'Cổng bình chọn');
      return;
    }

    if (!currentUser) {
      showAlert('Bạn cần đăng nhập tài khoản khán giả trước khi thực hiện bình chọn.', 'info', 'Yêu cầu đăng nhập');
      window.location.href = `/dang-nhap?redirect=/thi-sinh/${candidate.sbd}`;
      return;
    }

    setIsVoting(true);
    try {
      const res = await fetch(apiUrl(`/api/voting/candidates/${candidate.sbd}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          userId: currentUser?.id,
          phone: currentUser?.phone,
          eventId: 'thi-sinh-duoc-yeu-thich-nhat',
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || 'Không thể bình chọn.');

      setCandidate(data.candidate);
      showAlert(
        `Đã cộng ${selectedPackage.points.toLocaleString()} điểm cho dự án ${data.candidate.name}.`,
        'success',
        selectedPackage.packageType === 'FREE' ? 'Bình chọn thành công' : 'Thanh toán thành công'
      );
    } catch (error: any) {
      showAlert(error.message || 'Không thể bình chọn.', 'error', 'Lỗi bình chọn');
    } finally {
      setIsVoting(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showAlert('Đã sao chép đường dẫn dự án.', 'success', 'Chia sẻ');
  };

  if (isLoading) {
    return <main className="min-h-[60vh] bg-[#f6faf8] px-4 py-12 text-center text-sm font-semibold text-[#52605b]">Đang tải hồ sơ dự án...</main>;
  }

  if (!candidate) {
    return (
      <main className="min-h-[60vh] bg-[#f6faf8] px-4 py-12 text-center">
        <h1 className="text-xl font-black text-[#123c34]">Không tìm thấy dự án</h1>
        <Link href="/" className="mt-4 inline-block text-sm font-bold text-[#0f766e]">Quay lại trang chủ</Link>
      </main>
    );
  }

  return (
    <main className="bg-[#f6faf8] pb-28">
      <section className="bg-[#123c34] px-4 py-8 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[420px_1fr]">
          <div className="flex flex-col gap-3">
            <div 
              onClick={() => handleOpenLightbox(activeImage || candidate.imageUrl)}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-zoom-in relative group"
              title="Click để phóng to hình ảnh"
            >
              <img 
                src={activeImage || candidate.imageUrl} 
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
            </div>
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allImages.map((imgUrl, index) => {
                  const isActive = (activeImage || candidate.imageUrl) === imgUrl;
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
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#79d4bd]">Hồ sơ dự án HUIT Startup 2026</p>
            <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">{candidate.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/75">{candidate.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ['Mã dự án', candidate.sbd],
                ['Bảng thi', candidate.contestTableLabel || candidate.contestTable || 'Chưa phân bảng'],
                ['Vòng hiện tại', candidate.currentRound || 'Vòng loại'],
                ['Điểm bình chọn', candidate.votes.toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{label}</p>
                  <p className="mt-1 text-sm font-black">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="rounded-xl border border-[#dce5e1] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-[#123c34]">Thông tin nhóm dự thi</h2>
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
                <div key={label} className={`rounded-lg bg-[#fbfdfc] p-3 ${label === 'Thành viên nhóm' ? 'sm:col-span-2' : ''}`}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85]">{label}</p>
                  <p className="mt-1 text-sm font-bold text-[#123c34] whitespace-pre-line">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#dce5e1] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-[#123c34]">Thuyết minh dự án</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#52605b]">{candidate.biography || candidate.description}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-[#dce5e1] bg-white p-5 shadow-sm">
              <h3 className="font-black text-[#123c34]">Nhu cầu hỗ trợ</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#52605b]">{candidate.supportNeeds || 'Chưa cập nhật nhu cầu hỗ trợ.'}</p>
            </div>
            <div className="rounded-xl border border-[#dce5e1] bg-white p-5 shadow-sm">
              <h3 className="font-black text-[#123c34]">Kỳ vọng sau cuộc thi</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#52605b]">{candidate.expectations || 'Chưa cập nhật kỳ vọng.'}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-[#dce5e1] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">Thí sinh được yêu thích nhất</p>
            <h2 className="mt-2 text-lg font-black text-[#123c34]">Bình chọn cho dự án</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {packages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPackageId(item.id)}
                  className={`rounded-lg border p-3 text-left transition ${selectedPackageId === item.id ? 'border-[#e45136] bg-[#fff5f2]' : 'border-[#dce5e1] bg-[#fbfdfc] hover:border-[#0f766e]'}`}
                >
                  <p className="text-sm font-black text-[#123c34]">{item.points.toLocaleString()} điểm</p>
                  <p className="mt-1 text-xs font-bold text-[#e45136]">{formatMoney(item.price)}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-[#fbfdfc] p-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-[#52605b]">Thành tiền</span>
                <span className="font-black text-[#123c34]">{formatMoney(selectedPackage?.price || 0)}</span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[#7a8b85]">Giá hiển thị đã bao gồm VAT 10%. Gói miễn phí yêu cầu đăng nhập và được cấp theo ngày cho mỗi tài khoản.</p>
              {selectedPackage?.packageType === 'PAID' && (
                <div className="mt-3 pt-3 border-t border-[#dce5e1] flex items-center gap-2 text-[11px] text-[#0f766e] font-bold select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="3" />
                    <rect x="6" y="6" width="4" height="4" />
                    <rect x="14" y="6" width="4" height="4" />
                    <rect x="6" y="14" width="4" height="4" />
                    <rect x="14" y="14" width="4" height="4" />
                  </svg>
                  <span>Chuyển khoản QR tự động qua cổng Sepay</span>
                </div>
              )}
            </div>
            <button onClick={handleVote} disabled={isVoting || !isGateOpen} className="mt-4 h-11 w-full rounded-lg bg-[#e45136] text-sm font-black text-white shadow transition hover:bg-[#c83f28] disabled:cursor-not-allowed disabled:opacity-60 animate-all duration-300">
              {isVoting ? 'Đang xử lý...' : selectedPackage?.packageType === 'FREE' ? 'Bình chọn miễn phí' : 'Thanh toán QR (Sepay) & Bình chọn'}
            </button>
            {!currentUser && selectedPackage?.packageType === 'FREE' && (
              <Link href={`/dang-nhap?redirect=/thi-sinh/${candidate.sbd}`} className="mt-3 block text-center text-xs font-bold text-[#0f766e]">
                Đăng nhập ngay để dùng lượt miễn phí
              </Link>
            )}
          </div>

          <button onClick={copyLink} className="h-11 w-full rounded-lg border border-[#dce5e1] bg-white text-sm font-bold text-[#123c34] hover:border-[#0f766e]">
            Sao chép liên kết dự án
          </button>
        </aside>
      </section>

      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 hover:bg-white/25 p-2.5 text-white transition duration-200 focus:outline-none"
            title="Đóng (ESC)"
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
              className="absolute left-4 z-50 rounded-full bg-white/10 hover:bg-white/25 p-3 text-white transition duration-200 focus:outline-none active:scale-95"
              title="Ảnh trước (Mũi tên trái)"
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
              className="absolute right-4 z-50 rounded-full bg-white/10 hover:bg-white/25 p-3 text-white transition duration-200 focus:outline-none active:scale-95"
              title="Ảnh tiếp theo (Mũi tên phải)"
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
    </main>
  );
}
