import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UnauthorizedException } from '@nestjs/common';
import { AppService, SystemSettings } from './app.service';
import { Candidate, Sponsor, TimelineEvent, Banner, VotePackage, WebUser } from '@huitfest/shared';
import { FileInterceptor } from '@nestjs/platform-express';
// @ts-ignore
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

function normalizeUploadFilename(originalName: string) {
  const basename = path.basename(originalName).replace(/[\\/]/g, '');
  return basename || `upload${path.extname(originalName)}`;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // --- ADMIN AUTH ---
  @Post('admin/login')
  async adminLogin(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    if (!username || !password) {
      throw new UnauthorizedException('Thiếu thông tin đăng nhập.');
    }

    const adminUser = await this.appService.validateAdminCredentials(username, password);
    if (!adminUser) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    return {
      ok: true,
      admin: {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
      },
    };
  }

  // --- FILE UPLOAD ---
  @Post('admin/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadDirWeb = path.join(process.cwd(), '../web/public/uploads');
          if (!fs.existsSync(uploadDirWeb)) {
            fs.mkdirSync(uploadDirWeb, { recursive: true });
          }
          cb(null, uploadDirWeb);
        },
        filename: (req: any, file: any, cb: any) => {
          cb(null, normalizeUploadFilename(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: any): Promise<{ url: string }> {
    if (!file) {
      throw new Error('File upload failed');
    }
    
    // Copy file to admin public uploads so it displays correctly on localhost:3001
    try {
      const adminUploadDir = path.join(process.cwd(), '../admin/public/uploads');
      if (!fs.existsSync(adminUploadDir)) {
        fs.mkdirSync(adminUploadDir, { recursive: true });
      }
      fs.copyFileSync(file.path, path.join(adminUploadDir, file.filename));
      console.log(`✅ Uploaded file copied to admin static folder: /uploads/${file.filename}`);
    } catch (e) {
      console.error('⚠️ Failed to copy uploaded file to admin public:', e);
    }
    
    return { url: `/uploads/${file.filename}` };
  }

  // --- CANDIDATES ---
  @Get('candidates')
  async getCandidates(): Promise<Candidate[]> {
    return this.appService.getCandidates();
  }

  @Get('candidates/:sbd')
  async getCandidateBySbd(@Param('sbd') sbd: string): Promise<Candidate> {
    return this.appService.getCandidateBySbd(sbd);
  }

  @Post('candidates/:sbd/vote')
  async voteCandidate(
    @Param('sbd') sbd: string,
    @Body() body: any
  ): Promise<Candidate> {
    const result = await this.appService.voteCandidate(sbd, body || {});
    return result.candidate;
  }

  @Get('vote-packages')
  getVotePackages(): VotePackage[] {
    return this.appService.getVotePackages();
  }

  @Get('voting/packages')
  getVotingPackages(): VotePackage[] {
    return this.appService.getVotePackages();
  }

  @Get('voting/free-quota/:userId')
  getFreeVoteQuota(@Param('userId') userId: string): { remaining: number; limit: number } {
    return this.appService.getFreeVoteQuota(userId);
  }

  @Post('voting/candidates/:sbd')
  async createVote(@Param('sbd') sbd: string, @Body() body: any): Promise<any> {
    return this.appService.voteCandidate(sbd, body || {});
  }

  @Post('admin/candidates')
  async addCandidate(@Body() newCandidate: Partial<Candidate>): Promise<Candidate> {
    return this.appService.addCandidate(newCandidate);
  }

  @Put('admin/candidates/:id')
  async updateCandidate(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Candidate>
  ): Promise<Candidate> {
    return this.appService.updateCandidate(id, updatedFields);
  }

  @Delete('admin/candidates/:id')
  async deleteCandidate(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteCandidate(id);
  }

  // --- WEB AUTH & USERS ---
  @Post('web/auth/register')
  async registerWebUser(@Body() payload: any): Promise<{ ok: boolean; user: WebUser; token: string }> {
    return this.appService.registerWebUser(payload);
  }

  @Post('web/auth/quick-register')
  async quickRegisterWebUser(@Body() payload: any): Promise<{ ok: boolean; user: WebUser; token: string }> {
    return this.appService.quickRegisterWebUser(payload);
  }

  @Post('web/auth/login')
  async loginWebUser(@Body('email') email: string, @Body('password') password: string): Promise<{ ok: boolean; user: WebUser; token: string }> {
    return this.appService.loginWebUser(email, password);
  }

  @Post('web/auth/google')
  async googleLogin(@Body() payload: any): Promise<{ ok: boolean; user: WebUser; token: string }> {
    return this.appService.googleLogin(payload);
  }

  @Get('admin/web-users')
  async getWebUsers(): Promise<WebUser[]> {
    return this.appService.getWebUsers();
  }

  // --- SPONSORS ---
  @Get('sponsors')
  async getSponsors(): Promise<Sponsor[]> {
    return this.appService.getSponsors();
  }

  @Post('admin/sponsors')
  async addSponsor(@Body() newSponsor: Partial<Sponsor>): Promise<Sponsor> {
    return this.appService.addSponsor(newSponsor);
  }

  @Put('admin/sponsors/:id')
  async updateSponsor(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Sponsor>
  ): Promise<Sponsor> {
    return this.appService.updateSponsor(id, updatedFields);
  }

  @Delete('admin/sponsors/:id')
  async deleteSponsor(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteSponsor(id);
  }

  // --- TIMELINE ---
  @Get('timeline')
  async getTimeline(): Promise<TimelineEvent[]> {
    return this.appService.getTimeline();
  }

  @Post('admin/timeline')
  async addTimelineEvent(@Body() newEvent: Partial<TimelineEvent>): Promise<TimelineEvent> {
    return this.appService.addTimelineEvent(newEvent);
  }

  @Put('admin/timeline/:id')
  async updateTimelineEvent(
    @Param('id') id: string,
    @Body() updatedFields: Partial<TimelineEvent>
  ): Promise<TimelineEvent> {
    return this.appService.updateTimelineEvent(id, updatedFields);
  }

  @Delete('admin/timeline/:id')
  async deleteTimelineEvent(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteTimelineEvent(id);
  }

  // --- BANNERS ---
  @Get('banners')
  async getBanners(): Promise<Banner[]> {
    return this.appService.getBanners();
  }

  @Post('admin/banners')
  async addBanner(@Body() newBanner: Partial<Banner>): Promise<Banner> {
    return this.appService.addBanner(newBanner);
  }

  @Put('admin/banners/:id')
  async updateBanner(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Banner>
  ): Promise<Banner> {
    return this.appService.updateBanner(id, updatedFields);
  }

  @Delete('admin/banners/:id')
  async deleteBanner(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteBanner(id);
  }

  // --- SYSTEM SETTINGS ---
  @Get('settings')
  getSettings(): SystemSettings {
    return this.appService.getSettings();
  }

  @Put('admin/settings')
  updateSettings(@Body() updatedFields: Partial<SystemSettings>): SystemSettings {
    return this.appService.updateSettings(updatedFields);
  }

  @Post('admin/settings/reset-votes')
  async resetVotes(): Promise<{ success: boolean }> {
    return this.appService.resetVotes();
  }
}
