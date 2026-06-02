'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Candidate } from '@huitfest/shared';
import Link from 'next/link';
import { useAlert } from './AlertProvider';
import { apiUrl } from './api';

const LOCAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Nguyễn Thanh Tân', votes: 106100, imageUrl: '/original_assets/image389b.png', description: 'Thí sinh tài năng của HUIT\'s Iconic 2024.' },
  { id: '2', sbd: '089', name: 'Nguyễn Đình Tú', votes: 62215, imageUrl: '/original_assets/image725f.png', description: 'Chiến binh bản lĩnh mang màu sắc nhiệt huyết.' },
  { id: '3', sbd: '024', name: 'Lê Ngọc Yến Vy', votes: 22800, imageUrl: '/original_assets/image940e.jpg', description: 'Đại diện cho vẻ đẹp tri thức và sự duyên dáng.' },
  { id: '4', sbd: '096', name: 'Võ Bá Thiện', votes: 20590, imageUrl: '/original_assets/image8681.png', description: 'Nụ cười tỏa nắng cùng trái tim ấm áp.' },
  { id: '5', sbd: '018', name: 'Trần Tuyết Ngân', votes: 16070, imageUrl: '/original_assets/imageada2.png', description: 'Gương mặt cá tính đầy bứt phá.' },
  { id: '6', sbd: '095', name: 'Nguyễn Thị Cẩm Thanh', votes: 8410, imageUrl: '/original_assets/image4706.png', description: 'Sự kết hợp hoàn hảo giữa năng động và dịu dàng.' },
];

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: string;
}

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive?: boolean;
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

function RichContent({ value, fallback, className }: { value?: string | null; fallback: string; className: string }) {
  const content = value || fallback;
  if (hasHtml(content)) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(content) }} />;
  }
  return <div className={`${className} whitespace-pre-line`}>{content}</div>;
}

