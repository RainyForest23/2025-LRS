'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 사용자 생성 스키마
const createUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    phone: z.string().min(10),
    role: z.enum(['member', 'operator', 'admin']),
    password: z.string().min(6).optional(), // 초기 비밀번호 (없으면 자동 생성 or 고정)
});

type CreateUserInput = z.infer<typeof createUserSchema>;

export async function createUser(data: CreateUserInput) {
    const supabase = createAdminClient();

    // 1. Auth User 생성
    // 비밀번호가 없으면 기본값 설정 (실제 운영시에는 이메일 초대 링크가 좋음)
    const password = data.password || 'Welcome123!';

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: password,
        email_confirm: true,
        user_metadata: { name: data.name }
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authUser.user) {
        return { error: "Failed to create auth user" };
    }

    // 2. Public User Profile 생성
    const { error: dbError } = await supabase
        .from('users')
        .insert({
            auth_id: authUser.user.id,
            email: data.email,
            name: data.name,
            phone: data.phone,
            role: data.role,
            is_active: true
        });

    if (dbError) {
        // 롤백 필요할 수 있음 (Auth User 삭제)
        await supabase.auth.admin.deleteUser(authUser.user.id);
        return { error: dbError.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}
