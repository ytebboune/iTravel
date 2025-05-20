import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class EmailService implements OnModuleInit {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendWelcomeEmail(email: string, username: string): Promise<void>;
    sendNewLoginAlert(email: string, deviceInfo: string): Promise<void>;
}
