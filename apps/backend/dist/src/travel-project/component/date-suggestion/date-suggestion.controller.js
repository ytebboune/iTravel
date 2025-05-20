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
exports.DateSuggestionController = void 0;
const common_1 = require("@nestjs/common");
const date_suggestion_service_1 = require("./date-suggestion.service");
const swagger_1 = require("@nestjs/swagger");
const create_date_suggestion_dto_1 = require("./dto/create-date-suggestion.dto");
const vote_dto_1 = require("../destination/dto/vote.dto");
const auth_guard_1 = require("../../../core/auth/auth.guard");
let DateSuggestionController = class DateSuggestionController {
    constructor(service) {
        this.service = service;
    }
    createDateSuggestion(projectId, dto, req) {
        return this.service.createDateSuggestion(projectId, req.user.sub, dto);
    }
    getDateSuggestions(projectId, req) {
        return this.service.getDateSuggestions(projectId, req.user.sub);
    }
    vote(projectId, dateSuggestionId, dto, req) {
        return this.service.vote(projectId, dateSuggestionId, req.user.sub, dto.vote, dto.comment);
    }
    getVoters(projectId, dateSuggestionId, req) {
        return this.service.getVoters(dateSuggestionId, req.user.sub);
    }
    getVotes(projectId, req) {
        return this.service.getVotes(projectId, req.user.sub);
    }
    validate(projectId, dateSuggestionId, req) {
        return this.service.validateOption(projectId, dateSuggestionId, req.user.sub);
    }
    unvalidate(projectId, dateSuggestionId, req) {
        return this.service.unvalidateOption(projectId, dateSuggestionId, req.user.sub);
    }
};
exports.DateSuggestionController = DateSuggestionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new date suggestion' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiBody)({ type: create_date_suggestion_dto_1.CreateDateSuggestionDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Date suggestion created successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_date_suggestion_dto_1.CreateDateSuggestionDto, Object]),
    __metadata("design:returntype", void 0)
], DateSuggestionController.prototype, "createDateSuggestion", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all date suggestions' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of date suggestions' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DateSuggestionController.prototype, "getDateSuggestions", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a date suggestion' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Date suggestion ID' }),
    (0, swagger_1.ApiBody)({ type: vote_dto_1.VoteDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vote recorded successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, vote_dto_1.VoteDto, Object]),
    __metadata("design:returntype", void 0)
], DateSuggestionController.prototype, "vote", null);
__decorate([
    (0, common_1.Get)(':id/voters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all voters for a date suggestion' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Date suggestion ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of voters' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DateSuggestionController.prototype, "getVoters", null);
__decorate([
    (0, common_1.Get)('votes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all votes for date suggestions' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of votes' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DateSuggestionController.prototype, "getVotes", null);
__decorate([
    (0, common_1.Post)(':id/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a date suggestion' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Date suggestion ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Date suggestion validated successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DateSuggestionController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)(':id/unvalidate'),
    (0, swagger_1.ApiOperation)({ summary: 'Unvalidate a date suggestion' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Date suggestion ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Date suggestion unvalidated successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DateSuggestionController.prototype, "unvalidate", null);
exports.DateSuggestionController = DateSuggestionController = __decorate([
    (0, swagger_1.ApiTags)('date-suggestion'),
    (0, common_1.Controller)('projects/:projectId/date-suggestions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [date_suggestion_service_1.DateSuggestionService])
], DateSuggestionController);
//# sourceMappingURL=date-suggestion.controller.js.map