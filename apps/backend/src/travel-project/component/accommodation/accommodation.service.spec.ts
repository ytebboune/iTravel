import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationService } from './accommodation.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('AccommodationService', () => {
  let service: AccommodationService;
  let prisma: PrismaService;
  let notificationService: NotificationService;
  let websocketGateway: WebsocketGateway;

  const mockPrisma = {
    travelProject: {
      findUnique: jest.fn(),
    },
    accommodation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    accommodationVote: {
      upsert: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockNotificationService = {
    notify: jest.fn(),
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
        AccommodationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: WebsocketGateway, useValue: mockWebsocketGateway },
      ],
    }).compile();

    service = module.get<AccommodationService>(AccommodationService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationService = module.get<NotificationService>(NotificationService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authorize', () => {
    it('should throw NotFoundException if project not found', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue(null);

      await expect(service.authorize('projectId', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not a member', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({
        id: 'projectId',
        creatorId: 'otherUserId',
        participants: [],
      });

      await expect(service.authorize('projectId', 'userId')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return project if user is creator', async () => {
      const project = {
        id: 'projectId',
        creatorId: 'userId',
        participants: [],
      };

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);

      const result = await service.authorize('projectId', 'userId');
      expect(result).toEqual(project);
    });

    it('should return project if user is participant', async () => {
      const project = {
        id: 'projectId',
        creatorId: 'otherUserId',
        participants: [{ userId: 'userId' }],
      };

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);

      const result = await service.authorize('projectId', 'userId');
      expect(result).toEqual(project);
    });
  });

  describe('create', () => {
    const projectId = 'project-1';
    const userId = 'user-1';
    const data = {
      name: 'Test Accommodation',
      address: '123 Test Street',
      price: 100,
      link: 'http://example.com',
      type: 'HOTEL',
    };

    it('should create a new accommodation', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const accommodation = {
        id: 'accommodation-1',
        ...data,
        projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.accommodation.create.mockResolvedValue(accommodation);

      const result = await service.create(projectId, userId, data);

      expect(result).toEqual(accommodation);
      expect(mockPrisma.accommodation.create).toHaveBeenCalledWith({
        data: {
          projectId,
          ...data,
        },
      });
      expect(mockNotificationService.notify).toHaveBeenCalled();
      expect(mockWebsocketGateway.server.to).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const projectId = 'project-1';
    const userId = 'user-1';

    it('should return all accommodations for a project', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const accommodations = [
        {
          id: 'accommodation-1',
          name: 'Accommodation 1',
          address: '123 Test Street',
          price: 100,
          projectId,
          createdAt: new Date(),
          updatedAt: new Date(),
          votes: [],
        },
      ];

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.accommodation.findMany.mockResolvedValue(accommodations);

      const result = await service.findAll(projectId, userId);

      expect(result).toEqual(accommodations);
      expect(mockPrisma.accommodation.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('vote', () => {
    const projectId = 'project-1';
    const accommodationId = 'accommodation-1';
    const userId = 'user-1';
    const vote = true;
    const comment = 'Test comment';

    it('should create or update a vote', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const accommodation = {
        id: accommodationId,
        projectId,
      };

      const voteData = {
        id: 'vote-1',
        projectId,
        accommodationId,
        userId,
        vote,
        comment,
        votedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
        },
      };

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.accommodation.findUnique.mockResolvedValue(accommodation);
      mockPrisma.accommodationVote.upsert.mockResolvedValue(voteData);

      const result = await service.vote(projectId, accommodationId, userId, vote, comment);

      expect(result).toEqual(voteData);
      expect(mockPrisma.accommodationVote.upsert).toHaveBeenCalled();
      expect(mockNotificationService.notify).toHaveBeenCalled();
      expect(mockWebsocketGateway.server.to).toHaveBeenCalled();
    });
  });

  describe('deleteVote', () => {
    const projectId = 'project-1';
    const accommodationId = 'accommodation-1';
    const userId = 'user-1';

    it('should delete a vote', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const accommodation = {
        id: accommodationId,
        projectId,
      };

      const vote = {
        id: 'vote-1',
        projectId,
        accommodationId,
        userId,
        vote: true,
        comment: 'Test comment',
        votedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
        },
      };

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.accommodation.findUnique.mockResolvedValue(accommodation);
      mockPrisma.accommodationVote.delete.mockResolvedValue(vote);

      const result = await service.deleteVote(projectId, accommodationId, userId);

      expect(result).toEqual(vote);
      expect(mockPrisma.accommodationVote.delete).toHaveBeenCalled();
      expect(mockNotificationService.notify).toHaveBeenCalled();
      expect(mockWebsocketGateway.server.to).toHaveBeenCalled();
    });
  });

  describe('getVoters', () => {
    const accommodationId = 'accommodation-1';
    const userId = 'user-1';

    it('should return all voters for an accommodation', async () => {
      const accommodation = {
        id: accommodationId,
        projectId: 'project-1',
      };

      const votes = [
        {
          userId: 'user-1',
          vote: true,
          comment: 'Test comment',
          votedAt: new Date(),
        },
      ];

      mockPrisma.accommodation.findUnique.mockResolvedValue(accommodation);
      mockPrisma.travelProject.findUnique.mockResolvedValue({
        id: 'project-1',
        creatorId: userId,
        participants: [],
      });
      mockPrisma.accommodationVote.findMany.mockResolvedValue(votes);

      const result = await service.getVoters(accommodationId, userId);

      expect(result).toEqual(votes);
      expect(mockPrisma.accommodationVote.findMany).toHaveBeenCalledWith({
        where: { accommodationId },
        select: {
          userId: true,
          votedAt: true,
          vote: true,
          comment: true,
        },
      });
    });
  });

  describe('getVotes', () => {
    const projectId = 'project-1';
    const userId = 'user-1';

    it('should return aggregated votes for all accommodations', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const votes = [
        {
          accommodationId: 'accommodation-1',
          userId: 'user-1',
          vote: true,
          comment: 'Test comment',
          votedAt: new Date(),
        },
      ];

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.accommodationVote.findMany.mockResolvedValue(votes);

      const result = await service.getVotes(projectId, userId);

      expect(result).toEqual([
        {
          accommodationId: 'accommodation-1',
          upvotes: 1,
          downvotes: 0,
          userVote: true,
          comment: 'Test comment',
          score: 1,
        },
      ]);
      expect(mockPrisma.accommodationVote.findMany).toHaveBeenCalledWith({
        where: { projectId },
        select: {
          accommodationId: true,
          userId: true,
          vote: true,
          comment: true,
          votedAt: true,
        },
      });
    });
  });
}); 