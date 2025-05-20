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
exports.TransportController = void 0;
const common_1 = require("@nestjs/common");
const transport_service_1 = require("./transport.service");
const add_transport_comment_dto_1 = require("./dto/add-transport-comment.dto");
const create_transport_option_dto_1 = require("./dto/create-transport-option.dto");
const transport_vote_dto_1 = require("./dto/transport-vote.dto");
const sort_transport_dto_1 = require("./dto/sort-transport.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../../core/auth/auth.guard");
let TransportController = class TransportController {
    constructor(service) {
        this.service = service;
    }
    create(projectId, dto, req) {
        return this.service.create(projectId, dto, req.user.sub);
    }
    findAll(projectId, req, sortDto) {
        return this.service.findAll(projectId, req.user.sub, sortDto);
    }
    vote(dto, req) {
        return this.service.vote(req.user.sub, dto);
    }
    deleteVote(transportId, req) {
        return this.service.deleteVote(req.user.sub, transportId);
    }
    getVoters(transportId, req) {
        return this.service.getVoters(transportId, req.user.sub);
    }
    comment(dto, req) {
        return this.service.addComment(req.user.sub, dto);
    }
    select(projectId, id, req) {
        return this.service.selectOption(projectId, id, req.user.sub);
    }
    async validateOption(projectId, id, req) {
        return this.service.validateOption(projectId, id, req.user.sub);
    }
    async unvalidateOption(projectId, id, req) {
        return this.service.unvalidateOption(projectId, id, req.user.id);
    }
    async getValidatedOption(projectId) {
        return this.service.getValidatedOption(projectId);
    }
};
exports.TransportController = TransportController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transport option' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiBody)({ type: create_transport_option_dto_1.CreateTransportOptionDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transport option created successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_transport_option_dto_1.CreateTransportOptionDto, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transport options' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of transport options' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, sort_transport_dto_1.SortTransportDto]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a transport option' }),
    (0, swagger_1.ApiBody)({ type: transport_vote_dto_1.TransportVoteDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vote recorded successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transport_vote_dto_1.TransportVoteDto, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "vote", null);
__decorate([
    (0, common_1.Delete)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a vote on a transport option' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transport option ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "deleteVote", null);
__decorate([
    (0, common_1.Get)(':id/voters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all voters for a transport option' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transport option ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of voters' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "getVoters", null);
__decorate([
    (0, common_1.Post)('comment'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a transport option' }),
    (0, swagger_1.ApiBody)({ type: add_transport_comment_dto_1.AddTransportCommentDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment added successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_transport_comment_dto_1.AddTransportCommentDto, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "comment", null);
__decorate([
    (0, common_1.Post)(':id/select'),
    (0, swagger_1.ApiOperation)({ summary: 'Select a transport option' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transport option ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transport option selected successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "select", null);
__decorate([
    (0, common_1.Post)(':id/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a transport option' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transport option ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transport option validated successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "validateOption", null);
__decorate([
    (0, common_1.Post)(':id/unvalidate'),
    (0, swagger_1.ApiOperation)({ summary: 'Unvalidate a transport option' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transport option ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transport option unvalidated successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "unvalidateOption", null);
__decorate([
    (0, common_1.Get)('validated'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the validated transport option' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validated transport option' }),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "getValidatedOption", null);
exports.TransportController = TransportController = __decorate([
    (0, swagger_1.ApiTags)('transport'),
    (0, common_1.Controller)('projects/:projectId/transport'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [transport_service_1.TransportService])
], TransportController);
//# sourceMappingURL=transport.controller.js.map