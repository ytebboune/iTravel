import { Test, TestingModule } from '@nestjs/testing';
import { DateSuggestionService } from './date-suggestion.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('DateSuggestionService', () => {
  let service: DateSuggestionService;
  let prisma: PrismaService;
  let notificationService: NotificationService;
  let websocketGateway: WebsocketGateway;

  const mockPrisma = {
    travelProject: {
      findUnique: jest.fn(),
    },
    dateSuggestion: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
    },
    dateVote: {
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
        DateSuggestionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: WebsocketGateway, useValue: mockWebsocketGateway },
      ],
    }).compile();

    service = module.get<DateSuggestionService>(DateSuggestionService);
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

  describe('validateOption', () => {
    const projectId = 'project-1';
    const dateId = 'date-1';
    const creatorId = 'creator-1';
    const nonCreatorId = 'user-2';

    it('should validate an option when user is project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId,
        participants: [] 
      });
      mockPrisma.dateSuggestion.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.dateSuggestion.update.mockResolvedValue({ 
        id: dateId, 
        isSelected: true,
        selectedAt: new Date() 
      });

      const result = await service.validateOption(projectId, dateId, creatorId);

      expect(result.isSelected).toBe(true);
      expect(mockPrisma.dateSuggestion.updateMany).toHaveBeenCalledWith({
        where: { projectId, isSelected: true },
        data: { isSelected: false, selectedAt: null },
      });
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId,
        participants: [{ userId: nonCreatorId }] 
      });

      await expect(service.validateOption(projectId, dateId, nonCreatorId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('unvalidateOption', () => {
    const projectId = 'project-1';
    const dateId = 'date-1';
    const creatorId = 'creator-1';
    const nonCreatorId = 'user-2';

    it('should unvalidate an option when user is project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId,
        participants: [] 
      });
      mockPrisma.dateSuggestion.update.mockResolvedValue({ 
        id: dateId, 
        isSelected: false,
        selectedAt: null 
      });

      const result = await service.unvalidateOption(projectId, dateId, creatorId);

      expect(result.isSelected).toBe(false);
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId,
        participants: [{ userId: nonCreatorId }] 
      });

      await expect(service.unvalidateOption(projectId, dateId, nonCreatorId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('getValidatedOption', () => {
    const projectId = 'project-1';
    const validatedDate = { id: 'date-1', isSelected: true };

    it('should return the validated date option', async () => {
      mockPrisma.dateSuggestion.findFirst.mockResolvedValue(validatedDate);

      const result = await service.getValidatedOption(projectId);

      expect(result).toEqual(validatedDate);
      expect(mockPrisma.dateSuggestion.findFirst).toHaveBeenCalledWith({
        where: { projectId, isSelected: true },
      });
    });
  });

  describe('vote', () => {
    const projectId = 'project-1';
    const dateId = 'date-1';
    const userId = 'user-1';
    const vote = true;
    const comment = 'Test comment';

    it('should create a new vote', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId: 'creator-1',
        participants: [{ userId }] 
      });
      mockPrisma.dateSuggestion.findUnique.mockResolvedValue({ 
        id: dateId,
        projectId 
      });
      mockPrisma.dateVote.upsert.mockResolvedValue({
        id: 'vote-1',
        projectId,
        dateId,
        userId,
        vote,
        comment,
        votedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
        },
      });

      const result = await service.vote(projectId, dateId, userId, vote, comment);

      expect(result.vote).toBe(vote);
      expect(result.comment).toBe(comment);
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });
  });

  describe('deleteVote', () => {
    const projectId = 'project-1';
    const dateId = 'date-1';
    const userId = 'user-1';

    it('should delete a vote', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId: 'creator-1',
        participants: [{ userId }] 
      });
      mockPrisma.dateSuggestion.findUnique.mockResolvedValue({ 
        id: dateId,
        projectId 
      });
      mockPrisma.dateVote.delete.mockResolvedValue({
        id: 'vote-1',
        projectId,
        dateId,
        userId,
        vote: true,
        comment: 'Test comment',
        votedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
        },
      });

      const result = await service.deleteVote(projectId, dateId, userId);

      expect(result).toBeDefined();
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });
  });

  describe('getVoters', () => {
    const dateId = 'date-1';
    const userId = 'user-1';

    it('should return all voters for a date', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: 'project-1', 
        creatorId: 'creator-1',
        participants: [{ userId }] 
      });
      mockPrisma.dateSuggestion.findUnique.mockResolvedValue({ 
        id: dateId,
        projectId: 'project-1' 
      });
      mockPrisma.dateVote.findMany.mockResolvedValue([
        {
          userId: 'user-1',
          votedAt: new Date(),
          vote: true,
          comment: 'Test comment',
        },
      ]);

      const result = await service.getVoters(dateId, userId);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user-1');
    });
  });

  describe('getVotes', () => {
    const projectId = 'project-1';
    const userId = 'user-1';

    it('should return vote statistics for all dates', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId: 'creator-1',
        participants: [{ userId }] 
      });
      mockPrisma.dateVote.findMany.mockResolvedValue([
        {
          dateId: 'date-1',
          userId: 'user-1',
          vote: true,
          comment: 'Test comment',
          votedAt: new Date(),
        },
      ]);

      const result = await service.getVotes(projectId, userId);

      expect(result).toHaveLength(1);
      expect(result[0].dateId).toBe('date-1');
      expect(result[0].upvotes).toBe(1);
      expect(result[0].downvotes).toBe(0);
    });
  });

  describe('createDateSuggestion', () => {
    const projectId = 'project-1';
    const userId = 'user-1';
    const data = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
    };

    it('should create a new date suggestion', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId: 'creator-1',
        participants: [{ userId }] 
      });
      mockPrisma.dateSuggestion.create.mockResolvedValue({
        id: 'date-1',
        projectId,
        startDate: data.startDate,
        endDate: data.endDate,
        addedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createDateSuggestion(projectId, userId, data);

      expect(result.projectId).toBe(projectId);
      expect(result.addedBy).toBe(userId);
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });
  });

  describe('getDateSuggestions', () => {
    const projectId = 'project-1';
    const userId = 'user-1';

    it('should return all date suggestions with votes', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ 
        id: projectId, 
        creatorId: 'creator-1',
        participants: [{ userId }] 
      });
      mockPrisma.dateSuggestion.findMany.mockResolvedValue([
        {
          id: 'date-1',
          projectId,
          startDate: new Date(),
          endDate: new Date(),
          addedBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          votes: [
            {
              userId: 'user-1',
              vote: true,
              comment: 'Test comment',
              votedAt: new Date(),
            },
          ],
        },
      ]);

      const result = await service.getDateSuggestions(projectId, userId);

      expect(result).toHaveLength(1);
      expect(result[0].votes).toHaveLength(1);
    });
  });
}); 