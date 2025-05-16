import { Test, TestingModule } from '@nestjs/testing';
import { TravelProjectService } from './travel-project.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTravelProjectDto } from './dto/create-travel-project.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TravelProjectService', () => {
  let service: TravelProjectService;
  let prisma: PrismaService;

  const userId = 'user-1';
  const createDto: CreateTravelProjectDto = {
    title: 'Test Project',
    description: 'Test Description',
  };

  const expectedAccommodation = {
    id: 'accommodation-1',
    projectId: 'project-1',
    name: 'Hotel Test',
    address: '123 Test St',
    price: 100,
    link: null,
    type: 'HOTEL',
    isSelected: false,
    selectedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const expectedProject = {
    id: 'project-1',
    title: createDto.title,
    description: createDto.description,
    creatorId: userId,
    shareCode: 'abc123',
    status: 'DRAFT',
    participants: [{ id: 'participant-1', projectId: 'project-1', userId, joinedAt: new Date() }],
    accommodations: [expectedAccommodation],
  };

  const mockPrisma = {
    travelProject: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    projectUser: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelProjectService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TravelProjectService>(TravelProjectService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new travel project with creator as participant', async () => {
      mockPrisma.travelProject.create.mockResolvedValue(expectedProject);

      const result = await service.create(createDto, userId);

      expect(result).toEqual(expectedProject);
      const anyResult = result as any;
      expect(Object.prototype.hasOwnProperty.call(anyResult, 'shareCode')).toBe(true);
      expect(typeof anyResult.shareCode).toBe('string');
      expect(anyResult.shareCode.length).toBeGreaterThanOrEqual(6);
      expect(mockPrisma.travelProject.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          description: createDto.description,
          creatorId: userId,
          participants: {
            create: {
              userId: userId,
            },
          },
          shareCode: expect.any(String),
          status: 'DRAFT',
        },
        include: {
          accommodations: true,
          participants: true,
        },
      });
    });

    it('should create a project with only title when description is not provided', async () => {
      const dtoWithoutDescription = { title: 'Test Project' };
      const expectedProjectWithoutDescription = {
        ...expectedProject,
        description: null,
      };

      mockPrisma.travelProject.create.mockResolvedValue(expectedProjectWithoutDescription);

      const result = await service.create(dtoWithoutDescription, userId);

      expect(result).toEqual(expectedProjectWithoutDescription);
      expect(mockPrisma.travelProject.create).toHaveBeenCalledWith({
        data: {
          title: dtoWithoutDescription.title,
          description: undefined,
          creatorId: userId,
          participants: {
            create: {
              userId: userId,
            },
          },
          shareCode: expect.any(String),
          status: 'DRAFT',
        },
        include: {
          accommodations: true,
          participants: true,
        },
      });
    });

    it('should throw an error if project creation fails', async () => {
      mockPrisma.travelProject.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto, userId)).rejects.toThrow('Database error');
    });
  });

  describe('shareCode functionality', () => {
    const shareCode = 'abc123';
    const project = {
      ...expectedProject,
      participants: [],
    };

    it('should generate a share code when creating a project', async () => {
      const createDto = { title: 'Test Project' };
      const expectedProjectWithShareCode = {
        ...expectedProject,
        title: createDto.title,
        shareCode: 'abcdef',
        participants: [{ id: 'participant-1', projectId: 'project-1', userId, joinedAt: new Date() }],
      };
      mockPrisma.travelProject.create.mockResolvedValue(expectedProjectWithShareCode);

      const result = await service.create(createDto, userId);

      const anyResult = result as any;
      expect(Object.prototype.hasOwnProperty.call(anyResult, 'shareCode')).toBe(true);
      expect(typeof anyResult.shareCode).toBe('string');
      expect(anyResult.shareCode.length).toBeGreaterThanOrEqual(6);
    });

    it('should find a project by share code', async () => {
      mockPrisma.travelProject.findFirst.mockResolvedValue(project);

      const result = await service.findByShareCode(shareCode);

      expect(result).toEqual(project);
      expect(mockPrisma.travelProject.findFirst).toHaveBeenCalledWith({
        where: { shareCode },
        include: expect.any(Object),
      });
    });

    it('should allow a user to join a project using share code', async () => {
      const projectWithParticipants = {
        ...expectedProject,
        participants: [],
      };
      mockPrisma.travelProject.findFirst.mockResolvedValue(projectWithParticipants);
      mockPrisma.projectUser.create.mockResolvedValue({ projectId: projectWithParticipants.id, userId });
      mockPrisma.travelProject.findUnique = jest.fn().mockResolvedValue({ ...projectWithParticipants, participants: [{ id: 'participant-2', projectId: projectWithParticipants.id, userId, joinedAt: new Date() }], });

      const result = await service.joinByShareCode('abc123', userId);

      expect(result).toEqual({ ...projectWithParticipants, participants: [{ id: 'participant-2', projectId: projectWithParticipants.id, userId, joinedAt: expect.any(Date) }] });
      expect(mockPrisma.projectUser.create).toHaveBeenCalledWith({
        data: {
          projectId: projectWithParticipants.id,
          userId,
        },
      });
    });

    it('should throw error when joining with invalid share code', async () => {
      mockPrisma.travelProject.findFirst.mockResolvedValue(null);

      await expect(service.joinByShareCode('invalid', userId))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw error when user is already a participant', async () => {
      const projectWithParticipant = {
        ...project,
        participants: [{ userId }],
      };

      mockPrisma.travelProject.findFirst.mockResolvedValue(projectWithParticipant);

      await expect(service.joinByShareCode(shareCode, userId))
        .rejects
        .toThrow(ConflictException);
    });
  });
});
