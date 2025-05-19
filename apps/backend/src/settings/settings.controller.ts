import { Controller, Post, Get, Body, Param, UseGuards, Delete, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer les paramètres de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Paramètres récupérés avec succès' })
  async getSettings(@GetUser('id') userId: string) {
    return this.service.getSettings(userId);
  }

  @Put('password')
  @ApiOperation({ summary: 'Mettre à jour le mot de passe' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Mot de passe mis à jour avec succès' })
  async updatePassword(
    @GetUser('id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.service.updatePassword(userId, updatePasswordDto);
  }

  @Put('privacy')
  @ApiOperation({ summary: 'Mettre à jour les paramètres de confidentialité' })
  @ApiBody({ type: UpdatePrivacyDto })
  @ApiResponse({ status: 200, description: 'Paramètres de confidentialité mis à jour avec succès' })
  async updatePrivacy(
    @GetUser('id') userId: string,
    @Body() updatePrivacyDto: UpdatePrivacyDto,
  ) {
    return this.service.updatePrivacy(userId, updatePrivacyDto);
  }

  @Put('notifications')
  @ApiOperation({ summary: 'Mettre à jour les paramètres de notification' })
  @ApiBody({ schema: { properties: { email: { type: 'boolean' }, push: { type: 'boolean' } } } })
  @ApiResponse({ status: 200, description: 'Paramètres de notification mis à jour avec succès' })
  async updateNotificationSettings(
    @GetUser('id') userId: string,
    @Body() settings: { email: boolean; push: boolean },
  ) {
    return this.service.updateNotificationSettings(userId, settings);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Supprimer le compte' })
  @ApiResponse({ status: 200, description: 'Compte supprimé avec succès' })
  async deleteAccount(@GetUser('id') userId: string) {
    return this.service.deleteAccount(userId);
  }
} 