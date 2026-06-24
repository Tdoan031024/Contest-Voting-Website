import { Injectable, NotFoundException, OnModuleInit, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Candidate, Sponsor, TimelineEvent, Banner, VotePackage, WebUser } from '@huitfest/shared';
import { PrismaService } from './prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export function getEnvVar(key: string, defaultValue?: string): string {
  if (process.env[key]) return process.env[key];

  const pathsToTry = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), 'apps/admin/.env.local'),
    path.join(process.cwd(), 'apps/api/.env'),
    path.join(__dirname, '../../.env'),
    path.join(__dirname, '../../../.env'),
    path.join(__dirname, '../../admin/.env.local'),
  ];

  for (const envPath of pathsToTry) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const regex = new RegExp(`${key}=["']?([^"'\r\n]+)["']?`);
        const match = content.match(regex);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    } catch (e) {
      // ignore
    }
  }
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Environment variable ${key} is not set.`);
}

export function generateWebToken(userId: string, secret: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const payload = `${userId}.${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
  return `web-${payload}.${signature}`;
}

export function extractWebUserFromToken(token: string, secret: string): string | null {
  if (!token) return null;
  if (token.startsWith('local-')) {
    return token.substring(6);
  }
  if (token.startsWith('web-')) {
    const tokenContent = token.slice(4);
    const parts = tokenContent.split('.');
    if (parts.length !== 3) return null;
    const [userId, expiresAtStr, signature] = parts;
    const expiresAt = Number(expiresAtStr);
    if (isNaN(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return null;
    const payload = `${userId}.${expiresAtStr}`;
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
    if (expectedSig !== signature) return null;
    return userId;
  }
  return null;
}

export interface SystemSettings {
  isGateOpen: boolean;
  startDate: string;
  endDate: string;
  maxVotesPerPhone: number;
  eventTitle: string;
  organizer: string;
  contactEmail: string;
  isMaintenanceMode: boolean;
  sponsorBannerUrl?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutImageUrl?: string;
  statsCandidates?: string;
  statsVotes?: string;
  statsViews?: string;
  statsYear?: string;
  statsParticipants?: string;
  statsMedia?: string;
  statsSchools?: string;
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
  sepayBankName?: string;
  sepayAccountNo?: string;
  sepayAccountName?: string;
  sepayPrefix?: string;
  sepayApiKey?: string;
  isTestMode?: boolean;
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
    startDate: '2026-06-01T00:00',
    endDate: '2026-12-31T23:59',
    maxVotesPerPhone: 5,
    eventTitle: "HUIT STARTUP - Đổi mới sáng tạo hướng tới phát triển bền vững",
    organizer: "Trường Đại học Công Thương TP.HCM (HUIT)",
    contactEmail: "media@huit.edu.vn",
    isMaintenanceMode: false,
    sponsorBannerUrl: "/original_assets/image4b12.png",
    aboutTitle: "HUIT STARTUP LẦN THỨ VII 2026",
    aboutDescription: "Cuộc thi HUIT Startup lần thứ VII năm 2026 cấp Thành phố với chủ đề “Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững” là hoạt động thường niên do Trường Đại học Công Thương TP. Hồ Chí Minh tổ chức. Cuộc thi hướng đến việc tìm kiếm, ươm tạo và phát triển các ý tưởng, dự án khởi nghiệp sáng tạo có khả năng giải quyết những vấn đề thực tiễn của cộng đồng và đóng góp tích cực cho sự phát triển kinh tế – xã hội.\n\nĐây không chỉ là một sân chơi học thuật mà còn là bệ phóng để các đội thi hoàn thiện tư duy kinh doanh, kiểm chứng mô hình, kết nối nguồn lực và từng bước hiện thực hóa dự án. Thông qua các hoạt động đào tạo, cố vấn chuyên sâu, tham quan doanh nghiệp, kiểm chứng thị trường và kết nối đầu tư, thí sinh có cơ hội nâng cao kiến thức, kỹ năng và bản lĩnh cần thiết trên hành trình khởi nghiệp.\n\nNăm 2026, cuộc thi được tổ chức với quy mô mở rộng, chào đón học sinh, sinh viên, học viên, cá nhân, tổ chức và doanh nghiệp tại Thành phố Hồ Chí Minh cùng các tỉnh lân cận. Ba bảng thi gồm Học sinh, Sinh viên và Doanh nghiệp tạo điều kiện để những ý tưởng ở nhiều giai đoạn phát triển đều có cơ hội tham gia, được đánh giá và tiếp tục hoàn thiện.\n\nThông qua cuộc thi, Ban Tổ chức mong muốn lan tỏa mạnh mẽ tinh thần khởi nghiệp và đổi mới sáng tạo; đồng thời kết nối các cơ sở giáo dục, chuyên gia, doanh nghiệp, quỹ đầu tư và tổ chức hỗ trợ để mở rộng hệ sinh thái khởi nghiệp. Những dự án tiềm năng sẽ có cơ hội tiếp cận các chương trình ươm tạo, nguồn lực cố vấn và mạng lưới đối tác nhằm phát triển bền vững sau cuộc thi.",
    aboutImageUrl: "/uploads/poster-khoi-nghiep.jpg",
    statsYear: "2025",
    statsCandidates: "153+",
    statsVotes: "300K+",
    statsParticipants: "650",
    statsViews: "3.7 triệu",
    statsMedia: "20+",
    statsSchools: "45+",
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
    supportZaloUrl: 'https://zalo.me/4418938306145458374',
    freeVotesPerAccountPerDay: 1,
    sepayBankName: 'KienLongBank',
    sepayAccountNo: '101499100004001667',
    sepayAccountName: 'DANG XUAN DUONG',
    sepayPrefix: 'MD',
    sepayApiKey: '1dcd4e6cd52fde1e4bf0510a9b406476322d811f3bbae785',
    isTestMode: true,
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
      { id: 'vote-10', code: 'PAID_10', name: '10 điểm', points: 10, price: 10000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-20', code: 'PAID_20', name: '20 điểm', points: 20, price: 20000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-50', code: 'PAID_50', name: '50 điểm', points: 50, price: 50000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-220', code: 'PAID_220', name: '220 điểm', points: 220, price: 100000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-1050', code: 'PAID_1050', name: '1.050 điểm', points: 1050, price: 500000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-2300', code: 'PAID_2300', name: '2.300 điểm', points: 2300, price: 1000000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-7000', code: 'PAID_7000', name: '7.000 điểm', points: 7000, price: 3000000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true }
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

  private mergeCandidate(candidate: any): Candidate {
    return {
      ...candidate,
      intellectualPropertyCommitment: candidate.intellectualPropertyCommitment ?? false,
    } as Candidate;
  }

  private prepareCandidateData(input: Partial<Candidate>) {
    const data: any = {};
    if (input.sbd !== undefined) data.sbd = input.sbd;
    if (input.name !== undefined) data.name = input.name;
    if (input.votes !== undefined) data.votes = Number(input.votes) || 0;
    if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
    if (input.description !== undefined) data.description = input.description;
    if (input.biography !== undefined) data.biography = input.biography;

    // Startup metadata columns
    if (input.teamName !== undefined) data.teamName = input.teamName;
    if (input.representativeSchool !== undefined) data.representativeSchool = input.representativeSchool;
    if (input.leaderName !== undefined) data.leaderName = input.leaderName;
    if (input.leaderPhone !== undefined) data.leaderPhone = input.leaderPhone;
    if (input.leaderEmail !== undefined) data.leaderEmail = input.leaderEmail;
    if (input.advisorName !== undefined) data.advisorName = input.advisorName;
    if (input.members !== undefined) data.members = input.members;
    if (input.implementationLocation !== undefined) data.implementationLocation = input.implementationLocation;
    if (input.intellectualPropertyCommitment !== undefined) {
      data.intellectualPropertyCommitment = input.intellectualPropertyCommitment !== null ? Boolean(input.intellectualPropertyCommitment) : false;
    }
    if (input.supportNeeds !== undefined) data.supportNeeds = input.supportNeeds;
    if (input.expectations !== undefined) data.expectations = input.expectations;
    if (input.contestTable !== undefined) data.contestTable = input.contestTable;
    if (input.contestTableLabel !== undefined) data.contestTableLabel = input.contestTableLabel;
    if (input.currentRound !== undefined) data.currentRound = input.currentRound;
    if (input.status !== undefined) data.status = input.status;
    if (input.sector !== undefined) data.sector = input.sector;
    if (input.showcaseImages !== undefined) data.showcaseImages = input.showcaseImages;

    return data;
  }

  private publicWebUser(user: any): WebUser {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? undefined,
      provider: user.provider as any,
      role: user.role as any,
      status: user.status as any,
      schoolOrCompany: user.schoolOrCompany ?? undefined,
      contestTable: user.contestTable ?? undefined,
      registeredAt: typeof user.registeredAt === 'string' ? user.registeredAt : user.registeredAt?.toISOString(),
      lastLoginAt: typeof user.lastLoginAt === 'string' ? user.lastLoginAt : user.lastLoginAt?.toISOString(),
    };
  }

  private async seedDataIfNeeded() {
    // Trigger NestJS reload: synch all candidates images to /duan/anhmauduan.png
    try {
      if (!fs.existsSync(this.dbFilePath)) {
        console.log('⚠️ contest_voting_db.json not found. No seeding data available.');
        return;
      }

      console.log('🚀 Checking database tables for seeding...');
      const fileContent = fs.readFileSync(this.dbFilePath, 'utf8');
      const data = JSON.parse(fileContent);

      // Seed Candidates
      if (data.candidates && Array.isArray(data.candidates)) {
        for (const c of data.candidates) {
          const existing = await this.prisma.candidate.findUnique({
            where: { sbd: c.sbd }
          });
          
          if (!existing) {
            console.log(`Seeding missing candidate ${c.sbd} - ${c.name} into database...`);
            let biographyText = c.biography || '';
            let meta: any = {};
            try {
              const parsed = JSON.parse(c.biography);
              if (parsed && typeof parsed === 'object' && parsed.__projectMeta) {
                meta = parsed;
                biographyText = parsed.longDescription || c.description || '';
              }
            } catch {
              // Keep as is
            }

            await this.prisma.candidate.create({
              data: {
                id: c.id,
                sbd: c.sbd,
                name: c.name,
                votes: c.votes || 0,
                imageUrl: c.imageUrl,
                description: c.description || '',
                biography: biographyText,
                
                // Seed from parsed metadata columns
                teamName: meta.teamName || c.teamName || null,
                representativeSchool: meta.representativeSchool || c.representativeSchool || null,
                leaderName: meta.leaderName || c.leaderName || null,
                leaderPhone: meta.leaderPhone || c.leaderPhone || null,
                leaderEmail: meta.leaderEmail || c.leaderEmail || null,
                advisorName: meta.advisorName || c.advisorName || null,
                members: meta.members || c.members || null,
                implementationLocation: meta.implementationLocation || c.implementationLocation || null,
                intellectualPropertyCommitment: meta.intellectualPropertyCommitment !== undefined ? Boolean(meta.intellectualPropertyCommitment) : false,
                supportNeeds: meta.supportNeeds || c.supportNeeds || null,
                expectations: meta.expectations || c.expectations || null,
                contestTable: meta.contestTable || c.contestTable || null,
                contestTableLabel: meta.contestTableLabel || c.contestTableLabel || null,
                currentRound: meta.currentRound || c.currentRound || 'Vòng loại',
                status: meta.status || c.status || 'Đủ hồ sơ',
              }
            });
            console.log(`✅ Seeded candidate ${c.sbd} - ${c.name}`);
          }
        }
      } else {
        // Migrate existing Candidates if columns are empty
        const existingCandidates = await this.prisma.candidate.findMany();
        for (const c of existingCandidates) {
          if (!c.teamName && c.biography && c.biography.includes('__projectMeta')) {
            try {
              const parsed = JSON.parse(c.biography);
              if (parsed && typeof parsed === 'object' && parsed.__projectMeta) {
                console.log(`Migrating biography JSON to columns for candidate ${c.sbd}...`);
                await this.prisma.candidate.update({
                  where: { id: c.id },
                  data: {
                    biography: parsed.longDescription || c.description || '',
                    teamName: parsed.teamName || null,
                    representativeSchool: parsed.representativeSchool || null,
                    leaderName: parsed.leaderName || null,
                    leaderPhone: parsed.leaderPhone || null,
                    leaderEmail: parsed.leaderEmail || null,
                    advisorName: parsed.advisorName || null,
                    members: parsed.members || null,
                    implementationLocation: parsed.implementationLocation || null,
                    intellectualPropertyCommitment: parsed.intellectualPropertyCommitment !== undefined ? Boolean(parsed.intellectualPropertyCommitment) : false,
                    supportNeeds: parsed.supportNeeds || null,
                    expectations: parsed.expectations || null,
                    contestTable: parsed.contestTable || null,
                    contestTableLabel: parsed.contestTableLabel || null,
                    currentRound: parsed.currentRound || 'Vòng loại',
                    status: parsed.status || 'Đủ hồ sơ',
                  }
                });
              }
            } catch (e) {
              console.error(`Failed to migrate biography JSON for candidate ${c.sbd}:`, e);
            }
          }
        }
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
      const openDayEvent = await this.prisma.timelineEvent.findFirst({
        where: { title: { contains: 'HUIT Startup Open Day' } }
      });
      if (!openDayEvent) {
        console.log('Old timeline detected. Clearing and seeding complete HUIT Startup 2026 timeline...');
        await this.prisma.timelineEvent.deleteMany();
      }

      const timelineCount = await this.prisma.timelineEvent.count();
      if (timelineCount === 0) {
        console.log('Seeding timeline events...');
        const initialTimeline = [
          // Vòng loại
          { 
            date: '15/5 - 15/6/2026', 
            title: 'Nhận hồ sơ đăng ký dự thi', 
            description: 'Các đội thi hoàn thiện hồ sơ, thông tin ý tưởng hoặc dự án khởi nghiệp sáng tạo để đăng ký tham gia cuộc thi.', 
            isActive: true, 
            round: 'Vòng loại', 
            isImportant: true 
          },
          { 
            date: '17/06/2026', 
            title: 'Tập huấn định hướng', 
            description: 'Các đội thi được định hướng, tập huấn kỹ năng khởi nghiệp và chuẩn bị cho quá trình phát triển dự án.', 
            isActive: true, 
            round: 'Vòng loại', 
            isImportant: false 
          },
          { 
            date: '20/6/2026', 
            title: 'Hạn chốt nộp hồ sơ vòng loại', 
            description: 'Các đội thi hoàn tất việc nộp hồ sơ ý tưởng/dự án của mình về ban tổ chức đúng thời gian quy định.', 
            isActive: true, 
            round: 'Vòng loại', 
            isImportant: true 
          },
          { 
            date: '27/6 - 28/6/2026', 
            title: 'Chấm hồ sơ vòng loại', 
            description: 'Hội đồng chuyên môn đánh giá, chọn lọc các ý tưởng và dự án phù hợp để tiếp tục bước vào vòng tiếp theo.', 
            isActive: true, 
            round: 'Vòng loại', 
            isImportant: false 
          },
          { 
            date: '30/6/2026', 
            title: 'Công bố kết quả vòng loại', 
            description: 'Công bố danh sách các dự án xuất sắc vượt qua vòng loại để chuẩn bị cho giai đoạn tiếp theo.', 
            isActive: true, 
            round: 'Vòng loại', 
            isImportant: true 
          },
          // Vòng bán kết
          { 
            date: '04/7 - 05/7/2026', 
            title: 'Đào tạo, huấn luyện kỹ năng khởi nghiệp đổi mới sáng tạo; bảng Doanh nghiệp tham gia cố vấn chuyên sâu 1:1', 
            description: 'Huấn luyện chuyên sâu về kỹ năng thuyết trình, hoàn thiện sản phẩm và định hình mô hình kinh doanh; bảng Doanh nghiệp tham gia cố vấn 1:1.', 
            isActive: true, 
            round: 'Vòng bán kết', 
            isImportant: false 
          },
          { 
            date: '19/7/2026', 
            title: 'Hạn chót nộp bản thuyết minh dự án hoàn chỉnh', 
            description: 'Nộp tài liệu thuyết minh dự án chi tiết đã hoàn thiện sau tập huấn.', 
            isActive: true, 
            round: 'Vòng bán kết', 
            isImportant: true 
          },
          { 
            date: '25/7/2026', 
            title: 'Thi bán kết với hình thức trưng bày sản phẩm/dịch vụ, thuyết trình tại gian hàng', 
            description: 'Các đội thi trình bày, phản biện và hoàn thiện mô hình dự án dưới sự đánh giá của hội đồng chuyên môn.', 
            isActive: true, 
            round: 'Vòng bán kết', 
            isImportant: true 
          },
          { 
            date: '25/7/2026', 
            title: 'HUIT Startup Open Day, chọn Top 10 đội/mỗi bảng vào chung kết', 
            description: 'Hội đồng ban giám khảo lựa chọn ra những đại diện xuất sắc nhất bước tiếp vào chung kết.', 
            isActive: true, 
            round: 'Vòng bán kết', 
            isImportant: true 
          },
          // Vòng chung kết
          { 
            date: '01/8 - 16/8/2026', 
            title: 'HUIT Startup Tour, tham quan thị trường/doanh nghiệp và kiểm chứng thực tế dự án', 
            description: 'Các dự án trải qua các chuyến tham quan thực tế doanh nghiệp và thử nghiệm thị trường thực tế.', 
            isActive: true, 
            round: 'Vòng chung kết', 
            isImportant: false 
          },
          { 
            date: '17/8 - 17/9/2026', 
            title: 'Kết nối nhà đầu tư, cố vấn và hoàn thiện định hướng phát triển dự án', 
            description: 'Nhận sự cố vấn chuyên sâu từ các chuyên gia hàng đầu và kết nối gọi vốn.', 
            isActive: true, 
            round: 'Vòng chung kết', 
            isImportant: false 
          },
          { 
            date: '20/9/2026', 
            title: 'Hỗ trợ hoàn thiện thuyết minh dự án và kế hoạch kinh doanh', 
            description: 'Các chuyên gia đồng hành hỗ trợ hoàn thành kế hoạch kinh doanh chi tiết cuối cùng.', 
            isActive: true, 
            round: 'Vòng chung kết', 
            isImportant: false 
          },
          { 
            date: '21/9 - 28/9/2026', 
            title: 'Vòng chung kết online', 
            description: 'Cổng bình chọn trực tuyến mở công khai để khán giả tham gia bình chọn cho dự án yêu thích nhất.', 
            isActive: true, 
            round: 'Vòng chung kết', 
            isImportant: true 
          },
          { 
            date: '03/10/2026', 
            title: 'Trưng bày sản phẩm/dịch vụ và thuyết trình chung kết', 
            description: 'Các dự án xuất sắc nhất tranh tài, kết nối chuyên gia, nhà đầu tư và cơ hội ươm tạo sau cuộc thi.', 
            isActive: true, 
            round: 'Vòng chung kết', 
            isImportant: true 
          }
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

      // Seed Web Users from JSON
      const webUsersCount = await this.prisma.webUser.count();
      if (webUsersCount === 0 && data.webUsers && Array.isArray(data.webUsers)) {
        console.log('Seeding web users from JSON file...');
        for (const u of data.webUsers) {
          try {
            await this.prisma.webUser.create({
              data: {
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                phone: u.phone,
                passwordHash: u.passwordHash,
                provider: u.provider || 'email',
                role: u.role || 'USER',
                status: u.status || 'ACTIVE',
                schoolOrCompany: u.schoolOrCompany,
                contestTable: u.contestTable,
                registeredAt: u.registeredAt ? new Date(u.registeredAt) : new Date(),
                lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : new Date(),
              }
            });
          } catch (e) {
            console.error(`Failed to seed web user ${u.email}:`, e);
          }
        }
        console.log(`✅ Seeded ${data.webUsers.length} web users.`);
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

  async getFreeVoteQuota(userId: string): Promise<{ remaining: number; limit: number }> {
    const webUser = await this.prisma.webUser.findUnique({ where: { id: userId } });
    if (!webUser) return { remaining: 0, limit: 0 };
    return this.getFreeVoteQuotaSecure(webUser);
  }

  async getFreeVoteQuotaSecure(user: { phone?: string | null; email?: string | null }): Promise<{ remaining: number; limit: number }> {
    const limit = this.settings.freeVotesPerAccountPerDay || 1;
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const identifiers = [user.phone, user.email].filter(Boolean) as string[];
    
    const voteCount = await this.prisma.voteRecord.count({
      where: {
        voterPhone: { in: identifiers },
        voteTime: {
          gte: startOfDay,
          lte: endOfDay
        },
        transactionId: null, // Free votes do not have transactions
      }
    });
    
    const remaining = Math.max(0, limit - voteCount);
    return { remaining, limit };
  }

  async voteCandidate(sbd: string, body: any = {}, authHeader?: string): Promise<any> {
    if (!this.settings.isGateOpen) {
      throw new BadRequestException('Cổng bình chọn hiện đang đóng hoặc chưa đến thời gian mở cổng.');
    }

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

    if (!selectedPackage) {
      throw new BadRequestException('Gói bình chọn không hợp lệ.');
    }

    const points = selectedPackage.points;
    let transactionId: string | undefined = undefined;
    let userId: string | null = null;

    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      userId = extractWebUserFromToken(token, this.getAdminSessionSecret());
    }

    if (selectedPackage.packageType === 'FREE') {
      if (!userId) {
        throw new UnauthorizedException('Gói bình chọn miễn phí yêu cầu đăng nhập tài khoản hợp lệ.');
      }

      const webUser = await this.prisma.webUser.findUnique({
        where: { id: userId },
      });
      if (!webUser || webUser.status === 'LOCKED') {
        throw new UnauthorizedException('Tài khoản người dùng không tồn tại hoặc đã bị khóa.');
      }

      const quota = await this.getFreeVoteQuotaSecure(webUser);
      if (quota.remaining <= 0) {
        throw new BadRequestException('Tài khoản đã sử dụng hết lượt bình chọn miễn phí trong ngày.');
      }
    } else if (selectedPackage.packageType === 'PAID') {
      const sepayToken = this.settings.sepayApiKey || '1dcd4e6cd52fde1e4bf0510a9b406476322d811f3bbae785';
      const expectedMemo = `${this.settings.sepayPrefix || 'HUIT'} ${candidate.sbd} ${userId || 'GUEST'}`.toUpperCase();
      
      const isDemoKey = sepayToken === 'sepay_api_key_placeholder' || sepayToken.startsWith('demo') || this.settings.isTestMode !== false;
      if (isDemoKey) {
        console.warn(`[VOTE] Sepay check bypassed because API key is placeholder/demo or isTestMode is enabled.`);
        transactionId = `TX-DEMO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      } else {
        try {
          const response = await fetch('https://userapi.sepay.vn/v2/transactions', {
            headers: {
              'Authorization': `Bearer ${sepayToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Không thể kết nối đến cổng thanh toán Sepay: ${response.statusText}`);
          }
          
          const result = await response.json();
          const transactions = result.transactions || [];
          
          const matchingTx = transactions.find((tx: any) => {
            const content = String(tx.transaction_content || '').toUpperCase();
            const amount = Number(tx.amount_in || tx.amount || 0);
            
            const matchesMemo = content.includes(expectedMemo);
            const matchesAmount = amount === selectedPackage.price;
            
            return matchesMemo && matchesAmount;
          });
          
          if (!matchingTx) {
            throw new BadRequestException(
              `Không tìm thấy giao dịch chuyển khoản hợp lệ với số tiền ${selectedPackage.price.toLocaleString('vi-VN')}đ và nội dung "${expectedMemo}". Vui lòng đợi 1-2 phút hoặc kiểm tra lại thông tin chuyển khoản.`
            );
          }
          
          const data = this.readLocalData();
          const isUsed = (data.voteHistory || []).some(
            (vote) => String(vote.transactionId) === String(matchingTx.id) || String(vote.transactionId) === String(matchingTx.reference_number)
          );
          
          if (isUsed) {
            throw new BadRequestException('Mã giao dịch chuyển khoản này đã được sử dụng để bình chọn trước đó.');
          }
          
          transactionId = String(matchingTx.id || matchingTx.reference_number);
        } catch (err: any) {
          if (err instanceof BadRequestException || err instanceof UnauthorizedException) {
            throw err;
          }
          throw new BadRequestException(err.message || 'Không thể xác thực giao dịch chuyển khoản qua Sepay.');
        }
      }
    }

    const updatedCandidate = await this.prisma.$transaction(async (tx: any) => {
      const candidateUpdate = await tx.candidate.update({
        where: { id: candidate.id },
        data: { votes: { increment: points } },
      });

      let voterPhoneIdentifier = 'WEB_USER';
      if (userId) {
        const webUser = await tx.webUser.findUnique({ where: { id: userId } });
        if (webUser) {
          voterPhoneIdentifier = webUser.phone || webUser.email || 'WEB_USER';
        }
      } else {
        voterPhoneIdentifier = body.phone || body.voterPhone || 'WEB_USER';
      }

      await tx.voteRecord.create({
        data: {
          candidateId: candidate.id,
          voterPhone: voterPhoneIdentifier,
          transactionId,
        },
      });

      return candidateUpdate;
    });

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
      userId: userId || body.userId,
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

  private ensureCandidateDir(sbd: string) {
    if (!sbd) return;
    try {
      const targetDir = path.join(process.cwd(), '../web/public/duan', sbd);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`✅ Created candidate image directory for SBD ${sbd}: ${targetDir}`);
      }
    } catch (err) {
      console.error(`⚠️ Failed to create candidate image directory for SBD ${sbd}:`, err);
    }
  }

  async addCandidate(newCandidate: Partial<Candidate>): Promise<Candidate> {
    const sbd = newCandidate.sbd || Math.floor(Math.random() * 100).toString().padStart(3, '0');
    this.ensureCandidateDir(sbd);
    const candidate = await this.prisma.candidate.create({
      data: this.prepareCandidateData({
        sbd,
        name: newCandidate.name || 'Thí sinh mới',
        votes: newCandidate.votes || 0,
        imageUrl: newCandidate.imageUrl || '/duan/anhmauduan.png',
        description: newCandidate.description || 'Thí sinh mới của HUIT\'s Iconic.',
        biography: newCandidate.biography || 'Thông tin tiểu sử đang được cập nhật.',
        ...newCandidate,
      }),
    });
    return this.mergeCandidate(candidate);
  }

  async updateCandidate(id: string, updatedFields: Partial<Candidate>): Promise<Candidate> {
    const existing = await this.prisma.candidate.findUnique({ where: { id } });
    const sbd = updatedFields.sbd || (existing ? existing.sbd : '');
    this.ensureCandidateDir(sbd);

    const cleanFields: any = { ...updatedFields };
    delete cleanFields.id;
    delete (cleanFields as any).createdAt;
    delete (cleanFields as any).updatedAt;

    const updated = await this.prisma.candidate.update({
      where: { id },
      data: this.prepareCandidateData(cleanFields),
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
        description: newSponsor.description || null,
        websiteUrl: newSponsor.websiteUrl || null,
        email: newSponsor.email || null,
        phone: newSponsor.phone || null,
        contactPerson: newSponsor.contactPerson || null,
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
      data: {
        name: cleanFields.name,
        logoUrl: cleanFields.logoUrl,
        tier: cleanFields.tier as any,
        description: cleanFields.description !== undefined ? cleanFields.description : undefined,
        websiteUrl: cleanFields.websiteUrl !== undefined ? cleanFields.websiteUrl : undefined,
        email: cleanFields.email !== undefined ? cleanFields.email : undefined,
        phone: cleanFields.phone !== undefined ? cleanFields.phone : undefined,
        contactPerson: cleanFields.contactPerson !== undefined ? cleanFields.contactPerson : undefined,
      },
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
    return this.prisma.timelineEvent.findMany({
      orderBy: { createdAt: 'asc' }
    }) as any;
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
    return this.prisma.banner.findMany({
      orderBy: { createdAt: 'asc' },
    }) as any;
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

  async bulkImportBanners(payload: Partial<Banner>[]): Promise<{ successCount: number; errors: string[] }> {
    if (!payload || !Array.isArray(payload)) {
      throw new BadRequestException('Dữ liệu không hợp lệ.');
    }

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < payload.length; i++) {
      const item = payload[i];
      const rowNum = i + 2;

      if (!item.title) {
        errors.push(`Dòng ${rowNum}: Thiếu tiêu đề banner.`);
        continue;
      }
      if (!item.imageUrl) {
        errors.push(`Dòng ${rowNum}: Thiếu đường dẫn hình ảnh/video.`);
        continue;
      }

      try {
        if (item.id) {
          const existing = await this.prisma.banner.findUnique({ where: { id: item.id } });
          if (existing) {
            await this.prisma.banner.update({
              where: { id: item.id },
              data: {
                title: item.title,
                imageUrl: item.imageUrl,
                link: item.link || '#',
                isActive: item.isActive ?? true,
              },
            });
            successCount++;
            continue;
          }
        }

        await this.prisma.banner.create({
          data: {
            title: item.title,
            imageUrl: item.imageUrl,
            link: item.link || '#',
            isActive: item.isActive ?? true,
          },
        });
        successCount++;
      } catch (err: any) {
        errors.push(`Dòng ${rowNum}: Lỗi ghi DB - ${err.message || err}`);
      }
    }

    return { successCount, errors };
  }


  // --- WEB USERS & AUTH ---
  async getWebUsers(): Promise<WebUser[]> {
    const users = await this.prisma.webUser.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const localData = this.readLocalData();
    const voteHistory = localData.voteHistory || [];
    const pointsMap: Record<string, number> = {};
    for (const record of voteHistory) {
      if (record.userId && record.points) {
        pointsMap[record.userId] = (pointsMap[record.userId] || 0) + record.points;
      }
    }
    return users.map((user: any) => {
      const publicUser = this.publicWebUser(user);
      publicUser.votedPoints = pointsMap[user.id] || 0;
      return publicUser;
    });
  }

  async addWebUser(payload: any): Promise<WebUser> {
    const email = String(payload.email || '').trim().toLowerCase();
    if (!email || !payload.fullName) {
      throw new Error('Thiếu email hoặc họ tên.');
    }
    const existing = await this.prisma.webUser.findUnique({
      where: { email },
    });
    if (existing) {
      throw new Error('Email đã được đăng ký.');
    }
    const password = payload.password || '123456';
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.webUser.create({
      data: {
        fullName: payload.fullName,
        email,
        phone: payload.phone || null,
        passwordHash,
        provider: payload.provider || 'email',
        role: payload.role || 'USER',
        status: payload.status || 'ACTIVE',
        schoolOrCompany: payload.schoolOrCompany || null,
        contestTable: payload.contestTable || null,
      }
    });
    return this.publicWebUser(user);
  }

  async updateWebUser(id: string, payload: any): Promise<WebUser> {
    const data: any = {};
    if (payload.fullName !== undefined) data.fullName = payload.fullName;
    if (payload.email !== undefined) data.email = String(payload.email || '').trim().toLowerCase();
    if (payload.phone !== undefined) data.phone = payload.phone || null;
    if (payload.provider !== undefined) data.provider = payload.provider;
    if (payload.status !== undefined) data.status = payload.status;
    if (payload.schoolOrCompany !== undefined) data.schoolOrCompany = payload.schoolOrCompany || null;
    if (payload.contestTable !== undefined) data.contestTable = payload.contestTable || null;
    if (payload.password) {
      data.passwordHash = await bcrypt.hash(payload.password, 10);
    }
    const user = await this.prisma.webUser.update({
      where: { id },
      data,
    });
    return this.publicWebUser(user);
  }

  async deleteWebUser(id: string): Promise<{ success: boolean }> {
    await this.prisma.webUser.delete({
      where: { id },
    });
    return { success: true };
  }

  async registerWebUser(payload: Partial<WebUser> & { password?: string }): Promise<{ ok: boolean; user: WebUser; token: string }> {
    const email = String(payload.email || '').trim().toLowerCase();

    if (!email || !payload.fullName || !payload.password) {
      throw new UnauthorizedException('Thiếu họ tên, email hoặc mật khẩu.');
    }

    const existing = await this.prisma.webUser.findUnique({
      where: { email },
    });
    if (existing) {
      throw new UnauthorizedException('Email đã được đăng ký.');
    }

    const user = await this.prisma.webUser.create({
      data: {
        fullName: payload.fullName,
        email,
        phone: payload.phone,
        passwordHash: await bcrypt.hash(payload.password, 10),
        provider: 'email',
        role: 'USER',
        status: 'ACTIVE',
        schoolOrCompany: payload.schoolOrCompany,
        contestTable: payload.contestTable,
        registeredAt: new Date(),
        lastLoginAt: new Date(),
      },
    });

    return { ok: true, user: this.publicWebUser(user), token: generateWebToken(user.id, this.getAdminSessionSecret()) };
  }

  async quickRegisterWebUser(payload: Partial<WebUser>): Promise<{ ok: boolean; user: WebUser; token: string }> {
    const email = String(payload.email || `${payload.phone || Date.now()}@quick.huit.local`).trim().toLowerCase();
    const existing = await this.prisma.webUser.findFirst({
      where: {
        OR: [
          { email },
          { phone: payload.phone || undefined },
        ],
      },
    });

    if (existing) {
      const updated = await this.prisma.webUser.update({
        where: { id: existing.id },
        data: { lastLoginAt: new Date() },
      });
      return { ok: true, user: this.publicWebUser(updated), token: generateWebToken(updated.id, this.getAdminSessionSecret()) };
    }

    const user = await this.prisma.webUser.create({
      data: {
        fullName: payload.fullName || 'Người dùng bình chọn',
        email,
        phone: payload.phone,
        provider: 'quick',
        role: 'USER',
        status: 'ACTIVE',
        schoolOrCompany: payload.schoolOrCompany,
        contestTable: payload.contestTable,
        registeredAt: new Date(),
        lastLoginAt: new Date(),
      },
    });

    return { ok: true, user: this.publicWebUser(user), token: generateWebToken(user.id, this.getAdminSessionSecret()) };
  }

  async loginWebUser(email: string, password: string): Promise<{ ok: boolean; user: WebUser; token: string }> {
    const user = await this.prisma.webUser.findUnique({
      where: { email: String(email || '').trim().toLowerCase() },
    });

    if (!user || user.status === 'LOCKED' || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const matched = await bcrypt.compare(password || '', user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const updated = await this.prisma.webUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return { ok: true, user: this.publicWebUser(updated), token: generateWebToken(updated.id, this.getAdminSessionSecret()) };
  }

  async googleLogin(payload: Partial<WebUser> & { googleId?: string; accessToken?: string }): Promise<{ ok: boolean; user: WebUser; token: string }> {
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

    let user = await this.prisma.webUser.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.webUser.create({
        data: {
          fullName: googleProfile?.name || payload.fullName || email.split('@')[0],
          email,
          phone: payload.phone,
          provider: 'google',
          role: 'USER',
          status: 'ACTIVE',
          schoolOrCompany: payload.schoolOrCompany,
          contestTable: payload.contestTable,
          registeredAt: new Date(),
          lastLoginAt: new Date(),
        },
      });
    } else {
      user = await this.prisma.webUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    return { ok: true, user: this.publicWebUser(user), token: generateWebToken(user.id, this.getAdminSessionSecret()) };
  }

  // --- SYSTEM SETTINGS ---
  getSettings(): SystemSettings {
    return this.settings;
  }

  getPublicSettings(): Partial<SystemSettings> {
    const publicFields: Array<keyof SystemSettings> = [
      'isGateOpen',
      'startDate',
      'endDate',
      'maxVotesPerPhone',
      'eventTitle',
      'organizer',
      'contactEmail',
      'isMaintenanceMode',
      'sponsorBannerUrl',
      'aboutTitle',
      'aboutDescription',
      'aboutImageUrl',
      'statsCandidates',
      'statsVotes',
      'statsViews',
      'statsYear',
      'statsParticipants',
      'statsMedia',
      'statsSchools',
      'aboutSubtitle',
      'aboutTheme',
      'aboutOrganizerDetail',
      'aboutSectors',
      'aboutBenefits',
      'aboutParticipants',
      'aboutPrize',
      'aboutContactName',
      'aboutContactRole',
      'aboutContactPhone',
      'aboutContactWebsite',
      'aboutContactQrUrl',
      'isRegistrationOpen',
      'registrationDeadline',
      'registrationUrl',
      'detailUrl',
      'supportZaloUrl',
      'freeVotesPerAccountPerDay',
      'guideSections',
      'exchangeRates',
      'votePackages',
      'sepayBankName',
      'sepayAccountNo',
      'sepayAccountName',
      'sepayPrefix',
    ];
    const publicSettings: any = {};
    for (const field of publicFields) {
      if (this.settings[field] !== undefined) {
        publicSettings[field] = this.settings[field];
      }
    }
    return publicSettings;
  }

  updateSettings(updatedFields: Partial<SystemSettings>): SystemSettings {
    Object.assign(this.settings, updatedFields);
    this.saveSettings();

    if (updatedFields.exchangeRates) {
      this.syncVotePackagesWithExchangeRates(updatedFields.exchangeRates);
    }

    return this.settings;
  }

  private syncVotePackagesWithExchangeRates(exchangeRates: any[]) {
    try {
      const data = this.readLocalData();
      const packages = data.votePackages || this.settings.votePackages || [];
      
      const updatedPackages = packages.map((pkg) => {
        const matchingRate = exchangeRates.find((rate) => {
          const ratePoints = Number(String(rate.points).replace(/\D/g, ''));
          return ratePoints === pkg.points;
        });
        
        if (matchingRate) {
          const newPrice = Number(String(matchingRate.price).replace(/\D/g, ''));
          return {
            ...pkg,
            price: newPrice,
            name: newPrice === 0 ? `${pkg.points} điểm miễn phí` : `${pkg.points} điểm`,
          };
        }
        return pkg;
      });
      
      data.votePackages = updatedPackages;
      this.writeLocalData(data);
      console.log('✅ Synchronized votePackages with exchangeRates successfully.');
    } catch (e) {
      console.error('❌ Failed to synchronize votePackages with exchangeRates:', e);
    }
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

  getAdminSessionSecret(): string {
    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    try {
      return getEnvVar('ADMIN_SESSION_SECRET');
    } catch (e) {
      if (isDev) {
        console.warn('⚠️ Environment variable ADMIN_SESSION_SECRET is not set. Falling back to default secret HuitMedia2026 for development.');
        return 'HuitMedia2026';
      }
      throw new Error('FATAL: Environment variable ADMIN_SESSION_SECRET is required on production!');
    }
  }

  async bulkImportCandidates(payload: Partial<Candidate>[]): Promise<{ successCount: number; errors: string[] }> {
    if (!payload || !Array.isArray(payload)) {
      throw new BadRequestException('Dữ liệu tải lên không hợp lệ.');
    }

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < payload.length; i++) {
      const item = payload[i];
      const rowNum = i + 2; // Row number in CSV, skipping header

      const sbd = item.sbd?.trim();
      const name = item.name?.trim();

      if (!sbd) {
        errors.push(`Dòng ${rowNum}: Thiếu Số báo danh (SBD).`);
        continue;
      }
      if (!name) {
        errors.push(`Dòng ${rowNum} (SBD ${sbd}): Thiếu Tên dự án.`);
        continue;
      }

      try {
        this.ensureCandidateDir(sbd);
        
        const cleanData = {
          name,
          votes: item.votes !== undefined ? Number(item.votes) : 0,
          imageUrl: item.imageUrl || '/duan/anhmauduan.png',
          description: item.description || 'Hồ sơ dự án dự thi HUIT Startup.',
          biography: item.biography || 'Thông tin dự án đang được cập nhật.',
          teamName: item.teamName || null,
          representativeSchool: item.representativeSchool || null,
          leaderName: item.leaderName || null,
          leaderPhone: item.leaderPhone || null,
          leaderEmail: item.leaderEmail || null,
          advisorName: item.advisorName || null,
          members: item.members || null,
          implementationLocation: item.implementationLocation || null,
          intellectualPropertyCommitment: item.intellectualPropertyCommitment ?? false,
          supportNeeds: item.supportNeeds || null,
          expectations: item.expectations || null,
          contestTable: item.contestTable || 'STUDENT',
          contestTableLabel: item.contestTableLabel || null,
          currentRound: item.currentRound || 'Vòng loại',
          status: item.status || 'Đủ hồ sơ',
          sector: item.sector || null,
          showcaseImages: item.showcaseImages || null,
        };

        const prepared = this.prepareCandidateData(cleanData as any);

        await this.prisma.candidate.upsert({
          where: { sbd },
          update: prepared,
          create: {
            sbd,
            ...prepared,
          },
        });

        successCount++;
      } catch (err: any) {
        errors.push(`Dòng ${rowNum} (SBD ${sbd}): Lỗi ghi DB - ${err.message || err}`);
      }
    }

    return { successCount, errors };
  }

  // --- NEWS & ANNOUNCEMENTS (POSTS) ---
  async getPublicPosts(category?: string, search?: string) {
    const where: any = { isActive: true };
    if (category && category !== 'Tất cả') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
      ];
    }
    return this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostBySlugOrId(slugOrId: string) {
    let post = await this.prisma.post.findUnique({
      where: { slug: slugOrId },
    });
    
    if (!post) {
      post = await this.prisma.post.findUnique({
        where: { id: slugOrId },
      });
    }

    if (post && post.isActive) {
      post = await this.prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });
    }

    return post;
  }

  async getAdminPosts() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  private slugify(text: string): string {
    let str = text.toLowerCase();
    str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a');
    str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e');
    str = str.replace(/i|í|ì|ỉ|ĩ|ị/g, 'i');
    str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o');
    str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u');
    str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/[^a-z0-9\s-]/g, '');
    str = str.replace(/\s+/g, '-');
    str = str.replace(/-+/g, '-');
    str = str.trim().replace(/^-+|-+$/g, '');
    return str || `post-${Date.now()}`;
  }

  async createPost(input: any) {
    const title = input.title || 'Bài viết mới';
    let slug = input.slug ? this.slugify(input.slug) : this.slugify(title);

    let slugExists = await this.prisma.post.findUnique({ where: { slug } });
    let counter = 1;
    const baseSlug = slug;
    while (slugExists) {
      slug = `${baseSlug}-${counter}`;
      slugExists = await this.prisma.post.findUnique({ where: { slug } });
      counter++;
    }

    return this.prisma.post.create({
      data: {
        title,
        slug,
        summary: input.summary || '',
        content: input.content || '',
        thumbnailUrl: input.thumbnailUrl || '',
        isActive: input.isActive !== false,
        category: input.category || 'Tin tức',
        views: 0,
      },
    });
  }

  async updatePost(id: string, input: any) {
    const data: any = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.slug !== undefined) {
      data.slug = this.slugify(input.slug);
    }
    if (input.summary !== undefined) data.summary = input.summary;
    if (input.content !== undefined) data.content = input.content;
    if (input.thumbnailUrl !== undefined) data.thumbnailUrl = input.thumbnailUrl;
    if (input.isActive !== undefined) data.isActive = Boolean(input.isActive);
    if (input.category !== undefined) data.category = input.category;
    if (input.views !== undefined) data.views = parseInt(input.views, 10);

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
