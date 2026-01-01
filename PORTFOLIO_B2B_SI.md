# Frontend Developer Portfolio
## B2B / SI 기업 지원용

---

## dm0114 | 프론트엔드 개발자
**경력:** 2년 6개월 | **전문:** 어드민/대시보드 시스템

> **"복잡한 B2B 어드민 시스템 개발 경험. 대용량 테이블, 복잡한 폼 처리 전문."**

---

## 1. B2B 어드민 개발 경험 Summary

### 구현 경험 있는 엔터프라이즈 기능

| 기능 | 구현 내용 |
|------|----------|
| **복잡한 테이블** | AG-Grid, TanStack Table, 인라인 편집, 서버 페이지네이션 |
| **복잡한 폼** | 다단계 폼, 동적 필드, 조건부 검증, 실시간 계산 |
| **권한 관리** | RBAC, JWT 토큰, 역할별 UI 분기 |
| **워크플로우** | 승인 프로세스, 상태 관리, Blocker 패턴 |
| **검색/필터** | 다중 필드 검색, 날짜 범위, 디바운스 |
| **데이터 처리** | Excel 다운로드, 일괄 작업, 대용량 데이터 |

---

## 2. 핵심 어드민 프로젝트

### 2.1 AIMS 3.0 - 대규모 어드민 시스템 ★

**기간:** 2024.11 ~ 현재 (13개월)
**역할:** 핵심 개발자 (239 커밋, 95%+ 기여)
**규모:** 77,500+ 라인, 1,527 파일

**기술 스택:**
```
React 18, TypeScript (Strict)
TanStack Router/Query, Zustand
AG-Grid Enterprise, Mantine
React Hook Form + Zod
Vitest, Playwright
```

#### 구현한 복잡한 기능들:

**1) 17개 Code Management 페이지**
```
├─ 세관 코드 관리
├─ HS Code 관리
├─ 운송업체 관리
├─ 파트너 관리
├─ 사용자 관리
└─ ... (12개 추가)
```

**2) Editable Grid 시스템**
```typescript
// AG-Grid + 인라인 편집 + 자동 저장

<AgGridReact
  rowData={data}
  onCellValueChanged={async (params) => {
    await mutation.mutateAsync({
      id: params.data.id,
      field: params.colDef.field,
      value: params.newValue
    });
  }}
  // Optimistic Update
  // Rollback on Error
/>
```

**3) 복잡한 필터 시스템**
```typescript
// Zod 스키마 기반 URL 파라미터 관리
const SearchSchema = z.object({
  page: z.coerce.number().default(1),
  page_size: z.coerce.number().default(20),
  cd_send_state: z.string().optional(),
  cd_receive_state: z.string().optional(),
  search_type_dt: z.string().default('dt_dclr'),
  dt_start: z.string().optional(),
  dt_end: z.string().optional(),
  // ... 20+ 필터 필드
});
```

**4) 페이지네이션 컴포넌트 자체 구현**
```typescript
// Compound Component 패턴
<Pagination page={page} total={total} perPage={pageSize}>
  <Pagination.Select />      {/* 페이지 사이즈 */}
  <Pagination.Status />      {/* "1-10 of 100" */}
  <Pagination.First />
  <Pagination.Prev />
  <Pagination.Next />
  <Pagination.Last />
</Pagination>
```

**5) 성능 최적화**
```
├─ Suspense Boundary 최적화 (전체 리렌더링 방지)
├─ useMemo/useCallback 전략적 사용
├─ 검색 디바운스
└─ Query 캐싱 전략
```

---

### 2.2 Prix Admin - 복잡한 폼 시스템

**기간:** 2024.07 ~ 2024.12
**역할:** 프로젝트 설계 및 메인 개발 (88.3% 기여)

#### 구현한 복잡한 폼:

**1) 다단계 견적 폼**
```
Step 1: Bound 선택 (수출/수입)
    ↓
Step 2: Basic Form
    ├─ POL/POD (출발/도착항)
    ├─ Item Type
    └─ 운송 모드 선택
    ↓
Step 3: Additional Form
    ├─ 통관 정보
    └─ 특수 요청사항
    ↓
Step 4: Cargo Detail (동적 테이블)
    ├─ FCL: Container 행 추가/삭제
    └─ AIR/LCL: 화물 명세 행 추가/삭제
```

**2) 동적 테이블 폼 (useFieldArray)**
```typescript
const { fields, append, remove } = useFieldArray({
  control,
  name: "cargoDetails"
});

// 각 셀이 폼 필드로 연결
<Controller
  control={control}
  name={`cargoDetails.${index}.containerType`}
  render={({ field }) => <Select {...field} />}
/>
```

**3) 조건부 Zod 검증**
```typescript
const schema = z.object({
  bound: z.enum(['EXPORT', 'IMPORT']),
  // bound에 따라 다른 필드 검증
  exporterInfo: z.object({...}).optional()
    .refine((val) => bound === 'EXPORT' ? val !== undefined : true),
});
```

