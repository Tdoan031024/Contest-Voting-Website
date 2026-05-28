import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Candidate, Sponsor, TimelineEvent, Banner } from '@huitfest/shared';
import { PrismaService } from './prisma.service';
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
export class AppService implements OnModuleInit {
  private dbFilePath = path.join(process.cwd(), 'contest_voting_db.json');
  private settings: SystemSettings = {
    isGateOpen: true,
    startDate: '2024-10-20T00:00',
    endDate: '2024-11-24T23:59',
    maxVotesPerPhone: 5,
    eventTitle: "Cổng bình chọn HUIT's Iconic",
    organizer: "Trường Đại học Công Thương TP.HCM (HUIT)",
    contactEmail: "support@eventista.vn",
    isMaintenanceMode: false
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
          this.settings = data.settings;
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

  private async seedDataIfNeeded() {
    try {
      const candidatesCount = await this.prisma.candidate.count();
      if (candidatesCount > 0) {
        console.log('ℹ️ Database already has data. Skipping migration/seeding.');
        return;
      }

      if (!fs.existsSync(this.dbFilePath)) {
        console.log('⚠️ contest_voting_db.json not found. No seeding data available.');
        return;
      }

      console.log('🚀 Database empty. Migrating/Seeding data from contest_voting_db.json into MySQL...');
      const fileContent = fs.readFileSync(this.dbFilePath, 'utf8');
      const data = JSON.parse(fileContent);

      // Seed Candidates
      if (data.candidates && Array.isArray(data.candidates)) {
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
      if (data.sponsors && Array.isArray(data.sponsors)) {
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
      if (data.timeline && Array.isArray(data.timeline)) {
        for (const t of data.timeline) {
          await this.prisma.timelineEvent.create({
            data: {
              id: t.id,
              date: t.date,
              title: t.title,
              description: t.description || '',
              isActive: t.isActive ?? false,
            }
          });
        }
        console.log(`✅ Seeded ${data.timeline.length} timeline events.`);
      }

      // Seed Banners
      if (data.banners && Array.isArray(data.banners)) {
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

      console.log('🎉 Seeding migration to MySQL completed successfully!');
    } catch (e) {
      console.error('❌ Failed to seed database from JSON file:', e);
    }
  }

  // --- CANDIDATES ---
  async getCandidates(): Promise<Candidate[]> {
    return this.prisma.candidate.findMany({
      orderBy: { votes: 'desc' },
    }) as any;
  }

  async getCandidateBySbd(sbd: string): Promise<Candidate> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { sbd },
    });
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với SBD ${sbd}`);
    }
    return candidate as any;
  }

  async voteCandidate(sbd: string, phone: string): Promise<Candidate> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { sbd },
    });
    if (!candidate) {
      throw new NotFoundException(`Không tìm thấy thí sinh với SBD ${sbd}`);
    }

    const updatedCandidate = await this.prisma.candidate.update({
      where: { sbd },
      data: { votes: { increment: 1 } },
    });

    try {
      await this.prisma.voteRecord.create({
        data: {
          candidateId: candidate.id,
          voterPhone: phone,
        },
      });
    } catch (err) {
      console.error('⚠️ Failed to save VoteRecord:', err);
    }

    console.log(`[VOTE] 1 vote received for SBD ${sbd} (phone: ${phone}). New total: ${updatedCandidate.votes}`);
    return updatedCandidate as any;
  }

  async addCandidate(newCandidate: Partial<Candidate>): Promise<Candidate> {
    const sbd = newCandidate.sbd || Math.floor(Math.random() * 100).toString().padStart(3, '0');
    return this.prisma.candidate.create({
      data: {
        sbd,
        name: newCandidate.name || 'Thí sinh mới',
        votes: newCandidate.votes || 0,
        imageUrl: newCandidate.imageUrl || '/original_assets/image389b.png',
        description: newCandidate.description || 'Thí sinh mới của HUIT\'s Iconic.',
        biography: newCandidate.biography || 'Thông tin tiểu sử đang được cập nhật.',
      },
    }) as any;
  }

  async updateCandidate(id: string, updatedFields: Partial<Candidate>): Promise<Candidate> {
    const cleanFields = { ...updatedFields };
    delete cleanFields.id;
    delete (cleanFields as any).createdAt;
    delete (cleanFields as any).updatedAt;

    return this.prisma.candidate.update({
      where: { id },
      data: cleanFields,
    }) as any;
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
        date: newEvent.date || '2024-11-01',
        title: newEvent.title || 'Sự kiện mới',
        description: newEvent.description || 'Chi tiết nội dung sự kiện...',
        isActive: newEvent.isActive ?? false,
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
}
