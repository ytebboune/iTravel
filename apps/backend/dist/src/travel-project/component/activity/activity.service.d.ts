import { PrismaService } from '../../../prisma/prisma.service';
import { TravelProject, Activity, ActivityVote } from '@prisma/client';
import { NotificationService } from 'src/core/notifications/notification.service';
import { WebsocketGateway } from 'src/core/websocket/websocket.gateway';
export declare class ActivityService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway);
    authorize(projectId: string, userId: string): Promise<TravelProject>;
    createActivity(projectId: string, userId: string, data: {
        title: string;
        description: string;
        imageUrl?: string;
        suggestedByAI?: boolean;
    }): Promise<Activity>;
    getActivities(projectId: string, userId: string): Promise<Activity[]>;
    getPredefinedActivities(category?: string): Promise<Activity[]>;
    vote(projectId: string, activityId: string, userId: string, vote: boolean, comment?: string): Promise<ActivityVote>;
    deleteVote(projectId: string, activityId: string, userId: string): Promise<ActivityVote>;
    getVoters(activityId: string, userId: string): Promise<{
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
        activityId: string;
    }[]>;
}
