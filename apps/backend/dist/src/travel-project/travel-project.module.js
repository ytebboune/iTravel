"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelProjectModule = void 0;
const common_1 = require("@nestjs/common");
const travel_project_service_1 = require("./travel-project.service");
const travel_project_controller_1 = require("./travel-project.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const accommodation_module_1 = require("./component/accommodation/accommodation.module");
const planning_module_1 = require("./component/planning/planning.module");
const auth_module_1 = require("../core/auth/auth.module");
let TravelProjectModule = class TravelProjectModule {
};
exports.TravelProjectModule = TravelProjectModule;
exports.TravelProjectModule = TravelProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, accommodation_module_1.AccommodationModule, planning_module_1.PlanningModule],
        providers: [travel_project_service_1.TravelProjectService],
        controllers: [travel_project_controller_1.TravelProjectController],
    })
], TravelProjectModule);
//# sourceMappingURL=travel-project.module.js.map