import { Controller, Post, Param, Request, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../auth/auth.guard';
import { AccommodationService } from './accommodation.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('accommodation')
@ApiBearerAuth()
@Controller('projects/:projectId/accommodation')
@UseGuards(AuthGuard)
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate an accommodation option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the accommodation' })
  @ApiResponse({ status: 200, description: 'Accommodation validated successfully' })
  async validateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.accommodationService.validateOption(projectId, id, req.user.id);
  }

  @Post(':id/unvalidate')
  @ApiOperation({ summary: 'Unvalidate an accommodation option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'id', description: 'ID of the accommodation' })
  @ApiResponse({ status: 200, description: 'Accommodation unvalidated successfully' })
  async unvalidateOption(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.accommodationService.unvalidateOption(projectId, id, req.user.id);
  }

  @Get('validated')
  @ApiOperation({ summary: 'Get validated accommodation option' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'Returns the validated accommodation option' })
  async getValidatedOption(@Param('projectId') projectId: string) {
    return this.accommodationService.getValidatedOption(projectId);
  }
} 