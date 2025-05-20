import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { NotificationType } from '@itravel/shared';
import { WebsocketGateway } from '../../core/websocket/websocket.gateway';
import { CreateVisitedPlaceDto } from './dto/create-visited-place.dto';
import { UpdateVisitedPlaceDto } from './dto/update-visited-place.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async create(userId: string, createVisitedPlaceDto: CreateVisitedPlaceDto) {
    const { photos, cityId, ...data } = createVisitedPlaceDto;
    
    // Récupérer la ville avec son pays
    const city = await this.prisma.city.findUnique({
      where: { id: cityId },
      include: { country: true },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const createData: Prisma.VisitedPlaceCreateInput = {
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

    await this.notificationService.notify(NotificationType.ACTIVITY_CREATED, {
      userId,
      data: {
        placeId: place.id,
      },
    });

    this.websocketGateway.server.to(userId).emit('place:created', place);

    return place;
  }

  async findAll(userId: string) {
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

  async findOne(id: string, userId: string) {
    const place = await this.prisma.visitedPlace.findUnique({
      where: { id },
      include: {
        user: true,
        city: true,
        country: true,
      },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    if (place.userId !== userId) {
      throw new ForbiddenException('You can only view your own visited places');
    }

    return place;
  }

  async update(id: string, userId: string, updateVisitedPlaceDto: UpdateVisitedPlaceDto) {
    const place = await this.prisma.visitedPlace.findUnique({
      where: { id },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    if (place.userId !== userId) {
      throw new ForbiddenException('You can only update your own visited places');
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

  async remove(id: string, userId: string) {
    const place = await this.prisma.visitedPlace.findUnique({
      where: { id },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    if (place.userId !== userId) {
      throw new ForbiddenException('You can only delete your own visited places');
    }

    await this.prisma.visitedPlace.delete({
      where: { id },
    });

    this.websocketGateway.server.to(userId).emit('place:deleted', { id });

    return { message: 'Place deleted successfully' };
  }

  async search(query: string, userId: string) {
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

  async markPlaceAsVisited(userId: string, createVisitedPlaceDto: CreateVisitedPlaceDto) {
    const { cityId, rating, review, photos, visitedAt } = createVisitedPlaceDto;

    // Vérifier si la ville existe
    const city = await this.prisma.city.findUnique({
      where: { id: cityId },
      include: { country: true },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const data: Prisma.VisitedPlaceUncheckedCreateInput = {
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

  async updateVisitedPlace(userId: string, placeId: string, updateVisitedPlaceDto: UpdateVisitedPlaceDto) {
    const visitedPlace = await this.prisma.visitedPlace.findUnique({
      where: { id: placeId },
    });

    if (!visitedPlace) {
      throw new NotFoundException('Visited place not found');
    }

    if (visitedPlace.userId !== userId) {
      throw new ForbiddenException('You can only update your own visited places');
    }

    const data: Prisma.VisitedPlaceUncheckedUpdateInput = {
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

  async deleteVisitedPlace(userId: string, placeId: string) {
    const visitedPlace = await this.prisma.visitedPlace.findUnique({
      where: { id: placeId },
    });

    if (!visitedPlace) {
      throw new NotFoundException('Visited place not found');
    }

    if (visitedPlace.userId !== userId) {
      throw new ForbiddenException('You can only delete your own visited places');
    }

    await this.prisma.visitedPlace.delete({
      where: { id: placeId },
    });

    return { message: 'Visited place deleted successfully' };
  }

  async getUserVisitedPlaces(userId: string) {
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

  async getCityVisitors(cityId: string) {
    const city = await this.prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
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

  async getCountryVisitors(countryId: string) {
    const country = await this.prisma.country.findUnique({
      where: { id: countryId },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
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

    const placesWithDetails = await Promise.all(
      popularPlaces.map(async (place) => {
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
      }),
    );

    return placesWithDetails;
  }
} 