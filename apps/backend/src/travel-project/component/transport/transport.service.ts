import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTransportOptionDto } from './dto/create-transport-option.dto';
import { TransportVoteDto } from './dto/transport-vote.dto';
import { AddTransportCommentDto } from './dto/add-transport-comment.dto';
import { extractTransportInfoFromUrl } from './utils/transport-scraper';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '../../../notifications/notification.types';
import { UrlValidator } from '../../../utils/url-validator';
import { MonitoringService } from '../../../monitoring/monitoring.service';
import { SortTransportDto, SortField, SortOrder } from './dto/sort-transport.dto';
import { Prisma } from '@prisma/client';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { CommentEvent, VoteEvent, SelectionEvent } from '../../../websocket/websocket.types';
import { Decimal } from '@prisma/client/runtime/library';
import { TransportOption, TransportVote, TravelProject } from '@prisma/client';

interface TransportScore {
  voteScore: number;
  priceScore: number;
  durationScore: number;
  commentScore: number;
  globalScore: number;
}

@Injectable()
export class TransportService {
  private readonly logger = new Logger(TransportService.name);
  private readonly SCORE_WEIGHTS = {
    VOTE: 0.4,
    PRICE: 0.3,
    DURATION: 0.2,
    COMMENT: 0.1,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly urlValidator: UrlValidator,
    private readonly monitoringService: MonitoringService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async authorize(projectId: string, userId: string): Promise<TravelProject> {
    this.logger.debug(`Authorizing user ${userId} for project ${projectId}`);
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
      include: { participants: true },
    });
    if (!project) {
      this.logger.warn(`Project ${projectId} not found`);
      throw new NotFoundException('Projet introuvable');
    }
    const isMember =
      project.creatorId === userId ||
      project.participants.some(p => p.userId === userId);
    if (!isMember) {
      this.logger.warn(`User ${userId} is not authorized for project ${projectId}`);
      throw new ForbiddenException('Accès interdit');
    }
    this.logger.debug(`User ${userId} authorized for project ${projectId}`);
    return project;
  }

  async create(projectId: string, dto: CreateTransportOptionDto, userId: string) {
    this.logger.log(`Creating transport option for project ${projectId} by user ${userId}`);
    await this.authorize(projectId, userId);
  
    let autoData = {};
    if (dto.link) {
      this.logger.debug(`Validating URL: ${dto.link}`);
      if (this.urlValidator.validateUrl(dto.link, 'transport')) {
        this.logger.debug(`Extracting transport info from URL: ${dto.link}`);
        autoData = await extractTransportInfoFromUrl(dto.link);
      } else {
        this.logger.warn(`Invalid URL for scraping: ${dto.link}`);
        throw new ForbiddenException('URL non autorisée pour le scraping');
      }
    }
  
    const transport = await this.prisma.transportOption.create({
      data: {
        ...dto,
        ...autoData,
        projectId,
        addedBy: userId,
      },
    });

    this.logger.log(`Transport option created with ID: ${transport.id}`);

    // Notification de création
    await this.notificationService.notify(NotificationType.PROJECT_CREATED, {
      projectId,
      transportId: transport.id,
      userId,
    });

    return transport;
  }

  private calculateScores(transports: any[]): any[] {
    // Trouver les valeurs min/max pour la normalisation
    const maxPrice = Math.max(...transports.map(t => t.price || 0));
    const maxDuration = Math.max(...transports.map(t => {
      if (!t.duration) return 0;
      const [hours, minutes] = t.duration.split(':').map(Number);
      return hours * 60 + minutes;
    }));
    const maxComments = Math.max(...transports.map(t => t.comments.length));

    return transports.map(transport => {
      // Score des votes
      const upvotes = transport.votes.filter(v => v.vote).length;
      const downvotes = transport.votes.filter(v => !v.vote).length;
      const totalVotes = upvotes + downvotes;
      const voteScore = totalVotes > 0 ? (upvotes - downvotes) / totalVotes : 0;

      // Score du prix (plus le prix est bas, meilleur est le score)
      const priceScore = maxPrice > 0 && transport.price 
        ? 1 - (transport.price / maxPrice)
        : 0;

      // Score de la durée (plus la durée est courte, meilleur est le score)
      let durationScore = 0;
      if (transport.duration && maxDuration > 0) {
        const [hours, minutes] = transport.duration.split(':').map(Number);
        const durationInMinutes = hours * 60 + minutes;
        durationScore = 1 - (durationInMinutes / maxDuration);
      }

      // Score des commentaires
      const commentScore = maxComments > 0 
        ? transport.comments.length / maxComments
        : 0;

      // Score global pondéré
      const globalScore = 
        voteScore * this.SCORE_WEIGHTS.VOTE +
        priceScore * this.SCORE_WEIGHTS.PRICE +
        durationScore * this.SCORE_WEIGHTS.DURATION +
        commentScore * this.SCORE_WEIGHTS.COMMENT;

      return {
        ...transport,
        scores: {
          voteScore,
          priceScore,
          durationScore,
          commentScore,
          globalScore,
        },
      };
    });
  }

  async findAll(projectId: string, userId: string, sortDto?: SortTransportDto) {
    this.logger.debug(`Finding all transport options for project ${projectId}`);
    await this.authorize(projectId, userId);

    const transports = await this.prisma.transportOption.findMany({
      where: { projectId },
      include: {
        votes: true,
        comments: true,
      },
    });

    if (!sortDto?.sortBy) {
      return transports;
    }

    // Calculer les scores pour chaque transport
    const transportsWithScores = this.calculateScores(transports);

    // Trier selon le critère choisi
    return transportsWithScores.sort((a, b) => {
      const order = sortDto.order === SortOrder.ASC ? 1 : -1;

      switch (sortDto.sortBy) {
        case SortField.SCORE:
          return (a.scores.globalScore - b.scores.globalScore) * order;
        
        case SortField.PRICE:
          if (!a.price && !b.price) return 0;
          if (!a.price) return 1 * order;
          if (!b.price) return -1 * order;
          return (a.price - b.price) * order;
        
        case SortField.DURATION:
          if (!a.duration && !b.duration) return 0;
          if (!a.duration) return 1 * order;
          if (!b.duration) return -1 * order;
          const [aHours, aMinutes] = a.duration.split(':').map(Number);
          const [bHours, bMinutes] = b.duration.split(':').map(Number);
          const aDuration = aHours * 60 + aMinutes;
          const bDuration = bHours * 60 + bMinutes;
          return (aDuration - bDuration) * order;
        
        case SortField.DATE:
          return (a.date.getTime() - b.date.getTime()) * order;
        
        default:
          return 0;
      }
    });
  }

  async vote(userId: string, dto: TransportVoteDto) {
    this.logger.log(`User ${userId} voting on transport ${dto.transportId}`);
    const transport = await this.prisma.transportOption.findUnique({
      where: { id: dto.transportId },
    });
    if (!transport) {
      this.logger.warn(`Transport ${dto.transportId} not found`);
      throw new NotFoundException();
    }
    await this.authorize(transport.projectId, userId);

    const vote = await this.prisma.transportVote.upsert({
      where: {
        projectId_transportId_userId: {
          projectId: transport.projectId,
          transportId: dto.transportId,
          userId,
        },
      },
      update: {
        vote: dto.vote,
        comment: dto.comment,
        votedAt: new Date(),
      },
      create: {
        projectId: transport.projectId,
        transportId: dto.transportId,
        userId,
        vote: dto.vote,
        comment: dto.comment,
      },
    });

    this.logger.log(`Vote recorded for transport ${dto.transportId}`);

    // Notification de vote
    await this.notificationService.notify(NotificationType.VOTE_ADDED, {
      projectId: transport.projectId,
      transportId: dto.transportId,
      userId,
    });

    return vote;
  }

  async deleteVote(userId: string, transportId: string) {
    this.logger.log(`User ${userId} deleting vote for transport ${transportId}`);
    const transport = await this.prisma.transportOption.findUnique({
      where: { id: transportId },
    });
    if (!transport) {
      this.logger.warn(`Transport ${transportId} not found`);
      throw new NotFoundException();
    }
    await this.authorize(transport.projectId, userId);

    const vote = await this.prisma.transportVote.delete({
      where: {
        projectId_transportId_userId: {
          projectId: transport.projectId,
          transportId,
          userId,
        },
      },
    });

    this.logger.log(`Vote deleted for transport ${transportId}`);

    // Notification de suppression de vote
    await this.notificationService.notify(NotificationType.VOTE_DELETED, {
      projectId: transport.projectId,
      transportId,
      userId,
    });

    return vote;
  }

  async getVoters(transportId: string, userId: string) {
    this.logger.log(`Getting voters for transport ${transportId}`);
    const transport = await this.prisma.transportOption.findUnique({
      where: { id: transportId },
    });
    if (!transport) {
      this.logger.warn(`Transport ${transportId} not found`);
      throw new NotFoundException();
    }
    await this.authorize(transport.projectId, userId);

    const votes = await this.prisma.transportVote.findMany({
      where: { transportId },
    });

    return votes.map(vote => ({
      userId: vote.userId,
      vote: vote.vote,
      comment: vote.comment,
      votedAt: vote.votedAt,
    }));
  }

  async addComment(userId: string, dto: AddTransportCommentDto) {
    this.logger.log(`User ${userId} adding comment to transport ${dto.transportId}`);
    const transport = await this.prisma.transportOption.findUnique({
      where: { id: dto.transportId },
    });
    if (!transport) {
      this.logger.warn(`Transport ${dto.transportId} not found`);
      throw new NotFoundException();
    }
    await this.authorize(transport.projectId, userId);

    const comment = await this.prisma.transportComment.create({
      data: {
        transportId: dto.transportId,
        userId,
        content: dto.content,
      },
    });

    this.logger.log(`Comment added to transport ${dto.transportId}`);

    // Notification de commentaire
    await this.notificationService.notify(NotificationType.COMMENT_ADDED, {
      projectId: transport.projectId,
      transportId: dto.transportId,
      userId,
    });

    return comment;
  }

  async selectOption(projectId: string, transportId: string, userId: string) {
    this.logger.log(`User ${userId} selecting transport ${transportId} for project ${projectId}`);
    const project = await this.authorize(projectId, userId);
    if (project.creatorId !== userId) {
      this.logger.warn(`User ${userId} is not authorized to select transport option`);
      throw new ForbiddenException('Seul le créateur peut valider une option');
    }

    const transport = await this.prisma.transportOption.update({
      where: { id: transportId },
      data: { isSelected: true },
    });

    this.logger.log(`Transport ${transportId} selected for project ${projectId}`);

    // Notification de sélection
    await this.notificationService.notify(NotificationType.TRANSPORT_SELECTED, {
      projectId,
      transportId,
      userId,
    });

    return transport;
  }

  async validateOption(projectId: string, transportId: string, userId: string) {
    // Vérifier que l'utilisateur est le créateur du projet
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can validate options');
    }

    // Désélectionner toutes les autres options
    await this.prisma.transportOption.updateMany({
      where: {
        projectId,
        isSelected: true,
      },
      data: {
        isSelected: false,
      },
    });

    // Sélectionner l'option
    const transport = await this.prisma.transportOption.update({
      where: {
        id: transportId,
      },
      data: {
        isSelected: true,
      },
    });

    // Notifier les participants
    await this.notificationService.notify(NotificationType.TRANSPORT_SELECTED, {
      projectId,
      transportId,
      userId,
    });

    return transport;
  }

  async unvalidateOption(projectId: string, transportId: string, userId: string) {
    // Vérifier que l'utilisateur est le créateur du projet
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can unvalidate options');
    }

    // Désélectionner l'option
    const transport = await this.prisma.transportOption.update({
      where: {
        id: transportId,
      },
      data: {
        isSelected: false,
      },
    });

    // Notifier les participants
    await this.notificationService.notify(NotificationType.TRANSPORT_SELECTED, {
      projectId,
      transportId,
      userId,
    });

    return transport;
  }

  async getValidatedOption(projectId: string) {
    return this.prisma.transportOption.findFirst({
      where: {
        projectId,
        isSelected: true,
      },
    });
  }
}