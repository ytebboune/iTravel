import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetProfileDto } from './dto/get-profile.dto';
import { FollowRequestDto } from './dto/follow-request.dto';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string, targetUserId: string): Promise<GetProfileDto>;
    getPublicProfile(targetUserId: string): Promise<GetProfileDto>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{
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
    }>;
    followUser(followerId: string, followingId: string): Promise<{
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    }>;
    unfollowUser(followerId: string, followingId: string): Promise<{
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    }>;
    getFollowers(userId: string): Promise<{
        id: string;
        username: string;
        bio: string;
        avatar: string;
    }[]>;
    getFollowing(userId: string): Promise<{
        id: string;
        username: string;
        bio: string;
        avatar: string;
    }[]>;
    getFeed(userId: string, page?: number, limit?: number): Promise<({
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        _count: {
            likes: number;
            comments: number;
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
        content: string;
    })[]>;
    requestFollow(requesterId: string, targetId: string): Promise<FollowRequestDto>;
    acceptFollowRequest(userId: string, requestId: string): Promise<void>;
    rejectFollowRequest(userId: string, requestId: string): Promise<void>;
    getPendingFollowRequests(userId: string): Promise<FollowRequestDto[]>;
    getSentFollowRequests(userId: string): Promise<FollowRequestDto[]>;
}
