import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { AddActivityToPlanningDto } from './dto/add-activity-to-planning.dto';
export declare class PlanningController {
    private readonly service;
    constructor(service: PlanningService);
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
    addActivity(projectId: string, userId: string, addActivityDto: AddActivityToPlanningDto): Promise<{
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
    updateActivity(projectId: string, activityId: string, userId: string, updateActivityDto: AddActivityToPlanningDto): Promise<{
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
    deleteActivity(projectId: string, activityId: string, userId: string): Promise<{
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
