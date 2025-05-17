import {
    Controller, Post, Get, Patch, Delete, Param, Body, Request, UseGuards, Query
  } from '@nestjs/common';
  import { AuthGuard } from "src/auth/auth.guard";
import { TransportService } from "./transport.service";
import { AddTransportCommentDto } from "./dto/add-transport-comment.dto";
import { CreateTransportOptionDto } from "./dto/create-transport-option.dto";
import { TransportVoteDto } from "./dto/transport-vote.dto";
import { SortTransportDto } from './dto/sort-transport.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('transport')
@ApiBearerAuth()
@Controller('projects/:projectId/transport')
@UseGuards(AuthGuard)
export class TransportController {
  constructor(private readonly service: TransportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transport option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiBody({ type: CreateTransportOptionDto })
  @ApiResponse({ status: 201, description: 'Transport option created successfully' })
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTransportOptionDto,
    @Request() req,
  ) {
    return this.service.create(projectId, dto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transport options for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiQuery({ type: SortTransportDto })
  @ApiResponse({ status: 200, description: 'List of transport options' })
  findAll(
    @Param('projectId') projectId: string,
    @Request() req,
    @Query() sortDto?: SortTransportDto
  ) {
    return this.service.findAll(projectId, req.user.sub, sortDto);
  }

  @Post('vote')
  @ApiOperation({ summary: 'Vote for a transport option' })
  @ApiBody({ type: TransportVoteDto })
  @ApiResponse({ status: 201, description: 'Vote added successfully' })
  vote(@Body() dto: TransportVoteDto, @Request() req) {
    return this.service.vote(req.user.sub, dto);
  }

  @Delete(':id/vote')
  @ApiOperation({ summary: 'Delete a vote for a transport option' })
  @ApiParam({ name: 'id', description: 'ID of the transport option' })
  @ApiResponse({ status: 200, description: 'Vote deleted successfully' })
  deleteVote(
    @Param('id') transportId: string,
    @Request() req,
  ) {
    return this.service.deleteVote(req.user.sub, transportId);
  }

  @Get(':id/voters')
  @ApiOperation({ summary: 'Get voters for a transport option' })
  @ApiParam({ name: 'id', description: 'ID of the transport option' })
  @ApiResponse({ status: 200, description: 'List of voters' })
  getVoters(
    @Param('id') transportId: string,
    @Request() req,
  ) {
    return this.service.getVoters(transportId, req.user.sub);
  }

  @Post('comment')
  @ApiOperation({ summary: 'Add a comment to a transport option' })
  @ApiBody({ type: AddTransportCommentDto })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  comment(@Body() dto: AddTransportCommentDto, @Request() req) {
    return this.service.addComment(req.user.sub, dto);
  }

  @Post(':id/select')
  @ApiOperation({ summary: 'Select a transport option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the transport option' })
  @ApiResponse({ status: 200, description: 'Transport option selected successfully' })
  select(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.service.selectOption(projectId, id, req.user.sub);
  }

  @Post(':id/validate')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Validate a transport option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the transport option' })
  @ApiResponse({ status: 200, description: 'Transport option validated successfully' })
  async validateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.service.validateOption(projectId, id, req.user.sub);
  }

  @Post(':id/unvalidate')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Unvalidate a transport option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the transport option' })
  @ApiResponse({ status: 200, description: 'Transport option unvalidated successfully' })
  async unvalidateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.service.unvalidateOption(projectId, id, req.user.id);
  }

  @Get('validated')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get validated transport option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'Returns the validated transport option' })
  async getValidatedOption(
    @Param('projectId') projectId: string,
  ) {
    return this.service.getValidatedOption(projectId);
  }
}