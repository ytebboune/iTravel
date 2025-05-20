"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const travel_project_module_1 = require("./travel-project/travel-project.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./core/auth/auth.module");
const monitoring_module_1 = require("./core/monitoring/monitoring.module");
const monitoring_middleware_1 = require("./core/monitoring/monitoring.middleware");
const notification_service_1 = require("./core/notifications/notification.service");
const notification_module_1 = require("./core/notifications/notification.module");
const url_validator_1 = require("./core/utils/url-validator");
const http_exception_filter_1 = require("./core/filters/http-exception.filter");
const core_1 = require("@nestjs/core");
const monitoring_service_1 = require("./core/monitoring/monitoring.service");
const transport_module_1 = require("./travel-project/component/transport/transport.module");
const destination_module_1 = require("./travel-project/component/destination/destination.module");
const activity_module_1 = require("./travel-project/component/activity/activity.module");
const date_suggestion_module_1 = require("./travel-project/component/date-suggestion/date-suggestion.module");
const story_module_1 = require("./social/stories/story.module");
const post_module_1 = require("./social/posts/post.module");
const place_module_1 = require("./social/places/place.module");
const settings_module_1 = require("./settings/settings.module");
const user_module_1 = require("./users/user.module");
const upload_module_1 = require("./core/upload/upload.module");
const email_module_1 = require("./core/email/email.module");
const chat_module_1 = require("./social/chat/chat.module");
const ai_module_1 = require("./core/ai/ai.module");
let AppModule = AppModule_1 = class AppModule {
    constructor() {
        this.logger = new common_1.Logger(AppModule_1.name);
    }
    configure(consumer) {
        this.logger.log('Configuring application middleware...');
        consumer
            .apply(monitoring_middleware_1.MonitoringMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
        this.logger.log('Middleware configuration completed');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            travel_project_module_1.TravelProjectModule,
            monitoring_module_1.MonitoringModule,
            transport_module_1.TransportModule,
            destination_module_1.DestinationModule,
            activity_module_1.ActivityModule,
            date_suggestion_module_1.DateSuggestionModule,
            story_module_1.StoryModule,
            post_module_1.PostModule,
            place_module_1.PlaceModule,
            settings_module_1.SettingsModule,
            user_module_1.UserModule,
            upload_module_1.UploadModule,
            notification_module_1.NotificationModule,
            email_module_1.EmailModule,
            chat_module_1.ChatModule,
            ai_module_1.AiModule,
        ],
        providers: [
            notification_service_1.NotificationService,
            url_validator_1.UrlValidator,
            monitoring_service_1.MonitoringService,
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map