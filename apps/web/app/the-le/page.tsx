'use client';

import React from 'react';

export default function TheLePage() {
  return (
    <>
      <main className="bg-[#030101] flex-1">
        <div className="sc-1a037b37-0 hfAPBN">
          <div className="mt-3 sm:mt-[64px] sm:space-y-[64px]">
            
            {/* Header titles */}
            <div className="block sm:hidden mb-3">
              <div className="flex flex-col space-y-xl text-center">
                <div className="flex flex-col space-y-1.5">
                  <h2 className="text-[22px] sm:text-[42px] tracking-[-1px] leading-[27px] sm:leading-[52px] font-normal uppercase text-white mobile:!text-[24px]">
                    THỂ LỆ &amp; HƯỚNG DẪN THANH TOÁN
                  </h2>
                </div>
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex flex-col space-y-xl text-center">
                <div className="flex flex-col space-y-1.5">
                  <h2 className="text-[22px] sm:text-[42px] tracking-[-1px] leading-[27px] sm:leading-[52px] font-normal uppercase text-white">
                    THỂ LỆ &amp; HƯỚNG DẪN THANH TOÁN
                  </h2>
                  <h3 className="text-[16px] sm:text-[28px] py-1 leading-[24px] uppercase font-normal text-white">
                    HUIT's Iconic
                  </h3>
                </div>
              </div>
            </div>

            {/* Step Guides */}
            <div className="sm:py-4 space-y-[36px] sm:space-y-[56px]">
              
              {/* Free vote guide */}
              <div className="flex flex-col items-center">
                <p className="text-center text-white my-[10px] text-[18px] sm:text-[22px] font-bold uppercase tracking-wider">
                  Hướng dẫn bình chọn miễn phí
                </p>
                <div className="flex flex-col gap-1.5 sm:gap-4 mt-3 sm:mt-1.5 items-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 1</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Tạo tài khoản hoặc <b>Đăng nhập với Google</b></p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/imagefca6.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 2</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Xác thực email</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/imagef1be.png"/>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 3</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Bình chọn thí sinh yêu thích</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image81d3.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 4</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Bình chọn thành công</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image20da.png"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* VNPay guide */}
              <div className="flex flex-col items-center pt-8 border-t border-white/5">
                <p className="text-center text-white my-[10px] text-[18px] sm:text-[22px] font-bold uppercase tracking-wider">
                  Thanh toán qua VNPay
                </p>
                <div className="flex flex-col gap-1.5 sm:gap-4 mt-3 sm:mt-1.5 items-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 1</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Chọn thí sinh yêu thích</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image17ae.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 2</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Chọn gói điểm và thanh toán qua <b>VNPay</b></p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/imageefc9.png"/>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 3</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Quét mã QR và nhập mã ưu đãi <b>1ZONEVNPay</b></p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image837f.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 4</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Bình chọn thành công</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image20da.png"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* MoMo guide */}
              <div className="flex flex-col items-center pt-8 border-t border-white/5">
                <p className="text-center text-white my-[10px] text-[18px] sm:text-[22px] font-bold uppercase tracking-wider">
                  Thanh toán qua MOMO
                </p>
                <div className="flex flex-col gap-1.5 sm:gap-4 mt-3 sm:mt-1.5 items-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 1</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Chọn thí sinh yêu thích</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image17ae.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 2</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Chọn gói điểm và thanh toán qua <b>MOMO</b></p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image8ca3.png"/>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 3</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Quét mã QR qua app <b>MOMO</b></p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/imagebf6f.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 4</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Bình chọn thành công</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image20da.png"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* PayPal guide */}
              <div className="flex flex-col items-center pt-8 border-t border-white/5">
                <p className="text-center text-white my-[10px] text-[18px] sm:text-[22px] font-bold uppercase tracking-wider">
                  Thanh toán qua Paypal
                </p>
                <div className="flex flex-col gap-1.5 sm:gap-4 mt-3 sm:mt-1.5 items-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 1</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Chọn thí sinh yêu thích</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image17ae.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 2</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Chọn gói điểm và thanh toán qua <b>Paypal</b></p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image9d6d.png"/>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 3</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Nhập thông tin thanh toán</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image1206.png"/>
                    </div>
                    <div className="flex flex-col items-center max-w-[431px]">
                      <div className="gradient-border px-3 py-1 border border-[#79BCC2] rounded-full mb-1.5 flex items-center bg-[#79BCC2]/10">
                        <p className="text-white text-[12px] font-bold">Bước 4</p>
                      </div>
                      <p className="text-[14px] text-white leading-[22px] text-center">Bình chọn thành công</p>
                      <img alt="guidelineStep" width="431" height="244" className="mt-1.5 rounded-lg border border-white/10" src="/original_assets/image20da.png"/>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Detailed Rules text container */}
        <div className="sc-1a037b37-0 ekqPrV flex flex-col items-center mt-12">
          <div className="px-4 py-6 w-full max-w-[894px] space-y-3 bg-[#1C1F25] rounded-[12px] border border-grey-darkGrey">
            <div className="flex flex-col text-center border-b border-white/5 pb-3">
              <p className="text-[18px] sm:text-[20px] text-white font-bold uppercase tracking-wider">
                Chi tiết Thể lệ
              </p>
            </div>
            <div className="text-[14px] text-white/80 space-y-2 leading-relaxed">
              <p>- Thí sinh có điểm bình chọn cao nhất tính đến 18:00 3/11 sẽ dành danh hiệu “HUIT’s Warrior” và vào thẳng TOP 11 chung cuộc.</p>
              <p>- Cổng bình chọn sẽ tiếp tục được mở từ 18:30 3/11 - 18:00 24/11, Thí sinh có điểm bình chọn cao nhất sẽ dành danh hiệu “Thí sinh được yêu thích nhất”.</p>
            </div>
          </div>
        </div>

        {/* Convert points chart */}
        <div className="sc-1a037b37-0 RKByV mt-12 pb-16">
          <div className="px-3 sm:px-0 space-y-6">
            
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-[22px] sm:text-[42px] font-normal uppercase text-white">Quy đổi điểm</h2>
              <h3 className="text-[16px] sm:text-[28px] py-1 uppercase font-normal text-white">HUIT's Iconic</h3>
            </div>
            
            <div className="w-full flex flex-col items-center space-y-6">
              <div className="max-w-[874px]">
                <p className="text-[14px] leading-[22px] text-white/70 text-center">
                  Bảng quy đổi điểm bình chọn theo các gói. Điểm bình chọn chỉ được ghi nhận khi hệ thống VNPay và Momo ghi nhận giao dịch bình chọn thành công và đúng thời gian đã quy định của cổng bình chọn. Mỗi tài khoản có 01 lượt bình chọn miễn phí / ngày
                </p>
              </div>

              {/* Chart Grid */}
              <div className="flex flex-col sm:flex-row w-full max-w-[874px] gap-6 items-center sm:items-start">
                <div className="flex-1 w-full rounded-lg overflow-hidden divide-y divide-grey-dimGrey border border-white/10">
                  
                  <div className="flex bg-[rgba(255,255,255,0.15)] font-bold text-[15px]">
                    <div className="flex-1 h-[56px] px-4 flex items-center text-white">Gói điểm</div>
                    <div className="flex-1 h-[56px] px-4 flex items-center text-white">Số tiền</div>
                  </div>
                  
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">5 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">Miễn phí</div>
                  </div>
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">10 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">10,000 VND</div>
                  </div>
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">20 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">20,000 VND</div>
                  </div>
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">50 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">50,000 VND</div>
                  </div>
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">220 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">100,000 VND</div>
                  </div>
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">1,050 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">500,000 VND</div>
                  </div>
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">2,300 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">1,000,000 VND</div>
                  </div>
                  <div className="flex bg-[#1B1B1B] text-[14px]">
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">7,000 Điểm</div>
                    <div className="flex-1 h-[50px] px-4 flex items-center text-white/80">3,000,000 VND</div>
                  </div>

                </div>

                <a className="focus:outline-none max-w-[282px] block flex-shrink-0" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/">
                  <img alt="ads-banner" className="rounded-lg border border-white/5" src="/original_assets/image98dd.png"/>
                </a>
              </div>
            </div>

          </div>
        </div>

      </main>
    </>
  );
}
