import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, userAgent: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string;
            emailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto, userAgent: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            emailVerified: boolean;
            avatar: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    googleAuth(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string;
            emailVerified: boolean;
        };
    }>;
    appleAuth(token: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string;
        };
        token: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    logoutAllDevices(req: any): Promise<{
        message: string;
    }>;
    getMe(req: any): Promise<any>;
}
