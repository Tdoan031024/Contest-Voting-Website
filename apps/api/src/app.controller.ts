import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UnauthorizedException, UseGuards, Headers, Query } from '@nestjs/common';
import { AppService, SystemSettings } from './app.service';
import { Candidate, Sponsor, TimelineEvent, Banner, VotePackage, WebUser } from '@huitfest/shared';
import { FileInterceptor } from '@nestjs/platform-express';
// @ts-ignore
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { AdminSessionGuard } from './admin-session.guard';

function getProjectRootDir() {
  let currentDir = __dirname;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(currentDir, 'apps')) && fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }
  return process.cwd();
}

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
  @UseGuards(AdminSessionGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const rootDir = getProjectRootDir();
          const uploadDirWeb = path.join(rootDir, 'apps/web/public/uploads');
          if (!fs.existsSync(uploadDirWeb)) {
            fs.mkdirSync(uploadDirWeb, { recursive: true });
          }
          cb(null, uploadDirWeb);
        },
        filename: (req: any, file: any, cb: any) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const filename = `${crypto.randomUUID()}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ cho phép tải lên file ảnh (jpeg, png, webp, gif) hoặc video mp4!'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: any): Promise<{ url: string }> {
    if (!file) {
      throw new Error('File upload failed');
    }
    
    // Copy file to admin public uploads so it displays correctly on localhost:3001
    try {
      const rootDir = getProjectRootDir();
      const adminUploadDir = path.join(rootDir, 'apps/admin/public/uploads');
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

  @Post('admin/candidates/:sbd/upload')
  @UseGuards(AdminSessionGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const url = req.originalUrl || req.url || '';
          const match = url.match(/\/candidates\/([^\/]+)\/upload/);
          const sbd = match ? match[1] : 'temp';
          const rootDir = getProjectRootDir();
          const uploadDirWeb = path.join(rootDir, 'apps/web/public/duan', sbd);
          if (!fs.existsSync(uploadDirWeb)) {
            fs.mkdirSync(uploadDirWeb, { recursive: true });
          }
          cb(null, uploadDirWeb);
        },
        filename: (req: any, file: any, cb: any) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const filename = `${crypto.randomUUID()}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ cho phép tải lên file ảnh (jpeg, png, webp, gif) hoặc video mp4!'), false);
        }
      },
    }),
  )
  async uploadCandidateFile(
    @Param('sbd') sbd: string,
    @UploadedFile() file: any
  ): Promise<{ url: string }> {
    if (!file) {
      throw new Error('File upload failed');
    }
    
    // Copy file to admin static folder under /duan/<sbd>
    try {
      const rootDir = getProjectRootDir();
      const adminUploadDir = path.join(rootDir, 'apps/admin/public/duan', sbd);
      if (!fs.existsSync(adminUploadDir)) {
        fs.mkdirSync(adminUploadDir, { recursive: true });
      }
      fs.copyFileSync(file.path, path.join(adminUploadDir, file.filename));
      console.log(`✅ Uploaded candidate file copied to admin static: /duan/${sbd}/${file.filename}`);
    } catch (e) {
      console.error('⚠️ Failed to copy uploaded candidate file to admin public:', e);
    }
    
    return { url: `/duan/${sbd}/${file.filename}` };
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
    @Body() body: any,
    @Headers('authorization') authHeader?: string,
  ): Promise<Candidate> {
    const result = await this.appService.voteCandidate(sbd, body || {}, authHeader);
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
  async getFreeVoteQuota(@Param('userId') userId: string): Promise<{ remaining: number; limit: number }> {
    return this.appService.getFreeVoteQuota(userId);
  }

  @Post('voting/candidates/:sbd')
  async createVote(
    @Param('sbd') sbd: string,
    @Body() body: any,
    @Headers('authorization') authHeader?: string,
  ): Promise<any> {
    return this.appService.voteCandidate(sbd, body || {}, authHeader);
  }

  @Post('admin/candidates')
  @UseGuards(AdminSessionGuard)
  async addCandidate(@Body() newCandidate: Partial<Candidate>): Promise<Candidate> {
    return this.appService.addCandidate(newCandidate);
  }

  @Post('admin/candidates/bulk')
  @UseGuards(AdminSessionGuard)
  async bulkImportCandidates(@Body() payload: Partial<Candidate>[]): Promise<{ successCount: number; errors: string[] }> {
    return this.appService.bulkImportCandidates(payload);
  }

  @Put('admin/candidates/:id')
  @UseGuards(AdminSessionGuard)
  async updateCandidate(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Candidate>
  ): Promise<Candidate> {
    return this.appService.updateCandidate(id, updatedFields);
  }

  @Delete('admin/candidates/:id')
  @UseGuards(AdminSessionGuard)
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
  @UseGuards(AdminSessionGuard)
  async getWebUsers(): Promise<WebUser[]> {
    return this.appService.getWebUsers();
  }

  @Post('admin/web-users')
  @UseGuards(AdminSessionGuard)
  async addWebUser(@Body() payload: any): Promise<WebUser> {
    return this.appService.addWebUser(payload);
  }

  @Put('admin/web-users/:id')
  @UseGuards(AdminSessionGuard)
  async updateWebUser(
    @Param('id') id: string,
    @Body() payload: any
  ): Promise<WebUser> {
    return this.appService.updateWebUser(id, payload);
  }

  @Delete('admin/web-users/:id')
  @UseGuards(AdminSessionGuard)
  async deleteWebUser(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteWebUser(id);
  }

  // --- SPONSORS ---
  @Get('sponsors')
  async getSponsors(): Promise<Sponsor[]> {
    return this.appService.getSponsors();
  }

  @Post('admin/sponsors')
  @UseGuards(AdminSessionGuard)
  async addSponsor(@Body() newSponsor: Partial<Sponsor>): Promise<Sponsor> {
    return this.appService.addSponsor(newSponsor);
  }

  @Put('admin/sponsors/:id')
  @UseGuards(AdminSessionGuard)
  async updateSponsor(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Sponsor>
  ): Promise<Sponsor> {
    return this.appService.updateSponsor(id, updatedFields);
  }

  @Delete('admin/sponsors/:id')
  @UseGuards(AdminSessionGuard)
  async deleteSponsor(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteSponsor(id);
  }

  // --- TIMELINE ---
  @Get('timeline')
  async getTimeline(): Promise<TimelineEvent[]> {
    return this.appService.getTimeline();
  }

  @Post('admin/timeline')
  @UseGuards(AdminSessionGuard)
  async addTimelineEvent(@Body() newEvent: Partial<TimelineEvent>): Promise<TimelineEvent> {
    return this.appService.addTimelineEvent(newEvent);
  }

  @Put('admin/timeline/:id')
  @UseGuards(AdminSessionGuard)
  async updateTimelineEvent(
    @Param('id') id: string,
    @Body() updatedFields: Partial<TimelineEvent>
  ): Promise<TimelineEvent> {
    return this.appService.updateTimelineEvent(id, updatedFields);
  }

  @Delete('admin/timeline/:id')
  @UseGuards(AdminSessionGuard)
  async deleteTimelineEvent(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteTimelineEvent(id);
  }

  // --- BANNERS ---
  @Get('banners')
  async getBanners(): Promise<Banner[]> {
    return this.appService.getBanners();
  }

  @Post('admin/banners')
  @UseGuards(AdminSessionGuard)
  async addBanner(@Body() newBanner: Partial<Banner>): Promise<Banner> {
    return this.appService.addBanner(newBanner);
  }

  @Post('admin/banners/bulk')
  @UseGuards(AdminSessionGuard)
  async bulkImportBanners(@Body() payload: Partial<Banner>[]): Promise<{ successCount: number; errors: string[] }> {
    return this.appService.bulkImportBanners(payload);
  }


  @Put('admin/banners/:id')
  @UseGuards(AdminSessionGuard)
  async updateBanner(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Banner>
  ): Promise<Banner> {
    return this.appService.updateBanner(id, updatedFields);
  }

  @Delete('admin/banners/:id')
  @UseGuards(AdminSessionGuard)
  async deleteBanner(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.appService.deleteBanner(id);
  }

  @Get('admin/stats/dashboard')
  @UseGuards(AdminSessionGuard)
  async getDashboardStats() {
    return this.appService.getDashboardStats();
  }

  @Get('admin/votes')
  @UseGuards(AdminSessionGuard)
  async getVoteLogs() {
    return this.appService.getAdminVoteLogs();
  }

  @Delete('admin/votes/:id')
  @UseGuards(AdminSessionGuard)
  async deleteVoteLog(@Param('id') id: string) {
    return this.appService.deleteVoteLog(id);
  }

  // --- SYSTEM SETTINGS ---
  @Get('settings')
  getSettings(): Partial<SystemSettings> {
    return this.appService.getPublicSettings();
  }

  @Get('admin/settings')
  @UseGuards(AdminSessionGuard)
  getAdminSettings(): SystemSettings {
    return this.appService.getSettings();
  }

  @Put('admin/settings')
  @UseGuards(AdminSessionGuard)
  updateSettings(@Body() updatedFields: Partial<SystemSettings>): SystemSettings {
    return this.appService.updateSettings(updatedFields);
  }

  @Post('admin/settings/reset-votes')
  @UseGuards(AdminSessionGuard)
  async resetVotes(): Promise<{ success: boolean }> {
    return this.appService.resetVotes();
  }

  // --- NEWS & ANNOUNCEMENTS (POSTS) ---
  @Get('posts')
  async getPublicPosts(
    @Query('category') category?: string,
    @Query('search') search?: string
  ) {
    return this.appService.getPublicPosts(category, search);
  }

  @Get('posts/:slugOrId')
  async getPublicPost(@Param('slugOrId') slugOrId: string) {
    const post = await this.appService.getPostBySlugOrId(slugOrId);
    if (!post) {
      throw new UnauthorizedException('Không tìm thấy bài viết hoặc bài viết đã bị ẩn.');
    }
    return post;
  }

  @Get('admin/posts')
  @UseGuards(AdminSessionGuard)
  async getAdminPosts() {
    return this.appService.getAdminPosts();
  }

  @Post('admin/posts')
  @UseGuards(AdminSessionGuard)
  async createPost(@Body() data: any) {
    return this.appService.createPost(data);
  }

  @Put('admin/posts/:id')
  @UseGuards(AdminSessionGuard)
  async updatePost(@Param('id') id: string, @Body() data: any) {
    return this.appService.updatePost(id, data);
  }

  @Delete('admin/posts/:id')
  @UseGuards(AdminSessionGuard)
  async deletePost(@Param('id') id: string) {
    await this.appService.deletePost(id);
    return { success: true };
  }
}
// Trigger settings reload

