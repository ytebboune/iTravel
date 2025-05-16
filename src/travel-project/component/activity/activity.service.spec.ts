import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ActivityService', () => {
  let service: ActivityService;
  let prisma: PrismaService;
  let notificationService: NotificationService;
  let websocketGateway: WebsocketGateway;

  const mockPrisma = {
    travelProject: {
      findUnique: jest.fn(),
    },
    activity: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    activityVote: {
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
        ActivityService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: WebsocketGateway, useValue: mockWebsocketGateway },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
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

  describe('createActivity', () => {
    const projectId = 'project-1';
    const userId = 'user-1';
    const activityData = {
      title: 'Test Activity',
      description: 'Test Description',
      imageUrl: 'http://example.com/image.jpg',
      suggestedByAI: false,
    };

    it('should create a new activity', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const activity = {
        id: 'activity-1',
        ...activityData,
        projectId,
        addedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.activity.create.mockResolvedValue(activity);

      const result = await service.createActivity(projectId, userId, activityData);

      expect(result).toEqual(activity);
      expect(mockPrisma.activity.create).toHaveBeenCalledWith({
        data: {
          projectId,
          ...activityData,
          addedBy: userId,
        },
      });
      expect(mockNotificationService.notify).toHaveBeenCalled();
      expect(mockWebsocketGateway.server.to).toHaveBeenCalled();
    });
  });

  describe('getActivities', () => {
    const projectId = 'project-1';
    const userId = 'user-1';

    it('should return all activities for a project', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const activities = [
        {
          id: 'activity-1',
          title: 'Activity 1',
          description: 'Description 1',
          projectId,
          addedBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          votes: [],
        },
      ];

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.activity.findMany.mockResolvedValue(activities);

      const result = await service.getActivities(projectId, userId);

      expect(result).toEqual(activities);
      expect(mockPrisma.activity.findMany).toHaveBeenCalledWith({
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
    const activityId = 'activity-1';
    const userId = 'user-1';
    const vote = true;
    const comment = 'Test comment';

    it('should create or update a vote', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const activity = {
        id: activityId,
        projectId,
      };

      const voteData = {
        id: 'vote-1',
        projectId,
        activityId,
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
      mockPrisma.activity.findUnique.mockResolvedValue(activity);
      mockPrisma.activityVote.upsert.mockResolvedValue(voteData);

      const result = await service.vote(projectId, activityId, userId, vote, comment);

      expect(result).toEqual(voteData);
      expect(mockPrisma.activityVote.upsert).toHaveBeenCalled();
      expect(mockNotificationService.notify).toHaveBeenCalled();
      expect(mockWebsocketGateway.server.to).toHaveBeenCalled();
    });
  });

  describe('deleteVote', () => {
    const projectId = 'project-1';
    const activityId = 'activity-1';
    const userId = 'user-1';

    it('should delete a vote', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const activity = {
        id: activityId,
        projectId,
      };

      const vote = {
        id: 'vote-1',
        projectId,
        activityId,
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
      mockPrisma.activity.findUnique.mockResolvedValue(activity);
      mockPrisma.activityVote.delete.mockResolvedValue(vote);

      const result = await service.deleteVote(projectId, activityId, userId);

      expect(result).toEqual(vote);
      expect(mockPrisma.activityVote.delete).toHaveBeenCalled();
      expect(mockNotificationService.notify).toHaveBeenCalled();
      expect(mockWebsocketGateway.server.to).toHaveBeenCalled();
    });
  });

  describe('getVoters', () => {
    const activityId = 'activity-1';
    const userId = 'user-1';

    it('should return all voters for an activity', async () => {
      const activity = {
        id: activityId,
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

      mockPrisma.activity.findUnique.mockResolvedValue(activity);
      mockPrisma.travelProject.findUnique.mockResolvedValue({
        id: 'project-1',
        creatorId: userId,
        participants: [],
      });
      mockPrisma.activityVote.findMany.mockResolvedValue(votes);

      const result = await service.getVoters(activityId, userId);

      expect(result).toEqual(votes);
      expect(mockPrisma.activityVote.findMany).toHaveBeenCalledWith({
        where: { activityId },
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

    it('should return aggregated votes for all activities', async () => {
      const project = {
        id: projectId,
        creatorId: userId,
        participants: [],
      };

      const votes = [
        {
          activityId: 'activity-1',
          userId: 'user-1',
          vote: true,
          comment: 'Test comment',
          votedAt: new Date(),
        },
      ];

      mockPrisma.travelProject.findUnique.mockResolvedValue(project);
      mockPrisma.activityVote.findMany.mockResolvedValue(votes);

      const result = await service.getVotes(projectId, userId);

      expect(result).toEqual([
        {
          activityId: 'activity-1',
          upvotes: 1,
          downvotes: 0,
          userVote: true,
          comment: 'Test comment',
          score: 1,
        },
      ]);
      expect(mockPrisma.activityVote.findMany).toHaveBeenCalledWith({
        where: { projectId },
        select: {
          activityId: true,
          userId: true,
          vote: true,
          comment: true,
          votedAt: true,
        },
      });
    });
  });
}); 