import { Controller, Get, Put, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Put('password')
  async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.settingsService.updatePassword(req.user.sub, updatePasswordDto);
  }

  @Put('privacy')
  async updatePrivacy(
    @Request() req,
    @Body() updatePrivacyDto: UpdatePrivacyDto,
  ) {
    return this.settingsService.updatePrivacy(req.user.sub, updatePrivacyDto);
  }

  @Get('privacy')
  async getPrivacySettings(@Request() req) {
    return this.settingsService.getPrivacySettings(req.user.sub);
  }

  @Post('follow-requests/:userId')
  async requestFollow(
    @Request() req,
    @Param('userId') requestedToId: string,
  ) {
    return this.settingsService.requestFollow(req.user.sub, requestedToId);
  }

  @Post('follow-requests/:requestId/handle')
  async handleFollowRequest(
    @Request() req,
    @Param('requestId') requestId: string,
    @Body('accept') accept: boolean,
  ) {
    return this.settingsService.handleFollowRequest(req.user.sub, requestId, accept);
  }

  @Get('follow-requests')
  async getFollowRequests(@Request() req) {
    return this.settingsService.getFollowRequests(req.user.sub);
  }
} 