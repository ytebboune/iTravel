"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningModule = void 0;
const common_1 = require("@nestjs/common");
const planning_controller_1 = require("./planning.controller");
const planning_service_1 = require("./planning.service");
const prisma_module_1 = require("../../../prisma/prisma.module");
const websocket_module_1 = require("../../../core/websocket/websocket.module");
const auth_module_1 = require("../../../core/auth/auth.module");
const notification_module_1 = require("../../../core/notifications/notification.module");
let PlanningModule = class PlanningModule {
};
exports.PlanningModule = PlanningModule;
exports.PlanningModule = PlanningModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, notification_module_1.NotificationModule, websocket_module_1.WebsocketModule],
        controllers: [planning_controller_1.PlanningController],
        providers: [planning_service_1.PlanningService],
        exports: [planning_service_1.PlanningService],
    })
], PlanningModule);
//# sourceMappingURL=planning.module.js.map