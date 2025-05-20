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
var TransportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const transport_scraper_1 = require("./utils/transport-scraper");
const shared_1 = require("@itravel/shared");
;
const notification_service_1 = require("../../../core/notifications/notification.service");
const websocket_gateway_1 = require("../../../core/websocket/websocket.gateway");
const url_validator_1 = require("../../../core/utils/url-validator");
const monitoring_service_1 = require("../../../core/monitoring/monitoring.service");
let TransportService = TransportService_1 = class TransportService {
    constructor(prisma, notificationService, urlValidator, monitoringService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.urlValidator = urlValidator;
        this.monitoringService = monitoringService;
        this.websocketGateway = websocketGateway;
        this.logger = new common_1.Logger(TransportService_1.name);
        this.SCORE_WEIGHTS = {
            VOTE: 0.4,
            PRICE: 0.3,
            DURATION: 0.2,
            COMMENT: 0.1,
        };
    }
    async authorize(projectId, userId) {
        this.logger.debug(`Authorizing user ${userId} for project ${projectId}`);
        const project = await this.prisma.travelProject.findUnique({
            where: { id: projectId },
            include: { participants: true },
        });
        if (!project) {
            this.logger.warn(`Project ${projectId} not found`);
            throw new common_1.NotFoundException('Projet introuvable');
        }
        const isMember = project.creatorId === userId ||
            project.participants.some(p => p.userId === userId);
        if (!isMember) {
            this.logger.warn(`User ${userId} is not authorized for project ${projectId}`);
            throw new common_1.ForbiddenException('Accès interdit');
        }
        this.logger.debug(`User ${userId} authorized for project ${projectId}`);
        return project;
    }
    async create(projectId, dto, userId) {
        this.logger.log(`Creating transport option for project ${projectId} by user ${userId}`);
        await this.authorize(projectId, userId);
        let autoData = {};
        if (dto.link) {
            this.logger.debug(`Validating URL: ${dto.link}`);
            if (this.urlValidator.validateUrl(dto.link, 'transport')) {
                this.logger.debug(`Extracting transport info from URL: ${dto.link}`);
                autoData = await (0, transport_scraper_1.extractTransportInfoFromUrl)(dto.link);
            }
            else {
                this.logger.warn(`Invalid URL for scraping: ${dto.link}`);
                throw new common_1.ForbiddenException('URL non autorisée pour le scraping');
            }
        }
        const transport = await this.prisma.transportOption.create({
            data: {
                projectId,
                addedBy: userId,
                type: dto.type,
                departure: dto.departure,
                arrival: dto.arrival,
                date: new Date(dto.date),
                duration: dto.duration,
                price: dto.price,
                link: dto.link,
                company: dto.company,
                flightNumber: dto.flightNumber,
                baggageIncluded: dto.baggageIncluded,
                nbStops: dto.nbStops,
                seatInfo: dto.seatInfo,
            },
        });
        this.logger.log(`Transport option created with ID: ${transport.id}`);
        await this.notificationService.notify(shared_1.NotificationType.TRANSPORT_SELECTED, {
            projectId,
            transportId: transport.id,
            userId,
        });
        return transport;
    }
    calculateScores(transports) {
        const maxPrice = Math.max(...transports.map(t => t.price || 0));
        const maxDuration = Math.max(...transports.map(t => {
            if (!t.duration)
                return 0;
            const [hours, minutes] = t.duration.split(':').map(Number);
            return hours * 60 + minutes;
        }));
        const maxComments = Math.max(...transports.map(t => t.comments.length));
        return transports.map(transport => {
            const upvotes = transport.votes.filter(v => v.vote).length;
            const downvotes = transport.votes.filter(v => !v.vote).length;
            const totalVotes = upvotes + downvotes;
            const voteScore = totalVotes > 0 ? (upvotes - downvotes) / totalVotes : 0;
            const priceScore = maxPrice > 0 && transport.price
                ? 1 - (transport.price / maxPrice)
                : 0;
            let durationScore = 0;
            if (transport.duration && maxDuration > 0) {
                const [hours, minutes] = transport.duration.split(':').map(Number);
                const durationInMinutes = hours * 60 + minutes;
                durationScore = 1 - (durationInMinutes / maxDuration);
            }
            const commentScore = maxComments > 0
                ? transport.comments.length / maxComments
                : 0;
            const globalScore = voteScore * this.SCORE_WEIGHTS.VOTE +
                priceScore * this.SCORE_WEIGHTS.PRICE +
                durationScore * this.SCORE_WEIGHTS.DURATION +
                commentScore * this.SCORE_WEIGHTS.COMMENT;
            return {
                ...transport,
                scores: {
                    voteScore,
                    priceScore,
                    durationScore,
                    commentScore,
                    globalScore,
                },
            };
        });
    }
    async findAll(projectId, userId, sortDto) {
        this.logger.debug(`Finding all transport options for project ${projectId}`);
        await this.authorize(projectId, userId);
        const transports = await this.prisma.transportOption.findMany({
            where: { projectId },
            include: {
                votes: true,
                comments: true,
            },
        });
        if (!sortDto?.sortBy) {
            return transports;
        }
        const transportsWithScores = this.calculateScores(transports);
        return transportsWithScores.sort((a, b) => {
            const order = sortDto.order === shared_1.SortOrder.ASC ? 1 : -1;
            switch (sortDto.sortBy) {
                case shared_1.SortField.SCORE:
                    return (a.scores.globalScore - b.scores.globalScore) * order;
                case shared_1.SortField.PRICE:
                    if (!a.price && !b.price)
                        return 0;
                    if (!a.price)
                        return 1 * order;
                    if (!b.price)
                        return -1 * order;
                    return (a.price - b.price) * order;
                case shared_1.SortField.DURATION:
                    if (!a.duration && !b.duration)
                        return 0;
                    if (!a.duration)
                        return 1 * order;
                    if (!b.duration)
                        return -1 * order;
                    const [aHours, aMinutes] = a.duration.split(':').map(Number);
                    const [bHours, bMinutes] = b.duration.split(':').map(Number);
                    const aDuration = aHours * 60 + aMinutes;
                    const bDuration = bHours * 60 + bMinutes;
                    return (aDuration - bDuration) * order;
                case shared_1.SortField.DATE:
                    return (a.date.getTime() - b.date.getTime()) * order;
                default:
                    return 0;
            }
        });
    }
    async vote(userId, dto) {
        this.logger.log(`User ${userId} voting on transport ${dto.transportId}`);
        const transport = await this.prisma.transportOption.findUnique({
            where: { id: dto.transportId },
        });
        if (!transport) {
            this.logger.warn(`Transport ${dto.transportId} not found`);
            throw new common_1.NotFoundException();
        }
        await this.authorize(transport.projectId, userId);
        const vote = await this.prisma.transportVote.upsert({
            where: {
                projectId_transportId_userId: {
                    projectId: transport.projectId,
                    transportId: dto.transportId,
                    userId,
                },
            },
            update: {
                vote: dto.vote,
                comment: dto.comment,
                votedAt: new Date(),
            },
            create: {
                projectId: transport.projectId,
                transportId: dto.transportId,
                userId,
                vote: dto.vote,
                comment: dto.comment,
            },
        });
        this.logger.log(`Vote recorded for transport ${dto.transportId}`);
        await this.notificationService.notify(shared_1.NotificationType.VOTE_ADDED, {
            projectId: transport.projectId,
            transportId: dto.transportId,
            userId,
        });
        return vote;
    }
    async deleteVote(userId, transportId) {
        this.logger.log(`User ${userId} deleting vote for transport ${transportId}`);
        const transport = await this.prisma.transportOption.findUnique({
            where: { id: transportId },
        });
        if (!transport) {
            this.logger.warn(`Transport ${transportId} not found`);
            throw new common_1.NotFoundException();
        }
        await this.authorize(transport.projectId, userId);
        const vote = await this.prisma.transportVote.delete({
            where: {
                projectId_transportId_userId: {
                    projectId: transport.projectId,
                    transportId,
                    userId,
                },
            },
        });
        this.logger.log(`Vote deleted for transport ${transportId}`);
        await this.notificationService.notify(shared_1.NotificationType.VOTE_DELETED, {
            projectId: transport.projectId,
            transportId,
            userId,
        });
        return vote;
    }
    async getVoters(transportId, userId) {
        this.logger.log(`Getting voters for transport ${transportId}`);
        const transport = await this.prisma.transportOption.findUnique({
            where: { id: transportId },
        });
        if (!transport) {
            this.logger.warn(`Transport ${transportId} not found`);
            throw new common_1.NotFoundException();
        }
        await this.authorize(transport.projectId, userId);
        const votes = await this.prisma.transportVote.findMany({
            where: { transportId },
        });
        return votes.map(vote => ({
            userId: vote.userId,
            vote: vote.vote,
            comment: vote.comment,
            votedAt: vote.votedAt,
        }));
    }
    async addComment(userId, dto) {
        this.logger.log(`User ${userId} adding comment to transport ${dto.transportId}`);
        const transport = await this.prisma.transportOption.findUnique({
            where: { id: dto.transportId },
        });
        if (!transport) {
            this.logger.warn(`Transport ${dto.transportId} not found`);
            throw new common_1.NotFoundException();
        }
        await this.authorize(transport.projectId, userId);
        const comment = await this.prisma.transportComment.create({
            data: {
                transportId: dto.transportId,
                userId,
                content: dto.content,
            },
        });
        this.logger.log(`Comment added to transport ${dto.transportId}`);
        await this.notificationService.notify(shared_1.NotificationType.COMMENT_ADDED, {
            projectId: transport.projectId,
            transportId: dto.transportId,
            userId,
        });
        return comment;
    }
    async selectOption(projectId, transportId, userId) {
        this.logger.log(`User ${userId} selecting transport ${transportId} for project ${projectId}`);
        const project = await this.authorize(projectId, userId);
        if (project.creatorId !== userId) {
            this.logger.warn(`User ${userId} is not authorized to select transport option`);
            throw new common_1.ForbiddenException('Seul le créateur peut valider une option');
        }
        const transport = await this.prisma.transportOption.update({
            where: { id: transportId },
            data: { isSelected: true },
        });
        this.logger.log(`Transport ${transportId} selected for project ${projectId}`);
        await this.notificationService.notify(shared_1.NotificationType.TRANSPORT_SELECTED, {
            projectId,
            transportId,
            userId,
        });
        return transport;
    }
    async validateOption(projectId, transportId, userId) {
        const project = await this.prisma.travelProject.findUnique({
            where: { id: projectId },
        });
        if (!project || project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can validate options');
        }
        await this.prisma.transportOption.updateMany({
            where: {
                projectId,
                isSelected: true,
            },
            data: {
                isSelected: false,
            },
        });
        const transport = await this.prisma.transportOption.update({
            where: {
                id: transportId,
            },
            data: {
                isSelected: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.TRANSPORT_SELECTED, {
            projectId,
            transportId,
            userId,
        });
        return transport;
    }
    async unvalidateOption(projectId, transportId, userId) {
        const project = await this.prisma.travelProject.findUnique({
            where: { id: projectId },
        });
        if (!project || project.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the project creator can unvalidate options');
        }
        const transport = await this.prisma.transportOption.update({
            where: {
                id: transportId,
            },
            data: {
                isSelected: false,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.TRANSPORT_SELECTED, {
            projectId,
            transportId,
            userId,
        });
        return transport;
    }
    async getValidatedOption(projectId) {
        return this.prisma.transportOption.findFirst({
            where: {
                projectId,
                isSelected: true,
            },
        });
    }
};
exports.TransportService = TransportService;
exports.TransportService = TransportService = TransportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        url_validator_1.UrlValidator,
        monitoring_service_1.MonitoringService,
        websocket_gateway_1.WebsocketGateway])
], TransportService);
//# sourceMappingURL=transport.service.js.map