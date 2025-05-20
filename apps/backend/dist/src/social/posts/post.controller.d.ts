import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostController {
    private readonly service;
    constructor(service: PostService);
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
