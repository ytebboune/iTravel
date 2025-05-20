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
var DateSuggestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateSuggestionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const shared_1 = require("@itravel/shared");
const notification_service_1 = require("../../../core/notifications/notification.service");
const websocket_gateway_1 = require("../../../core/websocket/websocket.gateway");
let DateSuggestionService = DateSuggestionService_1 = class DateSuggestionService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
        this.logger = new common_1.Logger(DateSuggestionService_1.name);
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
    async validateOption(projectId, dateId, userId) {
        const project = await this.authorize(projectId, userId);
        if (project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can validate options');
        }
        await this.prisma.dateSuggestion.updateMany({
            where: {
                projectId,
                isSelected: true
            },
            data: {
                isSelected: false,
                selectedAt: null
            },
        });
        const dateSuggestion = await this.prisma.dateSuggestion.update({
            where: { id: dateId },
            data: {
                isSelected: true,
                selectedAt: new Date(),
            },
        });
        const selectionEvent = {
            type: 'date',
            projectId,
            dateId,
            selection: {
                id: dateSuggestion.id,
                isSelected: true,
                selectedBy: userId,
                selectedAt: dateSuggestion.selectedAt,
            },
        };
        this.websocketGateway.server
            .to(`project:${projectId}`)
            .emit('selectionReceived', selectionEvent);
        await this.notificationService.notify(shared_1.NotificationType.DATE_VOTE, {
            projectId,
            userId,
            data: {
                message: 'Date selected',
                dateId,
            },
        });
        return dateSuggestion;
    }
    async unvalidateOption(projectId, dateId, userId) {
        const project = await this.authorize(projectId, userId);
        if (project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can unvalidate options');
        }
        const dateSuggestion = await this.prisma.dateSuggestion.update({
            where: { id: dateId },
            data: {
                isSelected: false,
                selectedAt: null,
            },
        });
        const selectionEvent = {
            type: 'date',
            projectId,
            dateId,
            selection: {
                id: dateSuggestion.id,
                isSelected: false,
                selectedBy: userId,
                selectedAt: new Date(),
            },
        };
        this.websocketGateway.server
            .to(`project:${projectId}`)
            .emit('selectionRemoved', selectionEvent);
        await this.notificationService.notify(shared_1.NotificationType.DATE_VOTE, {
            projectId,
            userId,
            data: {
                message: 'Date unselected',
                dateId,
            },
        });
        return dateSuggestion;
    }
    async getValidatedOption(projectId) {
        return this.prisma.dateSuggestion.findFirst({
            where: {
                projectId,
                isSelected: true,
            },
        });
    }
    async vote(projectId, dateId, userId, vote, comment) {
        const dateSuggestion = await this.prisma.dateSuggestion.findUnique({
            where: { id: dateId },
            include: { project: true },
        });
        if (!dateSuggestion) {
            throw new common_1.NotFoundException('Date suggestion not found');
        }
        await this.authorize(projectId, userId);
        const voteData = await this.prisma.dateVote.upsert({
            where: {
                projectId_dateId_userId: {
                    projectId,
                    dateId,
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
                dateId,
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
            type: 'date',
            id: dateId,
            vote: {
                user: voteData.user,
                votedAt: voteData.votedAt,
                vote: voteData.vote,
                comment: voteData.comment ?? undefined,
            },
        });
        this.notificationService.notify(shared_1.NotificationType.DATE_VOTE, {
            projectId,
            userId,
            data: {
                dateId,
                dateSuggestion: dateSuggestion,
                vote,
                comment,
            },
        });
        return voteData;
    }
    async deleteVote(projectId, dateId, userId) {
        const dateSuggestion = await this.prisma.dateSuggestion.findUnique({
            where: { id: dateId },
            include: { project: true },
        });
        if (!dateSuggestion) {
            throw new common_1.NotFoundException('Date suggestion not found');
        }
        await this.authorize(dateSuggestion.projectId, userId);
        const vote = await this.prisma.dateVote.delete({
            where: {
                projectId_dateId_userId: {
                    projectId: dateSuggestion.projectId,
                    dateId,
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
            type: 'date',
            projectId: dateSuggestion.projectId,
            dateId,
            vote: {
                id: dateId,
                userId: vote.userId,
                user: vote.user,
                votedAt: vote.votedAt,
                vote: vote.vote,
                comment: vote.comment ?? undefined,
            },
        };
        this.websocketGateway.server
            .to(`project:${dateSuggestion.projectId}`)
            .emit('voteDeleted', voteEvent);
        await this.notificationService.notify(shared_1.NotificationType.VOTE_DELETED, {
            projectId: dateSuggestion.projectId,
            userId,
            data: {
                message: 'Vote removed from date suggestion',
                dateId,
            },
        });
        return vote;
    }
    async getVoters(dateId, userId) {
        const dateSuggestion = await this.prisma.dateSuggestion.findUnique({
            where: { id: dateId },
        });
        if (!dateSuggestion) {
            throw new common_1.NotFoundException('Date suggestion not found');
        }
        await this.authorize(dateSuggestion.projectId, userId);
        return this.prisma.dateVote.findMany({
            where: { dateId },
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
        const votes = await this.prisma.dateVote.findMany({
            where: { projectId },
            select: {
                dateId: true,
                userId: true,
                vote: true,
                comment: true,
                votedAt: true,
            },
        });
        const result = new Map();
        for (const v of votes) {
            if (!result.has(v.dateId)) {
                result.set(v.dateId, { upvotes: 0, downvotes: 0, userVote: null });
            }
            const dateVote = result.get(v.dateId);
            if (v.vote)
                dateVote.upvotes++;
            else
                dateVote.downvotes++;
            if (v.userId === userId) {
                dateVote.userVote = v.vote;
                dateVote.comment = v.comment ?? undefined;
            }
        }
        return Array.from(result.entries()).map(([dateId, data]) => ({
            dateId,
            ...data,
            score: data.upvotes - data.downvotes,
        }));
    }
    async createDateSuggestion(projectId, userId, data) {
        await this.authorize(projectId, userId);
        const dateSuggestion = await this.prisma.dateSuggestion.create({
            data: {
                projectId,
                startDate: data.startDate,
                endDate: data.endDate,
                addedBy: userId,
            },
        });
        this.websocketGateway.server
            .to(`project:${projectId}`)
            .emit('dateSuggestionCreated', {
            type: 'date',
            projectId,
            dateSuggestion,
        });
        await this.notificationService.notify(shared_1.NotificationType.DATE_VOTE, {
            projectId,
            userId,
            data: {
                message: 'New date suggestion created',
                dateId: dateSuggestion.id,
            },
        });
        return dateSuggestion;
    }
    async getDateSuggestions(projectId, userId) {
        await this.authorize(projectId, userId);
        return this.prisma.dateSuggestion.findMany({
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
};
exports.DateSuggestionService = DateSuggestionService;
exports.DateSuggestionService = DateSuggestionService = DateSuggestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], DateSuggestionService);
//# sourceMappingURL=date-suggestion.service.js.map