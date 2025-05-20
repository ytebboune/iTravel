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
exports.PlaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notification_service_1 = require("../../core/notifications/notification.service");
const shared_1 = require("@itravel/shared");
const websocket_gateway_1 = require("../../core/websocket/websocket.gateway");
let PlaceService = class PlaceService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
    }
    async create(userId, createVisitedPlaceDto) {
        const { photos, cityId, ...data } = createVisitedPlaceDto;
        const city = await this.prisma.city.findUnique({
            where: { id: cityId },
            include: { country: true },
        });
        if (!city) {
            throw new common_1.NotFoundException('City not found');
        }
        const createData = {
            ...data,
            visitedAt: data.visitedAt || new Date(),
            user: { connect: { id: userId } },
            city: { connect: { id: cityId } },
            country: { connect: { id: city.country.id } },
            photos: {
                create: photos?.map(url => ({ url })) || [],
            },
        };
        const place = await this.prisma.visitedPlace.create({
            data: createData,
            include: {
                user: true,
                city: true,
                country: true,
                photos: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.ACTIVITY_CREATED, {
            userId,
            data: {
                placeId: place.id,
            },
        });
        this.websocketGateway.server.to(userId).emit('place:created', place);
        return place;
    }
    async findAll(userId) {
        return this.prisma.visitedPlace.findMany({
            where: { userId },
            include: {
                user: true,
                city: true,
                country: true,
            },
            orderBy: { visitedAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const place = await this.prisma.visitedPlace.findUnique({
            where: { id },
            include: {
                user: true,
                city: true,
                country: true,
            },
        });
        if (!place) {
            throw new common_1.NotFoundException('Place not found');
        }
        if (place.userId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own visited places');
        }
        return place;
    }
    async update(id, userId, updateVisitedPlaceDto) {
        const place = await this.prisma.visitedPlace.findUnique({
            where: { id },
        });
        if (!place) {
            throw new common_1.NotFoundException('Place not found');
        }
        if (place.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own visited places');
        }
        const { photos, ...data } = updateVisitedPlaceDto;
        const updatedPlace = await this.prisma.visitedPlace.update({
            where: { id },
            data: {
                ...data,
                photos: photos ? {
                    deleteMany: {},
                    create: photos.map(url => ({ url })),
                } : undefined,
            },
            include: {
                user: true,
                city: true,
                country: true,
                photos: true,
            },
        });
        this.websocketGateway.server.to(userId).emit('place:updated', updatedPlace);
        return updatedPlace;
    }
    async remove(id, userId) {
        const place = await this.prisma.visitedPlace.findUnique({
            where: { id },
        });
        if (!place) {
            throw new common_1.NotFoundException('Place not found');
        }
        if (place.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own visited places');
        }
        await this.prisma.visitedPlace.delete({
            where: { id },
        });
        this.websocketGateway.server.to(userId).emit('place:deleted', { id });
        return { message: 'Place deleted successfully' };
    }
    async search(query, userId) {
        return this.prisma.visitedPlace.findMany({
            where: {
                OR: [
                    { city: { name: { contains: query, mode: 'insensitive' } } },
                    { country: { name: { contains: query, mode: 'insensitive' } } },
                ],
                userId,
            },
            include: {
                user: true,
                city: true,
                country: true,
            },
            orderBy: { visitedAt: 'desc' },
        });
    }
    async markPlaceAsVisited(userId, createVisitedPlaceDto) {
        const { cityId, rating, review, photos, visitedAt } = createVisitedPlaceDto;
        const city = await this.prisma.city.findUnique({
            where: { id: cityId },
            include: { country: true },
        });
        if (!city) {
            throw new common_1.NotFoundException('City not found');
        }
        const data = {
            userId,
            cityId,
            countryId: city.countryId,
            rating,
            review,
            visitedAt: visitedAt || new Date(),
            photos: {
                create: photos?.map(url => ({ url })) || [],
            },
        };
        const visitedPlace = await this.prisma.visitedPlace.create({
            data,
            include: {
                city: {
                    include: {
                        country: true,
                    },
                },
                photos: true,
            },
        });
        return visitedPlace;
    }
    async updateVisitedPlace(userId, placeId, updateVisitedPlaceDto) {
        const visitedPlace = await this.prisma.visitedPlace.findUnique({
            where: { id: placeId },
        });
        if (!visitedPlace) {
            throw new common_1.NotFoundException('Visited place not found');
        }
        if (visitedPlace.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own visited places');
        }
        const data = {
            rating: updateVisitedPlaceDto.rating,
            review: updateVisitedPlaceDto.review,
            visitedAt: updateVisitedPlaceDto.visitedAt,
            photos: {
                deleteMany: {},
                create: updateVisitedPlaceDto.photos?.map(url => ({ url })) || [],
            },
        };
        const updatedPlace = await this.prisma.visitedPlace.update({
            where: { id: placeId },
            data,
            include: {
                city: {
                    include: {
                        country: true,
                    },
                },
                photos: true,
            },
        });
        return updatedPlace;
    }
    async deleteVisitedPlace(userId, placeId) {
        const visitedPlace = await this.prisma.visitedPlace.findUnique({
            where: { id: placeId },
        });
        if (!visitedPlace) {
            throw new common_1.NotFoundException('Visited place not found');
        }
        if (visitedPlace.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own visited places');
        }
        await this.prisma.visitedPlace.delete({
            where: { id: placeId },
        });
        return { message: 'Visited place deleted successfully' };
    }
    async getUserVisitedPlaces(userId) {
        const visitedPlaces = await this.prisma.visitedPlace.findMany({
            where: { userId },
            include: {
                city: {
                    include: {
                        country: true,
                    },
                },
                photos: true,
            },
            orderBy: {
                visitedAt: 'desc',
            },
        });
        return visitedPlaces;
    }
    async getCityVisitors(cityId) {
        const city = await this.prisma.city.findUnique({
            where: { id: cityId },
        });
        if (!city) {
            throw new common_1.NotFoundException('City not found');
        }
        const visitors = await this.prisma.visitedPlace.findMany({
            where: { cityId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
                photos: true,
            },
            orderBy: {
                visitedAt: 'desc',
            },
        });
        return visitors;
    }
    async getCountryVisitors(countryId) {
        const country = await this.prisma.country.findUnique({
            where: { id: countryId },
        });
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        const visitors = await this.prisma.visitedPlace.findMany({
            where: {
                city: {
                    countryId,
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
                city: true,
                photos: true,
            },
            orderBy: {
                visitedAt: 'desc',
            },
        });
        return visitors;
    }
    async getPopularPlaces(limit = 10) {
        const popularPlaces = await this.prisma.visitedPlace.groupBy({
            by: ['cityId'],
            _count: {
                userId: true,
            },
            orderBy: {
                _count: {
                    userId: 'desc',
                },
            },
            take: limit,
        });
        const placesWithDetails = await Promise.all(popularPlaces.map(async (place) => {
            const city = await this.prisma.city.findUnique({
                where: { id: place.cityId },
                include: {
                    country: true,
                },
            });
            const averageRating = await this.prisma.visitedPlace.aggregate({
                where: { cityId: place.cityId },
                _avg: {
                    rating: true,
                },
            });
            return {
                city,
                visitorCount: place._count.userId,
                averageRating: averageRating._avg.rating,
            };
        }));
        return placesWithDetails;
    }
};
exports.PlaceService = PlaceService;
exports.PlaceService = PlaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], PlaceService);
//# sourceMappingURL=place.service.js.map