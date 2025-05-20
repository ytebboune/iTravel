"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseClientProvider = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
exports.SupabaseClientProvider = {
    provide: 'SUPABASE_CLIENT',
    useFactory: async (configService) => {
        const supabaseUrl = configService.get('SUPABASE_URL');
        const supabaseKey = configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase configuration');
        }
        return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=supabase.provider.js.map