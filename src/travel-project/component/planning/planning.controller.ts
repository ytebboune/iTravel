import { Controller, Post, Body, Param, Get, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('projects/:projectId/planning')
@UseGuards(AuthGuard)
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  addActivityToPlanning(
    @Param('projectId') projectId: string,
    @Body() dto: any,
    @Request() req,
  ) {
    return this.planningService.addActivityToPlanning(projectId, dto, req.user.sub);
  }

  @Put(':id')
  updatePlanningActivity(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: any,
    @Request() req,
  ) {
    return this.planningService.updatePlanningActivity(projectId, id, dto, req.user.sub);
  }

  @Delete(':id')
  removeActivityFromPlanning(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.planningService.removeActivityFromPlanning(projectId, id, req.user.sub);
  }

  @Get()
  getPlanning(
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    return this.planningService.getPlanning(projectId, req.user.sub);
  }
} 