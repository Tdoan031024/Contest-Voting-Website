'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Candidate, VotePackage, WebUser } from '@huitfest/shared';
import { apiUrl } from './api';

interface VoteModalProps {
  candidate: Candidate;
  onClose: () => void;
  onSuccess?: (updatedCandidate: Candidate, points: number) => void;
  initialPackageId?: string;
}

export default function VoteModal({ candidate, onClose, onSuccess, initialPackageId }: VoteModalProps) {
  const [packages, setPackages] = useState<VotePackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || '');
  const [currentUser, setCurrentUser] = useState<WebUser | null>(null);
  const [freeQuota, setFreeQuota] = useState<{ remaining: number; limit: number }>({ remaining: 0, limit: 1 });
  const [settings, setSettings] = useState<any>(null);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(true);
  const [step, setStep] = useState<'select' | 'qr' | 'success'>('select');
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);

  // Load packages, settings, user, and free quota
  useEffect(() => {
    // Get current user from localStorage
    const rawUser = localStorage.getItem('huit_web_user');
    let user: WebUser | null = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser);
        setCurrentUser(user);
      } catch (e) {
        console.error(e);
      }
    }

    async function loadData() {
      try {
        const [packagesRes, settingsRes] = await Promise.all([
          fetch(apiUrl('/api/voting/packages')),
          fetch(apiUrl('/api/settings')),
        ]);

        if (packagesRes.ok) {
          const pkgs = await packagesRes.json();
          setPackages(pkgs);
          if (pkgs.length > 0) {
            setSelectedPackageId(initialPackageId || pkgs[0].id);
          }
        }

        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }

        if (user && user.id) {
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

  const selectedPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  const handleVoteSubmit = async () => {
    if (!selectedPackage) return;
    if (!agreeToTerms) {
      setErrorMessage('Bạn cần đồng ý với các điều khoản sử dụng để tiếp tục.');
      return;
    }

    // Check if free and quota remaining is 0
    if (selectedPackage.packageType === 'FREE' && freeQuota.remaining <= 0) {
      setErrorMessage('Tài khoản đã sử dụng hết lượt bình chọn miễn phí trong ngày.');
      return;
    }

    // If it's a paid package and we are not in the QR step yet, transition to QR step
    if (selectedPackage.packageType === 'PAID' && step === 'select') {
      setStep('qr');
      setErrorMessage('');
      return;
    }

    setIsVoting(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('huit_web_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(apiUrl(`/api/voting/candidates/${candidate.sbd}`), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          packageId: selectedPackage.id,
          userId: currentUser?.id,
          phone: currentUser?.phone || 'WEB_USER',
          eventId: 'thi-sinh-duoc-yeu-thich-nhat',
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || 'Không thể thực hiện bình chọn.');

      // Refresh free quota if we voted free
      if (selectedPackage.packageType === 'FREE' && currentUser?.id) {
        const quotaRes = await fetch(apiUrl(`/api/voting/free-quota/${currentUser.id}`));
        if (quotaRes.ok) {
          setFreeQuota(await quotaRes.json());
        }
      }

      if (onSuccess) {
        onSuccess(data.candidate, selectedPackage.points);
      }

      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi gửi bình chọn.');
    } finally {
      setIsVoting(false);
    }
  };

  const formattedPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  // VietQR generation url for Sepay
  const qrUrl = useMemo(() => {
    if (!settings || !selectedPackage) return '';
    const bankName = settings.sepayBankName || 'VietinBank';
    const accountNo = settings.sepayAccountNo || '110632156888';
    const accountName = encodeURIComponent(settings.sepayAccountName || 'TRUONG DAI HOC CONG THUONG TP.HCM');
    const amount = selectedPackage.price;
    // Syntax format: PREFIX + CANDIDATE_SBD + USER_ID (if logged in)
    const memo = `${settings.sepayPrefix || 'HUIT'} ${candidate.sbd} ${currentUser?.id || 'GUEST'}`.toUpperCase();
    return `https://img.vietqr.io/image/${bankName}-${accountNo}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${accountName}`;
  }, [settings, selectedPackage, candidate.sbd, currentUser]);

  // Reset QR loading state when opening QR step or changing packages
  useEffect(() => {
    if (step === 'qr') {
      setIsQrLoading(true);
    }
  }, [step, qrUrl]);

  // Polling for paid transactions check
  useEffect(() => {
    if (step !== 'qr' || !selectedPackage || selectedPackage.packageType !== 'PAID') {
      return;
    }

    let isSubmitting = false;

    const interval = setInterval(async () => {
      if (isSubmitting) return;
      isSubmitting = true;

      try {
        const token = localStorage.getItem('huit_web_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(apiUrl(`/api/voting/candidates/${candidate.sbd}`), {
          method: 'POST',
          headers,
          body: JSON.stringify({
            packageId: selectedPackage.id,
            userId: currentUser?.id,
            phone: currentUser?.phone || 'WEB_USER',
            eventId: 'thi-sinh-duoc-yeu-thich-nhat',
          }),
        });

        const data = await res.json().catch(() => null);
        if (res.ok) {
          clearInterval(interval);
          if (onSuccess) {
            onSuccess(data.candidate, selectedPackage.points);
          }
          setStep('success');
        } else {
          console.log('Polling payment status...', data?.message);
        }
      } catch (err) {
        console.error('Polling error', err);
      } finally {
        isSubmitting = false;
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [step, selectedPackage, candidate.sbd, currentUser, onSuccess]);

  const handleLoginRedirect = () => {
    window.location.href = `/dang-nhap?redirect=${encodeURIComponent(window.location.pathname)}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-[1040px] rounded-3xl bg-[#111625] border border-white/10 text-white shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden max-h-[95vh] md:max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <button 
            onClick={() => {
              if (step === 'qr') setStep('select');
              else onClose();
            }}
            className="flex items-center text-white/70 hover:text-white transition gap-1 focus:outline-none"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="text-sm font-bold">Quay lại</span>
          </button>
          
          <h2 className="text-lg font-black tracking-wide">Bình chọn</h2>

          <button 
            onClick={onClose}
            className="rounded-full bg-white/5 hover:bg-white/10 p-1.5 text-white/70 hover:text-white transition focus:outline-none"
            aria-label="Đóng"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step !== 'success' && (
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-400">
                Sự kiện: {settings?.eventTitle || 'Thí sinh được yêu thích nhất'}
              </p>
            </div>
          )}

          {step === 'select' && (
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              {/* Left Column: Candidate info & packages */}
              <div className="space-y-5">
                {/* Candidate card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/10">
                    <img src={candidate.imageUrl || '/duan/anhmauduan.png'} className="h-full w-full object-cover" alt={candidate.name} />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="font-extrabold text-[16px] text-white truncate">{candidate.name}</h3>
                    <p className="text-xs font-bold text-white/50 mt-1">Mã dự án: {candidate.sbd}</p>
                  </div>
                </div>

                {/* Packages grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => {
                          setSelectedPackageId(pkg.id);
                          setErrorMessage('');
                        }}
                        className={`rounded-2xl border p-4 text-left transition relative select-none flex flex-col justify-between h-24 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <p className="text-xs font-black text-blue-400">{pkg.points.toLocaleString()} điểm</p>
                        <p className="text-[14px] font-bold text-white/80 mt-1">
                          {pkg.price === 0 ? 'Miễn phí' : formattedPrice(pkg.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Checkout info / Login wall */}
              <div className="flex flex-col h-full justify-between">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 text-left">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 border-b border-white/5 pb-2">Thông tin</h4>

                  {/* Case A: Not logged in */}
                  {!currentUser ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs leading-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        <span>Bạn cần đăng nhập để sử dụng tính năng này. Mỗi tài khoản sẽ nhận được 1 số lượt bình chọn miễn phí hàng ngày.</span>
                      </div>
                      <button
                        onClick={handleLoginRedirect}
                        className="w-full h-11 bg-white text-neutral-900 font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-white/95 transition flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        Đăng nhập ngay
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </button>
                    </div>
                  ) : (
                    /* Case B & C: Logged in */
                    <div className="space-y-4">
                      {/* Sub-Case B: Selected FREE package */}
                      {selectedPackage?.packageType === 'FREE' && (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs leading-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            <span className="font-bold">{freeQuota.remaining}/{freeQuota.limit} lượt bình chọn miễn phí còn lại</span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-relaxed pl-1">Lượt bình chọn miễn phí cập nhật vào 00:00 (GMT+7)</p>
                        </div>
                      )}

                      {/* Sub-Case C: Selected PAID package */}
                      {selectedPackage?.packageType === 'PAID' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 select-none">
                            <div className="flex items-center gap-3">
                              <input 
                                type="radio" 
                                id="payment_sepay" 
                                name="payment_method" 
                                defaultChecked 
                                className="accent-blue-500 h-4 w-4"
                              />
                              <label htmlFor="payment_sepay" className="text-xs font-bold text-white/90">Chuyển khoản QR (Sepay)</label>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect x="2" y="2" width="20" height="20" rx="3" /><rect x="6" y="6" width="4" height="4" /><rect x="14" y="6" width="4" height="4" /><rect x="6" y="14" width="4" height="4" /><rect x="14" y="14" width="4" height="4" /></svg>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/60 leading-relaxed">
                            Quét mã QR thanh toán ngân hàng tự động. Hệ thống sẽ nhận diện cú pháp chuyển khoản và ghi nhận điểm bình chọn sau vài giây.
                          </div>
                        </div>
                      )}

                      {/* Checkbox agreement */}
                      <label className="flex items-start gap-3 mt-4 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="mt-1 accent-blue-500 h-4 w-4 shrink-0 rounded"
                        />
                        <span className="text-[11px] leading-5 text-white/60 text-justify">
                          Bằng việc thanh toán, tôi đồng ý với các nội dung trong{' '}
                          <a href="/the-le" target="_blank" className="text-blue-400 hover:underline font-bold">Điều khoản sử dụng</a>,{' '}
                          <span className="font-medium text-white/70">Điều kiện vận chuyển và giao nhận</span>,{' '}
                          <span className="font-medium text-white/70">Chính sách đổi trả và hoàn tiền</span> của HUIT Startup. Tôi cũng xác nhận đã đọc{' '}
                          <span className="font-medium text-white/70">Chính sách quyền riêng tư</span>.
                        </span>
                      </label>

                      {errorMessage && (
                        <div className="p-3.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl leading-relaxed">
                          {errorMessage}
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={handleVoteSubmit}
                        disabled={isVoting || !agreeToTerms || (selectedPackage?.packageType === 'FREE' && freeQuota.remaining <= 0)}
                        className={`w-full h-11 bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:opacity-95 transition flex items-center justify-center gap-2 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isVoting ? 'Đang xử lý...' : selectedPackage?.packageType === 'FREE' ? 'Bình chọn miễn phí' : 'Thanh toán & Bình chọn'}
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtotal */}
                <div className="border-t border-white/5 pt-4 flex justify-end items-center px-2 mt-4 text-left">
                  <div>
                    <span className={`text-xl font-black ${selectedPackage?.price === 0 ? 'text-blue-400' : 'text-[#FDE047]'}`}>
                      {selectedPackage ? formattedPrice(selectedPackage.price) : 'Miễn phí'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'qr' && selectedPackage && (
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
              {/* QR Image and copy instruction */}
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center min-h-[300px] w-full max-w-[340px] relative overflow-hidden">
                  {isQrLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl p-4">
                      {/* Spinner */}
                      <div className="h-10 w-10 border-4 border-[#111625]/20 border-t-[#0A2FFF] rounded-full animate-spin"></div>
                      <p className="mt-3 text-xs font-semibold text-neutral-600 animate-pulse">Đang tạo mã QR thanh toán...</p>
                    </div>
                  )}
                  <img 
                    src={qrUrl} 
                    className={`w-full h-auto object-contain rounded-2xl transition-opacity duration-300 ${isQrLoading ? 'opacity-0' : 'opacity-100'}`} 
                    alt="Sepay QR Code"
                    onLoad={() => setIsQrLoading(false)}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-white/50">Mã QR tạo tự động qua VietQR/Sepay</p>
                  <p className="text-[13px] font-bold text-[#FDE047]">Số tiền: {formattedPrice(selectedPackage.price)}</p>
                </div>
              </div>

              {/* Instructions and complete confirmation */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-5 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 border-b border-white/5 pb-2">Hướng dẫn thanh toán</h4>
                
                <div className="space-y-4 text-xs leading-6 text-white/80">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 mt-0.5">1</span>
                    <p>Mở ứng dụng ngân hàng và <b>quét mã QR</b> hiển thị bên cạnh.</p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 mt-0.5">2</span>
                    <p>Đảm bảo chuyển khoản <b>đúng số tiền</b> và giữ nguyên <b>nội dung chuyển khoản</b> tự động để hệ thống ghi nhận.</p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 mt-0.5">3</span>
                    <p>Hệ thống tự động kiểm tra giao dịch và cộng điểm bình chọn sau khi nhận được thanh toán thành công (thông thường từ 15-30 giây).</p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-400 py-2 border-t border-white/5 mt-2">
                    <div className="h-4 w-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="animate-pulse">Đang chờ hệ thống kiểm tra giao dịch tự động...</span>
                  </div>
                  <button
                    onClick={() => setStep('select')}
                    className="w-full h-11 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98]"
                  >
                    Quay lại chọn gói khác
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && selectedPackage && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in zoom-in-95 duration-300">
              {/* Success checkmark */}
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>

              {/* Added points display */}
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-[#FDE047] drop-shadow-[0_0_15px_rgba(253,224,71,0.3)]">
                  +{selectedPackage.points.toLocaleString()} điểm
                </h3>
                <p className="text-sm font-bold text-white/90">Bình chọn thành công</p>
              </div>

              {/* Candidate Box */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 w-full max-w-sm text-left">
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/10">
                  <img src={candidate.imageUrl || '/duan/anhmauduan.png'} className="h-full w-full object-cover" alt={candidate.name} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-[14px] text-white truncate">{candidate.name}</h4>
                  <p className="text-[11px] font-bold text-white/50 mt-1">Mã dự án: {candidate.sbd}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-white/70 max-w-md">
                  Cảm ơn bạn đã ủng hộ và bình chọn cho dự án khởi nghiệp sáng tạo của chúng tôi!
                </p>
              </div>

              <button
                onClick={() => {
                  setStep('select');
                  onClose();
                }}
                className="h-11 px-8 bg-white/10 hover:bg-white/15 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98]"
              >
                Bình chọn tiếp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
