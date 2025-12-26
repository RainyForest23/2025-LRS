'use server'

import { createClient } from "@/lib/supabase/server";

export async function getActiveWeek() {
    const supabase = await createClient();
    const now = new Date().toISOString();

    // 현재 날짜가 신청 기간 (start ~ end) 사이에 있고, is_active가 true인 주차 설정 가져오기
    const { data: activeWeek, error } = await supabase
        .from('week_settings')
        .select('*')
        .eq('is_active', true)
        .lte('application_start', now)
        .gte('application_end', now)
        .order('week_number', { ascending: false })
        .limit(1)
        .single();

    if (error || !activeWeek) {
        return null;
    }

    return activeWeek;
}
