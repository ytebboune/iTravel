import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WebSocketEvents,
  CommentEvent,
  VoteEvent,
  SelectionEvent,
  ErrorEvent,
  ComponentType,
  WebSocketUser,
} from './websocket.types';

@WebSocketGateway({
  cors: {
    origin: '*', // À configurer en production
  },
  namespace: 'travel-project',
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private connectedClients: Map<string, Set<string>> = new Map(); // userId -> Set<socketId>

  constructor(private configService: ConfigService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (!userId) {
      this.handleError(client, {
        code: 'AUTH_REQUIRED',
        message: 'User ID is required for connection',
      });
      client.disconnect();
      return;
    }

    if (!this.connectedClients.has(userId)) {
      this.connectedClients.set(userId, new Set());
    }
    const userClients = this.connectedClients.get(userId);
    if (userClients) {
      userClients.add(client.id);
    }

    this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      const userClients = this.connectedClients.get(userId);
      if (userClients) {
        userClients.delete(client.id);
        if (userClients.size === 0) {
          this.connectedClients.delete(userId);
        }
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleError(client: Socket, error: ErrorEvent) {
    this.logger.error(`WebSocket error: ${error.message}`, error.details);
    client.emit('error', error);
  }

  // Méthode pour rejoindre une room de projet
  @SubscribeMessage('joinProject')
  handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectId: string,
  ) {
    try {
      client.join(`project:${projectId}`);
      this.logger.log(`Client ${client.id} joined project room: ${projectId}`);
    } catch (error) {
      this.handleError(client, {
        code: 'JOIN_ERROR',
        message: 'Failed to join project room',
        details: error,
      });
    }
  }

  // Méthode pour quitter une room de projet
  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectId: string,
  ) {
    try {
      client.leave(`project:${projectId}`);
      this.logger.log(`Client ${client.id} left project room: ${projectId}`);
    } catch (error) {
      this.handleError(client, {
        code: 'LEAVE_ERROR',
        message: 'Failed to leave project room',
        details: error,
      });
    }
  }

  // Méthode pour envoyer un nouveau commentaire
  @SubscribeMessage('newComment')
  handleNewComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CommentEvent,
  ) {
    try {
      this.server.to(`project:${data.projectId}`).emit('commentReceived', data);
    } catch (error) {
      this.handleError(client, {
        code: 'COMMENT_ERROR',
        message: 'Failed to send comment',
        details: error,
      });
    }
  }

  // Méthode pour envoyer une nouvelle notification
  @SubscribeMessage('newNotification')
  handleNewNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; notification: any },
  ) {
    try {
      const userSockets = this.connectedClients.get(data.userId);
      if (userSockets) {
        userSockets.forEach(socketId => {
          this.server.to(socketId).emit('notificationReceived', data.notification);
        });
      }
    } catch (error) {
      this.handleError(client, {
        code: 'NOTIFICATION_ERROR',
        message: 'Failed to send notification',
        details: error,
      });
    }
  }

  // Méthode pour envoyer une mise à jour de vote
  @SubscribeMessage('voteUpdate')
  handleVoteUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: VoteEvent,
  ) {
    try {
      this.server.to(`project:${data.projectId}`).emit('voteReceived', data);
    } catch (error) {
      this.handleError(client, {
        code: 'VOTE_ERROR',
        message: 'Failed to send vote update',
        details: error,
      });
    }
  }

  // Méthode pour envoyer une mise à jour de sélection
  @SubscribeMessage('selectionUpdate')
  handleSelectionUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SelectionEvent,
  ) {
    try {
      this.server.to(`project:${data.projectId}`).emit('selectionReceived', data);
    } catch (error) {
      this.handleError(client, {
        code: 'SELECTION_ERROR',
        message: 'Failed to send selection update',
        details: error,
      });
    }
  }

  // Méthode pour supprimer un commentaire
  @SubscribeMessage('deleteComment')
  handleDeleteComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CommentEvent,
  ) {
    try {
      this.server.to(`project:${data.projectId}`).emit('commentDeleted', data);
    } catch (error) {
      this.handleError(client, {
        code: 'DELETE_COMMENT_ERROR',
        message: 'Failed to delete comment',
        details: error,
      });
    }
  }

  // Méthode pour supprimer un vote
  @SubscribeMessage('deleteVote')
  handleDeleteVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: VoteEvent,
  ) {
    try {
      this.server.to(`project:${data.projectId}`).emit('voteDeleted', data);
    } catch (error) {
      this.handleError(client, {
        code: 'DELETE_VOTE_ERROR',
        message: 'Failed to delete vote',
        details: error,
      });
    }
  }

  // Méthode pour supprimer une sélection
  @SubscribeMessage('removeSelection')
  handleRemoveSelection(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SelectionEvent,
  ) {
    try {
      this.server.to(`project:${data.projectId}`).emit('selectionRemoved', data);
    } catch (error) {
      this.handleError(client, {
        code: 'REMOVE_SELECTION_ERROR',
        message: 'Failed to remove selection',
        details: error,
      });
    }
  }

  registerUser(userId: string, clientId: string) {
    if (!this.connectedClients.has(userId)) {
      this.connectedClients.set(userId, new Set());
    }
    const userClients = this.connectedClients.get(userId);
    if (userClients) {
      userClients.add(clientId);
    }
  }

  unregisterUser(userId: string, clientId: string) {
    const userClients = this.connectedClients.get(userId);
    if (userClients) {
      userClients.delete(clientId);
      if (userClients.size === 0) {
        this.connectedClients.delete(userId);
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, user: WebSocketUser) {
    this.logger.log(`Registering user ${user.id} with client ${client.id}`);
    if (!this.connectedClients.has(user.id)) {
      this.connectedClients.set(user.id, new Set());
    }
    this.connectedClients.get(user.id)?.add(client.id);
  }

  @SubscribeMessage('unregister')
  handleUnregister(client: Socket, user: WebSocketUser) {
    this.logger.log(`Unregistering user ${user.id} with client ${client.id}`);
    const userClients = this.connectedClients.get(user.id);
    if (userClients) {
      userClients.delete(client.id);
      if (userClients.size === 0) {
        this.connectedClients.delete(user.id);
      }
    }
  }
} 