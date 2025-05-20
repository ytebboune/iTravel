import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { CommentEvent, VoteEvent, SelectionEvent, ErrorEvent, WebSocketUser } from './websocket.types';
export declare class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    server: Server;
    private readonly logger;
    private connectedClients;
    constructor(configService: ConfigService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleError(client: Socket, error: ErrorEvent): void;
    handleJoinProject(client: Socket, projectId: string): void;
    handleLeaveProject(client: Socket, projectId: string): void;
    handleNewComment(client: Socket, data: CommentEvent): void;
    handleNewNotification(client: Socket, data: {
        userId: string;
        notification: any;
    }): void;
    handleVoteUpdate(client: Socket, data: VoteEvent): void;
    handleSelectionUpdate(client: Socket, data: SelectionEvent): void;
    handleDeleteComment(client: Socket, data: CommentEvent): void;
    handleDeleteVote(client: Socket, data: VoteEvent): void;
    handleRemoveSelection(client: Socket, data: SelectionEvent): void;
    registerUser(userId: string, clientId: string): void;
    unregisterUser(userId: string, clientId: string): void;
    handleRegister(client: Socket, user: WebSocketUser): void;
    handleUnregister(client: Socket, user: WebSocketUser): void;
}
