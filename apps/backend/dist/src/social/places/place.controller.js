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
exports.PlaceController = void 0;
const common_1 = require("@nestjs/common");
const place_service_1 = require("./place.service");
const auth_guard_1 = require("../../core/auth/auth.guard");
const get_user_decorator_1 = require("../../core/auth/decorators/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const create_visited_place_dto_1 = require("./dto/create-visited-place.dto");
const update_visited_place_dto_1 = require("./dto/update-visited-place.dto");
let PlaceController = class PlaceController {
    constructor(service) {
        this.service = service;
    }
    async create(userId, createVisitedPlaceDto) {
        return this.service.create(userId, createVisitedPlaceDto);
    }
    async findAll(userId) {
        return this.service.findAll(userId);
    }
    async findOne(id, userId) {
        return this.service.findOne(id, userId);
    }
    async update(id, userId, updateVisitedPlaceDto) {
        return this.service.update(id, userId, updateVisitedPlaceDto);
    }
    async remove(id, userId) {
        return this.service.remove(id, userId);
    }
    async search(query, userId) {
        return this.service.search(query, userId);
    }
};
exports.PlaceController = PlaceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un lieu visité' }),
    (0, swagger_1.ApiBody)({ type: create_visited_place_dto_1.CreateVisitedPlaceDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lieu visité créé avec succès' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_visited_place_dto_1.CreateVisitedPlaceDto]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les lieux visités' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des lieux visités' }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un lieu visité' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du lieu visité' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lieu visité trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un lieu visité' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du lieu visité' }),
    (0, swagger_1.ApiBody)({ type: update_visited_place_dto_1.UpdateVisitedPlaceDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lieu visité mis à jour avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_visited_place_dto_1.UpdateVisitedPlaceDto]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un lieu visité' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du lieu visité' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lieu visité supprimé avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Rechercher des lieux' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des lieux trouvés' }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "search", null);
exports.PlaceController = PlaceController = __decorate([
    (0, swagger_1.ApiTags)('places'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('places'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [place_service_1.PlaceService])
], PlaceController);
//# sourceMappingURL=place.controller.js.map