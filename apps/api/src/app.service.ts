import { Injectable, NotFoundException } from '@nestjs/common';
import { Candidate, Sponsor, TimelineEvent, Banner } from '@huitfest/shared';
import * as fs from 'fs';
import * as path from 'path';

export interface SystemSettings {
  isGateOpen: boolean;
  startDate: string;
  endDate: string;
  maxVotesPerPhone: number;
  eventTitle: string;
  organizer: string;
  contactEmail: string;
  isMaintenanceMode: boolean;
}

@Injectable()
export class AppService {
  private dbFilePath = path.join(process.cwd(), 'contest_voting_db.json');

  private candidates: Candidate[] = [
    {
      id: '1',
      sbd: '085',
      name: 'Nguyễn Thanh Tân',
      votes: 106100,
      imageUrl: '/original_assets/image389b.png',
      description: 'Thí sinh tài năng của HUIT\'s Iconic 2024.',
      biography: 'Nguyễn Thanh Tân là sinh viên khoa Công nghệ thông tin của HUIT. Anh đam mê lập trình và hoạt động nghệ thuật, mong muốn mang lại nguồn năng lượng tích cực.',
    },
    {
      id: '2',
      sbd: '089',
      name: 'Nguyễn Đình Tú',
      votes: 62215,
      imageUrl: '/original_assets/image725f.png',
      description: 'Chiến binh bản lĩnh mang màu sắc nhiệt huyết.',
      biography: 'Nguyễn Đình Tú hiện là sinh viên khoa Quản trị kinh doanh. Với vẻ ngoài điển trai và năng lực giao tiếp xuất sắc, Tú muốn chinh phục thử thách.',
    },
    {
      id: '3',
      sbd: '024',
      name: 'Lê Ngọc Yến Vy',
      votes: 22800,
      imageUrl: '/original_assets/image940e.jpg',
      description: 'Đại diện cho vẻ đẹp tri thức và sự duyên dáng.',
      biography: 'Lê Ngọc Yến Vy, sinh viên khoa Ngoại ngữ. Cô thông thạo 2 ngoại ngữ và tích cực tham gia các phong trào sinh viên của trường.',
    },
    {
      id: '4',
      sbd: '096',
      name: 'Võ Bá Thiện',
      votes: 20590,
      imageUrl: '/original_assets/image8681.png',
      description: 'Nụ cười tỏa nắng cùng trái tim ấm áp.',
      biography: 'Võ Bá Thiện đại diện khoa Công nghệ thực phẩm. Thiện yêu thích thể thao, đặc biệt là bóng rổ, luôn hướng tới phong cách năng động.',
    },
    {
      id: '5',
      sbd: '018',
      name: 'Trần Tuyết Ngân',
      votes: 16070,
      imageUrl: '/original_assets/imageada2.png',
      description: 'Gương mặt cá tính đầy bứt phá.',
      biography: 'Trần Tuyết Ngân là sinh viên khoa Tài chính ngân hàng. Ngân có năng khiếu nhảy hiện đại và khả năng lãnh đạo nhóm xuất sắc.',
    },
    {
      id: '6',
      sbd: '095',
      name: 'Nguyễn Thị Cẩm Thanh',
      votes: 8410,
      imageUrl: '/original_assets/image4706.png',
      description: 'Sự kết hợp hoàn hảo giữa năng động và dịu dàng.',
      biography: 'Nguyễn Thị Cẩm Thanh đến từ khoa Luật. Thanh mong muốn dùng tri thức pháp luật để đóng góp cho cộng đồng sinh viên.',
    },
  ];

  private sponsors: Sponsor[] = [
    {
      id: 's1',
      name: 'Eventista',
      logoUrl: '/images/eventista.7a1126d5.svg',
      tier: 'PLATINUM',
    },
    {
      id: 's2',
      name: 'HUIT Media',
      logoUrl: '/images/imageb821.png',
      tier: 'GOLD',
    },
    {
      id: 's3',
      name: 'Sen Vàng Entertainment',
      logoUrl: '/images/image5999.jpg',
      tier: 'SILVER',
    },
  ];

