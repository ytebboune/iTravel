import { PrismaService } from '../../../prisma/prisma.service';
import { TravelProject } from '@prisma/client';
import { UrlValidator } from './utils/url-validator';
import { FilterAccommodationDto } from './dto/filter-accommodation.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Prisma } from '@prisma/client';
import { NotificationService } from 'src/core/notifications/notification.service';
import { WebsocketGateway } from 'src/core/websocket/websocket.gateway';
export declare class AccommodationService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    private readonly urlValidator;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway, urlValidator: UrlValidator);
    authorize(projectId: string, userId: string): Promise<TravelProject>;
    create(projectId: string, userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        type: import(".prisma/client").$Enums.AccommodationType;
        price: Prisma.Decimal;
        link: string | null;
        isSelected: boolean;
        selectedAt: Date | null;
        address: string;
    }>;
    findAll(projectId: string, userId: string): Promise<({
        votes: {
            comment: string;
            userId: string;
            vote: boolean;
            votedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        type: import(".prisma/client").$Enums.AccommodationType;
        price: Prisma.Decimal;
        link: string | null;
        isSelected: boolean;
        selectedAt: Date | null;
        address: string;
    })[]>;
    vote(projectId: string, accommodationId: string, userId: string, vote: boolean, comment?: string): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        projectId: string;
        comment: string | null;
        accommodationId: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }>;
    deleteVote(projectId: string, accommodationId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        projectId: string;
        comment: string | null;
        accommodationId: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }>;
    getVoters(accommodationId: string, userId: string): Promise<{
        comment: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }[]>;
    getVotes(projectId: string, userId: string): Promise<unknown[]>;
    validateOption(projectId: string, accommodationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        type: import(".prisma/client").$Enums.AccommodationType;
        price: Prisma.Decimal;
        link: string | null;
        isSelected: boolean;
        selectedAt: Date | null;
        address: string;
    }>;
    unvalidateOption(projectId: string, accommodationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        type: import(".prisma/client").$Enums.AccommodationType;
        price: Prisma.Decimal;
        link: string | null;
        isSelected: boolean;
        selectedAt: Date | null;
        address: string;
    }>;
    getValidatedOption(projectId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        type: import(".prisma/client").$Enums.AccommodationType;
        price: Prisma.Decimal;
        link: string | null;
        isSelected: boolean;
        selectedAt: Date | null;
        address: string;
    }>;
    filter(projectId: string, query: FilterAccommodationDto, userId: string): Promise<({
        votes: {
            projectId: string;
            comment: string | null;
            accommodationId: string;
            userId: string;
            vote: boolean;
            votedAt: Date;
        }[];
        availability: {
            id: string;
            accommodationId: string;
            end: Date;
            start: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        type: import(".prisma/client").$Enums.AccommodationType;
        price: Prisma.Decimal;
        link: string | null;
        isSelected: boolean;
        selectedAt: Date | null;
        address: string;
    })[]>;
    private checkAvailabilityOverlap;
    checkAvailability(id: string, start: string, end: string, userId: string): Promise<{
        isAvailable: boolean;
        message: string;
    }>;
    addAvailability(id: string, createAvailabilityDto: CreateAvailabilityDto, userId: string): Promise<{
        id: string;
        accommodationId: string;
        end: Date;
        start: Date;
    }>;
    getAvailability(id: string, userId: string): Promise<{
        id: string;
        accommodationId: string;
        end: Date;
        start: Date;
    }[]>;
    addComment(id: string, addCommentDto: AddCommentDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        accommodationId: string | null;
        destinationId: string | null;
        userId: string;
        content: string;
    }>;
    deleteComment(id: string, commentId: string, userId: string): Promise<{
        message: string;
    }>;
    getComments(id: string, userId: string): Promise<({
        user: {
            id: string;
            username: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        accommodationId: string | null;
        destinationId: string | null;
        userId: string;
        content: string;
    })[]>;
    addPhoto(id: string, photoUrl: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        accommodationId: string | null;
        url: string;
        visitedPlaceId: string | null;
        postId: string | null;
    }>;
    deletePhoto(id: string, photoId: string, userId: string): Promise<{
        message: string;
    }>;
    getPhotos(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        accommodationId: string | null;
        url: string;
        visitedPlaceId: string | null;
        postId: string | null;
    }[]>;
    updateAvailability(id: string, availabilityId: string, updateAvailabilityDto: UpdateAvailabilityDto, userId: string): Promise<{
        id: string;
        accommodationId: string;
        end: Date;
        start: Date;
    }>;
    deleteAvailability(id: string, availabilityId: string, userId: string): Promise<{
        message: string;
    }>;
}
