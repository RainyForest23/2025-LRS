import { SignupForm } from "@/components/forms/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>회원가입</CardTitle>
                <CardDescription>LRS 강의체험단 계정을 생성합니다</CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm />
            </CardContent>
        </Card>
    );
}
