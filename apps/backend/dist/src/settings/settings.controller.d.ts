import { SettingsService } from './settings.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
export declare class SettingsController {
    private readonly service;
    constructor(service: SettingsService);
    getSettings(userId: string): Promise<{
        privacy: {
            showEmail: boolean;
            showVisitedPlaces: boolean;
            showPosts: boolean;
            showStories: boolean;
        };
        notifications: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    updatePrivacy(userId: string, updatePrivacyDto: UpdatePrivacyDto): Promise<{
        showEmail: boolean;
        showVisitedPlaces: boolean;
        showPosts: boolean;
        showStories: boolean;
    }>;
    updateNotificationSettings(userId: string, settings: {
        email: boolean;
        push: boolean;
    }): Promise<import("@prisma/client/runtime/library").JsonValue>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
