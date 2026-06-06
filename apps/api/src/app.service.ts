import { Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Candidate, Sponsor, TimelineEvent, Banner, VotePackage, WebUser } from '@huitfest/shared';
import { PrismaService } from './prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

export interface SystemSettings {
  isGateOpen: boolean;
  startDate: string;
  endDate: string;
  maxVotesPerPhone: number;
  eventTitle: string;
  organizer: string;
  contactEmail: string;
  isMaintenanceMode: boolean;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutImageUrl?: string;
  statsCandidates?: string;
  statsVotes?: string;
  statsViews?: string;
  aboutSubtitle?: string;
  aboutTheme?: string;
  aboutOrganizerDetail?: string;
  aboutSectors?: string;
  aboutBenefits?: string;
  aboutParticipants?: string;
  aboutPrize?: string;
  aboutContactName?: string;
  aboutContactRole?: string;
  aboutContactPhone?: string;
  aboutContactWebsite?: string;
  aboutContactQrUrl?: string;
  isRegistrationOpen?: boolean;
  registrationDeadline?: string;
  registrationUrl?: string;
  detailUrl?: string;
  supportZaloUrl?: string;
  freeVotesPerAccountPerDay?: number;
  guideSections?: Array<{ title: string; content: string; imageUrl?: string }>;
  exchangeRates?: Array<{ points: number; price: number; label: string }>;
  votePackages?: VotePackage[];
}

type LocalData = {
  settings?: Partial<SystemSettings>;
  webUsers?: WebUser[];
  votePackages?: VotePackage[];
  voteHistory?: any[];
  transactions?: any[];
};

type AuthAdminUser = {
  id: string;
  username: string;
  role: string;
};

