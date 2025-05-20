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
var ActivityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const shared_1 = require("@itravel/shared");
const notification_service_1 = require("../../../core/notifications/notification.service");
const websocket_gateway_1 = require("../../../core/websocket/websocket.gateway");
let ActivityService = ActivityService_1 = class ActivityService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
        this.logger = new common_1.Logger(ActivityService_1.name);
    }
    async authorize(projectId, userId) {
        const project = await this.prisma.travelProject.findUnique({
            where: { id: projectId },
            include: { participants: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const isMember = project.creatorId === userId ||
            project.participants.some(p => p.userId === userId);
        if (!isMember) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        return project;
    }
    async createActivity(projectId, userId, data) {
        await this.authorize(projectId, userId);
        const activity = await this.prisma.activity.create({
            data: {
                projectId,
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                suggestedByAI: data.suggestedByAI ?? false,
                addedBy: userId,
            },
        });
        this.websocketGateway.server
            .to(`project:${projectId}`)
            .emit('activityCreated', {
            type: 'activity',
            projectId,
            activity,
        });
        await this.notificationService.notify(shared_1.NotificationType.ACTIVITY_CREATED, {
            projectId,
            userId,
            data: {
                message: 'New activity created',
                activityId: activity.id,
            },
        });
        return activity;
    }
    async getActivities(projectId, userId) {
        await this.authorize(projectId, userId);
        return this.prisma.activity.findMany({
            where: { projectId },
            include: {
                votes: {
                    select: {
                        userId: true,
                        vote: true,
                        comment: true,
                        votedAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getPredefinedActivities(category) {
        return this.prisma.activity.findMany({
            where: {
                suggestedByAI: true,
                ...(category && { category }),
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async vote(projectId, activityId, userId, vote, comment) {
        const activity = await this.prisma.activity.findUnique({
            where: { id: activityId },
            include: { project: true },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        await this.authorize(projectId, userId);
        const voteData = await this.prisma.activityVote.upsert({
            where: {
                projectId_activityId_userId: {
                    projectId,
                    activityId,
                    userId,
                },
            },
            update: {
                vote,
                comment,
                votedAt: new Date(),
            },
            create: {
                projectId,
                activityId,
                userId,
                vote,
                comment,
                votedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        this.websocketGateway.server.to(projectId).emit('voteReceived', {
            type: 'activity',
            id: activityId,
            vote: {
                user: voteData.user,
                votedAt: voteData.votedAt,
                vote: voteData.vote,
                comment: voteData.comment ?? undefined,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.ACTIVITY_VOTE, {
            projectId,
            userId,
            data: {
                activityId,
                activity: activity,
                vote,
                comment,
            },
        });
        return voteData;
    }
    async deleteVote(projectId, activityId, userId) {
        const activity = await this.prisma.activity.findUnique({
            where: { id: activityId },
            include: { project: true },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        await this.authorize(activity.projectId, userId);
        const vote = await this.prisma.activityVote.delete({
            where: {
                projectId_activityId_userId: {
                    projectId: activity.projectId,
                    activityId,
                    userId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        this.websocketGateway.server
            .to(`project:${activity.projectId}`)
            .emit('voteDeleted', {
            type: 'activity',
            projectId: activity.projectId,
            activityId,
            vote: {
                id: activityId,
                userId: vote.userId,
                user: vote.user,
                votedAt: vote.votedAt,
                vote: vote.vote,
                comment: vote.comment ?? undefined,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.VOTE_DELETED, {
            projectId: activity.projectId,
            userId,
            data: {
                message: 'Vote removed from activity',
                activityId,
            },
        });
        return vote;
    }
    async getVoters(activityId, userId) {
        const activity = await this.prisma.activity.findUnique({
            where: { id: activityId },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        await this.authorize(activity.projectId, userId);
        return this.prisma.activityVote.findMany({
            where: { activityId },
            select: {
                userId: true,
                votedAt: true,
                vote: true,
                comment: true,
            },
        });
    }
    async getVotes(projectId, userId) {
        await this.authorize(projectId, userId);
        const votes = await this.prisma.activityVote.findMany({
            where: { projectId },
            select: {
                activityId: true,
                userId: true,
                vote: true,
                comment: true,
                votedAt: true,
            },
        });
        const result = new Map();
        for (const v of votes) {
            if (!result.has(v.activityId)) {
                result.set(v.activityId, { upvotes: 0, downvotes: 0, userVote: null });
            }
            const activityVote = result.get(v.activityId);
            if (v.vote)
                activityVote.upvotes++;
            else
                activityVote.downvotes++;
            if (v.userId === userId) {
                activityVote.userVote = v.vote;
                activityVote.comment = v.comment ?? undefined;
            }
        }
        return Array.from(result.entries()).map(([activityId, data]) => ({
            activityId,
            ...data,
            score: data.upvotes - data.downvotes,
        }));
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = ActivityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], ActivityService);
//# sourceMappingURL=activity.service.js.map