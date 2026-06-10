'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiUrl } from '../api';

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}

function hasHtml(value?: string | null) {
  return !!value && /<[a-z][\s\S]*>/i.test(value);
}

function sanitizeRichHtml(value: string) {
  if (typeof window === 'undefined') {
    return value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  }

  const wrapper = document.createElement('div');
  wrapper.innerHTML = value;
  wrapper.querySelectorAll('script, style, iframe, object, embed').forEach((node) => node.remove());
  wrapper.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const attrValue = attribute.value.trim().toLowerCase();
      if (name.startsWith('on') || attrValue.startsWith('javascript:')) {
        node.removeAttribute(attribute.name);
      }
    });
  });
  return wrapper.innerHTML;
}

function extractTextLines(value?: string | null) {
  if (!value) return [];
  if (!hasHtml(value)) return value.split('\n').map((line) => line.trim()).filter(Boolean);

  if (typeof window === 'undefined') {
    return value
      .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const wrapper = document.createElement('div');
  wrapper.innerHTML = sanitizeRichHtml(value);
  const blocks = Array.from(wrapper.querySelectorAll('li, p, div, h1, h2, h3, h4, h5, h6'))
    .map((node) => node.textContent?.trim() || '')
    .filter(Boolean);
  return blocks.length ? blocks : [wrapper.textContent?.trim() || ''].filter(Boolean);
}

function RichContent({ value, fallback, className }: { value?: string | null; fallback: string; className: string }) {
  const content = value || fallback;
  if (hasHtml(content)) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(content) }} />;
  }
  return <div className={`${className} whitespace-pre-line`}>{content}</div>;
}

