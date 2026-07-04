'use client';

import React, { useEffect, useState } from 'react';
import { Candidate, WebUser } from '@huitfest/shared';
import { apiUrl } from './api';

interface VoteModalProps {
  candidate: Candidate;
  onClose: () => void;
  onSuccess?: (updatedCandidate: Candidate, points: number) => void;
  initialPackageId?: string;
}

function getStoredUser(): WebUser | null {
  const rawUser = localStorage.getItem('huit_web_user');
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export default function VoteModal({ candidate, onClose, onSuccess }: VoteModalProps) {
  const [currentUser, setCurrentUser] = useState<WebUser | null>(null);
  const [freeQuota, setFreeQuota] = useState<{ remaining: number; limit: number }>({ remaining: 0, limit: 2 });
  const [settings, setSettings] = useState<any>(null);
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [isVoting, setIsVoting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);

    async function loadData() {
      try {
        const settingsRes = await fetch(apiUrl('/api/settings'));
        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }

        if (user?.id) {
          const quotaRes = await fetch(apiUrl(`/api/voting/free-quota/${user.id}`));
          if (quotaRes.ok) {
            setFreeQuota(await quotaRes.json());
          }
        }
      } catch (err) {
        console.error('Failed to load data for VoteModal', err);
      }
    }

    loadData();
  }, []);

  const handleLoginRedirect = () => {
    window.location.href = `/dang-nhap?redirect=${encodeURIComponent(window.location.pathname)}`;
  };

  const handleVoteSubmit = async () => {
    if (!currentUser?.id) {
      setErrorMessage('Bạn cần đăng nhập để bình chọn.');
      return;
    }

    if (freeQuota.remaining <= 0) {
      setErrorMessage('Bạn đã dùng hết 2 lượt bình chọn trong hôm nay.');
      return;
    }

    setIsVoting(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('huit_web_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(apiUrl(`/api/voting/candidates/${candidate.sbd}`), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: currentUser.id,
          eventId: 'thi-sinh-duoc-yeu-thich-nhat',
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || 'Không thể thực hiện bình chọn.');

      const quotaRes = await fetch(apiUrl(`/api/voting/free-quota/${currentUser.id}`));
      if (quotaRes.ok) {
        setFreeQuota(await quotaRes.json());
      }

      onSuccess?.(data.candidate, 1);
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi gửi bình chọn.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1105] flex items-center justify-center overflow-y-auto bg-[rgba(7,16,31,0.48)] p-3 backdrop-blur-md sm:p-4">
      <div
        className="my-auto w-full max-w-[760px] max-h-[calc(100vh-1.75rem)] overflow-hidden rounded-[24px] border border-[var(--site-line)] bg-[var(--site-card)] text-[var(--site-text)] shadow-[0_24px_90px_rgba(10,20,40,0.22)] sm:max-h-[calc(100vh-2rem)] sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-[var(--site-line)] px-5 py-4 sm:px-7">
          <button
            onClick={onClose}
            className="absolute left-5 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 rounded-full px-2 py-1 text-sm font-bold text-[var(--site-muted)] transition hover:text-[var(--site-text)] sm:left-7"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <h2 className="text-center text-xl font-bold tracking-normal text-[var(--site-text)] sm:text-[27px]">
            Bình chọn miễn phí
          </h2>

          <button
            onClick={onClose}
            className="absolute right-5 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--site-soft)] text-[var(--site-muted)] transition hover:bg-[var(--site-card-soft)] hover:text-[var(--site-text)] sm:right-7"
            aria-label="Đóng"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto p-3 sm:max-h-[calc(100vh-6.5rem)] sm:p-5">
          {step === 'confirm' && (
            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr] lg:gap-4">
              <section className="space-y-3">
                <div className="rounded-[22px] border border-[var(--site-line)] bg-[linear-gradient(180deg,var(--site-card-soft),var(--site-card))] p-3 shadow-sm sm:rounded-[24px] sm:p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--site-primary)]">
                    Sự kiện: {settings?.eventTitle || 'Thí sinh được yêu thích nhất'}
                  </p>

                  <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-start sm:gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border border-[var(--site-line)] bg-[var(--site-soft)] shadow-sm sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                      <img src={candidate.imageUrl || '/duan/anhmauduan.png'} alt={candidate.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[19px] font-bold leading-[1.3] text-[var(--site-text)] sm:text-[22px] lg:text-[25px]">
                        {candidate.name}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                        <p className="font-bold uppercase tracking-wide text-[var(--site-muted)]">
                          Mã dự án: <span className="text-[var(--site-text)]">{candidate.sbd}</span>
                        </p>
                        {candidate.contestTableLabel && (
                          <p className="font-bold uppercase tracking-wide text-[var(--site-muted)]">
                            Bảng thi: <span className="text-[var(--site-text)]">{candidate.contestTableLabel}</span>
                          </p>
                        )}
                      </div>
                      <p className="mt-3 text-[14px] leading-7 text-[var(--site-muted)]">
                        Mỗi lần xác nhận sẽ cộng <span className="font-black text-[var(--site-text)]">1 lượt bình chọn</span> cho dự án này.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-[color:color-mix(in_srgb,var(--site-primary)_22%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--site-primary)_10%,white),color-mix(in_srgb,var(--site-primary)_4%,var(--site-card)))] p-3 shadow-sm dark:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--site-primary)_16%,var(--site-card)),color-mix(in_srgb,var(--site-primary)_7%,var(--site-card)))] sm:rounded-[24px] sm:p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--site-primary)]">
                    Quy định hiện tại
                  </p>
                  <p className="mt-3 text-[14px] leading-7 text-[var(--site-text)] sm:text-[15px]">
                    Mỗi tài khoản có <span className="font-black">2 lượt miễn phí mỗi ngày</span> cho toàn bộ hệ thống.
                    Dùng hết 2 lượt thì không thể vote cho dự án khác cho đến ngày hôm sau.
                  </p>
                </div>
              </section>

              <aside className="space-y-3 lg:space-y-4">
                <div className="overflow-hidden rounded-[22px] border border-[var(--site-line)] bg-[var(--site-card-soft)] sm:rounded-[24px]">
                  <div className="border-b border-[var(--site-line)] bg-[var(--site-card)] px-5 py-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--site-primary)]">
                      Trạng thái tài khoản
                    </p>
                  </div>

                  <div className="p-5">
                    {!currentUser ? (
                      <div className="space-y-4">
                        <div className="rounded-[18px] border border-[var(--site-line)] bg-[var(--site-card)] p-4">
                          <p className="text-sm leading-7 text-[var(--site-muted)]">
                            Bạn cần đăng nhập để sử dụng lượt bình chọn miễn phí hằng ngày.
                          </p>
                        </div>

                        <button
                          onClick={handleLoginRedirect}
                          className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[var(--site-primary)] px-4 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--site-primary-hover)] active:scale-[0.98]"
                        >
                          Đăng nhập ngay
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-[20px] border border-[var(--site-line)] bg-[var(--site-card)] p-4">
                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--site-muted)]">
                            Lượt còn lại hôm nay
                          </p>
                          <div className="mt-3 flex items-end gap-2">
                            <span className="text-4xl font-black leading-none text-[var(--site-primary)]">
                              {freeQuota.remaining}
                            </span>
                            <span className="pb-1 text-sm font-bold text-[var(--site-muted)]">
                              / {freeQuota.limit} lượt
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[var(--site-muted)]">
                            Quota được làm mới vào ngày hôm sau. Mỗi lần bấm bình chọn sẽ trừ 1 lượt.
                          </p>
                        </div>

                        {errorMessage && (
                          <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-600 dark:text-red-300">
                            {errorMessage}
                          </div>
                        )}

                        <button
                          onClick={handleVoteSubmit}
                          disabled={isVoting || freeQuota.remaining <= 0}
                          className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] px-4 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isVoting ? 'Đang xử lý...' : 'Xác nhận bình chọn'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center sm:py-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div>
                <h3 className="text-4xl font-black tracking-tight text-[#F0B429]">+1 lượt</h3>
                <p className="mt-2 text-base font-bold text-[var(--site-text)]">Bình chọn thành công</p>
              </div>

              <div className="w-full max-w-[520px] rounded-[24px] border border-[var(--site-line)] bg-[var(--site-card-soft)] p-5 text-left shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[18px] border border-[var(--site-line)] bg-[var(--site-soft)]">
                    <img src={candidate.imageUrl || '/duan/anhmauduan.png'} alt={candidate.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-lg font-extrabold text-[var(--site-text)]">{candidate.name}</h4>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[var(--site-muted)]">Mã dự án: {candidate.sbd}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--site-muted)]">
                      Bạn còn <span className="font-black text-[var(--site-primary)]">{freeQuota.remaining}</span> / {freeQuota.limit} lượt trong hôm nay.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-12 rounded-[16px] bg-[var(--site-soft)] px-8 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--site-text)] transition hover:bg-[var(--site-card-soft)] active:scale-[0.98]"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
