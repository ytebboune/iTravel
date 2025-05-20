"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportModule = void 0;
const common_1 = require("@nestjs/common");
const transport_service_1 = require("./transport.service");
const transport_controller_1 = require("./transport.controller");
const prisma_module_1 = require("../../../prisma/prisma.module");
const notification_module_1 = require("../../../core/notifications/notification.module");
const websocket_module_1 = require("../../../core/websocket/websocket.module");
const notification_service_1 = require("../../../core/notifications/notification.service");
const url_validator_1 = require("../../../core/utils/url-validator");
const monitoring_service_1 = require("../../../core/monitoring/monitoring.service");
const auth_module_1 = require("../../../core/auth/auth.module");
let TransportModule = class TransportModule {
};
exports.TransportModule = TransportModule;
exports.TransportModule = TransportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            notification_module_1.NotificationModule,
            websocket_module_1.WebsocketModule,
            auth_module_1.AuthModule,
        ],
        controllers: [transport_controller_1.TransportController],
        providers: [transport_service_1.TransportService, notification_service_1.NotificationService, url_validator_1.UrlValidator, monitoring_service_1.MonitoringService],
        exports: [transport_service_1.TransportService],
    })
], TransportModule);
//# sourceMappingURL=transport.module.js.map