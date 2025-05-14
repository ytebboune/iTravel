import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Database } from '../database.types';

export const SupabaseClientProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: async (configService: ConfigService): Promise<SupabaseClient<Database>> => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    return createClient<Database>(supabaseUrl, supabaseKey);
  },
  inject: [ConfigService],
};