import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { AddCommentDto } from './dto/add-comment.dto';
import { VoteDto } from './dto/vote.dto';

@Controller('projects/:projectId/destinations')
@UseGuards(AuthGuard)
export class DestinationController {
  constructor(private readonly service: DestinationService) {}

  @Post(':id/comments')
  addComment(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Body() dto: AddCommentDto,
    @Request() req,
  ) {
    return this.service.addComment(projectId, destinationId, req.user.sub, dto.content);
  }

  @Get(':id/comments')
  getComments(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.getComments(projectId, destinationId, req.user.sub);
  }

  @Post(':id/vote')
  vote(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Body() dto: VoteDto,
    @Request() req,
  ) {
    return this.service.vote(projectId, destinationId, req.user.sub, dto.vote, dto.comment);
  }

  @Get(':id/votes')
  getVotes(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.getVoters(destinationId, req.user.sub);
  }

  @Post(':id/validate')
  validate(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.validateOption(projectId, destinationId, req.user.sub);
  }

  @Post(':id/unvalidate')
  unvalidate(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.unvalidateOption(projectId, destinationId, req.user.sub);
  }
} 