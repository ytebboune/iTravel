import { PrismaService } from '../../../prisma/prisma.service';
import { TravelProject } from '@prisma/client';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { AddActivityToPlanningDto } from './dto/add-activity-to-planning.dto';
import { NotificationService } from 'src/core/notifications/notification.service';
import { WebsocketGateway } from 'src/core/websocket/websocket.gateway';
export declare class PlanningService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway);
    authorize(projectId: string, userId: string): Promise<TravelProject>;
    create(projectId: string, userId: string, createPlanningDto: CreatePlanningDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        description: string | null;
        projectId: string;
    }>;
    getPlanning(projectId: string, userId: string): Promise<{
        activities: ({
            activity: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                projectId: string;
                addedBy: string;
                suggestedByAI: boolean;
                imageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            date: Date;
            activityId: string | null;
            planningId: string;
            startTime: Date;
            endTime: Date;
            notes: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        description: string | null;
        projectId: string;
    }>;
    private checkActivityConflict;
    addActivityToPlanning(projectId: string, userId: string, data: AddActivityToPlanningDto): Promise<{
        activity: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        date: Date;
        activityId: string | null;
        planningId: string;
        startTime: Date;
        endTime: Date;
        notes: string | null;
    }>;
    updatePlanningActivity(projectId: string, activityId: string, userId: string, data: AddActivityToPlanningDto): Promise<{
        activity: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        date: Date;
        activityId: string | null;
        planningId: string;
        startTime: Date;
        endTime: Date;
        notes: string | null;
    }>;
    removeActivityFromPlanning(projectId: string, activityId: string, userId: string): Promise<{
        activity: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        date: Date;
        activityId: string | null;
        planningId: string;
        startTime: Date;
        endTime: Date;
        notes: string | null;
    }>;
}
