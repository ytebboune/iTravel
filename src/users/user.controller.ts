import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile' })
  getProfile(@GetUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(userId, updateUserDto);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to follow' })
  @ApiResponse({ status: 200, description: 'User followed successfully' })
  async followUser(
    @GetUser('id') followerId: string,
    @Param('id') followingId: string,
  ) {
    return this.userService.followUser(followerId, followingId);
  }

  @Delete(':id/follow')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to unfollow' })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully' })
  async unfollowUser(
    @GetUser('id') followerId: string,
    @Param('id') followingId: string,
  ) {
    return this.userService.unfollowUser(followerId, followingId);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'List of followers' })
  async getFollowers(@Param('id') userId: string) {
    return this.userService.getFollowers(userId);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get users followed by a user' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'List of following users' })
  async getFollowing(@Param('id') userId: string) {
    return this.userService.getFollowing(userId);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get user feed' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User feed' })
  async getFeed(
    @GetUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userService.getFeed(userId, page, limit);
  }
} 