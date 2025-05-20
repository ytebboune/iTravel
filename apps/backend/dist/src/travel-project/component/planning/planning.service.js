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
var PlanningService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const shared_1 = require("@itravel/shared");
const notification_service_1 = require("../../../core/notifications/notification.service");
const websocket_gateway_1 = require("../../../core/websocket/websocket.gateway");
let PlanningService = PlanningService_1 = class PlanningService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
        this.logger = new common_1.Logger(PlanningService_1.name);
    }
    async authorize(projectId, userId) {
        const project = await this.prisma.travelProject.findUnique({
            where: { id: projectId },
            include: { participants: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.creatorId !== userId && !project.participants.some(p => p.userId === userId)) {
            throw new common_1.ForbiddenException('User is not a member of this project');
        }
        return project;
    }
    async create(projectId, userId, createPlanningDto) {
        await this.authorize(projectId, userId);
        const planning = await this.prisma.planning.create({
            data: {
                projectId,
                name: createPlanningDto.name,
                description: createPlanningDto.description,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.PLANNING_ACTIVITY_ADDED, {
            projectId,
            userId,
            data: {
                planningId: planning.id,
            },
        });
        this.websocketGateway.server.to(projectId).emit('planning:created', planning);
        return planning;
    }
    async getPlanning(projectId, userId) {
        await this.authorize(projectId, userId);
        return this.prisma.planning.findFirst({
            where: { projectId },
            include: {
                activities: {
                    include: {
                        activity: true,
                    },
                    orderBy: [
                        { date: 'asc' },
                        { startTime: 'asc' },
                    ],
                },
            },
        });
    }
    async checkActivityConflict(projectId, date, startTime, endTime, excludeActivityId) {
        const where = {
            projectId,
            date,
            OR: [
                {
                    AND: [
                        { startTime: { lte: startTime } },
                        { endTime: { gte: startTime } },
                    ],
                },
                {
                    AND: [
                        { startTime: { lte: endTime } },
                        { endTime: { gte: endTime } },
                    ],
                },
                {
                    AND: [
                        { startTime: { gte: startTime } },
                        { endTime: { lte: endTime } },
                    ],
                },
            ],
        };
        if (excludeActivityId) {
            where['id'] = { not: excludeActivityId };
        }
        const conflictingActivity = await this.prisma.planningActivity.findFirst({ where });
        return !!conflictingActivity;
    }
    async addActivityToPlanning(projectId, userId, data) {
        await this.authorize(projectId, userId);
        const date = new Date(data.date);
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);
        const hasConflict = await this.checkActivityConflict(projectId, date, startTime, endTime);
        if (hasConflict) {
            throw new common_1.ConflictException('Cette activité chevauche une autre activité existante');
        }
        const planning = await this.prisma.planning.findFirst({
            where: { projectId },
        });
        if (!planning) {
            throw new common_1.NotFoundException('Planning not found for this project');
        }
        const planningActivity = await this.prisma.planningActivity.create({
            data: {
                project: { connect: { id: projectId } },
                planning: { connect: { id: planning.id } },
                activity: data.activityId ? { connect: { id: data.activityId } } : undefined,
                date,
                startTime,
                endTime,
                notes: data.notes,
            },
            include: {
                activity: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.PLANNING_ACTIVITY_ADDED, {
            projectId,
            userId,
            data: {
                planningActivityId: planningActivity.id,
            },
        });
        this.websocketGateway.server.to(projectId).emit('planning:activity_added', planningActivity);
        return planningActivity;
    }
    async updatePlanningActivity(projectId, activityId, userId, data) {
        await this.authorize(projectId, userId);
        const date = new Date(data.date);
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);
        const hasConflict = await this.checkActivityConflict(projectId, date, startTime, endTime, activityId);
        if (hasConflict) {
            throw new common_1.ConflictException('Cette activité chevauche une autre activité existante');
        }
        const planningActivity = await this.prisma.planningActivity.update({
            where: { id: activityId },
            data: {
                activity: data.activityId ? { connect: { id: data.activityId } } : undefined,
                date,
                startTime,
                endTime,
                notes: data.notes,
            },
            include: {
                activity: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.PLANNING_ACTIVITY_UPDATED, {
            projectId,
            userId,
            data: {
                planningActivityId: planningActivity.id,
            },
        });
        this.websocketGateway.server.to(projectId).emit('planning:activity_updated', planningActivity);
        return planningActivity;
    }
    async removeActivityFromPlanning(projectId, activityId, userId) {
        await this.authorize(projectId, userId);
        const planningActivity = await this.prisma.planningActivity.delete({
            where: { id: activityId },
            include: {
                activity: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.PLANNING_ACTIVITY_REMOVED, {
            projectId,
            userId,
            data: {
                planningActivityId: activityId,
            },
        });
        this.websocketGateway.server.to(projectId).emit('planning:activity_removed', { activityId });
        return planningActivity;
    }
};
exports.PlanningService = PlanningService;
exports.PlanningService = PlanningService = PlanningService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], PlanningService);
//# sourceMappingURL=planning.service.js.map