  private timeline: TimelineEvent[] = [
    {
      id: 't1',
      date: '20/10/2024 - 30/10/2024',
      title: 'VÒNG SƠ KHẢO',
      description: 'Xét duyệt hồ sơ trực tuyến, đánh giá các chỉ số nhân trắc học và phỏng vấn trực tiếp.',
      isActive: false,
    },
    {
      id: 't2',
      date: '03/11/2024 - 15/11/2024',
      title: 'VÒNG BÁN KẾT (BÌNH CHỌN ONLINE)',
      description: 'Cổng bình chọn trực tuyến mở công khai. Khán giả và hội đồng tiến hành bầu chọn trực tiếp.',
      isActive: true,
    },
    {
      id: 't3',
      date: '20/11/2024 - 24/11/2024',
      title: 'ĐÊM CHUNG KẾT & VINH QUANG',
      description: 'Gala trình diễn nghệ thuật, kiểm tra kiến thức và trao giải cho các ngôi vị cao nhất.',
      isActive: false,
    }
  ];

  private banners: Banner[] = [
    {
      id: 'b1',
      title: 'HUIT\'s Iconic Banner',
      imageUrl: '/original_assets/image974c.jpg',
      link: '#',
      isActive: true,
    },
  ];

  private settings: SystemSettings = {
    isGateOpen: true,
    startDate: '2024-10-20T00:00',
    endDate: '2024-11-24T23:59',
    maxVotesPerPhone: 5,
    eventTitle: "HUIT's Iconic 2024",
    organizer: "Trường Đại học Công Thương TP.HCM (HUIT)",
    contactEmail: "support@voting.vn",
    isMaintenanceMode: false
  };

  constructor() {
    this.loadDb();
  }

