import { ProjectStatus, ProjectStep } from '../enums';
export interface User {
    id: string;
    email: string;
    username: string;
    bio?: string;
    avatar?: string;
    isPrivate: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface TravelProject {
    id: string;
    title: string;
    description?: string;
    creatorId: string;
    shareCode: string;
    status: ProjectStatus;
    currentStep: ProjectStep;
    createdAt: Date;
    updatedAt: Date;
}
