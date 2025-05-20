import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
export declare class StoryController {
    private readonly service;
    constructor(service: StoryService);
    create(userId: string, createStoryDto: CreateStoryDto): Promise<{
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
        views: {
            id: string;
            userId: string;
            storyId: string;
            viewedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        photo: string;
        expiresAt: Date;
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
        views: {
            id: string;
            userId: string;
            storyId: string;
            viewedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        photo: string;
        expiresAt: Date;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        user: {
            followers: {
                id: string;
                createdAt: Date;
                followerId: string;
                followingId: string;
            }[];
        } & {
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
        views: {
            id: string;
            userId: string;
            storyId: string;
            viewedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        photo: string;
        expiresAt: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    view(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        storyId: string;
        viewedAt: Date;
    }>;
    getUserStories(userId: string, currentUserId: string): Promise<({
        views: {
            id: string;
            userId: string;
            storyId: string;
            viewedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        photo: string;
        expiresAt: Date;
    })[]>;
}
