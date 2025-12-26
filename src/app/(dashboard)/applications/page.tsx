import { createClient } from "@/lib/supabase/server";
import { ApplicationForm } from "@/components/forms/application-form";
import { getActiveWeek } from "@/lib/week-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const activeWeek = await getActiveWeek();

  // 활성 주차가 없으면 안내 메시지
  if (!activeWeek) {
    return (
      <div className="container mx-auto py-10">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>신청 기간이 아닙니다</AlertTitle>
          <AlertDescription>
            현재 활성화된 강의 신청 기간이 없습니다. 나중에 다시 확인해주세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 과목 목록 가져오기
  const { data: subjects, error: subjectsError } = await supabase
    .from('subjects')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (subjectsError) {
    return <div>Error loading subjects</div>
  }

  // 내 신청 내역 가져오기
  const { data: { user } } = await supabase.auth.getUser();
  const { data: myApplications } = await supabase
    .from('applications')
    .select('*, subjects(name)')
    .eq('week_number', activeWeek.week_number)
    .eq('user_id', (await supabase.from('users').select('id').eq('auth_id', user!.id).single()).data!.id);


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">강의 신청</h2>
        <p className="text-muted-foreground">
          {activeWeek.week_number}주차 강의 체험단 신청입니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>신청 정보</CardTitle>
              <CardDescription>
                신청 기간: {format(new Date(activeWeek.application_start), "MM.dd HH:mm")} ~ {format(new Date(activeWeek.application_end), "MM.dd HH:mm")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationForm subjects={subjects || []} activeWeek={activeWeek} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>내 신청 내역</CardTitle>
              <CardDescription>{activeWeek.week_number}주차 신청 현황입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {myApplications && myApplications.length > 0 ? (
                <ul className="space-y-4">
                  {myApplications.map((app) => (
                    <li key={app.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{app.subjects?.name || 'Unknown Subject'}</p>
                        <p className="text-sm text-muted-foreground">{app.requested_count}개 신청</p>
                      </div>
                      <div className="text-sm font-medium">
                        {app.status === 'pending' ? '대기중' : app.status}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">신청 내역이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
