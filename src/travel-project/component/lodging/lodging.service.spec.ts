import { Test, TestingModule } from '@nestjs/testing';
import { LodgingService } from './lodging.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UrlValidator } from '../../../utils/url-validator';
import { MonitoringService } from '../../../monitoring/monitoring.service';
import { AccommodationType, ProjectStatus, ProjectStep } from '@prisma/client';
import * as photoScraper from './utils/photo-scraper';
import { extractPhotosFromUrl } from './utils/photo-scraper';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';

jest.mock('./utils/photo-scraper', () => ({
  extractPhotosFromUrl: jest.fn(),
}));

describe('LodgingService', () => {
  let service: LodgingService;
  let prisma: PrismaService;
  let notificationService: NotificationService;
  let websocketGateway: WebsocketGateway;
  let urlValidator: UrlValidator;
  let monitoringService: MonitoringService;

  const mockProject = {
    id: '1',
    title: 'Test Project',
    description: 'Test Description',
    creatorId: '1',
    shareCode: 'TEST123',
    status: ProjectStatus.PLANNING,
    currentStep: ProjectStep.ACCOMMODATION,
    createdAt: new Date(),
    updatedAt: new Date(),
    participants: [{ userId: 'user-1' }],
  };

  const mockLodging = {
    id: '1',
    name: 'Test Lodging',
    address: 'Test Address',
    price: new Decimal(100),
    type: AccommodationType.HOTEL,
    link: 'https://example.com/hotel',
    isSelected: false,
    selectedAt: null,
    projectId: mockProject.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LodgingService,
        {
          provide: PrismaService,
          useValue: {
            travelProject: {
              findUnique: jest.fn().mockResolvedValue(mockProject),
            },
            accommodation: {
              create: jest.fn().mockResolvedValue(mockLodging),
              findUnique: jest.fn().mockResolvedValue(mockLodging),
              findMany: jest.fn().mockResolvedValue([mockLodging]),
              update: jest.fn().mockResolvedValue(mockLodging),
              delete: jest.fn().mockResolvedValue(mockLodging),
            },
            accommodationVote: {
              upsert: jest.fn().mockResolvedValue({
                id: 'vote-1',
                accommodationId: '1',
                userId: 'user-1',
                vote: true,
                comment: 'Great place!',
                votedAt: new Date(),
              }),
              findMany: jest.fn().mockResolvedValue([
                { accommodationId: '1', userId: 'user-1', vote: true, comment: 'Great!' },
                { accommodationId: '1', userId: 'user-2', vote: true },
                { accommodationId: '1', userId: 'user-3', vote: false },
              ]),
              delete: jest.fn(),
            },
            comment: {
              create: jest.fn().mockResolvedValue({
                id: 'comment-1',
                content: 'Test comment',
                userId: 'user-1',
                accommodationId: '1',
                createdAt: new Date(),
              }),
              findMany: jest.fn(),
            },
            availability: {
              create: jest.fn().mockResolvedValue({
                id: 'availability-1',
                accommodationId: '1',
                start: new Date(),
                end: new Date(),
              }),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: NotificationService,
          useValue: {
            notify: jest.fn(),
          },
        },
        {
          provide: WebsocketGateway,
          useValue: {
            notifyProjectUpdate: jest.fn(),
          },
        },
        {
          provide: UrlValidator,
          useValue: {
            validateUrl: jest.fn().mockImplementation((url: string, type: 'transport' | 'accommodation') => {
              if (url.includes('invalid-url.com')) {
                return false;
              }
              return true;
            }),
          },
        },
        {
          provide: MonitoringService,
          useValue: {
            logError: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LodgingService>(LodgingService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationService = module.get<NotificationService>(NotificationService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
    urlValidator = module.get<UrlValidator>(UrlValidator);
    monitoringService = module.get<MonitoringService>(MonitoringService);

    // Mock the photo scraper function
    jest.spyOn(photoScraper, 'extractPhotosFromUrl').mockResolvedValue(['photo1.jpg', 'photo2.jpg']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create accommodation with auto-scraped data from URL', async () => {
      const url = 'https://example.com/hotel';
      const mockPhotos = ['photo1.jpg', 'photo2.jpg'];
      const createDto: CreateAccommodationDto = {
        name: 'Test Lodging',
        address: 'Test Address',
        price: 100,
        type: AccommodationType.HOTEL,
        link: url,
      };

      const result = await service.create(mockProject.id, createDto, 'user-1');

      expect(result).toBe(mockLodging);
      expect(extractPhotosFromUrl).toHaveBeenCalledWith(url);
      expect(prisma.accommodation.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          project: { connect: { id: mockProject.id } },
          photos: {
            create: mockPhotos.map(url => ({ url }))
          }
        },
      });
    });

    it('should create accommodation without URL', async () => {
      const createDto: CreateAccommodationDto = {
        name: 'Test Lodging',
        address: 'Test Address',
        price: 100,
        type: AccommodationType.HOTEL,
      };

      const result = await service.create(mockProject.id, createDto, 'user-1');

      expect(result).toBe(mockLodging);
      expect(extractPhotosFromUrl).not.toHaveBeenCalled();
      expect(prisma.accommodation.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          project: { connect: { id: mockProject.id } },
          photos: {
            create: []
          }
        },
      });
    });

    it('should throw ForbiddenException for invalid URL', async () => {
      const createDto: CreateAccommodationDto = {
        name: 'Test Lodging',
        address: 'Test Address',
        price: 100,
        type: AccommodationType.HOTEL,
        link: 'https://invalid-url.com',
      };

      await expect(service.create(mockProject.id, createDto, 'user-1'))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('vote', () => {
    const userId = 'user-1';
    const accommodationId = '1';
    const voteDto = {
      accommodationId,
      vote: true,
      comment: 'Great place!'
    };

    it('should create a new vote successfully', async () => {
      const result = await service.vote(userId, voteDto);

      expect(result).toBeDefined();
      expect(prisma.accommodationVote.upsert).toHaveBeenCalled();
      expect(notificationService.notify).toHaveBeenCalled();
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      jest.spyOn(prisma.accommodation, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.vote(userId, voteDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('addComment', () => {
    const userId = 'user-1';
    const accommodationId = '1';
    const commentDto = {
      accommodationId,
      content: 'This is a test comment'
    };

    it('should add a comment successfully', async () => {
      const result = await service.addComment(accommodationId, commentDto, userId);

      expect(result).toBeDefined();
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: commentDto.content,
          userId,
          accommodationId
        }
      });
      expect(notificationService.notify).toHaveBeenCalled();
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      jest.spyOn(prisma.accommodation, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.addComment(accommodationId, commentDto, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('filter', () => {
    const projectId = '1';
    const userId = 'user-1';
    const filterDto = {
      priceMin: 50,
      priceMax: 200,
      sortBy: 'price' as const,
      type: AccommodationType.HOTEL
    };

    it('should filter accommodations successfully', async () => {
      const result = await service.filter(projectId, filterDto, userId);

      expect(result).toBeDefined();
      expect(prisma.accommodation.findMany).toHaveBeenCalledWith({
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
    const accommodationId = '1';
    const userId = 'user-1';
    const availabilityDto = {
      accommodationId,
      start: '2024-03-01',
      end: '2024-03-05',
    };

    it('should add availability to an accommodation', async () => {
      const result = await service.addAvailability(accommodationId, availabilityDto, userId);

      expect(result).toBeDefined();
      expect(prisma.availability.create).toHaveBeenCalledWith({
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
      jest.spyOn(prisma.accommodation, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.addAvailability(accommodationId, availabilityDto, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const accommodationId = '1';
    const userId = 'user-1';

    it('should remove accommodation successfully', async () => {
      const result = await service.remove(accommodationId, userId);

      expect(result).toBeDefined();
      expect(prisma.accommodation.delete).toHaveBeenCalledWith({
        where: { id: accommodationId }
      });
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      jest.spyOn(prisma.accommodation, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.remove(accommodationId, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const accommodationId = '1';
    const userId = 'user-1';
    const updateDto = {
      name: 'Updated Hotel',
      price: 150
    };

    it('should update accommodation successfully', async () => {
      const result = await service.update(accommodationId, updateDto, userId);

      expect(result).toBeDefined();
      expect(prisma.accommodation.update).toHaveBeenCalledWith({
        where: { id: accommodationId },
        data: updateDto
      });
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      jest.spyOn(prisma.accommodation, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.update(accommodationId, updateDto, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getVotes', () => {
    const projectId = '1';
    const userId = 'user-1';

    it('should return votes summary for all accommodations', async () => {
      const result = await service.getVotes(projectId, userId);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        accommodationId: '1',
        upvotes: 2,
        downvotes: 1,
        userVote: true,
        comment: 'Great!',
        score: 1
      });
    });
  });

  describe('getVoters', () => {
    const accommodationId = '1';
    const userId = 'user-1';

    it('should return all voters for an accommodation', async () => {
      const result = await service.getVoters(accommodationId, userId);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        userId: 'user-1',
        vote: true,
        comment: 'Great!'
      });
    });

    it('should throw NotFoundException if accommodation not found', async () => {
      jest.spyOn(prisma.accommodation, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.getVoters(accommodationId, userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });
}); 