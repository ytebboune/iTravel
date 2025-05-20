"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@itravel/shared");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor() {
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async notify(type, data) {
        this.logger.log(`Notification: ${type}`, data);
    }
    async notifyProjectCreated(projectId, creatorId) {
        await this.notify(shared_1.NotificationType.PROJECT_INVITATION, {
            projectId,
            creatorId,
        });
    }
    async notifyParticipantAdded(projectId, userId) {
        await this.notify(shared_1.NotificationType.PROJECT_UPDATE, {
            projectId,
            userId,
        });
    }
    async notifyVoteAdded(projectId, userId, itemId) {
        await this.notify(shared_1.NotificationType.VOTE_ADDED, {
            projectId,
            userId,
            itemId,
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)()
], NotificationService);
//# sourceMappingURL=notification.service.js.map