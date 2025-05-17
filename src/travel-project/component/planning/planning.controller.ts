import { Controller, Post, Body, Param, Get, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('planning')
@ApiBearerAuth()
@Controller('projects/:projectId/planning')
@UseGuards(AuthGuard)
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  @ApiOperation({ summary: 'Add an activity to planning' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiBody({ description: 'Activity data' })
  @ApiResponse({ status: 201, description: 'Activity added to planning successfully' })
  addActivityToPlanning(
    @Param('projectId') projectId: string,
    @Body() dto: any,
    @Request() req,
  ) {
    return this.planningService.addActivityToPlanning(projectId, dto, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a planning activity' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the planning activity' })
  @ApiBody({ description: 'Updated activity data' })
  @ApiResponse({ status: 200, description: 'Planning activity updated successfully' })
  updatePlanningActivity(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: any,
    @Request() req,
  ) {
    return this.planningService.updatePlanningActivity(projectId, id, dto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an activity from planning' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the planning activity' })
  @ApiResponse({ status: 200, description: 'Activity removed from planning successfully' })
  removeActivityFromPlanning(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.planningService.removeActivityFromPlanning(projectId, id, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get planning for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'Returns the planning for the project' })
  getPlanning(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.planningService.getPlanning(projectId, req.user.sub);
  }
} 