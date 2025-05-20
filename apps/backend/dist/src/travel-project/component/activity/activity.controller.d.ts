import { ActivityService } from './activity.service';
import { VoteDto } from '../destination/dto/vote.dto';
export declare class ActivityController {
    private readonly service;
    constructor(service: ActivityService);
    createActivity(projectId: string, data: {
        title: string;
        description: string;
        imageUrl?: string;
        suggestedByAI?: boolean;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
        imageUrl: string | null;
    }>;
    getActivities(projectId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
        imageUrl: string | null;
    }[]>;
    getPredefinedActivities(category?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
        imageUrl: string | null;
    }[]>;
    vote(projectId: string, activityId: string, dto: VoteDto, req: any): Promise<{
        updatedAt: Date;
        projectId: string;
        comment: string | null;
        userId: string;
        vote: boolean;
        votedAt: Date;
        activityId: string;
    }>;
    deleteVote(projectId: string, activityId: string, req: any): Promise<{
        updatedAt: Date;
        projectId: string;
        comment: string | null;
        userId: string;
        vote: boolean;
        votedAt: Date;
        activityId: string;
    }>;
    getVoters(projectId: string, activityId: string, req: any): Promise<{
        comment: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }[]>;
    getVotes(projectId: string, req: any): Promise<{
        score: number;
        upvotes: number;
        downvotes: number;
        userVote: boolean | null;
        comment?: string;
        activityId: string;
    }[]>;
}
