import { Response } from 'express';
import { MonitoringService } from './monitoring.service';
export declare class MonitoringController {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    getMetrics(res: Response): void;
    getHealth(): {
        status: string;
        uptime: number;
        timestamp: string;
    };
}
