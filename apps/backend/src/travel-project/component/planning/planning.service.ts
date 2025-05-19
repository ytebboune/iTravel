import { Injectable, Logger, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '@itravel/shared';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { TravelProject } from '@prisma/client';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { AddActivityToPlanningDto } from './dto/add-activity-to-planning.dto';

@Injectable()
export class PlanningService {
  private readonly logger = new Logger(PlanningService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async authorize(projectId: string, userId: string): Promise<TravelProject> {
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
      include: { participants: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.creatorId !== userId && !project.participants.some(p => p.userId === userId)) {
      throw new ForbiddenException('User is not a member of this project');
    }

    return project;
  }

  async create(projectId: string, userId: string, createPlanningDto: CreatePlanningDto) {
    await this.authorize(projectId, userId);

    const planning = await this.prisma.planning.create({
      data: {
        projectId,
        name: createPlanningDto.name,
        description: createPlanningDto.description,
      },
    });

    await this.notificationService.notify(NotificationType.PLANNING_ACTIVITY_ADDED, {
      projectId,
      userId,
      data: {
        planningId: planning.id,
      },
    });

    this.websocketGateway.server.to(projectId).emit('planning:created', planning);

    return planning;
  }

  async getPlanning(projectId: string, userId: string) {
    await this.authorize(projectId, userId);

    return this.prisma.planning.findFirst({
      where: { projectId },
      include: {
        activities: {
          include: {
            activity: true,
          },
          orderBy: [
            { date: 'asc' },
            { startTime: 'asc' },
          ],
        },
      },
    });
  }

  private async checkActivityConflict(
    projectId: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    excludeActivityId?: string,
  ): Promise<boolean> {
    const where = {
      projectId,
      date,
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gte: startTime } },
          ],
        },
        {
          AND: [
            { startTime: { lte: endTime } },
            { endTime: { gte: endTime } },
          ],
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    };

    if (excludeActivityId) {
      where['id'] = { not: excludeActivityId };
    }

    const conflictingActivity = await this.prisma.planningActivity.findFirst({ where });
    return !!conflictingActivity;
  }

  async addActivityToPlanning(projectId: string, userId: string, data: AddActivityToPlanningDto) {
    await this.authorize(projectId, userId);

    const date = new Date(data.date);
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    const hasConflict = await this.checkActivityConflict(projectId, date, startTime, endTime);
    if (hasConflict) {
      throw new ConflictException('Cette activité chevauche une autre activité existante');
    }

    const planning = await this.prisma.planning.findFirst({
      where: { projectId },
    });

    if (!planning) {
      throw new NotFoundException('Planning not found for this project');
    }

    const planningActivity = await this.prisma.planningActivity.create({
      data: {
        project: { connect: { id: projectId } },
        planning: { connect: { id: planning.id } },
        activity: data.activityId ? { connect: { id: data.activityId } } : undefined,
        date,
        startTime,
        endTime,
        notes: data.notes,
      },
      include: {
        activity: true,
      },
    });

    await this.notificationService.notify(NotificationType.PLANNING_ACTIVITY_ADDED, {
      projectId,
      userId,
      data: {
        planningActivityId: planningActivity.id,
      },
    });

    this.websocketGateway.server.to(projectId).emit('planning:activity_added', planningActivity);

    return planningActivity;
  }

  async updatePlanningActivity(
    projectId: string,
    activityId: string,
    userId: string,
    data: AddActivityToPlanningDto,
  ) {
    await this.authorize(projectId, userId);

    const date = new Date(data.date);
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    const hasConflict = await this.checkActivityConflict(projectId, date, startTime, endTime, activityId);
    if (hasConflict) {
      throw new ConflictException('Cette activité chevauche une autre activité existante');
    }

    const planningActivity = await this.prisma.planningActivity.update({
      where: { id: activityId },
      data: {
        activity: data.activityId ? { connect: { id: data.activityId } } : undefined,
        date,
        startTime,
        endTime,
        notes: data.notes,
      },
      include: {
        activity: true,
      },
    });

    await this.notificationService.notify(NotificationType.PLANNING_ACTIVITY_UPDATED, {
      projectId,
      userId,
      data: {
        planningActivityId: planningActivity.id,
      },
    });

    this.websocketGateway.server.to(projectId).emit('planning:activity_updated', planningActivity);

    return planningActivity;
  }

  async removeActivityFromPlanning(projectId: string, activityId: string, userId: string) {
    await this.authorize(projectId, userId);

    const planningActivity = await this.prisma.planningActivity.delete({
      where: { id: activityId },
      include: {
        activity: true,
      },
    });

    await this.notificationService.notify(NotificationType.PLANNING_ACTIVITY_REMOVED, {
      projectId,
      userId,
      data: {
        planningActivityId: activityId,
      },
    });

    this.websocketGateway.server.to(projectId).emit('planning:activity_removed', { activityId });

    return planningActivity;
  }
} 