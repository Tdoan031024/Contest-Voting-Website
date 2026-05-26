import { Injectable, NotFoundException } from '@nestjs/common';
import { Candidate, Sponsor, TimelineEvent, Banner } from '@huitfest/shared';

@Injectable()
export class AppService {
  private candidates: Candidate[] = [
    {
      id: '1',
      sbd: '085',
      name: 'Nguyễn Thanh Tân',
      votes: 106100,
      imageUrl: '/_next/image389b.png',
      description: 'Thí sinh tài năng của HUIT\'s Iconic 2024.',
      biography: 'Nguyễn Thanh Tân là sinh viên khoa Công nghệ thông tin của HUIT. Anh đam mê lập trình và hoạt động nghệ thuật, mong muốn mang lại nguồn năng lượng tích cực.',
    },
    {
      id: '2',
      sbd: '089',
      name: 'Nguyễn Đình Tú',
      votes: 62215,
      imageUrl: '/_next/image725f.png',
      description: 'Chiến binh bản lĩnh mang màu sắc nhiệt huyết.',
      biography: 'Nguyễn Đình Tú hiện là sinh viên khoa Quản trị kinh doanh. Với vẻ ngoài điển trai và năng lực giao tiếp xuất sắc, Tú muốn chinh phục thử thách.',
    },
    {
      id: '3',
      sbd: '024',
      name: 'Lê Ngọc Yến Vy',
      votes: 22800,
      imageUrl: '/_next/image940e.jpg',
      description: 'Đại diện cho vẻ đẹp tri thức và sự duyên dáng.',
      biography: 'Lê Ngọc Yến Vy, sinh viên khoa Ngoại ngữ. Cô thông thạo 2 ngoại ngữ và tích cực tham gia các phong trào sinh viên của trường.',
    },
    {
      id: '4',
      sbd: '096',
      name: 'Võ Bá Thiện',
      votes: 20590,
      imageUrl: '/_next/image8681.png',
      description: 'Nụ cười tỏa nắng cùng trái tim ấm áp.',
      biography: 'Võ Bá Thiện đại diện khoa Công nghệ thực phẩm. Thiện yêu thích thể thao, đặc biệt là bóng rổ, luôn hướng tới phong cách năng động.',
    },
    {
      id: '5',
      sbd: '018',
      name: 'Trần Tuyết Ngân',
      votes: 16070,
      imageUrl: '/_next/imageada2.png',
      description: 'Gương mặt cá tính đầy bứt phá.',
      biography: 'Trần Tuyết Ngân là sinh viên khoa Tài chính ngân hàng. Ngân có năng khiếu nhảy hiện đại và khả năng lãnh đạo nhóm xuất sắc.',
    },
    {
      id: '6',
      sbd: '095',
      name: 'Nguyễn Thị Cẩm Thanh',
      votes: 8410,
      imageUrl: '/_next/image4706.png',
      description: 'Sự kết hợp hoàn hảo giữa năng động và dịu dàng.',
      biography: 'Nguyễn Thị Cẩm Thanh đến từ khoa Luật. Thanh mong muốn dùng tri thức pháp luật để đóng góp cho cộng đồng sinh viên.',
    },
  ];

  private sponsors: Sponsor[] = [
    {
      id: 's1',
      name: 'Eventista',
      logoUrl: '/_next/static/media/eventista.7a1126d5.svg',
      tier: 'PLATINUM',
    },
    {
      id: 's2',
      name: 'HUIT Media',
      logoUrl: '/_next/imageb821.png',
      tier: 'GOLD',
    },
    {
      id: 's3',
      name: 'Sen Vàng Entertainment',
      logoUrl: '/_next/image5999.jpg',
      tier: 'SILVER',
    },
  ];

  private timeline: TimelineEvent[] = [
    {
      id: 't1',
      date: '20/10/2024 - 10/11/2024',
      title: 'MỞ CỔNG BÌNH CHỌN',
      description: 'Cổng bình chọn chính thức hoạt động trên toàn quốc.',
      isActive: true,
    },
    {
      id: 't2',
      date: '15/11/2024',
      title: 'ĐÊM CHUNG KẾT HUIT FEST',
      description: 'Tìm ra đại diện xuất sắc nhất HUIT\'s Iconic 2024.',
      isActive: false,
    },
  ];

  private banners: Banner[] = [
    {
      id: 'b1',
      title: 'HUIT\'s Iconic Banner',
      imageUrl: '/_next/image974c.jpg',
      link: '#',
    },
  ];

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
    return candidate;
  }

  getSponsors(): Sponsor[] {
    return this.sponsors;
  }

  getTimeline(): TimelineEvent[] {
    return this.timeline;
  }

  getBanners(): Banner[] {
    return this.banners;
  }

  addCandidate(newCandidate: Partial<Candidate>): Candidate {
    const sbd = newCandidate.sbd || Math.floor(Math.random() * 100).toString().padStart(3, '0');
    const candidate: Candidate = {
      id: (this.candidates.length + 1).toString(),
      sbd,
      name: newCandidate.name || 'Thí sinh mới',
      votes: 0,
      imageUrl: newCandidate.imageUrl || '/_next/image389b.png',
      description: newCandidate.description || 'Thí sinh mới của HUIT\'s Iconic.',
      biography: newCandidate.biography || 'Thông tin tiểu sử đang được cập nhật.',
    };
    this.candidates.push(candidate);
    return candidate;
  }

  updateCandidate(id: string, updatedFields: Partial<Candidate>): Candidate {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với ID ${id}`);
    }
    Object.assign(candidate, updatedFields);
    return candidate;
  }

  deleteCandidate(id: string): { success: boolean } {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy thí sinh với ID ${id}`);
    }
    this.candidates.splice(index, 1);
    return { success: true };
  }

  addSponsor(newSponsor: Partial<Sponsor>): Sponsor {
    const sponsor: Sponsor = {
      id: 's' + (this.sponsors.length + 1),
      name: newSponsor.name || 'Nhà tài trợ mới',
      logoUrl: newSponsor.logoUrl || '/_next/static/media/eventista.7a1126d5.svg',
      tier: newSponsor.tier || 'PARTNER',
    };
    this.sponsors.push(sponsor);
    return sponsor;
  }

  updateSponsor(id: string, updatedFields: Partial<Sponsor>): Sponsor {
    const sponsor = this.sponsors.find(s => s.id === id);
    if (!sponsor) {
      throw new NotFoundException(`Không tìm thấy nhà tài trợ với ID ${id}`);
    }
    Object.assign(sponsor, updatedFields);
    return sponsor;
  }

  deleteSponsor(id: string): { success: boolean } {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy nhà tài trợ với ID ${id}`);
    }
    this.sponsors.splice(index, 1);
    return { success: true };
  }
}
