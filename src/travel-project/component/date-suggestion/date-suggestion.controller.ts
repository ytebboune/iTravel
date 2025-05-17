import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DateSuggestionService } from './date-suggestion.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { VoteDto } from '../destination/dto/vote.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('date-suggestions')
@ApiBearerAuth()
@Controller('projects/:projectId/dates')
@UseGuards(AuthGuard)
export class DateSuggestionController {
  constructor(private readonly service: DateSuggestionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new date suggestion' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Date suggestion created successfully' })
  createDateSuggestion(
    @Param('projectId') projectId: string,
    @Body() data: { startDate: Date; endDate: Date },
    @Request() req,
  ) {
    return this.service.createDateSuggestion(projectId, req.user.sub, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all date suggestions for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'List of date suggestions' })
  getDateSuggestions(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getDateSuggestions(projectId, req.user.sub);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Vote for a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the date suggestion' })
  @ApiBody({ type: VoteDto })
  @ApiResponse({ status: 201, description: 'Vote added successfully' })
  vote(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Body() dto: VoteDto,
    @Request() req,
  ) {
    return this.service.vote(projectId, dateId, req.user.sub, dto.vote, dto.comment);
  }

  @Get(':id/votes')
  @ApiOperation({ summary: 'Get votes for a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the date suggestion' })
  @ApiResponse({ status: 200, description: 'List of votes' })
  getVotes(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Request() req,
  ) {
    return this.service.getVoters(dateId, req.user.sub);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the date suggestion' })
  @ApiResponse({ status: 200, description: 'Date suggestion validated successfully' })
  validate(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Request() req,
  ) {
    return this.service.validateOption(projectId, dateId, req.user.sub);
  }

  @Post(':id/unvalidate')
  @ApiOperation({ summary: 'Unvalidate a date suggestion' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the date suggestion' })
  @ApiResponse({ status: 200, description: 'Date suggestion unvalidated successfully' })
  unvalidate(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Request() req,
  ) {
    return this.service.unvalidateOption(projectId, dateId, req.user.sub);
  }

  @Get('validated')
  @ApiOperation({ summary: 'Get validated date suggestion' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'Returns the validated date suggestion' })
  getValidatedDate(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getValidatedOption(projectId);
  }
} 