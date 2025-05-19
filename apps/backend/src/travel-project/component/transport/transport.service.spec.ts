import { Test, TestingModule } from '@nestjs/testing';
import { TransportService } from './transport.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UrlValidator } from '../../../utils/url-validator';
import { MonitoringService } from '../../../monitoring/monitoring.service';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';

describe('TransportService', () => {
  let service: TransportService;
  let prisma: PrismaService;
  let notificationService: NotificationService;
  let urlValidator: UrlValidator;
  let monitoringService: MonitoringService;
  let websocketGateway: WebsocketGateway;

  const mockPrisma = {
    travelProject: {
      findUnique: jest.fn(),
    },
    transportOption: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
    },
    transportVote: {
      upsert: jest.fn(),
    },
    transportComment: {
      create: jest.fn(),
    },
  };

  const mockNotificationService = {
    notify: jest.fn(),
  };

  const mockUrlValidator = {
    // Add any necessary mock methods for UrlValidator
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
        TransportService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: UrlValidator, useValue: mockUrlValidator },
        { provide: MonitoringService, useValue: mockMonitoringService },
        { provide: WebsocketGateway, useValue: mockWebsocketGateway },
      ],
    }).compile();

    service = module.get<TransportService>(TransportService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationService = module.get<NotificationService>(NotificationService);
    urlValidator = module.get<UrlValidator>(UrlValidator);
    monitoringService = module.get<MonitoringService>(MonitoringService);
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
    const transportId = 'transport-1';
    const creatorId = 'creator-1';
    const nonCreatorId = 'user-2';

    it('should validate an option when user is project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });
      mockPrisma.transportOption.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.transportOption.update.mockResolvedValue({ id: transportId, isSelected: true });

      const result = await service.validateOption(projectId, transportId, creatorId);

      expect(result.isSelected).toBe(true);
      expect(mockPrisma.transportOption.updateMany).toHaveBeenCalledWith({
        where: { projectId, isSelected: true },
        data: { isSelected: false },
      });
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });

      await expect(service.validateOption(projectId, transportId, nonCreatorId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('unvalidateOption', () => {
    const projectId = 'project-1';
    const transportId = 'transport-1';
    const creatorId = 'creator-1';
    const nonCreatorId = 'user-2';

    it('should unvalidate an option when user is project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });
      mockPrisma.transportOption.update.mockResolvedValue({ id: transportId, isSelected: false });

      const result = await service.unvalidateOption(projectId, transportId, creatorId);

      expect(result.isSelected).toBe(false);
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });

      await expect(service.unvalidateOption(projectId, transportId, nonCreatorId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('getValidatedOption', () => {
    const projectId = 'project-1';
    const validatedTransport = { id: 'transport-1', isSelected: true };

    it('should return the validated transport option', async () => {
      mockPrisma.transportOption.findFirst.mockResolvedValue(validatedTransport);

      const result = await service.getValidatedOption(projectId);

      expect(result).toEqual(validatedTransport);
      expect(mockPrisma.transportOption.findFirst).toHaveBeenCalledWith({
        where: { projectId, isSelected: true },
      });
    });
  });
}); 