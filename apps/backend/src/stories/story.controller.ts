import { Controller, Post, Get, Body, Param, UseGuards, Delete, Put, Query } from '@nestjs/common';
import { StoryService } from './story.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateStoryDto } from './dto/create-story.dto';

@ApiTags('stories')
@ApiBearerAuth()
@Controller('stories')
@UseGuards(AuthGuard)
export class StoryController {
  constructor(private readonly service: StoryService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une story' })
  @ApiBody({ type: CreateStoryDto })
  @ApiResponse({ status: 201, description: 'Story créée avec succès' })
  async create(
    @GetUser('id') userId: string,
    @Body() createStoryDto: CreateStoryDto,
  ) {
    return this.service.create(userId, createStoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les stories' })
  @ApiResponse({ status: 200, description: 'Liste des stories' })
  async findAll(@GetUser('id') userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une story' })
  @ApiParam({ name: 'id', description: 'ID de la story' })
  @ApiResponse({ status: 200, description: 'Story trouvée' })
  async findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.findOne(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une story' })
  @ApiParam({ name: 'id', description: 'ID de la story' })
  @ApiResponse({ status: 200, description: 'Story supprimée avec succès' })
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.remove(id, userId);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Marquer une story comme vue' })
  @ApiParam({ name: 'id', description: 'ID de la story' })
  @ApiResponse({ status: 200, description: 'Story marquée comme vue avec succès' })
  async view(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.view(id, userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer les stories d\'un utilisateur' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des stories de l\'utilisateur' })
  async getUserStories(
    @Param('userId') userId: string,
    @GetUser('id') currentUserId: string,
  ) {
    return this.service.getUserStories(userId);
  }
} 