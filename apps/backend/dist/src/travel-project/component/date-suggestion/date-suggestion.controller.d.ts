import { DateSuggestionService } from './date-suggestion.service';
import { CreateDateSuggestionDto } from './dto/create-date-suggestion.dto';
import { VoteDto } from '../destination/dto/vote.dto';
export declare class DateSuggestionController {
    private readonly service;
    constructor(service: DateSuggestionService);
    createDateSuggestion(projectId: string, dto: CreateDateSuggestionDto, req: any): Promise<{
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
    getDateSuggestions(projectId: string, req: any): Promise<({
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
    vote(projectId: string, dateSuggestionId: string, dto: VoteDto, req: any): Promise<{
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
    getVoters(projectId: string, dateSuggestionId: string, req: any): Promise<{
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
        dateId: string;
    }[]>;
    validate(projectId: string, dateSuggestionId: string, req: any): Promise<{
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
    unvalidate(projectId: string, dateSuggestionId: string, req: any): Promise<{
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
}
