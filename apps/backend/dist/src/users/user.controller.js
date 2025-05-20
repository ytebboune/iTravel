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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const auth_guard_1 = require("../core/auth/auth.guard");
const get_user_decorator_1 = require("../core/auth/decorators/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const get_profile_dto_1 = require("./dto/get-profile.dto");
const follow_request_dto_1 = require("./dto/follow-request.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(userId) {
        return this.userService.getProfile(userId, userId);
    }
    async updateProfile(userId, updateUserDto) {
        return this.userService.updateProfile(userId, updateUserDto);
    }
    async followUser(followerId, followingId) {
        return this.userService.followUser(followerId, followingId);
    }
    async unfollowUser(followerId, followingId) {
        return this.userService.unfollowUser(followerId, followingId);
    }
    async getFollowers(userId) {
        return this.userService.getFollowers(userId);
    }
    async getFollowing(userId) {
        return this.userService.getFollowing(userId);
    }
    async getFeed(userId, page, limit) {
        return this.userService.getFeed(userId, page, limit);
    }
    async getProfileById(userId, targetUserId) {
        return this.userService.getProfile(userId, targetUserId);
    }
    async getPublicProfile(targetUserId) {
        return this.userService.getPublicProfile(targetUserId);
    }
    async requestFollow(requesterId, targetId) {
        return this.userService.requestFollow(requesterId, targetId);
    }
    async acceptFollowRequest(userId, requestId) {
        return this.userService.acceptFollowRequest(userId, requestId);
    }
    async rejectFollowRequest(userId, requestId) {
        return this.userService.rejectFollowRequest(userId, requestId);
    }
    async getPendingFollowRequests(userId) {
        return this.userService.getPendingFollowRequests(userId);
    }
    async getSentFollowRequests(userId) {
        return this.userService.getSentFollowRequests(userId);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer son propre profil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil utilisateur', type: get_profile_dto_1.GetProfileDto }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)(':id/follow'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "followUser", null);
__decorate([
    (0, common_1.Delete)(':id/follow'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unfollowUser", null);
__decorate([
    (0, common_1.Get)(':id/followers'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)(':id/following'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFollowing", null);
__decorate([
    (0, common_1.Get)('feed'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le profil d\'un utilisateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil utilisateur', type: get_profile_dto_1.GetProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfileById", null);
__decorate([
    (0, common_1.Get)('public-profile/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le profil public d\'un utilisateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil public utilisateur', type: get_profile_dto_1.GetProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPublicProfile", null);
__decorate([
    (0, common_1.Post)(':id/request-follow'),
    (0, swagger_1.ApiOperation)({ summary: 'Envoyer une demande de follow' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur à suivre' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Demande de follow envoyée', type: follow_request_dto_1.FollowRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Demande déjà existante ou utilisateur déjà suivi' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "requestFollow", null);
__decorate([
    (0, common_1.Post)('follow-requests/:requestId/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accepter une demande de follow' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'ID de la demande de follow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Demande acceptée' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Demande non trouvée' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acceptFollowRequest", null);
__decorate([
    (0, common_1.Post)('follow-requests/:requestId/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeter une demande de follow' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'ID de la demande de follow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Demande rejetée' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Demande non trouvée' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "rejectFollowRequest", null);
__decorate([
    (0, common_1.Get)('follow-requests/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les demandes de follow en attente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des demandes en attente', type: [follow_request_dto_1.FollowRequestDto] }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPendingFollowRequests", null);
__decorate([
    (0, common_1.Get)('follow-requests/sent'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les demandes de follow envoyées' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des demandes envoyées', type: [follow_request_dto_1.FollowRequestDto] }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSentFollowRequests", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map