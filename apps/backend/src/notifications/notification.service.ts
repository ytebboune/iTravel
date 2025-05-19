import { Injectable, Logger } from '@nestjs/common';
import { NotificationType } from './notification.types';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async notify(type: NotificationType, data: any) {
    // Log de la notification
    this.logger.log(`Notification: ${type}`, data);

    // TODO: Implémenter l'envoi de notifications
    // - Email via SendGrid/Mailgun
    // - Push notifications via Firebase
    // - Webhooks pour intégrations externes
  }

  async notifyProjectCreated(projectId: string, creatorId: string) {
    await this.notify(NotificationType.PROJECT_CREATED, {
      projectId,
      creatorId,
    });
  }

  async notifyParticipantAdded(projectId: string, userId: string) {
    await this.notify(NotificationType.PARTICIPANT_ADDED, {
      projectId,
      userId,
    });
  }

  async notifyVoteAdded(projectId: string, userId: string, itemId: string) {
    await this.notify(NotificationType.VOTE_ADDED, {
      projectId,
      userId,
      itemId,
    });
  }
} 