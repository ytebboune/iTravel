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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notification_service_1 = require("../../core/notifications/notification.service");
const shared_1 = require("@itravel/shared");
const websocket_gateway_1 = require("../../core/websocket/websocket.gateway");
let PostService = class PostService {
    constructor(prisma, notificationService, websocketGateway) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.websocketGateway = websocketGateway;
    }
    async create(userId, createPostDto) {
        const { photos, ...data } = createPostDto;
        const post = await this.prisma.post.create({
            data: {
                ...data,
                userId,
                photos: {
                    create: photos?.map(url => ({ url })) || [],
                },
            },
            include: {
                user: true,
                likes: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
                photos: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.POST_CREATED, {
            userId,
            data: {
                postId: post.id,
            },
        });
        this.websocketGateway.server.to(userId).emit('post:created', post);
        return post;
    }
    async findAll(userId) {
        return this.prisma.post.findMany({
            include: {
                user: true,
                likes: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
                photos: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                user: true,
                likes: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
                photos: true,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post;
    }
    async update(id, userId, updatePostDto) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own posts');
        }
        const { photos, ...data } = updatePostDto;
        const updatedPost = await this.prisma.post.update({
            where: { id },
            data: {
                ...data,
                photos: {
                    deleteMany: {},
                    create: photos?.map(url => ({ url })) || [],
                },
            },
            include: {
                user: true,
                likes: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
                photos: true,
            },
        });
        this.websocketGateway.server.to(userId).emit('post:updated', updatedPost);
        return updatedPost;
    }
    async remove(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.prisma.post.delete({
            where: { id },
        });
        this.websocketGateway.server.to(userId).emit('post:deleted', { id });
        return { message: 'Post deleted successfully' };
    }
    async like(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const like = await this.prisma.like.create({
            data: {
                postId: id,
                userId,
            },
            include: {
                user: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.POST_LIKED, {
            userId: post.userId,
            data: {
                postId: id,
                likedBy: userId,
            },
        });
        this.websocketGateway.server.to(post.userId).emit('post:liked', {
            postId: id,
            likedBy: userId,
        });
        return like;
    }
    async unlike(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        await this.prisma.like.deleteMany({
            where: {
                postId: id,
                userId,
            },
        });
        this.websocketGateway.server.to(post.userId).emit('post:unliked', {
            postId: id,
            unlikedBy: userId,
        });
        return { message: 'Post unliked successfully' };
    }
    async comment(id, userId, content) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const comment = await this.prisma.comment.create({
            data: {
                content,
                userId,
            },
            include: {
                user: true,
            },
        });
        await this.notificationService.notify(shared_1.NotificationType.POST_COMMENTED, {
            userId: post.userId,
            data: {
                postId: id,
                commentId: comment.id,
                commentedBy: userId,
            },
        });
        this.websocketGateway.server.to(post.userId).emit('post:commented', {
            postId: id,
            comment,
        });
        return comment;
    }
    async deleteComment(id, commentId, userId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.prisma.comment.delete({
            where: { id: commentId },
        });
        this.websocketGateway.server.to(userId).emit('post:comment_deleted', {
            postId: id,
            commentId,
        });
        return { message: 'Comment deleted successfully' };
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        websocket_gateway_1.WebsocketGateway])
], PostService);
//# sourceMappingURL=post.service.js.map