'use client';

import React, { useState, useEffect } from 'react';
import { Candidate } from '@huitfest/shared';

const LOCAL_MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    sbd: '085',
    name: 'Nguyễn Thanh Tân',
    votes: 106100,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=380',
    description: 'Thí sinh tài năng của HUIT\'s Iconic 2024.',
  },
  {
    id: '2',
    sbd: '089',
    name: 'Nguyễn Đình Tú',
    votes: 62215,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=380',
    description: 'Chiến binh bản lĩnh mang màu sắc nhiệt huyết.',
  },
  {
    id: '3',
    sbd: '024',
    name: 'Lê Ngọc Yến Vy',
    votes: 22800,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=380',
    description: 'Đại diện cho vẻ đẹp tri thức và sự duyên dáng.',
  },
  {
    id: '4',
    sbd: '096',
    name: 'Võ Bá Thiện',
    votes: 20590,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=380',
    description: 'Nụ cười tỏa nắng cùng trái tim ấm áp.',
  },
  {
    id: '5',
    sbd: '018',
    name: 'Trần Tuyết Ngân',
    votes: 16070,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=380',
    description: 'Gương mặt cá tính đầy bứt phá.',
  },
  {
    id: '6',
    sbd: '095',
    name: 'Nguyễn Thị Cẩm Thanh',
    votes: 8410,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=380',
    description: 'Sự kết hợp hoàn hảo giữa năng động và dịu dàng.',
  },
];

export default function HomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(LOCAL_MOCK_CANDIDATES);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Try to load candidates from NestJS API
    async function loadCandidates() {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/candidates');
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
  }, []);

  const handleVote = async (sbd: string) => {
    // Try to vote via NestJS API
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${sbd}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0987654321' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidates(prev => prev.map(c => c.sbd === sbd ? updated : c));
        alert(`Bình chọn thành công cho ${updated.name}!`);
        return;
      }
    } catch (err) {
      console.log('NestJS Backend API offline, executing client-side mock vote.');
    }

    // Client-side local state vote (fallback)
    setCandidates(prev =>
      prev.map(c => c.sbd === sbd ? { ...c, votes: c.votes + 1 } : c)
    );
    const candidate = candidates.find(c => c.sbd === sbd);
    alert(`Bình chọn offline thành công cho ${candidate?.name}!`);
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.sbd.includes(search)
  );

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Banner / Title Section */}
      <section className="w-full text-center py-16 bg-[#0B1530] border-b border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A284F]/30 to-transparent pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-6 z-10 relative">
          <h1 className="text-[28px] sm:text-[48px] font-extrabold uppercase tracking-wide text-white">
            Danh sách thí sinh
          </h1>
          <p className="text-[16px] sm:text-[24px] text-secondary font-medium tracking-widest uppercase mt-2">
            HUIT's Iconic
          </p>

          {/* Search bar */}
          <div className="max-w-[500px] mx-auto mt-10">
            <div className="flex items-center space-x-3 rounded-full px-5 py-3 border border-white/10 bg-[#1D253E] h-[48px] sm:h-[54px] w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc SBD..."
                className="w-full bg-transparent focus:outline-none text-white placeholder-white/40 text-[15px]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Candidates Grid */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            Không tìm thấy thí sinh phù hợp
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {filteredCandidates.map(c => (
              <div key={c.id} className="w-full max-w-[320px] rounded-[24px] overflow-hidden bg-[rgba(222,222,222,0.06)] hover:bg-[rgba(222,222,222,0.12)] border border-white/5 hover:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                
                {/* Photo link */}
                <a href={`/thi-sinh/${c.sbd}`} className="block relative aspect-[286/354] w-full overflow-hidden group">
                  <img
                    alt={c.name}
                    src={c.imageUrl}
                    className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[12px] text-white/80 font-medium underline">Xem thông tin chi tiết</span>
                  </div>
                </a>

                {/* Body details */}
                <div className="p-4 flex flex-col space-y-4">
                  {/* SBD & Points Header */}
                  <div className="h-[38px] rounded-[12px] flex justify-between items-center px-4 bg-[rgba(255,255,255,0.04)] border border-white/5">
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-white/60">SBD:</span>
                      <span className="text-[14px] font-bold text-secondary">{c.sbd}</span>
                    </div>
                    <div className="h-[18px] w-[1px] bg-white/10"></div>
                    <span className="text-[14px] font-bold text-white">
                      {c.votes.toLocaleString()}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="h-[48px] flex items-center">
                    <h3 className="text-[18px] font-bold text-white leading-tight">
                      {c.name}
                    </h3>
                  </div>

                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(c.sbd)}
                    className="w-full py-2.5 bg-primary hover:bg-[#1E3A8A] border border-[#0A2FFF] rounded-[12px] text-white text-[15px] font-semibold tracking-wide transition-all shadow-md active:scale-[0.98]"
                  >
                    Bình chọn
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
