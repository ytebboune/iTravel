import {
  Controller, Post, Get, Patch, Delete, Param, Body, Request, UseGuards, Query
} from '@nestjs/common';
import { AuthGuard } from '../../../auth/auth.guard';
import { LodgingService } from './lodging.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { AddVoteDto } from './dto/add-vote-lodging.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { FilterAccommodationDto } from './dto/filter-accomodation.dto';
import AddCommentLodgingDto from './dto/add-comment-lodging.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { Request as ExpressRequest } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('lodging')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects/:projectId/lodging')
export class LodgingController {
  constructor(private readonly service: LodgingService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new lodging' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiBody({ type: CreateAccommodationDto })
  @ApiResponse({ status: 201, description: 'Lodging created successfully' })
  create(@Param('projectId') projectId: string, @Body() dto: CreateAccommodationDto, @Request() req) {
    return this.service.create(projectId, dto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lodgings for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'List of lodgings' })
  findAll(@Param('projectId') projectId: string, @Request() req) {
    return this.service.findAll(projectId, req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lodging by ID' })
  @ApiParam({ name: 'id', description: 'ID of the lodging' })
  @ApiResponse({ status: 200, description: 'Lodging details' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lodging' })
  @ApiParam({ name: 'id', description: 'ID of the lodging' })
  @ApiBody({ type: UpdateAccommodationDto })
  @ApiResponse({ status: 200, description: 'Lodging updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateAccommodationDto, @Request() req) {
    return this.service.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lodging' })
  @ApiParam({ name: 'id', description: 'ID of the lodging' })
  @ApiResponse({ status: 200, description: 'Lodging deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.sub);
  }

  @Get(':id/photos')
  @ApiOperation({ summary: 'Get photos of a lodging' })
  @ApiParam({ name: 'id', description: 'ID of the lodging' })
  @ApiResponse({ status: 200, description: 'List of photos' })
  getPhotos(@Param('id') id: string, @Request() req) {
    return this.service.getPhotos(id, req.user.sub);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a lodging' })
  @ApiParam({ name: 'id', description: 'ID of the lodging' })
  @ApiBody({ type: AddCommentLodgingDto })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  addComment(@Param('id') id: string, @Body() dto: AddCommentLodgingDto, @Request() req) {
    return this.service.addComment(id, dto, req.user.sub);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments of a lodging' })
  @ApiParam({ name: 'id', description: 'ID of the lodging' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  getComments(@Param('id') id: string, @Request() req) {
    return this.service.getComments(id, req.user.sub);
  }

  @Post(':id/availability')
  @ApiOperation({ summary: 'Add availability to a lodging' })
  @ApiParam({ name: 'id', description: 'ID of the lodging' })
  @ApiBody({ type: CreateAvailabilityDto })
  @ApiResponse({ status: 201, description: 'Availability added successfully' })
  addAvailability(@Param('id') id: string, @Body() dto: CreateAvailabilityDto, @Request() req) {
    return this.service.addAvailability(id, dto, req.user.sub);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter lodgings' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiQuery({ type: FilterAccommodationDto })
  @ApiResponse({ status: 200, description: 'Filtered list of lodgings' })
  filter(@Query() query: FilterAccommodationDto, @Param('projectId') projectId: string, @Request() req) {
    return this.service.filter(projectId, query, req.user.sub);
  }

  @Post('vote')
  @ApiOperation({ summary: 'Vote for a lodging' })
  @ApiBody({ type: AddVoteDto })
  @ApiResponse({ status: 201, description: 'Vote added successfully' })
  vote(@Body() dto: AddVoteDto, @Request() req) {
    return this.service.vote(req.user.sub, dto);
  }

  @Delete('vote/:accommodationId')
  @ApiOperation({ summary: 'Delete a vote for a lodging' })
  @ApiParam({ name: 'accommodationId', description: 'ID of the lodging' })
  @ApiResponse({ status: 200, description: 'Vote deleted successfully' })
  deleteVote(@Param('projectId') projectId: string, @Param('accommodationId') accommodationId: string, @Request() req) {
    return this.service.deleteVote(projectId, accommodationId, req.user.sub);
  }

  @Get('votes')
  @ApiOperation({ summary: 'Get votes for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'List of votes' })
  getVotes(@Param('projectId') projectId: string, @Request() req) {
    return this.service.getVotes(projectId, req.user.sub);
  }

  @Get(':accommodationId/voters')
  @ApiOperation({ summary: 'Get voters for a lodging' })
  @ApiParam({ name: 'accommodationId', description: 'ID of the lodging' })
  @ApiResponse({ status: 200, description: 'List of voters' })
  getVoters(@Param('accommodationId') accommodationId: string, @Request() req) {
    return this.service.getVoters(accommodationId, req.user.sub);
  }
}
