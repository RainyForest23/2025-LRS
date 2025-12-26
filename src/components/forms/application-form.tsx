'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { applicationSchema } from "@/lib/validations"
import { createApplication } from "@/app/(dashboard)/applications/actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Subject, WeekSetting } from "@/types"

interface ApplicationFormProps {
  subjects: Subject[];
  activeWeek: WeekSetting;
}

export function ApplicationForm({ subjects, activeWeek }: ApplicationFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      subject_id: "",
      requested_count: 1,
      week_number: activeWeek.week_number,
    },
  })

  async function onSubmit(data: z.infer<typeof applicationSchema>) {
    setIsLoading(true)
    try {
      const result = await createApplication(data)
      if (result?.error) {
        toast.error("신청 실패", {
          description: result.error,
        })
      } else {
        toast.success("강의 신청이 완료되었습니다")
        form.reset({
          subject_id: "",
          requested_count: 1,
          week_number: activeWeek.week_number,
        })
      }
    } catch (error) {
      toast.error("오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>과목 선택</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="과목을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requested_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>신청 개수 (1~3개)</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="개수 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1개</SelectItem>
                  <SelectItem value="2">2개</SelectItem>
                  <SelectItem value="3">3개</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                해당 과목에서 배정받고 싶은 강의 수를 선택해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {activeWeek.week_number}주차 신청하기
        </Button>
      </form>
    </Form>
  )
}
