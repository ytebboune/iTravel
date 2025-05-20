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
exports.StoryController = void 0;
const common_1 = require("@nestjs/common");
const story_service_1 = require("./story.service");
const auth_guard_1 = require("../../core/auth/auth.guard");
const get_user_decorator_1 = require("../../core/auth/decorators/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const create_story_dto_1 = require("./dto/create-story.dto");
let StoryController = class StoryController {
    constructor(service) {
        this.service = service;
    }
    async create(userId, createStoryDto) {
        return this.service.create(userId, createStoryDto);
    }
    async findAll(userId) {
        return this.service.findAll(userId);
    }
    async findOne(id, userId) {
        return this.service.findOne(id, userId);
    }
    async remove(id, userId) {
        return this.service.remove(id, userId);
    }
    async view(id, userId) {
        return this.service.view(id, userId);
    }
    async getUserStories(userId, currentUserId) {
        return this.service.getUserStories(userId);
    }
};
exports.StoryController = StoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une story' }),
    (0, swagger_1.ApiBody)({ type: create_story_dto_1.CreateStoryDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Story créée avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_story_dto_1.CreateStoryDto]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les stories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des stories' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une story' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la story' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Story trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une story' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la story' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Story supprimée avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/view'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer une story comme vue' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la story' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Story marquée comme vue avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "view", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les stories d\'un utilisateur' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des stories de l\'utilisateur' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "getUserStories", null);
exports.StoryController = StoryController = __decorate([
    (0, swagger_1.ApiTags)('stories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('stories'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [story_service_1.StoryService])
], StoryController);
//# sourceMappingURL=story.controller.js.map