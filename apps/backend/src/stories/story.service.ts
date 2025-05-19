import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createStory(userId: string, createStoryDto: CreateStoryDto) {
    const story = await this.prisma.story.create({
      data: {
        content: createStoryDto.content,
        photo: createStoryDto.mediaUrl,
        userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return story;
  }

  async deleteStory(userId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId !== userId) {
      throw new ForbiddenException('You can only delete your own stories');
    }

    await this.prisma.story.delete({
      where: { id: storyId },
    });

    return { message: 'Story deleted successfully' };
  }

  async getStories(userId: string) {
    // Récupérer les stories des utilisateurs suivis et de l'utilisateur lui-même
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);

    const stories = await this.prisma.story.findMany({
      where: {
        userId: {
          in: [...followingIds, userId],
        },
        expiresAt: {
          gt: new Date(), // Stories non expirées
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Grouper les stories par utilisateur
    const storiesByUser = stories.reduce((acc, story) => {
      if (!acc[story.userId]) {
        acc[story.userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[story.userId].stories.push(story);
      return acc;
    }, {});

    return Object.values(storiesByUser);
  }

  async getUserStories(userId: string) {
    const stories = await this.prisma.story.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return stories;
  }

  async markStoryAsViewed(userId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const view = await this.prisma.storyView.create({
      data: {
        userId,
        storyId,
      },
    });

    return view;
  }

  async getStoryViews(storyId: string) {
    const views = await this.prisma.storyView.findMany({
      where: { storyId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
    });

    return views;
  }
} 