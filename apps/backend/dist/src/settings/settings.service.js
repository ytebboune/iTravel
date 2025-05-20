"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../core/notifications/notification.service");
const shared_1 = require("@itravel/shared");
const websocket_gateway_1 = require("../core/websocket/websocket.gateway");
const bcrypt = __importStar(require("bcrypt"));
let SettingsService = class SettingsService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
    }
    async getSettings(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                showEmail: true,
                showVisitedPlaces: true,
                showPosts: true,
                showStories: true,
                notificationSettings: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            privacy: {
                showEmail: user.showEmail,
                showVisitedPlaces: user.showVisitedPlaces,
                showPosts: user.showPosts,
                showStories: user.showStories,
            },
            notifications: user.notificationSettings,
        };
    }
    async updatePassword(userId, updatePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.ForbiddenException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        await this.notificationService.notify(shared_1.NotificationType.SYSTEM, {
            userId,
            data: {
                message: 'Your password has been updated successfully',
            },
        });
        return { message: 'Password updated successfully' };
    }
    async updatePrivacy(userId, updatePrivacyDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                showEmail: updatePrivacyDto.showEmail,
                showVisitedPlaces: updatePrivacyDto.showVisitedPlaces,
                showPosts: updatePrivacyDto.showPosts,
                showStories: updatePrivacyDto.showStories,
            },
        });
        this.websocketGateway.server.to(userId).emit('settings:privacy_updated', {
            showEmail: updatedUser.showEmail,
            showVisitedPlaces: updatedUser.showVisitedPlaces,
            showPosts: updatedUser.showPosts,
            showStories: updatedUser.showStories,
        });
        return {
            showEmail: updatedUser.showEmail,
            showVisitedPlaces: updatedUser.showVisitedPlaces,
            showPosts: updatedUser.showPosts,
            showStories: updatedUser.showStories,
        };
    }
    async updateNotificationSettings(userId, settings) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                notificationSettings: settings,
            },
        });
        this.websocketGateway.server.to(userId).emit('settings:notifications_updated', updatedUser.notificationSettings);
        return updatedUser.notificationSettings;
    }
    async deleteAccount(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.delete({
            where: { id: userId },
        });
        this.websocketGateway.server.to(userId).emit('settings:account_deleted');
        return { message: 'Account deleted successfully' };
    }
    async getPrivacySettings(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                showEmail: true,
                showVisitedPlaces: true,
                showPosts: true,
                showStories: true,
                followers: {
                    select: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
                following: {
                    select: {
                        following: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            showEmail: user.showEmail,
            showVisitedPlaces: user.showVisitedPlaces,
            showPosts: user.showPosts,
            showStories: user.showStories,
            followers: user.followers.map(f => f.follower),
            following: user.following.map(f => f.following),
        };
    }
    async requestFollow(requesterId, requestedToId) {
        if (requesterId === requestedToId) {
            throw new common_1.BadRequestException('You cannot follow yourself');
        }
        const requestedUser = await this.prisma.user.findUnique({
            where: { id: requestedToId },
        });
        if (!requestedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!requestedUser.isPrivate) {
            return this.prisma.follow.create({
                data: {
                    followerId: requesterId,
                    followingId: requestedToId,
                },
            });
        }
        const existingRequest = await this.prisma.followRequest.findUnique({
            where: {
                requesterId_requestedToId: {
                    requesterId,
                    requestedToId,
                },
            },
        });
        if (existingRequest) {
            throw new common_1.BadRequestException('Follow request already exists');
        }
        return this.prisma.followRequest.create({
            data: {
                requesterId,
                requestedToId,
            },
        });
    }
    async handleFollowRequest(userId, requestId, accept) {
        const request = await this.prisma.followRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Follow request not found');
        }
        if (request.requestedToId !== userId) {
            throw new common_1.ForbiddenException('You can only handle your own follow requests');
        }
        if (accept) {
            await this.prisma.follow.create({
                data: {
                    followerId: request.requesterId,
                    followingId: userId,
                },
            });
        }
        await this.prisma.followRequest.update({
            where: { id: requestId },
            data: {
                status: accept ? 'ACCEPTED' : 'REJECTED',
            },
        });
        return { message: accept ? 'Follow request accepted' : 'Follow request rejected' };
    }
    async getFollowRequests(userId) {
        const requests = await this.prisma.followRequest.findMany({
            where: {
                requestedToId: userId,
                status: 'PENDING',
            },
            include: {
                requestedBy: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });
        return requests;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], SettingsService);
//# sourceMappingURL=settings.service.js.map