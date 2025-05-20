import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Database } from 'src/database.types';
export declare const SupabaseClientProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => Promise<SupabaseClient<Database>>;
    inject: (typeof ConfigService)[];
};
