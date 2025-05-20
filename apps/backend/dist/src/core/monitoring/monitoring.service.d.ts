interface Metric {
    name: string;
    value: number;
    labels: Record<string, string>;
    timestamp: Date;
}
export declare class MonitoringService {
    private readonly logger;
    private metrics;
    private readonly MAX_METRICS;
    private requestCount;
    private errorCount;
    private responseTimeSum;
    private startTime;
    incrementRequestCount(): void;
    incrementErrorCount(): void;
    recordResponseTime(time: number): void;
    private recordMetric;
    getMetrics(): {
        uptime: number;
        requestCount: number;
        errorCount: number;
        averageResponseTime: number;
        recentMetrics: Metric[];
    };
    getMetricsText(): string;
}
export {};
