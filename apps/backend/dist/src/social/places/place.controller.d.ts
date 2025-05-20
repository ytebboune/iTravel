import { PlaceService } from './place.service';
import { CreateVisitedPlaceDto } from './dto/create-visited-place.dto';
import { UpdateVisitedPlaceDto } from './dto/update-visited-place.dto';
export declare class PlaceController {
    private readonly service;
    constructor(service: PlaceService);
    create(userId: string, createVisitedPlaceDto: CreateVisitedPlaceDto): Promise<{
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
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        country: {
            id: string;
            name: string;
            code: string;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            countryId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        countryId: string;
        cityId: string | null;
        rating: number | null;
        review: string | null;
        visitedAt: Date;
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
        country: {
            id: string;
            name: string;
            code: string;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            countryId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        countryId: string;
        cityId: string | null;
        rating: number | null;
        review: string | null;
        visitedAt: Date;
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
        country: {
            id: string;
            name: string;
            code: string;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            countryId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        countryId: string;
        cityId: string | null;
        rating: number | null;
        review: string | null;
        visitedAt: Date;
    }>;
    update(id: string, userId: string, updateVisitedPlaceDto: UpdateVisitedPlaceDto): Promise<{
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
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        country: {
            id: string;
            name: string;
            code: string;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            countryId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        countryId: string;
        cityId: string | null;
        rating: number | null;
        review: string | null;
        visitedAt: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    search(query: string, userId: string): Promise<({
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
        country: {
            id: string;
            name: string;
            code: string;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            countryId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        countryId: string;
        cityId: string | null;
        rating: number | null;
        review: string | null;
        visitedAt: Date;
    })[]>;
}
