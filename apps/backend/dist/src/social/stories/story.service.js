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
exports.StoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notification_service_1 = require("../../core/notifications/notification.service");
const shared_1 = require("@itravel/shared");
const websocket_gateway_1 = require("../../core/websocket/websocket.gateway");
let StoryService = class StoryService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
    }
    async create(userId, createStoryDto) {
        const { content, photo } = createStoryDto;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const story = await this.prisma.story.create({
            data: {
                content,
                photo,
                expiresAt,
                user: { connect: { id: userId } },
            },
            include: {
                user: true,
                views: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.STORY_CREATED, {
            userId,
            data: {
                storyId: story.id,
            },
        });
        this.websocketGateway.server.to(userId).emit('story:created', story);
        return story;
    }
    async findAll(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                following: {
                    include: {
                        following: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const followingIds = user.following.map(f => f.followingId);
        followingIds.push(userId);
        const stories = await this.prisma.story.findMany({
            where: {
                userId: { in: followingIds },
                expiresAt: { gt: new Date() },
            },
            include: {
                user: true,
                views: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return stories;
    }
    async findOne(id, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        followers: true,
                    },
                },
                views: true,
            },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.userId !== userId && !story.user.followers.some(f => f.followerId === userId)) {
            throw new common_1.ForbiddenException('You can only view stories from users you follow');
        }
        return story;
    }
    async remove(id, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own stories');
        }
        await this.prisma.story.delete({
            where: { id },
        });
        this.websocketGateway.server.to(userId).emit('story:deleted', { id });
        return { message: 'Story deleted successfully' };
    }
    async view(id, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        followers: true,
                    },
                },
                views: true,
            },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.userId !== userId && !story.user.followers.some(f => f.followerId === userId)) {
            throw new common_1.ForbiddenException('You can only view stories from users you follow');
        }
        const existingView = await this.prisma.storyView.findUnique({
            where: {
                userId_storyId: {
                    userId,
                    storyId: id,
                },
            },
        });
        if (!existingView) {
            const view = await this.prisma.storyView.create({
                data: {
                    user: { connect: { id: userId } },
                    story: { connect: { id } },
                },
            });
            if (story.userId !== userId) {
                await this.notificationService.notify(shared_1.NotificationType.STORY_VIEWED, {
                    userId: story.userId,
                    data: {
                        storyId: id,
                        viewedBy: userId,
                    },
                });
            }
            this.websocketGateway.server.to(story.userId).emit('story:viewed', {
                storyId: id,
                userId,
            });
            return view;
        }
        return existingView;
    }
    async getUserStories(userId) {
        const stories = await this.prisma.story.findMany({
            where: {
                userId,
                expiresAt: { gt: new Date() },
            },
            include: {
                views: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return stories;
    }
};
exports.StoryService = StoryService;
exports.StoryService = StoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], StoryService);
//# sourceMappingURL=story.service.js.map