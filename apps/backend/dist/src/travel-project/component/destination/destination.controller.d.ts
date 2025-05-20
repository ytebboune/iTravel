import { DestinationService } from './destination.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { VoteDto } from './dto/vote.dto';
export declare class DestinationController {
    private readonly service;
    constructor(service: DestinationService);
    addComment(projectId: string, destinationId: string, dto: AddCommentDto, req: any): Promise<{
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
    getComments(projectId: string, destinationId: string, req: any): Promise<({
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
    vote(projectId: string, destinationId: string, dto: VoteDto, req: any): Promise<{
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
    getVotes(projectId: string, destinationId: string, req: any): Promise<{
        comment: string;
        userId: string;
        vote: boolean;
        votedAt: Date;
    }[]>;
    validate(projectId: string, destinationId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
    }>;
    unvalidate(projectId: string, destinationId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
    }>;
}
