import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreateVisitedPlaceDto } from './dto/create-visited-place.dto';
import { UpdateVisitedPlaceDto } from './dto/update-visited-place.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('places')
@UseGuards(AuthGuard)
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('visited')
  async markPlaceAsVisited(
    @Request() req,
    @Body() createVisitedPlaceDto: CreateVisitedPlaceDto,
  ) {
    return this.placeService.markPlaceAsVisited(req.user.sub, createVisitedPlaceDto);
  }

  @Put('visited/:id')
  async updateVisitedPlace(
    @Request() req,
    @Param('id') placeId: string,
    @Body() updateVisitedPlaceDto: UpdateVisitedPlaceDto,
  ) {
    return this.placeService.updateVisitedPlace(req.user.sub, placeId, updateVisitedPlaceDto);
  }

  @Delete('visited/:id')
  async deleteVisitedPlace(
    @Request() req,
    @Param('id') placeId: string,
  ) {
    return this.placeService.deleteVisitedPlace(req.user.sub, placeId);
  }

  @Get('visited')
  async getUserVisitedPlaces(@Request() req) {
    return this.placeService.getUserVisitedPlaces(req.user.sub);
  }

  @Get('cities/:id/visitors')
  async getCityVisitors(@Param('id') cityId: string) {
    return this.placeService.getCityVisitors(cityId);
  }

  @Get('countries/:id/visitors')
  async getCountryVisitors(@Param('id') countryId: string) {
    return this.placeService.getCountryVisitors(countryId);
  }

  @Get('popular')
  async getPopularPlaces(@Query('limit') limit?: number) {
    return this.placeService.getPopularPlaces(limit);
  }
} 