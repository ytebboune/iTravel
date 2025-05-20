"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebsocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(WebsocketGateway_1.name);
        this.connectedClients = new Map();
    }
    afterInit() {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client) {
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
    handleDisconnect(client) {
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
    handleError(client, error) {
        this.logger.error(`WebSocket error: ${error.message}`, error.details);
        client.emit('error', error);
    }
    handleJoinProject(client, projectId) {
        try {
            client.join(`project:${projectId}`);
            this.logger.log(`Client ${client.id} joined project room: ${projectId}`);
        }
        catch (error) {
            this.handleError(client, {
                code: 'JOIN_ERROR',
                message: 'Failed to join project room',
                details: error,
            });
        }
    }
    handleLeaveProject(client, projectId) {
        try {
            client.leave(`project:${projectId}`);
            this.logger.log(`Client ${client.id} left project room: ${projectId}`);
        }
        catch (error) {
            this.handleError(client, {
                code: 'LEAVE_ERROR',
                message: 'Failed to leave project room',
                details: error,
            });
        }
    }
    handleNewComment(client, data) {
        try {
            this.server.to(`project:${data.projectId}`).emit('commentReceived', data);
        }
        catch (error) {
            this.handleError(client, {
                code: 'COMMENT_ERROR',
                message: 'Failed to send comment',
                details: error,
            });
        }
    }
    handleNewNotification(client, data) {
        try {
            const userSockets = this.connectedClients.get(data.userId);
            if (userSockets) {
                userSockets.forEach(socketId => {
                    this.server.to(socketId).emit('notificationReceived', data.notification);
                });
            }
        }
        catch (error) {
            this.handleError(client, {
                code: 'NOTIFICATION_ERROR',
                message: 'Failed to send notification',
                details: error,
            });
        }
    }
    handleVoteUpdate(client, data) {
        try {
            this.server.to(`project:${data.projectId}`).emit('voteReceived', data);
        }
        catch (error) {
            this.handleError(client, {
                code: 'VOTE_ERROR',
                message: 'Failed to send vote update',
                details: error,
            });
        }
    }
    handleSelectionUpdate(client, data) {
        try {
            this.server.to(`project:${data.projectId}`).emit('selectionReceived', data);
        }
        catch (error) {
            this.handleError(client, {
                code: 'SELECTION_ERROR',
                message: 'Failed to send selection update',
                details: error,
            });
        }
    }
    handleDeleteComment(client, data) {
        try {
            this.server.to(`project:${data.projectId}`).emit('commentDeleted', data);
        }
        catch (error) {
            this.handleError(client, {
                code: 'DELETE_COMMENT_ERROR',
                message: 'Failed to delete comment',
                details: error,
            });
        }
    }
    handleDeleteVote(client, data) {
        try {
            this.server.to(`project:${data.projectId}`).emit('voteDeleted', data);
        }
        catch (error) {
            this.handleError(client, {
                code: 'DELETE_VOTE_ERROR',
                message: 'Failed to delete vote',
                details: error,
            });
        }
    }
    handleRemoveSelection(client, data) {
        try {
            this.server.to(`project:${data.projectId}`).emit('selectionRemoved', data);
        }
        catch (error) {
            this.handleError(client, {
                code: 'REMOVE_SELECTION_ERROR',
                message: 'Failed to remove selection',
                details: error,
            });
        }
    }
    registerUser(userId, clientId) {
        if (!this.connectedClients.has(userId)) {
            this.connectedClients.set(userId, new Set());
        }
        const userClients = this.connectedClients.get(userId);
        if (userClients) {
            userClients.add(clientId);
        }
    }
    unregisterUser(userId, clientId) {
        const userClients = this.connectedClients.get(userId);
        if (userClients) {
            userClients.delete(clientId);
            if (userClients.size === 0) {
                this.connectedClients.delete(userId);
            }
        }
    }
    handleRegister(client, user) {
        this.logger.log(`Registering user ${user.id} with client ${client.id}`);
        if (!this.connectedClients.has(user.id)) {
            this.connectedClients.set(user.id, new Set());
        }
        this.connectedClients.get(user.id)?.add(client.id);
    }
    handleUnregister(client, user) {
        this.logger.log(`Unregistering user ${user.id} with client ${client.id}`);
        const userClients = this.connectedClients.get(user.id);
        if (userClients) {
            userClients.delete(client.id);
            if (userClients.size === 0) {
                this.connectedClients.delete(user.id);
            }
        }
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinProject'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinProject", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveProject'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleLeaveProject", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newComment'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleNewComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newNotification'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleNewNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('voteUpdate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleVoteUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('selectionUpdate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleSelectionUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteComment'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleDeleteComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteVote'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleDeleteVote", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeSelection'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleRemoveSelection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unregister'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleUnregister", null);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'travel-project',
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map