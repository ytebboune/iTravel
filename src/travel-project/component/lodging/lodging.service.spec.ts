import { Test, TestingModule } from '@nestjs/testing';
import { LodgingService } from './lodging.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UrlValidator } from '../../../utils/url-validator';
import { MonitoringService } from '../../../monitoring/monitoring.service';
import { AccommodationType } from '@prisma/client';

describe('LodgingService', () => {
  let service: LodgingService;
  let prisma: PrismaService;
  let notificationService: NotificationService;
  let urlValidator: UrlValidator;
  let monitoringService: MonitoringService;

  const mockPrisma = {
    travelProject: {
      findUnique: jest.fn(),
    },
    accommodation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    accommodationVote: {
      upsert: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    comment: {
      create: jest.fn(),
    },
    availability: {
      create: jest.fn(),
    },
  };

  const mockNotificationService = {
    notify: jest.fn(),
  };

  const mockUrlValidator = {
    validateUrl: jest.fn(),
  };

  const mockMonitoringService = {
    // Add any necessary mock methods for MonitoringService
  };

  const mockWebsocketGateway = {
    server: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LodgingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: UrlValidator, useValue: mockUrlValidator },
        { provide: MonitoringService, useValue: mockMonitoringService },
        { provide: require('../../../websocket/websocket.gateway').WebsocketGateway, useValue: mockWebsocketGateway },
      ],
    }).compile();

    service = module.get<LodgingService>(LodgingService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationService = module.get<NotificationService>(NotificationService);
    urlValidator = module.get<UrlValidator>(UrlValidator);
    monitoringService = module.get<MonitoringService>(MonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const projectId = 'project-1';
    const userId = 'user-1';
    const createDto = {
      name: 'Hotel Test',
      address: '123 Test Street',
      price: 100,
      type: AccommodationType.HOTEL,
    };

    it('should create an accommodation successfully', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId: userId });
      mockPrisma.accommodation.create.mockResolvedValue({ id: 'accommodation-1', ...createDto });

      const result = await service.create(projectId, createDto, userId);

      expect(result).toBeDefined();
      expect(mockPrisma.accommodation.create).toHaveBeenCalled();
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should create an accommodation with auto-scraped data from URL', async () => {
      const dtoWithUrl = { ...createDto, link: 'https://example.com/hotel' };
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId: userId });
      mockUrlValidator.validateUrl.mockReturnValue(true);
      mockPrisma.accommodation.create.mockResolvedValue({ 
        id: 'accommodation-1', 
        ...dtoWithUrl,
        photos: ['photo1.jpg', 'photo2.jpg'] // Données scrapées
      });

      const result = await service.create(projectId, dtoWithUrl, userId);

      expect(result).toBeDefined();
      expect(mockUrlValidator.validateUrl).toHaveBeenCalledWith(dtoWithUrl.link, 'accommodation');
      expect(mockNotificationService.notify).toHaveBeenCalled();
    }, 10000);

    it('should throw ForbiddenException for invalid URL', async () => {
      const dtoWithUrl = { ...createDto, link: 'https://invalid-url.com' };
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId: userId });
      mockUrlValidator.validateUrl.mockReturnValue(false);

      await expect(service.create(projectId, dtoWithUrl, userId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('vote', () => {
    const userId = 'user-1';
    const accommodationId = 'accommodation-1';
    const voteDto = {
      accommodationId,
      vote: true,
      comment: 'Great place!'
    };

    it('should create a new vote successfully', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue({ 
        id: accommodationId, 
        projectId: 'project-1' 
      });
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: 'project-1', 
        participants: [{ userId }] 
      });
      mockPrisma.accommodationVote.upsert.mockResolvedValue({
        id: 'vote-1',
        ...voteDto,
        votedAt: new Date()
      });

      const result = await service.vote(userId, voteDto);

      expect(result).toBeDefined();
      expect(mockPrisma.accommodationVote.upsert).toHaveBeenCalled();
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue(null);

      await expect(service.vote(userId, voteDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('addComment', () => {
    const userId = 'user-1';
    const accommodationId = 'accommodation-1';
    const commentDto = {
      accommodationId,
      content: 'This is a test comment'
    };

    it('should add a comment successfully', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue({ 
        id: accommodationId, 
        projectId: 'project-1' 
      });
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: 'project-1', 
        participants: [{ userId }] 
      });
      mockPrisma.comment.create.mockResolvedValue({
        id: 'comment-1',
        ...commentDto,
        createdAt: new Date()
      });

      const result = await service.addComment(accommodationId, commentDto, userId);

      expect(result).toBeDefined();
      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: commentDto.content,
          userId,
          accommodationId
        }
      });
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue(null);

      await expect(service.addComment(accommodationId, commentDto, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('filter', () => {
    const projectId = 'project-1';
    const userId = 'user-1';
    const filterDto = {
      priceMin: 50,
      priceMax: 200,
      sortBy: 'price' as const,
      type: AccommodationType.HOTEL
    };

    it('should filter accommodations successfully', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId: userId });
      mockPrisma.accommodation.findMany.mockResolvedValue([
        { id: 'accommodation-1', price: 100 },
        { id: 'accommodation-2', price: 150 }
      ]);

      const result = await service.filter(projectId, filterDto, userId);

      expect(result).toBeDefined();
      expect(mockPrisma.accommodation.findMany).toHaveBeenCalledWith({
        where: {
          projectId,
          price: {
            gte: filterDto.priceMin,
            lte: filterDto.priceMax
          }
        },
        orderBy: {
          [filterDto.sortBy]: 'desc'
        }
      });
    });
  });

  describe('addAvailability', () => {
    const accommodationId = 'accommodation-1';
    const userId = 'user-1';
    const availabilityDto = {
      accommodationId,
      start: '2024-03-01',
      end: '2024-03-05',
    };

    it('should add availability to an accommodation', async () => {
      const accommodation = {
        id: accommodationId,
        projectId: 'project-1',
      };

      const availability = {
        id: 'availability-1',
        accommodationId,
        start: new Date(availabilityDto.start),
        end: new Date(availabilityDto.end),
      };

      mockPrisma.accommodation.findUnique.mockResolvedValue(accommodation);
      mockPrisma.travelProject.findUnique.mockResolvedValue({
        id: 'project-1',
        creatorId: userId,
        participants: [],
      });
      mockPrisma.availability.create.mockResolvedValue(availability);

      const result = await service.addAvailability(accommodationId, availabilityDto, userId);

      expect(result).toEqual(availability);
      expect(mockPrisma.availability.create).toHaveBeenCalledWith({
        data: {
          accommodation: {
            connect: {
              id: accommodationId,
            },
          },
          start: availabilityDto.start,
          end: availabilityDto.end,
        },
      });
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue(null);

      await expect(service.addAvailability(accommodationId, availabilityDto, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const accommodationId = 'accommodation-1';
    const userId = 'user-1';

    it('should remove accommodation successfully', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue({ 
        id: accommodationId, 
        projectId: 'project-1' 
      });
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: 'project-1', 
        creatorId: userId 
      });
      mockPrisma.accommodation.delete.mockResolvedValue({ id: accommodationId });

      const result = await service.remove(accommodationId, userId);

      expect(result).toBeDefined();
      expect(mockPrisma.accommodation.delete).toHaveBeenCalledWith({
        where: { id: accommodationId }
      });
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue(null);

      await expect(service.remove(accommodationId, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const accommodationId = 'accommodation-1';
    const userId = 'user-1';
    const updateDto = {
      name: 'Updated Hotel',
      price: 150
    };

    it('should update accommodation successfully', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue({ 
        id: accommodationId, 
        projectId: 'project-1' 
      });
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: 'project-1', 
        creatorId: userId 
      });
      mockPrisma.accommodation.update.mockResolvedValue({
        id: accommodationId,
        ...updateDto
      });

      const result = await service.update(accommodationId, updateDto, userId);

      expect(result).toBeDefined();
      expect(mockPrisma.accommodation.update).toHaveBeenCalledWith({
        where: { id: accommodationId },
        data: updateDto
      });
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue(null);

      await expect(service.update(accommodationId, updateDto, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getVotes', () => {
    const projectId = 'project-1';
    const userId = 'user-1';

    it('should return votes summary for all accommodations', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId: userId 
      });
      mockPrisma.accommodationVote.findMany.mockResolvedValue([
        { accommodationId: 'acc-1', userId: 'user-1', vote: true, comment: 'Great!' },
        { accommodationId: 'acc-1', userId: 'user-2', vote: true },
        { accommodationId: 'acc-1', userId: 'user-3', vote: false },
        { accommodationId: 'acc-2', userId: 'user-1', vote: true }
      ]);

      const result = await service.getVotes(projectId, userId);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        accommodationId: 'acc-1',
        upvotes: 2,
        downvotes: 1,
        userVote: true,
        comment: 'Great!',
        score: 1
      });
    });
  });

  describe('getVoters', () => {
    const accommodationId = 'accommodation-1';
    const userId = 'user-1';

    it('should return all voters for an accommodation', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue({ 
        id: accommodationId, 
        projectId: 'project-1' 
      });
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: 'project-1', 
        participants: [{ userId }] 
      });
      mockPrisma.accommodationVote.findMany.mockResolvedValue([
        { userId: 'user-1', vote: true, comment: 'Great!', votedAt: new Date() },
        { userId: 'user-2', vote: true, votedAt: new Date() }
      ]);

      const result = await service.getVoters(accommodationId, userId);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        userId: 'user-1',
        vote: true,
        comment: 'Great!',
        votedAt: expect.any(Date)
      });
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      mockPrisma.accommodation.findUnique.mockResolvedValue(null);

      await expect(service.getVoters(accommodationId, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });
}); 