import { TravelProjectService } from './travel-project.service';
import { CreateTravelProjectDto } from './dto/create-travel-project.dto';
import { UpdateTravelProjectDto } from './dto/update-travel-project.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { AddDestinationDto } from './dto/add-destination.dto';
export declare class TravelProjectController {
    private readonly travelProjectService;
    constructor(travelProjectService: TravelProjectService);
    create(dto: CreateTravelProjectDto, req: any): Promise<{
        participants: {
            id: string;
            projectId: string;
            userId: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            joinedAt: Date;
        }[];
        accommodations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            type: import(".prisma/client").$Enums.AccommodationType;
            price: import("@prisma/client/runtime/library").Decimal;
            link: string | null;
            isSelected: boolean;
            selectedAt: Date | null;
            address: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        creatorId: string;
        shareCode: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        currentStep: import(".prisma/client").$Enums.ProjectStep;
    }>;
    findAll(req: any): Promise<({
        participants: {
            id: string;
            projectId: string;
            userId: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            joinedAt: Date;
        }[];
        dateSuggestions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            isSelected: boolean;
            selectedAt: Date | null;
            addedBy: string;
            startDate: Date;
            endDate: Date;
        }[];
        destinations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
        }[];
        activities: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
            imageUrl: string | null;
        }[];
        accommodations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            type: import(".prisma/client").$Enums.AccommodationType;
            price: import("@prisma/client/runtime/library").Decimal;
            link: string | null;
            isSelected: boolean;
            selectedAt: Date | null;
            address: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        creatorId: string;
        shareCode: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        currentStep: import(".prisma/client").$Enums.ProjectStep;
    })[]>;
    findOne(id: string, req: any): Promise<{
        participants: {
            id: string;
            projectId: string;
            userId: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            joinedAt: Date;
        }[];
        dateSuggestions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            isSelected: boolean;
            selectedAt: Date | null;
            addedBy: string;
            startDate: Date;
            endDate: Date;
        }[];
        destinations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
        }[];
        activities: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
            imageUrl: string | null;
        }[];
        accommodations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            type: import(".prisma/client").$Enums.AccommodationType;
            price: import("@prisma/client/runtime/library").Decimal;
            link: string | null;
            isSelected: boolean;
            selectedAt: Date | null;
            address: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        creatorId: string;
        shareCode: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        currentStep: import(".prisma/client").$Enums.ProjectStep;
    }>;
    update(id: string, dto: UpdateTravelProjectDto, req: any): Promise<{
        participants: {
            id: string;
            projectId: string;
            userId: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            joinedAt: Date;
        }[];
        accommodations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            type: import(".prisma/client").$Enums.AccommodationType;
            price: import("@prisma/client/runtime/library").Decimal;
            link: string | null;
            isSelected: boolean;
            selectedAt: Date | null;
            address: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        creatorId: string;
        shareCode: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        currentStep: import(".prisma/client").$Enums.ProjectStep;
    }>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
    addParticipant(projectId: string, dto: AddParticipantDto, req: any): Promise<{
        id: string;
        projectId: string;
        userId: string;
        role: import(".prisma/client").$Enums.ProjectRole;
        joinedAt: Date;
    }>;
    getDestinations(projectId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
    }[]>;
    addDestination(projectId: string, dto: AddDestinationDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectId: string;
        addedBy: string;
        suggestedByAI: boolean;
    }>;
    voteDestination(projectId: string, destId: string, req: any): Promise<void>;
    getProjectByShareCode(shareCode: string): Promise<{
        participants: {
            id: string;
            projectId: string;
            userId: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            joinedAt: Date;
        }[];
        dateSuggestions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            isSelected: boolean;
            selectedAt: Date | null;
            addedBy: string;
            startDate: Date;
            endDate: Date;
        }[];
        destinations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
        }[];
        activities: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            projectId: string;
            addedBy: string;
            suggestedByAI: boolean;
            imageUrl: string | null;
        }[];
        accommodations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            type: import(".prisma/client").$Enums.AccommodationType;
            price: import("@prisma/client/runtime/library").Decimal;
            link: string | null;
            isSelected: boolean;
            selectedAt: Date | null;
            address: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        creatorId: string;
        shareCode: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        currentStep: import(".prisma/client").$Enums.ProjectStep;
    }>;
    joinProject(shareCode: string, req: any): Promise<{
        participants: {
            id: string;
            projectId: string;
            userId: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            joinedAt: Date;
        }[];
        accommodations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            projectId: string;
            type: import(".prisma/client").$Enums.AccommodationType;
            price: import("@prisma/client/runtime/library").Decimal;
            link: string | null;
            isSelected: boolean;
            selectedAt: Date | null;
            address: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        creatorId: string;
        shareCode: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        currentStep: import(".prisma/client").$Enums.ProjectStep;
    }>;
}
