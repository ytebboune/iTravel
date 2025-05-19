import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Req() req,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(req.user.id, createPostDto);
  }

  @Put(':id')
  async updatePost(
    @Req() req,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(req.user.id, postId, updatePostDto);
  }

  @Delete(':id')
  async deletePost(
    @Req() req,
    @Param('id') postId: string,
  ) {
    return this.postService.deletePost(req.user.id, postId);
  }

  @Post(':id/like')
  async likePost(
    @Req() req,
    @Param('id') postId: string,
  ) {
    return this.postService.likePost(req.user.id, postId);
  }

  @Post(':id/unlike')
  async unlikePost(
    @Req() req,
    @Param('id') postId: string,
  ) {
    return this.postService.unlikePost(req.user.id, postId);
  }

  @Post(':id/comment')
  async addComment(
    @Req() req,
    @Param('id') postId: string,
    @Body('content') content: string,
  ) {
    return this.postService.addComment(req.user.id, postId, content);
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.postService.getPostComments(postId, Number(page), Number(limit));
  }

  @Get(':id')
  async getPost(@Param('id') postId: string) {
    return this.postService.getPost(postId);
  }
} 