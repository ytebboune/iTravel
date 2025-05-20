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
exports.PlanningController = void 0;
const common_1 = require("@nestjs/common");
const planning_service_1 = require("./planning.service");
const swagger_1 = require("@nestjs/swagger");
const create_planning_dto_1 = require("./dto/create-planning.dto");
const add_activity_to_planning_dto_1 = require("./dto/add-activity-to-planning.dto");
const auth_guard_1 = require("../../../core/auth/auth.guard");
const get_user_decorator_1 = require("../../../core/auth/decorators/get-user.decorator");
let PlanningController = class PlanningController {
    constructor(service) {
        this.service = service;
    }
    async create(projectId, userId, createPlanningDto) {
        return this.service.create(projectId, userId, createPlanningDto);
    }
    async getPlanning(projectId, userId) {
        return this.service.getPlanning(projectId, userId);
    }
    async addActivity(projectId, userId, addActivityDto) {
        return this.service.addActivityToPlanning(projectId, userId, addActivityDto);
    }
    async updateActivity(projectId, activityId, userId, updateActivityDto) {
        return this.service.updatePlanningActivity(projectId, activityId, userId, updateActivityDto);
    }
    async deleteActivity(projectId, activityId, userId) {
        return this.service.removeActivityFromPlanning(projectId, activityId, userId);
    }
};
exports.PlanningController = PlanningController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un planning' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiBody)({ type: create_planning_dto_1.CreatePlanningDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Planning créé avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_planning_dto_1.CreatePlanningDto]),
    __metadata("design:returntype", Promise)
], PlanningController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le planning' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Planning récupéré avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlanningController.prototype, "getPlanning", null);
__decorate([
    (0, common_1.Post)('activities'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une activité au planning' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiBody)({ type: add_activity_to_planning_dto_1.AddActivityToPlanningDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Activité ajoutée avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_activity_to_planning_dto_1.AddActivityToPlanningDto]),
    __metadata("design:returntype", Promise)
], PlanningController.prototype, "addActivity", null);
__decorate([
    (0, common_1.Put)('activities/:activityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une activité du planning' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'activityId', description: 'ID de l\'activité' }),
    (0, swagger_1.ApiBody)({ type: add_activity_to_planning_dto_1.AddActivityToPlanningDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activité mise à jour avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, add_activity_to_planning_dto_1.AddActivityToPlanningDto]),
    __metadata("design:returntype", Promise)
], PlanningController.prototype, "updateActivity", null);
__decorate([
    (0, common_1.Delete)('activities/:activityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une activité du planning' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ID du projet' }),
    (0, swagger_1.ApiParam)({ name: 'activityId', description: 'ID de l\'activité' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activité supprimée avec succès' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlanningController.prototype, "deleteActivity", null);
exports.PlanningController = PlanningController = __decorate([
    (0, swagger_1.ApiTags)('planning'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects/:projectId/planning'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [planning_service_1.PlanningService])
], PlanningController);
//# sourceMappingURL=planning.controller.js.map