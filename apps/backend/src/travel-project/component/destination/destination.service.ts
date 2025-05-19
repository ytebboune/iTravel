import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '@itravel/shared';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { CommentEvent, VoteEvent, SelectionEvent } from '../../../websocket/websocket.types';
import { Destination, DestinationVote, TravelProject } from '@prisma/client';

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

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

  async vote(projectId: string, destinationId: string, userId: string, vote: boolean, comment?: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id: destinationId },
      include: { project: true },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    await this.authorize(projectId, userId);

    const voteData = await this.prisma.destinationVote.upsert({
      where: {
        projectId_destinationId_userId: {
          projectId,
          destinationId,
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
        destinationId,
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
      type: 'destination',
      id: destinationId,
      vote: {
        user: voteData.user,
        votedAt: voteData.votedAt,
        vote: voteData.vote,
        comment: voteData.comment ?? undefined,
      },
    });

    this.notificationService.notify(NotificationType.DESTINATION_VOTE, {
      projectId,
      userId,
      data: {
        destinationId,
        destination: destination,
        vote,
        comment,
      },
    });

    return voteData;
  }

  async deleteVote(projectId: string, destinationId: string, userId: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id: destinationId },
      include: { project: true },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    await this.authorize(destination.projectId, userId);

    const vote = await this.prisma.destinationVote.delete({
      where: {
        projectId_destinationId_userId: {
          projectId: destination.projectId,
          destinationId,
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
      type: 'destination',
      projectId: destination.projectId,
      destinationId,
      vote: {
        id: destinationId,
        userId: vote.userId,
        user: vote.user,
        votedAt: vote.votedAt,
        vote: vote.vote,
        comment: vote.comment ?? undefined,
      },
    };

    this.websocketGateway.server
      .to(`project:${destination.projectId}`)
      .emit('voteDeleted', voteEvent);

    await this.notificationService.notify(NotificationType.VOTE_DELETED, {
      projectId: destination.projectId,
      userId,
      data: {
        message: 'Vote removed from destination',
        destinationId,
      },
    });

    return vote;
  }

  async validateOption(projectId: string, destinationId: string, userId: string) {
    const project = await this.authorize(projectId, userId);
    if (project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can validate options');
    }

    const destination = await this.prisma.destination.update({
      where: {
        id: destinationId,
      },
      data: {
      },
    });

    const selectionEvent: SelectionEvent = {
      type: 'destination',
      projectId,
      destinationId,
      selection: {
        id: destination.id,
        isSelected: true,
        selectedBy: userId,
        selectedAt: new Date(),
      },
    };

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('selectionReceived', selectionEvent);

    await this.notificationService.notify(NotificationType.DESTINATION_SELECTED, {
      projectId,
      userId,
      data: {
        message: 'Destination selected',
        destinationId,
      },
    });

    return destination;
  }

  async unvalidateOption(projectId: string, destinationId: string, userId: string) {
    const project = await this.authorize(projectId, userId);
    if (project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can unvalidate options');
    }

    const destination = await this.prisma.destination.update({
      where: { id: destinationId },
      data: {
      },
    });

    const selectionEvent: SelectionEvent = {
      type: 'destination',
      projectId,
      destinationId,
      selection: {
        id: destination.id,
        isSelected: false,
        selectedBy: userId,
        selectedAt: new Date(),
      },
    };

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('selectionRemoved', selectionEvent);

    await this.notificationService.notify(NotificationType.DESTINATION_UNSELECTED, {
      projectId,
      userId,
      data: {
        message: 'Destination unselected',
        destinationId,
      },
    });

    return destination;
  }

  async getValidatedOption(projectId: string) {
    return this.prisma.destination.findFirst({
      where: {
        projectId,
      },
    });
  }

  async addComment(projectId: string, destinationId: string, userId: string, content: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id: destinationId },
      include: { project: true },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    await this.authorize(destination.projectId, userId);

    const comment = await this.prisma.comment.create({
      data: {
        content,
        userId,
        destinationId,
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

    const commentEvent: CommentEvent = {
      type: 'destination',
      projectId: destination.projectId,
      destinationId,
      comment: {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        user: comment.user,
        createdAt: comment.createdAt,
      },
    };

    this.websocketGateway.server
      .to(`project:${destination.projectId}`)
      .emit('commentReceived', commentEvent);

    await this.notificationService.notify(NotificationType.COMMENT_ADDED, {
      projectId: destination.projectId,
      userId,
      data: {
        message: 'New comment on destination',
        destinationId,
        commentId: comment.id,
      },
    });

    return comment;
  }

  async getVoters(destinationId: string, userId: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id: destinationId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    await this.authorize(destination.projectId, userId);

    return this.prisma.destinationVote.findMany({
      where: { destinationId },
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

    const votes = await this.prisma.destinationVote.findMany({
      where: { projectId },
      select: {
        destinationId: true,
        userId: true,
        vote: true,
        comment: true,
        votedAt: true,
      },
    });

    const result = new Map<string, { upvotes: number; downvotes: number; userVote: boolean | null; comment?: string }>();

    for (const v of votes) {
      if (!result.has(v.destinationId)) {
        result.set(v.destinationId, { upvotes: 0, downvotes: 0, userVote: null });
      }
      const destinationVote = result.get(v.destinationId)!;
      if (v.vote) destinationVote.upvotes++;
      else destinationVote.downvotes++;

      if (v.userId === userId) {
        destinationVote.userVote = v.vote;
        destinationVote.comment = v.comment ?? undefined;
      }
    }

    return Array.from(result.entries()).map(([destinationId, data]) => ({
      destinationId,
      ...data,
      score: data.upvotes - data.downvotes,
    }));
  }

  async getComments(projectId: string, destinationId: string, userId: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id: destinationId },
      include: { project: true },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    await this.authorize(destination.projectId, userId);

    return this.prisma.comment.findMany({
      where: { destinationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
} 