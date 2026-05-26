'use client';

import React, { useState, useEffect } from 'react';
import { Candidate } from '@huitfest/shared';

const LOCAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Nguyễn Thanh Tân', votes: 106100, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150', description: '' },
  { id: '2', sbd: '089', name: 'Nguyễn Đình Tú', votes: 62215, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150', description: '' },
  { id: '3', sbd: '024', name: 'Lê Ngọc Yến Vy', votes: 22800, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', description: '' },
  { id: '4', sbd: '096', name: 'Võ Bá Thiện', votes: 20590, imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', description: '' },
  { id: '5', sbd: '018', name: 'Trần Tuyết Ngân', votes: 16070, imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150', description: '' },
  { id: '6', sbd: '095', name: 'Nguyễn Thị Cẩm Thanh', votes: 8410, imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150', description: '' },
];

export default function RankingPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(LOCAL_MOCK_CANDIDATES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadRankings() {
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
    loadRankings();
  }, []);

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center">
      
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-[28px] sm:text-[42px] font-extrabold uppercase tracking-wide text-white">
          Bảng xếp hạng
        </h1>
        <p className="text-[16px] sm:text-[22px] text-secondary font-medium tracking-widest uppercase mt-2">
          HUIT's Iconic
        </p>
      </div>

      {isLoading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary py-10"></div>
      ) : (
        <div className="w-full max-w-[800px] flex flex-col space-y-4">
          
          {/* Top 3 Visual Podium */}
          <div className="flex flex-col sm:flex-row items-end justify-center gap-6 mb-12 pt-6">
            
            {/* 2nd Place */}
            {sortedCandidates[1] && (
              <div className="flex flex-col items-center order-2 sm:order-1">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-silver-400 border-white/20">
                  <img src={sortedCandidates[1].imageUrl} className="object-cover w-full h-full" alt="" />
                  <span className="absolute bottom-0 right-0 bg-neutral-grey text-[12px] font-bold text-neutral-neutral1 h-5 w-5 rounded-full flex items-center justify-center border border-white/20">2</span>
                </div>
                <p className="text-[14px] font-bold mt-2 text-white/80">{sortedCandidates[1].name}</p>
                <p className="text-[12px] text-white/60">{sortedCandidates[1].votes.toLocaleString()} phiếu</p>
                <div className="w-24 h-16 bg-[rgba(255,255,255,0.06)] border border-white/10 rounded-t-[12px] mt-2 flex items-center justify-center">
                  <span className="text-[20px] font-bold text-white/40">II</span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {sortedCandidates[0] && (
              <div className="flex flex-col items-center order-1 sm:order-2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 border-secondary">
                  <img src={sortedCandidates[0].imageUrl} className="object-cover w-full h-full" alt="" />
                  <span className="absolute bottom-0 right-0 bg-secondary text-[12px] font-bold text-neutral-neutral1 h-5 w-5 rounded-full flex items-center justify-center border border-white/20">1</span>
                </div>
                <p className="text-[16px] font-extrabold mt-2 text-secondary">{sortedCandidates[0].name}</p>
                <p className="text-[13px] text-white/80 font-bold">{sortedCandidates[0].votes.toLocaleString()} phiếu</p>
                <div className="w-28 h-24 bg-[rgba(255,255,255,0.1)] border border-white/20 rounded-t-[12px] mt-2 flex items-center justify-center shadow-lg shadow-secondary/10">
                  <span className="text-[24px] font-extrabold text-secondary">I</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {sortedCandidates[2] && (
              <div className="flex flex-col items-center order-3">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-amber-600 border-white/20">
                  <img src={sortedCandidates[2].imageUrl} className="object-cover w-full h-full" alt="" />
                  <span className="absolute bottom-0 right-0 bg-[#A78BFA] text-[12px] font-bold text-neutral-neutral1 h-5 w-5 rounded-full flex items-center justify-center border border-white/20">3</span>
                </div>
                <p className="text-[14px] font-bold mt-2 text-white/80">{sortedCandidates[2].name}</p>
                <p className="text-[12px] text-white/60">{sortedCandidates[2].votes.toLocaleString()} phiếu</p>
                <div className="w-24 h-12 bg-[rgba(255,255,255,0.06)] border border-white/10 rounded-t-[12px] mt-2 flex items-center justify-center">
                  <span className="text-[20px] font-bold text-white/40">III</span>
                </div>
              </div>
            )}

          </div>

          {/* List of Rankings */}
          <div className="w-full flex flex-col space-y-3 bg-[rgba(222,222,222,0.04)] border border-white/5 p-4 rounded-[24px]">
            {sortedCandidates.map((c, index) => (
              <div key={c.id} className="w-full flex items-center justify-between p-3 rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-white/5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-4">
                  <span className={`w-8 text-center text-[16px] font-extrabold ${index === 0 ? 'text-secondary' : index === 1 ? 'text-white/80' : index === 2 ? 'text-white/60' : 'text-white/40'}`}>
                    #{index + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                    <img src={c.imageUrl} className="object-cover w-full h-full" alt="" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-white">{c.name}</span>
                    <span className="text-[11px] text-white/40">SBD: {c.sbd}</span>
                  </div>
                </div>
                <span className="text-[15px] font-extrabold text-white">
                  {c.votes.toLocaleString()} phiếu
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
