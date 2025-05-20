"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MonitoringService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
let MonitoringService = MonitoringService_1 = class MonitoringService {
    constructor() {
        this.logger = new common_1.Logger(MonitoringService_1.name);
        this.metrics = [];
        this.MAX_METRICS = 1000;
        this.requestCount = 0;
        this.errorCount = 0;
        this.responseTimeSum = 0;
        this.startTime = new Date();
    }
    incrementRequestCount() {
        this.requestCount++;
        this.recordMetric('http_requests_total', 1, { type: 'request' });
    }
    incrementErrorCount() {
        this.errorCount++;
        this.recordMetric('http_errors_total', 1, { type: 'error' });
    }
    recordResponseTime(time) {
        this.responseTimeSum += time;
        this.recordMetric('http_response_time_ms', time, { type: 'response' });
    }
    recordMetric(name, value, labels) {
        const metric = {
            name,
            value,
            labels,
            timestamp: new Date(),
        };
        this.metrics.push(metric);
        if (this.metrics.length > this.MAX_METRICS) {
            this.metrics = this.metrics.slice(-this.MAX_METRICS);
        }
    }
    getMetrics() {
        const uptime = (new Date().getTime() - this.startTime.getTime()) / 1000;
        return {
            uptime,
            requestCount: this.requestCount,
            errorCount: this.errorCount,
            averageResponseTime: this.requestCount > 0 ? this.responseTimeSum / this.requestCount : 0,
            recentMetrics: this.metrics.slice(-100),
        };
    }
    getMetricsText() {
        const metrics = this.getMetrics();
        let text = '';
        text += `# HELP http_requests_total Total number of HTTP requests\n`;
        text += `# TYPE http_requests_total counter\n`;
        text += `http_requests_total ${metrics.requestCount}\n\n`;
        text += `# HELP http_errors_total Total number of HTTP errors\n`;
        text += `# TYPE http_errors_total counter\n`;
        text += `http_errors_total ${metrics.errorCount}\n\n`;
        text += `# HELP http_response_time_ms Average response time in milliseconds\n`;
        text += `# TYPE http_response_time_ms gauge\n`;
        text += `http_response_time_ms ${metrics.averageResponseTime}\n\n`;
        text += `# HELP application_uptime_seconds Application uptime in seconds\n`;
        text += `# TYPE application_uptime_seconds gauge\n`;
        text += `application_uptime_seconds ${metrics.uptime}\n\n`;
        metrics.recentMetrics.forEach(metric => {
            const labels = Object.entries(metric.labels)
                .map(([key, value]) => `${key}="${value}"`)
                .join(',');
            text += `${metric.name}{${labels}} ${metric.value}\n`;
        });
        return text;
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = MonitoringService_1 = __decorate([
    (0, common_1.Injectable)()
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map