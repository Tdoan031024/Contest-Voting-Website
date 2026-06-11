'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiUrl } from '../api';

export default function TimelinePage() {
  const registerUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSdlRmaBRgPAl_rbLjDOY__ROcyZsCOnoxec2izDhRVJTcHBfA/viewform';

  const [settings, setSettings] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, timelineRes] = await Promise.all([
          fetch(apiUrl('/api/settings')),
          fetch(apiUrl('/api/timeline'))
        ]);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
        if (timelineRes.ok) {
          const timelineData = await timelineRes.json();
          setEvents(timelineData);
        }
      } catch (err) {
        console.error('Failed to load timeline data', err);
      }
    }
    loadData();
  }, []);

  const roundsList = [
    {
      title: 'Vòng loại',
      eyebrow: 'Giai đoạn 01',
      summary: 'Hoàn tất hồ sơ đăng ký, tập huấn định hướng và công bố kết quả vòng loại.',
      color: '#FDE047',
      bg: 'from-[#FDE047]/14 to-[#0A2FFF]/8',
      steps: [] as any[]
    },
    {
      title: 'Vòng bán kết',
      eyebrow: 'Giai đoạn 02',
      summary: 'Đào tạo chuyên sâu, hoàn thiện thuyết minh và thi bán kết tại HUIT Startup Open Day.',
      color: '#79BCC2',
      bg: 'from-[#79BCC2]/16 to-[#0A2FFF]/8',
      steps: [] as any[]
    },
    {
      title: 'Vòng chung kết',
      eyebrow: 'Giai đoạn 03',
      summary: 'Kiểm chứng thị trường, kết nối nguồn lực, bình chọn online và thuyết trình chung kết.',
      color: '#F97316',
      bg: 'from-[#F97316]/14 to-[#79BCC2]/8',
      steps: [] as any[]
    }
  ];

  if (events && events.length > 0) {
    events.filter((event: any) => event.isActive).forEach((event: any) => {
      const roundObj = roundsList.find(r => r.title === event.round);
      if (roundObj) {
        roundObj.steps.push(event);
      }
    });
  }

  // Fallback static rounds if DB is offline or empty
  const staticRounds = [
    {
      title: 'Vòng loại',
      eyebrow: 'Giai đoạn 01',
      summary: 'Hoàn tất hồ sơ đăng ký, tập huấn định hướng và công bố kết quả vòng loại.',
      color: '#FDE047',
      bg: 'from-[#FDE047]/14 to-[#0A2FFF]/8',
      steps: [
        { date: '15/5 - 15/6/2026', title: 'Nhận hồ sơ đăng ký dự thi', isImportant: true },
        { date: '17/06/2026', title: 'Tập huấn định hướng', isImportant: false },
        { date: '20/6/2026', title: 'Hạn chót nộp hồ sơ vòng loại', isImportant: true },
        { date: '27/6 - 28/6/2026', title: 'Chấm hồ sơ vòng loại', isImportant: false },
        { date: '30/6/2026', title: 'Công bố kết quả vòng loại', isImportant: true },
      ],
    },
    {
      title: 'Vòng bán kết',
      eyebrow: 'Giai đoạn 02',
      summary: 'Đào tạo chuyên sâu, hoàn thiện thuyết minh và thi bán kết tại HUIT Startup Open Day.',
      color: '#79BCC2',
      bg: 'from-[#79BCC2]/16 to-[#0A2FFF]/8',
      steps: [
        { date: '04/7 - 05/7/2026', title: 'Đào tạo, huấn luyện kỹ năng khởi nghiệp đổi mới sáng tạo', isImportant: false },
        { date: '19/7/2026', title: 'Hạn chót nộp bản thuyết minh dự án hoàn chỉnh', isImportant: true },
        { date: '25/7/2026', title: 'Thi bán kết, trưng bày sản phẩm hoặc dịch vụ', isImportant: true },
        { date: '25/7/2026', title: 'Chọn Top 10 đội mỗi bảng vào vòng chung kết', isImportant: true },
      ],
    },
    {
      title: 'Vòng chung kết',
      eyebrow: 'Giai đoạn 03',
      summary: 'Kiểm chứng thị trường, kết nối nguồn lực, bình chọn online và thuyết trình chung kết.',
      color: '#F97316',
      bg: 'from-[#F97316]/14 to-[#79BCC2]/8',
      steps: [
        { date: '01/8 - 16/8/2026', title: 'HUIT Startup Tour và kiểm chứng thực tế dự án', isImportant: false },
        { date: '17/8 - 17/9/2026', title: 'Kết nối nhà đầu tư, cố vấn và hoàn thiện định hướng phát triển', isImportant: false },
        { date: '20/9/2026', title: 'Hỗ trợ hoàn thiện thuyết minh dự án và kế hoạch kinh doanh', isImportant: false },
        { date: '21/9 - 28/9/2026', title: 'Vòng chung kết online', isImportant: true },
        { date: '03/10/2026', title: 'Trưng bày sản phẩm, dịch vụ và thuyết trình chung kết', isImportant: true },
      ],
    },
  ];

  const displayRounds = events && events.length > 0 ? roundsList : staticRounds;

  const keyMilestones = events && events.length > 0
    ? events
        .filter((e: any) => e.isActive && e.isImportant)
        .map((e: any) => {
          let displayDate = e.date;
          if (displayDate.includes('/2026')) {
            displayDate = displayDate.replace('/2026', '');
          }
          let displayTitle = e.title;
          if (displayTitle.length > 25) {
            if (displayTitle.toLowerCase().includes('nhận hồ sơ')) displayTitle = 'Mở nhận hồ sơ';
            else if (displayTitle.toLowerCase().includes('hạn chót') || displayTitle.toLowerCase().includes('hạn nộp')) displayTitle = 'Hạn nộp';
            else if (displayTitle.toLowerCase().includes('bán kết')) displayTitle = 'Bán kết';
            else if (displayTitle.toLowerCase().includes('chung kết')) displayTitle = 'Chung kết';
            else displayTitle = displayTitle.substring(0, 20) + '...';
          }
          return [displayDate, displayTitle];
        })
    : [
        ['15/5', 'Mở nhận hồ sơ'],
        ['20/6', 'Hạn nộp vòng loại'],
        ['25/7', 'Bán kết'],
        ['03/10', 'Chung kết'],
      ];

  return (
    <>
      <style>{`
        .iUzfqH {
          background-image: url(/background/background2.png);
          background-color: #030612;
          background-attachment: fixed;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
        @keyframes fadeUpTimeline {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseNode {
          0%, 100% { box-shadow: 0 0 0 0 rgba(121,188,194,0.0); }
          50% { box-shadow: 0 0 0 10px rgba(121,188,194,0.12); }
        }
        .timeline-enter {
          animation: fadeUpTimeline 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .timeline-node {
          animation: pulseNode 2.8s ease-in-out infinite;
        }
      `}</style>

      <main className="sc-908a50-0 iUzfqH flex-1 min-h-screen mt-[-80px] pt-[128px] sm:pt-[160px] pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute top-[8%] left-[-16%] h-[520px] w-[520px] rounded-full bg-[#0A2FFF]/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-[42%] right-[-14%] h-[620px] w-[620px] rounded-full bg-[#79BCC2]/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[4%] left-[15%] h-[360px] w-[360px] rounded-full bg-[#F97316]/8 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 sm:px-6">
          <section className="timeline-enter text-center">
            <span className="inline-flex rounded-full border border-[#79BCC2]/25 bg-[#79BCC2]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#79BCC2]">
              {settings?.aboutTitle || "HUIT STARTUP LẦN THỨ VII 2026"}
            </span>
            <h1 className="mx-auto mt-5 max-w-[900px] text-[32px] sm:text-[54px] font-black uppercase leading-[1.05] text-white">
              Thời gian các vòng thi
            </h1>
            <p className="mx-auto mt-5 max-w-[780px] text-[15px] sm:text-[17px] leading-relaxed text-white/72 font-light">
              Theo dõi toàn bộ lộ trình từ vòng loại, bán kết đến chung kết để chuẩn bị hồ sơ, hoàn thiện dự án và tham gia đúng hạn.
            </p>
            <div className="mx-auto mt-6 h-[3.5px] w-[82px] rounded-full bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2]" />

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] px-8 py-3.5 text-[14px] font-extrabold uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(10,47,255,0.35)] transition hover:scale-[1.03]"
              >
                Đăng ký ngay
              </a>
              <Link
                href="/gioi-thieu"
                className="rounded-full border border-white/20 bg-white/8 px-8 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white transition hover:border-[#79BCC2]/60 hover:bg-white/12"
              >
                Thông tin cuộc thi
              </Link>
            </div>
          </section>

          <section className="timeline-enter mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ animationDelay: '120ms' }}>
            {keyMilestones.map(([date, label]) => (
              <div key={`${date}-${label}`} className="rounded-[20px] border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur-md">
                <p className="text-[24px] sm:text-[30px] font-black text-[#FDE047]">{date}</p>
                <p className="mt-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-white/64 truncate">{label}</p>
              </div>
            ))}
          </section>

          <section className="mt-14 space-y-14">
            {displayRounds.map((round, roundIndex) => (
              <div key={round.title} className="timeline-enter" style={{ animationDelay: `${roundIndex * 130 + 220}ms` }}>
                <div className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${round.bg} p-5 sm:p-7 shadow-[0_26px_90px_rgba(0,0,0,0.26)] backdrop-blur-[12px]`}>
                  <div className="absolute inset-x-0 top-0 h-[4px]" style={{ backgroundColor: round.color }} />

                  <div className="flex flex-col items-center gap-3 border-b border-white/10 pb-6 text-center">
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.28em]" style={{ color: round.color }}>
                        {round.eyebrow}
                      </p>
                      <h2 className="mt-2 text-[28px] sm:text-[40px] font-black uppercase text-white">{round.title}</h2>
                    </div>
                    <p className="max-w-[640px] text-[14px] sm:text-[15px] leading-relaxed text-white/70">
                      {round.summary}
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {round.steps.map((stepObj: any, index: number) => {
                      const stepNum = String(index + 1).padStart(2, '0');
                      const date = stepObj.date;
                      const title = stepObj.title;
                      const important = stepObj.isImportant;
                      return (
                        <article
                          key={`${round.title}-${stepNum}`}
                          className="group relative min-h-[210px] overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.08] shadow-[0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-white/24 hover:bg-white/[0.12]"
                        >
                          <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: round.color }} />
                          <div className="absolute right-[-42px] top-[-44px] h-[132px] w-[132px] rounded-full opacity-15 transition group-hover:scale-110 group-hover:opacity-25" style={{ backgroundColor: round.color }} />
                          <div className="relative flex h-full flex-col p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/48">Step {stepNum}</p>
                                <p className="mt-2 text-[24px] font-black leading-tight text-white">{date}</p>
                              </div>
                              <div
                                className="timeline-node flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[18px] font-black text-[#071034] shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                                style={{ backgroundColor: round.color, animationDelay: `${index * 160}ms` }}
                              >
                                {stepNum}
                              </div>
                            </div>

                            <div className="mt-6 flex flex-1 flex-col justify-between">
                              <h3 className="text-[17px] font-extrabold leading-snug text-white">{title}</h3>
                              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                                {important ? (
                                  <span className="inline-flex rounded-full border border-[#FDE047]/35 bg-[#FDE047]/12 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FDE047]">
                                    Mốc quan trọng
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/38">Theo lộ trình</span>
                                )}
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: round.color }} />
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="timeline-enter mt-14 rounded-[30px] border border-white/10 bg-white/[0.07] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-8" style={{ animationDelay: '520ms' }}>
            <p className="text-[22px] sm:text-[32px] font-black uppercase text-white">Đừng bỏ lỡ mốc đăng ký</p>
            <p className="mx-auto mt-3 max-w-[680px] text-[14px] sm:text-[16px] leading-relaxed text-white/70">
              Hãy chuẩn bị hồ sơ sớm để đội thi có đủ thời gian hoàn thiện ý tưởng, sản phẩm và kế hoạch triển khai.
            </p>
            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-[#FDE047] to-[#79BCC2] px-9 py-3.5 text-[14px] font-black uppercase tracking-wider text-[#071034] shadow-[0_14px_34px_rgba(253,224,71,0.22)] transition hover:scale-[1.03]"
            >
              Đăng ký ngay
            </a>
          </section>
        </div>
      </main>
    </>
  );
}
