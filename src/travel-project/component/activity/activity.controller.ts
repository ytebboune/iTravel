import { Controller, Post, Get, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { VoteDto } from '../destination/dto/vote.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('activities')
@ApiBearerAuth()
@Controller('projects/:projectId/activities')
@UseGuards(AuthGuard)
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        imageUrl: { type: 'string', nullable: true },
        suggestedByAI: { type: 'boolean', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
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
  @ApiOperation({ summary: 'Get all activities for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'List of activities' })
  getActivities(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getActivities(projectId, req.user.sub);
  }

  @Get('predefined')
  @ApiOperation({ summary: 'Get predefined activities' })
  @ApiParam({ name: 'category', required: false, description: 'Category of activities' })
  @ApiResponse({ status: 200, description: 'List of predefined activities' })
  getPredefinedActivities(
    @Param('category') category?: string,
  ) {
    return this.service.getPredefinedActivities(category);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Vote for an activity' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the activity' })
  @ApiBody({ type: VoteDto })
  @ApiResponse({ status: 201, description: 'Vote added successfully' })
  vote(
    @Param('projectId') projectId: string,
    @Param('id') activityId: string,
    @Body() dto: VoteDto,
    @Request() req,
  ) {
    return this.service.vote(projectId, activityId, req.user.sub, dto.vote, dto.comment);
  }

  @Delete(':id/vote')
  @ApiOperation({ summary: 'Delete a vote for an activity' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the activity' })
  @ApiResponse({ status: 200, description: 'Vote deleted successfully' })
  deleteVote(
    @Param('projectId') projectId: string,
    @Param('id') activityId: string,
    @Request() req,
  ) {
    return this.service.deleteVote(projectId, activityId, req.user.sub);
  }

  @Get(':id/voters')
  @ApiOperation({ summary: 'Get voters for an activity' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the activity' })
  @ApiResponse({ status: 200, description: 'List of voters' })
  getVoters(
    @Param('projectId') projectId: string,
    @Param('id') activityId: string,
    @Request() req,
  ) {
    return this.service.getVoters(activityId, req.user.sub);
  }

  @Get('votes')
  @ApiOperation({ summary: 'Get votes for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'List of votes' })
  getVotes(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getVotes(projectId, req.user.sub);
  }
} 