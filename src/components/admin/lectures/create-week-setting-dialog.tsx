'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createWeekSetting } from "@/app/admin/lectures/actions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
    week_number: z.number().min(1, "주차를 입력해주세요"),
    year: z.number().min(2024, "연도를 확인해주세요"),
    application_start: z.string().min(1, "시작 일시를 입력해주세요"),
    application_end: z.string().min(1, "종료 일시를 입력해주세요"),
    review_deadline: z.string().min(1, "리뷰 마감 일시를 입력해주세요"),
})

export function CreateWeekSettingDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const defaultYear = new Date().getFullYear();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            week_number: 1,
            year: defaultYear,
            application_start: "",
            application_end: "",
            review_deadline: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            // ISO String 변환 등은 필요하다면 여기서 처리하거나, Input type="datetime-local" 사용 시 그대로 전달
            const result = await createWeekSetting({
                ...data,
                is_active: true
            })

            if (result?.error) {
                toast.error("설정 생성 실패", {
                    description: result.error,
                })
            } else {
                toast.success("주차 설정이 생성되었습니다")
                setOpen(false)
                form.reset()
            }
        } catch (error) {
            toast.error("오류가 발생했습니다")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    주차 설정 추가
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>새 주차 설정 추가</DialogTitle>
                    <DialogDescription>
                        강의 신청 및 평가 기간을 설정합니다.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="week_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>주차 (Week)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={Number(field.value) || ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>연도 (Year)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={Number(field.value) || ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="application_start"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>신청 시작 일시</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="application_end"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>신청 마감 일시</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="review_deadline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>리뷰 마감 일시</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                저장하기
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
