import { Controller, Post, Get, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { VoteDto } from '../destination/dto/vote.dto';

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

  @Post(':id/vote')
  vote(
    @Param('projectId') projectId: string,
    @Param('id') activityId: string,
    @Body() dto: VoteDto,
    @Request() req,
  ) {
    return this.service.vote(projectId, activityId, req.user.sub, dto.vote, dto.comment);
  }

  @Delete(':id/vote')
  deleteVote(
    @Param('projectId') projectId: string,
    @Param('id') activityId: string,
    @Request() req,
  ) {
    return this.service.deleteVote(projectId, activityId, req.user.sub);
  }

  @Get(':id/voters')
  getVoters(
    @Param('projectId') projectId: string,
    @Param('id') activityId: string,
    @Request() req,
  ) {
    return this.service.getVoters(activityId, req.user.sub);
  }

  @Get('votes')
  getVotes(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getVotes(projectId, req.user.sub);
  }
} 