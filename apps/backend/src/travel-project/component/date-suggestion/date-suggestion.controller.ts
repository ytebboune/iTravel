import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DateSuggestionService } from './date-suggestion.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { VoteDto } from '../destination/dto/vote.dto';

@Controller('projects/:projectId/dates')
@UseGuards(AuthGuard)
export class DateSuggestionController {
  constructor(private readonly service: DateSuggestionService) {}

  @Post()
  createDateSuggestion(
    @Param('projectId') projectId: string,
    @Body() data: { startDate: Date; endDate: Date },
    @Request() req,
  ) {
    return this.service.createDateSuggestion(projectId, req.user.sub, data);
  }

  @Get()
  getDateSuggestions(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getDateSuggestions(projectId, req.user.sub);
  }

  @Post(':id/vote')
  vote(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Body() dto: VoteDto,
    @Request() req,
  ) {
    return this.service.vote(projectId, dateId, req.user.sub, dto.vote, dto.comment);
  }

  @Get(':id/votes')
  getVotes(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Request() req,
  ) {
    return this.service.getVoters(dateId, req.user.sub);
  }

  @Post(':id/validate')
  validate(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Request() req,
  ) {
    return this.service.validateOption(projectId, dateId, req.user.sub);
  }

  @Post(':id/unvalidate')
  unvalidate(
    @Param('projectId') projectId: string,
    @Param('id') dateId: string,
    @Request() req,
  ) {
    return this.service.unvalidateOption(projectId, dateId, req.user.sub);
  }

  @Get('validated')
  getValidatedDate(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.service.getValidatedOption(projectId);
  }
} 