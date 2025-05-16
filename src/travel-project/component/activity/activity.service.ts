import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../../../notifications/notification.service';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  // Méthode pour créer une activité
  async createActivity(projectId: string, userId: string, dto: { title: string; description: string; imageUrl?: string; suggestedByAI?: boolean; }) {
    // À implémenter
    return {};
  }

  // Méthode pour récupérer les activités d'un projet
  async getActivities(projectId: string, userId: string) {
    // À implémenter
    return [];
  }

  // Méthode pour récupérer les activités prédéfinies
  async getPredefinedActivities(category?: string) {
    // À implémenter
    return [];
  }
} 