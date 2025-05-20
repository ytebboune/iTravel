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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const activity_service_1 = require("./activity.service");
const vote_dto_1 = require("../destination/dto/vote.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../../core/auth/auth.guard");
let ActivityController = class ActivityController {
    constructor(service) {
        this.service = service;
    }
    createActivity(projectId, data, req) {
        return this.service.createActivity(projectId, req.user.sub, data);
    }
    getActivities(projectId, req) {
        return this.service.getActivities(projectId, req.user.sub);
    }
    getPredefinedActivities(category) {
        return this.service.getPredefinedActivities(category);
    }
    vote(projectId, activityId, dto, req) {
        return this.service.vote(projectId, activityId, req.user.sub, dto.vote, dto.comment);
    }
    deleteVote(projectId, activityId, req) {
        return this.service.deleteVote(projectId, activityId, req.user.sub);
    }
    getVoters(projectId, activityId, req) {
        return this.service.getVoters(activityId, req.user.sub);
    }
    getVotes(projectId, req) {
        return this.service.getVotes(projectId, req.user.sub);
    }
};
exports.ActivityController = ActivityController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new activity' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                imageUrl: { type: 'string', nullable: true },
                suggestedByAI: { type: 'boolean', nullable: true }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Activity created successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all activities' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of activities' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getActivities", null);
__decorate([
    (0, common_1.Get)('predefined'),
    (0, swagger_1.ApiOperation)({ summary: 'Get predefined activities' }),
    (0, swagger_1.ApiParam)({ name: 'category', required: false, description: 'Activity category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of predefined activities' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getPredefinedActivities", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on an activity' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Activity ID' }),
    (0, swagger_1.ApiBody)({ type: vote_dto_1.VoteDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vote recorded successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, vote_dto_1.VoteDto, Object]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "vote", null);
__decorate([
    (0, common_1.Delete)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a vote on an activity' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Activity ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote deleted successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "deleteVote", null);
__decorate([
    (0, common_1.Get)(':id/voters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all voters for an activity' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Activity ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of voters' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getVoters", null);
__decorate([
    (0, common_1.Get)('votes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all votes for activities' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of votes' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getVotes", null);
exports.ActivityController = ActivityController = __decorate([
    (0, swagger_1.ApiTags)('activity'),
    (0, common_1.Controller)('projects/:projectId/activities'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityController);
//# sourceMappingURL=activity.controller.js.map