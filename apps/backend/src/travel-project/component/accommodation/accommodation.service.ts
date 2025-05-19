import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '@itravel/shared';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { TravelProject } from '@prisma/client';
import { UrlValidator } from './utils/url-validator';
import { extractPhotosFromUrl } from './utils/photo-scraper';
import { FilterAccommodationDto } from './dto/filter-accommodation.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccommodationService {
  private readonly logger = new Logger(AccommodationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly urlValidator: UrlValidator,
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

    let photoUrls: string[] = [];
    if (data.link) {
      this.logger.debug(`Validating URL: ${data.link}`);
      if (this.urlValidator.isValidUrl(data.link)) {
        this.logger.debug(`Extracting photos from URL: ${data.link}`);
        photoUrls = await extractPhotosFromUrl(data.link);
      } else {
        this.logger.warn(`Invalid URL for scraping: ${data.link}`);
        throw new ForbiddenException('URL non autorisée pour le scraping');
      }
    }

    const accommodation = await this.prisma.accommodation.create({
      data: {
        projectId,
        ...data,
        photos: {
          create: photoUrls.map(url => ({ url }))
        }
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

    await this.notificationService.notify(NotificationType.VOTE_ADDED, {
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

  async filter(projectId: string, query: FilterAccommodationDto, userId: string) {
    await this.authorize(projectId, userId);

    const where: Prisma.AccommodationWhereInput = {
      projectId,
      ...(query.priceMin && { price: { gte: new Prisma.Decimal(query.priceMin) } }),
      ...(query.priceMax && { price: { lte: new Prisma.Decimal(query.priceMax) } }),
      ...(query.type && { type: query.type }),
    };

    const accommodations = await this.prisma.accommodation.findMany({
      where,
      include: {
        votes: true,
        availability: true,
      },
    });

    if (query.sortBy) {
      accommodations.sort((a, b) => {
        switch (query.sortBy) {
          case 'price':
            return Number(a.price) - Number(b.price);
          case 'votes':
            return b.votes.length - a.votes.length;
          case 'score':
            const scoreA = a.votes.reduce((acc, vote) => acc + (vote.vote ? 1 : -1), 0);
            const scoreB = b.votes.reduce((acc, vote) => acc + (vote.vote ? 1 : -1), 0);
            return scoreB - scoreA;
          default:
            return 0;
        }
      });
    }

    return accommodations;
  }

  private async checkAvailabilityOverlap(accommodationId: string, start: Date, end: Date, excludeAvailabilityId?: string): Promise<boolean> {
    const where: Prisma.AvailabilityWhereInput = {
      accommodationId,
      OR: [
        {
          AND: [
            { start: { lte: start } },
            { end: { gte: start } },
          ],
        },
        {
          AND: [
            { start: { lte: end } },
            { end: { gte: end } },
          ],
        },
        {
          AND: [
            { start: { gte: start } },
            { end: { lte: end } },
          ],
        },
      ],
    };

    if (excludeAvailabilityId) {
      where.id = { not: excludeAvailabilityId };
    }

    const overlappingAvailability = await this.prisma.availability.findFirst({ where });
    return !!overlappingAvailability;
  }

  async checkAvailability(id: string, start: string, end: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const startDate = new Date(start);
    const endDate = new Date(end);

    const hasOverlap = await this.checkAvailabilityOverlap(id, startDate, endDate);

    return {
      isAvailable: !hasOverlap,
      message: hasOverlap ? 'L\'hébergement n\'est pas disponible sur cette période' : 'L\'hébergement est disponible sur cette période',
    };
  }

  async addAvailability(id: string, createAvailabilityDto: CreateAvailabilityDto, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const startDate = new Date(createAvailabilityDto.start);
    const endDate = new Date(createAvailabilityDto.end);

    const hasOverlap = await this.checkAvailabilityOverlap(id, startDate, endDate);
    if (hasOverlap) {
      throw new ForbiddenException('Cette période chevauche une période de disponibilité existante');
    }

    const availability = await this.prisma.availability.create({
      data: {
        start: startDate,
        end: endDate,
        accommodation: { connect: { id } },
      },
    });

    await this.notificationService.notify(NotificationType.COMMENT_ADDED, {
      projectId: accommodation.projectId,
      accommodationId: id,
      userId,
    });

    return availability;
  }

  async getAvailability(id: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
      include: { availability: true },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    return accommodation.availability;
  }

  async addComment(id: string, addCommentDto: AddCommentDto, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const comment = await this.prisma.comment.create({
      data: {
        content: addCommentDto.content,
        userId,
        accommodationId: id,
      },
    });

    await this.notificationService.notify(NotificationType.COMMENT_ADDED, {
      projectId: accommodation.projectId,
      accommodationId: id,
      userId,
    });

    this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:comment_added', comment);

    return comment;
  }

  async deleteComment(id: string, commentId: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment ${commentId} not found`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:comment_deleted', { commentId });

    return { message: 'Comment deleted successfully' };
  }

  async getComments(id: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
      include: {
        comments: {
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
        },
      },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    return accommodation.comments;
  }

  async addPhoto(id: string, photoUrl: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const photo = await this.prisma.photo.create({
      data: {
        url: photoUrl,
        accommodationId: id,
      },
    });

    this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:photo_added', photo);

    return photo;
  }

  async deletePhoto(id: string, photoId: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException(`Photo ${photoId} not found`);
    }

    await this.prisma.photo.delete({
      where: { id: photoId },
    });

    this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:photo_deleted', { photoId });

    return { message: 'Photo deleted successfully' };
  }

  async getPhotos(id: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    return accommodation.photos;
  }

  async updateAvailability(id: string, availabilityId: string, updateAvailabilityDto: UpdateAvailabilityDto, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const availability = await this.prisma.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability) {
      throw new NotFoundException(`Availability ${availabilityId} not found`);
    }

    const startDate = new Date(updateAvailabilityDto.start);
    const endDate = new Date(updateAvailabilityDto.end);

    const hasOverlap = await this.checkAvailabilityOverlap(id, startDate, endDate, availabilityId);
    if (hasOverlap) {
      throw new ForbiddenException('Cette période chevauche une période de disponibilité existante');
    }

    const updatedAvailability = await this.prisma.availability.update({
      where: { id: availabilityId },
      data: {
        start: startDate,
        end: endDate,
      },
    });

    this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:availability_updated', updatedAvailability);

    return updatedAvailability;
  }

  async deleteAvailability(id: string, availabilityId: string, userId: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }

    await this.authorize(accommodation.projectId, userId);

    const availability = await this.prisma.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability) {
      throw new NotFoundException(`Availability ${availabilityId} not found`);
    }

    await this.prisma.availability.delete({
      where: { id: availabilityId },
    });

    this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:availability_deleted', { availabilityId });

    return { message: 'Availability deleted successfully' };
  }
} 