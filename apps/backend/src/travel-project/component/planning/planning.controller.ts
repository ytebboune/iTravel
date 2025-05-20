import { Controller, Post, Get, Body, Param, UseGuards, Delete, Put } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { AddActivityToPlanningDto } from './dto/add-activity-to-planning.dto';
import { AuthGuard } from 'src/core/auth/auth.guard';
import { GetUser } from 'src/core/auth/decorators/get-user.decorator';

@ApiTags('planning')
@ApiBearerAuth()
@Controller('projects/:projectId/planning')
@UseGuards(AuthGuard)
export class PlanningController {
  constructor(private readonly service: PlanningService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un planning' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiBody({ type: CreatePlanningDto })
  @ApiResponse({ status: 201, description: 'Planning créé avec succès' })
  async create(
    @Param('projectId') projectId: string,
    @GetUser('id') userId: string,
    @Body() createPlanningDto: CreatePlanningDto,
  ) {
    return this.service.create(projectId, userId, createPlanningDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer le planning' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiResponse({ status: 200, description: 'Planning récupéré avec succès' })
  async getPlanning(
    @Param('projectId') projectId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.getPlanning(projectId, userId);
  }

  @Post('activities')
  @ApiOperation({ summary: 'Ajouter une activité au planning' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiBody({ type: AddActivityToPlanningDto })
  @ApiResponse({ status: 201, description: 'Activité ajoutée avec succès' })
  async addActivity(
    @Param('projectId') projectId: string,
    @GetUser('id') userId: string,
    @Body() addActivityDto: AddActivityToPlanningDto,
  ) {
    return this.service.addActivityToPlanning(projectId, userId, addActivityDto);
  }

  @Put('activities/:activityId')
  @ApiOperation({ summary: 'Mettre à jour une activité du planning' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'activityId', description: 'ID de l\'activité' })
  @ApiBody({ type: AddActivityToPlanningDto })
  @ApiResponse({ status: 200, description: 'Activité mise à jour avec succès' })
  async updateActivity(
    @Param('projectId') projectId: string,
    @Param('activityId') activityId: string,
    @GetUser('id') userId: string,
    @Body() updateActivityDto: AddActivityToPlanningDto,
  ) {
    return this.service.updatePlanningActivity(projectId, activityId, userId, updateActivityDto);
  }

  @Delete('activities/:activityId')
  @ApiOperation({ summary: 'Supprimer une activité du planning' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'activityId', description: 'ID de l\'activité' })
  @ApiResponse({ status: 200, description: 'Activité supprimée avec succès' })
  async deleteActivity(
    @Param('projectId') projectId: string,
    @Param('activityId') activityId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.removeActivityFromPlanning(projectId, activityId, userId);
  }
} 