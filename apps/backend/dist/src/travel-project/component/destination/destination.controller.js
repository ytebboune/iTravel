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
exports.DestinationController = void 0;
const common_1 = require("@nestjs/common");
const destination_service_1 = require("./destination.service");
const add_comment_dto_1 = require("./dto/add-comment.dto");
const vote_dto_1 = require("./dto/vote.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../../core/auth/auth.guard");
let DestinationController = class DestinationController {
    constructor(service) {
        this.service = service;
    }
    addComment(projectId, destinationId, dto, req) {
        return this.service.addComment(projectId, destinationId, req.user.sub, dto.content);
    }
    getComments(projectId, destinationId, req) {
        return this.service.getComments(projectId, destinationId, req.user.sub);
    }
    vote(projectId, destinationId, dto, req) {
        return this.service.vote(projectId, destinationId, req.user.sub, dto.vote, dto.comment);
    }
    getVotes(projectId, destinationId, req) {
        return this.service.getVoters(destinationId, req.user.sub);
    }
    validate(projectId, destinationId, req) {
        return this.service.validateOption(projectId, destinationId, req.user.sub);
    }
    unvalidate(projectId, destinationId, req) {
        return this.service.unvalidateOption(projectId, destinationId, req.user.sub);
    }
};
exports.DestinationController = DestinationController;
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a destination' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Destination ID' }),
    (0, swagger_1.ApiBody)({ type: add_comment_dto_1.AddCommentDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment added successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_comment_dto_1.AddCommentDto, Object]),
    __metadata("design:returntype", void 0)
], DestinationController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all comments for a destination' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Destination ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of comments' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DestinationController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a destination' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Destination ID' }),
    (0, swagger_1.ApiBody)({ type: vote_dto_1.VoteDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vote recorded successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, vote_dto_1.VoteDto, Object]),
    __metadata("design:returntype", void 0)
], DestinationController.prototype, "vote", null);
__decorate([
    (0, common_1.Get)(':id/votes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all votes for a destination' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Destination ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of votes' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DestinationController.prototype, "getVotes", null);
__decorate([
    (0, common_1.Post)(':id/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a destination' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Destination ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destination validated successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DestinationController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)(':id/unvalidate'),
    (0, swagger_1.ApiOperation)({ summary: 'Unvalidate a destination' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Destination ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destination unvalidated successfully' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DestinationController.prototype, "unvalidate", null);
exports.DestinationController = DestinationController = __decorate([
    (0, swagger_1.ApiTags)('destination'),
    (0, common_1.Controller)('projects/:projectId/destinations'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [destination_service_1.DestinationService])
], DestinationController);
//# sourceMappingURL=destination.controller.js.map