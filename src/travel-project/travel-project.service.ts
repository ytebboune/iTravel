import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import {
  TravelProject,
  ProjectUser,
  Destination,
  DateSuggestion,
  Activity,
  Accommodation,
  Prisma,
} from '@prisma/client';

import { CreateTravelProjectDto } from './dto/create-travel-project.dto';
import { UpdateTravelProjectDto } from './dto/update-travel-project.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { AddDestinationDto } from './dto/add-destination.dto';
import { AddDateDto } from './dto/add-date.dto';
import { AddActivityDto } from './dto/add-activity.dto';

type TravelProjectWithBasicRelations = Prisma.TravelProjectGetPayload<{
  include: { participants: true; accommodations: true };
}>;

type TravelProjectWithAllRelations = Prisma.TravelProjectGetPayload<{
  include: {
    participants: true;
    destinations: true;
    dateSuggestions: true;
    activities: true;
    accommodations: true;
  };
}>;

@Injectable()
export class TravelProjectService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crée un projet et ajoute le créateur */
  async create(dto: CreateTravelProjectDto, userId: string): Promise<TravelProjectWithBasicRelations> {
    const shareCode = uuidv4().slice(0, 8);
    return this.prisma.travelProject.create({
      data: {
        title: dto.title,
        description: dto.description,
        creatorId: userId,
        shareCode,
        status: 'DRAFT',
        participants: { create: { userId } },
      },
      include: { participants: true, accommodations: true },
    });
  }

  /** Rejoint un projet via un code de partage */
  async joinByShareCode(shareCode: string, userId: string): Promise<TravelProjectWithBasicRelations> {
    const project = await this.prisma.travelProject.findFirst({
      where: { shareCode },
      include: { participants: true },
    });

    if (!project) {
      throw new NotFoundException('Code de partage invalide');
    }

    // Vérifie si l'utilisateur est déjà participant
    const isAlreadyParticipant = project.participants.some(p => p.userId === userId);
    if (isAlreadyParticipant) {
      throw new ConflictException('Vous êtes déjà participant à ce projet');
    }

    // Ajoute l'utilisateur comme participant
    await this.prisma.projectUser.create({
      data: {
        projectId: project.id,
        userId,
      },
    });

    // On retourne le projet avec toutes les relations attendues
    return this.prisma.travelProject.findUnique({
      where: { id: project.id },
      include: { participants: true, accommodations: true },
    }) as Promise<TravelProjectWithBasicRelations>;
  }

  /** Récupère un projet par son code de partage */
  async findByShareCode(shareCode: string): Promise<TravelProjectWithAllRelations | null> {
    return this.prisma.travelProject.findFirst({
      where: { shareCode },
      include: {
        participants: true,
        destinations: true,
        dateSuggestions: true,
        activities: true,
        accommodations: true,
      },
    });
  }

  /** Récupère tous les projets d'un utilisateur (créateur ou participant) */
  async findAllByUser(userId: string): Promise<TravelProjectWithAllRelations[]> {
    return this.prisma.travelProject.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { participants: { some: { userId } } },
        ],
      },
      include: {
        participants: true,
        destinations: true,
        dateSuggestions: true,
        activities: true,
        accommodations: true,
      },
    });
  }

  /** Récupère un projet (+ relations) et vérifie l'accès */
  async findOneIfAuthorized(
    id: string,
    userId: string,
  ): Promise<TravelProjectWithAllRelations> {
    const project = await this.prisma.travelProject.findUnique({
      where: { id },
      include: {
        participants: true,
        destinations: true,
        dateSuggestions: true,
        activities: true,
        accommodations: true,
      },
    });
    if (!project) throw new NotFoundException('Projet introuvable');

    const isMember =
      project.creatorId === userId ||
      project.participants.some((p) => p.userId === userId);
    if (!isMember) throw new NotFoundException('Accès interdit');

    return project;
  }

  /** Met à jour un projet (title, description, status) */
  async update(
    id: string,
    dto: UpdateTravelProjectDto,
    userId: string,
  ): Promise<TravelProjectWithBasicRelations> {
    await this.findOneIfAuthorized(id, userId);
    return this.prisma.travelProject.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status as any, // cast pour compatibilité Prisma
      },
      include: { participants: true, accommodations: true },
    });
  }

  /** Supprime un projet (seul le créateur) */
  async remove(id: string, userId: string): Promise<{ deleted: boolean }> {
    const project = await this.findOneIfAuthorized(id, userId);
    if (project.creatorId !== userId) {
      throw new ForbiddenException('Seul le créateur peut supprimer');
    }
    await this.prisma.travelProject.delete({ where: { id } });
    return { deleted: true };
  }

  /** Invite un utilisateur existant au projet */
  async addParticipant(
    id: string,
    dto: AddParticipantDto,
    userId: string,
  ): Promise<ProjectUser> {
    await this.findOneIfAuthorized(id, userId);
    const exists = await this.prisma.projectUser.findUnique({
      where: { projectId_userId: { projectId: id, userId: dto.userId } },
    });
    if (exists) throw new ConflictException('Utilisateur déjà participant');
    return this.prisma.projectUser.create({
      data: { projectId: id, userId: dto.userId },
    });
  }

  /** Charge toutes les destinations suggérées */
  async loadDestinations(projectId: string): Promise<Destination[]> {
    return this.prisma.destination.findMany({
      where: { projectId },
    });
  }

  /** Propose une nouvelle destination */
  async addDestination(
    id: string,
    dto: AddDestinationDto,
    userId: string,
  ): Promise<Destination> {
    await this.findOneIfAuthorized(id, userId);
    return this.prisma.destination.create({
      data: {
        projectId: id,
        name: dto.name,
        addedBy: userId,
        suggestedByAI: dto.suggestedByAI ?? false,
      },
    });
  }

  /** Vote pour une destination */
  async voteDestination(
    id: string,
    destinationId: string,
    userId: string,
  ): Promise<void> {
    await this.findOneIfAuthorized(id, userId);
    await this.prisma.destinationVote.create({
      data: { projectId: id, destinationId, userId },
    });
  }

  /** Charge toutes les dates suggérées */
  async loadDates(projectId: string): Promise<DateSuggestion[]> {
    return this.prisma.dateSuggestion.findMany({
      where: { projectId },
    });
  }

  /** Propose une nouvelle plage de dates */
  async addDate(
    id: string,
    dto: AddDateDto,
    userId: string,
  ): Promise<DateSuggestion> {
    await this.findOneIfAuthorized(id, userId);
    return this.prisma.dateSuggestion.create({
      data: {
        projectId: id,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        addedBy: userId,
      },
    });
  }

  /** Vote pour une plage de dates */
  async voteDate(
    id: string,
    dateId: string,
    userId: string,
  ): Promise<void> {
    await this.findOneIfAuthorized(id, userId);
    await this.prisma.dateVote.create({
      data: { projectId: id, dateId, userId },
    });
  }

  /** Charge toutes les activités proposées */
  async loadActivities(projectId: string): Promise<Activity[]> {
    return this.prisma.activity.findMany({
      where: { projectId },
    });
  }

  /** Propose une activité (manuelle ou IA) */
  async addActivity(
    id: string,
    dto: AddActivityDto,
    userId: string,
  ): Promise<Activity> {
    await this.findOneIfAuthorized(id, userId);
    return this.prisma.activity.create({
      data: {
        projectId: id,
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        addedBy: userId,
        suggestedByAI: dto.suggestedByAI ?? false,
      },
    });
  }

  /** Charge tous les hébergements d'un projet */
  async loadAccommodations(projectId: string): Promise<Accommodation[]> {
    return this.prisma.accommodation.findMany({
      where: { projectId },
    });
  }
}
