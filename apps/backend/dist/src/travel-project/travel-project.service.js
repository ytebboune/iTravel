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
exports.TravelProjectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let TravelProjectService = class TravelProjectService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const shareCode = (0, uuid_1.v4)().slice(0, 8);
        return this.prisma.travelProject.create({
            data: {
                title: dto.title,
                description: dto.description,
                creatorId: userId,
                shareCode,
                status: 'DRAFT',
                participants: { create: { userId } },
            },
            include: { participants: true, accommodations: true },
        });
    }
    async joinByShareCode(shareCode, userId) {
        const project = await this.prisma.travelProject.findFirst({
            where: { shareCode },
            include: { participants: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Code de partage invalide');
        }
        const isAlreadyParticipant = project.participants.some(p => p.userId === userId);
        if (isAlreadyParticipant) {
            throw new common_1.ConflictException('Vous êtes déjà participant à ce projet');
        }
        await this.prisma.projectUser.create({
            data: {
                projectId: project.id,
                userId,
            },
        });
        return this.prisma.travelProject.findUnique({
            where: { id: project.id },
            include: { participants: true, accommodations: true },
        });
    }
    async findByShareCode(shareCode) {
        return this.prisma.travelProject.findFirst({
            where: { shareCode },
            include: {
                participants: true,
                destinations: true,
                dateSuggestions: true,
                activities: true,
                accommodations: true,
            },
        });
    }
    async findAllByUser(userId) {
        return this.prisma.travelProject.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { participants: { some: { userId } } },
                ],
            },
            include: {
                participants: true,
                destinations: true,
                dateSuggestions: true,
                activities: true,
                accommodations: true,
            },
        });
    }
    async findOneIfAuthorized(id, userId) {
        const project = await this.prisma.travelProject.findUnique({
            where: { id },
            include: {
                participants: true,
                destinations: true,
                dateSuggestions: true,
                activities: true,
                accommodations: true,
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Projet introuvable');
        const isMember = project.creatorId === userId ||
            project.participants.some((p) => p.userId === userId);
        if (!isMember)
            throw new common_1.NotFoundException('Accès interdit');
        return project;
    }
    async update(id, dto, userId) {
        await this.findOneIfAuthorized(id, userId);
        return this.prisma.travelProject.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
            },
            include: { participants: true, accommodations: true },
        });
    }
    async remove(id, userId) {
        const project = await this.findOneIfAuthorized(id, userId);
        if (project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Seul le créateur peut supprimer');
        }
        await this.prisma.travelProject.delete({ where: { id } });
        return { deleted: true };
    }
    async addParticipant(id, dto, userId) {
        await this.findOneIfAuthorized(id, userId);
        const exists = await this.prisma.projectUser.findUnique({
            where: { projectId_userId: { projectId: id, userId: dto.userId } },
        });
        if (exists)
            throw new common_1.ConflictException('Utilisateur déjà participant');
        return this.prisma.projectUser.create({
            data: { projectId: id, userId: dto.userId },
        });
    }
    async loadDestinations(projectId) {
        return this.prisma.destination.findMany({
            where: { projectId },
        });
    }
    async addDestination(id, dto, userId) {
        await this.findOneIfAuthorized(id, userId);
        return this.prisma.destination.create({
            data: {
                projectId: id,
                name: dto.name,
                addedBy: userId,
                suggestedByAI: dto.suggestedByAI ?? false,
            },
        });
    }
    async voteDestination(id, destinationId, userId) {
        await this.findOneIfAuthorized(id, userId);
        await this.prisma.destinationVote.create({
            data: { projectId: id, destinationId, userId, vote: true, comment: null },
        });
    }
    async loadDates(projectId) {
        return this.prisma.dateSuggestion.findMany({
            where: { projectId },
        });
    }
    async addDate(id, dto, userId) {
        await this.findOneIfAuthorized(id, userId);
        return this.prisma.dateSuggestion.create({
            data: {
                projectId: id,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                addedBy: userId,
            },
        });
    }
    async voteDate(id, dateId, userId) {
        await this.findOneIfAuthorized(id, userId);
        await this.prisma.dateVote.create({
            data: { projectId: id, dateId, userId, vote: true, comment: null },
        });
    }
    async loadActivities(projectId) {
        return this.prisma.activity.findMany({
            where: { projectId },
        });
    }
    async addActivity(id, dto, userId) {
        await this.findOneIfAuthorized(id, userId);
        return this.prisma.activity.create({
            data: {
                projectId: id,
                title: dto.title,
                description: dto.description,
                imageUrl: dto.imageUrl,
                addedBy: userId,
                suggestedByAI: dto.suggestedByAI ?? false,
            },
        });
    }
    async loadAccommodations(projectId) {
        return this.prisma.accommodation.findMany({
            where: { projectId },
        });
    }
};
exports.TravelProjectService = TravelProjectService;
exports.TravelProjectService = TravelProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TravelProjectService);
//# sourceMappingURL=travel-project.service.js.map