'use server'

import { createClient } from "@/lib/supabase/server";
import { signupSchema, type SignupInput } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function signup(data: SignupInput) {
    const supabase = await createClient(); // Await strictly required

    const { email, password, name, phone } = data;

    // 1. Sign Up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
            }
        }
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: "회원가입 중 오류가 발생했습니다. (No User Returned)" };
    }

    // 2. Insert into public.users table
    // Note: If email confirmation is enabled, this might need to happen differently (e.g. database trigger),
    // but for now we insert directly.
    const { error: dbError } = await supabase
        .from('users')
        .insert({
            auth_id: authData.user.id,
            email,
            name,
            phone,
            role: 'member', // Default role
            is_active: true
        });

    if (dbError) {
        // If DB insert fails, we might want to cleanup the auth user, but for now just return error.
        console.error("DB Insert Error:", dbError);
        return { error: "프로필 생성 중 오류가 발생했습니다." };
    }

    redirect("/");
}
