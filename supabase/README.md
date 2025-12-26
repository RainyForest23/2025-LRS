# Supabase 데이터베이스 설정 가이드

## 📋 현재 상태

### ✅ 이미 생성된 테이블
- `subjects` - 과목
- `instructors` - 강사
- `lectures` - 강의
- `week_settings` - 주차 설정

### ⏳ 생성 필요한 테이블
- `users` - 사용자
- `applications` - 신청
- `assignments` - 배정
- `reviews` - 강의평
- `evaluations` - AI 평가
- `attendance` - 출결

---

## 🚀 데이터베이스 스키마 생성 방법

### 1. Supabase 대시보드 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택: `hghcmtxilajkpxtnroko`

### 2. SQL Editor 열기

1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 버튼 클릭

### 3. SQL 스크립트 실행

1. `supabase/schema-remaining.sql` 파일의 전체 내용을 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 클릭 (또는 Ctrl/Cmd + Enter)

### 4. 실행 확인

성공 메시지가 표시되면 완료!

---

## 📝 생성되는 내용

### 테이블

| 테이블 | 설명 | 주요 필드 |
|--------|------|-----------|
| `users` | 사용자 정보 | auth_id, name, phone, role |
| `applications` | 강의 신청 | user_id, subject_id, requested_count |
| `assignments` | 강의 배정 | user_id, lecture_id, week_number |
| `reviews` | 강의평 | assignment_id, total_score, content |
| `evaluations` | AI 평가 | review_id, grade, scores |
| `attendance` | 출결 관리 | user_id, week_number, status |

### ENUM 타입

- `user_role`: member, operator, admin
- `application_status`: pending, assigned, cancelled
- `review_status`: draft, submitted, evaluated
- `attendance_status`: present, late, absent
- `grade_type`: A, B, C, D

### 인덱스

성능 최적화를 위한 인덱스가 자동으로 생성됩니다:
- 사용자 조회 최적화
- 신청/배정 검색 최적화
- 강의평 및 평가 조회 최적화

### Row Level Security (RLS)

보안을 위해 RLS 정책이 자동으로 설정됩니다:
- 사용자는 자신의 데이터만 조회/수정 가능
- 관리자는 모든 데이터 관리 가능

### 트리거

`updated_at` 필드 자동 업데이트 트리거가 설정됩니다.

---

## ✅ 설정 완료 확인

### 방법 1: Supabase Dashboard

1. **Table Editor** 메뉴 클릭
2. 다음 테이블이 모두 보이는지 확인:
   - users
   - applications
   - assignments
   - reviews
   - evaluations
   - attendance

### 방법 2: 테스트 스크립트 실행

```bash
node check-tables.js
```

모든 테이블에 ✅ 표시가 나오면 성공!

---

## 🔐 환경 변수 확인

`.env.local` 파일이 올바르게 설정되어 있는지 확인:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hghcmtxilajkpxtnroko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
```

---

## 🐛 문제 해결

### "relation does not exist" 에러

테이블이 생성되지 않았습니다. SQL 스크립트를 다시 실행하세요.

### "permission denied" 에러

RLS 정책 문제일 수 있습니다. Supabase Dashboard의 Authentication 설정을 확인하세요.

### "duplicate key value" 에러

ENUM 타입이 이미 존재합니다. 정상이므로 무시하셔도 됩니다.

---

## 📚 참고 문서

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 데이터 타입](https://www.postgresql.org/docs/current/datatype.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
