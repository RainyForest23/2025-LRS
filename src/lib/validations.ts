import { z } from "zod";

// Zod 검증 스키마 (Phase별로 추가 예정)

// 로그인 스키마 (Phase 2)
export const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

// 신청 스키마 (Phase 3)
export const applicationSchema = z.object({
  subject_id: z.string().uuid("올바른 과목을 선택해주세요"),
  requested_count: z.number()
    .min(1, "최소 1개 이상 신청해야 합니다")
    .max(3, "최대 3개까지 신청 가능합니다"),
  week_number: z.number(), // Hidden field
});

// 강의평 스키마 (Phase 5)
export const reviewSchema = z.object({
  total_score: z.number()
    .min(0, "점수는 0점 이상이어야 합니다")
    .max(100, "점수는 100점 이하여야 합니다"),
  content_review: z.string().min(10, "최소 10자 이상 작성해주세요"), // 테스트 편의를 위해 10자로 완화 (운영시 100자)
  delivery_review: z.string().min(10, "최소 10자 이상 작성해주세요"),
  structure_review: z.string().min(10, "최소 10자 이상 작성해주세요"),
  overall_review: z.string().min(10, "최소 10자 이상 작성해주세요"),
  timestamps: z.array(
    z.object({
      time: z.string().min(1, "시간을 입력해주세요"), // HH:MM:SS format validation could be added
      content: z.string().min(1, "내용을 입력해주세요"),
    })
  ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
