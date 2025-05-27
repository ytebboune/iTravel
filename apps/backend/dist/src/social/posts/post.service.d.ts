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
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            accommodationId: string | null;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        likes: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
        })[];
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string): Promise<({
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            accommodationId: string | null;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        likes: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
        })[];
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            accommodationId: string | null;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        likes: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
        })[];
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, userId: string, updatePostDto: UpdatePostDto): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            accommodationId: string | null;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        likes: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            postId: string;
        })[];
        comments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                username: string;
                password: string;
                bio: string | null;
                avatar: string | null;
                isPrivate: boolean;
                emailVerified: boolean;
                showEmail: boolean;
                showVisitedPlaces: boolean;
                showPosts: boolean;
                showStories: boolean;
                notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
        })[];
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    like(id: string, userId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        postId: string;
    }>;
    unlike(id: string, userId: string): Promise<{
        message: string;
    }>;
    comment(id: string, userId: string, content: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            password: string;
            bio: string | null;
            avatar: string | null;
            isPrivate: boolean;
            emailVerified: boolean;
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        accommodationId: string | null;
        destinationId: string | null;
    }>;
    deleteComment(id: string, commentId: string, userId: string): Promise<{
        message: string;
    }>;
}
