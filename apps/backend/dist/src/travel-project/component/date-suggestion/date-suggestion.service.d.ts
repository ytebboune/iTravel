import { PrismaService } from '../../../prisma/prisma.service';
import { TravelProject } from '@prisma/client';
import { NotificationService } from 'src/core/notifications/notification.service';
import { WebsocketGateway } from 'src/core/websocket/websocket.gateway';
export declare class DateSuggestionService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway);
    authorize(projectId: string, userId: string): Promise<TravelProject>;
    validateOption(projectId: string, dateId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        isSelected: boolean;
        selectedAt: Date | null;
        addedBy: string;
        startDate: Date;
        endDate: Date;
    }>;
    unvalidateOption(projectId: string, dateId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        isSelected: boolean;
        selectedAt: Date | null;
        addedBy: string;
        startDate: Date;
        endDate: Date;
    }>;
    getValidatedOption(projectId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        isSelected: boolean;
        selectedAt: Date | null;
        addedBy: string;
        startDate: Date;
        endDate: Date;
    }>;
    vote(projectId: string, dateId: string, userId: string, vote: boolean, comment?: string): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        projectId: string;
        comment: string | null;
        userId: string;
        vote: boolean;
        votedAt: Date;
        dateId: string;
    }>;
    deleteVote(projectId: string, dateId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        projectId: string;
        comment: string | null;
        userId: string;
        vote: boolean;
        votedAt: Date;
        dateId: string;
    }>;
    getVoters(dateId: string, userId: string): Promise<{
        comment: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }[]>;
    getVotes(projectId: string, userId: string): Promise<{
        score: number;
        upvotes: number;
        downvotes: number;
        userVote: boolean | null;
        comment?: string;
        dateId: string;
    }[]>;
    createDateSuggestion(projectId: string, userId: string, data: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        isSelected: boolean;
        selectedAt: Date | null;
        addedBy: string;
        startDate: Date;
        endDate: Date;
    }>;
    getDateSuggestions(projectId: string, userId: string): Promise<({
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
        projectId: string;
        isSelected: boolean;
        selectedAt: Date | null;
        addedBy: string;
        startDate: Date;
        endDate: Date;
    })[]>;
}
