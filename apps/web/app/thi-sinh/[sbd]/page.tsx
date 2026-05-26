'use client';

import React, { useState, useEffect } from 'react';
import { Candidate } from '@huitfest/shared';
import { useParams } from 'next/navigation';

const LOCAL_MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    sbd: '085',
    name: 'Nguyễn Thanh Tân',
    votes: 106100,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Thí sinh tài năng của HUIT\'s Iconic 2024.',
    biography: 'Nguyễn Thanh Tân là sinh viên khoa Công nghệ thông tin của HUIT. Anh đam mê lập trình và hoạt động nghệ thuật, mong muốn mang lại nguồn năng lượng tích cực.',
  },
  {
    id: '2',
    sbd: '089',
    name: 'Nguyễn Đình Tú',
    votes: 62215,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Chiến binh bản lĩnh mang màu sắc nhiệt huyết.',
    biography: 'Nguyễn Đình Tú hiện là sinh viên khoa Quản trị kinh doanh. Với vẻ ngoài điển trai và năng lực giao tiếp xuất sắc, Tú muốn chinh phục thử thách.',
  },
  {
    id: '3',
    sbd: '024',
    name: 'Lê Ngọc Yến Vy',
    votes: 22800,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Đại diện cho vẻ đẹp tri thức và sự duyên dáng.',
    biography: 'Lê Ngọc Yến Vy, sinh viên khoa Ngoại ngữ. Cô thông thạo 2 ngoại ngữ và tích cực tham gia các phong trào sinh viên của trường.',
  },
  {
    id: '4',
    sbd: '096',
    name: 'Võ Bá Thiện',
    votes: 20590,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Nụ cười tỏa nắng cùng trái tim ấm áp.',
    biography: 'Võ Bá Thiện đại diện khoa Công nghệ thực phẩm. Thiện yêu thích thể thao, đặc biệt là bóng rổ, luôn hướng tới phong cách năng động.',
  },
  {
    id: '5',
    sbd: '018',
    name: 'Trần Tuyết Ngân',
    votes: 16070,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Gương mặt cá tính đầy bứt phá.',
    biography: 'Trần Tuyết Ngân là sinh viên khoa Tài chính ngân hàng. Ngân có năng khiếu nhảy hiện đại và khả năng lãnh đạo nhóm xuất sắc.',
  },
  {
    id: '6',
    sbd: '095',
    name: 'Nguyễn Thị Cẩm Thanh',
    votes: 8410,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Sự kết hợp hoàn hảo giữa năng động và dịu dàng.',
    biography: 'Nguyễn Thị Cẩm Thanh đến từ khoa Luật. Thanh mong muốn dùng tri thức pháp luật để đóng góp cho cộng đồng sinh viên.',
  },
];

export default function CandidateDetailPage() {
  const params = useParams();
  const sbd = params.sbd as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCandidate() {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/candidates/${sbd}`);
        if (res.ok) {
          const data = await res.json();
          setCandidate(data);
          return;
        }
      } catch (err) {
        console.log('NestJS Backend API offline, using local mock candidate detail.');
      }
      
      // Local fallback
      const found = LOCAL_MOCK_CANDIDATES.find(c => c.sbd === sbd);
      setCandidate(found || null);
      setIsLoading(false);
    }
    loadCandidate();
  }, [sbd]);

  const handleVote = async () => {
    if (!candidate) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${candidate.sbd}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0987654321' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidate(updated);
        alert(`Bình chọn thành công cho ${updated.name}!`);
        return;
      }
    } catch (err) {
      console.log('NestJS Backend API offline, executing client-side mock vote.');
    }

    setCandidate(prev => prev ? { ...prev, votes: prev.votes + 1 } : null);
    alert(`Bình chọn offline thành công cho ${candidate.name}!`);
  };

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center items-center py-20 text-white/60">
        <h3 className="text-[20px] font-bold">Không tìm thấy thí sinh</h3>
        <a href="/" className="text-secondary hover:underline mt-4 text-[14px]">Quay lại trang chủ</a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto px-6 py-16 flex flex-col md:flex-row gap-12 items-center md:items-start">
      
      {/* Left Column: Photo */}
      <div className="w-full max-w-[360px] aspect-[286/354] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl flex-shrink-0">
        <img
          alt={candidate.name}
          src={candidate.imageUrl}
          className="object-cover object-top w-full h-full"
        />
      </div>

      {/* Right Column: Details */}
      <div className="flex-1 flex flex-col space-y-6">
        <div>
          <span className="text-[14px] text-secondary font-bold tracking-widest uppercase">Thí sinh tham dự</span>
          <h1 className="text-[32px] sm:text-[42px] font-extrabold text-white leading-tight mt-1">
            {candidate.name}
          </h1>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-2 rounded-[12px] bg-[rgba(255,255,255,0.04)] border border-white/5 flex items-center gap-2">
            <span className="text-[13px] text-white/60 font-medium">Số báo danh (SBD):</span>
            <span className="text-[15px] text-secondary font-extrabold">{candidate.sbd}</span>
          </div>
          <div className="px-4 py-2 rounded-[12px] bg-[rgba(255,255,255,0.04)] border border-white/5 flex items-center gap-2">
            <span className="text-[13px] text-white/60 font-medium">Số lượt bình chọn:</span>
            <span className="text-[15px] text-white font-extrabold">{candidate.votes.toLocaleString()}</span>
          </div>
        </div>

        {/* Description & Biography */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-[18px] font-bold text-white uppercase tracking-wider">Tiểu sử &amp; Thông tin</h3>
          <p className="text-[15px] text-white/80 leading-relaxed bg-[rgba(222,222,222,0.04)] border border-white/5 p-5 rounded-[18px]">
            {candidate.biography || candidate.description}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleVote}
            className="flex-1 max-w-[200px] py-3 bg-primary hover:bg-[#1E3A8A] border border-[#0A2FFF] rounded-[12px] text-white font-bold tracking-wide transition-all shadow-md text-center active:scale-[0.98]"
          >
            Bình chọn ngay
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-white/20 hover:border-white/40 rounded-[12px] text-white/80 hover:text-white transition-all text-center text-[15px] font-medium"
          >
            Quay lại
          </a>
        </div>

      </div>

    </div>
  );
}
