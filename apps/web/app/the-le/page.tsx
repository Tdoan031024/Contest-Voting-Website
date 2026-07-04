'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiUrl } from '../api';

interface Step { number: string; description: string; image: string; }
interface SectionConfig { title: string; steps: Step[]; }
interface ExchangeRate { points: string; price: string; }

const defaultSections: SectionConfig[] = [
  {
    title: 'B??nh ch???n mi???n ph?? m???i ng??y',
    steps: [
      { number: '01', description: 'T???o t??i kho???n m???i ho???c ????ng nh???p ????? b??nh ch???n.', image: '/original_assets/imagefca6.png' },
      { number: '02', description: 'M???i t??i kho???n ???????c 2 l?????t b??nh ch???n mi???n ph?? trong m???i ng??y.', image: '/original_assets/imagef1be.png' },
      { number: '03', description: 'Ch???n d??? ??n b???n y??u th??ch t??? trang ch???, b???ng x???p h???ng ho???c trang chi ti???t d??? ??n.', image: '/original_assets/image81d3.png' },
      { number: '04', description: 'M???i l???n b???m b??nh ch???n s??? c???ng 1 l?????t cho d??? ??n. D??ng h???t 2 l?????t s??? ph???i ch??? ?????n ng??y h??m sau.', image: '/original_assets/image20da.png' },
    ],
  },
];

const defaultExchangeRates: ExchangeRate[] = [
  { points: '1 L?????t', price: 'Mi???n ph?? (2 l?????t / ng??y)' },
];

const faqItems = [
  { q: 'Bình chọn miễn phí có giới hạn không?', a: 'Mỗi tài khoản được cấp 5 điểm miễn phí mỗi ngày (mỗi ngày/01 lượt). Điểm miễn phí không cộng dồn sang ngày hôm sau.' },
  { q: 'Tôi có thể bình chọn cho nhiều dự án không?', a: 'Hoàn toàn có thể! Bạn có thể phân bổ điểm bình chọn cho bất kỳ số lượng dự án nào trong cùng một phiên hoặc nhiều phiên khác nhau.' },
  { q: 'Tôi quên mật khẩu thì phải làm gì?', a: 'Bạn có thể đăng nhập bằng Google (không cần mật khẩu), hoặc liên hệ ban tổ chức qua email iec@huit.edu.vn để được hỗ trợ reset tài khoản.' },
];

function normalizeSections(rawSections: any[]): SectionConfig[] {
  const stepSections = rawSections.filter((s) => Array.isArray(s.steps) && s.steps.length > 0);
  const filtered = stepSections.filter((s: any) => !s.title.toLowerCase().includes('thanh toán') && !s.title.toLowerCase().includes('sepay'));
  if (filtered.length === 0) return defaultSections;
  return filtered.map((s, i) => ({ title: s.title || `Mục ${i + 1}`, steps: s.steps }));
}

function extractDigits(str: any): string {
  if (str === undefined || str === null) return '';
  const s = String(str).trim();
  const match = s.match(/\d+/g);
  if (!match) { return s.toLowerCase().includes('miễn phí') ? '0' : ''; }
  return match.join('');
}

