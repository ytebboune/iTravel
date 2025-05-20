"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
const common_1 = require("@nestjs/common");
const settings_controller_1 = require("./settings.controller");
const settings_service_1 = require("./settings.service");
const prisma_module_1 = require("../prisma/prisma.module");
const notification_module_1 = require("../core/notifications/notification.module");
const auth_module_1 = require("../core/auth/auth.module");
const websocket_module_1 = require("../core/websocket/websocket.module");
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, notification_module_1.NotificationModule, websocket_module_1.WebsocketModule],
        controllers: [settings_controller_1.SettingsController],
        providers: [settings_service_1.SettingsService],
        exports: [settings_service_1.SettingsService],
    })
], SettingsModule);
//# sourceMappingURL=settings.module.js.map