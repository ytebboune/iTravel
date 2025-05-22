import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../core/auth/auth.guard';
import { GetUser } from '../core/auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { GetProfileDto } from './dto/get-profile.dto';
import { FollowRequestDto } from './dto/follow-request.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer son propre profil' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur', type: GetProfileDto })
  async getProfile(@GetUser('sub') userId: string) {
    return this.userService.getProfile(userId, userId);
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

  @Get('profile/:id')
  @ApiOperation({ summary: 'Récupérer le profil d\'un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur', type: GetProfileDto })
  @ApiResponse({ status: 403, description: 'Accès non autorisé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getProfileById(
    @GetUser('id') userId: string,
    @Param('id') targetUserId: string,
  ): Promise<GetProfileDto> {
    return this.userService.getProfile(userId, targetUserId);
  }

  @Get('public-profile/:id')
  @ApiOperation({ summary: 'Récupérer le profil public d\'un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil public utilisateur', type: GetProfileDto })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getPublicProfile(
    @Param('id') targetUserId: string,
  ): Promise<GetProfileDto> {
    return this.userService.getPublicProfile(targetUserId);
  }

  @Post(':id/request-follow')
  @ApiOperation({ summary: 'Envoyer une demande de follow' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur à suivre' })
  @ApiResponse({ status: 201, description: 'Demande de follow envoyée', type: FollowRequestDto })
  @ApiResponse({ status: 400, description: 'Demande déjà existante ou utilisateur déjà suivi' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async requestFollow(
    @GetUser('id') requesterId: string,
    @Param('id') targetId: string,
  ): Promise<FollowRequestDto> {
    return this.userService.requestFollow(requesterId, targetId);
  }

  @Post('follow-requests/:requestId/accept')
  @ApiOperation({ summary: 'Accepter une demande de follow' })
  @ApiParam({ name: 'requestId', description: 'ID de la demande de follow' })
  @ApiResponse({ status: 200, description: 'Demande acceptée' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé' })
  @ApiResponse({ status: 404, description: 'Demande non trouvée' })
  async acceptFollowRequest(
    @GetUser('id') userId: string,
    @Param('requestId') requestId: string,
  ): Promise<void> {
    return this.userService.acceptFollowRequest(userId, requestId);
  }

  @Post('follow-requests/:requestId/reject')
  @ApiOperation({ summary: 'Rejeter une demande de follow' })
  @ApiParam({ name: 'requestId', description: 'ID de la demande de follow' })
  @ApiResponse({ status: 200, description: 'Demande rejetée' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé' })
  @ApiResponse({ status: 404, description: 'Demande non trouvée' })
  async rejectFollowRequest(
    @GetUser('id') userId: string,
    @Param('requestId') requestId: string,
  ): Promise<void> {
    return this.userService.rejectFollowRequest(userId, requestId);
  }

  @Get('follow-requests/pending')
  @ApiOperation({ summary: 'Récupérer les demandes de follow en attente' })
  @ApiResponse({ status: 200, description: 'Liste des demandes en attente', type: [FollowRequestDto] })
  async getPendingFollowRequests(
    @GetUser('id') userId: string,
  ): Promise<FollowRequestDto[]> {
    return this.userService.getPendingFollowRequests(userId);
  }

  @Get('follow-requests/sent')
  @ApiOperation({ summary: 'Récupérer les demandes de follow envoyées' })
  @ApiResponse({ status: 200, description: 'Liste des demandes envoyées', type: [FollowRequestDto] })
  async getSentFollowRequests(
    @GetUser('id') userId: string,
  ): Promise<FollowRequestDto[]> {
    return this.userService.getSentFollowRequests(userId);
  }
} 