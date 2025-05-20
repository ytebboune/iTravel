"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateSuggestionModule = void 0;
const common_1 = require("@nestjs/common");
const date_suggestion_controller_1 = require("./date-suggestion.controller");
const date_suggestion_service_1 = require("./date-suggestion.service");
const notification_service_1 = require("../../../core/notifications/notification.service");
const prisma_module_1 = require("../../../prisma/prisma.module");
const websocket_module_1 = require("../../../core/websocket/websocket.module");
const notification_module_1 = require("../../../core/notifications/notification.module");
const auth_module_1 = require("../../../core/auth/auth.module");
let DateSuggestionModule = class DateSuggestionModule {
};
exports.DateSuggestionModule = DateSuggestionModule;
exports.DateSuggestionModule = DateSuggestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            notification_module_1.NotificationModule,
            websocket_module_1.WebsocketModule,
            auth_module_1.AuthModule,
        ],
        controllers: [date_suggestion_controller_1.DateSuggestionController],
        providers: [date_suggestion_service_1.DateSuggestionService, notification_service_1.NotificationService],
        exports: [date_suggestion_service_1.DateSuggestionService],
    })
], DateSuggestionModule);
//# sourceMappingURL=date-suggestion.module.js.map