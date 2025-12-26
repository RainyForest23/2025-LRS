import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { getActiveWeek } from "@/lib/week-settings";

export default async function MyAssignmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>로그인이 필요합니다.</div>;

  // Fetch internal user id
  const { data: userData } = await supabase.from('users').select('id').eq('auth_id', user.id).single();
  if (!userData) return <div>User not found</div>;

  // Fetch assignments with related lecture info and ANY EXISTING REVIEW
  const { data: assignments } = await supabase
    .from('assignments')
    .select(`
      *,
      lectures (
        title,
        kollus_code,
        duration_minutes,
        instructor_id
      ),
      reviews (
        id,
        status,
        total_score
      )
    `)
    .eq('user_id', userData.id)
    .order('week_number', { ascending: false });

  // Status Badge Helper
  const getReviewStatus = (review: any) => {
    if (!review) return { label: '시청 전', variant: 'secondary' as const };
    if (review.status === 'draft') return { label: '작성 중', variant: 'default' as const };
    if (review.status === 'submitted') return { label: '제출 완료', variant: 'outline' as const }; // Or Success color
    if (review.status === 'evaluated') return { label: '평가 완료', variant: 'outline' as const };
    return { label: '알 수 없음', variant: 'secondary' as const };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">내 강의실</h2>
        <p className="text-muted-foreground">
          배정된 강의를 시청하고 강의평을 작성해주세요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments?.map((assignment) => {
          const review = assignment.reviews?.[0]; // One-to-one relation in practice often array in supabase select
          const status = getReviewStatus(review);

          return (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{assignment.week_number}주차</Badge>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <CardTitle className="mt-2 line-clamp-2 min-h-[3.5rem]">
                  {assignment.lectures?.title}
                </CardTitle>
                <CardDescription>
                  {assignment.lectures?.duration_minutes ? `${assignment.lectures.duration_minutes}분` : '시간 미정'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/reviews/${review?.id || 'new'}?assignmentId=${assignment.id}`}>
                  <Button className="w-full">
                    {review ? '강의평 이어쓰기/보기' : '강의평 작성하기'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
        {assignments?.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            아직 배정된 강의가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
