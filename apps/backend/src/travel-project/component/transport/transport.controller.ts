import {
    Controller, Post, Get, Patch, Delete, Param, Body, Request, UseGuards, Query
  } from '@nestjs/common';
  import { AuthGuard } from '../../../auth/auth.guard';
import { TransportService } from "./transport.service";
import { AddTransportCommentDto } from "./dto/add-transport-comment.dto";
import { CreateTransportOptionDto } from "./dto/create-transport-option.dto";
import { TransportVoteDto } from "./dto/transport-vote.dto";
import { SortTransportDto } from './dto/sort-transport.dto';

@Controller('projects/:projectId/transport')
@UseGuards(AuthGuard)
export class TransportController {
  constructor(private readonly service: TransportService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTransportOptionDto,
    @Request() req,
  ) {
    return this.service.create(projectId, dto, req.user.sub);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @Request() req,
    @Query() sortDto?: SortTransportDto
  ) {
    return this.service.findAll(projectId, req.user.sub, sortDto);
  }

  @Post('vote')
  vote(@Body() dto: TransportVoteDto, @Request() req) {
    return this.service.vote(req.user.sub, dto);
  }

  @Delete(':id/vote')
  deleteVote(
    @Param('id') transportId: string,
    @Request() req,
  ) {
    return this.service.deleteVote(req.user.sub, transportId);
  }

  @Get(':id/voters')
  getVoters(
    @Param('id') transportId: string,
    @Request() req,
  ) {
    return this.service.getVoters(transportId, req.user.sub);
  }

  @Post('comment')
  comment(@Body() dto: AddTransportCommentDto, @Request() req) {
    return this.service.addComment(req.user.sub, dto);
  }

  @Post(':id/select')
  select(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.service.selectOption(projectId, id, req.user.sub);
  }

  @Post(':id/validate')
  @UseGuards(AuthGuard)
  async validateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.service.validateOption(projectId, id, req.user.sub);
  }

  @Post(':id/unvalidate')
  @UseGuards(AuthGuard)
  async unvalidateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.service.unvalidateOption(projectId, id, req.user.id);
  }

  @Get('validated')
  @UseGuards(AuthGuard)
  async getValidatedOption(
    @Param('projectId') projectId: string,
  ) {
    return this.service.getValidatedOption(projectId);
  }
}