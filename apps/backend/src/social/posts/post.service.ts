import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { NotificationType } from '@itravel/shared';
import { WebsocketGateway } from '../../core/websocket/websocket.gateway';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
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

    await this.notificationService.notify(NotificationType.POST_CREATED, {
      userId,
      data: {
        postId: post.id,
      },
    });

    this.websocketGateway.server.to(userId).emit('post:created', post);

    return post;
  }

  async findAll(userId: string) {
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

  async findOne(id: string, userId: string) {
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
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
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

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    this.websocketGateway.server.to(userId).emit('post:deleted', { id });

    return { message: 'Post deleted successfully' };
  }

  async like(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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

    await this.notificationService.notify(NotificationType.POST_LIKED, {
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

  async unlike(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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

  async comment(id: string, userId: string, content: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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

    await this.notificationService.notify(NotificationType.POST_COMMENTED, {
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

  async deleteComment(id: string, commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
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
} 