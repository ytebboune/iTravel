import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DateSuggestionService } from './date-suggestion.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateDateSuggestionDto } from './dto/create-date-suggestion.dto';
import { VoteDto } from '../destination/dto/vote.dto';
import { AuthGuard } from 'src/core/auth/auth.guard';

@ApiTags('date-suggestion')
@Controller('projects/:projectId/date-suggestions')
@UseGuards(AuthGuard)
export class DateSuggestionController {
  constructor(private readonly service: DateSuggestionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new date suggestion' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiBody({ type: CreateDateSuggestionDto })
  @ApiResponse({ status: 201, description: 'Date suggestion created successfully' })
  createDateSuggestion(
    @Param('projectId') projectId: string,
    @Body() dto: CreateDateSuggestionDto,
    @Request() req,
  ) {
    return this.service.createDateSuggestion(projectId, req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all date suggestions' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'List of date suggestions' })
  getDateSuggestions(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getDateSuggestions(projectId, req.user.sub);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Vote on a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Date suggestion ID' })
  @ApiBody({ type: VoteDto })
  @ApiResponse({ status: 201, description: 'Vote recorded successfully' })
  vote(
    @Param('projectId') projectId: string,
    @Param('id') dateSuggestionId: string,
    @Body() dto: VoteDto,
    @Request() req,
  ) {
    return this.service.vote(projectId, dateSuggestionId, req.user.sub, dto.vote, dto.comment);
  }

  @Get(':id/voters')
  @ApiOperation({ summary: 'Get all voters for a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Date suggestion ID' })
  @ApiResponse({ status: 200, description: 'List of voters' })
  getVoters(
    @Param('projectId') projectId: string,
    @Param('id') dateSuggestionId: string,
    @Request() req,
  ) {
    return this.service.getVoters(dateSuggestionId, req.user.sub);
  }

  @Get('votes')
  @ApiOperation({ summary: 'Get all votes for date suggestions' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'List of votes' })
  getVotes(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getVotes(projectId, req.user.sub);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Date suggestion ID' })
  @ApiResponse({ status: 200, description: 'Date suggestion validated successfully' })
  validate(
    @Param('projectId') projectId: string,
    @Param('id') dateSuggestionId: string,
    @Request() req,
  ) {
    return this.service.validateOption(projectId, dateSuggestionId, req.user.sub);
  }

  @Post(':id/unvalidate')
  @ApiOperation({ summary: 'Unvalidate a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Date suggestion ID' })
  @ApiResponse({ status: 200, description: 'Date suggestion unvalidated successfully' })
  unvalidate(
    @Param('projectId') projectId: string,
    @Param('id') dateSuggestionId: string,
    @Request() req,
  ) {
    return this.service.unvalidateOption(projectId, dateSuggestionId, req.user.sub);
  }
} 