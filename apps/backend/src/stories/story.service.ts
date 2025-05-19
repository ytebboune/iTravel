import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '@itravel/shared';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CreateStoryDto } from './dto/create-story.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async create(userId: string, createStoryDto: CreateStoryDto) {
    const { content, photo } = createStoryDto;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const story = await this.prisma.story.create({
      data: {
        content,
        photo,
        expiresAt,
        user: { connect: { id: userId } },
      },
      include: {
        user: true,
        views: true,
      },
    });

    await this.notificationService.notify(NotificationType.STORY_CREATED, {
      userId,
      data: {
        storyId: story.id,
      },
    });

    this.websocketGateway.server.to(userId).emit('story:created', story);

    return story;
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followingIds = user.following.map(f => f.followingId);
    followingIds.push(userId);

    const stories = await this.prisma.story.findMany({
      where: {
        userId: { in: followingIds },
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
        views: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return stories;
  }

  async findOne(id: string, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            followers: true,
          },
        },
        views: true,
      },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId !== userId && !story.user.followers.some(f => f.followerId === userId)) {
      throw new ForbiddenException('You can only view stories from users you follow');
    }

    return story;
  }

  async remove(id: string, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId !== userId) {
      throw new ForbiddenException('You can only delete your own stories');
    }

    await this.prisma.story.delete({
      where: { id },
    });

    this.websocketGateway.server.to(userId).emit('story:deleted', { id });

    return { message: 'Story deleted successfully' };
  }

  async view(id: string, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            followers: true,
          },
        },
        views: true,
      },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId !== userId && !story.user.followers.some(f => f.followerId === userId)) {
      throw new ForbiddenException('You can only view stories from users you follow');
    }

    const existingView = await this.prisma.storyView.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId: id,
        },
      },
    });

    if (!existingView) {
      const view = await this.prisma.storyView.create({
        data: {
          user: { connect: { id: userId } },
          story: { connect: { id } },
        },
      });

      if (story.userId !== userId) {
        await this.notificationService.notify(NotificationType.STORY_VIEWED, {
          userId: story.userId,
          data: {
            storyId: id,
            viewedBy: userId,
          },
        });
      }

      this.websocketGateway.server.to(story.userId).emit('story:viewed', {
        storyId: id,
        userId,
      });

      return view;
    }

    return existingView;
  }

  async getUserStories(userId: string) {
    const stories = await this.prisma.story.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      include: {
        views: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return stories;
  }
} 