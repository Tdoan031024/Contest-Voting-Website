import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService, SystemSettings } from './app.service';
import { Candidate, Sponsor, TimelineEvent, Banner } from '@huitfest/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    @Body('phone') phone: string
  ): Promise<Candidate> {
    return this.appService.voteCandidate(sbd, phone || '0123456789');
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
