import { Controller, Post, Get, Body, Param, UseGuards, Delete, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../../core/auth/auth.guard';
import { GetUser } from '../../core/auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post créé avec succès' })
  async create(
    @GetUser('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.service.create(userId, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les posts' })
  @ApiResponse({ status: 200, description: 'Liste des posts' })
  async findAll(@GetUser('id') userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({ status: 200, description: 'Post trouvé' })
  async findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.findOne(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'Post mis à jour avec succès' })
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.service.update(id, userId, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({ status: 200, description: 'Post supprimé avec succès' })
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.remove(id, userId);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Liker un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({ status: 200, description: 'Post liké avec succès' })
  async like(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.like(id, userId);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Unliker un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({ status: 200, description: 'Like supprimé avec succès' })
  async unlike(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.unlike(id, userId);
  }

  @Post(':id/comment')
  @ApiOperation({ summary: 'Commenter un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiBody({ schema: { properties: { content: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Commentaire ajouté avec succès' })
  async comment(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.service.comment(id, userId, content);
  }

  @Delete(':id/comments/:commentId')
  @ApiOperation({ summary: 'Supprimer un commentaire' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiParam({ name: 'commentId', description: 'ID du commentaire' })
  @ApiResponse({ status: 200, description: 'Commentaire supprimé avec succès' })
  async deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.deleteComment(id, commentId, userId);
  }
} 