import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Req,
    UseGuards,
    Request,
    NotFoundException,
} from '@nestjs/common';
import { TravelProjectService } from './travel-project.service';
import { CreateTravelProjectDto } from './dto/create-travel-project.dto';
import { UpdateTravelProjectDto } from './dto/update-travel-project.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AddDestinationDto } from './dto/add-destination.dto';

@Controller('travel-project')
@UseGuards(AuthGuard)
export class TravelProjectController {
    constructor(private readonly travelProjectService: TravelProjectService) { }

    @Post()
    create(@Body() dto: CreateTravelProjectDto, @Req() req) {
        return this.travelProjectService.create(dto, req.user.sub);
    }

    @Get()
    findAll(@Req() req) {
        return this.travelProjectService.findAllByUser(req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.travelProjectService.findOneIfAuthorized(id, req.user.sub);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTravelProjectDto, @Req() req) {
        return this.travelProjectService.update(id, dto, req.user.sub);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.travelProjectService.remove(id, req.user.sub);
    }

    @Post(':id/participants')
    addParticipant(
      @Param('id') projectId: string,
      @Body() dto: AddParticipantDto,
      @Req() req,
    ) {
      return this.travelProjectService.addParticipant(
        projectId,
        dto,                // ← on passe DTO complet
        req.user.sub,
      );
    }
    

    @Get(':id/destinations')
    getDestinations(@Param('id') projectId: string, @Req() req) {
        return this.travelProjectService.loadDestinations(projectId);
    }

    @Post(':id/destinations')
    addDestination(
        @Param('id') projectId: string,
        @Body() dto: AddDestinationDto,
        @Req() req,
    ) {
        return this.travelProjectService.addDestination(
            projectId,
            dto,
            req.user.sub,
        );
    }

    @Post(':id/destinations/:destId/vote')
    voteDestination(
        @Param('id') projectId: string,
        @Param('destId') destId: string,
        @Req() req,
    ) {
        return this.travelProjectService.voteDestination(
            projectId,
            destId,
            req.user.sub,
        );
    }

    @Get('share/:shareCode')
    async getProjectByShareCode(@Param('shareCode') shareCode: string) {
        const project = await this.travelProjectService.findByShareCode(shareCode);
        if (!project) {
            throw new NotFoundException('Projet non trouvé');
        }
        return project;
    }

    @Post('share/:shareCode/join')
    @UseGuards(AuthGuard)
    async joinProject(@Param('shareCode') shareCode: string, @Request() req) {
        return this.travelProjectService.joinByShareCode(shareCode, req.user.id);
    }
}