export default function GioiThieuPage() {
  const registerUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdlRmaBRgPAl_rbLjDOY__ROcyZsCOnoxec2izDhRVJTcHBfA/viewform';

  const [settings, setSettings] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

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
          setTimelineEvents(timelineData);
        }
      } catch (err) {
        console.error('Failed to load data for Giới thiệu page', err);
      }
    }
    loadData();
  }, []);

  function formatImgUrl(url: string | undefined | null): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    if (cleanPath.startsWith('/uploads/')) {
      return apiUrl(cleanPath);
    }
    return cleanPath;
  }

  // Intersection observer triggers for smooth animations
  const titleSection = useInView(0.05);
  const gridSection = useInView(0.05);
  const theLeSection = useInView(0.05);
  const timelineSection = useInView(0.05);
  const backBtnSection = useInView(0.05);

  const getTimelineIcon = (index: number) => {
    if (index === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    }
    if (index === 1) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
    );
  };

  const defaultTimelineEvents = [
    {
      phase: "Nhận hồ sơ đăng ký",
      date: "15/5 - 15/6/2026",
      desc: "Các đội thi hoàn thiện hồ sơ, thông tin ý tưởng hoặc dự án khởi nghiệp sáng tạo để đăng ký tham gia cuộc thi.",
      icon: getTimelineIcon(0)
    },
    {
      phase: "Định hướng & tập huấn",
      date: "17/6/2026",
      desc: "Các đội thi được định hướng, tập huấn kỹ năng khởi nghiệp và chuẩn bị cho quá trình phát triển dự án.",
      icon: getTimelineIcon(1)
    },
    {
      phase: "Vòng loại",
      date: "27-28/6/2026",
      desc: "Hội đồng chuyên môn đánh giá, chọn lọc các ý tưởng và dự án phù hợp để tiếp tục bước vào vòng tiếp theo.",
      icon: getTimelineIcon(2)
    },
    {
      phase: "Vòng bán kết",
      date: "25/7/2026",
      desc: "Các đội thi trình bày, phản biện và hoàn thiện mô hình dự án dưới sự đánh giá của hội đồng chuyên môn.",
      icon: getTimelineIcon(1)
    },
    {
      phase: "Vòng chung kết",
      date: "03/10/2026",
      desc: "Các dự án xuất sắc nhất tranh tài, kết nối chuyên gia, nhà đầu tư và cơ hội ươm tạo sau cuộc thi.",
      icon: getTimelineIcon(2)
    }
  ];

  const displayTimeline = timelineEvents && timelineEvents.length > 0
    ? timelineEvents.filter((e: any) => e.isActive && e.isImportant).map((event: any, idx: number) => ({
        phase: event.title,
        date: event.date,
        desc: event.description,
        icon: getTimelineIcon(idx % 3)
      }))
    : defaultTimelineEvents;

  const organizers = settings?.aboutOrganizerDetail
    ? extractTextLines(settings.aboutOrganizerDetail)
    : [
        'Đơn vị tổ chức: Trường Đại học Công Thương TP. HCM (HUIT) và IEC.',
        'Tài trợ kim cương: Sài Gòn Thăng Long; Quỹ đầu tư VinaTech.',
        'Đơn vị phối hợp: Diễn đàn Doanh nghiệp; Khởi nghiệp Quốc gia phía Nam; VNEI.',
        'Đơn vị bảo trợ: Các đơn vị/biểu trưng bảo trợ theo poster cuộc thi.'
      ];

  const sectors = settings?.aboutSectors
    ? extractTextLines(settings.aboutSectors)
    : [
        'Công nghiệp, AI, chuyển đổi số và an ninh mạng',
        'Công nghệ thực phẩm, nông nghiệp, môi trường và năng lượng',
        'Giáo dục, văn hóa, du lịch, logistics, tài chính, thương mại điện tử và luật',
        'Y tế, sức khỏe và đời sống',
        'Phát triển bền vững và kinh doanh tạo tác động xã hội'
      ];

  const benefits = settings?.aboutBenefits
    ? extractTextLines(settings.aboutBenefits)
    : [
        'Đào tạo kỹ năng khởi nghiệp',
        'Mentor/cố vấn chuyên sâu',
        'Startup Tour & kiểm chứng thị trường',
        'Kết nối quỹ đầu tư, nhà đầu tư và cơ hội ươm tạo'
      ];

  const prize = settings?.aboutPrize || "Tổng giá trị giải thưởng 05 TỶ ĐỒNG và các gói hỗ trợ hấp dẫn, gồm tiền mặt, gói mentor/cố vấn chuyên sâu, gói sở hữu trí tuệ, nền tảng ERP Platform và nhiều cơ hội nhận các gói ươm tạo, kết nối đầu tư, phát triển dự án sau cuộc thi.";

  const parsedParticipants = settings?.aboutParticipants
    ? extractTextLines(settings.aboutParticipants).map((line: string) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          return [line.substring(0, colonIndex).trim(), line.substring(colonIndex + 1).trim()];
        }
        return ['Đối tượng', line.trim()];
      })
    : [
        ['Học sinh', 'THPT, GDTX, trung cấp có ý tưởng khởi nghiệp sáng tạo.'],
        ['Sinh viên, học viên', 'Đang học tại các trường đại học, cao đẳng và cơ sở giáo dục.'],
        ['Cá nhân, tổ chức', 'Yêu thích hoạt động khởi nghiệp, có ý tưởng hoặc dự án sáng tạo.'],
        ['Doanh nghiệp', 'HTX, hộ kinh doanh, doanh nghiệp vừa và nhỏ tại TP. Hồ Chí Minh và các tỉnh lân cận.']
      ];

  const stats = [
    [settings?.statsCandidates || '153+', 'Dự án đăng ký'],
    [settings?.statsVotes || '300+', 'Lượt bình chọn'],
    ['650', 'Sinh viên tham gia'],
    [settings?.statsViews || '3.7 triệu', 'Lượt tiếp cận trên mạng xã hội'],
    ['20+', 'Đơn vị truyền thông, đưa tin'],
    ['45+', 'Trường đại học, cao đẳng, THPT, TT GDTX tham gia'],
  ];

  return (
    <>
      <style>{`
        .iUzfqH {
          background-image: url(/background/background.png);
          background-color: #030612;
          background-attachment: fixed;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
        .hfAPBN {
          padding: 0px 128px;
          width: calc(1311px + 128px * 2);
          margin-left: auto;
          margin-right: auto;
        }
        @media (max-width: 1504px) {
          .hfAPBN { width: 1312px; padding: 0px 0px; }
        }
        @media (max-width: 1312px) {
          .hfAPBN { width: 1110px; padding: 0px 0px; }
        }
        @media (max-width: 1199px) {
          .hfAPBN { width: calc(984px + 69px * 2); padding: 0px 0px; }
        }
        @media (max-width: 1121px) {
          .hfAPBN { width: calc(744px + 37px * 2); padding: 0px 37px; }
        }
        @media (max-width: 812px) {
          .hfAPBN { width: 100%; padding: 0px 16px; margin-left: 0; margin-right: 0; }
        }

        /* Viewport entry transition classes */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-slide-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .animate-slide-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* mt-[-80px] pt-[80px] pulls the background image behind the translucent header */}
      <main className="sc-908a50-0 iUzfqH flex-1 pb-16 mt-[-80px] pt-[80px]">
        <div className="sc-1a037b37-0 hfAPBN relative px-4 sm:px-0">
          <div className="mt-8 sm:mt-[64px] flex flex-col items-center">
            
            {/* Title Block */}
            <div 
              ref={titleSection.ref} 
              className={`flex flex-col space-y-2 text-center mb-10 sm:mb-16 animate-on-scroll ${titleSection.visible ? 'visible' : ''}`}
            >
              <h2 className="text-[24px] sm:text-[42px] tracking-[-1px] leading-[30px] sm:leading-[52px] font-normal uppercase text-black dark:text-neutral-white">
                {settings?.aboutTitle || "Thông tin cuộc thi HUIT Startup 2026"}
              </h2>
              <h3 className="text-[16px] sm:text-[24px] py-1 uppercase font-normal text-[#79BCC2] dark:text-[#79BCC2] tracking-wider">
                {settings?.aboutSubtitle || "Cuộc thi HUIT Startup lần VII - Cấp Thành phố năm 2026"}
              </h3>
              <p className="mx-auto max-w-[900px] text-[14px] sm:text-[16px] leading-relaxed text-white/78 text-center">
                Chủ đề: {settings?.aboutTheme || "Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững"}
              </p>
              <div className="h-[3px] w-[60px] bg-primary mx-auto rounded-full mt-2"></div>
            </div>

            {/* Stacked Layout: Tổng quan & Đơn vị đồng hành */}
            <div ref={gridSection.ref} className="w-full max-w-[1200px] flex flex-col gap-8 mb-12">
              
              {/* Card 1: Tổng quan */}
              <div className={`backdrop-blur-[12px] w-full rounded-[30px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-[#79BCC2]/30 hover:shadow-[#79BCC2]/5 animate-on-scroll ${gridSection.visible ? 'visible' : ''}`}>
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#79BCC2]/10 rounded-full blur-xl group-hover:bg-[#79BCC2]/20 transition-all duration-500 pointer-events-none" />
                
                <RichContent
                  value={settings?.aboutDescription}
                  fallback={`Cuộc thi HUIT Startup lần thứ 7 năm 2026 cấp Thành phố với chủ đề “Đổi mới sáng tạo hướng tới phát triển bền vững”.\nTìm kiếm và ươm tạo các ý tưởng, dự án sáng tạo của học sinh, sinh viên, học viên và doanh nghiệp.\nGóp phần giải quyết các vấn đề xã hội và thúc đẩy phát triển bền vững.\n03 bảng thi: Học sinh - Sinh viên - Doanh nghiệp với ý tưởng, dự án khởi nghiệp sáng tạo.`}
                  className="rich-content text-[14px] sm:text-[15.5px] text-white/90 leading-relaxed font-light text-justify"
                />
              </div>

              {/* Card 2: Đơn vị đồng hành */}
              <div 
                className={`backdrop-blur-[12px] w-full rounded-[30px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col space-y-6 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-[#79BCC2]/30 hover:shadow-[#79BCC2]/5 animate-on-scroll ${gridSection.visible ? 'visible' : ''}`}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#0A2FFF]/10 rounded-full blur-xl group-hover:bg-[#0A2FFF]/20 transition-all duration-500 pointer-events-none" />

                <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                  <div className="p-2.5 bg-[#0A2FFF]/10 rounded-xl text-[#79BCC2] border border-[#0A2FFF]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h4 className="text-[18px] sm:text-[22px] font-extrabold text-white uppercase tracking-wider">
                    Đơn vị tổ chức &amp; đồng hành
                  </h4>
                </div>
                
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {organizers.map((line: string, idx: number) => {
                    const colonIndex = line.indexOf(':');
                    let label = "Đơn vị";
                    let content = line;
                    if (colonIndex !== -1) {
                      label = line.substring(0, colonIndex).trim();
                      content = line.substring(colonIndex + 1).trim();
                    }
                    
                    let tagStyle = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
                    if (label.toLowerCase().includes("tổ chức")) {
                      tagStyle = "text-blue-400 bg-blue-500/10 border-blue-500/20";
                    } else if (label.toLowerCase().includes("tài trợ")) {
                      tagStyle = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
                    } else if (label.toLowerCase().includes("phối hợp")) {
                      tagStyle = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                    } else if (label.toLowerCase().includes("bảo trợ")) {
                      tagStyle = "text-purple-400 bg-purple-500/10 border-purple-500/20";
                    }

                    return (
                      <div 
                        key={idx} 
                        className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl p-3 sm:p-4 transition-all duration-300 shadow-sm"
                      >
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-lg border shrink-0 text-center sm:min-w-[125px] ${tagStyle}`}>
                          {label}
                        </span>
                        <span className="text-[14px] text-white/95 font-medium leading-relaxed text-left">
                          {content}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Lĩnh vực, quyền lợi, giải thưởng */}
            <div 
              ref={theLeSection.ref}
              className={`w-full max-w-[1200px] mb-12 animate-on-scroll ${theLeSection.visible ? 'visible' : ''}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Lĩnh vực dự thi */}
                <div className="backdrop-blur-[12px] rounded-[30px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col space-y-6 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-[#79BCC2]/30 hover:shadow-[#79BCC2]/5">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl group-hover:bg-yellow-500/10 transition-all duration-500 pointer-events-none" />
                  
                  <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                    <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-400 border border-yellow-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                    </div>
                    <h4 className="text-[18px] sm:text-[20px] font-extrabold text-white uppercase tracking-wider">
                      Lĩnh vực dự thi
                    </h4>
                  </div>
                  
                  <div className="space-y-3 flex-1 flex flex-col justify-start">
                    {sectors.map((sector: string, idx: number) => {
                      const numberLabel = String(idx + 1).padStart(2, '0');
                      return (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-all duration-300"
                        >
                          <span className="text-[12px] font-black text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-md shrink-0">
                            {numberLabel}
                          </span>
                          <p className="text-[13.5px] text-white/80 leading-relaxed font-light text-justify">
                            {sector}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quyền lợi khi tham gia */}
                <div className="backdrop-blur-[12px] rounded-[30px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col space-y-6 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-[#79BCC2]/30 hover:shadow-[#79BCC2]/5">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#79BCC2]/5 rounded-full blur-xl group-hover:bg-[#79BCC2]/10 transition-all duration-500 pointer-events-none" />
                  
                  <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                    <div className="p-2.5 bg-[#79BCC2]/10 rounded-xl text-[#79BCC2] border border-[#79BCC2]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <h4 className="text-[18px] sm:text-[20px] font-extrabold text-white uppercase tracking-wider">
                      Quyền lợi tham gia
                    </h4>
                  </div>
                  
                  <div className="space-y-3 flex-1 flex flex-col justify-start">
                    {benefits.map((benefit: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-all duration-300"
                      >
                        <div className="p-1 bg-[#79BCC2]/10 rounded-full border border-[#79BCC2]/20 text-[#79BCC2] shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <p className="text-[14px] text-white/90 font-medium text-left">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Giải thưởng */}
                <div className="backdrop-blur-[12px] rounded-[30px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col space-y-6 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-[#79BCC2]/30 hover:shadow-[#79BCC2]/5">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all duration-500 pointer-events-none" />
                  
                  <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                    <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
                        <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z"></path>
                      </svg>
                    </div>
                    <h4 className="text-[18px] sm:text-[20px] font-extrabold text-white uppercase tracking-wider">
                      Cơ cấu giải thưởng
                    </h4>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-start space-y-4">
                    <div className="bg-gradient-to-br from-rose-500/15 via-[#79BCC2]/5 to-transparent border border-rose-500/20 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-rose-400">Tổng giải thưởng lên tới</p>
                      <h5 className="text-[28px] sm:text-[32px] font-black bg-gradient-to-r from-rose-400 via-rose-300 to-[#79BCC2] bg-clip-text text-transparent mt-1.5 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                        {(() => {
                          const match = prize.match(/\d+\s*[T|t]ỷ\s*[Đ|đ]ồng/i);
                          return match ? match[0].toUpperCase() : "05 TỶ ĐỒNG";
                        })()}
                      </h5>
                    </div>

                    <RichContent
                      value={prize}
                      fallback=""
                      className="rich-content text-[13.5px] text-white/75 leading-relaxed font-light text-justify bg-white/[0.01] border border-white/5 rounded-xl p-4 shadow-inner"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Timeline Section */}
            <div 
              id="timeline-section"
              ref={timelineSection.ref}
              className={`w-full max-w-[1200px] backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 sm:p-8 flex flex-col space-y-8 shadow-lg animate-on-scroll ${timelineSection.visible ? 'visible' : ''}`}
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary dark:text-[#79BCC2]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h4 className="text-[18px] sm:text-[22px] font-bold text-black dark:text-neutral-white uppercase">
                  Thời gian & Lộ trình thực hiện
                </h4>
              </div>

              {/* Timeline Layout */}
              <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
                {displayTimeline.map((event: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`relative flex flex-col space-y-2 animate-on-scroll ${timelineSection.visible ? 'visible' : ''}`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    
                    {/* Circle Node */}
                    <div className="absolute -left-[35px] sm:-left-[51px] top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-primary bg-[#272B34] flex items-center justify-center shadow-lg">
                      {event.icon}
                    </div>

                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#79BCC2] tracking-wider uppercase">
                      {event.date}
                    </span>
                    <h5 className="text-[16px] sm:text-[18px] font-bold text-black dark:text-neutral-white">
                      {event.phase}
                    </h5>
                    <p className="text-[13px] sm:text-[14px] text-neutral-neutral1/80 dark:text-neutral-white/80 leading-relaxed max-w-[850px] text-justify">
                      {event.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scale, participants and contact */}
            <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
              <div className="backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 shadow-lg">
                <h4 className="text-[18px] font-bold text-black dark:text-neutral-white uppercase mb-4 text-center">Quy mô năm 2025</h4>
                <div className="space-y-3 text-[14px] text-neutral-neutral1/90 dark:text-neutral-white/90">
                  {stats.map(([number, label]) => (
                    <div key={label} className="flex items-start gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
                      <span className="min-w-[72px] font-extrabold text-[#79BCC2]">{number}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 shadow-lg">
                <h4 className="text-[18px] font-bold text-black dark:text-neutral-white uppercase mb-4 text-center">Đối tượng tham gia</h4>
                <div className="space-y-3 text-[14px] text-neutral-neutral1/90 dark:text-neutral-white/90">
                  {parsedParticipants.map(([title, desc]: string[]) => (
                    <div key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-[#79BCC2]/40 hover:bg-white/[0.07]">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#79BCC2] shadow-[0_0_12px_rgba(121,188,194,0.65)]"></span>
                        <div>
                          <p className="font-bold text-white">{title}</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-white/70 text-justify">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 shadow-lg">
                <h4 className="text-[18px] font-bold text-black dark:text-neutral-white uppercase mb-4 text-center">Thông tin liên hệ</h4>
                <div className="space-y-3 text-[14px] text-neutral-neutral1/90 dark:text-neutral-white/90 font-light text-left pl-2 sm:pl-4">
                  <p><b>Người liên hệ:</b> {settings?.aboutContactName || 'Nguyễn Thị Bích Nguyên'}</p>
                  <p><b>Chức vụ:</b> {settings?.aboutContactRole || 'Chuyên viên - TT Đổi mới sáng tạo và Khởi nghiệp'}</p>
                  <p><b>Đơn vị:</b> Trường Đại học Công Thương TP. HCM</p>
                  <p><b>Điện thoại:</b> <a href={`tel:${settings?.aboutContactPhone || '0975702463'}`} className="text-[#79BCC2] hover:underline font-normal">{settings?.aboutContactPhone || '0975702463'}</a></p>
                  <p><b>Email:</b> <a href={`mailto:${settings?.aboutContactEmail || 'nguyenntb@huit.edu.vn'}`} className="text-[#79BCC2] hover:underline font-normal">{settings?.aboutContactEmail || 'nguyenntb@huit.edu.vn'}</a></p>
                  <p><b>Website:</b> <a href={settings?.aboutContactWebsite || "https://khoinghiep.huit.edu.vn"} target="_blank" rel="noopener noreferrer" className="text-[#79BCC2] hover:underline font-normal">{settings?.aboutContactWebsite || 'https://khoinghiep.huit.edu.vn'}</a></p>
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#79BCC2]">Quét mã để đăng ký</p>
                  <img
                    alt="QR đăng ký HUIT Startup 2026"
                    src={formatImgUrl(settings?.aboutContactQrUrl || '/images/qrdangky.png')}
                    className="mx-auto h-auto w-full max-w-[190px] rounded-xl bg-white p-2 shadow-lg object-contain"
                  />
                  <a
                    href={registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(10,47,255,0.25)] transition hover:scale-[1.02]"
                  >
                    Đăng ký ngay
                  </a>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div 
              ref={backBtnSection.ref}
              className={`mt-12 flex justify-center animate-on-scroll ${backBtnSection.visible ? 'visible' : ''}`}
            >
              <Link 
                href="/" 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] text-white font-bold rounded-full px-8 py-3.5 shadow-[0_4px_20px_rgba(10,47,255,0.25)] hover:shadow-[0_6px_24px_rgba(10,47,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-[14px] uppercase tracking-wider"
              >
                <span>Quay lại Trang chủ</span>
              </Link>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
