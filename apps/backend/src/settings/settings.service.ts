import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '@itravel/shared';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async getSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        showEmail: true,
        showVisitedPlaces: true,
        showPosts: true,
        showStories: true,
        notificationSettings: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      privacy: {
        showEmail: user.showEmail,
        showVisitedPlaces: user.showVisitedPlaces,
        showPosts: user.showPosts,
        showStories: user.showStories,
      },
      notifications: user.notificationSettings,
    };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.notificationService.notify(NotificationType.SYSTEM, {
      userId,
      data: {
        message: 'Your password has been updated successfully',
      },
    });

    return { message: 'Password updated successfully' };
  }

  async updatePrivacy(userId: string, updatePrivacyDto: UpdatePrivacyDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        showEmail: updatePrivacyDto.showEmail,
        showVisitedPlaces: updatePrivacyDto.showVisitedPlaces,
        showPosts: updatePrivacyDto.showPosts,
        showStories: updatePrivacyDto.showStories,
      },
    });

    this.websocketGateway.server.to(userId).emit('settings:privacy_updated', {
      showEmail: updatedUser.showEmail,
      showVisitedPlaces: updatedUser.showVisitedPlaces,
      showPosts: updatedUser.showPosts,
      showStories: updatedUser.showStories,
    });

    return {
      showEmail: updatedUser.showEmail,
      showVisitedPlaces: updatedUser.showVisitedPlaces,
      showPosts: updatedUser.showPosts,
      showStories: updatedUser.showStories,
    };
  }

  async updateNotificationSettings(userId: string, settings: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        notificationSettings: settings,
      },
    });

    this.websocketGateway.server.to(userId).emit('settings:notifications_updated', updatedUser.notificationSettings);

    return updatedUser.notificationSettings;
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    this.websocketGateway.server.to(userId).emit('settings:account_deleted');

    return { message: 'Account deleted successfully' };
  }

  async getPrivacySettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        showEmail: true,
        showVisitedPlaces: true,
        showPosts: true,
        showStories: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      showEmail: user.showEmail,
      showVisitedPlaces: user.showVisitedPlaces,
      showPosts: user.showPosts,
      showStories: user.showStories,
      followers: user.followers.map(f => f.follower),
      following: user.following.map(f => f.following),
    };
  }

  async requestFollow(requesterId: string, requestedToId: string) {
    if (requesterId === requestedToId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const requestedUser = await this.prisma.user.findUnique({
      where: { id: requestedToId },
    });

    if (!requestedUser) {
      throw new NotFoundException('User not found');
    }

    // Si le profil est public, suivre directement
    if (!requestedUser.isPrivate) {
      return this.prisma.follow.create({
        data: {
          followerId: requesterId,
          followingId: requestedToId,
        },
      });
    }

    // Sinon, créer une demande de follow
    const existingRequest = await this.prisma.followRequest.findUnique({
      where: {
        requesterId_requestedToId: {
          requesterId,
          requestedToId,
        },
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Follow request already exists');
    }

    return this.prisma.followRequest.create({
      data: {
        requesterId,
        requestedToId,
      },
    });
  }

  async handleFollowRequest(userId: string, requestId: string, accept: boolean) {
    const request = await this.prisma.followRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    if (request.requestedToId !== userId) {
      throw new ForbiddenException('You can only handle your own follow requests');
    }

    if (accept) {
      // Créer la relation de follow
      await this.prisma.follow.create({
        data: {
          followerId: request.requesterId,
          followingId: userId,
        },
      });
    }

    // Mettre à jour le statut de la demande
    await this.prisma.followRequest.update({
      where: { id: requestId },
      data: {
        status: accept ? 'ACCEPTED' : 'REJECTED',
      },
    });

    return { message: accept ? 'Follow request accepted' : 'Follow request rejected' };
  }

  async getFollowRequests(userId: string) {
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
    });

    return requests;
  }
} 