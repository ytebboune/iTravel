import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '../../../notifications/notification.types';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { TravelProject } from '@prisma/client';

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

    const isMember = project.creatorId === userId || 
      project.participants.some(p => p.userId === userId);

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return project;
  }

  async addActivityToPlanning(
    projectId: string,
    userId: string,
    data: {
      activityId?: string;
      date: Date;
      startTime: Date;
      endTime: Date;
      notes?: string;
    },
  ) {
    await this.authorize(projectId, userId);

    const planningActivity = await this.prisma.planningActivity.create({
      data: {
        projectId,
        activityId: data.activityId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
      },
      include: {
        activity: true,
      },
    });

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('planningActivityAdded', {
        type: 'planning',
        projectId,
        planningActivity,
      });

    await this.notificationService.notify(NotificationType.PLANNING_ACTIVITY_ADDED, {
      projectId,
      userId,
      data: {
        message: 'New activity added to planning',
        planningActivityId: planningActivity.id,
      },
    });

    return planningActivity;
  }

  async updatePlanningActivity(
    projectId: string,
    planningActivityId: string,
    userId: string,
    data: {
      date?: Date;
      startTime?: Date;
      endTime?: Date;
      notes?: string;
    },
  ) {
    await this.authorize(projectId, userId);

    const planningActivity = await this.prisma.planningActivity.update({
      where: { id: planningActivityId },
      data,
      include: {
        activity: true,
      },
    });

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('planningActivityUpdated', {
        type: 'planning',
        projectId,
        planningActivity,
      });

    await this.notificationService.notify(NotificationType.PLANNING_ACTIVITY_UPDATED, {
      projectId,
      userId,
      data: {
        message: 'Planning activity updated',
        planningActivityId: planningActivity.id,
      },
    });

    return planningActivity;
  }

  async removeActivityFromPlanning(
    projectId: string,
    planningActivityId: string,
    userId: string,
  ) {
    await this.authorize(projectId, userId);

    const planningActivity = await this.prisma.planningActivity.delete({
      where: { id: planningActivityId },
      include: {
        activity: true,
      },
    });

    this.websocketGateway.server
      .to(`project:${projectId}`)
      .emit('planningActivityRemoved', {
        type: 'planning',
        projectId,
        planningActivityId,
      });

    await this.notificationService.notify(NotificationType.PLANNING_ACTIVITY_REMOVED, {
      projectId,
      userId,
      data: {
        message: 'Activity removed from planning',
        planningActivityId,
      },
    });

    return planningActivity;
  }

  async getPlanning(projectId: string, userId: string) {
    await this.authorize(projectId, userId);

    return this.prisma.planningActivity.findMany({
      where: { projectId },
      include: {
        activity: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }
} 