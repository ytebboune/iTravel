import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
export declare class AuthGuard implements CanActivate {
    private readonly authService;
    private readonly reflector;
    constructor(authService: AuthService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
