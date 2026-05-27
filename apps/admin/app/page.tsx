'use client';

import React, { useState, useEffect } from 'react';
import { Candidate, Sponsor } from '@huitfest/shared';

export default function OverviewPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [gateOpen, setGateOpen] = useState(true);
  const [eventTitle, setEventTitle] = useState("HUIT's Iconic 2024");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [candRes, sponRes, setRes] = await Promise.all([
          fetch('http://localhost:5000/api/candidates'),
          fetch('http://localhost:5000/api/sponsors'),
          fetch('http://localhost:5000/api/settings')
        ]);

        if (candRes.ok) {
          const candData = await candRes.json();
          setCandidates(candData);
        }
        if (sponRes.ok) {
          const sponData = await sponRes.json();
          setSponsors(sponData);
        }
        if (setRes.ok) {
          const setData = await setRes.json();
          setGateOpen(setData.isGateOpen);
          setEventTitle(setData.eventTitle);
        }
      } catch (err) {
        console.error('Failed to load stats from API, using default mock data.', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const leadingCandidate = candidates.length > 0 ? [...candidates].sort((a, b) => b.votes - a.votes)[0] : null;

  const stats = [
    { name: 'Tổng số phiếu bầu', value: totalVotes.toLocaleString() + ' phiếu', icon: '📈', change: 'Tính từ thời gian thực' },
    { name: 'Tổng số thí sinh', value: candidates.length.toString() + ' thí sinh', icon: '👤', change: 'Thí sinh đã kích hoạt' },
    { name: 'Thí sinh dẫn đầu', value: leadingCandidate ? leadingCandidate.name : 'Chưa có', icon: '🏆', change: leadingCandidate ? `${leadingCandidate.votes.toLocaleString()} phiếu` : '0 phiếu' },
    { name: 'Trạng thái cổng', value: gateOpen ? 'Đang mở' : 'Đang đóng', icon: '🔔', change: `Sự kiện: ${eventTitle}` },
  ];

  const recentVotes = [
    { phone: '098****321', candidate: candidates[0]?.name || 'Nguyễn Thanh Tân', sbd: candidates[0]?.sbd || '085', time: '1 phút trước', status: 'Hợp lệ' },
    { phone: '090****888', candidate: candidates[2]?.name || 'Lê Ngọc Yến Vy', sbd: candidates[2]?.sbd || '024', time: '5 phút trước', status: 'Hợp lệ' },
    { phone: '035****456', candidate: candidates[1]?.name || 'Nguyễn Đình Tú', sbd: candidates[1]?.sbd || '089', time: '12 phút trước', status: 'Hợp lệ' },
    { phone: '086****789', candidate: candidates[3]?.name || 'Võ Bá Thiện', sbd: candidates[3]?.sbd || '096', time: '20 phút trước', status: 'Hợp lệ' },
  ];

  return (
    <div className="flex flex-col space-y-8">
      
      {/* Welcome */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-100">Tổng quan hệ thống</h1>
        <p className="text-[14px] text-slate-400 mt-1">Chào mừng bạn trở lại, thống kê dữ liệu bình chọn thời gian thực.</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center justify-between shadow-md">
            <div className="flex flex-col space-y-1">
              <span className="text-[13px] text-slate-400 font-medium">{stat.name}</span>
              <span className="text-[20px] sm:text-[22px] font-bold text-slate-100 truncate max-w-[150px]">{stat.value}</span>
              <span className="text-[11px] text-slate-500 font-medium">{stat.change}</span>
            </div>
            <div className="text-[28px] p-3 bg-slate-700/50 rounded-lg flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Charts Placeholder & Recent Votes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mock Analytics Chart Card */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col justify-between min-h-[340px] shadow-md">
          <div>
            <h3 className="text-[16px] font-bold text-slate-200">Biểu đồ tốc độ bình chọn (phiếu / giờ)</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Dữ liệu phân tích trong 24 giờ qua</p>
          </div>
          
          {/* Mock Bar chart bars */}
          <div className="h-48 flex items-end justify-between gap-2 px-4 pt-6">
            {[20, 35, 45, 30, 55, 75, 90, 85, 60, 40, 50, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-blue-600 hover:bg-blue-500 rounded-t transition-all relative" 
                  style={{ height: `${h}%` }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-700 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {h * 15} phiếu
                  </span>
                </div>
                <span className="text-[9px] text-slate-500">{i * 2}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col shadow-md">
          <h3 className="text-[16px] font-bold text-slate-200 mb-4">Lượt bình chọn mới nhất</h3>
          
          <div className="flex-1 flex flex-col space-y-4">
            {recentVotes.map((vote, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20 border border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-200">{vote.phone}</span>
                  <span className="text-[11px] text-slate-400">Bình chọn: {vote.candidate} (SBD: {vote.sbd})</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-green-400 font-medium px-2 py-0.5 rounded bg-green-500/10 border border-green-500/10">
                    {vote.status}
                  </span>
                  <span className="text-[10px] text-slate-500">{vote.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
