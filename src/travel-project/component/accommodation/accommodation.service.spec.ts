import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationService } from './accommodation.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { ForbiddenException } from '@nestjs/common';

describe('AccommodationService', () => {
  let service: AccommodationService;
  let prisma: PrismaService;
  let notificationService: NotificationService;

  const mockPrisma = {
    travelProject: {
      findUnique: jest.fn(),
    },
    accommodation: {
      updateMany: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockNotificationService = {
    notify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<AccommodationService>(AccommodationService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  describe('validateOption', () => {
    const projectId = 'project-1';
    const accommodationId = 'accommodation-1';
    const creatorId = 'creator-1';
    const nonCreatorId = 'user-2';

    it('should validate an option when user is project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });
      mockPrisma.accommodation.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.accommodation.update.mockResolvedValue({ id: accommodationId, isSelected: true });

      const result = await service.validateOption(projectId, accommodationId, creatorId);

      expect(result.isSelected).toBe(true);
      expect(mockPrisma.accommodation.updateMany).toHaveBeenCalledWith({
        where: { projectId, isSelected: true },
        data: { isSelected: false, selectedAt: null },
      });
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });

      await expect(service.validateOption(projectId, accommodationId, nonCreatorId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('unvalidateOption', () => {
    const projectId = 'project-1';
    const accommodationId = 'accommodation-1';
    const creatorId = 'creator-1';
    const nonCreatorId = 'user-2';

    it('should unvalidate an option when user is project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });
      mockPrisma.accommodation.update.mockResolvedValue({ id: accommodationId, isSelected: false });

      const result = await service.unvalidateOption(projectId, accommodationId, creatorId);

      expect(result.isSelected).toBe(false);
      expect(mockNotificationService.notify).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not project creator', async () => {
      mockPrisma.travelProject.findUnique.mockResolvedValue({ id: projectId, creatorId });

      await expect(service.unvalidateOption(projectId, accommodationId, nonCreatorId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('getValidatedOption', () => {
    const projectId = 'project-1';
    const validatedAccommodation = { id: 'accommodation-1', isSelected: true };

    it('should return the validated accommodation option', async () => {
      mockPrisma.accommodation.findFirst.mockResolvedValue(validatedAccommodation);

      const result = await service.getValidatedOption(projectId);

      expect(result).toEqual(validatedAccommodation);
      expect(mockPrisma.accommodation.findFirst).toHaveBeenCalledWith({
        where: { projectId, isSelected: true },
      });
    });
  });
}); 