# Frontend Developer Portfolio
## 스타트업 지원용

---

## dm0114 | 프론트엔드 개발자
**경력:** 2년 6개월 | **특징:** 프로젝트 초기 설계 경험, 독립적 문제 해결

> **"프로젝트를 0에서 1로 만들어본 경험. 사수 없이 독립적으로 성장했습니다."**

---

## 1. 왜 스타트업에 적합한가

### 프로젝트 초기 설계 경험 (Prix Admin)

```
2024년 7월, 새 프로젝트를 처음부터 직접 설계했습니다.

직접 결정한 것들:
├─ 기술 스택 선정 (React 18, TanStack, Mantine)
├─ 린터/포매터 선택 (Biome - ESLint + Prettier 대체)
├─ Git Hooks 설정 (Lefthook)
├─ 폴더 구조 설계 (Feature-Sliced Design)
├─ API 구조 설계 (MSW, Axios interceptor)
├─ 디자인 시스템 구축 (28개 파일, 836 lines)
└─ 상태 관리 전략 (TanStack Query + Zustand)
```

**커밋 증거:**
```
feat: init                    → 프로젝트 초기화
Biome 설정                    → 린터 선택 및 설정
pre-commit 적용               → Git Hooks 구축
editor config                 → 개발환경 표준화
query provider setup          → TanStack Query 구조
router-setup                  → Type-safe 라우팅
mantine setup                 → UI 라이브러리 + 디자인 시스템
MSW setup                     → API 모킹 전략
axios setup                   → HTTP 클라이언트 + Token Refresh
```

**결과:** 227 커밋 (88.3% 기여) - 프로젝트를 주도적으로 완성

---

### 독립적 문제 해결 능력

```
특징:
├─ 사수 없이 스스로 기술 결정
├─ AI 기반으로 여러 대안 비교 후 선택
├─ 문제 발견 → 원인 분석 → 해결까지 독립 수행
└─ 팀에서 요청하지 않은 도구도 직접 개발
```

**예시 1: Suspense 성능 문제 해결**
```typescript
// 문제: Grid config의 suspense가 페이지 전체 리렌더링 유발
// 발견: 개발하다가 직접 발견
// 해결: Suspense Boundary 분리

// Before
<Suspense fallback={<PageLoading />}>
  <GridConfig />  // 전파됨
  <OtherComponents />
</Suspense>

// After
<OtherComponents />
<Suspense fallback={<GridLoading />}>
  <GridConfig />  // 격리됨
</Suspense>
```

**예시 2: 팀 도구 직접 개발 (sync-notion)**
```
팀에서 요청하지 않았지만 필요성을 느껴 직접 개발

구현 내용:
├─ GitHub PR 상태 → Notion 자동 동기화
├─ GitHub Action Workflow
├─ Reusable Workflow 패턴
└─ 100% 본인 개발
```

---

### 빠른 성장 속도

```
2023.06 ──────────────────────────────────────── 2025.12
   │         │         │         │         │
   ▼         ▼         ▼         ▼         ▼
 UI 구현   상태관리  프로젝트   성능 최적화  기능 개발
          설계     초기 설계              리팩토링
```

**2년 6개월 동안:**
- UI 구현 → 상태 관리 설계 → 프로젝트 아키텍처 → 성능 최적화
- 비전공 (SSAFY) → Mid-level 중반

---

## 2. 기술 스택 선정 능력

### Prix Admin 기술 스택 선정 근거

| 선택 | 대안 | 선택 이유 |
|------|------|----------|
| **Biome** | ESLint + Prettier | 40-80배 빠름, 단일 설정 파일, 유지보수 쉬움 |
| **Lefthook** | Husky | Go 기반으로 더 빠름, 병렬 실행 기본 지원 |
| **TanStack Router** | React Router | 타입 안전성, 파일 기반 라우팅 |
| **TanStack Query** | SWR, Redux | 강력한 캐싱, DevTools, Optimistic Update |
| **Zustand** | Redux, Recoil | 단순한 API, 보일러플레이트 최소, 러닝 커브 낮음 |
| **Mantine** | MUI, Ant Design | 커스터마이징 용이, 타입 지원 우수, 번들 사이즈 작음 |
| **MSW** | JSON Server | 네트워크 레벨 목킹, 실제 환경과 유사 |

### 실제 설정 예시

**Biome 설정 (biome.json):**
```json
{
  "linter": {
    "rules": {
      "noConsole": "error",
      "noUnusedImports": "error",
      "useFilenamingConvention": {
        "level": "error",
        "options": { "filenameCases": ["kebab-case"] }
      }
    }
  }
}
```

