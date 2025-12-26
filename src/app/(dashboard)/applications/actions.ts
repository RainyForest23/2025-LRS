'use server'

import { createClient } from "@/lib/supabase/server";
import { applicationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ApplicationInput = z.infer<typeof applicationSchema>;

export async function createApplication(data: ApplicationInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "로그인이 필요합니다" };
    }

    // 중복 신청 체크
    const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id as string) // user.id as string is UUID
        .eq('week_number', data.week_number)
        .eq('subject_id', data.subject_id)
        .single();

    if (existing) {
        return { error: "이미 해당 주차에 이 과목을 신청했습니다" };
    }

    // Find internal user id from auth id
    const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

    if (!userData) {
        return { error: "User profile not found." };
    }


    const { error } = await supabase
        .from('applications')
        .insert({
            user_id: userData.id,
            week_number: data.week_number,
            subject_id: data.subject_id,
            requested_count: data.requested_count,
            status: 'pending' // Default
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/applications');
    return { success: true };
}
