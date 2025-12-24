# LRS (Lecture Review System) - 환경설정 가이드

## 📋 프로젝트 개요

**LRS**는 강의체험단 운영 전 과정을 AI 기반으로 자동화하는 통합 웹서비스입니다.

- 강의체험단 신청 → 배정 → 시청 → 강의평 → AI 평가 → 리포트 생성 자동화
- 운영 인력 최소화 (관리자 1인 운영)
- 강의평 품질의 일관성·객관성 확보

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (New York style, Slate color)

### Backend
- **API**: Next.js API Routes + Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

### AI & Analytics
- **AI Model**: OpenAI API (GPT-4o) - Phase 6에서 추가 예정

### Deployment
- **Platform**: Vercel

---

## 💻 시스템 요구사항

- **Node.js**: 20.x 이상
- **npm**: 10.x 이상 (또는 yarn, pnpm)
- **Git**: 2.x 이상

---

## 📦 설치된 패키지

### Dependencies

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `next` | ^16.1.1 | Next.js 프레임워크 |
| `react` | ^19.2.3 | React 라이브러리 |
| `react-dom` | ^19.2.3 | React DOM 렌더링 |
| `@supabase/supabase-js` | ^2.89.0 | Supabase 클라이언트 |
| `@supabase/ssr` | ^0.8.0 | Supabase SSR 지원 |
| `react-hook-form` | ^7.69.0 | 폼 관리 |
| `zod` | ^4.2.1 | 스키마 검증 |
| `@hookform/resolvers` | ^5.2.2 | react-hook-form + zod 통합 |
| `date-fns` | ^4.1.0 | 날짜 유틸리티 |
| `lucide-react` | ^0.562.0 | 아이콘 라이브러리 |
| `clsx` | ^2.1.1 | className 유틸리티 |
| `tailwind-merge` | ^3.4.0 | Tailwind 클래스 병합 |
| `class-variance-authority` | ^0.7.1 | 컴포넌트 variant 관리 |
| `sonner` | ^2.0.7 | Toast 알림 |
| `next-themes` | ^0.4.6 | 테마 관리 (다크모드) |

### shadcn/ui 컴포넌트 (Radix UI)

| 컴포넌트 | 용도 |
|----------|------|
| `@radix-ui/react-dialog` | 모달/다이얼로그 |
| `@radix-ui/react-dropdown-menu` | 드롭다운 메뉴 |
| `@radix-ui/react-select` | 셀렉트 박스 |
| `@radix-ui/react-tabs` | 탭 UI |
| `@radix-ui/react-avatar` | 아바타 |
| `@radix-ui/react-label` | 폼 라벨 |
| `@radix-ui/react-separator` | 구분선 |
| `@radix-ui/react-slot` | 컴포넌트 슬롯 |

### DevDependencies

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `typescript` | ^5 | TypeScript 컴파일러 |
| `@types/node` | ^20 | Node.js 타입 정의 |
| `@types/react` | ^19 | React 타입 정의 |
| `@types/react-dom` | ^19 | React DOM 타입 정의 |
| `tailwindcss` | ^4 | Tailwind CSS |
| `@tailwindcss/postcss` | ^4 | Tailwind PostCSS 플러그인 |
| `tw-animate-css` | ^1.4.0 | Tailwind 애니메이션 |
| `eslint` | ^9 | 코드 린팅 |
| `eslint-config-next` | 16.1.1 | Next.js ESLint 설정 |

---

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd 2025w-LRS
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (Phase 6에서 추가 예정)
OPENAI_API_KEY=your_openai_key

# Kollus (Phase 2에서 추가 예정)
KOLLUS_API_KEY=
KOLLUS_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ 주의**: `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 5. 프로덕션 빌드

```bash
npm run build
npm run start
```

---

## 📁 프로젝트 구조

```
2025w-LRS/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈 페이지
│   │   └── globals.css        # 전역 스타일
│   ├── components/
│   │   └── ui/                # shadcn/ui 컴포넌트
│   ├── lib/
│   │   └── utils.ts           # 유틸리티 함수
│   ├── types/                 # TypeScript 타입 정의
│   └── hooks/                 # React 커스텀 훅
├── public/                    # 정적 파일
├── components.json            # shadcn/ui 설정
├── tailwind.config.ts         # Tailwind CSS 설정
├── tsconfig.json              # TypeScript 설정
├── next.config.ts             # Next.js 설정
├── package.json               # 패키지 정보
└── .env.local                 # 환경 변수 (git에 미포함)
```

---

## 🎨 shadcn/ui 설정

### 현재 설정 (`components.json`)

- **Style**: New York
- **Base Color**: Slate
- **CSS Variables**: 활성화
- **Icon Library**: lucide-react
- **RSC**: React Server Components 지원

### 설치된 컴포넌트

- ✅ button
- ✅ input
- ✅ card
- ✅ form
- ✅ table
- ✅ tabs
- ✅ badge
- ✅ dialog
- ✅ sonner (toast 대체)
- ✅ select
- ✅ textarea
- ✅ label
- ✅ separator
- ✅ avatar
- ✅ dropdown-menu
- ✅ sheet

### 추가 컴포넌트 설치 방법

```bash
npx shadcn@latest add [component-name]
```

---

## 🗄 Supabase 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에서 새 프로젝트 생성
2. Project Settings → API에서 다음 정보 확인:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY`

### 2. 데이터베이스 스키마 생성

Supabase SQL Editor에서 프로젝트 가이드의 데이터베이스 스키마 SQL을 실행하세요.

---

## 🔧 개발 가이드

### 코드 스타일

- **Formatter**: Prettier (권장)
- **Linter**: ESLint
- **Import Alias**: `@/*` (src 디렉토리 기준)

### Git 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 설정, 패키지 업데이트
```

### 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `fix/*`: 버그 수정 브랜치

---

## 📝 추가 패키지 설치 예정 (Phase별)

### Phase 6: AI 평가 시스템
```bash
npm install openai ai
```

### Phase 9: PDF 리포트
```bash
npm install @react-pdf/renderer
```

---

## 🐛 트러블슈팅

### Node.js 버전 문제
```bash
# nvm 사용 시
nvm install 20
nvm use 20
```

### 패키지 설치 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 빌드 오류
```bash
# Next.js 캐시 삭제
rm -rf .next
npm run build
```

---

## 📚 참고 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)

---

## 📧 문의

프로젝트 관련 문의사항이 있으시면 Issues를 등록해주세요.

---

**Last Updated**: 2025-12-24
