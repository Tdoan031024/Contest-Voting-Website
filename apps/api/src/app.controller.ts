import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService, SystemSettings } from './app.service';
import { Candidate, Sponsor, TimelineEvent, Banner } from '@huitfest/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // --- CANDIDATES ---
  @Get('candidates')
  getCandidates(): Candidate[] {
    return this.appService.getCandidates();
  }

  @Get('candidates/:sbd')
  getCandidateBySbd(@Param('sbd') sbd: string): Candidate {
    return this.appService.getCandidateBySbd(sbd);
  }

  @Post('candidates/:sbd/vote')
  voteCandidate(
    @Param('sbd') sbd: string,
    @Body('phone') phone: string
  ): Candidate {
    return this.appService.voteCandidate(sbd, phone || '0123456789');
  }

  @Post('admin/candidates')
  addCandidate(@Body() newCandidate: Partial<Candidate>): Candidate {
    return this.appService.addCandidate(newCandidate);
  }

  @Put('admin/candidates/:id')
  updateCandidate(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Candidate>
  ): Candidate {
    return this.appService.updateCandidate(id, updatedFields);
  }

  @Delete('admin/candidates/:id')
  deleteCandidate(@Param('id') id: string): { success: boolean } {
    return this.appService.deleteCandidate(id);
  }

  // --- SPONSORS ---
  @Get('sponsors')
  getSponsors(): Sponsor[] {
    return this.appService.getSponsors();
  }

  @Post('admin/sponsors')
  addSponsor(@Body() newSponsor: Partial<Sponsor>): Sponsor {
    return this.appService.addSponsor(newSponsor);
  }

  @Put('admin/sponsors/:id')
  updateSponsor(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Sponsor>
  ): Sponsor {
    return this.appService.updateSponsor(id, updatedFields);
  }

  @Delete('admin/sponsors/:id')
  deleteSponsor(@Param('id') id: string): { success: boolean } {
    return this.appService.deleteSponsor(id);
  }

  // --- TIMELINE ---
  @Get('timeline')
  getTimeline(): TimelineEvent[] {
    return this.appService.getTimeline();
  }

  @Post('admin/timeline')
  addTimelineEvent(@Body() newEvent: Partial<TimelineEvent>): TimelineEvent {
    return this.appService.addTimelineEvent(newEvent);
  }

  @Put('admin/timeline/:id')
  updateTimelineEvent(
    @Param('id') id: string,
    @Body() updatedFields: Partial<TimelineEvent>
  ): TimelineEvent {
    return this.appService.updateTimelineEvent(id, updatedFields);
  }

  @Delete('admin/timeline/:id')
  deleteTimelineEvent(@Param('id') id: string): { success: boolean } {
    return this.appService.deleteTimelineEvent(id);
  }

  // --- BANNERS ---
  @Get('banners')
  getBanners(): Banner[] {
    return this.appService.getBanners();
  }

  @Post('admin/banners')
  addBanner(@Body() newBanner: Partial<Banner>): Banner {
    return this.appService.addBanner(newBanner);
  }

  @Put('admin/banners/:id')
  updateBanner(
    @Param('id') id: string,
    @Body() updatedFields: Partial<Banner>
  ): Banner {
    return this.appService.updateBanner(id, updatedFields);
  }

  @Delete('admin/banners/:id')
  deleteBanner(@Param('id') id: string): { success: boolean } {
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
  resetVotes(): { success: boolean } {
    return this.appService.resetVotes();
  }
}