  private loadDb() {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const fileContent = fs.readFileSync(this.dbFilePath, 'utf8');
        const data = JSON.parse(fileContent);
        if (data.candidates) this.candidates = data.candidates;
        if (data.sponsors) this.sponsors = data.sponsors;
        if (data.timeline) this.timeline = data.timeline;
        if (data.banners) {
          this.banners = data.banners.map((banner: Banner) => ({
            ...banner,
            isActive: banner.isActive ?? true,
          }));
        }
        if (data.settings) this.settings = data.settings;
        console.log('✅ Loaded data from database store successfully.');
      } else {
        this.saveDb();
      }
    } catch (e) {
      console.error('❌ Failed to load local database store:', e);
    }
  }

  private saveDb() {
    try {
      const data = {
        candidates: this.candidates,
        sponsors: this.sponsors,
        timeline: this.timeline,
        banners: this.banners,
        settings: this.settings
      };
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('❌ Failed to save data to database store:', e);
    }
  }

  // --- CANDIDATES ---
  getCandidates(): Candidate[] {
    return [...this.candidates].sort((a, b) => b.votes - a.votes);
  }

  getCandidateBySbd(sbd: string): Candidate {
    const candidate = this.candidates.find(c => c.sbd === sbd);
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với SBD ${sbd}`);
    }
    return candidate;
  }

  voteCandidate(sbd: string, phone: string): Candidate {
    const candidate = this.candidates.find(c => c.sbd === sbd);
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với SBD ${sbd}`);
    }
    candidate.votes += 1;
    console.log(`[VOTE] 1 vote received for SBD ${sbd} (phone: ${phone}). New total: ${candidate.votes}`);
    this.saveDb();
    return candidate;
  }

  addCandidate(newCandidate: Partial<Candidate>): Candidate {
    const sbd = newCandidate.sbd || Math.floor(Math.random() * 100).toString().padStart(3, '0');
    const candidate: Candidate = {
      id: Date.now().toString(),
      sbd,
      name: newCandidate.name || 'Thí sinh mới',
      votes: newCandidate.votes || 0,
      imageUrl: newCandidate.imageUrl || '/original_assets/image389b.png',
      description: newCandidate.description || 'Thí sinh mới của HUIT\'s Iconic.',
      biography: newCandidate.biography || 'Thông tin tiểu sử đang được cập nhật.',
    };
    this.candidates.push(candidate);
    this.saveDb();
    return candidate;
  }

  updateCandidate(id: string, updatedFields: Partial<Candidate>): Candidate {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với ID ${id}`);
    }
    Object.assign(candidate, updatedFields);
    this.saveDb();
    return candidate;
  }

  deleteCandidate(id: string): { success: boolean } {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy thí sinh với ID ${id}`);
    }
    this.candidates.splice(index, 1);
    this.saveDb();
    return { success: true };
  }

  // --- SPONSORS ---
  getSponsors(): Sponsor[] {
    return this.sponsors;
  }

  addSponsor(newSponsor: Partial<Sponsor>): Sponsor {
    const sponsor: Sponsor = {
      id: 's' + Date.now(),
      name: newSponsor.name || 'Nhà tài trợ mới',
      logoUrl: newSponsor.logoUrl || '/images/eventista.7a1126d5.svg',
      tier: newSponsor.tier || 'PARTNER',
    };
    this.sponsors.push(sponsor);
    this.saveDb();
    return sponsor;
  }

  updateSponsor(id: string, updatedFields: Partial<Sponsor>): Sponsor {
    const sponsor = this.sponsors.find(s => s.id === id);
    if (!sponsor) {
      throw new NotFoundException(`Không tìm thấy nhà tài trợ với ID ${id}`);
    }
    Object.assign(sponsor, updatedFields);
    this.saveDb();
    return sponsor;
  }

  deleteSponsor(id: string): { success: boolean } {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy nhà tài trợ với ID ${id}`);
    }
    this.sponsors.splice(index, 1);
    this.saveDb();
    return { success: true };
  }

  // --- TIMELINE ---
  getTimeline(): TimelineEvent[] {
    return this.timeline;
  }

  addTimelineEvent(newEvent: Partial<TimelineEvent>): TimelineEvent {
    const event: TimelineEvent = {
      id: 't' + Date.now(),
      date: newEvent.date || '2024-11-01',
      title: newEvent.title || 'Sự kiện mới',
      description: newEvent.description || 'Chi tiết nội dung sự kiện...',
      isActive: newEvent.isActive ?? false,
    };
    this.timeline.push(event);
    this.saveDb();
    return event;
  }

  updateTimelineEvent(id: string, updatedFields: Partial<TimelineEvent>): TimelineEvent {
    const event = this.timeline.find(t => t.id === id);
    if (!event) {
      throw new NotFoundException(`Không tìm thấy lộ trình với ID ${id}`);
    }
    Object.assign(event, updatedFields);
    this.saveDb();
    return event;
  }

  deleteTimelineEvent(id: string): { success: boolean } {
    const index = this.timeline.findIndex(t => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy lộ trình với ID ${id}`);
    }
    this.timeline.splice(index, 1);
    this.saveDb();
    return { success: true };
  }

  // --- BANNERS ---
  getBanners(): Banner[] {
    return this.banners;
  }

  addBanner(newBanner: Partial<Banner>): Banner {
    const banner: Banner = {
      id: 'b' + Date.now(),
      title: newBanner.title || 'Banner mới',
      imageUrl: newBanner.imageUrl || '/original_assets/image974c.jpg',
      link: newBanner.link || '#',
      isActive: newBanner.isActive ?? true,
    };
    this.banners.push(banner);
    this.saveDb();
    return banner;
  }

  updateBanner(id: string, updatedFields: Partial<Banner>): Banner {
    const banner = this.banners.find(b => b.id === id);
    if (!banner) {
      throw new NotFoundException(`Không tìm thấy banner với ID ${id}`);
    }
    Object.assign(banner, updatedFields);
    this.saveDb();
    return banner;
  }

  deleteBanner(id: string): { success: boolean } {
    const index = this.banners.findIndex(b => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy banner với ID ${id}`);
    }
    this.banners.splice(index, 1);
    this.saveDb();
    return { success: true };
  }

  // --- SYSTEM SETTINGS ---
  getSettings(): SystemSettings {
    return this.settings;
  }

  updateSettings(updatedFields: Partial<SystemSettings>): SystemSettings {
    Object.assign(this.settings, updatedFields);
    this.saveDb();
    return this.settings;
  }

  resetVotes(): { success: boolean } {
    this.candidates.forEach(c => {
      c.votes = 0;
    });
    this.saveDb();
    console.log('[RESET] All candidate votes have been reset to 0.');
    return { success: true };
  }
}
