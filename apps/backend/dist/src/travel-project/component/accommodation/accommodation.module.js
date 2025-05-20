"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccommodationModule = void 0;
const common_1 = require("@nestjs/common");
const accommodation_controller_1 = require("./accommodation.controller");
const accommodation_service_1 = require("./accommodation.service");
const prisma_module_1 = require("../../../prisma/prisma.module");
const url_validator_1 = require("./utils/url-validator");
const auth_module_1 = require("../../../core/auth/auth.module");
const websocket_module_1 = require("../../../core/websocket/websocket.module");
const notification_module_1 = require("../../../core/notifications/notification.module");
let AccommodationModule = class AccommodationModule {
};
exports.AccommodationModule = AccommodationModule;
exports.AccommodationModule = AccommodationModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, notification_module_1.NotificationModule, websocket_module_1.WebsocketModule],
        controllers: [accommodation_controller_1.AccommodationController],
        providers: [accommodation_service_1.AccommodationService, url_validator_1.UrlValidator],
        exports: [accommodation_service_1.AccommodationService],
    })
], AccommodationModule);
//# sourceMappingURL=accommodation.module.js.map