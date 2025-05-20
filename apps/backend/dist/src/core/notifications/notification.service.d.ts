import { NotificationType } from '@itravel/shared';
export declare class NotificationService {
    private readonly logger;
    notify(type: NotificationType, data: any): Promise<void>;
    notifyProjectCreated(projectId: string, creatorId: string): Promise<void>;
    notifyParticipantAdded(projectId: string, userId: string): Promise<void>;
    notifyVoteAdded(projectId: string, userId: string, itemId: string): Promise<void>;
}
