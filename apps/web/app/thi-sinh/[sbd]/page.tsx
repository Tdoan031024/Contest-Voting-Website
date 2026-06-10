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

  useEffect(() => {
    setCurrentUser(getStoredUser());

    async function loadData() {
      setIsLoading(true);
      const [candidateRes, packageRes, settingsRes] = await Promise.all([
        fetch(apiUrl(`/api/candidates/${sbd}`)),
        fetch(apiUrl('/api/voting/packages')),
        fetch(apiUrl('/api/settings')),
      ]);

      if (candidateRes.ok) setCandidate(await candidateRes.json());
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

  const isGateOpen = useMemo(() => {
    if (!settings) return true;
    if (!settings.isGateOpen) return false;
    const now = new Date();
    const start = new Date(settings.startDate);
    const end = new Date(settings.endDate);
    return now >= start && now <= end;
  }, [settings]);

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
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img src={candidate.imageUrl} alt={candidate.name} className="aspect-[4/3] w-full object-cover" />
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
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-[#fbfdfc] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85]">{label}</p>
                  <p className="mt-1 text-sm font-bold text-[#123c34]">{value}</p>
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
            </div>
            <button onClick={handleVote} disabled={isVoting || !isGateOpen} className="mt-4 h-11 w-full rounded-lg bg-[#e45136] text-sm font-black text-white shadow transition hover:bg-[#c83f28] disabled:cursor-not-allowed disabled:opacity-60">
              {isVoting ? 'Đang xử lý...' : selectedPackage?.packageType === 'FREE' ? 'Bình chọn miễn phí' : 'Thanh toán và bình chọn'}
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
    </main>
  );
}
