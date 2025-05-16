import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '../../../notifications/notification.types';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { CommentEvent, VoteEvent, SelectionEvent } from '../../../websocket/websocket.types';
import { DateSuggestion, DateVote, TravelProject } from '@prisma/client';

@Injectable()
export class DateSuggestionService {
  private readonly logger = new Logger(DateSuggestionService.name);

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

  async vote(projectId: string, dateId: string, userId: string, vote: boolean, comment?: string) {
    const date = await this.prisma.dateSuggestion.findUnique({
      where: { id: dateId },
      include: { project: true },
    });

    if (!date) {
      throw new NotFoundException('Date suggestion not found');
    }

    await this.authorize(projectId, userId);

    const voteData = await this.prisma.dateVote.upsert({
      where: {
        projectId_dateId_userId: {
          projectId,
          dateId,
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
        dateId,
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
      type: 'date',
      id: dateId,
      vote: {
        user: voteData.user,
        votedAt: voteData.votedAt,
        vote: voteData.vote,
        comment: voteData.comment ?? undefined,
      },
    });

    this.notificationService.notify(NotificationType.DATE_VOTE, {
      projectId,
      userId,
      data: {
        dateId,
        date: date,
        vote,
        comment,
      },
    });

    return voteData;
  }

  async deleteVote(projectId: string, dateId: string, userId: string) {
    const dateSuggestion = await this.prisma.dateSuggestion.findUnique({
      where: { id: dateId },
      include: { project: true },
    });

    if (!dateSuggestion) {
      throw new NotFoundException('Date suggestion not found');
    }

    await this.authorize(dateSuggestion.projectId, userId);

    const vote = await this.prisma.dateVote.delete({
      where: {
        projectId_dateId_userId: {
          projectId: dateSuggestion.projectId,
          dateId,
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

    const voteEvent: VoteEvent = {
      type: 'date',
      projectId: dateSuggestion.projectId,
      dateId,
      vote: {
        id: dateId,
        userId: vote.userId,
        user: vote.user,
        votedAt: vote.votedAt,
        vote: vote.vote,
        comment: vote.comment ?? undefined,
      },
    };

    this.websocketGateway.server
      .to(`project:${dateSuggestion.projectId}`)
      .emit('voteDeleted', voteEvent);

    await this.notificationService.notify(NotificationType.VOTE_DELETED, {
      projectId: dateSuggestion.projectId,
      userId,
      data: {
        message: 'Vote removed from date suggestion',
        dateId,
      },
    });

    return vote;
  }

  async validateOption(projectId: string, dateId: string, userId: string) {
    const project = await this.authorize(projectId, userId);
    if (project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can validate options');
    }

    const dateSuggestion = await this.prisma.dateSuggestion.update({
      where: {
        id: dateId,
      },
      data: {
      },
    });

    const selectionEvent: SelectionEvent = {
      type: 'date',
      projectId,
      dateId,
      selection: {
        id: dateSuggestion.id,
        isSelected: true,
        selectedBy: userId,
        selectedAt: new Date(),
      },
    };

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('selectionReceived', selectionEvent);

    await this.notificationService.notify(NotificationType.DATE_SELECTED, {
      projectId,
      userId,
      data: {
        message: 'Date selected',
        dateId,
      },
    });

    return dateSuggestion;
  }

  async unvalidateOption(projectId: string, dateId: string, userId: string) {
    const project = await this.authorize(projectId, userId);
    if (project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can unvalidate options');
    }

    const dateSuggestion = await this.prisma.dateSuggestion.update({
      where: { id: dateId },
      data: {
      },
    });

    const selectionEvent: SelectionEvent = {
      type: 'date',
      projectId,
      dateId,
      selection: {
        id: dateSuggestion.id,
        isSelected: false,
        selectedBy: userId,
        selectedAt: new Date(),
      },
    };

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('selectionRemoved', selectionEvent);

    await this.notificationService.notify(NotificationType.DATE_UNSELECTED, {
      projectId,
      userId,
      data: {
        message: 'Date unselected',
        dateId,
      },
    });

    return dateSuggestion;
  }

  async getValidatedOption(projectId: string) {
    return this.prisma.dateSuggestion.findFirst({
      where: {
        projectId,
      },
    });
  }

  async getVoters(dateId: string, userId: string) {
    const dateSuggestion = await this.prisma.dateSuggestion.findUnique({
      where: { id: dateId },
    });

    if (!dateSuggestion) {
      throw new NotFoundException('Date suggestion not found');
    }

    await this.authorize(dateSuggestion.projectId, userId);

    return this.prisma.dateVote.findMany({
      where: { dateId },
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

    const votes = await this.prisma.dateVote.findMany({
      where: { projectId },
      select: {
        dateId: true,
        userId: true,
        vote: true,
        comment: true,
        votedAt: true,
      },
    });

    const result = new Map<string, { upvotes: number; downvotes: number; userVote: boolean | null; comment?: string }>();

    for (const v of votes) {
      if (!result.has(v.dateId)) {
        result.set(v.dateId, { upvotes: 0, downvotes: 0, userVote: null });
      }
      const dateVote = result.get(v.dateId)!;
      if (v.vote) dateVote.upvotes++;
      else dateVote.downvotes++;

      if (v.userId === userId) {
        dateVote.userVote = v.vote;
        dateVote.comment = v.comment ?? undefined;
      }
    }

    return Array.from(result.entries()).map(([dateId, data]) => ({
      dateId,
      ...data,
      score: data.upvotes - data.downvotes,
    }));
  }
} 