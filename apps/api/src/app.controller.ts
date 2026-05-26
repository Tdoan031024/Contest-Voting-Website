import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Candidate, Sponsor, TimelineEvent, Banner } from '@huitfest/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

  @Get('sponsors')
  getSponsors(): Sponsor[] {
    return this.appService.getSponsors();
  }

  @Get('timeline')
  getTimeline(): TimelineEvent[] {
    return this.appService.getTimeline();
  }

  @Get('banners')
  getBanners(): Banner[] {
    return this.appService.getBanners();
  }

  // Admin routes for candidates management
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
}
