import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../core/notifications/notification.service';
import { WebsocketGateway } from '../core/websocket/websocket.gateway';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
export declare class SettingsService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway);
    getSettings(userId: string): Promise<{
        privacy: {
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
        };
        notifications: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    updatePrivacy(userId: string, updatePrivacyDto: UpdatePrivacyDto): Promise<{
        showEmail: boolean;
        showVisitedPlaces: boolean;
        showPosts: boolean;
        showStories: boolean;
    }>;
    updateNotificationSettings(userId: string, settings: any): Promise<import("@prisma/client/runtime/library").JsonValue>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    getPrivacySettings(userId: string): Promise<{
        showEmail: boolean;
        showVisitedPlaces: boolean;
        showPosts: boolean;
        showStories: boolean;
        followers: {
            id: string;
            username: string;
            avatar: string;
        }[];
        following: {
            id: string;
            username: string;
            avatar: string;
        }[];
    }>;
    requestFollow(requesterId: string, requestedToId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        requesterId: string;
        requestedToId: string;
    } | {
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    }>;
    handleFollowRequest(userId: string, requestId: string, accept: boolean): Promise<{
        message: string;
    }>;
    getFollowRequests(userId: string): Promise<({
        requestedBy: {
            id: string;
            username: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        requesterId: string;
        requestedToId: string;
    })[]>;
}