**4) 실시간 계산 필드**
```typescript
// 폼 값 변경 시 자동 계산
const watchedValues = watch(['length', 'width', 'height', 'quantity']);

useEffect(() => {
  const cbm = calculateCBM(watchedValues);
  setValue('cbm', cbm);
}, [watchedValues]);
```

---

### 2.3 Freight Box Admin - 권한 관리 시스템

**기간:** 2023.06 ~ 2024.06
**역할:** 협업 개발자 (11명 중 2위 기여도)

#### 구현한 권한 기능:

**1) RBAC (역할 기반 접근 제어)**
```typescript
// Pinia Store 기반 권한 관리
const useAdminStore = defineStore("admin", {
  state: () => ({
    role: null as AdminRole | null
  }),
  getters: {
    hasAdminRole: (state) => state.role === 'ADMIN_BASIC',
    hasManagerRole: (state) => state.role === 'MANAGER'
  }
});

// 템플릿에서 사용
<v-btn v-if="hasAdminRole" @click="delete">삭제</v-btn>
```

**2) JWT 토큰 관리**
```typescript
// 토큰 저장 및 역할 추출
function saveToken(accessToken: string) {
  const decoded = jwt_decode(accessToken);
  this.role = decoded.role;
  this.id = decoded.sub;
}
```

**3) 회원 승인 워크플로우**
```
대기 회원 목록
    ↓
드롭다운 선택 (승인/반려/종료)
    ↓
Dialog (Code 입력 / 사유 입력)
    ↓
API 요청
    ↓
Toast 알림 + 리스트 갱신
```

---

## 3. 기술 스택 상세

### 테이블 전문성
```
AG-Grid Enterprise   ████████████████████ 90%
├─ 서버 사이드 페이지네이션
├─ 인라인 편집
├─ Column Pinning
├─ Row Selection
├─ Custom Cell Renderer
└─ Excel Export

TanStack Table       ████████████████████ 85%
├─ useFieldArray 연동
├─ 동적 컬럼 생성
├─ 정렬/필터링
└─ 가상화 (Virtual)
```

### 폼 처리 전문성
```
React Hook Form      ████████████████████ 90%
├─ useFieldArray (동적 배열)
├─ Controller (커스텀 입력)
├─ watch (실시간 감지)
└─ FormProvider (중첩 폼)

Zod Validation       ████████████████████ 85%
├─ 조건부 검증 (.refine)
├─ 스키마 합성 (.merge, .extend)
├─ Transform
└─ URL 파라미터 검증
```

### 상태 관리
```
TanStack Query       ████████████████████ 90%
├─ Query Key Factory
├─ Optimistic Update
├─ Cache Invalidation
├─ Infinite Query
└─ Prefetching

Zustand             ████████████████████ 85%
├─ Persist Middleware
├─ Slice 패턴
├─ DevTools 연동
└─ 타입 안전성
```

---

## 4. 엔터프라이즈 기능 구현 경험

### 인증/인가
```
✅ JWT 토큰 관리 (Access + Refresh)
✅ Token Refresh Queue (동시 요청 처리)
✅ 역할 기반 UI 분기 (RBAC)
✅ 라우터 가드
✅ localStorage 영속화
```

### 데이터 처리
```
✅ 서버 사이드 페이지네이션
✅ 복잡한 정렬/필터링
✅ Excel 다운로드
✅ 일괄 작업 (Bulk Operations)
✅ 대용량 데이터 처리
```

### 사용자 경험
```
✅ Skeleton UI (로딩)
✅ Toast 알림 (성공/실패)
✅ Error Boundary
✅ Blocker 패턴 (변경 시 이탈 방지)
✅ Optimistic Update
```

### 코드 품질
```
✅ TypeScript Strict Mode
✅ Zod 스키마 검증
✅ ESLint/Biome
✅ Pre-commit Hooks
✅ 테스트 (Vitest, Playwright)
```

---

## 5. 협업 경험

### 대규모 팀 협업
```
├─ 11명 개발자 협업 (Freight Box)
├─ Git Flow 브랜치 전략
├─ PR 리뷰 프로세스
├─ Jira 티켓 연동
└─ 코드 리뷰 담당
```

### 백엔드 협업
```
├─ OpenAPI/Swagger 기반 인터페이스 협의
├─ Orval로 타입 자동 생성
├─ MSW로 백엔드 독립 개발
└─ API 에러 핸들링 표준화
```

---

## 6. 기대 역할

### 적합한 포지션
```
✓ B2B SaaS 프론트엔드 개발자
✓ 어드민/백오피스 시스템 개발
✓ ERP/CRM 프론트엔드 개발
✓ 대시보드 시스템 개발
```

### 기여 가능 영역
```
✓ 복잡한 테이블 UI 구현
✓ 복잡한 폼 시스템 설계
✓ 권한 관리 시스템 구축
✓ 데이터 시각화 대시보드
✓ 코드 품질 개선 (린팅, 테스트)
```

---

## 7. 연락처

- **GitHub:** github.com/dm0114
- **Email:** [이메일 주소]

---

*복잡한 B2B 어드민 시스템 개발 경험. 즉시 프로젝트 투입 가능합니다.*