@Injectable()
export class AppService implements OnModuleInit {
  private dbFilePath = path.resolve(__dirname, '..', 'contest_voting_db.json');
  private settings: SystemSettings = {
    isGateOpen: true,
    startDate: '2024-10-20T00:00',
    endDate: '2024-11-24T23:59',
    maxVotesPerPhone: 5,
    eventTitle: "HUIT STARTUP - Đổi mới sáng tạo hướng tới phát triển bền vững",
    organizer: "Trường Đại học Công Thương TP.HCM (HUIT)",
    contactEmail: "support@voting.vn",
    isMaintenanceMode: false,
    aboutTitle: "HUIT STARTUP LẦN THỨ VII 2026",
    aboutDescription: "Cuộc thi HUIT Startup lần 07 năm 2026 với chủ đề “Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững\" cấp thành phố (HUIT STARTUP LẦN THỨ VII) là hoạt động thường niên do Trường Đại học Công Thương TP. Hồ Chí Minh tổ chức, nhằm tìm kiếm và ươm tạo các ý tưởng, dự án sáng tạo của học sinh, sinh viên, học viên và doanh nghiệp góp phần giải quyết các vấn đề xã hội và thúc đẩy phát triển bền vững. Đây không chỉ là sân chơi học thuật mà còn là bệ phóng cho những ý tưởng sáng tạo, những giải pháp thiết thực được hình thành, phát triển và hiện thực hóa, mang lại giá trị thiết thực cho bản thân, gia đình, cộng đồng và toàn xã hội. Năm 2026, cuộc thi trở lại với quy mô mở rộng và chủ đề đầy cảm hứng: \"Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững\". Cuộc thi chào đón sự tham gia của Học sinh, sinh viên, học viên ở các trường đại học, cao đắng, trung cấp, THPT, GDTX và Các cá nhân, tổ chức, doanh nghiệp (HTX, hộ kinh doanh, doanh nghiệp vừa và nhỏ trên địa bàn Thành phố Hồ Chí Minh và các tỉnh lân cận yêu thích hoạt động khởi nghiệp, có ý tưởng, dự án khởi nghiệp sáng. Mục tiêu là tìm kiếm và ươm mầm những ý tưởng, giải pháp đổi mới sáng tạo, góp phần giải quyết các vấn đề cấp thiết của cộng đồng, xã hội và thúc đẩy phát triển kinh tế – xã hội một cách bền vững. Thông qua cuộc thi, ban tổ chức mong muốn lan tỏa mạnh mẽ tinh thần khởi nghiệp, đổi mới sáng tạo trong giới trẻ; đồng thời kết nối và mở rộng hệ sinh thái khởi nghiệp đổi mới sáng tạo trong khối các cơ sở giáo dục, các startup tạo tiền đề cho sự phát triển nguồn nhân lực sáng tạo, thích ứng và bản lĩnh trong thời đại mới.",
    aboutImageUrl: "/uploads/poster-khoi-nghiep.jpg",
    statsCandidates: "20+",
    statsVotes: "100K+",
    statsViews: "30M+",
    aboutSubtitle: "Cuộc thi HUIT Startup lần VII - Cấp Thành phố năm 2026",
    aboutTheme: "Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững",
    aboutOrganizerDetail: "Đơn vị tổ chức: Trường Đại học Công Thương TP. HCM (HUIT) và IEC.\nTài trợ kim cương: Sài Gòn Thăng Long; Quỹ đầu tư VinaTech.\nĐơn vị phối hợp: Diễn đàn Doanh nghiệp; Khởi nghiệp Quốc gia phía Nam; VNEI.\nĐơn vị bảo trợ: Các đơn vị/biểu trưng bảo trợ theo poster cuộc thi.",
    aboutSectors: "Công nghiệp, AI, chuyển đổi số và an ninh mạng\nCông nghệ thực phẩm, nông nghiệp, môi trường và năng lượng\nGiáo dục, văn hóa, du lịch, logistics, tài chính, thương mại điện tử và luật\nY tế, sức khỏe và đời sống\nPhát triển bền vững và kinh doanh tạo tác động xã hội",
    aboutBenefits: "Đào tạo kỹ năng khởi nghiệp\nMentor/cố vấn chuyên sâu\nStartup Tour & kiểm chứng thị trường\nKết nối quỹ đầu tư, nhà đầu tư và cơ hội ươm tạo",
    aboutPrize: "Tổng giá trị giải thưởng 05 TỶ ĐỒNG và các gói hỗ trợ hấp dẫn, gồm tiền mặt, gói mentor/cố vấn chuyên sâu, gói sở hữu trí tuệ, nền tảng ERP Platform và nhiều cơ hội nhận các gói ươm tạo, kết nối đầu tư, phát triển dự án sau cuộc thi.",
    aboutParticipants: "Học sinh: THPT, GDTX, trung cấp có ý tưởng khởi nghiệp sáng tạo.\nSinh viên, học viên: Đang học tại các trường đại học, cao đẳng và cơ sở giáo dục.\nCá nhân, tổ chức: Yêu thích hoạt động khởi nghiệp, có ý tưởng hoặc dự án sáng tạo.\nDoanh nghiệp: HTX, hộ kinh doanh, doanh nghiệp vừa và nhỏ tại TP. Hồ Chí Minh và các tỉnh lân cận.",
    aboutContactName: "Nguyễn Thị Bích Nguyên",
    aboutContactRole: "Chuyên viên - TT Đổi mới sáng tạo và Khởi nghiệp",
    aboutContactPhone: "0975702463",
    aboutContactWebsite: "https://khoinghiep.huit.edu.vn",
    aboutContactQrUrl: "/images/qrdangky.png",
    isRegistrationOpen: true,
    registrationDeadline: '2026-06-20T23:59',
    registrationUrl: 'https://khoinghiep.huit.edu.vn',
    detailUrl: 'https://khoinghiep.huit.edu.vn',
    supportZaloUrl: 'https://zalo.me/0975702463',
    freeVotesPerAccountPerDay: 1,
    guideSections: [
      {
        title: 'Đối tượng và bảng thi',
        content: 'Cuộc thi dành cho học sinh THPT, GDTX, trung cấp; sinh viên, học viên các trường đại học, cao đẳng; cá nhân, tổ chức, hợp tác xã, hộ kinh doanh và doanh nghiệp vừa và nhỏ có ý tưởng hoặc dự án khởi nghiệp sáng tạo. Hệ thống cần phân loại dự án theo bảng thi để quản lý hồ sơ, vòng thi và kết quả bình chọn.'
      },
      {
        title: 'Hồ sơ dự thi',
        content: 'Mỗi nhóm dự thi cần có tên dự án, tên nhóm, thông tin trưởng nhóm, thành viên, đơn vị/trường, lĩnh vực dự án, mô tả ý tưởng, nhu cầu hỗ trợ, cam kết sở hữu trí tuệ và các tài liệu thuyết minh theo từng vòng thi.'
      },
      {
        title: 'Các vòng thi HUIT Startup 2026',
        content: 'Vòng loại tiếp nhận hồ sơ và chọn dự án phù hợp. Vòng bán kết đào tạo, huấn luyện, hoàn thiện thuyết minh và chọn Top 10 mỗi bảng. Vòng chung kết gồm Startup Tour, kết nối cố vấn/nhà đầu tư, bình chọn online và trình bày dự án tại ngày chung kết.'
      },
      {
        title: 'Bình chọn trực tuyến',
        content: 'Người dùng có thể bình chọn cho dự án/thí sinh trong sự kiện yêu thích nhất. Gói 5 điểm miễn phí yêu cầu đăng nhập tài khoản và được cấp theo ngày. Các gói trả phí hiển thị thành tiền đã bao gồm VAT 10%, sau thanh toán thành công hệ thống cộng điểm, lưu giao dịch và lịch sử bình chọn để thống kê, quản lý và kiểm tra gian lận.'
      }
    ],
    exchangeRates: [
      { points: 5, price: 0, label: '5 điểm miễn phí' },
      { points: 10, price: 10000, label: '10 điểm' },
      { points: 20, price: 20000, label: '20 điểm' },
      { points: 50, price: 50000, label: '50 điểm' },
      { points: 220, price: 100000, label: '220 điểm' },
      { points: 1050, price: 500000, label: '1.050 điểm' },
      { points: 2300, price: 1000000, label: '2.300 điểm' },
      { points: 7000, price: 3000000, label: '7.000 điểm' }
    ],
    votePackages: [
      { id: 'free-5', code: 'FREE_5', name: '5 điểm miễn phí', points: 5, price: 0, currency: 'VND', vatRate: 10, packageType: 'FREE', isActive: true },
      { id: 'vote-10', code: 'VOTE_10', name: '10 điểm', points: 10, price: 10000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-20', code: 'VOTE_20', name: '20 điểm', points: 20, price: 20000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-50', code: 'VOTE_50', name: '50 điểm', points: 50, price: 50000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-220', code: 'VOTE_220', name: '220 điểm', points: 220, price: 100000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-1050', code: 'VOTE_1050', name: '1.050 điểm', points: 1050, price: 500000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-2300', code: 'VOTE_2300', name: '2.300 điểm', points: 2300, price: 1000000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-7000', code: 'VOTE_7000', name: '7.000 điểm', points: 7000, price: 3000000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true }
    ]
  };

