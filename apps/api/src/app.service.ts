import { Injectable, NotFoundException, OnModuleInit, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
// Trigger NestJS api server watch reload to sync modified JSON database settings
import { Candidate, Sponsor, TimelineEvent, Banner, VotePackage, VotingPromotion, WebUser } from '@huitfest/shared';
import { PrismaService } from './prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

function hashPasswordMd5(value: string): string {
  return crypto.createHash('md5').update(String(value || '')).digest('hex');
}

function isMd5Hash(value?: string | null): boolean {
  return !!value && /^[a-f0-9]{32}$/i.test(value);
}

export function normalizeEmail(email: string): string {
  const trimmed = String(email || '').trim().toLowerCase();
  const parts = trimmed.split('@');
  if (parts.length !== 2) return trimmed;
  const [localPart, domain] = parts;
  const baseLocal = localPart.split('+')[0];
  return `${baseLocal}@${domain}`;
}

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
  hideSponsorBanner?: boolean;
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
  votingPromotions?: VotingPromotion[];
  activeVotingPromotion?: VotingPromotion | null;
  sepayBankName?: string;
  sepayAccountNo?: string;
  sepayAccountName?: string;
  sepayPrefix?: string;
  sepayApiKey?: string;
  isTestMode?: boolean;
  faq?: Array<{ question: string; answer: string }>;
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
  private get dbFilePath(): string {
    return process.env.DATABASE_FILE_PATH || path.resolve(__dirname, '..', 'contest_voting_db.json');
  }
  private settings: SystemSettings = {
    isGateOpen: false,
    startDate: '2026-06-01T00:00',
    endDate: '2026-12-31T23:59',
    maxVotesPerPhone: 5,
    eventTitle: "HUIT STARTUP - Đổi mới sáng tạo hướng tới phát triển bền vững",
    organizer: "Trường Đại học Công Thương TP.HCM (HUIT)",
    contactEmail: "media@huit.edu.vn",
    isMaintenanceMode: false,
    sponsorBannerUrl: "/original_assets/image4b12.png",
    hideSponsorBanner: false,
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
    freeVotesPerAccountPerDay: 2,
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
    votingPromotions: [],
    votePackages: [
      { id: 'free-5', code: 'FREE_5', name: '5 điểm miễn phí', points: 5, price: 0, currency: 'VND', vatRate: 10, packageType: 'FREE', isActive: true },
      { id: 'vote-10', code: 'PAID_10', name: '10 điểm', points: 10, price: 10000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-20', code: 'PAID_20', name: '20 điểm', points: 20, price: 20000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-50', code: 'PAID_50', name: '50 điểm', points: 50, price: 50000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-220', code: 'PAID_220', name: '220 điểm', points: 220, price: 100000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-1050', code: 'PAID_1050', name: '1.050 điểm', points: 1050, price: 500000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-2300', code: 'PAID_2300', name: '2.300 điểm', points: 2300, price: 1000000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true },
      { id: 'vote-7000', code: 'PAID_7000', name: '7.000 điểm', points: 7000, price: 3000000, currency: 'VND', vatRate: 10, packageType: 'PAID', isActive: true }
    ],
    faq: [
      {
        question: 'Bình chọn miễn phí có giới hạn không?',
        answer: 'Có. Mỗi tài khoản được 2 lượt bình chọn miễn phí mỗi ngày cho toàn bộ dự án trong hệ thống. Dùng hết 2 lượt thì cần chờ sang ngày hôm sau.'
      },
      {
        question: 'Tôi có thể bình chọn cho nhiều dự án không?',
        answer: 'Có, nhưng tổng số lượt miễn phí mỗi ngày vẫn chỉ là 2. Bạn có thể dùng cả 2 lượt cho một dự án hoặc chia ra cho các dự án khác nhau.'
      },
      {
        question: 'Tôi quên mật khẩu thì phải làm gì?',
        answer: 'Bạn có thể đăng nhập bằng Google hoặc liên hệ ban tổ chức qua email iec@huit.edu.vn để được hỗ trợ khôi phục tài khoản.'
      }
    ]
  };

  constructor(private readonly prisma: PrismaService) {
    this.loadSettings();
    this.normalizeVotingSettings();
    this.saveSettings();
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

  private getFreeVotePackage(): VotePackage {
    return {
      id: 'free-daily-vote',
      code: 'FREE_DAILY_VOTE',
      name: '1 lÆ°á»£t bÃ¬nh chá»n',
      points: 1,
      price: 0,
      currency: 'VND',
      vatRate: 0,
      packageType: 'FREE',
      isActive: true,
    };
  }

  private parseLocalDate(dateStr: string): Date {
    if (!dateStr) return new Date(NaN);
    let formatted = dateStr.trim();
    // If it doesn't end with Z or have offset like +07:00 or -05:00, append +07:00 (Vietnam timezone)
    if (!formatted.includes('Z') && !/\+\d{2}:?\d{2}$/.test(formatted) && !/-\d{2}:?\d{2}$/.test(formatted)) {
      formatted = `${formatted}+07:00`;
    }
    return new Date(formatted);
  }

  private normalizeVotingPromotions(input: any): VotingPromotion[] {
    if (!Array.isArray(input)) return [];

    return input
      .map((item: any, index: number) => {
        const multiplier = Number(item?.multiplier);
        const startAt = String(item?.startAt || '').trim();
        const endAt = String(item?.endAt || '').trim();
        const appliesTo = item?.appliesTo === 'PAID' || item?.appliesTo === 'ALL' ? item.appliesTo : 'FREE';

        if (!startAt || !endAt || !Number.isFinite(multiplier) || multiplier < 1) {
          return null;
        }

        return {
          id: String(item?.id || `promo-${index + 1}-${Date.now()}`),
          name: String(item?.name || `Nhân ${multiplier} điểm`).trim(),
          multiplier: Math.max(1, Math.floor(multiplier)),
          startAt,
          endAt,
          isEnabled: item?.isEnabled !== false,
          appliesTo,
          note: item?.note ? String(item.note) : undefined,
        } as VotingPromotion;
      })
      .filter((promotion): promotion is VotingPromotion => promotion !== null)
      .sort((a, b) => {
        if (b.multiplier !== a.multiplier) return b.multiplier - a.multiplier;
        return this.parseLocalDate(b.startAt).getTime() - this.parseLocalDate(a.startAt).getTime();
      });
  }

  private getActiveVotingPromotion(now = new Date(), voteType: 'FREE' | 'PAID' = 'FREE'): VotingPromotion | null {
    const promotions = this.normalizeVotingPromotions(this.settings.votingPromotions);
    for (const promotion of promotions) {
      if (!promotion.isEnabled) continue;
      if (!(promotion.appliesTo === 'ALL' || promotion.appliesTo === voteType)) continue;

      const start = this.parseLocalDate(promotion.startAt);
      const end = this.parseLocalDate(promotion.endAt);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue;
      if (now >= start && now <= end) return promotion;
    }
    return null;
  }

  private calculateVotePoints(basePoints: number, voteType: 'FREE' | 'PAID' = 'FREE') {
    const promotion = this.getActiveVotingPromotion(new Date(), voteType);
    const multiplierApplied = promotion?.multiplier || 1;

    return {
      basePoints,
      multiplierApplied,
      finalPoints: basePoints * multiplierApplied,
      promotion,
    };
  }

  private normalizeVotingSettings() {
    this.settings.freeVotesPerAccountPerDay = Number(this.settings.freeVotesPerAccountPerDay) > 0
      ? Number(this.settings.freeVotesPerAccountPerDay)
      : 2;
    if (!Array.isArray(this.settings.exchangeRates) || this.settings.exchangeRates.length === 0) {
      this.settings.exchangeRates = [
        { points: 1, price: 0, label: '1 lượt bình chọn miễn phí' },
      ];
    }
    if (!Array.isArray(this.settings.votePackages) || this.settings.votePackages.length === 0) {
      this.settings.votePackages = [this.getFreeVotePackage()];
    }
    this.settings.votingPromotions = this.normalizeVotingPromotions(this.settings.votingPromotions);
    this.settings.activeVotingPromotion = this.getActiveVotingPromotion();
    if (!Array.isArray(this.settings.guideSections) || this.settings.guideSections.length === 0) {
      this.settings.guideSections = [
        {
          title: 'Bình chọn miễn phí mỗi ngày',
          steps: [
            { number: '01', description: 'Đăng ký hoặc đăng nhập tài khoản để bình chọn.', image: '/original_assets/imagefca6.png' },
            { number: '02', description: 'Mỗi tài khoản có 2 lượt bình chọn miễn phí trong mỗi ngày.', image: '/original_assets/imagef1be.png' },
            { number: '03', description: 'Mỗi lần bình chọn tăng 1 lượt cho dự án bạn chọn.', image: '/original_assets/image81d3.png' },
            { number: '04', description: 'Dùng hết 2 lượt trong ngày thì không thể bình chọn cho bất kỳ dự án nào khác cho đến ngày hôm sau.', image: '/original_assets/image20da.png' },
          ],
        },
      ] as any;
    }
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
      const dbCandidateCount = await this.prisma.candidate.count();
      if (dbCandidateCount === 0 && data.candidates && Array.isArray(data.candidates)) {
        console.log('Seeding candidates...');
        for (const c of data.candidates) {
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
      } else if (dbCandidateCount > 0) {
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
        const hashedPassword = await bcrypt.hash('Huit@media2019', 10);
        await this.prisma.adminUser.create({
          data: {
            username: 'Startup.Huitmedia',
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
    try {
      const candidates = await this.prisma.candidate.findMany({
        orderBy: { votes: 'desc' },
      });
      return candidates.map((candidate: any) => this.mergeCandidate(candidate));
    } catch (e) {
      console.error('⚠️ Prisma DB query failed for candidates, falling back to local JSON file:', e);
      const local = this.readLocalData() as any;
      return (local.candidates || []).map((candidate: any) => this.mergeCandidate(candidate));
    }
  }

  async getCandidateVotes(sbd: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { sbd },
    });
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với SBD ${sbd}`);
    }

    const votes = await this.prisma.voteRecord.findMany({
      where: { candidateId: candidate.id },
      orderBy: { voteTime: 'desc' },
      take: 8,
    });

    const webUsers = await this.prisma.webUser.findMany();
    const userMap = new Map<string, any>();
    for (const u of webUsers) {
      if (u.id) userMap.set(u.id, u);
      if (u.email) userMap.set(u.email.toLowerCase(), u);
      if (u.phone) userMap.set(u.phone, u);
    }

    return votes.map((v: any) => {
      const voterKey = String(v.voterPhone || '').trim().toLowerCase();
      const user = userMap.get(voterKey) || userMap.get(v.voterPhone);
      
      let maskedPhone = v.voterPhone || 'Người dùng ẩn';
      if (maskedPhone && maskedPhone.length >= 7) {
        maskedPhone = maskedPhone.substring(0, 3) + '***' + maskedPhone.substring(maskedPhone.length - 4);
      } else if (maskedPhone !== 'Người dùng ẩn') {
        maskedPhone = '***' + maskedPhone.slice(-3);
      }

      return {
        id: v.id,
        voterPhone: maskedPhone,
        voterName: user ? user.fullName : 'Cử tri ẩn danh',
        voteTime: v.voteTime,
      };
    });
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
    return [this.getFreeVotePackage()];
  }

  async getFreeVoteQuota(userId: string): Promise<{ remaining: number; limit: number }> {
    const webUser = await this.prisma.webUser.findUnique({ where: { id: userId } });
    if (!webUser) return { remaining: 0, limit: 0 };
    return this.getFreeVoteQuotaSecure(webUser);
  }

  async getFreeVoteQuotaSecure(user: { id?: string | null; phone?: string | null; email?: string | null }): Promise<{ remaining: number; limit: number }> {
    const limit = this.settings.freeVotesPerAccountPerDay || 2;
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const identifiers = [user.phone, user.email, user.id].filter(Boolean) as string[];
    
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
      throw new BadRequestException('C???ng b??nh ch???n hi???n ??ang ????ng ho???c ch??a ?????n th???i gian m??? c???ng.');
    }

    const candidate = await this.prisma.candidate.findUnique({
      where: { sbd },
    });
    if (!candidate) {
      throw new NotFoundException(`Kh??ng t??m th???y th?? sinh v???i SBD ${sbd}`);
    }

    const selectedPackage = this.getFreeVotePackage();
    const { basePoints, multiplierApplied, finalPoints, promotion } = this.calculateVotePoints(selectedPackage.points, 'FREE');
    let userId: string | null = null;

    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      userId = extractWebUserFromToken(token, this.getAdminSessionSecret());
    }

    if (!userId) {
      throw new UnauthorizedException('B??nh ch???n mi???n ph?? y??u c???u ????ng nh???p t??i kho???n h???p l???.');
    }

    const webUser = await this.prisma.webUser.findUnique({
      where: { id: userId },
    });
    if (!webUser || webUser.status === 'LOCKED') {
      throw new UnauthorizedException('T??i kho???n ng?????i d??ng kh??ng t???n t???i ho???c ???? b??? kh??a.');
    }

    const quota = await this.getFreeVoteQuotaSecure(webUser);
    if (quota.remaining <= 0) {
      throw new BadRequestException('T??i kho???n ???? d??ng h???t 2 l?????t b??nh ch???n trong ng??y h??m nay.');
    }

    const updatedCandidate = await this.prisma.$transaction(async (tx: any) => {
      const candidateUpdate = await tx.candidate.update({
        where: { id: candidate.id },
        data: { votes: { increment: finalPoints } },
      });

      const votingUser = await tx.webUser.findUnique({ where: { id: userId } });
      const voterPhoneIdentifier = votingUser?.phone || votingUser?.email || votingUser?.id || 'WEB_USER';

      await tx.voteRecord.create({
        data: {
          candidateId: candidate.id,
          voterPhone: voterPhoneIdentifier,
          transactionId: null,
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
      packageId: selectedPackage.id,
      packageType: selectedPackage.packageType,
      points: finalPoints,
      basePoints,
      multiplierApplied,
      promotionId: promotion?.id,
      promotionName: promotion?.name,
      amount: 0,
      userId,
      voterPhone: webUser.phone || webUser.email || webUser.id,
      createdAt: new Date().toISOString(),
    };

    data.voteHistory = [voteRecord, ...(data.voteHistory || [])];
    this.writeLocalData(data);

    console.log(`[VOTE] ${finalPoints} point received for SBD ${sbd}. New total: ${updatedCandidate.votes}`);
    return {
      candidate: this.mergeCandidate(updatedCandidate),
      voteRecord,
      promotion,
      transaction: null,
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
    try {
      return (await this.prisma.sponsor.findMany()) as any;
    } catch (e) {
      console.error('⚠️ Prisma DB query failed for sponsors, falling back to local JSON file:', e);
      const local = this.readLocalData() as any;
      return (local.sponsors || []) as any;
    }
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
    const passwordHash = hashPasswordMd5(password);
    const id = await this.generateUniqueWebUserId(email);
    const user = await this.prisma.webUser.create({
      data: {
        id,
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
      data.passwordHash = hashPasswordMd5(payload.password);
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
    const emailInput = String(payload.email || '').trim().toLowerCase();
    if (!emailInput || !payload.fullName || !payload.password) {
      throw new UnauthorizedException('Thiếu họ tên, email hoặc mật khẩu.');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput)) {
      throw new BadRequestException('Định dạng email không hợp lệ.');
    }

    const email = normalizeEmail(emailInput);

    const domain = email.split('@')[1];
    const disposableDomains = [
      'mailinator.com', 'yopmail.com', 'tempmail.com', 'temp-mail.org', 
      'guerrillamail.com', 'sharklasers.com', 'dispostable.com', 'getairmail.com',
      'maildrop.cc', 'mintemail.com', 'trashmail.com', '10minutemail.com', 'generator.email'
    ];
    if (disposableDomains.some(d => domain && domain.endsWith(d))) {
      throw new BadRequestException('Hệ thống không chấp nhận đăng ký bằng email ảo/tạm thời.');
    }

    const existing = await this.prisma.webUser.findUnique({
      where: { email },
    });
    if (existing) {
      throw new UnauthorizedException('Email đã được đăng ký.');
    }

    const id = await this.generateUniqueWebUserId(email);
    const user = await this.prisma.webUser.create({
      data: {
        id,
        fullName: payload.fullName,
        email,
        phone: payload.phone,
        passwordHash: hashPasswordMd5(payload.password),
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

    const id = await this.generateUniqueWebUserId(email);
    const user = await this.prisma.webUser.create({
      data: {
        id,
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
      where: { email: normalizeEmail(email) },
    });

    if (!user || user.status === 'LOCKED' || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const normalizedPassword = String(password || '');
    const matched = isMd5Hash(user.passwordHash)
      ? user.passwordHash.toLowerCase() === hashPasswordMd5(normalizedPassword).toLowerCase()
      : await bcrypt.compare(normalizedPassword, user.passwordHash);
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

    const email = normalizeEmail(googleProfile?.email || payload.email || '');
    if (!email) {
      throw new UnauthorizedException('Thiếu email Google.');
    }

    let user = await this.prisma.webUser.findUnique({
      where: { email },
    });

    if (!user) {
      const id = await this.generateUniqueWebUserId(email);
      user = await this.prisma.webUser.create({
        data: {
          id,
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
    this.normalizeVotingSettings();
    this.settings.activeVotingPromotion = this.getActiveVotingPromotion();
    return this.settings;
  }

  getPublicSettings(): Partial<SystemSettings> {
    this.normalizeVotingSettings();
    this.settings.activeVotingPromotion = this.getActiveVotingPromotion();
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
      'hideSponsorBanner',
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
      'activeVotingPromotion',
      'faq',
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
    this.normalizeVotingSettings();
    this.settings.activeVotingPromotion = this.getActiveVotingPromotion();
    this.saveSettings();

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
    try {
      return getEnvVar('ADMIN_SESSION_SECRET');
    } catch (e) {
      return 'HuitMedia2026';
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

  async getDashboardStats() {
    const totalCandidates = await this.prisma.candidate.count();
    const totalUsers = await this.prisma.webUser.count();
    const totalSponsors = await this.prisma.sponsor.count();
    const totalPosts = await this.prisma.post.count();

    const votesAgg = await this.prisma.candidate.aggregate({
      _sum: { votes: true }
    });
    const totalVotes = votesAgg._sum.votes || 0;

    // Group vote history of the last 7 days
    const chartData: { label: string; value: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const count = await this.prisma.voteRecord.count({
        where: {
          voteTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });

      const label = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      chartData.push({ label, value: count });
    }

    // Recent activities (last 4 votes)
    const recentVotes = await this.prisma.voteRecord.findMany({
      take: 4,
      orderBy: { voteTime: 'desc' },
    });

    const candidateIds = recentVotes.map((v: (typeof recentVotes)[number]) => v.candidateId);
    const relatedCandidates = await this.prisma.candidate.findMany({
      where: { id: { in: candidateIds } }
    });

    const candidatesMap = new Map<string, { id: string; name: string; sbd: string }>(
      relatedCandidates.map((c: (typeof relatedCandidates)[number]) => [c.id, { id: c.id, name: c.name, sbd: c.sbd }]),
    );

    const activities = recentVotes.map((v: (typeof recentVotes)[number]) => {
      const cand = candidatesMap.get(v.candidateId);
      const date = new Date(v.voteTime);
      const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return {
        id: v.id,
        title: cand ? `Bình chọn dự án: ${cand.name}` : `Bình chọn dự án ẩn`,
        author: v.voterPhone || 'Người dùng ẩn',
        time: timeStr,
      };
    });

    const postsViews = await this.prisma.post.aggregate({
      _sum: { views: true }
    });
    const totalPostViews = postsViews._sum.views || 0;

    // Calculate weekly growth rates dynamically
    const startOfThisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfLastWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const getGrowthStr = (thisWeekCount: number, lastWeekCount: number): string => {
      if (lastWeekCount === 0) {
        return thisWeekCount > 0 ? '↑ 100%' : '↑ 0%';
      }
      const growth = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
      const formatted = growth.toFixed(1).replace('.0', '');
      return `${growth >= 0 ? '↑' : '↓'} ${Math.abs(Number(formatted))}%`;
    };

    const thisWeekUsers = await this.prisma.webUser.count({
      where: { createdAt: { gte: startOfThisWeek } }
    });
    const lastWeekUsers = await this.prisma.webUser.count({
      where: { createdAt: { gte: startOfLastWeek, lt: startOfThisWeek } }
    });
    const usersGrowthStr = getGrowthStr(thisWeekUsers, lastWeekUsers);

    const thisWeekSponsors = await this.prisma.sponsor.count({
      where: { createdAt: { gte: startOfThisWeek } }
    });
    const lastWeekSponsors = await this.prisma.sponsor.count({
      where: { createdAt: { gte: startOfLastWeek, lt: startOfThisWeek } }
    });
    const sponsorsGrowthStr = getGrowthStr(thisWeekSponsors, lastWeekSponsors);

    const thisWeekVotes = await this.prisma.voteRecord.count({
      where: { voteTime: { gte: startOfThisWeek } }
    });
    const lastWeekVotes = await this.prisma.voteRecord.count({
      where: { voteTime: { gte: startOfLastWeek, lt: startOfThisWeek } }
    });
    const votesGrowthStr = getGrowthStr(thisWeekVotes, lastWeekVotes);

    const viewsThisWeek = thisWeekVotes * 5 + thisWeekUsers * 3;
    const viewsLastWeek = lastWeekVotes * 5 + lastWeekUsers * 3;
    const viewsGrowthStr = getGrowthStr(viewsThisWeek, viewsLastWeek);

    return {
      totalCandidates,
      totalUsers,
      totalSponsors,
      totalVotes,
      totalPosts,
      chartData,
      activities,
      totalPostViews,
      growth: {
        views: viewsGrowthStr,
        votes: votesGrowthStr,
        users: usersGrowthStr,
        sponsors: sponsorsGrowthStr,
      },
      settings: {
        isGateOpen: this.settings.isGateOpen,
        endDate: this.settings.endDate,
        statsViews: this.settings.statsViews || '1,259',
      }
    };
  }

  async recordPageView(body: any, userAgent?: string, ip?: string) {
    const visitorId = String(body?.visitorId || '').trim().slice(0, 100);
    if (!visitorId) {
      throw new BadRequestException('Missing visitor id.');
    }

    const rawPath = String(body?.path || '/').trim();
    const pagePath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    const referrer = body?.referrer ? String(body.referrer).slice(0, 1000) : null;
    const ipValue = String(ip || '').split(',')[0]?.trim();
    const ipHash = ipValue ? crypto.createHash('sha256').update(ipValue).digest('hex') : null;

    await this.prisma.pageView.create({
      data: {
        visitorId,
        path: pagePath.slice(0, 190),
        referrer,
        userAgent: String(userAgent || body?.userAgent || '').slice(0, 1000) || null,
        ipHash,
      },
    });

    return { ok: true };
  }

  async getAnalyticsSummary() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start30Days = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);

    const [totalViews, todayViews, recentViews] = await Promise.all([
      this.prisma.pageView.count(),
      this.prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.pageView.findMany({
        where: { createdAt: { gte: start30Days } },
        select: { path: true, visitorId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10000,
      }),
    ]);

    const allVisitorIds = new Set(recentViews.map((view: any) => view.visitorId).filter(Boolean));
    const todayVisitorIds = new Set(
      recentViews
        .filter((view: any) => new Date(view.createdAt).getTime() >= todayStart.getTime())
        .map((view: any) => view.visitorId)
        .filter(Boolean),
    );

    const chartData: Array<{ label: string; value: number; visitors: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
      const dayViews = recentViews.filter((view: any) => {
        const time = new Date(view.createdAt).getTime();
        return time >= start && time < end;
      });
      chartData.push({
        label: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
        value: dayViews.length,
        visitors: new Set(dayViews.map((view: any) => view.visitorId).filter(Boolean)).size,
      });
    }

    const pageCounts = new Map<string, number>();
    for (const view of recentViews) {
      pageCounts.set(view.path, (pageCounts.get(view.path) || 0) + 1);
    }

    const topPages = Array.from(pageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, views]) => ({ path, views }));

    return {
      totalViews,
      todayViews,
      uniqueVisitors30Days: allVisitorIds.size,
      todayVisitors: todayVisitorIds.size,
      chartData,
      topPages,
    };
  }

  private async generateUniqueWebUserId(email: string): Promise<string> {
    const emailName = email.split('@')[0];
    let baseId = emailName.replace(/[^a-zA-Z0-9\._-]/g, '');
    if (!baseId) {
      baseId = `user-${Date.now()}`;
    }
    
    let id = baseId;
    let userExists = await this.prisma.webUser.findUnique({ where: { id } });
    let counter = 1;
    while (userExists) {
      id = `${baseId}-${counter}`;
      userExists = await this.prisma.webUser.findUnique({ where: { id } });
      counter++;
    }
    return id;
  }

  async getAdminVoteLogs() {
    const votes = await this.prisma.voteRecord.findMany({
      orderBy: { voteTime: 'desc' },
    });

    const candidateIds: string[] = Array.from(new Set(votes.map((v: any) => String(v.candidateId)).filter(Boolean)));
    const candidates = await this.prisma.candidate.findMany({
      where: { id: { in: candidateIds } },
    });
    const candidatesMap = new Map<string, { id: string; sbd: string; name: string }>(
      candidates.map((c: any) => [c.id, { id: c.id, sbd: c.sbd, name: c.name }]),
    );

    const webUsers = await this.prisma.webUser.findMany();
    const userMap = new Map<string, any>();
    for (const u of webUsers) {
      if (u.id) userMap.set(u.id, u);
      if (u.email) userMap.set(u.email.toLowerCase(), u);
      if (u.phone) userMap.set(u.phone, u);
    }

    return votes.map((v: any) => {
      const cand = candidatesMap.get(v.candidateId);
      const voterKey = String(v.voterPhone || '').trim().toLowerCase();
      const user = userMap.get(voterKey) || userMap.get(v.voterPhone);
      return {
        id: v.id,
        voterPhone: v.voterPhone,
        voterName: user ? user.fullName : 'Người dùng ẩn',
        voterEmail: user ? user.email : '',
        candidateSbd: cand ? cand.sbd : '---',
        candidateName: cand ? cand.name : 'Dự án không tồn tại',
        voteTime: v.voteTime,
      };
    });
  }

  async deleteVoteLog(id: string) {
    const vote = await this.prisma.voteRecord.findUnique({
      where: { id },
    });
    if (!vote) {
      throw new NotFoundException('Không tìm thấy bản ghi bình chọn.');
    }

    // Decrement candidate votes
    await this.prisma.$transaction(async (tx: any) => {
      // Find candidate to see if we can decrement votes (avoid negative votes)
      const cand = await tx.candidate.findUnique({ where: { id: vote.candidateId } });
      const currentVotes = cand?.votes || 0;
      await tx.candidate.update({
        where: { id: vote.candidateId },
        data: { votes: { set: Math.max(0, currentVotes - 1) } },
      });
      await tx.voteRecord.delete({
        where: { id },
      });
    });

    return { success: true };
  }

  async deleteVoteLogsBulk(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };

    // Group by candidateId to decrement votes correctly
    const votes = await this.prisma.voteRecord.findMany({
      where: { id: { in: ids } },
    });

    const candidateDecrementMap = new Map<string, number>();
    for (const vote of votes) {
      candidateDecrementMap.set(
        vote.candidateId,
        (candidateDecrementMap.get(vote.candidateId) || 0) + 1
      );
    }

    await this.prisma.$transaction(async (tx: any) => {
      // Decrement votes for each candidate
      for (const [candidateId, count] of candidateDecrementMap.entries()) {
        const cand = await tx.candidate.findUnique({ where: { id: candidateId } });
        const currentVotes = cand?.votes || 0;
        await tx.candidate.update({
          where: { id: candidateId },
          data: { votes: { set: Math.max(0, currentVotes - count) } },
        });
      }

      // Delete the vote records
      await tx.voteRecord.deleteMany({
        where: { id: { in: ids } },
      });
    });

    return { success: true, count: votes.length };
  }
}
