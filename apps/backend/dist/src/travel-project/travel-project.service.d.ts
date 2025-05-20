import { PrismaService } from '../prisma/prisma.service';
import { ProjectUser, Destination, DateSuggestion, Activity, Accommodation, Prisma } from '@prisma/client';
import { CreateTravelProjectDto } from './dto/create-travel-project.dto';
import { UpdateTravelProjectDto } from './dto/update-travel-project.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { AddDestinationDto } from './dto/add-destination.dto';
import { AddDateDto } from './dto/add-date.dto';
import { AddActivityDto } from './dto/add-activity.dto';
type TravelProjectWithBasicRelations = Prisma.TravelProjectGetPayload<{
    include: {
        participants: true;
        accommodations: true;
    };
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
export declare class TravelProjectService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTravelProjectDto, userId: string): Promise<TravelProjectWithBasicRelations>;
    joinByShareCode(shareCode: string, userId: string): Promise<TravelProjectWithBasicRelations>;
    findByShareCode(shareCode: string): Promise<TravelProjectWithAllRelations | null>;
    findAllByUser(userId: string): Promise<TravelProjectWithAllRelations[]>;
    findOneIfAuthorized(id: string, userId: string): Promise<TravelProjectWithAllRelations>;
    update(id: string, dto: UpdateTravelProjectDto, userId: string): Promise<TravelProjectWithBasicRelations>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    addParticipant(id: string, dto: AddParticipantDto, userId: string): Promise<ProjectUser>;
    loadDestinations(projectId: string): Promise<Destination[]>;
    addDestination(id: string, dto: AddDestinationDto, userId: string): Promise<Destination>;
    voteDestination(id: string, destinationId: string, userId: string): Promise<void>;
    loadDates(projectId: string): Promise<DateSuggestion[]>;
    addDate(id: string, dto: AddDateDto, userId: string): Promise<DateSuggestion>;
    voteDate(id: string, dateId: string, userId: string): Promise<void>;
    loadActivities(projectId: string): Promise<Activity[]>;
    addActivity(id: string, dto: AddActivityDto, userId: string): Promise<Activity>;
    loadAccommodations(projectId: string): Promise<Accommodation[]>;
}
export {};
