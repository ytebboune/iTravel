import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export enum NotificationType {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PARTICIPANT_ADDED = 'PARTICIPANT_ADDED',
  VOTE_ADDED = 'VOTE_ADDED',
  VOTE_DELETED = 'VOTE_DELETED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  TRANSPORT_SELECTED = 'TRANSPORT_SELECTED',
  ACCOMMODATION_SELECTED = 'ACCOMMODATION_SELECTED',
}

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