import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { WebsocketGateway } from '../../core/websocket/websocket.gateway';
import { CreateVisitedPlaceDto } from './dto/create-visited-place.dto';
import { UpdateVisitedPlaceDto } from './dto/update-visited-place.dto';
import { Prisma } from '@prisma/client';
export declare class PlaceService {
    private readonly prisma;
    private readonly notificationService;
    private readonly websocketGateway;
    constructor(prisma: PrismaService, notificationService: NotificationService, websocketGateway: WebsocketGateway);
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
            notificationSettings: Prisma.JsonValue;
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
            phoneCode: string | null;
            currency: string | null;
            currencySymbol: string | null;
            latitude: number | null;
            longitude: number | null;
            emoji: string | null;
            emojiU: string | null;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
            notificationSettings: Prisma.JsonValue;
        };
        country: {
            id: string;
            name: string;
            code: string;
            phoneCode: string | null;
            currency: string | null;
            currencySymbol: string | null;
            latitude: number | null;
            longitude: number | null;
            emoji: string | null;
            emojiU: string | null;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
            notificationSettings: Prisma.JsonValue;
        };
        country: {
            id: string;
            name: string;
            code: string;
            phoneCode: string | null;
            currency: string | null;
            currencySymbol: string | null;
            latitude: number | null;
            longitude: number | null;
            emoji: string | null;
            emojiU: string | null;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
            notificationSettings: Prisma.JsonValue;
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
            phoneCode: string | null;
            currency: string | null;
            currencySymbol: string | null;
            latitude: number | null;
            longitude: number | null;
            emoji: string | null;
            emojiU: string | null;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
            notificationSettings: Prisma.JsonValue;
        };
        country: {
            id: string;
            name: string;
            code: string;
            phoneCode: string | null;
            currency: string | null;
            currencySymbol: string | null;
            latitude: number | null;
            longitude: number | null;
            emoji: string | null;
            emojiU: string | null;
            flag: string | null;
        };
        city: {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
    markPlaceAsVisited(userId: string, createVisitedPlaceDto: CreateVisitedPlaceDto): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        city: {
            country: {
                id: string;
                name: string;
                code: string;
                phoneCode: string | null;
                currency: string | null;
                currencySymbol: string | null;
                latitude: number | null;
                longitude: number | null;
                emoji: string | null;
                emojiU: string | null;
                flag: string | null;
            };
        } & {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
    updateVisitedPlace(userId: string, placeId: string, updateVisitedPlaceDto: UpdateVisitedPlaceDto): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        city: {
            country: {
                id: string;
                name: string;
                code: string;
                phoneCode: string | null;
                currency: string | null;
                currencySymbol: string | null;
                latitude: number | null;
                longitude: number | null;
                emoji: string | null;
                emojiU: string | null;
                flag: string | null;
            };
        } & {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
    deleteVisitedPlace(userId: string, placeId: string): Promise<{
        message: string;
    }>;
    getUserVisitedPlaces(userId: string): Promise<({
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        city: {
            country: {
                id: string;
                name: string;
                code: string;
                phoneCode: string | null;
                currency: string | null;
                currencySymbol: string | null;
                latitude: number | null;
                longitude: number | null;
                emoji: string | null;
                emojiU: string | null;
                flag: string | null;
            };
        } & {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
    getCityVisitors(cityId: string): Promise<({
        user: {
            id: string;
            username: string;
            avatar: string;
        };
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
        countryId: string;
        cityId: string | null;
        rating: number | null;
        review: string | null;
        visitedAt: Date;
    })[]>;
    getCountryVisitors(countryId: string): Promise<({
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        photos: {
            id: string;
            createdAt: Date;
            accommodationId: string | null;
            url: string;
            visitedPlaceId: string | null;
            postId: string | null;
        }[];
        city: {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
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
    getPopularPlaces(limit?: number): Promise<{
        city: {
            country: {
                id: string;
                name: string;
                code: string;
                phoneCode: string | null;
                currency: string | null;
                currencySymbol: string | null;
                latitude: number | null;
                longitude: number | null;
                emoji: string | null;
                emojiU: string | null;
                flag: string | null;
            };
        } & {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
            countryId: string;
        };
        visitorCount: number;
        averageRating: number;
    }[]>;
}
