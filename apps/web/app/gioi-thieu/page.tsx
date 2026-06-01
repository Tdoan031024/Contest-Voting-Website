'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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

export default function GioiThieuPage() {
  const registerUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdlRmaBRgPAl_rbLjDOY__ROcyZsCOnoxec2izDhRVJTcHBfA/viewform';

  // Intersection observer triggers for smooth animations
  const titleSection = useInView(0.05);
  const gridSection = useInView(0.05);
  const theLeSection = useInView(0.05);
  const timelineSection = useInView(0.05);
  const backBtnSection = useInView(0.05);

  const timelineEvents = [
    {
      phase: "Nhận hồ sơ đăng ký",
      date: "15/5 - 15/6/2026",
      desc: "Các đội thi hoàn thiện hồ sơ, thông tin ý tưởng hoặc dự án khởi nghiệp sáng tạo để đăng ký tham gia cuộc thi.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      phase: "Định hướng & tập huấn",
      date: "17/6/2026",
      desc: "Các đội thi được định hướng, tập huấn kỹ năng khởi nghiệp và chuẩn bị cho quá trình phát triển dự án.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      phase: "Vòng loại",
      date: "27-28/6/2026",
      desc: "Hội đồng chuyên môn đánh giá, chọn lọc các ý tưởng và dự án phù hợp để tiếp tục bước vào vòng tiếp theo.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      )
    }
  ];

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

  const extendedTimelineEvents = [
    ...timelineEvents,
    {
      phase: "Vòng bán kết",
      date: "25/7/2026",
      desc: "Các đội thi trình bày, phản biện và hoàn thiện mô hình dự án dưới sự đánh giá của hội đồng chuyên môn.",
      icon: getTimelineIcon(1),
    },
    {
      phase: "Vòng chung kết",
      date: "03/10/2026",
      desc: "Các dự án xuất sắc nhất tranh tài, kết nối chuyên gia, nhà đầu tư và cơ hội ươm tạo sau cuộc thi.",
      icon: getTimelineIcon(2),
    },
  ];

  const displayTimeline = extendedTimelineEvents;

  return (
    <>
      <style>{`
        .iUzfqH {
          background-image: url(/media-platform.1vote.vn/uploads/tAtj0/1727187460437.jpg);
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
                Thông tin cuộc thi HUIT Startup 2026
              </h2>
              <h3 className="text-[16px] sm:text-[24px] py-1 uppercase font-normal text-[#79BCC2] dark:text-[#79BCC2] tracking-wider">
                Cuộc thi HUIT Startup lần VII - Cấp Thành phố năm 2026
              </h3>
              <p className="mx-auto max-w-[900px] text-[14px] sm:text-[16px] leading-relaxed text-white/78">
                Chủ đề: Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững
              </p>
              <div className="h-[3px] w-[60px] bg-primary mx-auto rounded-full mt-2"></div>
            </div>

            {/* Grid 2 Columns: Tổng quan & Đơn vị đồng hành */}
            <div ref={gridSection.ref} className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 overflow-hidden">
              
              {/* Left Column: Tổng quan */}
              <div className={`backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 sm:p-8 flex flex-col space-y-6 shadow-lg animate-slide-left ${gridSection.visible ? 'visible' : ''}`}>
                <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary dark:text-[#79BCC2]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h4 className="text-[18px] sm:text-[22px] font-bold text-black dark:text-neutral-white uppercase">
                    Thông tin tổng quan
                  </h4>
                </div>
                
                <ul className="space-y-4 text-[14px] sm:text-[15px] text-neutral-neutral1/90 dark:text-neutral-white/90 leading-relaxed list-none">
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span>Cuộc thi HUIT Startup lần thứ 7 năm 2026 cấp Thành phố với chủ đề <b>“Đổi mới sáng tạo hướng tới phát triển bền vững”</b>.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span>Tìm kiếm và ươm tạo các ý tưởng, dự án sáng tạo của học sinh, sinh viên, học viên và doanh nghiệp.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span>Góp phần giải quyết các vấn đề xã hội và thúc đẩy phát triển bền vững.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>03 bảng thi:</b> Học sinh - Sinh viên - Doanh nghiệp với ý tưởng, dự án khởi nghiệp sáng tạo.</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Đơn vị đồng hành */}
              <div 
                className={`backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 sm:p-8 flex flex-col space-y-6 shadow-lg animate-slide-right ${gridSection.visible ? 'visible' : ''}`}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary dark:text-[#79BCC2]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h4 className="text-[18px] sm:text-[22px] font-bold text-black dark:text-neutral-white uppercase">
                    Đơn vị tổ chức và đồng hành
                  </h4>
                </div>
                
                <ul className="space-y-4 text-[14px] sm:text-[15px] text-neutral-neutral1/90 dark:text-neutral-white/90 leading-relaxed list-none">
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>Đơn vị tổ chức:</b> Trường Đại học Công Thương TP. HCM (HUIT) và IEC.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>Tài trợ kim cương:</b> Sài Gòn Thăng Long; Quỹ đầu tư VinaTech.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>Đơn vị phối hợp:</b> Diễn đàn Doanh nghiệp; Khởi nghiệp Quốc gia phía Nam; VNEI.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>Đơn vị bảo trợ:</b> Các đơn vị/biểu trưng bảo trợ theo poster cuộc thi.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Lĩnh vực, quyền lợi, giải thưởng */}
            <div 
              ref={theLeSection.ref}
              className={`w-full max-w-[1200px] mb-12 backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 sm:p-8 flex flex-col space-y-6 shadow-lg animate-on-scroll ${theLeSection.visible ? 'visible' : ''}`}
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary dark:text-[#79BCC2]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h4 className="text-[18px] sm:text-[22px] font-bold text-black dark:text-neutral-white uppercase">
                  Lĩnh vực dự thi, quyền lợi và giải thưởng
                </h4>
              </div>
              
              <div className="space-y-4 text-[14px] sm:text-[15px] text-neutral-neutral1/90 dark:text-neutral-white/90 leading-relaxed">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                  <p className="font-bold text-primary dark:text-[#79BCC2] text-[15px] sm:text-[16px]">Lĩnh vực dự thi</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none">
                    <li>• Công nghiệp, AI, chuyển đổi số và an ninh mạng</li>
                    <li>• Công nghệ thực phẩm, nông nghiệp, môi trường và năng lượng</li>
                    <li>• Giáo dục, văn hóa, du lịch, logistics, tài chính, thương mại điện tử và luật</li>
                    <li>• Y tế, sức khỏe và đời sống</li>
                    <li>• Phát triển bền vững và kinh doanh tạo tác động xã hội</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-[#79BCC2]/5 border border-[#79BCC2]/10 space-y-2">
                  <p className="font-bold text-[#79BCC2] text-[15px] sm:text-[16px]">Quyền lợi khi tham gia</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none">
                    <li>• Đào tạo kỹ năng khởi nghiệp</li>
                    <li>• Mentor/cố vấn chuyên sâu</li>
                    <li>• Startup Tour & kiểm chứng thị trường</li>
                    <li>• Kết nối quỹ đầu tư, nhà đầu tư và cơ hội ươm tạo</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <p className="font-bold text-white text-[15px] sm:text-[16px]">Giải thưởng</p>
                  <p>Tổng giá trị giải thưởng <b>05 TỶ ĐỒNG</b> và các gói hỗ trợ hấp dẫn, gồm tiền mặt, gói mentor/cố vấn chuyên sâu, gói sở hữu trí tuệ, nền tảng ERP Platform và nhiều cơ hội nhận các gói ươm tạo, kết nối đầu tư, phát triển dự án sau cuộc thi.</p>
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
                {displayTimeline.map((event, idx) => (
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
                    <p className="text-[13px] sm:text-[14px] text-neutral-neutral1/80 dark:text-neutral-white/80 leading-relaxed max-w-[850px]">
                      {event.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scale, participants and contact */}
            <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
              <div className="backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 shadow-lg">
                <h4 className="text-[18px] font-bold text-black dark:text-neutral-white uppercase mb-4">Quy mô năm 2025</h4>
                <div className="space-y-3 text-[14px] text-neutral-neutral1/90 dark:text-neutral-white/90">
                  {[
                    ['153+', 'Dự án đăng ký'],
                    ['300+', 'Chuyên gia, Mentor, Ban giám khảo đồng hành'],
                    ['650', 'Sinh viên tham gia'],
                    ['3.7 triệu', 'Lượt tiếp cận trên mạng xã hội'],
                    ['20+', 'Đơn vị truyền thông, đưa tin'],
                    ['45+', 'Trường đại học, cao đẳng, THPT, TT GDTX tham gia'],
                  ].map(([number, label]) => (
                    <div key={label} className="flex items-start gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
                      <span className="min-w-[72px] font-extrabold text-[#79BCC2]">{number}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 shadow-lg">
                <h4 className="text-[18px] font-bold text-black dark:text-neutral-white uppercase mb-4">Đối tượng tham gia</h4>
                <div className="space-y-3 text-[14px] text-neutral-neutral1/90 dark:text-neutral-white/90">
                  {[
                    ['Học sinh', 'THPT, GDTX, trung cấp có ý tưởng khởi nghiệp sáng tạo.'],
                    ['Sinh viên, học viên', 'Đang học tại các trường đại học, cao đẳng và cơ sở giáo dục.'],
                    ['Cá nhân, tổ chức', 'Yêu thích hoạt động khởi nghiệp, có ý tưởng hoặc dự án sáng tạo.'],
                    ['Doanh nghiệp', 'HTX, hộ kinh doanh, doanh nghiệp vừa và nhỏ tại TP. Hồ Chí Minh và các tỉnh lân cận.'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-[#79BCC2]/40 hover:bg-white/[0.07]">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#79BCC2] shadow-[0_0_12px_rgba(121,188,194,0.65)]"></span>
                        <div>
                          <p className="font-bold text-white">{title}</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-white/70">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-[8px] rounded-[24px] border border-white/5 bg-[rgba(222,222,222,0.15)] p-6 shadow-lg">
                <h4 className="text-[18px] font-bold text-black dark:text-neutral-white uppercase mb-4">Thông tin liên hệ</h4>
                <div className="space-y-3 text-[14px] text-neutral-neutral1/90 dark:text-neutral-white/90">
                  <p><b>Người liên hệ:</b> Nguyễn Thị Bích Nguyên</p>
                  <p><b>Chức vụ:</b> Chuyên viên - TT Đổi mới sáng tạo và Khởi nghiệp</p>
                  <p><b>Đơn vị:</b> Trường Đại học Công Thương TP. HCM</p>
                  <p><b>Điện thoại:</b> <a href="tel:0975702463" className="text-[#79BCC2] hover:underline">0975702463</a></p>
                  <p><b>Email:</b> <a href="mailto:nguyenntb@huit.edu.vn" className="text-[#79BCC2] hover:underline">nguyenntb@huit.edu.vn</a></p>
                  <p><b>Website:</b> <a href="https://khoinghiep.huit.edu.vn" target="_blank" rel="noopener noreferrer" className="text-[#79BCC2] hover:underline">https://khoinghiep.huit.edu.vn</a></p>
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#79BCC2]">Quét mã để đăng ký</p>
                  <img
                    alt="QR đăng ký HUIT Startup 2026"
                    src="/images/qrdangky.png"
                    className="mx-auto h-auto w-full max-w-[190px] rounded-xl bg-white p-2 shadow-lg"
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