export default function HomePage() {
  const { showAlert } = useAlert();
  const ABOUT_FALLBACK_TITLE = 'HUIT STARTUP LẦN THỨ VII 2026';
  const ABOUT_FALLBACK_DESCRIPTION = `Cuộc thi HUIT Startup lần 07 năm 2026 với chủ đề “Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững" cấp thành phố (HUIT STARTUP LẦN THỨ VII) là hoạt động thường niên do Trường Đại học Công Thương TP. Hồ Chí Minh tổ chức, nhằm tìm kiếm và ươm tạo các ý tưởng, dự án sáng tạo của học sinh, sinh viên, học viên và doanh nghiệp góp phần giải quyết các vấn đề xã hội và thúc đẩy phát triển bền vững. Đây không chỉ là sân chơi học thuật mà còn là bệ phóng cho những ý tưởng sáng tạo, những giải pháp thiết thực được hình thành, phát triển và hiện thực hóa, mang lại giá trị thiết thực cho bản thân, gia đình, cộng đồng và toàn xã hội. Năm 2026, cuộc thi trở lại với quy mô mở rộng và chủ đề đầy cảm hứng: "Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững". Cuộc thi chào đón sự tham gia của Học sinh, sinh viên, học viên ở các trường đại học, cao đắng, trung cấp, THPT, GDTX và Các cá nhân, tổ chức, doanh nghiệp (HTX, hộ kinh doanh, doanh nghiệp vừa và nhỏ trên địa bàn Thành phố Hồ Chí Minh và các tỉnh lân cận yêu thích hoạt động khởi nghiệp, có ý tưởng, dự án khởi nghiệp sáng. Mục tiêu là tìm kiếm và ươm mầm những ý tưởng, giải pháp đổi mới sáng tạo, góp phần giải quyết các vấn đề cấp thiết của cộng đồng, xã hội và thúc đẩy phát triển kinh tế – xã hội một cách bền vững. Thông qua cuộc thi, ban tổ chức mong muốn lan tỏa mạnh mẽ tinh thần khởi nghiệp, đổi mới sáng tạo trong giới trẻ; đồng thời kết nối và mở rộng hệ sinh thái khởi nghiệp đổi mới sáng tạo trong khối các cơ sở giáo dục, các startup tạo tiền đề cho sự phát triển nguồn nhân lực sáng tạo, thích ứng và bản lĩnh trong thời đại mới.`;
  const ABOUT_REGISTER_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdlRmaBRgPAl_rbLjDOY__ROcyZsCOnoxec2izDhRVJTcHBfA/viewform';
  const [candidates, setCandidates] = useState<Candidate[]>(LOCAL_MOCK_CANDIDATES);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [hasLoadedBanners, setHasLoadedBanners] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const aboutTitleText = (settings?.aboutTitle || ABOUT_FALLBACK_TITLE).replace(/\s+NĂM\s+/i, ' ');

  // Default banner when DB has no active banner
  const defaultSlides = [
    {
      type: 'image',
      url: '/uploads/baner.jpg',
      title: 'HUIT STARTUP',
      link: '#about-section'
    }
  ];

  const [slides, setSlides] = useState<any[]>(defaultSlides);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [candRes, banRes, sponRes] = await Promise.all([
          fetch(apiUrl('/api/candidates')),
          fetch(apiUrl('/api/banners')),
          fetch(apiUrl('/api/sponsors'))
        ]);

        if (candRes.ok) {
          const candData = await candRes.json();
          setCandidates(candData);
        }
        if (banRes.ok) {
          const banData = await banRes.json();
          const activeBanners = banData.filter((banner: Banner) => banner.isActive !== false);
          if (activeBanners.length > 0) {
            const apiSlides = activeBanners.map((b: Banner) => {
              const isVideo = b.imageUrl.toLowerCase().endsWith('.mp4');
              return {
                type: isVideo ? 'video' : 'image',
                url: b.imageUrl,
                title: b.title,
                link: b.link || '#'
              };
            });
            setSlides(apiSlides);
          } else {
            setSlides(defaultSlides);
          }
          setBanners(activeBanners);
          setHasLoadedBanners(true);
          setCurrentBannerIndex(0);
        } else {
          setSlides(defaultSlides);
          setBanners([]);
          setHasLoadedBanners(true);
          setCurrentBannerIndex(0);
        }
        if (sponRes.ok) {
          const sponData = await sponRes.json();
          setSponsors(sponData);
        }
      } catch (err) {
        console.log('NestJS Backend API offline, using local mock/default data.', err);
        setSlides(defaultSlides);
        setBanners([]);
        setHasLoadedBanners(true);
        setCurrentBannerIndex(0);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(apiUrl('/api/candidates'));
        if (res.ok) {
          const candData = await res.json();
          setCandidates(candData);
        }
      } catch (err) {
        console.log('Poll candidates failed');
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/settings'));
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.log('Load settings failed');
      }
    }
    loadSettings();
    const interval = setInterval(loadSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prev => (prev + 1) % slides.length);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  const nextSlide = () => {
    setCurrentBannerIndex(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentBannerIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Scroll animation states and refs
  const aboutRef = useRef<HTMLDivElement>(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  const candidatesRef = useRef<HTMLDivElement>(null);
  const [candidatesVisible, setCandidatesVisible] = useState(false);

  const sponsorsRef = useRef<HTMLDivElement>(null);
  const [sponsorsVisible, setSponsorsVisible] = useState(false);

  useEffect(() => {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setAboutVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    const candidatesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setCandidatesVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    const sponsorsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setSponsorsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    if (aboutRef.current) {
      aboutObserver.observe(aboutRef.current);
    }
    if (candidatesRef.current) {
      candidatesObserver.observe(candidatesRef.current);
    }
    if (sponsorsRef.current) {
      sponsorsObserver.observe(sponsorsRef.current);
    }

    return () => {
      if (aboutRef.current) {
        aboutObserver.disconnect();
      }
      if (candidatesRef.current) {
        candidatesObserver.disconnect();
      }
      if (sponsorsRef.current) {
        sponsorsObserver.disconnect();
      }
    };
  }, []);

  // Drag-to-slide states and handlers
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ('button' in e && e.button !== 0) return; // Drag only on left click
    setIsDragging(true);
    setHasMoved(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = clientX - startX;

    if (Math.abs(diffX) > 6) {
      setHasMoved(true);
    }

    // Elastic effect resistance at start and end
    const isAtStart = currentBannerIndex === 0 && diffX > 0;
    const isAtEnd = currentBannerIndex === slides.length - 1 && diffX < 0;
    if (isAtStart || isAtEnd) {
      setDragOffset(diffX * 0.35);
    } else {
      setDragOffset(diffX);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 75; // drag threshold in pixels
    if (dragOffset < -threshold && currentBannerIndex < slides.length - 1) {
      nextSlide();
    } else if (dragOffset > threshold && currentBannerIndex > 0) {
      prevSlide();
    }

    // Delayed reset so onClick handler can check hasMoved
    setTimeout(() => {
      setDragOffset(0);
      setHasMoved(false);
    }, 50);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const isGateCurrentlyOpen = () => {
    if (!settings) return true;
    if (!settings.isGateOpen) return false;

    const now = new Date();
    const start = new Date(settings.startDate);
    const end = new Date(settings.endDate);
    return now >= start && now <= end;
  };

  const handleVote = async (sbd: string, name: string) => {
    if (!isGateCurrentlyOpen()) {
      showAlert("Cổng bình chọn hiện đang đóng hoặc chưa đến thời gian mở cổng. Vui lòng quay lại sau!", "warning", "Cổng bình chọn");
      return;
    }
    try {
      const res = await fetch(apiUrl(`/api/candidates/${sbd}/vote`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0987654321' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidates(prev => prev.map(c => c.sbd === sbd ? updated : c));
        showAlert(`Bình chọn thành công cho ${name}!`, "success", "Bình chọn thành công");
        return;
      }
    } catch (err) {
      console.log('NestJS Backend API offline, executing client-side mock vote.');
    }

    setCandidates(prev =>
      prev.map(c => c.sbd === sbd ? { ...c, votes: c.votes + 1 } : c)
    );
    showAlert(`Bình chọn offline thành công cho ${name}!`, "success", "Bình chọn thành công");
  };

  // Sort candidates by votes descending
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  const filteredCandidates = sortedCandidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.sbd.includes(search)
  );

  return (
    <>
      <style>{`
        @media (min-width: 812px) {
          .iUzfqH {
            background-image: url(/media-platform.1vote.vn/uploads/tAtj0/1727187460437.jpg);
            background-color: white;
            background-attachment: fixed;
            background-size: cover;
            background-repeat: no-repeat;
          }
        }
      `}</style>

      <main className="sc-908a50-0 iUzfqH flex-1">

        {/* Banner Section with Slider & Video support */}
        {slides.length > 0 && (
          <div className="sc-1a037b37-0 fgDcug relative flex flex-col group select-none">
            <div
              className="relative w-full h-[35vh] sm:h-[80vh] max-h-[1500px] overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <h1 className="text-transparent absolute -z-[1] text-transparent-transparent">
                {slides[currentBannerIndex]?.title || "HUIT's Iconic"}
              </h1>

              {/* Slider track */}
              <div
                className="flex h-full w-full"
                style={{
                  transform: `translateX(calc(-${currentBannerIndex * 100}% + ${dragOffset}px))`,
                  transition: isDragging ? 'none' : 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {slides.map((slide, idx) => (
                  <div key={idx} className="w-full h-full shrink-0 relative pointer-events-none">
                    {slide.link ? (
                      <a href={slide.link} className="w-full h-full block cursor-pointer pointer-events-auto" onDragStart={e => e.preventDefault()} onClick={handleLinkClick}>
                        {slide.type === 'video' ? (
                          <video
                            src={slide.url}
                            className="w-full h-full object-cover object-center pointer-events-none"
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster="/original_assets/image5999.jpg"
                          />
                        ) : (
                          <img
                            alt={slide.title}
                            className="w-full h-full object-cover object-center pointer-events-none"
                            src={slide.url}
                            onDragStart={e => e.preventDefault()}
                          />
                        )}
                      </a>
                    ) : (
                      slide.type === 'video' ? (
                        <video
                          src={slide.url}
                          className="w-full h-full object-cover object-center pointer-events-none"
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster="/original_assets/image5999.jpg"
                        />
                      ) : (
                        <img
                          alt={slide.title}
                          className="w-full h-full object-cover object-center"
                          src={slide.url}
                          onDragStart={e => e.preventDefault()}
                        />
                      )
                    )}
                  </div>
                ))}
              </div>

              {/* Dot Indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 pointer-events-auto">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentBannerIndex(idx)}
                      className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentBannerIndex ? 'w-5 bg-cyan-400' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Section */}
        <div id="about-section" ref={aboutRef} className="sc-1a037b37-0 ekqPrV relative mt-8 sm:mt-[80px] overflow-hidden">
          {/* Ambient Glowing Orbs */}
          <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#0A2FFF]/10 to-[#79BCC2]/10 blur-[90px] pointer-events-none transition-opacity duration-[2800ms] ${aboutVisible ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-10 right-10 w-[250px] h-[250px] rounded-full bg-gradient-to-br from-[#79BCC2]/5 to-[#0A2FFF]/5 blur-[80px] pointer-events-none transition-opacity duration-[2800ms] ${aboutVisible ? 'opacity-100' : 'opacity-0'}`} />

          <div className="pt-8 sm:pt-[40px] flex flex-col items-center relative z-10">

            {/* Section Main Header Căn Giữa */}
            <div className={`flex flex-col space-y-2 text-center mb-8 sm:mb-16 transform transition-all duration-[2800ms] ease-out ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-[24px] sm:text-[45px] tracking-[-1px] leading-[30px] sm:leading-[55px] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70">
                Giới thiệu cuộc thi
              </h2>
              <div
                className="h-[3.5px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-2 transition-all duration-[3200ms] ease-out"
                style={{ width: aboutVisible ? '100px' : '0px' }}
              />
            </div>

            {/* 2 Columns Content */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full px-4 sm:px-0">

              {/* Left Column: Information */}
              <div
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '400ms'
                }}
                className={`flex-1 flex flex-col space-y-5 sm:space-y-8 text-left transform transition-all duration-[2800ms] ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              >
                <h3
                  className="uppercase leading-tight"
                  style={{
                    fontSize: 'clamp(26px, 4vw, 38px)',
                    fontWeight: 800,
                    color: '#9FDBFF',
                    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
                    textShadow: '0 1px 10px rgba(121,188,194,0.18)',
                    display: 'inline-block',
                    textTransform: 'none'
                  }}
                >
                  {aboutTitleText}
                </h3>

                <RichContent
                  value={settings?.aboutDescription}
                  fallback={ABOUT_FALLBACK_DESCRIPTION}
                  className="rich-content text-[14px] sm:text-[16px] text-white/90 leading-relaxed font-light text-justify"
                />

                {/* Staggered Stats Counters */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                  <div
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transitionDelay: '800ms'
                    }}
                    className={`bg-white/[0.04] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-2xl p-3 sm:p-4 text-center transform transition-all duration-[2800ms] shadow-sm hover:border-[#79BCC2]/30 hover:bg-white/[0.08] dark:hover:bg-white/[0.04] transition-colors duration-300 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                  >
                    <p className="text-[20px] sm:text-[28px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2]">0</p>
                    <p className="text-[10px] sm:text-[12px] text-neutral-neutral1/60 dark:text-neutral-white/60 font-bold uppercase tracking-wider">Thí sinh</p>
                  </div>

                  <div
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transitionDelay: '1300ms'
                    }}
                    className={`bg-white/[0.04] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-2xl p-3 sm:p-4 text-center transform transition-all duration-[2800ms] shadow-sm hover:border-[#79BCC2]/30 hover:bg-white/[0.08] dark:hover:bg-white/[0.04] transition-colors duration-300 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                  >
                    <p className="text-[20px] sm:text-[28px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2]">0</p>
                    <p className="text-[10px] sm:text-[12px] text-neutral-neutral1/60 dark:text-neutral-white/60 font-bold uppercase tracking-wider">Bình chọn</p>
                  </div>

                  <div
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transitionDelay: '1800ms'
                    }}
                    className={`bg-white/[0.04] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-2xl p-3 sm:p-4 text-center transform transition-all duration-[2800ms] shadow-sm hover:border-[#79BCC2]/30 hover:bg-white/[0.08] dark:hover:bg-white/[0.04] transition-colors duration-300 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                  >
                    <p className="text-[20px] sm:text-[28px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2]">0</p>
                    <p className="text-[10px] sm:text-[12px] text-neutral-neutral1/60 dark:text-neutral-white/60 font-bold uppercase tracking-wider">Lượt xem</p>
                  </div>
                </div>

                {/* About Action Buttons */}
                <div
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: '2200ms'
                  }}
                  className={`flex flex-wrap items-center gap-3 transform transition-all duration-[2800ms] ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                  <Link
                    href="/the-le"
                    className="group hover-shine-effect inline-flex items-center justify-center border border-[#79BCC2]/50 bg-white/10 text-white font-bold rounded-full px-8 py-3.5 shadow-[0_4px_20px_rgba(121,188,194,0.16)] hover:shadow-[0_6px_24px_rgba(121,188,194,0.3)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 text-[14px] sm:text-[15px] uppercase tracking-wider"
                  >
                    <span>Đọc thêm</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                  <a
                    href={ABOUT_REGISTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover-shine-effect inline-flex items-center justify-center bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] text-white font-bold rounded-full px-8 py-3.5 shadow-[0_4px_20px_rgba(10,47,255,0.25)] hover:shadow-[0_6px_24px_rgba(10,47,255,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 text-[14px] sm:text-[15px] uppercase tracking-wider"
                  >
                    <span>Đăng ký</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Image with Glowing Floating Background & Shine Effect */}
              <div
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '600ms'
                }}
                className={`flex-1 w-full relative transform transition-all duration-[2800ms] ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              >
                {/* Glowing Aura Behind Image */}
                <div className={`absolute -inset-3 bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] rounded-[28px] blur-2xl opacity-0 transition-opacity duration-[3500ms] delay-[1000ms] pointer-events-none ${aboutVisible ? 'opacity-25' : 'opacity-0'}`} />
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] rounded-[26px] opacity-15 blur-sm pointer-events-none" />

                <div className="relative aspect-[4/5] w-full max-w-[560px] mx-auto overflow-hidden rounded-[24px] border border-white/10 shadow-2xl group hover-shine-effect bg-black/40">
                  <img
                    alt="Poster HUIT STARTUP"
                    className="w-full h-full object-contain object-center p-2 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    src={settings?.aboutImageUrl || "/uploads/poster-khoi-nghiep.jpg"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500"></div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Voting & Candidates Container */}
        <div className="relative" id="candidates-section" ref={candidatesRef}>
          {/* Ambient Glowing Orbs for Candidates Section */}
          <div className={`absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#79BCC2]/10 to-[#0A2FFF]/5 blur-[90px] pointer-events-none transition-opacity duration-[2800ms] ${candidatesVisible ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-1/4 left-1/4 w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-[#0A2FFF]/5 to-[#79BCC2]/5 blur-[80px] pointer-events-none transition-opacity duration-[2800ms] ${candidatesVisible ? 'opacity-100' : 'opacity-0'}`} />

          <div className="sc-1a037b37-0 ekqPrV relative z-10">
            <div className="pt-3 sm:pt-[85px] flex flex-col items-center">

              {/* Leaderboard title */}
              <div className={`flex flex-col space-y-4 text-center transform transition-all duration-[2800ms] ease-out ${candidatesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex flex-col space-y-1.5">
                  <h2 className="text-[22px] sm:text-[42px] tracking-[-1px] leading-[27px] sm:leading-[52px] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70">
                    Danh sách dự án
                  </h2>
                  <h3 className="text-[16px] sm:text-[28px] py-1 leading-[24px] uppercase font-bold text-[#79BCC2]">
                    HUIT STARTUP LẦN THỨ VII 2026
                  </h3>
                </div>
                <div
                  className="h-[3.5px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-1.5 transition-all duration-[3200ms] ease-out"
                  style={{ width: candidatesVisible ? '80px' : '0px' }}
                />
                <p className="mx-auto max-w-[760px] text-[14px] sm:text-[16px] leading-relaxed text-white/68">
                  Khám phá các ý tưởng khởi nghiệp sáng tạo, theo dõi lượt bình chọn và ủng hộ dự án bạn yêu thích.
                </p>
              </div>

              {/* Search Bar matching sample web */}
              <div
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '400ms'
                }}
                className={`max-w-[615px] w-full mt-3 sm:mt-[64px] transform transition-all duration-[2800ms] ${candidatesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <div className="flex items-center space-x-[8px] rounded-[20px] px-[8px] py-[7px] border border-grey-lightGrey1 dark:border-grey-darkGrey bg-grey-lightGrey2 dark:bg-grey-dimGrey h-[36px] sm:h-[60px] !px-2 rounded-[40px] w-full shadow-lg focus-within:border-[#79BCC2]/50 transition-all duration-300">
                  <div className="fill-neutral-neutral1 dark:fill-neutral-white pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                      <path d="M0 7.4353C0 6.52222 0.171549 5.66724 0.514648 4.87036C0.857747 4.06795 1.33366 3.36239 1.94238 2.75366C2.55111 2.14494 3.25391 1.66903 4.05078 1.32593C4.85319 0.982829 5.71094 0.811279 6.62402 0.811279C7.53711 0.811279 8.39209 0.982829 9.18896 1.32593C9.99137 1.66903 10.6969 2.14494 11.3057 2.75366C11.9144 3.36239 12.3903 4.06795 12.7334 4.87036C13.0765 5.66724 13.248 6.52222 13.248 7.4353C13.248 8.19344 13.1263 8.91284 12.8828 9.59351C12.6449 10.2742 12.3128 10.8912 11.8867 11.4446L15.9458 15.5286C16.0343 15.6171 16.1007 15.7195 16.145 15.8357C16.1948 15.9519 16.2197 16.0764 16.2197 16.2092C16.2197 16.3918 16.1782 16.5579 16.0952 16.7073C16.0177 16.8567 15.9071 16.9729 15.7632 17.0559C15.6193 17.1444 15.4533 17.1887 15.2651 17.1887C15.1323 17.1887 15.005 17.1638 14.8833 17.114C14.7671 17.0697 14.6592 17.0006 14.5596 16.9065L10.4756 12.8142C9.93327 13.2016 9.33561 13.5059 8.68262 13.7273C8.02962 13.9486 7.34342 14.0593 6.62402 14.0593C5.71094 14.0593 4.85319 13.8878 4.05078 13.5447C3.25391 13.2016 2.55111 12.7257 1.94238 12.1169C1.33366 11.5082 0.857747 10.8054 0.514648 10.0085C0.171549 9.20614 0 8.34839 0 7.4353ZM1.41943 7.4353C1.41943 8.1547 1.55225 8.82983 1.81787 9.46069C2.08903 10.086 2.46257 10.6366 2.93848 11.1125C3.41992 11.5885 3.97331 11.962 4.59863 12.2332C5.22949 12.5043 5.90462 12.6399 6.62402 12.6399C7.34342 12.6399 8.01579 12.5043 8.64111 12.2332C9.27197 11.962 9.82536 11.5885 10.3013 11.1125C10.7772 10.6366 11.1507 10.086 11.4219 9.46069C11.693 8.82983 11.8286 8.1547 11.8286 7.4353C11.8286 6.7159 11.693 6.04354 11.4219 5.41821C11.1507 4.78735 10.7772 4.23397 10.3013 3.75806C9.82536 3.27661 9.27197 2.90308 8.64111 2.63745C8.01579 2.36629 7.34342 2.23071 6.62402 2.23071C5.90462 2.23071 5.22949 2.36629 4.59863 2.63745C3.97331 2.90308 3.41992 3.27661 2.93848 3.75806C2.46257 4.23397 2.08903 4.78735 1.81787 5.41821C1.55225 6.04354 1.41943 6.7159 1.41943 7.4353Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <input
                    className="w-full bg-transparent focus:outline-none text-neutral-neutral1 dark:text-neutral-white placeholder:text-neutral-neutral1 dark:placeholder:text-neutral-white pl-2 text-[14px]"
                    placeholder="Tìm kiếm dự án..."
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Grid of Candidates - mirroring 1vote structure */}
              <div className="w-full mt-3 sm:mt-[64px]"></div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20 text-white">
                  Đang tải danh sách dự án...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-20 text-white/50">
                  Không tìm thấy dự án phù hợp
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-stretch max-w-[1320px] mx-auto px-4">
                  {filteredCandidates.map((c, idx) => {
                    // Find actual rank based on overall sorted position
                    const rank = sortedCandidates.findIndex(x => x.sbd === c.sbd) + 1;

                    return (
                      <div
                        key={c.id}
                        style={{
                          transitionDelay: `${Math.min(idx * 250, 1500)}ms`,
                          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        className={`h-full group w-full transform transition-all duration-[2500ms] ${candidatesVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                          }`}
                      >
                        <div className="relative h-full backdrop-blur-[8px] rounded-[24px] border border-white/10 bg-[rgba(222,222,222,0.13)] group-hover:bg-[rgb(222,222,222)]/35 group-hover:dark:bg-[rgb(222,222,222)]/18 group-hover:shadow-2xl group-hover:shadow-black/20 group-hover:dark:shadow-[#79BCC2]/15 cursor-pointer transition-all duration-300 hover-shine-effect overflow-hidden">

                          {/* Project banner image */}
                          <Link className="focus:outline-none relative block cursor-pointer w-full aspect-[16/9]" href={`/thi-sinh/${c.sbd}`}>
                            <div className="m-3 mb-0 relative h-[calc(100%-12px)] overflow-hidden rounded-[18px] bg-black/20 border border-white/10">
                              <img
                                alt={c.name}
                                className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                                src={c.imageUrl}
                              />
                              <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md">
                                MDB {c.sbd}
                              </div>
                              <div className="absolute right-3 top-3 rounded-full border border-[#79BCC2]/30 bg-[#0A2FFF]/45 px-3 py-1 text-[11px] font-bold text-[#CFFAFE] backdrop-blur-md">
                                #{rank}
                              </div>
                            </div>
                          </Link>

                          {/* Project details */}
                          <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79BCC2]">Dự án khởi nghiệp</p>
                                <h4 className="mt-1 line-clamp-2 text-[18px] sm:text-[20px] font-extrabold text-neutral-neutral1 dark:text-neutral-white leading-snug group-hover:text-[#79BCC2] transition-colors duration-300">
                                  {c.name}
                                </h4>
                              </div>
                              <div className="shrink-0 rounded-[14px] bg-white/10 px-3 py-2 text-right border border-white/10">
                                <p className="text-[10px] uppercase tracking-wider text-white/55">Bình chọn</p>
                                <p className="text-[16px] font-extrabold text-[#FDE047] drop-shadow-[0_0_10px_rgba(253,224,71,0.35)]">
                                  {c.votes.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <p className="mt-3 line-clamp-2 min-h-[40px] text-[13px] leading-relaxed text-white/68 text-justify">
                              {c.description || 'Ý tưởng khởi nghiệp đang được cập nhật thông tin giới thiệu.'}
                            </p>

                            <div className="mt-4 flex items-center gap-3">
                              <button
                                onClick={() => handleVote(c.sbd, c.name)}
                                className={`sc-7f525aa4-0 eyRkL flex items-center justify-center gap-2 rounded-xl py-[11px] w-full border-0 cursor-pointer transition-all hover-shine-effect ${isGateCurrentlyOpen()
                                    ? 'bg-primary dark:bg-neutral-white hover:opacity-90 active:scale-[0.98]'
                                    : 'bg-slate-700/50 cursor-not-allowed opacity-50'
                                  }`}
                              >
                                <p className={`text-[16px] leading-[20px] font-bold uppercase tracking-wider ${isGateCurrentlyOpen()
                                    ? 'text-neutral-white dark:text-primary'
                                    : 'text-slate-400'
                                  }`}>
                                  {isGateCurrentlyOpen() ? 'Bình chọn dự án' : 'Đã đóng'}
                                </p>
                              </button>

                              <div className="hidden sm:flex h-[44px] min-w-[74px] items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[12px] font-bold uppercase tracking-wider text-white/70">
                                MDB {c.sbd}
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2 Buttons: Toàn bộ xếp hạng & Danh sách dự án */}
              <div
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '800ms'
                }}
                className={`flex flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-[56px] w-full transform transition-all duration-[2800ms] ${candidatesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
              >
                <Link
                  href="/bang-xep-hang"
                  className="flex items-center justify-center border border-white/20 hover:border-[#79BCC2] bg-white/5 hover:bg-white/10 text-white font-bold rounded-full px-6 py-3 sm:px-8 sm:py-3.5 transition-all duration-300 text-[12px] sm:text-[14px] uppercase tracking-wider shadow-lg hover:shadow-[#79BCC2]/10 hover-shine-effect hover:scale-105 active:scale-95"
                >
                  Toàn bộ xếp hạng
                </Link>
                <Link
                  href="#candidates-section"
                  className="flex items-center justify-center border border-white/20 hover:border-[#79BCC2] bg-white/5 hover:bg-white/10 text-white font-bold rounded-full px-6 py-3 sm:px-8 sm:py-3.5 transition-all duration-300 text-[12px] sm:text-[14px] uppercase tracking-wider shadow-lg hover:shadow-[#79BCC2]/10 hover-shine-effect hover:scale-105 active:scale-95"
                >
                  Danh sách dự án
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Sponsor Section matching sample web */}
        <div className="relative w-full max-w-[1440px] mx-auto pb-8 sm:pb-[85px]" id="sponsor-section" ref={sponsorsRef}>
          {/* Ambient glowing orb for Sponsor Section */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#0A2FFF]/5 to-[#79BCC2]/5 blur-[100px] pointer-events-none transition-opacity duration-[2800ms] ${sponsorsVisible ? 'opacity-100' : 'opacity-0'}`} />

          <div className="pt-8 sm:pt-[85px] flex flex-col space-y-8 items-center relative z-10">
            <div className={`flex flex-col space-y-2 text-center transform transition-all duration-[2800ms] ease-out ${sponsorsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex flex-col space-y-1.5">
                <h2 className="text-[22px] sm:text-[42px] tracking-[-1px] leading-[27px] sm:leading-[52px] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70">
                  NHÀ TÀI TRỢ &amp; ĐỐI TÁC
                </h2>
                <h3 className="text-[16px] sm:text-[28px] py-1 leading-[24px] uppercase font-bold text-[#79BCC2]">
                  {settings?.eventTitle || "HUIT's Iconic"}
                </h3>
              </div>
              <div
                className="h-[3.5px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-2 transition-all duration-[3200ms] ease-out"
                style={{ width: sponsorsVisible ? '80px' : '0px' }}
              />
            </div>

            <div
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '600ms'
              }}
              className={`w-full max-w-[1400px] px-4 transform transition-all duration-[2800ms] ${sponsorsVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
                }`}
            >
              <div className="relative group hover-shine-effect rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-white/[0.01]">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] rounded-2xl opacity-10 blur-sm pointer-events-none group-hover:opacity-20 transition-opacity duration-500" />
                <img alt="Sponsors Logo" className="w-full h-auto object-contain rounded-xl relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.01]" src="/original_assets/image4b12.png" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Background bottom overlay */}
        <div className="fixed left-0 top-0 right-0 supports-[height:100cqh]:h-[100cqh] supports-[height:100dvh]:h-[100dvh] sm:hidden -z-50">
          <img alt="" className="absolute top-0 max-w-[1920px] max-h-[1080px] h-[1920px] w-[1080px]" src="/original_assets/image87ce.jpg" />
        </div>

      </main>
    </>
  );
}
