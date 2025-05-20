import { ProjectStatus } from '@itravel/shared';
export declare class UpdateTravelProjectDto {
    title?: string;
    description?: string;
    participants?: string[];
    status?: ProjectStatus;
    id?: string;
    creatorId?: string;
    createdAt?: string;
}
