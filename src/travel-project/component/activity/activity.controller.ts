import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('projects/:projectId/activities')
@UseGuards(AuthGuard)
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Post()
  createActivity(
    @Param('projectId') projectId: string,
    @Body() data: {
      title: string;
      description: string;
      imageUrl?: string;
      suggestedByAI?: boolean;
    },
    @Request() req,
  ) {
    return this.service.createActivity(projectId, req.user.sub, data);
  }

  @Get()
  getActivities(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getActivities(projectId, req.user.sub);
  }

  @Get('predefined')
  getPredefinedActivities(
    @Param('category') category?: string,
  ) {
    return this.service.getPredefinedActivities(category);
  }
} 