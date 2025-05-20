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
var AccommodationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccommodationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const shared_1 = require("@itravel/shared");
const url_validator_1 = require("./utils/url-validator");
const photo_scraper_1 = require("./utils/photo-scraper");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../../../core/notifications/notification.service");
const websocket_gateway_1 = require("../../../core/websocket/websocket.gateway");
let AccommodationService = AccommodationService_1 = class AccommodationService {
    constructor(prisma, notificationService, websocketGateway, urlValidator) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
        this.urlValidator = urlValidator;
        this.logger = new common_1.Logger(AccommodationService_1.name);
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
    async create(projectId, userId, data) {
        await this.authorize(projectId, userId);
        let photoUrls = [];
        if (data.link) {
            this.logger.debug(`Validating URL: ${data.link}`);
            if (this.urlValidator.isValidUrl(data.link)) {
                this.logger.debug(`Extracting photos from URL: ${data.link}`);
                photoUrls = await (0, photo_scraper_1.extractPhotosFromUrl)(data.link);
            }
            else {
                this.logger.warn(`Invalid URL for scraping: ${data.link}`);
                throw new common_1.ForbiddenException('URL non autorisée pour le scraping');
            }
        }
        const accommodation = await this.prisma.accommodation.create({
            data: {
                projectId,
                ...data,
                photos: {
                    create: photoUrls.map(url => ({ url }))
                }
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.ACCOMMODATION_CREATED, {
            projectId,
            userId,
            data: {
                accommodationId: accommodation.id,
                name: accommodation.name,
            },
        });
        this.websocketGateway.server.to(projectId).emit('accommodation:created', accommodation);
        return accommodation;
    }
    async findAll(projectId, userId) {
        await this.authorize(projectId, userId);
        return this.prisma.accommodation.findMany({
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
    async vote(projectId, accommodationId, userId, vote, comment) {
        await this.authorize(projectId, userId);
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id: accommodationId },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException('Accommodation not found');
        }
        const voteData = await this.prisma.accommodationVote.upsert({
            where: {
                projectId_accommodationId_userId: {
                    projectId,
                    accommodationId,
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
                accommodationId,
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
        await this.notificationService.notify(shared_1.NotificationType.VOTE_ADDED, {
            projectId,
            userId,
            data: {
                accommodationId,
                vote,
                comment,
            },
        });
        this.websocketGateway.server.to(projectId).emit('accommodation:vote', voteData);
        return voteData;
    }
    async deleteVote(projectId, accommodationId, userId) {
        await this.authorize(projectId, userId);
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id: accommodationId },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException('Accommodation not found');
        }
        const vote = await this.prisma.accommodationVote.delete({
            where: {
                projectId_accommodationId_userId: {
                    projectId,
                    accommodationId,
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
        await this.notificationService.notify(shared_1.NotificationType.ACCOMMODATION_VOTE_DELETED, {
            projectId,
            userId,
            data: {
                accommodationId,
            },
        });
        this.websocketGateway.server.to(projectId).emit('accommodation:vote_deleted', vote);
        return vote;
    }
    async getVoters(accommodationId, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id: accommodationId },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException('Accommodation not found');
        }
        await this.authorize(accommodation.projectId, userId);
        return this.prisma.accommodationVote.findMany({
            where: { accommodationId },
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
        const votes = await this.prisma.accommodationVote.findMany({
            where: { projectId },
            select: {
                accommodationId: true,
                userId: true,
                vote: true,
                comment: true,
                votedAt: true,
            },
        });
        const voteSummary = votes.reduce((acc, vote) => {
            if (!acc[vote.accommodationId]) {
                acc[vote.accommodationId] = {
                    accommodationId: vote.accommodationId,
                    upvotes: 0,
                    downvotes: 0,
                    userVote: vote.userId === userId ? vote.vote : null,
                    comment: vote.comment,
                    score: 0,
                };
            }
            if (vote.vote) {
                acc[vote.accommodationId].upvotes++;
                acc[vote.accommodationId].score++;
            }
            else {
                acc[vote.accommodationId].downvotes++;
                acc[vote.accommodationId].score--;
            }
            return acc;
        }, {});
        return Object.values(voteSummary);
    }
    async validateOption(projectId, accommodationId, userId) {
        const project = await this.prisma.travelProject.findUnique({
            where: { id: projectId },
        });
        if (!project || project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can validate options');
        }
        await this.prisma.accommodation.updateMany({
            where: {
                projectId,
                isSelected: true,
            },
            data: {
                isSelected: false,
                selectedAt: null,
            },
        });
        const accommodation = await this.prisma.accommodation.update({
            where: {
                id: accommodationId,
            },
            data: {
                isSelected: true,
                selectedAt: new Date(),
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.ACCOMMODATION_SELECTED, {
            projectId,
            accommodationId,
            userId,
        });
        return accommodation;
    }
    async unvalidateOption(projectId, accommodationId, userId) {
        const project = await this.prisma.travelProject.findUnique({
            where: { id: projectId },
        });
        if (!project || project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can unvalidate options');
        }
        const accommodation = await this.prisma.accommodation.update({
            where: {
                id: accommodationId,
            },
            data: {
                isSelected: false,
                selectedAt: null,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.ACCOMMODATION_SELECTED, {
            projectId,
            accommodationId,
            userId,
        });
        return accommodation;
    }
    async getValidatedOption(projectId) {
        return this.prisma.accommodation.findFirst({
            where: {
                projectId,
                isSelected: true,
            },
        });
    }
    async filter(projectId, query, userId) {
        await this.authorize(projectId, userId);
        const where = {
            projectId,
            ...(query.priceMin && { price: { gte: new client_1.Prisma.Decimal(query.priceMin) } }),
            ...(query.priceMax && { price: { lte: new client_1.Prisma.Decimal(query.priceMax) } }),
            ...(query.type && { type: query.type }),
        };
        const accommodations = await this.prisma.accommodation.findMany({
            where,
            include: {
                votes: true,
                availability: true,
            },
        });
        if (query.sortBy) {
            accommodations.sort((a, b) => {
                switch (query.sortBy) {
                    case 'price':
                        return Number(a.price) - Number(b.price);
                    case 'votes':
                        return b.votes.length - a.votes.length;
                    case 'score':
                        const scoreA = a.votes.reduce((acc, vote) => acc + (vote.vote ? 1 : -1), 0);
                        const scoreB = b.votes.reduce((acc, vote) => acc + (vote.vote ? 1 : -1), 0);
                        return scoreB - scoreA;
                    default:
                        return 0;
                }
            });
        }
        return accommodations;
    }
    async checkAvailabilityOverlap(accommodationId, start, end, excludeAvailabilityId) {
        const where = {
            accommodationId,
            OR: [
                {
                    AND: [
                        { start: { lte: start } },
                        { end: { gte: start } },
                    ],
                },
                {
                    AND: [
                        { start: { lte: end } },
                        { end: { gte: end } },
                    ],
                },
                {
                    AND: [
                        { start: { gte: start } },
                        { end: { lte: end } },
                    ],
                },
            ],
        };
        if (excludeAvailabilityId) {
            where.id = { not: excludeAvailabilityId };
        }
        const overlappingAvailability = await this.prisma.availability.findFirst({ where });
        return !!overlappingAvailability;
    }
    async checkAvailability(id, start, end, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const startDate = new Date(start);
        const endDate = new Date(end);
        const hasOverlap = await this.checkAvailabilityOverlap(id, startDate, endDate);
        return {
            isAvailable: !hasOverlap,
            message: hasOverlap ? 'L\'hébergement n\'est pas disponible sur cette période' : 'L\'hébergement est disponible sur cette période',
        };
    }
    async addAvailability(id, createAvailabilityDto, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const startDate = new Date(createAvailabilityDto.start);
        const endDate = new Date(createAvailabilityDto.end);
        const hasOverlap = await this.checkAvailabilityOverlap(id, startDate, endDate);
        if (hasOverlap) {
            throw new common_1.ForbiddenException('Cette période chevauche une période de disponibilité existante');
        }
        const availability = await this.prisma.availability.create({
            data: {
                start: startDate,
                end: endDate,
                accommodation: { connect: { id } },
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.COMMENT_ADDED, {
            projectId: accommodation.projectId,
            accommodationId: id,
            userId,
        });
        return availability;
    }
    async getAvailability(id, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
            include: { availability: true },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        return accommodation.availability;
    }
    async addComment(id, addCommentDto, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const comment = await this.prisma.comment.create({
            data: {
                content: addCommentDto.content,
                userId,
                accommodationId: id,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.COMMENT_ADDED, {
            projectId: accommodation.projectId,
            accommodationId: id,
            userId,
        });
        this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:comment_added', comment);
        return comment;
    }
    async deleteComment(id, commentId, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment ${commentId} not found`);
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.prisma.comment.delete({
            where: { id: commentId },
        });
        this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:comment_deleted', { commentId });
        return { message: 'Comment deleted successfully' };
    }
    async getComments(id, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
            include: {
                comments: {
                    include: {
                        user: {
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
                },
            },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        return accommodation.comments;
    }
    async addPhoto(id, photoUrl, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const photo = await this.prisma.photo.create({
            data: {
                url: photoUrl,
                accommodationId: id,
            },
        });
        this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:photo_added', photo);
        return photo;
    }
    async deletePhoto(id, photoId, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const photo = await this.prisma.photo.findUnique({
            where: { id: photoId },
        });
        if (!photo) {
            throw new common_1.NotFoundException(`Photo ${photoId} not found`);
        }
        await this.prisma.photo.delete({
            where: { id: photoId },
        });
        this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:photo_deleted', { photoId });
        return { message: 'Photo deleted successfully' };
    }
    async getPhotos(id, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
            include: {
                photos: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        return accommodation.photos;
    }
    async updateAvailability(id, availabilityId, updateAvailabilityDto, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const availability = await this.prisma.availability.findUnique({
            where: { id: availabilityId },
        });
        if (!availability) {
            throw new common_1.NotFoundException(`Availability ${availabilityId} not found`);
        }
        const startDate = new Date(updateAvailabilityDto.start);
        const endDate = new Date(updateAvailabilityDto.end);
        const hasOverlap = await this.checkAvailabilityOverlap(id, startDate, endDate, availabilityId);
        if (hasOverlap) {
            throw new common_1.ForbiddenException('Cette période chevauche une période de disponibilité existante');
        }
        const updatedAvailability = await this.prisma.availability.update({
            where: { id: availabilityId },
            data: {
                start: startDate,
                end: endDate,
            },
        });
        this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:availability_updated', updatedAvailability);
        return updatedAvailability;
    }
    async deleteAvailability(id, availabilityId, userId) {
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
        });
        if (!accommodation) {
            throw new common_1.NotFoundException(`Accommodation ${id} not found`);
        }
        await this.authorize(accommodation.projectId, userId);
        const availability = await this.prisma.availability.findUnique({
            where: { id: availabilityId },
        });
        if (!availability) {
            throw new common_1.NotFoundException(`Availability ${availabilityId} not found`);
        }
        await this.prisma.availability.delete({
            where: { id: availabilityId },
        });
        this.websocketGateway.server.to(accommodation.projectId).emit('accommodation:availability_deleted', { availabilityId });
        return { message: 'Availability deleted successfully' };
    }
};
exports.AccommodationService = AccommodationService;
exports.AccommodationService = AccommodationService = AccommodationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway,
        url_validator_1.UrlValidator])
], AccommodationService);
//# sourceMappingURL=accommodation.service.js.map