import { createClient } from "@supabase/supabase-js";

// Service Role Key를 사용하는 관리자용 클라이언트
// 주의: 이 클라이언트는 절대 브라우저에서 사용하면 안 됩니다.
// 오직 Server Action이나 API Route에서만 사용해야 합니다.
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
