# Portfolio Monorepo

외주 및 포트폴리오 사이트 모노레포.

## Tech Stack

- **Build**: Turborepo + pnpm workspace
- **Frontend**: React 19, TanStack Router/Query/Form
- **UI**: shadcn/ui (Radix UI + Tailwind CSS 4)
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Deploy**: Vercel

## Structure

```
portfolio/
├── apps/
│   ├── landing/          # 메인 랜딩 페이지
│   ├── hr-admin/         # HR 관리자
│   ├── hr-pwa/           # HR PWA
│   └── freight-calc/     # 화물 운임 계산기
├── packages/
│   ├── ui/               # 공유 UI 컴포넌트
│   ├── api/              # Supabase 클라이언트 + domains
│   ├── types/            # 공유 타입
│   └── config/           # 공통 설정
└── supabase/             # DB 스키마
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build all
pnpm build

# Type check
pnpm type-check
```

## Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

## Deployment (Vercel)

각 앱은 별도 Vercel 프로젝트로 배포:

1. Vercel에서 저장소 연결
2. Root Directory: `apps/landing` (또는 해당 앱)
3. Build Command: 자동 감지 (vercel.json)
4. 환경 변수 설정: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Apps

| App | Port | URL |
|-----|------|-----|
| Landing | 3000 | portfolio-landing.vercel.app |
| HR Admin | 3001 | portfolio-hr-admin.vercel.app |
| HR PWA | 3002 | portfolio-hr-pwa.vercel.app |
| Freight Calc | 3003 | portfolio-freight-calc.vercel.app |
