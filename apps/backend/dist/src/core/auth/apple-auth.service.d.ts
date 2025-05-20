import { ConfigService } from '@nestjs/config';
export declare class AppleAuthService {
    private readonly configService;
    private readonly client;
    constructor(configService: ConfigService);
    verifyToken(token: string): Promise<{
        email: any;
        name: any;
    }>;
}
