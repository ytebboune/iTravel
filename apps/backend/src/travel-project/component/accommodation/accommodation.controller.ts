import { Controller, Post, Get, Body, Param, UseGuards, Request, Delete, Put, Query } from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { VoteDto } from '../destination/dto/vote.dto';
import { FilterAccommodationDto } from './dto/filter-accommodation.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { AuthGuard } from 'src/core/auth/auth.guard';
import { GetUser } from 'src/core/auth/decorators/get-user.decorator';

@ApiTags('accommodation')
@ApiBearerAuth()
@Controller('projects/:projectId/accommodations')
@UseGuards(AuthGuard)
export class AccommodationController {
  constructor(private readonly service: AccommodationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un hébergement' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiBody({ type: CreateAccommodationDto })
  @ApiResponse({ status: 201, description: 'Hébergement créé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé' })
  async create(
    @Param('projectId') projectId: string,
    @GetUser('id') userId: string,
    @Body() createAccommodationDto: CreateAccommodationDto,
  ) {
    return this.service.create(projectId, userId, createAccommodationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les hébergements' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiResponse({ status: 200, description: 'Liste des hébergements' })
  async findAll(
    @Param('projectId') projectId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.findAll(projectId, userId);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Voter pour un hébergement' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiBody({ schema: { properties: { vote: { type: 'boolean' }, comment: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Vote enregistré avec succès' })
  async vote(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body('vote') vote: boolean,
    @Body('comment') comment?: string,
  ) {
    return this.service.vote(projectId, id, userId, vote, comment);
  }

  @Delete(':id/vote')
  @ApiOperation({ summary: 'Supprimer un vote' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Vote supprimé avec succès' })
  async deleteVote(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.deleteVote(projectId, id, userId);
  }

  @Get(':id/voters')
  @ApiOperation({ summary: 'Récupérer les votants d\'un hébergement' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Liste des votants' })
  async getVoters(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.getVoters(id, userId);
  }

  @Get('votes')
  @ApiOperation({ summary: 'Récupérer tous les votes' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiResponse({ status: 200, description: 'Liste des votes' })
  async getVotes(
    @Param('projectId') projectId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.getVotes(projectId, userId);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Valider un hébergement' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Hébergement validé avec succès' })
  async validateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.validateOption(projectId, id, userId);
  }

  @Delete(':id/validate')
  @ApiOperation({ summary: 'Dévalider un hébergement' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Hébergement dévalidé avec succès' })
  async unvalidateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.unvalidateOption(projectId, id, userId);
  }

  @Get('validated')
  @ApiOperation({ summary: 'Récupérer l\'hébergement validé' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiResponse({ status: 200, description: 'Hébergement validé' })
  async getValidatedOption(
    @Param('projectId') projectId: string,
  ) {
    return this.service.getValidatedOption(projectId);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filtrer les hébergements' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiBody({ type: FilterAccommodationDto })
  @ApiResponse({ status: 200, description: 'Liste des hébergements filtrés' })
  async filter(
    @Param('projectId') projectId: string,
    @Query() query: FilterAccommodationDto,
    @GetUser('id') userId: string,
  ) {
    return this.service.filter(projectId, query, userId);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Vérifier la disponibilité' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Statut de disponibilité' })
  async checkAvailability(
    @Param('id') id: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.checkAvailability(id, start, end, userId);
  }

  @Post(':id/availability')
  @ApiOperation({ summary: 'Ajouter une disponibilité' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiBody({ type: CreateAvailabilityDto })
  @ApiResponse({ status: 201, description: 'Disponibilité ajoutée avec succès' })
  async addAvailability(
    @Param('id') id: string,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
    @GetUser('id') userId: string,
  ) {
    return this.service.addAvailability(id, createAvailabilityDto, userId);
  }

  @Get(':id/availability/list')
  @ApiOperation({ summary: 'Récupérer les disponibilités' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Liste des disponibilités' })
  async getAvailability(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.getAvailability(id, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Ajouter un commentaire' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiBody({ type: AddCommentDto })
  @ApiResponse({ status: 201, description: 'Commentaire ajouté avec succès' })
  async addComment(
    @Param('id') id: string,
    @Body() addCommentDto: AddCommentDto,
    @GetUser('id') userId: string,
  ) {
    return this.service.addComment(id, addCommentDto, userId);
  }

  @Delete(':id/comments/:commentId')
  @ApiOperation({ summary: 'Supprimer un commentaire' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiParam({ name: 'commentId', description: 'ID du commentaire' })
  @ApiResponse({ status: 200, description: 'Commentaire supprimé avec succès' })
  async deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.deleteComment(id, commentId, userId);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Récupérer les commentaires' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Liste des commentaires' })
  async getComments(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.getComments(id, userId);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Ajouter une photo' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiBody({ type: AddPhotoDto })
  @ApiResponse({ status: 201, description: 'Photo ajoutée avec succès' })
  async addPhoto(
    @Param('id') id: string,
    @Body() addPhotoDto: AddPhotoDto,
    @GetUser('id') userId: string,
  ) {
    return this.service.addPhoto(id, addPhotoDto.url, userId);
  }

  @Delete(':id/photos/:photoId')
  @ApiOperation({ summary: 'Supprimer une photo' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiParam({ name: 'photoId', description: 'ID de la photo' })
  @ApiResponse({ status: 200, description: 'Photo supprimée avec succès' })
  async deletePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.deletePhoto(id, photoId, userId);
  }

  @Get(':id/photos')
  @ApiOperation({ summary: 'Récupérer les photos' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiResponse({ status: 200, description: 'Liste des photos' })
  async getPhotos(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.getPhotos(id, userId);
  }

  @Put(':id/availability/:availabilityId')
  @ApiOperation({ summary: 'Mettre à jour une disponibilité' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiParam({ name: 'availabilityId', description: 'ID de la disponibilité' })
  @ApiBody({ type: UpdateAvailabilityDto })
  @ApiResponse({ status: 200, description: 'Disponibilité mise à jour avec succès' })
  async updateAvailability(
    @Param('id') id: string,
    @Param('availabilityId') availabilityId: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
    @GetUser('id') userId: string,
  ) {
    return this.service.updateAvailability(id, availabilityId, updateAvailabilityDto, userId);
  }

  @Delete(':id/availability/:availabilityId')
  @ApiOperation({ summary: 'Supprimer une disponibilité' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'id', description: 'ID de l\'hébergement' })
  @ApiParam({ name: 'availabilityId', description: 'ID de la disponibilité' })
  @ApiResponse({ status: 200, description: 'Disponibilité supprimée avec succès' })
  async deleteAvailability(
    @Param('id') id: string,
    @Param('availabilityId') availabilityId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.deleteAvailability(id, availabilityId, userId);
  }
} 