**Lefthook 설정 (lefthook.yml):**
```yaml
pre-commit:
  parallel: true
  commands:
    type-check:
      run: pnpm type-check
    check:
      run: pnpx @biomejs/biome check --write {staged_files}
      stage_fixed: true
```

---

## 3. 핵심 프로젝트

### 3.1 Prix Admin - 프로젝트 초기 설계 ★

**역할:** 프로젝트 설계 및 메인 개발
**기여도:** 227 커밋 (88.3%)

**구축한 시스템:**
```
├─ 디자인 시스템 (28개 파일, 836 lines)
│   ├─ 15개 컬러 팔레트
│   ├─ 시맨틱 컬러 (background, content, border)
│   └─ 타이포그래피 시스템
├─ Token Refresh Queue 패턴
├─ Feature-Sliced Design 폴더 구조
├─ Compound Component 패턴 (Pagination)
└─ 복잡한 폼/테이블 시스템
```

### 3.2 AIMS 3.0 - 긴급 투입 & 핵심 기여

**상황:** 기능 개발이 안 된 프로젝트에 긴급 투입
**결과:** 13개월간 239 커밋, 95%+ 기여

**기여 내용:**
```
├─ 15개+ 주요 기능 개발 (Planning, Instruction, Declaration 등)
├─ 5건 대규모 리팩토링
├─ 성능 최적화 (Suspense 전파 방지)
├─ 테스트 인프라 구축 (Vitest, Playwright)
└─ 54개+ QA 이슈 대응
```

### 3.3 sync-notion - 100% 개인 개발

**팀 생산성 도구 직접 개발:**
```
├─ GitHub PR 상태 → Notion 자동 동기화
├─ GitHub Action Workflow
├─ Reusable Workflow 패턴
└─ 문서화
```

---

## 4. 스타트업에서 기대되는 역할

### 할 수 있는 것

```
✅ 프로젝트 초기 설계
   └─ 기술 스택 선정, 폴더 구조, 린팅/포매팅, Git Hooks

✅ 빠른 MVP 개발
   └─ React/Vue 둘 다 가능, 복잡한 폼/테이블 빠르게 구현

✅ 독립적 기능 개발
   └─ 사수 없이 스스로 문제 해결, AI 활용

✅ 코드 품질 관리
   └─ TypeScript Strict, Zod 검증, 린팅/테스트

✅ 팀 문화 구축
   └─ 코드 리뷰, 기술 공유, 컨벤션 수립
```

### 성장 방향

```
현재: Mid-level 중반 (프로젝트 설계 경험 보유)
단기: 테스트 코드 확대, 성능 최적화 심화
중기: 기술 리드, 주니어 멘토링
```

---

## 5. 기술 스택

### Frontend
```
React 18         ████████████████████ 90%
Vue 2.7          ████████████████░░░░ 75%
TypeScript       ████████████████████ 85%
Next.js          ████████████░░░░░░░░ 60%
```

### 프로젝트 셋업
```
기술 스택 선정    ████████████████████ 90%
폴더 구조 설계    ████████████████████ 85%
린팅/포매팅       ████████████████████ 90%
Git Hooks        ████████████████████ 85%
CI/CD 기본       ████████████████░░░░ 70%
```

### 상태 관리
```
TanStack Query   ████████████████████ 90%
Zustand          ████████████████████ 85%
Pinia            ████████████████░░░░ 75%
```

---

## 6. 협업 스타일

### 커뮤니케이션
```
├─ 주도적으로 개선점 제안
├─ 구현하면서 디자인/기획 피드백
├─ API 스펙 백엔드와 직접 협의
└─ 코드 리뷰 적극 참여
```

### 의사결정
```
├─ AI 기반 대안 비교 후 결정
├─ 장단점 명확히 문서화
├─ 팀과 공유 후 합의
└─ 빠른 실행, 필요시 수정
```

---

## 7. 적합한 포지션

```
✓ 초기 스타트업 프론트엔드 개발자 (프로젝트 셋업 필요)
✓ 소규모 팀 (독립적 개발 필요)
✓ MVP 빠르게 개발해야 하는 상황
✓ 기술 문화 함께 만들어갈 수 있는 환경
```

---

## 8. 연락처

- **GitHub:** github.com/dm0114
- **Email:** [이메일 주소]

---

*프로젝트를 0에서 1로 만들어본 경험. 스타트업에서 즉시 기여 가능합니다.*
