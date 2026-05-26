'use client';

import React, { useState, useEffect } from 'react';
import { Candidate } from '@huitfest/shared';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface CandidateExtendedDetails {
  birthYear: string;
  department: string;
  height: string;
  weight: string;
  measurements: string;
  rank: number;
}

const CANDIDATE_METADATA_MAP: Record<string, CandidateExtendedDetails> = {
  '085': { birthYear: '2005', department: 'QUẢN TRỊ KINH DOANH', height: '174 cm', weight: '65 kg', measurements: '93-80-98', rank: 1 },
  '089': { birthYear: '2004', department: 'CÔNG NGHỆ THÔNG TIN', height: '178 cm', weight: '68 kg', measurements: '95-82-96', rank: 2 },
  '024': { birthYear: '2005', department: 'NGOẠI NGỮ', height: '165 cm', weight: '48 kg', measurements: '86-60-90', rank: 3 },
  '096': { birthYear: '2004', department: 'CÔNG NGHỆ THỰC PHẨM', height: '180 cm', weight: '72 kg', measurements: '96-84-97', rank: 4 },
  '018': { birthYear: '2005', department: 'TÀI CHÍNH NGÂN HÀNG', height: '168 cm', weight: '50 kg', measurements: '88-62-92', rank: 5 },
  '095': { birthYear: '2005', department: 'LUẬT', height: '163 cm', weight: '46 kg', measurements: '84-59-88', rank: 6 },
};

const LOCAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Nguyễn Thanh Tân', votes: 106100, imageUrl: '/original_assets/image389b.png', description: 'Thí sinh tài năng của HUIT\'s Iconic 2024.' },
  { id: '2', sbd: '089', name: 'Nguyễn Đình Tú', votes: 62215, imageUrl: '/original_assets/image725f.png', description: 'Chiến binh bản lĩnh mang màu sắc nhiệt huyết.' },
  { id: '3', sbd: '024', name: 'Lê Ngọc Yến Vy', votes: 22800, imageUrl: '/original_assets/image940e.jpg', description: 'Đại diện cho vẻ đẹp tri thức và sự duyên dáng.' },
  { id: '4', sbd: '096', name: 'Võ Bá Thiện', votes: 20590, imageUrl: '/original_assets/image8681.png', description: 'Nụ cười tỏa nắng cùng trái tim ấm áp.' },
  { id: '5', sbd: '018', name: 'Trần Tuyết Ngân', votes: 16070, imageUrl: '/original_assets/imageada2.png', description: 'Gương mặt cá tính đầy bứt phá.' },
  { id: '6', sbd: '095', name: 'Nguyễn Thị Cẩm Thanh', votes: 8410, imageUrl: '/original_assets/image4706.png', description: 'Sự kết hợp hoàn hảo giữa năng động và dịu dàng.' },
];

