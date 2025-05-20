import { Injectable, Logger } from '@nestjs/common';

interface Metric {
  name: string;
  value: number;
  labels: Record<string, string>;
  timestamp: Date;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private metrics: Metric[] = [];
  private readonly MAX_METRICS = 1000;

  // Métriques de base
  private requestCount = 0;
  private errorCount = 0;
  private responseTimeSum = 0;
  private startTime = new Date();

  incrementRequestCount() {
    this.requestCount++;
    this.recordMetric('http_requests_total', 1, { type: 'request' });
  }

  incrementErrorCount() {
    this.errorCount++;
    this.recordMetric('http_errors_total', 1, { type: 'error' });
  }

  recordResponseTime(time: number) {
    this.responseTimeSum += time;
    this.recordMetric('http_response_time_ms', time, { type: 'response' });
  }

  private recordMetric(name: string, value: number, labels: Record<string, string>) {
    const metric: Metric = {
      name,
      value,
      labels,
      timestamp: new Date(),
    };

    this.metrics.push(metric);
    
    // Garder seulement les dernières MAX_METRICS métriques
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
      recentMetrics: this.metrics.slice(-100), // Retourne les 100 dernières métriques
    };
  }

  // Méthode pour exporter les métriques au format texte
  getMetricsText() {
    const metrics = this.getMetrics();
    let text = '';

    // Métriques de base
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

    // Métriques récentes
    metrics.recentMetrics.forEach(metric => {
      const labels = Object.entries(metric.labels)
        .map(([key, value]) => `${key}="${value}"`)
        .join(',');
      
      text += `${metric.name}{${labels}} ${metric.value}\n`;
    });

    return text;
  }
} 