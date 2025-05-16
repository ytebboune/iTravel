import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { NotificationType } from '../../../notifications/notification.types';

@Injectable()
export class AccommodationService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async validateOption(projectId: string, accommodationId: string, userId: string) {
    // Vérifier que l'utilisateur est le créateur du projet
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can validate options');
    }

    // Désélectionner toutes les autres options
    await this.prisma.accommodation.updateMany({
      where: {
        projectId,
        isSelected: true,
      },
      data: {
        isSelected: false,
        selectedAt: null,
      },
    });

    // Sélectionner l'option
    const accommodation = await this.prisma.accommodation.update({
      where: {
        id: accommodationId,
      },
      data: {
        isSelected: true,
        selectedAt: new Date(),
      },
    });

    // Notifier les participants
    await this.notificationService.notify(NotificationType.ACCOMMODATION_SELECTED, {
      projectId,
      accommodationId,
      userId,
    });

    return accommodation;
  }

  async unvalidateOption(projectId: string, accommodationId: string, userId: string) {
    // Vérifier que l'utilisateur est le créateur du projet
    const project = await this.prisma.travelProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.creatorId !== userId) {
      throw new ForbiddenException('Only the project creator can unvalidate options');
    }

    // Désélectionner l'option
    const accommodation = await this.prisma.accommodation.update({
      where: {
        id: accommodationId,
      },
      data: {
        isSelected: false,
        selectedAt: null,
      },
    });

    // Notifier les participants
    await this.notificationService.notify(NotificationType.ACCOMMODATION_SELECTED, {
      projectId,
      accommodationId,
      userId,
    });

    return accommodation;
  }

  async getValidatedOption(projectId: string) {
    return this.prisma.accommodation.findFirst({
      where: {
        projectId,
        isSelected: true,
      },
    });
  }
} 