import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationType } from '@itravel/shared';
import { TravelProject, Activity, ActivityVote } from '@prisma/client';
import { NotificationService } from 'src/core/notifications/notification.service';
import { WebsocketGateway } from 'src/core/websocket/websocket.gateway';


@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async authorize(projectId: string, userId: string): Promise<TravelProject> {
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
      include: { participants: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.creatorId === userId || 
      project.participants.some(p => p.userId === userId);

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return project;
  }

  async createActivity(
    projectId: string,
    userId: string,
    data: {
      title: string;
      description: string;
      imageUrl?: string;
      suggestedByAI?: boolean;
    },
  ): Promise<Activity> {
    await this.authorize(projectId, userId);

    const activity = await this.prisma.activity.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        suggestedByAI: data.suggestedByAI ?? false,
        addedBy: userId,
      },
    });

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('activityCreated', {
        type: 'activity',
        projectId,
        activity,
      });

    await this.notificationService.notify(NotificationType.ACTIVITY_CREATED, {
      projectId,
      userId,
      data: {
        message: 'New activity created',
        activityId: activity.id,
      },
    });

    return activity;
  }

  async getActivities(projectId: string, userId: string): Promise<Activity[]> {
    await this.authorize(projectId, userId);

    return this.prisma.activity.findMany({
      where: { projectId },
      include: {
        votes: {
          select: {
            userId: true,
            vote: true,
            comment: true,
            votedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPredefinedActivities(category?: string): Promise<Activity[]> {
    return this.prisma.activity.findMany({
      where: {
        suggestedByAI: true,
        ...(category && { category }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async vote(
    projectId: string,
    activityId: string,
    userId: string,
    vote: boolean,
    comment?: string,
  ): Promise<ActivityVote> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
      include: { project: true },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.authorize(projectId, userId);

    const voteData = await this.prisma.activityVote.upsert({
      where: {
        projectId_activityId_userId: {
          projectId,
          activityId,
          userId,
        },
      },
      update: {
        vote,
        comment,
        votedAt: new Date(),
      },
      create: {
        projectId,
        activityId,
        userId,
        vote,
        comment,
        votedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    this.websocketGateway.server.to(projectId).emit('voteReceived', {
      type: 'activity',
      id: activityId,
      vote: {
        user: voteData.user,
        votedAt: voteData.votedAt,
        vote: voteData.vote,
        comment: voteData.comment ?? undefined,
      },
    });

    await this.notificationService.notify(NotificationType.ACTIVITY_VOTE, {
      projectId,
      userId,
      data: {
        activityId,
        activity: activity,
        vote,
        comment,
      },
    });

    return voteData;
  }

  async deleteVote(projectId: string, activityId: string, userId: string): Promise<ActivityVote> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
      include: { project: true },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.authorize(activity.projectId, userId);

    const vote = await this.prisma.activityVote.delete({
      where: {
        projectId_activityId_userId: {
          projectId: activity.projectId,
          activityId,
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    this.websocketGateway.server
      .to(`project:${activity.projectId}`)
      .emit('voteDeleted', {
        type: 'activity',
        projectId: activity.projectId,
        activityId,
        vote: {
          id: activityId,
          userId: vote.userId,
          user: vote.user,
          votedAt: vote.votedAt,
          vote: vote.vote,
          comment: vote.comment ?? undefined,
        },
      });

    await this.notificationService.notify(NotificationType.VOTE_DELETED, {
      projectId: activity.projectId,
      userId,
      data: {
        message: 'Vote removed from activity',
        activityId,
      },
    });

    return vote;
  }

  async getVoters(activityId: string, userId: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.authorize(activity.projectId, userId);

    return this.prisma.activityVote.findMany({
      where: { activityId },
      select: {
        userId: true,
        votedAt: true,
        vote: true,
        comment: true,
      },
    });
  }

  async getVotes(projectId: string, userId: string) {
    await this.authorize(projectId, userId);

    const votes = await this.prisma.activityVote.findMany({
      where: { projectId },
      select: {
        activityId: true,
        userId: true,
        vote: true,
        comment: true,
        votedAt: true,
      },
    });

    const result = new Map<string, { upvotes: number; downvotes: number; userVote: boolean | null; comment?: string }>();

    for (const v of votes) {
      if (!result.has(v.activityId)) {
        result.set(v.activityId, { upvotes: 0, downvotes: 0, userVote: null });
      }
      const activityVote = result.get(v.activityId)!;
      if (v.vote) activityVote.upvotes++;
      else activityVote.downvotes++;

      if (v.userId === userId) {
        activityVote.userVote = v.vote;
        activityVote.comment = v.comment ?? undefined;
      }
    }

    return Array.from(result.entries()).map(([activityId, data]) => ({
      activityId,
      ...data,
      score: data.upvotes - data.downvotes,
    }));
  }
} 