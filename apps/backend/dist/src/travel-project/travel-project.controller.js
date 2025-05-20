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
exports.TravelProjectController = void 0;
const common_1 = require("@nestjs/common");
const travel_project_service_1 = require("./travel-project.service");
const create_travel_project_dto_1 = require("./dto/create-travel-project.dto");
const update_travel_project_dto_1 = require("./dto/update-travel-project.dto");
const add_participant_dto_1 = require("./dto/add-participant.dto");
const auth_guard_1 = require("../core/auth/auth.guard");
const add_destination_dto_1 = require("./dto/add-destination.dto");
let TravelProjectController = class TravelProjectController {
    constructor(travelProjectService) {
        this.travelProjectService = travelProjectService;
    }
    create(dto, req) {
        return this.travelProjectService.create(dto, req.user.sub);
    }
    findAll(req) {
        return this.travelProjectService.findAllByUser(req.user.sub);
    }
    findOne(id, req) {
        return this.travelProjectService.findOneIfAuthorized(id, req.user.sub);
    }
    update(id, dto, req) {
        return this.travelProjectService.update(id, dto, req.user.sub);
    }
    remove(id, req) {
        return this.travelProjectService.remove(id, req.user.sub);
    }
    addParticipant(projectId, dto, req) {
        return this.travelProjectService.addParticipant(projectId, dto, req.user.sub);
    }
    getDestinations(projectId, req) {
        return this.travelProjectService.loadDestinations(projectId);
    }
    addDestination(projectId, dto, req) {
        return this.travelProjectService.addDestination(projectId, dto, req.user.sub);
    }
    voteDestination(projectId, destId, req) {
        return this.travelProjectService.voteDestination(projectId, destId, req.user.sub);
    }
    async getProjectByShareCode(shareCode) {
        const project = await this.travelProjectService.findByShareCode(shareCode);
        if (!project) {
            throw new common_1.NotFoundException('Projet non trouvé');
        }
        return project;
    }
    async joinProject(shareCode, req) {
        return this.travelProjectService.joinByShareCode(shareCode, req.user.id);
    }
};
exports.TravelProjectController = TravelProjectController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_travel_project_dto_1.CreateTravelProjectDto, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_travel_project_dto_1.UpdateTravelProjectDto, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/participants'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_participant_dto_1.AddParticipantDto, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Get)(':id/destinations'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "getDestinations", null);
__decorate([
    (0, common_1.Post)(':id/destinations'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_destination_dto_1.AddDestinationDto, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "addDestination", null);
__decorate([
    (0, common_1.Post)(':id/destinations/:destId/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('destId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TravelProjectController.prototype, "voteDestination", null);
__decorate([
    (0, common_1.Get)('share/:shareCode'),
    __param(0, (0, common_1.Param)('shareCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TravelProjectController.prototype, "getProjectByShareCode", null);
__decorate([
    (0, common_1.Post)('share/:shareCode/join'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('shareCode')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TravelProjectController.prototype, "joinProject", null);
exports.TravelProjectController = TravelProjectController = __decorate([
    (0, common_1.Controller)('travel-project'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [travel_project_service_1.TravelProjectService])
], TravelProjectController);
//# sourceMappingURL=travel-project.controller.js.map