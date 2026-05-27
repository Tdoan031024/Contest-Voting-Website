'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('abcxyz@mail.com');
  const [password, setPassword] = useState('Mật khẩu');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đăng nhập thành công với tài khoản: ${email}\nChuyển hướng về trang chủ.`);
    window.location.href = '/';
  };

  const handleGoogleLogin = () => {
    alert('Kết nối dịch vụ Google thành công! Đăng nhập offline thành công.\nChuyển hướng về trang chủ.');
    window.location.href = '/';
  };

  const handleOfflineAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Tính năng đang được phát triển ở chế độ offline!');
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
      `}</style>

      <main className="sc-908a50-0 iUzfqH flex-1 w-full min-h-[calc(100vh-80px-200px)] flex flex-col justify-center items-center py-16 sm:py-24 px-6 overflow-hidden">
        
        {/* Decorative bottom glow graphic */}
        <div className="absolute left-0 right-0 bottom-0 w-full h-[240px] opacity-20 pointer-events-none z-0" style={{
          backgroundImage: 'radial-gradient(ellipse at bottom, #79BCC2 0%, transparent 70%)'
        }}></div>

        <div className="w-full max-w-[900px] flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 z-10 box-sizing-border-box">
          
          {/* Left Column: Email/Password Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[360px] flex flex-col space-y-5">
            <h2 className="text-[24px] font-bold text-white uppercase tracking-wider text-center">
              Đăng nhập
            </h2>
            
            {/* Email input */}
            <div className="flex flex-col space-y-2 w-full">
              <label className="text-white text-[13px] font-medium tracking-wide">
                Địa chỉ email
              </label>
              <input
                type="email"
                className="w-full h-[46px] px-4 rounded-[12px] bg-grey-lightGrey2 text-neutral-neutral1 border-2 border-transparent focus:border-primary focus:bg-white outline-none text-[15px] transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password input */}
            <div className="flex flex-col space-y-2 w-full relative">
              <label className="text-white text-[13px] font-medium tracking-wide">
                Mật khẩu
              </label>
              <div className="relative w-full h-[46px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-full pl-4 pr-12 rounded-[12px] bg-grey-lightGrey2 text-neutral-neutral1 border-2 border-transparent focus:border-primary focus:bg-white outline-none text-[15px] transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => { if (password === 'Mật khẩu') setPassword(''); }}
                  onBlur={() => { if (password === '') setPassword('Mật khẩu'); }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-dimGrey hover:text-black transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center pt-1">
              <a
                href="#"
                onClick={handleOfflineAlert}
                className="text-white hover:text-secondary text-[13px] font-medium transition-colors hover:underline underline-offset-4"
              >
                Quên mật khẩu
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-[46px] bg-[rgba(10,47,255,0.15)] hover:bg-[rgba(10,47,255,0.3)] border border-[#79BCC2] rounded-[12px] text-white font-semibold flex items-center justify-center transition-all text-[15px] tracking-wide"
            >
              Đăng nhập
            </button>
          </form>

          {/* Separator - No lines matching screenshot */}
          <div className="flex flex-row md:flex-col items-center justify-center gap-4">
            <span className="text-white/40 text-[12px] font-semibold tracking-widest uppercase">
              Hoặc
            </span>
          </div>

          {/* Right Column: Google Login & Signup link */}
          <div className="w-full max-w-[360px] flex flex-col items-center justify-center space-y-6">
            
            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full max-w-[320px] flex items-center gap-4 p-3 rounded-[12px] bg-[rgba(10,47,255,0.15)] hover:bg-[rgba(10,47,255,0.25)] border border-[#79BCC2] transition-all text-left"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-[8px] flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] text-white/50 font-normal tracking-wide leading-none">Truy cập web từ trình duyệt của thiết...</span>
                <span className="text-[14px] text-white font-bold tracking-wide leading-none mt-1">Đăng nhập với Google</span>
              </div>
            </button>

            {/* Register link */}
            <div className="pt-1">
              <a
                href="#"
                onClick={handleOfflineAlert}
                className="text-white hover:text-secondary text-[13px] font-medium transition-colors hover:underline underline-offset-4"
              >
                Đăng ký tài khoản
              </a>
            </div>

          </div>

        </div>

      </main>
    </>
  );
}
