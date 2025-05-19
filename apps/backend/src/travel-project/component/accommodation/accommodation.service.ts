import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '../../../notifications/notification.types';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { TravelProject } from '@prisma/client';

@Injectable()
export class AccommodationService {
  private readonly logger = new Logger(AccommodationService.name);

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

    if (project.creatorId !== userId && !project.participants.some(p => p.userId === userId)) {
      throw new ForbiddenException('User is not a member of this project');
    }

    return project;
  }

  async create(projectId: string, userId: string, data: any) {
    await this.authorize(projectId, userId);

    const accommodation = await this.prisma.accommodation.create({
      data: {
        projectId,
        ...data,
      },
    });

    await this.notificationService.notify(NotificationType.ACCOMMODATION_CREATED, {
      projectId,
      userId,
      data: {
        accommodationId: accommodation.id,
        name: accommodation.name,
      },
    });

    this.websocketGateway.server.to(projectId).emit('accommodation:created', accommodation);

    return accommodation;
  }

  async findAll(projectId: string, userId: string) {
    await this.authorize(projectId, userId);

    return this.prisma.accommodation.findMany({
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

  async vote(projectId: string, accommodationId: string, userId: string, vote: boolean, comment?: string) {
    await this.authorize(projectId, userId);

    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    const voteData = await this.prisma.accommodationVote.upsert({
      where: {
        projectId_accommodationId_userId: {
          projectId,
          accommodationId,
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
        accommodationId,
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

    await this.notificationService.notify(NotificationType.ACCOMMODATION_VOTE, {
      projectId,
      userId,
      data: {
        accommodationId,
        vote,
        comment,
      },
    });

    this.websocketGateway.server.to(projectId).emit('accommodation:vote', voteData);

    return voteData;
  }

  async deleteVote(projectId: string, accommodationId: string, userId: string) {
    await this.authorize(projectId, userId);

    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    const vote = await this.prisma.accommodationVote.delete({
      where: {
        projectId_accommodationId_userId: {
          projectId,
          accommodationId,
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

    await this.notificationService.notify(NotificationType.ACCOMMODATION_VOTE_DELETED, {
      projectId,
      userId,
      data: {
        accommodationId,
      },
    });

    this.websocketGateway.server.to(projectId).emit('accommodation:vote_deleted', vote);

    return vote;
  }

  async getVoters(accommodationId: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    await this.authorize(accommodation.projectId, userId);

    return this.prisma.accommodationVote.findMany({
      where: { accommodationId },
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

    const votes = await this.prisma.accommodationVote.findMany({
      where: { projectId },
      select: {
        accommodationId: true,
        userId: true,
        vote: true,
        comment: true,
        votedAt: true,
      },
    });

    const voteSummary = votes.reduce((acc, vote) => {
      if (!acc[vote.accommodationId]) {
        acc[vote.accommodationId] = {
          accommodationId: vote.accommodationId,
          upvotes: 0,
          downvotes: 0,
          userVote: vote.userId === userId ? vote.vote : null,
          comment: vote.comment,
          score: 0,
        };
      }

      if (vote.vote) {
        acc[vote.accommodationId].upvotes++;
        acc[vote.accommodationId].score++;
      } else {
        acc[vote.accommodationId].downvotes++;
        acc[vote.accommodationId].score--;
      }

      return acc;
    }, {});

    return Object.values(voteSummary);
  }

  async validateOption(projectId: string, accommodationId: string, userId: string) {
    // Vérifier que l'utilisateur est le créateur du projet
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can validate options');
    }

    // Désélectionner toutes les autres options
    await this.prisma.accommodation.updateMany({
      where: {
        projectId,
        isSelected: true,
      },
      data: {
        isSelected: false,
        selectedAt: null,
      },
    });

    // Sélectionner l'option
    const accommodation = await this.prisma.accommodation.update({
      where: {
        id: accommodationId,
      },
      data: {
        isSelected: true,
        selectedAt: new Date(),
      },
    });

    // Notifier les participants
    await this.notificationService.notify(NotificationType.ACCOMMODATION_SELECTED, {
      projectId,
      accommodationId,
      userId,
    });

    return accommodation;
  }

  async unvalidateOption(projectId: string, accommodationId: string, userId: string) {
    // Vérifier que l'utilisateur est le créateur du projet
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can unvalidate options');
    }

    // Désélectionner l'option
    const accommodation = await this.prisma.accommodation.update({
      where: {
        id: accommodationId,
      },
      data: {
        isSelected: false,
        selectedAt: null,
      },
    });

    // Notifier les participants
    await this.notificationService.notify(NotificationType.ACCOMMODATION_SELECTED, {
      projectId,
      accommodationId,
      userId,
    });

    return accommodation;
  }

  async getValidatedOption(projectId: string) {
    return this.prisma.accommodation.findFirst({
      where: {
        projectId,
        isSelected: true,
      },
    });
  }
} 