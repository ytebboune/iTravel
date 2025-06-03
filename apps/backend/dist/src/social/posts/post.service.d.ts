import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { WebsocketGateway } from '../../core/websocket/websocket.gateway';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway);
    create(userId: string, createPostDto: CreatePostDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
        likes: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            postId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        cityId: string | null;
    }>;
    findAll(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
        likes: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            postId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        cityId: string | null;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
        likes: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            postId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        cityId: string | null;
    }>;
    update(id: string, userId: string, updatePostDto: UpdatePostDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
        likes: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            postId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        cityId: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    like(id: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        postId: string;
    }>;
    unlike(id: string, userId: string): Promise<{
        message: string;
    }>;
    comment(id: string, userId: string, content: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        createdAt: Date;
        accommodationId: string | null;
        destinationId: string | null;
        userId: string;
        content: string;
    }>;
    deleteComment(id: string, commentId: string, userId: string): Promise<{
        message: string;
    }>;
}
