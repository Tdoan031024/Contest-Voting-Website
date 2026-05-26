'use client';

import React, { useState, useEffect } from 'react';
import { Candidate } from '@huitfest/shared';
import Link from 'next/link';

const LOCAL_MOCK_CANDIDATES: Candidate[] = [
  { id: '1', sbd: '085', name: 'Nguyễn Thanh Tân', votes: 106100, imageUrl: '/original_assets/image389b.png', description: '' },
  { id: '2', sbd: '089', name: 'Nguyễn Đình Tú', votes: 62215, imageUrl: '/original_assets/image725f.png', description: '' },
  { id: '3', sbd: '024', name: 'Lê Ngọc Yến Vy', votes: 22800, imageUrl: '/original_assets/image940e.jpg', description: '' },
  { id: '4', sbd: '096', name: 'Võ Bá Thiện', votes: 20590, imageUrl: '/original_assets/image8681.png', description: '' },
  { id: '5', sbd: '018', name: 'Trần Tuyết Ngân', votes: 16070, imageUrl: '/original_assets/imageada2.png', description: '' },
  { id: '6', sbd: '095', name: 'Nguyễn Thị Cẩm Thanh', votes: 8410, imageUrl: '/original_assets/image4706.png', description: '' },
];

export default function RankingPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(LOCAL_MOCK_CANDIDATES);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadCandidates() {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/candidates');
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        }
      } catch (err) {
        console.log('NestJS Backend API offline, using local mock data.');
      } finally {
        setIsLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const handleVote = async (sbd: string, name: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${sbd}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0987654321' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidates(prev => prev.map(c => c.sbd === sbd ? updated : c));
        alert(`Bình chọn thành công cho ${name}!`);
        return;
      }
    } catch (err) {
      console.log('NestJS Backend API offline, executing client-side mock vote.');
    }

    setCandidates(prev =>
      prev.map(c => c.sbd === sbd ? { ...c, votes: c.votes + 1 } : c)
    );
    alert(`Bình chọn offline thành công cho ${name}!`);
  };

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
        
        {/* Content Wrap */}
        <div className="relative">
          <div className="sc-1a037b37-0 hfAPBN relative">
            <div className="flex flex-col items-center py-3 sm:py-[85px]">
              
              {/* Leaderboard title */}
              <div className="flex flex-col space-y-[24px] text-center">
                <div className="flex flex-col space-y-1.5">
                  <h2 className="text-[22px] sm:text-[42px] tracking-[-1px] leading-[27px] sm:leading-[52px] font-normal uppercase text-black dark:text-neutral-white">
                    Bảng xếp hạng
                  </h2>
                  <h3 className="text-[16px] sm:text-[28px] py-1 leading-[24px] uppercase font-normal text-black dark:text-neutral-white">
                    HUIT's Iconic
                  </h3>
                </div>
              </div>

              {/* Search Bar matching sample web */}
              <div className="max-w-[615px] w-full mt-3 sm:mt-[64px]">
                <div className="flex items-center space-x-[8px] rounded-[20px] px-[8px] py-[7px] border border-grey-lightGrey1 dark:border-grey-darkGrey bg-grey-lightGrey2 dark:bg-grey-dimGrey h-[60px] !px-2 rounded-[40px] w-full">
                  <div className="fill-neutral-neutral1 dark:fill-neutral-white pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                      <path d="M0 7.4353C0 6.52222 0.171549 5.66724 0.514648 4.87036C0.857747 4.06795 1.33366 3.36239 1.94238 2.75366C2.55111 2.14494 3.25391 1.66903 4.05078 1.32593C4.85319 0.982829 5.71094 0.811279 6.62402 0.811279C7.53711 0.811279 8.39209 0.982829 9.18896 1.32593C9.99137 1.66903 10.6969 2.14494 11.3057 2.75366C11.9144 3.36239 12.3903 4.06795 12.7334 4.87036C13.0765 5.66724 13.248 6.52222 13.248 7.4353C13.248 8.19344 13.1263 8.91284 12.8828 9.59351C12.6449 10.2742 12.3128 10.8912 11.8867 11.4446L15.9458 15.5286C16.0343 15.6171 16.1007 15.7195 16.145 15.8357C16.1948 15.9519 16.2197 16.0764 16.2197 16.2092C16.2197 16.3918 16.1782 16.5579 16.0952 16.7073C16.0177 16.8567 15.9071 16.9729 15.7632 17.0559C15.6193 17.1444 15.4533 17.1887 15.2651 17.1887C15.1323 17.1887 15.005 17.1638 14.8833 17.114C14.7671 17.0697 14.6592 17.0006 14.5596 16.9065L10.4756 12.8142C9.93327 13.2016 9.33561 13.5059 8.68262 13.7273C8.02962 13.9486 7.34342 14.0593 6.62402 14.0593C5.71094 14.0593 4.85319 13.8878 4.05078 13.5447C3.25391 13.2016 2.55111 12.7257 1.94238 12.1169C1.33366 11.5082 0.857747 10.8054 0.514648 10.0085C0.171549 9.20614 0 8.34839 0 7.4353ZM1.41943 7.4353C1.41943 8.1547 1.55225 8.82983 1.81787 9.46069C2.08903 10.086 2.46257 10.6366 2.93848 11.1125C3.41992 11.5885 3.97331 11.962 4.59863 12.2332C5.22949 12.5043 5.90462 12.6399 6.62402 12.6399C7.34342 12.6399 8.01579 12.5043 8.64111 12.2332C9.27197 11.962 9.82536 11.5885 10.3013 11.1125C10.7772 10.6366 11.1507 10.086 11.4219 9.46069C11.693 8.82983 11.8286 8.1547 11.8286 7.4353C11.8286 6.7159 11.693 6.04354 11.4219 5.41821C11.1507 4.78735 10.7772 4.23397 10.3013 3.75806C9.82536 3.27661 9.27197 2.90308 8.64111 2.63745C8.01579 2.36629 7.34342 2.23071 6.62402 2.23071C5.90462 2.23071 5.22949 2.36629 4.59863 2.63745C3.97331 2.90308 3.41992 3.27661 2.93848 3.75806C2.46257 4.23397 2.08903 4.78735 1.81787 5.41821C1.55225 6.04354 1.41943 6.7159 1.41943 7.4353Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <input 
                    className="w-full bg-transparent focus:outline-none text-neutral-neutral1 dark:text-neutral-white placeholder:text-neutral-neutral1 dark:placeholder:text-neutral-white pl-2 text-[14px]" 
                    placeholder="Tìm kiếm..." 
                    type="text" 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Candidates Grid for Leaderboard */}
              <div className="w-full mt-3 sm:mt-[64px]"></div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20 text-white">
                  Đang tải bảng xếp hạng...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-20 text-white/50">
                  Không tìm thấy thí sinh phù hợp
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] md:gap-[60px] justify-items-center max-w-[1110px] mx-auto px-4">
                  {filteredCandidates.map((c) => {
                    const rank = sortedCandidates.findIndex(x => x.sbd === c.sbd) + 1;
                    
                    return (
                      <div key={c.id} className="h-full group w-full mobile:max-w-[286px] sm:max-w-[340px]">
                        <div className="relative backdrop-blur-[8px] rounded-[24px] border border-transparent bg-[rgba(222,222,222,0.15)] group-hover:bg-[rgb(222,222,222)]/40 group-hover:dark:bg-[rgb(222,222,222)]/20 group-hover:shadow group-hover:shadow-black/10 group-hover:dark:shadow-white/10 cursor-pointer transition-all duration-300">
                          
                          {/* Candidate Image Link */}
                          <Link className="focus:outline-none relative flex cursor-pointer w-full aspect-[360/461]" href={`/thi-sinh/${c.sbd}`}>
                            <div className="mx-2 mt-2 flex-1 relative sm:mx-3 sm:mt-3 overflow-hidden rounded-lg">
                              <img 
                                alt={c.name} 
                                className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500" 
                                src={c.imageUrl}
                              />
                            </div>
                          </Link>

                          {/* Details section */}
                          <div className="flex-1 flex flex-col px-3 pt-2 pb-3">
                            <div className="flex-1 flex flex-col justify-between space-y-2">
                              
                              <div className="rounded-[12px] flex justify-between items-center px-3 py-0.5 bg-grey-lightGrey2 dark:bg-grey-dimGrey h-[36px]">
                                <div className="flex sm:hidden w-[72px] text-center gap-[6px] items-center">
                                  <span className="text-[12px] text-neutral-neutral1 dark:text-neutral-white">SBD:</span>
                                  <p className="text-[14px] font-bold text-neutral-neutral1 dark:text-neutral-white">{c.sbd}</p>
                                </div>
                                <div className="hidden sm:flex w-[72px] text-center gap-[6px] items-center">
                                  <p className="text-[13px] text-neutral-neutral1 dark:text-neutral-white">SBD:</p>
                                  <p className="text-[15px] font-bold text-neutral-neutral1 dark:text-neutral-white">{c.sbd}</p>
                                </div>
                                <div className="h-[24px] w-[1px] bg-neutral-neutral1/20 dark:bg-[#94949E]/20"></div>
                                <div className="w-[110px] sm:w-[140px] text-right">
                                  <h6 className="text-[15px] font-bold text-neutral-neutral1 leading-[27px] dark:text-neutral-white">
                                    {c.votes.toLocaleString()}
                                  </h6>
                                </div>
                              </div>

                              <div className="flex flex-1 flex-col space-y-2">
                                <div className="h-[12px]"></div>
                                <div className="h-[54px] py-[5px]">
                                  <p className="text-[18px] font-bold text-neutral-neutral1 dark:text-neutral-white leading-snug">
                                    {c.name}
                                  </p>
                                </div>
                              </div>

                            </div>

                            {/* Vote & Laurel ranking */}
                            <div className="flex items-end gap-3 h-[72px] sm:gap-4 sm:h-[80px] mt-2">
                              <button 
                                onClick={() => handleVote(c.sbd, c.name)}
                                className="sc-7f525aa4-0 eyRkL flex items-center justify-center gap-2 bg-primary dark:bg-neutral-white rounded-lg py-[10px] w-full border-0 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
                              >
                                <p className="text-[16px] leading-[20px] text-neutral-white dark:text-primary font-medium">Bình chọn</p>
                              </button>

                              {/* Laurel Rank graphics */}
                              <div className="relative flex-shrink-0">
                                <div className="hidden sm:block w-[71.5px] sm:w-[80px]">
                                  <img alt="" className="block dark:hidden" src="/original_assets/static/media/laurel-light-big.58ee16d9.svg"/>
                                  <img alt="" className="hidden dark:block" src="/original_assets/static/media/laurel-dark-big.6d9a838c.svg"/>
                                </div>
                                <div className="block sm:hidden w-[71.5px]">
                                  <img alt="" className="block dark:hidden" src="/original_assets/static/media/laurel-light-small.27b47318.svg"/>
                                  <img alt="" className="hidden dark:block" src="/original_assets/static/media/laurel-dark-small.e0887cc3.svg"/>
                                </div>
                                <div className="hidden sm:block absolute w-full text-center top-[14px]">
                                  <h3 className="text-[20px] font-bold text-grey-darkGrey dark:text-grey-lightGrey2">{rank}</h3>
                                </div>
                                <div className="block sm:hidden absolute w-full text-center top-[18px]">
                                  <span className="text-grey-darkGrey dark:text-grey-lightGrey2 text-[18px] font-semibold leading-[120%] tracking-[-0.48px]">{rank}</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