function normalizeRates(rawRates: any[]): ExchangeRate[] {
  const rates = rawRates.map((rate) => {
    const pn = extractDigits(rate.points || rate.label);
    const prn = extractDigits(rate.price || rate.priceLabel);
    const pointsStr = pn !== '' ? `${Number(pn).toLocaleString('vi-VN')} Điểm` : '';
    const priceStr = prn !== '' ? (Number(prn) > 0 ? `${Number(prn).toLocaleString('vi-VN')} VND` : 'Miễn phí (01 lượt / ngày)') : '';
    return { points: pointsStr, price: priceStr };
  }).filter((r) => r.points && r.price);
  const freeRates = rates.filter((r) => r.price.toLowerCase().includes('miễn phí') || r.price === '0 VND');
  return freeRates.length > 0 ? freeRates : defaultExchangeRates;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const sectionColors = [
  { gradient: 'linear-gradient(135deg, #0A2FFF, #79BCC2)', icon: '❤️', tag: 'Miễn phí' },
];

export default function TheLePage() {
  const [sections, setSections] = useState<SectionConfig[]>(defaultSections);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(defaultExchangeRates);
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroSection = useInView(0.2);
  const stepsSection = useInView(0.1);
  const tableSection = useInView(0.1);
  const faqSection = useInView(0.1);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(apiUrl('/api/settings'));
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.guideSections) && data.guideSections.length > 0) setSections(normalizeSections(data.guideSections));
        if (Array.isArray(data.exchangeRates) && data.exchangeRates.length > 0) setExchangeRates(normalizeRates(data.exchangeRates));
      } catch { }
    }
    loadSettings();
  }, []);

  return (
    <>
      <style>{`
        .the-le-page { background: var(--site-bg); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-d1 { animation-delay: 100ms; }
        .fade-up-d2 { animation-delay: 200ms; }
        .fade-up-d3 { animation-delay: 300ms; }
        .tab-btn { transition: all 0.25s ease; }
      `}</style>

      <main className="the-le-page flex-1 min-h-screen pb-20" style={{ background: 'var(--site-bg)' }}>

        {/* === HERO SECTION === */}
        <section ref={heroSection.ref} className="subpage-hero">
          <div className="subpage-hero-bg" />
          <div className="subpage-hero-content">
            {/* Breadcrumb */}
            <div className="subpage-breadcrumb">
              <Link href="/">Trang chủ</Link>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              <span>Hướng dẫn & Thể lệ</span>
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${heroSection.visible ? 'fade-up' : 'opacity-0'}`}
              style={{ background: 'color-mix(in srgb, var(--site-primary) 12%, var(--site-card))', color: 'var(--site-primary)', border: '1px solid color-mix(in srgb, var(--site-primary) 25%, transparent)' }}>
              📖 Cẩm nang bình chọn
            </div>

            <h1 className={heroSection.visible ? 'fade-up fade-up-d1' : 'opacity-0'}>
              Hướng dẫn & Thể lệ
            </h1>
            <p className={heroSection.visible ? 'fade-up fade-up-d2' : 'opacity-0'}>
              Mọi thông tin về cách thức bình chọn, quy đổi điểm và các câu hỏi thường gặp đều được tổng hợp đầy đủ tại đây.
            </p>

            {/* Quick links */}
            <div className={`flex flex-wrap gap-3 justify-center mt-6 ${heroSection.visible ? 'fade-up fade-up-d3' : 'opacity-0'}`}>
              {['Bình chọn miễn phí ↓', 'Bảng điểm ↓', 'FAQ ↓'].map((label, i) => (
                <a key={i} href={['#free-vote', '#bang-diem', '#faq'][i]}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition hover:opacity-80"
                  style={{ border: '1px solid var(--site-line)', background: 'var(--site-card)', color: 'var(--site-text)' }}>
                  {label}
                </a>
              ))}
            </div>

            <div className="subpage-divider" />
          </div>
        </section>

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12">

          {/* === TAB NAVIGATION === */}
          {sections.length > 1 && (
            <div className="flex flex-wrap gap-3 justify-center mb-10" ref={stepsSection.ref} role="tablist" aria-label="Hình thức bình chọn">
              {sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  onKeyDown={(event) => {
                    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                    event.preventDefault();
                    const tabs = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') || []);
                    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
                    setActiveTab(nextIndex);
                    tabs[nextIndex]?.focus();
                  }}
                  id={`vote-guide-tab-${i}`}
                  role="tab"
                  aria-selected={activeTab === i}
                  aria-controls={i === 0 ? 'free-vote' : 'sepay-vote'}
                  tabIndex={activeTab === i ? 0 : -1}
                  className="tab-btn flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
                  style={activeTab === i ? {
                    background: sectionColors[i % sectionColors.length].gradient,
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(10,47,255,0.25)',
                  } : {
                    background: 'var(--site-card)',
                    color: 'var(--site-text)',
                    border: '1px solid var(--site-line)',
                  }}
                >
                  <span>{sectionColors[i % sectionColors.length].icon}</span>
                  {s.title}
                </button>
              ))}
            </div>
          )}

          {/* === STEPS for active tab === */}
          {sections.map((section, sIdx) => (
            <div
              key={`sec-${sIdx}`}
              id={sIdx === 0 ? 'free-vote' : 'sepay-vote'}
              role="tabpanel"
              aria-labelledby={`vote-guide-tab-${sIdx}`}
              hidden={sections.length > 1 && activeTab !== sIdx}
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="step-num-circle" style={{ background: sectionColors[sIdx % sectionColors.length].gradient, width: 48, height: 48, fontSize: 20 }}>
                  {sectionColors[sIdx % sectionColors.length].icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--site-primary)' }}>
                    {sectionColors[sIdx % sectionColors.length].tag}
                  </div>
                  <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 900, color: 'var(--site-text)', margin: 0 }}>
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="step-flow">
                {section.steps.map((step, idx) => (
                  <div key={`step-${idx}`} className="step-card-h" style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="step-num-circle" style={{ background: sectionColors[sIdx % sectionColors.length].gradient }}>
                      {parseInt(step.number, 10)}
                    </div>
                    <div className={`step-card-info ${!step.image ? 'md:col-span-2' : ''}`}>
                      <h4>Bước {step.number}</h4>
                      <p>{step.description}</p>
                    </div>
                    {step.image && (
                      <div className="step-screenshot">
                        <img src={step.image} alt={`Bước ${step.number}`} loading="lazy" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* === EXCHANGE RATE TABLE === */}
          <div id="bang-diem" ref={tableSection.ref} className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="step-num-circle" style={{ background: 'linear-gradient(135deg, #eab308, #f97316)', fontSize: 20 }}>💰</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--site-primary)' }}>
                  Bảng quy đổi
                </div>
                <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 900, color: 'var(--site-text)', margin: 0 }}>
                  Điểm bình chọn & Giá trị quy đổi
                </h2>
              </div>
            </div>

            <p className={`text-sm mb-6 ${tableSection.visible ? 'fade-up' : 'opacity-0'}`} style={{ color: 'var(--site-muted)' }}>
              Điểm bình chọn miễn phí hàng ngày cấp cho mỗi tài khoản đã đăng nhập hệ thống.
            </p>

            <div className={`exchange-table-wrap ${tableSection.visible ? 'fade-up fade-up-d1' : 'opacity-0'}`}>
              <div className="exchange-table-head">
                <span>Gói bình chọn</span>
                <span>Giá trị</span>
              </div>
              {exchangeRates.map((rate, index) => {
                const isFree = rate.price.toLowerCase().includes('miễn phí') || rate.price === '0';
                return (
                  <div key={index} className={`exchange-row ${isFree ? 'free-row' : ''}`}>
                    <span className="exchange-points">
                      {isFree && <span style={{ marginRight: 6 }}>🆓</span>}
                      {rate.points}
                    </span>
                    <span className="exchange-price">{rate.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* === FAQ SECTION === */}
          <div id="faq" ref={faqSection.ref} className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="step-num-circle" style={{ background: 'linear-gradient(135deg, #8b5cf6, #c084fc)', fontSize: 20 }}>❓</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--site-primary)' }}>
                  Câu hỏi thường gặp
                </div>
                <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 900, color: 'var(--site-text)', margin: 0 }}>
                  Giải đáp thắc mắc
                </h2>
              </div>
            </div>

            <div className={`flex flex-col gap-3 ${faqSection.visible ? 'fade-up' : 'opacity-0'}`}>
              {faqItems.map((item, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div id={`faq-answer-${i}`} className="faq-answer" aria-hidden={openFaq !== i}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* === CTA Section === */}
          <div className="mt-20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A2FFF 0%, #79BCC2 100%)', padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
            <h3 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
              Sẵn sàng bình chọn?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, maxWidth: 480, margin: '0 auto 24px' }}>
              Hãy đăng nhập và ủng hộ dự án yêu thích của bạn ngay hôm nay!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/bang-xep-hang" className="hero-btn-primary">
                🏆 Xem Bảng Xếp Hạng
              </Link>
              <Link href="/dang-nhap" className="rules-login-cta">
                Đăng nhập bình chọn →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
