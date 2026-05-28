'use client';

import React, { useState, useEffect } from 'react';
import { useAlert } from '../AlertProvider';

export default function LoginPage() {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('abcxyz@mail.com');
  const [password, setPassword] = useState('Mật khẩu');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await showAlert(`Đăng nhập thành công với tài khoản: ${email}\nChuyển hướng về trang chủ.`, 'success', 'Đăng nhập thành công');
    window.location.href = '/';
  };

  const handleGoogleLogin = async () => {
    await showAlert('Kết nối dịch vụ Google thành công! Đăng nhập offline thành công.\nChuyển hướng về trang chủ.', 'success', 'Đăng nhập thành công');
    window.location.href = '/';
  };

  const handleOfflineAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    showAlert('Tính năng đang được phát triển ở chế độ offline!', 'info', 'Thông báo');
  };

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
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.06); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0,0); }
          33%       { transform: translate(20px,-15px); }
          66%       { transform: translate(-10px, 10px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .anim-up    { animation: fadeSlideUp    0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-left  { animation: fadeSlideLeft  0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-right { animation: fadeSlideRight 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-d100  { animation-delay: 100ms; }
        .anim-d200  { animation-delay: 200ms; }
        .anim-d300  { animation-delay: 300ms; }
        .anim-d400  { animation-delay: 400ms; }
        .anim-d500  { animation-delay: 500ms; }
        .anim-d600  { animation-delay: 600ms; }
        .anim-d700  { animation-delay: 700ms; }
        .orb1 { animation: orbFloat 10s ease-in-out infinite; }
        .orb2 { animation: orbFloat 14s ease-in-out infinite reverse; }
        .orb3 { animation: glowPulse 7s ease-in-out infinite; }

        /* Input focus ring */
        .login-input {
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }
        .login-input:focus {
          border-color: #79BCC2 !important;
          box-shadow: 0 0 0 3px rgba(121,188,194,0.18), 0 0 16px rgba(121,188,194,0.12);
          background-color: rgba(255,255,255,0.97) !important;
          outline: none;
        }
        /* Login button */
        .btn-login {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease,
                      background-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-login::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .btn-login:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(10,47,255,0.28), 0 0 20px rgba(121,188,194,0.18);
        }
        .btn-login:hover::after {
          opacity: 1;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .btn-login:active { transform: translateY(0) scale(0.99); }

        /* Google button */
        .btn-google {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease,
                      background-color 0.3s ease,
                      border-color 0.3s ease;
        }
        .btn-google:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 32px rgba(10,47,255,0.2), 0 0 20px rgba(121,188,194,0.16);
          border-color: rgba(121,188,194,0.6) !important;
          background-color: rgba(10,47,255,0.22) !important;
        }
        .btn-google:active { transform: scale(0.99); }

        /* Divider separator */
        .separator-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }

        /* Card wrapper */
        .login-card {
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .login-card:hover {
          box-shadow: 0 32px 80px rgba(0,0,0,0.55), 0 0 40px rgba(121,188,194,0.06), inset 0 1px 0 rgba(255,255,255,0.08);
          border-color: rgba(121,188,194,0.12);
        }
        .link-hover {
          transition: color 0.2s ease, letter-spacing 0.2s ease;
        }
        .link-hover:hover {
          color: #79BCC2;
          letter-spacing: 0.03em;
        }
        .floating-icon {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <main className="sc-908a50-0 iUzfqH flex-1 w-full min-h-[calc(100vh-80px-200px)] flex flex-col justify-center items-center py-16 sm:py-24 px-6 overflow-hidden relative">

        {/* Multi-layer ambient glows */}
        <div className="orb1 absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#0A2FFF]/12 to-transparent blur-[120px] pointer-events-none" />
        <div className="orb2 absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#79BCC2]/10 to-transparent blur-[130px] pointer-events-none" />
        <div className="orb3 absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-[#0A2FFF]/6 via-[#79BCC2]/6 to-[#0A2FFF]/6 blur-[80px] pointer-events-none" />

        {/* Decorative bottom glow */}
        <div className="absolute left-0 right-0 bottom-0 w-full h-[240px] opacity-20 pointer-events-none z-0" style={{
          backgroundImage: 'radial-gradient(ellipse at bottom, #79BCC2 0%, transparent 70%)'
        }}></div>

        {/* Floating decorative icon */}
        <div className={`floating-icon absolute top-16 right-12 opacity-10 hidden lg:block ${mounted ? 'anim-right anim-d600' : 'opacity-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" stroke="#79BCC2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="40" cy="28" r="14"></circle>
            <path d="M12 72v-4a20 20 0 0 1 20-20h16a20 20 0 0 1 20 20v4"></path>
          </svg>
        </div>
        <div className={`floating-icon absolute bottom-24 left-12 opacity-10 hidden lg:block ${mounted ? 'anim-left anim-d700' : 'opacity-0'}`} style={{ animationDelay: '3s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" stroke="#0A2FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        </div>

        {/* Main content card */}
        <div className={`login-card w-full max-w-[920px] rounded-[32px] p-8 sm:p-12 z-10 ${mounted ? 'anim-up' : 'opacity-0'}`}>

          {/* Header */}
          <div className={`text-center mb-10 ${mounted ? 'anim-up anim-d100' : 'opacity-0'}`}>
            <h1 className="text-[28px] sm:text-[36px] font-extrabold text-white uppercase tracking-[0.06em] mb-1">
              Đăng nhập
            </h1>
            <p className="text-[13px] text-white/40 tracking-wider">HUIT&apos;s Iconic 2024 — Cổng bình chọn chính thức</p>
            <div className="h-[2.5px] w-[50px] bg-gradient-to-r from-[#0A2FFF] to-[#79BCC2] mx-auto rounded-full mt-4 transition-all duration-[1000ms]" style={{ width: mounted ? '50px' : '0px' }} />
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16">

            {/* Left Column: Email/Password Form */}
            <form onSubmit={handleSubmit} className={`w-full max-w-[360px] flex flex-col space-y-5 ${mounted ? 'anim-left anim-d200' : 'opacity-0'}`}>

              {/* Email input */}
              <div className="flex flex-col space-y-2 w-full">
                <label className="text-white/80 text-[13px] font-semibold tracking-wide flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#79BCC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                    <polyline points="22,4 12,13 2,4"></polyline>
                  </svg>
                  Địa chỉ email
                </label>
                <input
                  type="email"
                  className="login-input w-full h-[48px] px-4 rounded-[14px] bg-white/90 text-neutral-800 border-2 border-transparent text-[15px]"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password input */}
              <div className="flex flex-col space-y-2 w-full relative">
                <label className="text-white/80 text-[13px] font-semibold tracking-wide flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#79BCC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Mật khẩu
                </label>
                <div className="relative w-full h-[48px]">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input w-full h-full pl-4 pr-12 rounded-[14px] bg-white/90 text-neutral-800 border-2 border-transparent text-[15px]"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => { if (password === 'Mật khẩu') setPassword(''); }}
                    onBlur={() => { if (password === '') setPassword('Mật khẩu'); }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right -mt-1">
                <a
                  href="#"
                  onClick={handleOfflineAlert}
                  className="link-hover text-white/50 text-[12px] font-medium underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn-login w-full h-[50px] bg-gradient-to-r from-[#0A2FFF] to-[#1a5aff] border border-[#79BCC2]/30 rounded-[14px] text-white font-bold flex items-center justify-center text-[15px] tracking-widest uppercase"
              >
                Đăng nhập
              </button>
            </form>

            {/* Separator */}
            <div className={`flex flex-row md:flex-col items-center justify-center gap-4 ${mounted ? 'anim-up anim-d300' : 'opacity-0'}`}>
              <div className="separator-line w-16 md:w-px md:h-16" />
              <span className="text-white/30 text-[11px] font-bold tracking-[0.2em] uppercase">Hoặc</span>
              <div className="separator-line w-16 md:w-px md:h-16" />
            </div>

            {/* Right Column: Google Login & Signup */}
            <div className={`w-full max-w-[360px] flex flex-col items-center justify-center space-y-6 ${mounted ? 'anim-right anim-d400' : 'opacity-0'}`}>

              {/* Social label */}
              <p className="text-white/40 text-[12px] font-semibold tracking-widest uppercase text-center">
                Đăng nhập nhanh
              </p>

              {/* Google Sign-in Button */}
              <button
                onClick={handleGoogleLogin}
                className="btn-google w-full max-w-[320px] flex items-center gap-4 p-4 rounded-[16px] bg-[rgba(10,47,255,0.12)] border border-[#79BCC2]/30 text-left"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-[10px] flex-shrink-0 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-[10px] text-white/40 font-normal tracking-wide leading-none">Xác thực an toàn qua tài khoản Google</span>
                  <span className="text-[14px] text-white font-bold tracking-wide leading-none mt-1">Đăng nhập với Google</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#79BCC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-60">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              {/* Register link */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <p className="text-white/30 text-[12px]">Chưa có tài khoản?</p>
                <a
                  href="#"
                  onClick={handleOfflineAlert}
                  className="link-hover text-[#79BCC2] text-[14px] font-semibold underline-offset-4 hover:underline"
                >
                  Đăng ký ngay →
                </a>
              </div>

            </div>
          </div>
        </div>

      </main>
    </>
  );
}