  constructor(private readonly prisma: PrismaService) {
    this.loadSettings();
  }

  async onModuleInit() {
    await this.seedDataIfNeeded();
  }

  private loadSettings() {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const fileContent = fs.readFileSync(this.dbFilePath, 'utf8');
        const data = JSON.parse(fileContent);
        if (data.settings) {
          this.settings = { ...this.settings, ...data.settings };
        }
        console.log('✅ Loaded system settings from file successfully.');
      } else {
        this.saveSettings();
      }
    } catch (e) {
      console.error('❌ Failed to load local system settings:', e);
    }
  }

  private saveSettings() {
    try {
      let data: any = {};
      if (fs.existsSync(this.dbFilePath)) {
        try {
          const fileContent = fs.readFileSync(this.dbFilePath, 'utf8');
          data = JSON.parse(fileContent);
        } catch (e) {}
      }
      data.settings = this.settings;
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ Saved system settings to file successfully.');
    } catch (e) {
      console.error('❌ Failed to save system settings to file:', e);
    }
  }

  private readLocalData(): LocalData {
    try {
      if (!fs.existsSync(this.dbFilePath)) {
        return {};
      }
      return JSON.parse(fs.readFileSync(this.dbFilePath, 'utf8'));
    } catch (e) {
      console.error('Failed to read local data file:', e);
      return {};
    }
  }

  private writeLocalData(data: LocalData) {
    fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  }

  private getCandidateMetadata(candidate: any): Record<string, any> {
    if (!candidate?.biography || typeof candidate.biography !== 'string') {
      return {};
    }

    try {
      const parsed = JSON.parse(candidate.biography);
      return parsed && typeof parsed === 'object' && parsed.__projectMeta ? parsed : {};
    } catch {
      return {};
    }
  }

  private mergeCandidate(candidate: any): Candidate {
    const metadata = this.getCandidateMetadata(candidate);
    if (!metadata.__projectMeta) {
      return candidate as Candidate;
    }

    const { __projectMeta, longDescription, ...projectFields } = metadata;
    return {
      ...candidate,
      ...projectFields,
      biography: longDescription || candidate.description || '',
    } as Candidate;
  }

  private prepareCandidateData(input: Partial<Candidate>, existing?: any) {
    const baseKeys = new Set(['sbd', 'name', 'votes', 'imageUrl', 'description', 'biography']);
    const metadata = {
      ...this.getCandidateMetadata(existing),
      __projectMeta: true,
    };

    Object.entries(input || {}).forEach(([key, value]) => {
      if (!baseKeys.has(key) && value !== undefined) {
        (metadata as any)[key] = value;
      }
    });

    if (input.biography !== undefined) {
      (metadata as any).longDescription = input.biography;
    }

    const data: any = {};
    if (input.sbd !== undefined) data.sbd = input.sbd;
    if (input.name !== undefined) data.name = input.name;
    if (input.votes !== undefined) data.votes = Number(input.votes) || 0;
    if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
    if (input.description !== undefined) data.description = input.description;
    data.biography = JSON.stringify(metadata);
    return data;
  }

  private publicWebUser(user: WebUser): WebUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser as WebUser;
  }

  private async seedDataIfNeeded() {
    try {
      if (!fs.existsSync(this.dbFilePath)) {
        console.log('⚠️ contest_voting_db.json not found. No seeding data available.');
        return;
      }

      console.log('🚀 Checking database tables for seeding...');
      const fileContent = fs.readFileSync(this.dbFilePath, 'utf8');
      const data = JSON.parse(fileContent);

      // Seed Candidates
      const candidatesCount = await this.prisma.candidate.count();
      if (candidatesCount === 0 && data.candidates && Array.isArray(data.candidates)) {
        console.log('Seeding candidates...');
        for (const c of data.candidates) {
          await this.prisma.candidate.create({
            data: {
              id: c.id,
              sbd: c.sbd,
              name: c.name,
              votes: c.votes || 0,
              imageUrl: c.imageUrl,
              description: c.description || '',
              biography: c.biography || '',
            }
          });
        }
        console.log(`✅ Seeded ${data.candidates.length} candidates.`);
      }

      // Seed Sponsors
      const sponsorsCount = await this.prisma.sponsor.count();
      if (sponsorsCount === 0 && data.sponsors && Array.isArray(data.sponsors)) {
        console.log('Seeding sponsors...');
        for (const s of data.sponsors) {
          const validTiers = ['PLATINUM', 'GOLD', 'SILVER', 'PARTNER'];
          const tier = validTiers.includes(s.tier) ? s.tier : 'PARTNER';
          await this.prisma.sponsor.create({
            data: {
              id: s.id,
              name: s.name,
              logoUrl: s.logoUrl,
              tier: tier as any,
            }
          });
        }
        console.log(`✅ Seeded ${data.sponsors.length} sponsors.`);
      }

      // Seed Timeline
      const timelineCount = await this.prisma.timelineEvent.count();
      if (timelineCount === 0) {
        console.log('Seeding timeline events...');
        const initialTimeline = [
          // Vòng loại
          { date: '15/5 - 15/6/2026', title: 'Nhận hồ sơ đăng ký dự thi', description: 'Các đội thi hoàn thiện hồ sơ, thông tin ý tưởng hoặc dự án khởi nghiệp sáng tạo để đăng ký tham gia cuộc thi.', isActive: true, round: 'Vòng loại', isImportant: true },
          { date: '17/06/2026', title: 'Tập huấn định hướng', description: 'Các đội thi được định hướng, tập huấn kỹ năng khởi nghiệp và chuẩn bị cho quá trình phát triển dự án.', isActive: false, round: 'Vòng loại', isImportant: false },
          { date: '20/6/2026', title: 'Hạn chót nộp hồ sơ vòng loại', description: 'Các đội thi hoàn tất việc nộp hồ sơ ý tưởng/dự án của mình về ban tổ chức đúng thời gian quy định.', isActive: true, round: 'Vòng loại', isImportant: true },
          { date: '27/6 - 28/6/2026', title: 'Chấm hồ sơ vòng loại', description: 'Hội đồng chuyên môn đánh giá, chọn lọc các ý tưởng và dự án phù hợp để tiếp tục bước vào vòng tiếp theo.', isActive: false, round: 'Vòng loại', isImportant: false },
          { date: '30/6/2026', title: 'Công bố kết quả vòng loại', description: 'Công bố danh sách các dự án xuất sắc vượt qua vòng loại để chuẩn bị cho giai đoạn tiếp theo.', isActive: true, round: 'Vòng loại', isImportant: true },
          // Vòng bán kết
          { date: '04/7 - 05/7/2026', title: 'Đào tạo, huấn luyện kỹ năng khởi nghiệp đổi mới sáng tạo', description: 'Huấn luyện chuyên sâu về kỹ năng thuyết trình, hoàn thiện sản phẩm và định hình mô hình kinh doanh.', isActive: false, round: 'Vòng bán kết', isImportant: false },
          { date: '19/7/2026', title: 'Hạn chót nộp bản thuyết minh dự án hoàn chỉnh', description: 'Nộp tài liệu thuyết minh dự án chi tiết đã hoàn thiện sau tập huấn.', isActive: true, round: 'Vòng bán kết', isImportant: true },
          { date: '25/7/2026', title: 'Thi bán kết, trưng bày sản phẩm hoặc dịch vụ', description: 'Các đội thi trình bày, phản biện và hoàn thiện mô hình dự án dưới sự đánh giá của hội đồng chuyên môn.', isActive: true, round: 'Vòng bán kết', isImportant: true },
          { date: '25/7/2026', title: 'Chọn Top 10 đội mỗi bảng vào vòng chung kết', description: 'Hội đồng ban giám khảo lựa chọn ra những đại diện xuất sắc nhất bước tiếp vào chung kết.', isActive: true, round: 'Vòng bán kết', isImportant: true },
          // Vòng chung kết
          { date: '01/8 - 16/8/2026', title: 'HUIT Startup Tour và kiểm chứng thực tế dự án', description: 'Các dự án trải qua các chuyến tham quan thực tế doanh nghiệp và thử nghiệm thị trường thực tế.', isActive: false, round: 'Vòng chung kết', isImportant: false },
          { date: '17/8 - 17/9/2026', title: 'Kết nối nhà đầu tư, cố vấn và hoàn thiện định hướng phát triển', description: 'Nhận sự cố vấn chuyên sâu từ các chuyên gia hàng đầu và kết nối gọi vốn.', isActive: false, round: 'Vòng chung kết', isImportant: false },
          { date: '20/9/2026', title: 'Hỗ trợ hoàn thiện thuyết minh dự án và kế hoạch kinh doanh', description: 'Các chuyên gia đồng hành hỗ trợ hoàn thành kế hoạch kinh doanh chi tiết cuối cùng.', isActive: false, round: 'Vòng chung kết', isImportant: false },
          { date: '21/9 - 28/9/2026', title: 'Vòng chung kết online', description: 'Cổng bình chọn trực tuyến mở công khai để khán giả tham gia bình chọn cho dự án yêu thích nhất.', isActive: true, round: 'Vòng chung kết', isImportant: true },
          { date: '03/10/2026', title: 'Trưng bày sản phẩm, dịch vụ và thuyết trình chung kết', description: 'Các dự án xuất sắc nhất tranh tài, kết nối chuyên gia, nhà đầu tư và cơ hội ươm tạo sau cuộc thi.', isActive: true, round: 'Vòng chung kết', isImportant: true }
        ];
        for (const t of initialTimeline) {
          await this.prisma.timelineEvent.create({
            data: t
          });
        }
        console.log(`✅ Seeded ${initialTimeline.length} timeline events.`);
      }

      // Seed Banners
      const bannersCount = await this.prisma.banner.count();
      if (bannersCount === 0 && data.banners && Array.isArray(data.banners)) {
        console.log('Seeding banners...');
        for (const b of data.banners) {
          await this.prisma.banner.create({
            data: {
              id: b.id,
              title: b.title,
              imageUrl: b.imageUrl,
              link: b.link || '#',
              isActive: b.isActive ?? true,
            }
          });
        }
        console.log(`✅ Seeded ${data.banners.length} banners.`);
      }

      // Seed default AdminUser
      const adminCount = await this.prisma.adminUser.count();
      if (adminCount === 0) {
        console.log('Seeding default admin user...');
        const hashedPassword = await bcrypt.hash('1', 10);
        await this.prisma.adminUser.create({
          data: {
            username: 'admin',
            passwordHash: hashedPassword,
            role: 'admin',
            isActive: true,
          }
        });
        console.log('✅ Seeded default admin user.');
      }

      console.log('🎉 Database check & seeding completed!');
    } catch (e) {
      console.error('❌ Failed to seed database from JSON file:', e);
    }
  }

  // --- CANDIDATES ---
  async getCandidates(): Promise<Candidate[]> {
    const candidates = await this.prisma.candidate.findMany({
      orderBy: { votes: 'desc' },
    });
    return candidates.map((candidate: any) => this.mergeCandidate(candidate));
  }

  async getCandidateBySbd(sbd: string): Promise<Candidate> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { sbd },
    });
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với SBD ${sbd}`);
    }
    return this.mergeCandidate(candidate);
  }

  getVotePackages(): VotePackage[] {
    const data = this.readLocalData();
    return (data.votePackages || this.settings.votePackages || []).filter((item) => item.isActive);
  }

  getFreeVoteQuota(userId: string): { remaining: number; limit: number } {
    const data = this.readLocalData();
    const limit = this.settings.freeVotesPerAccountPerDay || 1;
    const today = new Date().toISOString().slice(0, 10);
    const used = (data.voteHistory || []).filter((vote) =>
      vote.userId === userId &&
      vote.packageType === 'FREE' &&
      String(vote.createdAt || '').startsWith(today)
    ).length;
    return { remaining: Math.max(limit - used, 0), limit };
  }

  async voteCandidate(sbd: string, body: any = {}): Promise<any> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { sbd },
    });
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với SBD ${sbd}`);
    }

    const packages = this.getVotePackages();
    const selectedPackage =
      packages.find((item) => item.id === body.packageId || item.code === body.packageId) ||
      packages.find((item) => item.id === 'vote-10') ||
      packages[0];

    const points = Number(body.points || selectedPackage?.points || 1);
    if (selectedPackage?.packageType === 'FREE') {
      if (!body.userId) {
        throw new UnauthorizedException('Gói bình chọn miễn phí yêu cầu đăng nhập tài khoản.');
      }

      const quota = this.getFreeVoteQuota(body.userId);
      if (quota.remaining <= 0) {
        throw new UnauthorizedException('Tài khoản đã sử dụng hết lượt bình chọn miễn phí trong ngày.');
      }
    }

    const updatedCandidate = await this.prisma.candidate.update({
      where: { sbd },
      data: { votes: { increment: points } },
    });

    const transactionId = selectedPackage?.packageType === 'PAID'
      ? `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      : undefined;

    try {
      await this.prisma.voteRecord.create({
        data: {
          candidateId: candidate.id,
          voterPhone: body.phone || body.voterPhone || 'WEB_USER',
          transactionId,
        },
      });
    } catch (err) {
      console.error('⚠️ Failed to save VoteRecord:', err);
    }

    const data = this.readLocalData();
    const voteRecord = {
      id: `vote-${Date.now()}`,
      candidateId: candidate.id,
      candidateSbd: sbd,
      eventId: body.eventId || 'thi-sinh-duoc-yeu-thich-nhat',
      packageId: selectedPackage?.id,
      packageType: selectedPackage?.packageType,
      points,
      amount: selectedPackage?.price || 0,
      userId: body.userId,
      voterPhone: body.phone || body.voterPhone,
      transactionId,
      createdAt: new Date().toISOString(),
    };
    const transaction = transactionId ? {
      id: transactionId,
      candidateSbd: sbd,
      packageId: selectedPackage?.id,
      amount: selectedPackage?.price || 0,
      vatRate: selectedPackage?.vatRate || 10,
      status: 'SUCCESS',
      createdAt: voteRecord.createdAt,
    } : null;

    data.voteHistory = [voteRecord, ...(data.voteHistory || [])];
    if (transaction) {
      data.transactions = [transaction, ...(data.transactions || [])];
    }
    this.writeLocalData(data);

    console.log(`[VOTE] ${points} points received for SBD ${sbd}. New total: ${updatedCandidate.votes}`);
    return {
      candidate: this.mergeCandidate(updatedCandidate),
      voteRecord,
      transaction,
    };
  }

  async addCandidate(newCandidate: Partial<Candidate>): Promise<Candidate> {
    const sbd = newCandidate.sbd || Math.floor(Math.random() * 100).toString().padStart(3, '0');
    const candidate = await this.prisma.candidate.create({
      data: this.prepareCandidateData({
        sbd,
        name: newCandidate.name || 'Thí sinh mới',
        votes: newCandidate.votes || 0,
        imageUrl: newCandidate.imageUrl || '/original_assets/image389b.png',
        description: newCandidate.description || 'Thí sinh mới của HUIT\'s Iconic.',
        biography: newCandidate.biography || 'Thông tin tiểu sử đang được cập nhật.',
        ...newCandidate,
      }),
    });
    return this.mergeCandidate(candidate);
  }

  async updateCandidate(id: string, updatedFields: Partial<Candidate>): Promise<Candidate> {
    const existing = await this.prisma.candidate.findUnique({ where: { id } });
    const cleanFields: any = { ...updatedFields };
    delete cleanFields.id;
    delete (cleanFields as any).createdAt;
    delete (cleanFields as any).updatedAt;

    const updated = await this.prisma.candidate.update({
      where: { id },
      data: this.prepareCandidateData(cleanFields, existing),
    });
    return this.mergeCandidate(updated);
  }

  async deleteCandidate(id: string): Promise<{ success: boolean }> {
    await this.prisma.candidate.delete({
      where: { id },
    });
    return { success: true };
  }

  // --- SPONSORS ---
  async getSponsors(): Promise<Sponsor[]> {
    return this.prisma.sponsor.findMany() as any;
  }

  async addSponsor(newSponsor: Partial<Sponsor>): Promise<Sponsor> {
    const validTiers = ['PLATINUM', 'GOLD', 'SILVER', 'PARTNER'];
    const tier = validTiers.includes(newSponsor.tier || '') ? newSponsor.tier : 'PARTNER';

    return this.prisma.sponsor.create({
      data: {
        name: newSponsor.name || 'Nhà tài trợ mới',
        logoUrl: newSponsor.logoUrl || '/images/eventista.7a1126d5.svg',
        tier: tier as any,
      },
    }) as any;
  }

  async updateSponsor(id: string, updatedFields: Partial<Sponsor>): Promise<Sponsor> {
    const cleanFields = { ...updatedFields };
    delete cleanFields.id;
    delete (cleanFields as any).createdAt;
    delete (cleanFields as any).updatedAt;

    if (cleanFields.tier) {
      const validTiers = ['PLATINUM', 'GOLD', 'SILVER', 'PARTNER'];
      if (!validTiers.includes(cleanFields.tier)) {
        cleanFields.tier = 'PARTNER';
      }
    }

    return this.prisma.sponsor.update({
      where: { id },
      data: cleanFields as any,
    }) as any;
  }

  async deleteSponsor(id: string): Promise<{ success: boolean }> {
    await this.prisma.sponsor.delete({
      where: { id },
    });
    return { success: true };
  }

  // --- TIMELINE ---
  async getTimeline(): Promise<TimelineEvent[]> {
    return this.prisma.timelineEvent.findMany() as any;
  }

  async addTimelineEvent(newEvent: Partial<TimelineEvent>): Promise<TimelineEvent> {
    return this.prisma.timelineEvent.create({
      data: {
        date: newEvent.date || '2026-11-01',
        title: newEvent.title || 'Sự kiện mới',
        description: newEvent.description || 'Chi tiết nội dung sự kiện...',
        isActive: newEvent.isActive ?? false,
        round: newEvent.round || 'Vòng loại',
        isImportant: newEvent.isImportant ?? false,
      },
    }) as any;
  }

  async updateTimelineEvent(id: string, updatedFields: Partial<TimelineEvent>): Promise<TimelineEvent> {
    const cleanFields = { ...updatedFields };
    delete cleanFields.id;
    delete (cleanFields as any).createdAt;
    delete (cleanFields as any).updatedAt;

    return this.prisma.timelineEvent.update({
      where: { id },
      data: cleanFields,
    }) as any;
  }

  async deleteTimelineEvent(id: string): Promise<{ success: boolean }> {
    await this.prisma.timelineEvent.delete({
      where: { id },
    });
    return { success: true };
  }

  // --- BANNERS ---
  async getBanners(): Promise<Banner[]> {
    return this.prisma.banner.findMany() as any;
  }

  async addBanner(newBanner: Partial<Banner>): Promise<Banner> {
    return this.prisma.banner.create({
      data: {
        title: newBanner.title || 'Banner mới',
        imageUrl: newBanner.imageUrl || '/original_assets/image974c.jpg',
        link: newBanner.link || '#',
        isActive: newBanner.isActive ?? true,
      },
    }) as any;
  }

  async updateBanner(id: string, updatedFields: Partial<Banner>): Promise<Banner> {
    const cleanFields = { ...updatedFields };
    delete cleanFields.id;
    delete (cleanFields as any).createdAt;
    delete (cleanFields as any).updatedAt;

    return this.prisma.banner.update({
      where: { id },
      data: cleanFields,
    }) as any;
  }

  async deleteBanner(id: string): Promise<{ success: boolean }> {
    await this.prisma.banner.delete({
      where: { id },
    });
    return { success: true };
  }

  // --- WEB USERS & AUTH ---
  getWebUsers(): WebUser[] {
    const data = this.readLocalData();
    return (data.webUsers || []).map((user) => this.publicWebUser(user));
  }

  async registerWebUser(payload: Partial<WebUser> & { password?: string }): Promise<{ ok: boolean; user: WebUser; token: string }> {
    const data = this.readLocalData();
    const users = data.webUsers || [];
    const email = String(payload.email || '').trim().toLowerCase();

    if (!email || !payload.fullName || !payload.password) {
      throw new UnauthorizedException('Thiếu họ tên, email hoặc mật khẩu.');
    }

    if (users.some((user) => user.email.toLowerCase() === email)) {
      throw new UnauthorizedException('Email đã được đăng ký.');
    }

    const user: WebUser = {
      id: `user-${Date.now()}`,
      fullName: payload.fullName,
      email,
      phone: payload.phone,
      passwordHash: await bcrypt.hash(payload.password, 10),
      provider: 'email',
      role: 'USER',
      status: 'ACTIVE',
      schoolOrCompany: payload.schoolOrCompany,
      contestTable: payload.contestTable,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    data.webUsers = [user, ...users];
    this.writeLocalData(data);
    return { ok: true, user: this.publicWebUser(user), token: `local-${user.id}` };
  }

  async quickRegisterWebUser(payload: Partial<WebUser>): Promise<{ ok: boolean; user: WebUser; token: string }> {
    const data = this.readLocalData();
    const users = data.webUsers || [];
    const email = String(payload.email || `${payload.phone || Date.now()}@quick.huit.local`).trim().toLowerCase();
    const existing = users.find((user) => user.email.toLowerCase() === email || (payload.phone && user.phone === payload.phone));

    if (existing) {
      existing.lastLoginAt = new Date().toISOString();
      this.writeLocalData({ ...data, webUsers: users });
      return { ok: true, user: this.publicWebUser(existing), token: `local-${existing.id}` };
    }

    const user: WebUser = {
      id: `user-${Date.now()}`,
      fullName: payload.fullName || 'Người dùng bình chọn',
      email,
      phone: payload.phone,
      provider: 'quick',
      role: 'USER',
      status: 'ACTIVE',
      schoolOrCompany: payload.schoolOrCompany,
      contestTable: payload.contestTable,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    data.webUsers = [user, ...users];
    this.writeLocalData(data);
    return { ok: true, user: this.publicWebUser(user), token: `local-${user.id}` };
  }

  async loginWebUser(email: string, password: string): Promise<{ ok: boolean; user: WebUser; token: string }> {
    const data = this.readLocalData();
    const users = data.webUsers || [];
    const user = users.find((item) => item.email.toLowerCase() === String(email || '').trim().toLowerCase());

    if (!user || user.status === 'LOCKED' || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const matched = await bcrypt.compare(password || '', user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    user.lastLoginAt = new Date().toISOString();
    this.writeLocalData({ ...data, webUsers: users });
    return { ok: true, user: this.publicWebUser(user), token: `local-${user.id}` };
  }

  async googleLogin(payload: Partial<WebUser> & { googleId?: string; accessToken?: string }): Promise<{ ok: boolean; user: WebUser; token: string }> {
    const data = this.readLocalData();
    const users = data.webUsers || [];
    let googleProfile: any = null;

    if (payload.accessToken) {
      try {
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${payload.accessToken}`,
          },
        });
        if (!profileResponse.ok) {
          throw new UnauthorizedException('Token Google không hợp lệ.');
        }
        googleProfile = await profileResponse.json();
      } catch (error) {
        if (error instanceof UnauthorizedException) throw error;
        throw new UnauthorizedException('Không thể xác minh tài khoản Google.');
      }
    }

    const email = String(googleProfile?.email || payload.email || '').trim().toLowerCase();
    if (!email) {
      throw new UnauthorizedException('Thiếu email Google.');
    }

    let user = users.find((item) => item.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        fullName: googleProfile?.name || payload.fullName || email.split('@')[0],
        email,
        phone: payload.phone,
        provider: 'google',
        role: 'USER',
        status: 'ACTIVE',
        schoolOrCompany: payload.schoolOrCompany,
        contestTable: payload.contestTable,
        registeredAt: new Date().toISOString(),
      };
      users.unshift(user);
    }

    user.lastLoginAt = new Date().toISOString();
    this.writeLocalData({ ...data, webUsers: users });
    return { ok: true, user: this.publicWebUser(user), token: `local-${user.id}` };
  }

  // --- SYSTEM SETTINGS ---
  getSettings(): SystemSettings {
    return this.settings;
  }

  updateSettings(updatedFields: Partial<SystemSettings>): SystemSettings {
    Object.assign(this.settings, updatedFields);
    this.saveSettings();
    return this.settings;
  }

  async resetVotes(): Promise<{ success: boolean }> {
    await this.prisma.candidate.updateMany({
      data: { votes: 0 },
    });
    console.log('[RESET] All candidate votes in MySQL have been reset to 0.');
    return { success: true };
  }

  async validateAdminCredentials(username: string, password: string): Promise<AuthAdminUser | null> {
    const adminUser = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    if (!adminUser || !adminUser.isActive) {
      return null;
    }

    const isPasswordMatched = await bcrypt.compare(password, adminUser.passwordHash);
    const isLegacyPlainPassword = adminUser.passwordHash === password;

    if (!isPasswordMatched && !isLegacyPlainPassword) {
      return null;
    }

    return {
      id: adminUser.id,
      username: adminUser.username,
      role: adminUser.role,
    };
  }
}
