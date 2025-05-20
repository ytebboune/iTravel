import { PrismaService } from '../../../prisma/prisma.service';
import { TravelProject } from '@prisma/client';
import { NotificationService } from 'src/core/notifications/notification.service';
import { WebsocketGateway } from 'src/core/websocket/websocket.gateway';
export declare class DestinationService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway);
    authorize(projectId: string, userId: string): Promise<TravelProject>;
    vote(projectId: string, destinationId: string, userId: string, vote: boolean, comment?: string): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        projectId: string;
        comment: string | null;
        destinationId: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }>;
    deleteVote(projectId: string, destinationId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        projectId: string;
        comment: string | null;
        destinationId: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }>;
    validateOption(projectId: string, destinationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
    }>;
    unvalidateOption(projectId: string, destinationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
    }>;
    getValidatedOption(projectId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
    }>;
    addComment(projectId: string, destinationId: string, userId: string, content: string): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        accommodationId: string | null;
        destinationId: string | null;
        userId: string;
        content: string;
    }>;
    getVoters(destinationId: string, userId: string): Promise<{
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
        destinationId: string;
    }[]>;
    getComments(projectId: string, destinationId: string, userId: string): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        accommodationId: string | null;
        destinationId: string | null;
        userId: string;
        content: string;
    })[]>;
}
