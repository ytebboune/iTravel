import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('stories')
@UseGuards(AuthGuard)
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  async createStory(
    @Req() req,
    @Body() createStoryDto: CreateStoryDto,
  ) {
    return this.storyService.createStory(req.user.id, createStoryDto);
  }

  @Delete(':id')
  async deleteStory(
    @Req() req,
    @Param('id') storyId: string,
  ) {
    return this.storyService.deleteStory(req.user.id, storyId);
  }

  @Get()
  async getStories(@Req() req) {
    return this.storyService.getStories(req.user.id);
  }

  @Get('my-stories')
  async getUserStories(@Req() req) {
    return this.storyService.getUserStories(req.user.id);
  }

  @Post(':id/view')
  async markStoryAsViewed(
    @Req() req,
    @Param('id') storyId: string,
  ) {
    return this.storyService.markStoryAsViewed(req.user.id, storyId);
  }

  @Get(':id/views')
  async getStoryViews(@Param('id') storyId: string) {
    return this.storyService.getStoryViews(storyId);
  }
} 