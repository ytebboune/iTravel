import { Controller, Post, Param, Request, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccommodationService } from './accommodation.service';

@Controller('projects/:projectId/accommodation')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @Post(':id/validate')
  @UseGuards(AuthGuard)
  async validateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.accommodationService.validateOption(projectId, id, req.user.id);
  }

  @Post(':id/unvalidate')
  @UseGuards(AuthGuard)
  async unvalidateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.accommodationService.unvalidateOption(projectId, id, req.user.id);
  }

  @Get('validated')
  @UseGuards(AuthGuard)
  async getValidatedOption(
    @Param('projectId') projectId: string,
  ) {
    return this.accommodationService.getValidatedOption(projectId);
  }
} 