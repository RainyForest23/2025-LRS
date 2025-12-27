'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupInput } from "@/lib/validations"
import { signup } from "@/app/(auth)/signup/actions"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export function SignupForm() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            phone: "",
        },
    })

    async function onSubmit(data: SignupInput) {
        setIsLoading(true)
        try {
            const result = await signup(data)

            if (result?.error) {
                toast.error("회원가입 실패", {
                    description: result.error,
                })
            } // redirection happens in action on success

        } catch (error) {
            toast.error("오류가 발생했습니다")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>이메일</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>비밀번호</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="영문, 숫자 포함 8자 이상" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>이름</FormLabel>
                                <FormControl>
                                    <Input placeholder="홍길동" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>휴대폰 번호</FormLabel>
                                <FormControl>
                                    <Input placeholder="010-1234-5678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        회원가입
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    로그인
                </Link>
            </div>
        </div>
    )
}
