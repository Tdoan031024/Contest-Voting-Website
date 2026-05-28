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
  const [timeline, setTimeline] = useState<any[]>([]);

  // Intersection observer triggers for smooth animations
  const titleSection = useInView(0.05);
  const gridSection = useInView(0.05);
  const theLeSection = useInView(0.05);
  const timelineSection = useInView(0.05);
  const backBtnSection = useInView(0.05);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const res = await fetch('http://localhost:5000/api/timeline');
        if (res.ok) {
          const data = await res.json();
          setTimeline(data);
        }
      } catch (err) {
        console.error("Failed to load timeline from API", err);
      }
    }
    loadTimeline();
  }, []);

  const timelineEvents = [
    {
      phase: "VÒNG SƠ KHẢO",
      date: "20/10/2024 - 30/10/2024",
      desc: "Xét duyệt hồ sơ trực tuyến, đánh giá các chỉ số nhân trắc học và phỏng vấn trực tiếp với Hội đồng tuyển chọn.",
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
      phase: "VÒNG BÁN KẾT (BÌNH CHỌN ONLINE)",
      date: "03/11/2024 - 15/11/2024",
      desc: "Cổng bình chọn trực tuyến mở công khai. Khán giả và hội đồng tiến hành bầu chọn trực tiếp để tìm ra TOP 11 thí sinh xuất sắc nhất.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#79BCC2]">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      phase: "ĐÊM CHUNG KẾT & VINH QUANG",
      date: "20/11/2024 - 24/11/2024",
      desc: "Gala trình diễn nghệ thuật, kiểm tra kiến thức và trao giải cho các ngôi vị cao nhất của cuộc thi HUIT's Iconic.",
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

  const displayTimeline = timeline.length > 0 ? timeline.map((t, idx) => ({
    phase: t.title,
    date: t.date,
    desc: t.description,
    icon: getTimelineIcon(idx)
  })) : timelineEvents;

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
                Giới thiệu cuộc thi
              </h2>
              <h3 className="text-[16px] sm:text-[24px] py-1 uppercase font-normal text-[#79BCC2] dark:text-[#79BCC2] tracking-wider">
                HUIT's Iconic
              </h3>
              <div className="h-[3px] w-[60px] bg-primary mx-auto rounded-full mt-2"></div>
            </div>

            {/* Grid 2 Columns: Đối tượng & Quy chế */}
            <div ref={gridSection.ref} className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 overflow-hidden">
              
              {/* Left Column: Đối tượng */}
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
                    Đối tượng tham gia
                  </h4>
                </div>
                
                <ul className="space-y-4 text-[14px] sm:text-[15px] text-neutral-neutral1/90 dark:text-neutral-white/90 leading-relaxed list-none">
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span>Nam, nữ sinh viên đang theo học hệ chính quy tại <b>Trường Đại học Công Thương TP.HCM (HUIT)</b>.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span>Có kết quả học tập tốt, lối sống lành mạnh, tích cực tham gia các hoạt động phong trào Đoàn - Hội sinh viên.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span>Nữ sinh có chiều cao từ <b>1m60</b> trở lên; Nam sinh có chiều cao từ <b>1m70</b> trở lên.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span>Chấp hành đầy đủ pháp luật của Nhà nước và quy chế học đường, không chịu bất kỳ hình thức kỷ luật nào.</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Quy chế */}
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
                    Quy chế cuộc thi
                  </h4>
                </div>
                
                <ul className="space-y-4 text-[14px] sm:text-[15px] text-neutral-neutral1/90 dark:text-neutral-white/90 leading-relaxed list-none">
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>Hệ thống bình chọn:</b> Người dùng xác thực thông qua tài khoản Google. Mỗi ngày, mỗi tài khoản được cấp 01 lượt bình chọn miễn phí (tương đương 5 điểm).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>Cơ chế điểm:</b> Điểm bình chọn tổng hợp của thí sinh dựa trên điểm bình chọn trực tuyến (60%) và điểm thẩm định của Hội đồng giám khảo chuyên môn (40%).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block text-[#79BCC2] mr-2 mt-1">•</span>
                    <span><b>Nghiêm cấm gian lận:</b> Mọi hành vi can thiệp hệ thống, sử dụng clone, bot hoặc công cụ tăng điểm bất thường sẽ bị hủy bỏ toàn bộ số phiếu và tước quyền thi đấu.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Thể lệ Section */}
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
                  Thể lệ cuộc thi
                </h4>
              </div>
              
              <div className="space-y-4 text-[14px] sm:text-[15px] text-neutral-neutral1/90 dark:text-neutral-white/90 leading-relaxed">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                  <p className="font-bold text-primary dark:text-[#79BCC2] text-[15px] sm:text-[16px]">Giai đoạn 1: Bình chọn TOP 11</p>
                  <p>Thí sinh có điểm bình chọn trực tuyến cao nhất tính đến <b>18:00 ngày 03/11/2024</b> sẽ nhận danh hiệu <b>“HUIT’s Warrior”</b> và được đặc cách vào thẳng <b>TOP 11 Chung cuộc</b>.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#79BCC2]/5 border border-[#79BCC2]/10 space-y-2">
                  <p className="font-bold text-[#79BCC2] text-[15px] sm:text-[16px]">Giai đoạn 2: Thí sinh được yêu thích nhất</p>
                  <p>Cổng bình chọn trực tuyến tiếp tục mở từ <b>18:30 ngày 03/11/2024</b> đến <b>18:00 ngày 24/11/2024</b>. Thí sinh dẫn đầu bình chọn ở giai đoạn này sẽ giành giải thưởng phụ <b>“Thí sinh được yêu thích nhất”</b> và vinh danh trong đêm Gala Chung kết.</p>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div 
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
