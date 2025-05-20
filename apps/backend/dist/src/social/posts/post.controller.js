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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const auth_guard_1 = require("../../core/auth/auth.guard");
const get_user_decorator_1 = require("../../core/auth/decorators/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const create_post_dto_1 = require("./dto/create-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
let PostController = class PostController {
    constructor(service) {
        this.service = service;
    }
    async create(userId, createPostDto) {
        return this.service.create(userId, createPostDto);
    }
    async findAll(userId) {
        return this.service.findAll(userId);
    }
    async findOne(id, userId) {
        return this.service.findOne(id, userId);
    }
    async update(id, userId, updatePostDto) {
        return this.service.update(id, userId, updatePostDto);
    }
    async remove(id, userId) {
        return this.service.remove(id, userId);
    }
    async like(id, userId) {
        return this.service.like(id, userId);
    }
    async unlike(id, userId) {
        return this.service.unlike(id, userId);
    }
    async comment(id, userId, content) {
        return this.service.comment(id, userId, content);
    }
    async deleteComment(id, commentId, userId) {
        return this.service.deleteComment(id, commentId, userId);
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un post' }),
    (0, swagger_1.ApiBody)({ type: create_post_dto_1.CreatePostDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post créé avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des posts' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du post' }),
    (0, swagger_1.ApiBody)({ type: update_post_dto_1.UpdatePostDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post mis à jour avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post supprimé avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, swagger_1.ApiOperation)({ summary: 'Liker un post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post liké avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "like", null);
__decorate([
    (0, common_1.Delete)(':id/like'),
    (0, swagger_1.ApiOperation)({ summary: 'Unliker un post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Like supprimé avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "unlike", null);
__decorate([
    (0, common_1.Post)(':id/comment'),
    (0, swagger_1.ApiOperation)({ summary: 'Commenter un post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du post' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { content: { type: 'string' } } } }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Commentaire ajouté avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "comment", null);
__decorate([
    (0, common_1.Delete)(':id/comments/:commentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un commentaire' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du post' }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'ID du commentaire' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commentaire supprimé avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deleteComment", null);
exports.PostController = PostController = __decorate([
    (0, swagger_1.ApiTags)('posts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('posts'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
//# sourceMappingURL=post.controller.js.map