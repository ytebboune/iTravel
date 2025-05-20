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
exports.AccommodationController = void 0;
const common_1 = require("@nestjs/common");
const accommodation_service_1 = require("./accommodation.service");
const swagger_1 = require("@nestjs/swagger");
const filter_accommodation_dto_1 = require("./dto/filter-accommodation.dto");
const add_comment_dto_1 = require("./dto/add-comment.dto");
const create_availability_dto_1 = require("./dto/create-availability.dto");
const update_availability_dto_1 = require("./dto/update-availability.dto");
const add_photo_dto_1 = require("./dto/add-photo.dto");
const create_accommodation_dto_1 = require("./dto/create-accommodation.dto");
const auth_guard_1 = require("../../../core/auth/auth.guard");
const get_user_decorator_1 = require("../../../core/auth/decorators/get-user.decorator");
let AccommodationController = class AccommodationController {
    constructor(service) {
        this.service = service;
    }
    async create(projectId, userId, createAccommodationDto) {
        return this.service.create(projectId, userId, createAccommodationDto);
    }
    async findAll(projectId, userId) {
        return this.service.findAll(projectId, userId);
    }
    async vote(projectId, id, userId, vote, comment) {
        return this.service.vote(projectId, id, userId, vote, comment);
    }
    async deleteVote(projectId, id, userId) {
        return this.service.deleteVote(projectId, id, userId);
    }
    async getVoters(id, userId) {
        return this.service.getVoters(id, userId);
    }
    async getVotes(projectId, userId) {
        return this.service.getVotes(projectId, userId);
    }
    async validateOption(projectId, id, userId) {
        return this.service.validateOption(projectId, id, userId);
    }
    async unvalidateOption(projectId, id, userId) {
        return this.service.unvalidateOption(projectId, id, userId);
    }
    async getValidatedOption(projectId) {
        return this.service.getValidatedOption(projectId);
    }
    async filter(projectId, query, userId) {
        return this.service.filter(projectId, query, userId);
    }
    async checkAvailability(id, start, end, userId) {
        return this.service.checkAvailability(id, start, end, userId);
    }
    async addAvailability(id, createAvailabilityDto, userId) {
        return this.service.addAvailability(id, createAvailabilityDto, userId);
    }
    async getAvailability(id, userId) {
        return this.service.getAvailability(id, userId);
    }
    async addComment(id, addCommentDto, userId) {
        return this.service.addComment(id, addCommentDto, userId);
    }
    async deleteComment(id, commentId, userId) {
        return this.service.deleteComment(id, commentId, userId);
    }
    async getComments(id, userId) {
        return this.service.getComments(id, userId);
    }
    async addPhoto(id, addPhotoDto, userId) {
        return this.service.addPhoto(id, addPhotoDto.url, userId);
    }
    async deletePhoto(id, photoId, userId) {
        return this.service.deletePhoto(id, photoId, userId);
    }
    async getPhotos(id, userId) {
        return this.service.getPhotos(id, userId);
    }
    async updateAvailability(id, availabilityId, updateAvailabilityDto, userId) {
        return this.service.updateAvailability(id, availabilityId, updateAvailabilityDto, userId);
    }
    async deleteAvailability(id, availabilityId, userId) {
        return this.service.deleteAvailability(id, availabilityId, userId);
    }
};
exports.AccommodationController = AccommodationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiBody)({ type: create_accommodation_dto_1.CreateAccommodationDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Hébergement créé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès non autorisé' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_accommodation_dto_1.CreateAccommodationDto]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les hébergements' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des hébergements' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Voter pour un hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { vote: { type: 'boolean' }, comment: { type: 'string' } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote enregistré avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __param(3, (0, common_1.Body)('vote')),
    __param(4, (0, common_1.Body)('comment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "vote", null);
__decorate([
    (0, common_1.Delete)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un vote' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote supprimé avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "deleteVote", null);
__decorate([
    (0, common_1.Get)(':id/voters'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les votants d\'un hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des votants' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "getVoters", null);
__decorate([
    (0, common_1.Get)('votes'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les votes' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des votes' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "getVotes", null);
__decorate([
    (0, common_1.Post)(':id/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Valider un hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hébergement validé avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "validateOption", null);
__decorate([
    (0, common_1.Delete)(':id/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Dévalider un hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hébergement dévalidé avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "unvalidateOption", null);
__decorate([
    (0, common_1.Get)('validated'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer l\'hébergement validé' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hébergement validé' }),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "getValidatedOption", null);
__decorate([
    (0, common_1.Get)('filter'),
    (0, swagger_1.ApiOperation)({ summary: 'Filtrer les hébergements' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiBody)({ type: filter_accommodation_dto_1.FilterAccommodationDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des hébergements filtrés' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_accommodation_dto_1.FilterAccommodationDto, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "filter", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Vérifier la disponibilité' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut de disponibilité' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __param(3, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Post)(':id/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une disponibilité' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiBody)({ type: create_availability_dto_1.CreateAvailabilityDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Disponibilité ajoutée avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_availability_dto_1.CreateAvailabilityDto, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "addAvailability", null);
__decorate([
    (0, common_1.Get)(':id/availability/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les disponibilités' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des disponibilités' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un commentaire' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiBody)({ type: add_comment_dto_1.AddCommentDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Commentaire ajouté avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_comment_dto_1.AddCommentDto, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "addComment", null);
__decorate([
    (0, common_1.Delete)(':id/comments/:commentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un commentaire' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'ID du commentaire' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commentaire supprimé avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les commentaires' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des commentaires' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(':id/photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une photo' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiBody)({ type: add_photo_dto_1.AddPhotoDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Photo ajoutée avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_photo_dto_1.AddPhotoDto, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Delete)(':id/photos/:photoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une photo' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'photoId', description: 'ID de la photo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Photo supprimée avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('photoId')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Get)(':id/photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les photos' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des photos' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "getPhotos", null);
__decorate([
    (0, common_1.Put)(':id/availability/:availabilityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une disponibilité' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'availabilityId', description: 'ID de la disponibilité' }),
    (0, swagger_1.ApiBody)({ type: update_availability_dto_1.UpdateAvailabilityDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disponibilité mise à jour avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('availabilityId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_availability_dto_1.UpdateAvailabilityDto, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Delete)(':id/availability/:availabilityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une disponibilité' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'hébergement' }),
    (0, swagger_1.ApiParam)({ name: 'availabilityId', description: 'ID de la disponibilité' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disponibilité supprimée avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('availabilityId')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccommodationController.prototype, "deleteAvailability", null);
exports.AccommodationController = AccommodationController = __decorate([
    (0, swagger_1.ApiTags)('accommodation'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects/:projectId/accommodations'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [accommodation_service_1.AccommodationService])
], AccommodationController);
//# sourceMappingURL=accommodation.controller.js.map