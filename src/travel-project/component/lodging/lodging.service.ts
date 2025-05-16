import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { AddVoteDto } from './dto/add-vote-lodging.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { FilterAccommodationDto } from './dto/filter-accomodation.dto';
import { Prisma } from '@prisma/client';
import { extractPhotosFromUrl } from './utils/photo-scraper';
import AddCommentLodgingDto from './dto/add-comment-lodging.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { NotificationService, NotificationType } from 'src/notifications/notification.service';
import { UrlValidator } from 'src/utils/url-validator';
import { MonitoringService } from 'src/monitoring/monitoring.service';

@Injectable()
export class LodgingService {
  private readonly logger = new Logger(LodgingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly urlValidator: UrlValidator,
    private readonly monitoringService: MonitoringService,
  ) {}

  async authorize(projectId: string, userId: string) {
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

  async create(projectId: string, createAccommodationDto: CreateAccommodationDto, userId: string) {
    this.logger.log(`Creating accommodation for project ${projectId} by user ${userId}`);
    await this.authorize(projectId, userId);

    let photoUrls: string[] = [];
    if (createAccommodationDto.link) {
      this.logger.debug(`Validating URL: ${createAccommodationDto.link}`);
      if (this.urlValidator.validateUrl(createAccommodationDto.link, 'accommodation')) {
        this.logger.debug(`Extracting photos from URL: ${createAccommodationDto.link}`);
        photoUrls = await extractPhotosFromUrl(createAccommodationDto.link);
      } else {
        this.logger.warn(`Invalid URL for scraping: ${createAccommodationDto.link}`);
        throw new ForbiddenException('URL non autorisée pour le scraping');
      }
    }

    const accommodation = await this.prisma.accommodation.create({
      data: {
        ...createAccommodationDto,
        project: { connect: { id: projectId } },
        photos: {
          create: photoUrls.map(url => ({ url }))
        }
      },
    });

    this.logger.log(`Accommodation created with ID: ${accommodation.id}`);

    this.notificationService.notify(NotificationType.ACCOMMODATION_SELECTED, {
      projectId,
      accommodationId: accommodation.id,
      userId,
    });

    return accommodation;
  }

  async findAll(projectId: string, userId: string) {
    this.logger.log(`Finding all accommodations for project ${projectId}`);
    await this.authorize(projectId, userId);
    return this.prisma.accommodation.findMany({
      where: { projectId },
      include: {
        availability: true,
        comments: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    this.logger.log(`Finding accommodation ${id}`);
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
      include: {
        availability: true,
        comments: true,
      },
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }
    await this.authorize(accommodation.projectId, userId);
    return accommodation;
  }

  async update(id: string, updateAccommodationDto: UpdateAccommodationDto, userId: string) {
    this.logger.log(`Updating accommodation ${id}`);
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }
    await this.authorize(accommodation.projectId, userId);
    return this.prisma.accommodation.update({
      where: { id },
      data: updateAccommodationDto,
    });
  }

  async remove(id: string, userId: string) {
    this.logger.log(`Removing accommodation ${id}`);
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }
    await this.authorize(accommodation.projectId, userId);
    return this.prisma.accommodation.delete({
      where: { id },
    });
  }

  async addAvailability(id: string, createAvailabilityDto: CreateAvailabilityDto, userId: string) {
    this.logger.log(`Adding availability to accommodation ${id}`);
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${id} not found`);
    }
    await this.authorize(accommodation.projectId, userId);
    const availability = await this.prisma.availability.create({
      data: {
        start: createAvailabilityDto.start,
        end: createAvailabilityDto.end,
        accommodation: { connect: { id } },
      },
    });
    this.notificationService.notify(NotificationType.COMMENT_ADDED, {
      accommodationId: id,
      availabilityId: availability.id,
      userId,
    });
    return availability;
  }

  async addComment(id: string, addCommentDto: AddCommentLodgingDto, userId: string) {
    this.logger.log(`Adding comment to accommodation ${id}`);
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
        userId: userId,
        accommodationId: id,
      },
    });
    this.notificationService.notify(NotificationType.COMMENT_ADDED, {
      accommodationId: id,
      commentId: comment.id,
      userId,
    });
    return comment;
  }

  async vote(userId: string, dto: AddVoteDto) {
    this.logger.log(`User ${userId} voting on accommodation ${dto.accommodationId}`);
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id: dto.accommodationId },
    });
    if (!accommodation) {
      this.logger.warn(`Accommodation ${dto.accommodationId} not found`);
      throw new NotFoundException();
    }
    await this.authorize(accommodation.projectId, userId);

    const vote = await this.prisma.accommodationVote.upsert({
      where: {
        projectId_accommodationId_userId: {
          projectId: accommodation.projectId,
          accommodationId: dto.accommodationId,
          userId,
        },
      },
      update: {
        vote: dto.vote,
        comment: dto.comment,
        votedAt: new Date(),
      },
      create: {
        projectId: accommodation.projectId,
        accommodationId: dto.accommodationId,
        userId,
        vote: dto.vote,
        comment: dto.comment,
      },
    });

    this.logger.log(`Vote recorded for accommodation ${dto.accommodationId}`);

    await this.notificationService.notify(NotificationType.VOTE_ADDED, {
      projectId: accommodation.projectId,
      accommodationId: dto.accommodationId,
      userId,
    });

    return vote;
  }

  async deleteVote(projectId: string, accommodationId: string, userId: string) {
    await this.authorize(projectId, userId);
    return this.prisma.accommodationVote.delete({
      where: { projectId_accommodationId_userId: { projectId, accommodationId, userId } },
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
      },
    });
  
    const result = new Map<string, { upvotes: number; downvotes: number; userVote: boolean | null; comment?: string }>();
  
    for (const v of votes) {
      if (!result.has(v.accommodationId)) {
        result.set(v.accommodationId, { upvotes: 0, downvotes: 0, userVote: null });
      }
      const accVote = result.get(v.accommodationId)!;
      if (v.vote) accVote.upvotes++;
      else accVote.downvotes++;
  
      if (v.userId === userId) {
        accVote.userVote = v.vote;
        accVote.comment = v.comment ?? undefined;
      }
    }
  
    return Array.from(result.entries()).map(([accommodationId, data]) => ({
      accommodationId,
      ...data,
      score: data.upvotes - data.downvotes,
    }));
  }
  
  async getVoters(accommodationId: string, userId: string) {
    this.logger.debug(`Getting voters for accommodation ${accommodationId}`);
    const acc = await this.prisma.accommodation.findUnique({ where: { id: accommodationId } });
    if (!acc) {
      this.logger.warn(`Accommodation ${accommodationId} not found`);
      throw new NotFoundException();
    }
    await this.authorize(acc.projectId, userId);
  
    return this.prisma.accommodationVote.findMany({
      where: { accommodationId },
      select: { userId: true, vote: true, comment: true, votedAt: true },
    });
  }

  async getPhotos(accommodationId: string, userId: string) {
    const acc = await this.prisma.accommodation.findUnique({ where: { id: accommodationId } });
    if (!acc) throw new NotFoundException('Logement introuvable');
    await this.authorize(acc.projectId, userId);
    return this.prisma.photo.findMany({ where: { accommodationId } });
  }

  async getComments(accommodationId: string, userId: string) {
    const acc = await this.prisma.accommodation.findUnique({ where: { id: accommodationId } });
    if (!acc) throw new NotFoundException('Logement introuvable');
    await this.authorize(acc.projectId, userId);
    return this.prisma.comment.findMany({ where: { accommodationId } });
  }

  async filter(projectId: string, query: FilterAccommodationDto, userId: string) {
    this.logger.debug(`Filtering accommodations for project ${projectId}`);
    await this.authorize(projectId, userId);
    const where: any = { projectId };
    if (query.priceMin != null) where.price = { gte: query.priceMin };
    if (query.priceMax != null) where.price = { ...where.price, lte: query.priceMax };
    const orderBy = query.sortBy
      ? { [query.sortBy]: Prisma.SortOrder.desc }
      : { createdAt: Prisma.SortOrder.desc };
    
    this.logger.debug(`Filter criteria: ${JSON.stringify(where)}`);
    return this.prisma.accommodation.findMany({ where, orderBy });
  }
}
