import { Controller, Post, Get, Body, Param, UseGuards, Delete, Put, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { AuthGuard } from '../../core/auth/auth.guard';
import { GetUser } from '../../core/auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateVisitedPlaceDto } from './dto/create-visited-place.dto';
import { UpdateVisitedPlaceDto } from './dto/update-visited-place.dto';

@ApiTags('places')
@ApiBearerAuth()
@Controller('places')
@UseGuards(AuthGuard)
export class PlaceController {
  constructor(private readonly service: PlaceService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un lieu visité' })
  @ApiBody({ type: CreateVisitedPlaceDto })
  @ApiResponse({ status: 201, description: 'Lieu visité créé avec succès' })
  async create(
    @GetUser('id') userId: string,
    @Body() createVisitedPlaceDto: CreateVisitedPlaceDto,
  ) {
    return this.service.create(userId, createVisitedPlaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les lieux visités' })
  @ApiResponse({ status: 200, description: 'Liste des lieux visités' })
  async findAll(@GetUser('id') userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un lieu visité' })
  @ApiParam({ name: 'id', description: 'ID du lieu visité' })
  @ApiResponse({ status: 200, description: 'Lieu visité trouvé' })
  async findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.findOne(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un lieu visité' })
  @ApiParam({ name: 'id', description: 'ID du lieu visité' })
  @ApiBody({ type: UpdateVisitedPlaceDto })
  @ApiResponse({ status: 200, description: 'Lieu visité mis à jour avec succès' })
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateVisitedPlaceDto: UpdateVisitedPlaceDto,
  ) {
    return this.service.update(id, userId, updateVisitedPlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un lieu visité' })
  @ApiParam({ name: 'id', description: 'ID du lieu visité' })
  @ApiResponse({ status: 200, description: 'Lieu visité supprimé avec succès' })
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.remove(id, userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des lieux' })
  @ApiResponse({ status: 200, description: 'Liste des lieux trouvés' })
  async search(
    @Query('query') query: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.search(query, userId);
  }
} 