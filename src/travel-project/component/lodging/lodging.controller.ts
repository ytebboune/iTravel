import {
  Controller, Post, Get, Patch, Delete, Param, Body, Request, UseGuards, Query
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LodgingService } from './lodging.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { AddVoteDto } from './dto/add-vote-lodging.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { FilterAccommodationDto } from './dto/filter-accomodation.dto';
import AddCommentLodgingDto from './dto/add-comment-lodging.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';

@UseGuards(AuthGuard)
@Controller('projects/:projectId/lodging')
export class LodgingController {
  constructor(private readonly service: LodgingService) { }

  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateAccommodationDto, @Request() req) {
    return this.service.create(projectId, dto, req.user.sub);
  }

  @Get()
  findAll(@Param('projectId') projectId: string, @Request() req) {
    return this.service.findAll(projectId, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccommodationDto, @Request() req) {
    return this.service.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.sub);
  }

  @Get(':id/photos')
  getPhotos(@Param('id') id: string, @Request() req) {
    return this.service.getPhotos(id, req.user.sub);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: AddCommentLodgingDto, @Request() req) {
    return this.service.addComment(id, dto, req.user.sub);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string, @Request() req) {
    return this.service.getComments(id, req.user.sub);
  }

  @Post(':id/availability')
  addAvailability(@Param('id') id: string, @Body() dto: CreateAvailabilityDto, @Request() req) {
    return this.service.addAvailability(id, dto, req.user.sub);
  }

  @Get('filter')
  filter(@Query() query: FilterAccommodationDto, @Param('projectId') projectId: string, @Request() req) {
    return this.service.filter(projectId, query, req.user.sub);
  }

  @Post('vote')
  vote(@Body() dto: AddVoteDto, @Request() req) {
    return this.service.vote(req.user.sub, dto);
  }

  @Delete('vote/:accommodationId')
  deleteVote(@Param('projectId') projectId: string, @Param('accommodationId') accommodationId: string, @Request() req) {
    return this.service.deleteVote(projectId, accommodationId, req.user.sub);
  }

  @Get('votes')
  getVotes(@Param('projectId') projectId: string, @Request() req) {
    return this.service.getVotes(projectId, req.user.sub);
  }

  @Get(':accommodationId/voters')
  getVoters(@Param('accommodationId') accommodationId: string, @Request() req) {
    return this.service.getVoters(accommodationId, req.user.sub);
  }
}
