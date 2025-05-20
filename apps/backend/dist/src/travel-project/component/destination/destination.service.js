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
var DestinationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const shared_1 = require("@itravel/shared");
const notification_service_1 = require("../../../core/notifications/notification.service");
const websocket_gateway_1 = require("../../../core/websocket/websocket.gateway");
let DestinationService = DestinationService_1 = class DestinationService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
        this.logger = new common_1.Logger(DestinationService_1.name);
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
    async vote(projectId, destinationId, userId, vote, comment) {
        const destination = await this.prisma.destination.findUnique({
            where: { id: destinationId },
            include: { project: true },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        await this.authorize(projectId, userId);
        const voteData = await this.prisma.destinationVote.upsert({
            where: {
                projectId_destinationId_userId: {
                    projectId,
                    destinationId,
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
                destinationId,
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
            type: 'destination',
            id: destinationId,
            vote: {
                user: voteData.user,
                votedAt: voteData.votedAt,
                vote: voteData.vote,
                comment: voteData.comment ?? undefined,
            },
        });
        this.notificationService.notify(shared_1.NotificationType.DESTINATION_VOTE, {
            projectId,
            userId,
            data: {
                destinationId,
                destination: destination,
                vote,
                comment,
            },
        });
        return voteData;
    }
    async deleteVote(projectId, destinationId, userId) {
        const destination = await this.prisma.destination.findUnique({
            where: { id: destinationId },
            include: { project: true },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        await this.authorize(destination.projectId, userId);
        const vote = await this.prisma.destinationVote.delete({
            where: {
                projectId_destinationId_userId: {
                    projectId: destination.projectId,
                    destinationId,
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
        const voteEvent = {
            type: 'destination',
            projectId: destination.projectId,
            destinationId,
            vote: {
                id: destinationId,
                userId: vote.userId,
                user: vote.user,
                votedAt: vote.votedAt,
                vote: vote.vote,
                comment: vote.comment ?? undefined,
            },
        };
        this.websocketGateway.server
            .to(`project:${destination.projectId}`)
            .emit('voteDeleted', voteEvent);
        await this.notificationService.notify(shared_1.NotificationType.VOTE_DELETED, {
            projectId: destination.projectId,
            userId,
            data: {
                message: 'Vote removed from destination',
                destinationId,
            },
        });
        return vote;
    }
    async validateOption(projectId, destinationId, userId) {
        const project = await this.authorize(projectId, userId);
        if (project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can validate options');
        }
        const destination = await this.prisma.destination.update({
            where: {
                id: destinationId,
            },
            data: {},
        });
        const selectionEvent = {
            type: 'destination',
            projectId,
            destinationId,
            selection: {
                id: destination.id,
                isSelected: true,
                selectedBy: userId,
                selectedAt: new Date(),
            },
        };
        this.websocketGateway.server
            .to(`project:${projectId}`)
            .emit('selectionReceived', selectionEvent);
        await this.notificationService.notify(shared_1.NotificationType.DESTINATION_SELECTED, {
            projectId,
            userId,
            data: {
                message: 'Destination selected',
                destinationId,
            },
        });
        return destination;
    }
    async unvalidateOption(projectId, destinationId, userId) {
        const project = await this.authorize(projectId, userId);
        if (project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can unvalidate options');
        }
        const destination = await this.prisma.destination.update({
            where: { id: destinationId },
            data: {},
        });
        const selectionEvent = {
            type: 'destination',
            projectId,
            destinationId,
            selection: {
                id: destination.id,
                isSelected: false,
                selectedBy: userId,
                selectedAt: new Date(),
            },
        };
        this.websocketGateway.server
            .to(`project:${projectId}`)
            .emit('selectionRemoved', selectionEvent);
        await this.notificationService.notify(shared_1.NotificationType.DESTINATION_UNSELECTED, {
            projectId,
            userId,
            data: {
                message: 'Destination unselected',
                destinationId,
            },
        });
        return destination;
    }
    async getValidatedOption(projectId) {
        return this.prisma.destination.findFirst({
            where: {
                projectId,
            },
        });
    }
    async addComment(projectId, destinationId, userId, content) {
        const destination = await this.prisma.destination.findUnique({
            where: { id: destinationId },
            include: { project: true },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        await this.authorize(destination.projectId, userId);
        const comment = await this.prisma.comment.create({
            data: {
                content,
                userId,
                destinationId,
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
        const commentEvent = {
            type: 'destination',
            projectId: destination.projectId,
            destinationId,
            comment: {
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                user: comment.user,
                createdAt: comment.createdAt,
            },
        };
        this.websocketGateway.server
            .to(`project:${destination.projectId}`)
            .emit('commentReceived', commentEvent);
        await this.notificationService.notify(shared_1.NotificationType.COMMENT_ADDED, {
            projectId: destination.projectId,
            userId,
            data: {
                message: 'New comment on destination',
                destinationId,
                commentId: comment.id,
            },
        });
        return comment;
    }
    async getVoters(destinationId, userId) {
        const destination = await this.prisma.destination.findUnique({
            where: { id: destinationId },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        await this.authorize(destination.projectId, userId);
        return this.prisma.destinationVote.findMany({
            where: { destinationId },
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
        const votes = await this.prisma.destinationVote.findMany({
            where: { projectId },
            select: {
                destinationId: true,
                userId: true,
                vote: true,
                comment: true,
                votedAt: true,
            },
        });
        const result = new Map();
        for (const v of votes) {
            if (!result.has(v.destinationId)) {
                result.set(v.destinationId, { upvotes: 0, downvotes: 0, userVote: null });
            }
            const destinationVote = result.get(v.destinationId);
            if (v.vote)
                destinationVote.upvotes++;
            else
                destinationVote.downvotes++;
            if (v.userId === userId) {
                destinationVote.userVote = v.vote;
                destinationVote.comment = v.comment ?? undefined;
            }
        }
        return Array.from(result.entries()).map(([destinationId, data]) => ({
            destinationId,
            ...data,
            score: data.upvotes - data.downvotes,
        }));
    }
    async getComments(projectId, destinationId, userId) {
        const destination = await this.prisma.destination.findUnique({
            where: { id: destinationId },
            include: { project: true },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        await this.authorize(destination.projectId, userId);
        return this.prisma.comment.findMany({
            where: { destinationId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.DestinationService = DestinationService;
exports.DestinationService = DestinationService = DestinationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], DestinationService);
//# sourceMappingURL=destination.service.js.map