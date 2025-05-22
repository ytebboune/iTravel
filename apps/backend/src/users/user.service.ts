import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetProfileDto } from './dto/get-profile.dto';
import { FollowRequestDto } from './dto/follow-request.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string, targetUserId: string): Promise<GetProfileDto> {
    // Log pour debug
    console.log('getProfile called with:', { userId, targetUserId });
    if (!targetUserId) {
      throw new BadRequestException('targetUserId requis');
    }
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followingId: true,
          },
        },
        visitedPlaces: {
          include: {
            country: true,
            city: true,
            photos: true,
          },
        },
        posts: {
          include: {
            photos: true,
            likes: true,
            comments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        stories: {
          where: {
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        },
        receivedFollowRequests: {
          where: {
            requesterId: userId,
            status: 'PENDING',
          },
        },
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Vérifier si l'utilisateur actuel suit la cible
    const isFollowing = targetUser.followers.some(f => f.followerId === userId);
    
    // Vérifier si une demande de follow est en attente
    const hasRequestedFollow = targetUser.receivedFollowRequests.length > 0;

    // Vérifier les permissions d'accès
    const canAccessPrivateInfo = 
      userId === targetUserId || // C'est son propre profil
      !targetUser.isPrivate || // Le profil n'est pas privé
      isFollowing; // L'utilisateur suit déjà la cible

    if (!canAccessPrivateInfo) {
      throw new ForbiddenException('This profile is private');
    }

    // Construire la réponse en fonction des paramètres de confidentialité
    const response: GetProfileDto = {
      id: targetUser.id,
      username: targetUser.username,
      bio: targetUser.bio,
      avatar: targetUser.avatar,
      isPrivate: targetUser.isPrivate,
      showEmail: targetUser.showEmail,
      showVisitedPlaces: targetUser.showVisitedPlaces,
      showPosts: targetUser.showPosts,
      showStories: targetUser.showStories,
      followersCount: targetUser.followers.length,
      followingCount: targetUser.following.length,
      isFollowing,
      hasRequestedFollow,
    };

    // Ajouter les informations sensibles si autorisé
    if (targetUser.showEmail && (userId === targetUserId || isFollowing)) {
      response.email = targetUser.email;
    }

    // Ajouter les lieux visités si autorisé
    if (targetUser.showVisitedPlaces && (userId === targetUserId || isFollowing)) {
      response.visitedPlaces = targetUser.visitedPlaces;
    }

    // Ajouter les posts si autorisé
    if (targetUser.showPosts && (userId === targetUserId || isFollowing)) {
      response.posts = targetUser.posts;
    }

    // Ajouter les stories si autorisé
    if (targetUser.showStories && (userId === targetUserId || isFollowing)) {
      response.stories = targetUser.stories;
    }

    return response;
  }

  async getPublicProfile(targetUserId: string): Promise<GetProfileDto> {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followingId: true,
          },
        },
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Pour un profil public, on ne renvoie que les informations de base
    return {
      id: targetUser.id,
      username: targetUser.username,
      bio: targetUser.bio,
      avatar: targetUser.avatar,
      isPrivate: targetUser.isPrivate,
      showEmail: targetUser.showEmail,
      showVisitedPlaces: targetUser.showVisitedPlaces,
      showPosts: targetUser.showPosts,
      showStories: targetUser.showStories,
      followersCount: targetUser.followers.length,
      followingCount: targetUser.following.length,
      isFollowing: false,
      hasRequestedFollow: false,
    };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: updateUserDto.username,
        bio: updateUserDto.bio,
        avatar: updateUserDto.avatar,
      },
    });

    return user;
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ForbiddenException('You cannot follow yourself');
    }

    const following = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!following) {
      throw new NotFoundException('User to follow not found');
    }

    const follow = await this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    return follow;
  }

  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return follow;
  }

  async getFollowers(userId: string) {
    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });

    return followers.map(follow => follow.follower);
  }

  async getFollowing(userId: string) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });

    return following.map(follow => follow.following);
  }

  async getFeed(userId: string, page = 1, limit = 10) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);

    const posts = await this.prisma.post.findMany({
      where: {
        userId: {
          in: [...followingIds, userId], // Include user's own posts
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        photos: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return posts;
  }

  async requestFollow(requesterId: string, targetId: string): Promise<FollowRequestDto> {
    if (requesterId === targetId) {
      throw new BadRequestException('You cannot request to follow yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Vérifier si une demande existe déjà
    const existingRequest = await this.prisma.followRequest.findFirst({
      where: {
        requesterId,
        requestedToId: targetId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Follow request already exists');
    }

    // Vérifier si l'utilisateur suit déjà
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: targetId,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('You are already following this user');
    }

    // Créer la demande de follow
    const followRequest = await this.prisma.followRequest.create({
      data: {
        requesterId,
        requestedToId: targetId,
        status: 'PENDING',
      },
      include: {
        requestedBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return {
      ...followRequest,
      requester: followRequest.requestedBy,
    };
  }

  async acceptFollowRequest(userId: string, requestId: string): Promise<void> {
    const request = await this.prisma.followRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    if (request.requestedToId !== userId) {
      throw new ForbiddenException('You can only accept follow requests sent to you');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('This request has already been processed');
    }

    // Mettre à jour le statut de la demande
    await this.prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    // Créer la relation de follow
    await this.prisma.follow.create({
      data: {
        followerId: request.requesterId,
        followingId: request.requestedToId,
      },
    });
  }

  async rejectFollowRequest(userId: string, requestId: string): Promise<void> {
    const request = await this.prisma.followRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    if (request.requestedToId !== userId) {
      throw new ForbiddenException('You can only reject follow requests sent to you');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('This request has already been processed');
    }

    await this.prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }

  async getPendingFollowRequests(userId: string): Promise<FollowRequestDto[]> {
    const requests = await this.prisma.followRequest.findMany({
      where: {
        requestedToId: userId,
        status: 'PENDING',
      },
      include: {
        requestedBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests.map(request => ({
      ...request,
      requester: request.requestedBy,
    }));
  }

  async getSentFollowRequests(userId: string): Promise<FollowRequestDto[]> {
    const requests = await this.prisma.followRequest.findMany({
      where: {
        requesterId: userId,
      },
      include: {
        requestedBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests.map(request => ({
      ...request,
      requester: request.requestedBy,
    }));
  }
} 