export default function CandidateDetailPage() {
  const params = useParams();
  const sbd = params.sbd as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidatesList, setCandidatesList] = useState<Candidate[]>(LOCAL_MOCK_CANDIDATES);
  const [isLoading, setIsLoading] = useState(true);
  const [copyText, setCopyText] = useState('SAO CHÉP');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/candidates`);
        if (res.ok) {
          const list = await res.json();
          setCandidatesList(list);
          const found = list.find((c: Candidate) => c.sbd === sbd);
          if (found) {
            setCandidate(found);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log('NestJS Backend API offline, using local mock candidate detail.');
      }
      
      const found = LOCAL_MOCK_CANDIDATES.find(c => c.sbd === sbd);
      setCandidate(found || null);
      setIsLoading(false);
    }
    loadData();
  }, [sbd]);

  const handleVote = async () => {
    if (!candidate) return;
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${candidate.sbd}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0987654321' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidate(updated);
        alert(`Bình chọn thành công cho ${updated.name}!`);
        return;
      }
    } catch (err) {
      console.log('NestJS Backend API offline, executing client-side mock vote.');
    }

    setCandidate(prev => prev ? { ...prev, votes: prev.votes + 1 } : null);
    alert(`Bình chọn offline thành công cho ${candidate.name}!`);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopyText('ĐÃ SAO CHÉP!');
      setCopied(true);
      setTimeout(() => {
        setCopyText('SAO CHÉP');
        setCopied(false);
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex justify-center items-center py-20 text-white">
        Đang tải thông tin thí sinh...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center items-center py-20 text-white/60">
        <h3 className="text-[20px] font-bold">Không tìm thấy thí sinh</h3>
        <Link href="/" className="text-secondary hover:underline mt-4 text-[14px]">Quay lại trang chủ</Link>
      </div>
    );
  }

  // Get rank dynamically from current scores list
  const sorted = [...candidatesList].sort((a, b) => b.votes - a.votes);
  const currentRank = sorted.findIndex(c => c.sbd === candidate.sbd) + 1;

  // Retrieve metadata
  const meta = CANDIDATE_METADATA_MAP[candidate.sbd] || {
    birthYear: '2005',
    department: 'QUẢN TRỊ KINH DOANH',
    height: '172 cm',
    weight: '60 kg',
    measurements: '90-75-92',
    rank: currentRank
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

      <main className="sc-908a50-0 iUzfqH flex-1 pb-[100px]">
        <div className="sc-1a037b37-0 hfAPBN relative">
          <div className="pt-0 pb-4 mt-4 sm:mt-8 flex flex-col md:flex-row gap-4 md:gap-0 md:space-x-[113px] justify-center">
            
            {/* Candidate image */}
            <div className="w-full md:w-[533px] lg:w-[577px] md:flex">
              <div className="w-full">
                <div className="relative flex justify-center">
                  <div className="relative w-[100vw] max-w-full h-[calc(100vw/533*711)] md:w-[533px] sm:h-[100vw] md:h-[711px] overflow-hidden rounded-[20px]">
                    <img 
                      alt="Avatar" 
                      className="rounded-[20px] transition-all duration-[700ms] object-cover object-top opacity-100 scale-100 w-full h-full" 
                      src={candidate.imageUrl}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile specifications */}
            <div className="gap-3 flex flex-col justify-between">
              <div>
                {/* Wreath Rank Wreath */}
                <div className="flex h-[64px] gap-3 md:h-[100px] md:gap-4 mb-4">
                  <div className="relative">
                    <div className="hidden sm:block w-[71.5px] sm:w-[100px]">
                      <img alt="" className="block dark:hidden" src="/original_assets/static/media/laurel-light-big.58ee16d9.svg"/>
                      <img alt="" className="hidden dark:block" src="/original_assets/static/media/laurel-dark-big.6d9a838c.svg"/>
                    </div>
                    <div className="block sm:hidden w-[71.5px]">
                      <img alt="" className="block dark:hidden" src="/original_assets/static/media/laurel-light-small.27b47318.svg"/>
                      <img alt="" className="hidden dark:block" src="/original_assets/static/media/laurel-dark-small.e0887cc3.svg"/>
                    </div>
                    <div className="hidden sm:block absolute w-full text-center top-[20px]">
                      <h3 className="text-h3 text-grey-darkGrey dark:text-grey-lightGrey2">{currentRank}</h3>
                    </div>
                    <div className="block sm:hidden absolute w-full text-center top-[18px]">
                      <span className="text-grey-darkGrey dark:text-grey-lightGrey2 text-[24px] font-semibold leading-[120%] tracking-[-0.48px]">{currentRank}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-[6px]">
                  <p className="text-[14px] text-grey-lightGrey1 leading-[24px] tracking-wide">Thí sinh HUIT's Iconic</p>
                  <h3 className="text-[28px] sm:text-[34px] font-extrabold text-neutral-neutral1 dark:text-white leading-tight">
                    {candidate.name}
                  </h3>
                </div>

                <div className="flex flex-col space-y-[6px] mt-4">
                  <p className="text-[14px] text-grey-lightGrey1 leading-[24px] tracking-wide">Tổng điểm</p>
                  <h4 className="text-[24px] sm:text-[30px] font-bold text-rose-600 dark:text-blue-500">
                    {candidate.votes.toLocaleString()}
                  </h4>
                </div>

                {/* Profile table */}
                <div className="flex flex-col space-y-2 mt-6">
                  <p className="text-[16px] font-semibold text-neutral-neutral1 dark:text-white mt-1 border-b border-white/5 pb-2">
                    Thông tin
                  </p>
                  <div className="space-y-2 text-[14px] text-neutral-neutral1 dark:text-white">
                    <div className="flex space-x-1.5">
                      <div className="w-[113px] text-white/60">SBD</div>
                      <p>:</p>
                      <p className="flex-1 font-bold">{candidate.sbd}</p>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-[113px] text-white/60">Năm sinh</div>
                      <p>:</p>
                      <p className="flex-1">{meta.birthYear}</p>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-[113px] text-white/60">Khoa</div>
                      <p>:</p>
                      <p className="flex-1">{meta.department}</p>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-[113px] text-white/60">Chiều cao</div>
                      <p>:</p>
                      <p className="flex-1">{meta.height}</p>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-[113px] text-white/60">Cân nặng</div>
                      <p>:</p>
                      <p className="flex-1">{meta.weight}</p>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-[113px] text-white/60">Số đo 3 vòng</div>
                      <p>:</p>
                      <p className="flex-1">{meta.measurements}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share box links */}
              <div className="flex mt-6 md:items-center px-4 py-3 bg-grey-lightGrey3 dark:bg-grey-dimGrey rounded-xl flex-col md:flex-row gap-3 border border-white/5 max-w-[562px]">
                <div className="flex-1">
                  <p className="text-[13px] text-black dark:text-white leading-snug">
                    Chia sẻ đường dẫn bình chọn tới người hâm mộ!
                  </p>
                </div>
                <button 
                  onClick={handleCopyLink}
                  className="bg-transparent border-0 cursor-pointer flex space-x-2 items-center hover:opacity-85"
                >
                  <p className={`text-[14px] font-bold text-black dark:text-white ${copied ? 'text-green-400' : ''}`}>
                    {copyText}
                  </p>
                  <div className="fill-neutral-neutral1 dark:fill-neutral-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 24">
                      <path d="M15.5 1H4.5C3.4 1 2.5 1.9 2.5 3V16C2.5 16.55 2.95 17 3.5 17C4.05 17 4.5 16.55 4.5 16V4C4.5 3.45 4.95 3 5.5 3H15.5C16.05 3 16.5 2.55 16.5 2C16.5 1.45 16.05 1 15.5 1ZM19.5 5H8.5C7.4 5 6.5 5.9 6.5 7V21C6.5 22.1 7.4 23 8.5 23H19.5C20.6 23 21.5 22.1 21.5 21V7C21.5 5.9 20.6 5 19.5 5ZM18.5 21H9.5C8.95 21 8.5 20.55 8.5 20V8C8.5 7.45 8.95 7 9.5 7H18.5C19.05 7 19.5 7.45 19.5 8V20C19.5 20.55 19.05 21 18.5 21Z" fill="currentColor"></path>
                    </svg>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Voting history of candidate */}
        <div className="w-full h-[1px] bg-white/5 my-8"></div>

        <div className="sc-1a037b37-0 ekqPrV relative">
          <div className="py-3 md:px-8">
            <h2 className="text-[22px] sm:text-[28px] text-center font-bold text-neutral-neutral1 dark:text-white uppercase tracking-wider">
              Lịch sử bình chọn
            </h2>
            <h5 className="text-[14px] text-center mt-2 capitalize font-bold text-neutral-neutral1 dark:text-neutral-white">
              {candidate.name}
            </h5>
            <p className="text-[12px] text-center mt-1 leading-[24px] uppercase text-white/50 tracking-wider">
              HUIT's Iconic
            </p>

            <div className="flex flex-col md:flex-row gap-6 mt-8 md:justify-center items-start">
              
              {/* Left: Transaction table */}
              <div className="flex flex-col w-full md:max-w-[586px]">
                <div className="flex justify-center">
                  <div className="rounded-lg overflow-hidden w-full md:w-[989px] border border-white/10">
                    
                    <div className="p-3 flex bg-[rgba(255,255,255,0.06)] border-b border-white/5 font-semibold text-[13px] text-white">
                      <div className="flex-1">Mã giao dịch</div>
                      <div className="flex-1">Thời gian</div>
                    </div>
                    
                    <div className="bg-[#1C1F25]/40 divide-y divide-white/5 text-[14px] text-white/80">
                      <div className="p-3 flex">
                        <div className="flex-1">fB***13</div>
                        <div className="flex-1">24/11/2024 19:40</div>
                      </div>
                      <div className="p-3 flex">
                        <div className="flex-1">L0***qa</div>
                        <div className="flex-1">24/11/2024 17:43</div>
                      </div>
                      <div className="p-3 flex">
                        <div className="flex-1">up***4Q</div>
                        <div className="flex-1">24/11/2024 16:37</div>
                      </div>
                      <div className="p-3 flex">
                        <div className="flex-1">ca***R1</div>
                        <div className="flex-1">24/11/2024 14:31</div>
                      </div>
                      <div className="p-3 flex">
                        <div className="flex-1">Ak***F5</div>
                        <div className="flex-1">24/11/2024 14:30</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right: Ad banner */}
              <div className="flex mobile:w-full mobile:justify-center flex-shrink-0">
                <a className="focus:outline-none max-w-[282px] block" target="_blank" rel="noopener noreferrer" href="https://eventistax.com/">
                  <img alt="ads-banner" className="w-full rounded-lg border border-white/5" src="/original_assets/image98dd.png"/>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Floating sticky bottom actions bar */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-primary dark:bg-white border-t border-white/10 dark:border-black/10">
          <div className="sc-1a037b37-0 ekqPrV">
            <div className="h-[90px] flex items-center justify-between px-4">
              
              {/* Left Column: Avatar & Name */}
              <div className="hidden sm:flex flex-1 space-x-4">
                <div className="relative w-10 h-10 rounded-[64px] overflow-hidden border border-white/20">
                  <img alt="Avatar" className="object-cover object-top w-full h-full" src={candidate.imageUrl}/>
                </div>
                <div className="flex flex-col justify-center text-[13px]">
                  <p className="text-grey-lightGrey2 dark:text-neutral-neutral1/60 leading-none">Thí sinh</p>
                  <p className="capitalize text-neutral-white dark:text-neutral-neutral1 font-bold mt-1 text-[15px] leading-none">
                    {candidate.name}
                  </p>
                </div>
              </div>

              {/* Middle Column: Votes count */}
              <div className="hidden md:flex flex-1 justify-between items-center">
                <div className="flex-1 flex flex-col items-center justify-center text-[13px]">
                  <p className="text-grey-lightGrey2 dark:text-neutral-neutral1/60 leading-none">Tổng điểm</p>
                  <h5 className="text-neutral-white font-bold dark:text-neutral-neutral1 mt-1 text-[18px] leading-none">
                    {candidate.votes.toLocaleString()}
                  </h5>
                </div>
              </div>

              {/* Right Column: Vote Button */}
              <button 
                onClick={handleVote}
                className="sc-7f525aa4-0 eyRkL flex items-center justify-center gap-2 bg-white dark:bg-primary text-neutral-neutral1 dark:text-white rounded-lg h-[50px] w-full sm:w-[200px] border-0 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all font-semibold"
              >
                <p className="text-[15px] uppercase tracking-wider font-bold">Bình chọn</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="currentColor">
                  <path d="M17.8172 10.4425L12.1922 16.0675C12.0749 16.1848 11.9159 16.2507 11.75 16.2507C11.5841 16.2507 11.4251 16.1848 11.3078 16.0675C11.1905 15.9503 11.1247 15.7912 11.1247 15.6253C11.1247 15.4595 11.1905 15.3004 11.3078 15.1832L15.8664 10.6253H3.625C3.45924 10.6253 3.30027 10.5595 3.18306 10.4423C3.06585 10.3251 3 10.1661 3 10.0003C3 9.83459 3.06585 9.67562 3.18306 9.55841C3.30027 9.4412 3.45924 9.37535 3.625 9.37535H15.8664L11.3078 4.81753C11.1905 4.70026 11.1247 4.5412 11.1247 4.37535C11.1247 4.2095 11.1905 4.05044 11.3078 3.93316C11.4251 3.81588 11.5841 3.75 11.75 3.75C11.9159 3.75 12.0749 3.81588 12.1922 3.93316L17.8172 9.55816C17.8753 9.61621 17.9214 9.68514 17.9529 9.76101C17.9843 9.83688 18.0005 9.91821 18.0005 10.0003C18.0005 10.0825 17.9843 10.1638 17.9529 10.2397C17.9214 10.3156 17.8753 10.3845 17.8172 10.4425Z"></path>
                </svg>
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Background bottom overlay */}
        <div className="fixed left-0 top-0 right-0 supports-[height:100cqh]:h-[100cqh] supports-[height:100dvh]:h-[100dvh] sm:hidden -z-50">
          <img alt="" className="absolute top-0 max-w-[1920px] max-h-[1080px] h-[1920px] w-[1080px]" src="/original_assets/image87ce.jpg"/>
        </div>

      </main>
    </>
  );
}
