import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@GetUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(userId, updateUserDto);
  }

  @Post(':id/follow')
  async followUser(
    @GetUser('id') followerId: string,
    @Param('id') followingId: string,
  ) {
    return this.userService.followUser(followerId, followingId);
  }

  @Delete(':id/follow')
  async unfollowUser(
    @GetUser('id') followerId: string,
    @Param('id') followingId: string,
  ) {
    return this.userService.unfollowUser(followerId, followingId);
  }

  @Get(':id/followers')
  async getFollowers(@Param('id') userId: string) {
    return this.userService.getFollowers(userId);
  }

  @Get(':id/following')
  async getFollowing(@Param('id') userId: string) {
    return this.userService.getFollowing(userId);
  }

  @Get('feed')
  async getFeed(
    @GetUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userService.getFeed(userId, page, limit);
  }
} 