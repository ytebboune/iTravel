import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { AddCommentDto } from './dto/add-comment.dto';
import { VoteDto } from './dto/vote.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('destinations')
@ApiBearerAuth()
@Controller('projects/:projectId/destinations')
@UseGuards(AuthGuard)
export class DestinationController {
  constructor(private readonly service: DestinationService) {}

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a destination' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the destination' })
  @ApiBody({ type: AddCommentDto })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  addComment(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Body() dto: AddCommentDto,
    @Request() req,
  ) {
    return this.service.addComment(projectId, destinationId, req.user.sub, dto.content);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a destination' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the destination' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  getComments(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.getComments(projectId, destinationId, req.user.sub);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Vote for a destination' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the destination' })
  @ApiBody({ type: VoteDto })
  @ApiResponse({ status: 201, description: 'Vote added successfully' })
  vote(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Body() dto: VoteDto,
    @Request() req,
  ) {
    return this.service.vote(projectId, destinationId, req.user.sub, dto.vote, dto.comment);
  }

  @Get(':id/votes')
  @ApiOperation({ summary: 'Get votes for a destination' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the destination' })
  @ApiResponse({ status: 200, description: 'List of votes' })
  getVotes(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.getVoters(destinationId, req.user.sub);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate a destination' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the destination' })
  @ApiResponse({ status: 200, description: 'Destination validated successfully' })
  validate(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.validateOption(projectId, destinationId, req.user.sub);
  }

  @Post(':id/unvalidate')
  @ApiOperation({ summary: 'Unvalidate a destination' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the destination' })
  @ApiResponse({ status: 200, description: 'Destination unvalidated successfully' })
  unvalidate(
    @Param('projectId') projectId: string,
    @Param('id') destinationId: string,
    @Request() req,
  ) {
    return this.service.unvalidateOption(projectId, destinationId, req.user.sub);
  }
} 