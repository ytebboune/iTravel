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
exports.MonitoringController = void 0;
const common_1 = require("@nestjs/common");
const monitoring_service_1 = require("./monitoring.service");
let MonitoringController = class MonitoringController {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    getMetrics(res) {
        res.set('Content-Type', 'text/plain');
        res.send(this.monitoringService.getMetricsText());
    }
    getHealth() {
        const metrics = this.monitoringService.getMetrics();
        return {
            status: 'ok',
            uptime: metrics.uptime,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.MonitoringController = MonitoringController;
__decorate([
    (0, common_1.Get)('metrics'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getHealth", null);
exports.MonitoringController = MonitoringController = __decorate([
    (0, common_1.Controller)('monitoring'),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], MonitoringController);
//# sourceMappingURL=monitoring.controller.js.map