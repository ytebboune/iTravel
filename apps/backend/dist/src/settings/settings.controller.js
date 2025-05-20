"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const auth_guard_1 = require("../core/auth/auth.guard");
const get_user_decorator_1 = require("../core/auth/decorators/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const update_password_dto_1 = require("./dto/update-password.dto");
const update_privacy_dto_1 = require("./dto/update-privacy.dto");
let SettingsController = class SettingsController {
    constructor(service) {
        this.service = service;
    }
    async getSettings(userId) {
        return this.service.getSettings(userId);
    }
    async updatePassword(userId, updatePasswordDto) {
        return this.service.updatePassword(userId, updatePasswordDto);
    }
    async updatePrivacy(userId, updatePrivacyDto) {
        return this.service.updatePrivacy(userId, updatePrivacyDto);
    }
    async updateNotificationSettings(userId, settings) {
        return this.service.updateNotificationSettings(userId, settings);
    }
    async deleteAccount(userId) {
        return this.service.deleteAccount(userId);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les paramètres de l\'utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paramètres récupérés avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)('password'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le mot de passe' }),
    (0, swagger_1.ApiBody)({ type: update_password_dto_1.UpdatePasswordDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mot de passe mis à jour avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Put)('privacy'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour les paramètres de confidentialité' }),
    (0, swagger_1.ApiBody)({ type: update_privacy_dto_1.UpdatePrivacyDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paramètres de confidentialité mis à jour avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_privacy_dto_1.UpdatePrivacyDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updatePrivacy", null);
__decorate([
    (0, common_1.Put)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour les paramètres de notification' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { email: { type: 'boolean' }, push: { type: 'boolean' } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paramètres de notification mis à jour avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateNotificationSettings", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer le compte' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compte supprimé avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "deleteAccount", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('settings'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map