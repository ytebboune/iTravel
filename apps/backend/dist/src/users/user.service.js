"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId, targetUserId) {
        console.log('getProfile called with:', { userId, targetUserId });
        if (!targetUserId) {
            throw new common_1.BadRequestException('targetUserId requis');
        }
        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            include: {
                followers: {
                    select: {
                        followerId: true,
                    },
                },
                following: {
                    select: {
                        followingId: true,
                    },
                },
                visitedPlaces: {
                    include: {
                        country: true,
                        city: true,
                        photos: true,
                    },
                },
                posts: {
                    include: {
                        photos: true,
                        likes: true,
                        comments: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                stories: {
                    where: {
                        expiresAt: { gt: new Date() },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                receivedFollowRequests: {
                    where: {
                        requesterId: userId,
                        status: 'PENDING',
                    },
                },
            },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const isFollowing = targetUser.followers.some(f => f.followerId === userId);
        const hasRequestedFollow = targetUser.receivedFollowRequests.length > 0;
        const canAccessPrivateInfo = userId === targetUserId ||
            !targetUser.isPrivate ||
            isFollowing;
        if (!canAccessPrivateInfo) {
            throw new common_1.ForbiddenException('This profile is private');
        }
        const response = {
            id: targetUser.id,
            username: targetUser.username,
            bio: targetUser.bio,
            avatar: targetUser.avatar,
            isPrivate: targetUser.isPrivate,
            showEmail: targetUser.showEmail,
            showVisitedPlaces: targetUser.showVisitedPlaces,
            showPosts: targetUser.showPosts,
            showStories: targetUser.showStories,
            followersCount: targetUser.followers.length,
            followingCount: targetUser.following.length,
            isFollowing,
            hasRequestedFollow,
        };
        if (targetUser.showEmail && (userId === targetUserId || isFollowing)) {
            response.email = targetUser.email;
        }
        if (targetUser.showVisitedPlaces && (userId === targetUserId || isFollowing)) {
            response.visitedPlaces = targetUser.visitedPlaces;
        }
        if (targetUser.showPosts && (userId === targetUserId || isFollowing)) {
            response.posts = targetUser.posts;
        }
        if (targetUser.showStories && (userId === targetUserId || isFollowing)) {
            response.stories = targetUser.stories;
        }
        return response;
    }
    async getPublicProfile(targetUserId) {
        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            include: {
                followers: {
                    select: {
                        followerId: true,
                    },
                },
                following: {
                    select: {
                        followingId: true,
                    },
                },
            },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: targetUser.id,
            username: targetUser.username,
            bio: targetUser.bio,
            avatar: targetUser.avatar,
            isPrivate: targetUser.isPrivate,
            showEmail: targetUser.showEmail,
            showVisitedPlaces: targetUser.showVisitedPlaces,
            showPosts: targetUser.showPosts,
            showStories: targetUser.showStories,
            followersCount: targetUser.followers.length,
            followingCount: targetUser.following.length,
            isFollowing: false,
            hasRequestedFollow: false,
        };
    }
    async updateProfile(userId, updateUserDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                username: updateUserDto.username,
                bio: updateUserDto.bio,
                avatar: updateUserDto.avatar,
            },
        });
        return user;
    }
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.ForbiddenException('You cannot follow yourself');
        }
        const following = await this.prisma.user.findUnique({
            where: { id: followingId },
        });
        if (!following) {
            throw new common_1.NotFoundException('User to follow not found');
        }
        const follow = await this.prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });
        return follow;
    }
    async unfollowUser(followerId, followingId) {
        const follow = await this.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
        return follow;
    }
    async getFollowers(userId) {
        const followers = await this.prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        bio: true,
                    },
                },
            },
        });
        return followers.map(follow => follow.follower);
    }
    async getFollowing(userId) {
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        bio: true,
                    },
                },
            },
        });
        return following.map(follow => follow.following);
    }
    async getFeed(userId, page = 1, limit = 10) {
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true },
        });
        const followingIds = following.map(f => f.followingId);
        const posts = await this.prisma.post.findMany({
            where: {
                userId: {
                    in: [...followingIds, userId],
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
                photos: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        return posts;
    }
    async requestFollow(requesterId, targetId) {
        if (requesterId === targetId) {
            throw new common_1.BadRequestException('You cannot request to follow yourself');
        }
        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetId },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingRequest = await this.prisma.followRequest.findFirst({
            where: {
                requesterId,
                requestedToId: targetId,
                status: 'PENDING',
            },
        });
        if (existingRequest) {
            throw new common_1.BadRequestException('Follow request already exists');
        }
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: requesterId,
                    followingId: targetId,
                },
            },
        });
        if (existingFollow) {
            throw new common_1.BadRequestException('You are already following this user');
        }
        const followRequest = await this.prisma.followRequest.create({
            data: {
                requesterId,
                requestedToId: targetId,
                status: 'PENDING',
            },
            include: {
                requestedBy: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });
        return {
            ...followRequest,
            requester: followRequest.requestedBy,
        };
    }
    async acceptFollowRequest(userId, requestId) {
        const request = await this.prisma.followRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Follow request not found');
        }
        if (request.requestedToId !== userId) {
            throw new common_1.ForbiddenException('You can only accept follow requests sent to you');
        }
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException('This request has already been processed');
        }
        await this.prisma.followRequest.update({
            where: { id: requestId },
            data: { status: 'ACCEPTED' },
        });
        await this.prisma.follow.create({
            data: {
                followerId: request.requesterId,
                followingId: request.requestedToId,
            },
        });
    }
    async rejectFollowRequest(userId, requestId) {
        const request = await this.prisma.followRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Follow request not found');
        }
        if (request.requestedToId !== userId) {
            throw new common_1.ForbiddenException('You can only reject follow requests sent to you');
        }
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException('This request has already been processed');
        }
        await this.prisma.followRequest.update({
            where: { id: requestId },
            data: { status: 'REJECTED' },
        });
    }
    async getPendingFollowRequests(userId) {
        const requests = await this.prisma.followRequest.findMany({
            where: {
                requestedToId: userId,
                status: 'PENDING',
            },
            include: {
                requestedBy: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return requests.map(request => ({
            ...request,
            requester: request.requestedBy,
        }));
    }
    async getSentFollowRequests(userId) {
        const requests = await this.prisma.followRequest.findMany({
            where: {
                requesterId: userId,
            },
            include: {
                requestedBy: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return requests.map(request => ({
            ...request,
            requester: request.requestedBy,
        }));
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map