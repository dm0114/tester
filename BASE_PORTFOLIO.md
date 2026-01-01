# Frontend Developer Portfolio

## dm0114 | 프론트엔드 개발자
**경력:** 2년 6개월 | **레벨:** Mid-level 중반
**교육:** SSAFY (삼성 청년 SW 아카데미) 수료
**전문 분야:** React, Vue, TypeScript, 물류 도메인

---

## 한 줄 요약

> **"프로젝트를 0에서 1로 만들어본 경험. 기능 구현보다 '이 로직이 여기 있어야 하나?'를 먼저 질문하는 개발자."**

---

## 1. Profile Summary

2년 6개월 경력의 프론트엔드 개발자입니다.

**핵심 역량:**
- 프로젝트 초기 설계부터 배포까지 전 과정 경험 (Prix Admin 100% 셋업)
- React와 Vue 양쪽 프레임워크 프로덕션 경험
- 물류 도메인 2년+ 집중 경험 → 도메인 학습 불필요
- 사수 없이 독립적으로 기술 결정 및 문제 해결
- 코드 리뷰 담당, 기술 공유/발표 경험

**현재 진행 중:**
- AIMS 3.0 수출신고서(Declaration) 기능 개발 및 리팩토링
- MobX 마이그레이션 (immutable → mutable 상태 관리 전환)

---

## 2. What Makes Me Different (차별화 포인트)

### 2.1 아키텍처적 사고 - "이게 여기 있어야 해?"

단순히 기능을 구현하는 것이 아니라, **책임의 경계를 끊임없이 질문**합니다.

```
실제 의사결정 과정:
"TableModel이 데이터를 가져오는 것까지 알아야 하나?"
"SqManager를 둘 필요도 없을 것 같은데? RouterManager에 포함시키는게 나을 것 같다"
"BaseTab에 data: T로 두는게 안되는거야?"
```

**의미:** 2.5년차에서 "여기 있으면 동작해요"가 아니라 "여기 있어야 맞아요"를 질문하는 것은 **시니어 마인드셋의 시작점**입니다.

### 2.2 패턴 비교 후 선택 - "왜 이 패턴인가?"

디자인 패턴을 단순히 아는 것이 아니라, **장단점을 비교하고 맥락에 맞는 것을 선택**합니다.

```
실제 의사결정 과정:
"TemplateMethod가 더 좋아보이긴 하네"
"믹스인 말고 컴포지션이 좋아보여. 상속의 개념은 아닌 것 같아서"
"override를 쓰면, a, b 로직에 c를 추가할 때 a, b, c가 실행되는 구조인 건 아니야?"
```

**증거:** Prix Admin 기술 스택 선정 시 7개 영역에서 대안 비교 후 선택 (Biome vs ESLint, Lefthook vs Husky 등)

### 2.3 끝까지 파고드는 디버깅 - "근본 원인이 뭐지?"

표면적 해결이 아니라 **여러 레이어를 파고드는 집요함**이 있습니다.

```
실제 디버깅 과정:
"아.. ㅅㅂ 잠시만 airOrder가 프론트에서 수정한 값이 아니라 query값이네"
"근데 필드 일부만 바꾸는데 row 전체를 바꾸는 이유가 있어?"
"좃같네 그러면 그게 공식문서에 적혀있는 거야?"
→ AG-Grid의 applyTransaction 동작 원리까지 파악
```

### 2.4 과잉 설계 거부 - "필요할 때 추가하자"

AI나 다른 개발자의 "더 추가할까요?" 제안에 **불필요한 복잡성은 단호히 거부**합니다.

```
실제 대화:
"controller까지 새로 생성하면 너무 복잡할 것 같아"
"phase5까진 진행 안해도 될 거 같아"
"필요 시 라는 건 필요할 때 추가하는 방향으로 가자"
"주석을 그렇게 안 남겨도 될 거 같아"
```

**의미:** 복잡성을 피하는 실용적 판단력. 오버엔지니어링의 유혹을 이겨내는 것.

### 2.5 타입 안전성 집착 - "any는 쓰지 마"

any 사용을 극도로 꺼리고, **타입 안전성을 유지하려는 노력**을 합니다.

```
실제 피드백:
"any는 쓰지마"
"any보단 unknown이 좋지 않을까"
"K extends keyof typeof POPUP_CONFIGS, 이 부분이 반복되는 게 거슬린다"
"타입 단언을 안 쓰고 프로퍼티에 id를 추가할 수 있는 방법은 없나"
```

**결과:** TypeScript Strict Mode 환경에서 작업, Zod 스키마 기반 런타임 검증

### 2.6 팀원을 고려한 설계 - "다른 개발자가 오용하면?"

본인만 쓸 코드가 아니라, **다른 개발자가 오용할 가능성까지 고려**합니다.

```
실제 고민:
"updateRow 메서드를 열어주는 건.. 같이 일하는 개발자들이 잘못 사용할 것 같기도 해"
"GridApi를 PublicReadonly로 열어서 제어권을 외부에 열어줄지"
```

**의미:** 이건 팀 리드 수준의 사고. API 설계 시 오용 가능성까지 고려.

---

## 3. Growth Timeline (성장 궤적)

```
2023.06 ──────────────────────────────────────────────────── 2025.12
   │              │              │              │              │
   ▼              ▼              ▼              ▼              ▼
 UI 구현       상태관리      프로젝트 설계    성능 최적화    아키텍처
 (Vue)       (Next.js)       (React)        (React)       리팩토링
```

### Phase 1: 시작 (2023.06)
**프로젝트:** Freight Box Client/Admin (Vue)

```
첫 커밋들:
├─ "Booking Page UI 구현"
├─ "User List UI"
├─ "GET API 연결"
└─ "Filter 구현"
```

- Vue.js + Vuetify로 프론트엔드 시작
- 기본적인 UI 구현과 API 연동 학습
- 팀 컨벤션 습득 단계

### Phase 2: 성장 (2023.10)
**프로젝트:** Folderpage (Next.js)

```
주요 커밋들:
├─ "id관리를 위한 store 생성" ← 상태 설계
├─ "상위에서 pagination 로직을 관리하도록 변경" ← 구조 설계
├─ "detail page api 연결"
└─ "form 초기 값 설정"
```

- Next.js로 기술 스택 확장
- 상태 관리 패턴 직접 설계
- 컴포넌트 책임 분리 경험

### Phase 3: 도약 (2024.07) ★
**프로젝트:** Prix Admin (React) - 프로젝트 초기 설계 담당

```
초기 셋업 커밋들 (100% 본인 기여):
├─ "feat: init" (프로젝트 초기화)
├─ "Biome 설정" (린터/포매터)
├─ "pre-commit 적용" (Lefthook)
├─ "editor config" (개발환경)
├─ "query provider setup" (TanStack Query)
├─ "router-setup" (TanStack Router)
├─ "mantine setup" (UI 라이브러리 + 디자인 시스템)
├─ "MSW setup" (API 모킹)
└─ "axios setup" (HTTP 클라이언트 + Token Refresh Queue)
```

**의미:** 이건 "컨벤션을 따랐다"가 아니라 **"컨벤션을 만들었다"**는 증거

### Phase 4: 성숙 (2024.11 ~ 현재)
**프로젝트:** AIMS 3.0 (client-web-pageone-v2)

```
주요 성과:
├─ "Grid config의 suspense 전파로 인한 페이지 전체 리렌더링 방지" ← 성능 최적화
├─ "Order Panel Refactoring" ← 리팩토링
├─ "Cargo Detail 공용화" (385줄 → 203줄, 47% 감소) ← 코드 품질
├─ "테스트 인프라 구축" (Vitest, Playwright)
├─ "MobX 마이그레이션" ← 상태 관리 아키텍처 전환
└─ "Declaration 기능 개발" ← 현재 진행 중
```

- 단순 기능 구현 → **성능 최적화, 아키텍처 설계** 수준으로 발전
- TableModel, FilterModel 책임 분리 설계
- BaseTab 추상화 및 제네릭 적용

---

## 4. Key Projects (핵심 프로젝트)

### 4.1 AIMS 3.0 (client-web-pageone-v2) ★ 메인 프로젝트

**기간:** 2024.11 ~ 현재 (13개월)
**역할:** 핵심 개발자 (239 커밋, 95%+ 기여)
**규모:** 77,500+ 라인, 1,527 파일

**기술 스택:**
```
Frontend    : React 18, TypeScript (Strict)
Routing     : TanStack Router (Type-safe)
State       : TanStack Query, Zustand, MobX (마이그레이션 중)
UI          : Mantine, AG-Grid Enterprise
Form        : React Hook Form + Zod
Test        : Vitest, Playwright, Testing Library
```

**주요 구현 기능:**

#### 1) Planning Tab - Drag & Drop 3분할 패널
```
구현 내용:
├─ 3개 패널 간 항목 Drag & Drop 이동
├─ 실시간 집계 (패널별 카운트)
├─ 상태 변경에 따른 자동 이동
└─ Optimistic Update로 UX 개선
```

#### 2) Export Declaration (수출신고서) - 현재 개발 중
```
구현 내용:
├─ 12개 섹션의 복잡한 폼
│   ├─ ExporterInfo (수출자 정보)
│   ├─ BuyerInfo (구매자 정보)
│   ├─ ManufacturerInfo (제조자 정보)
│   ├─ CustomsOfficeInfo (세관 정보)
│   ├─ ContainerInfo (컨테이너 정보)
│   └─ ... (7개 섹션 추가)
├─ Ran/Commodity 테이블 (동적 행)
├─ Preview 기능
└─ 마이그레이션 결과 모달
```

#### 3) MobX 아키텍처 설계 (현재 진행 중)
```typescript
// 추상 클래스 기반 탭 시스템 설계
abstract class BaseTab<T> {
  abstract data: T
  abstract isLoading: boolean
  abstract get type(): TabType
  abstract get isDirty(): boolean
  abstract loadList(noRef: string): Promise<void>
}

abstract class RefBaseTab<T> extends BaseTab<T> {
  currentNoRef = ''
  abstract setupByNoRef(noRef: string): Generator
}

// TableModel, FilterModel 책임 분리
// - TableModel: 데이터 표시, 선택, 정렬
// - FilterModel: 검색 조건 관리
// - PageModel: 두 모델 조합
```

#### 4) 성능 최적화 사례
```typescript
// 문제: Grid config의 suspense 전파로 페이지 전체 리렌더링
// 해결: Suspense Boundary 최적화

// Before: 전체 페이지가 Suspense에 감싸짐
<Suspense fallback={<PageLoading />}>
  <GridConfig />  // 이게 전파됨
  <OtherComponents />
</Suspense>

// After: Grid만 별도 Suspense로 분리
<OtherComponents />
<Suspense fallback={<GridLoading />}>
  <GridConfig />
</Suspense>
```

#### 5) 대규모 리팩토링 (5건)
| 리팩토링 | Before | After | 개선율 |
|----------|--------|-------|--------|
| Cargo Detail 공용화 | 385줄 | 203줄 | 47% 감소 |
| Customer Paper 공용화 | 중복 코드 | 단일 컴포넌트 | - |
| Order Panel | 모놀리식 | 모듈화 | - |
| Form Field | 하드코딩 | Registry 패턴 | 확장성 증가 |

---

### 4.2 Prix Admin - 프로젝트 초기 설계 담당

**기간:** 2024.07 ~ 2024.12
**역할:** 프로젝트 설계 및 메인 개발 (227 커밋, 88.3% 기여)
**규모:** 228 파일

**기술 스택:**
```
Frontend    : React 18, TypeScript (Strict)
Routing     : TanStack Router
State       : TanStack Query, Zustand
UI          : Mantine v7, Vanilla Extract
Form        : React Hook Form + Zod
Lint        : Biome (ESLint + Prettier 대체)
Git Hooks   : Lefthook
API Mock    : MSW
```

**초기 설계 결정 사항:**

#### 1) 기술 스택 선정 근거
| 기술 | 대안 | 선택 이유 |
|------|------|----------|
| Biome | ESLint + Prettier | 40-80배 빠른 성능, 단일 설정 파일 |
| Lefthook | Husky | Go 기반으로 더 빠름, 병렬 실행 |
| TanStack Router | React Router | 타입 안전성, 파일 기반 라우팅 |
| TanStack Query | SWR / Redux | 강력한 캐싱, DevTools |
| Zustand | Redux / Recoil | 단순한 API, 보일러플레이트 최소 |
| Mantine | MUI / Ant Design | 커스터마이징 용이, 타입 지원 |

#### 2) Token Refresh Queue 패턴 구현
```typescript
// 동시 다발적 401 에러 처리 - 직접 설계한 패턴
let isRefresh = false;
const refreshQueue: ((newToken: string) => void)[] = [];

// 다른 요청이 이미 갱신 중이면 큐에 추가
if (isRefresh) {
  return new Promise((resolve) => {
    refreshQueue.push((newToken: string) => {
      config.headers.Authorization = `Bearer ${newToken}`;
      resolve(axios(config));
    });
  });
}

isRefresh = true;
const { accessToken, refreshToken } = await getRefreshToken();
setTokens(accessToken, refreshToken);
isRefresh = false;

// 큐에 있던 요청들 새 토큰으로 재실행
refreshQueue.forEach((cb) => cb(accessToken));
```

#### 3) 디자인 시스템 구축
```typescript
// 28개 파일, 836 lines의 테마 시스템
export const theme = {
  colors: {
    // 15개 컬러 팔레트
    // 시맨틱 컬러 (background 43개, content 37개, border 31개)
  },
  typography: {
    // body, display, headings, label
  }
};
```

#### 4) 물류 도메인 계산 로직
```typescript
// 물류 업계 표준 계산식 구현
class CargoDetailCalculator {
  // CBM (Cubic Meter) - 소수점 정밀도 운송 모드별 다름
  static getCbm(cargoDetail, modeOfTransport) {
    const result = l * w * h * pkgs * (CM_TO_METERS ** 3);
    return modeOfTransport === 'LCL'
      ? Number(result.toFixed(3))  // 해상: 3자리
      : Number(result.toFixed(6)); // 항공: 6자리
  }

  // C'WT (Chargeable Weight) - 0.5 단위 반올림
  static getCWT(gwt, vwt) {
    const cwt = Math.max(gwt, vwt);
    const float = cwt - Math.floor(cwt);

    if (float === 0) return cwt;
    if (float <= 0.5) return Math.floor(cwt) + 0.5;
    return Math.floor(cwt) + 1;
  }
}
```

---

### 4.3 Freight Box Admin (Vue)

**기간:** 2023.06 ~ 2024.06
**역할:** 협업 개발자 (58 커밋, 17% 기여, 11명 중 2위)

**기술 스택:**
```
Frontend    : Vue 2.7, TypeScript
State       : Pinia + Persist
UI          : Vuetify 2
Form        : VeeValidate
```

**주요 구현:**
- 권한 기반 UI 시스템 (RBAC)
- 회원 가입 승인 워크플로우
- JWT 토큰 관리 및 역할 추출

---

### 4.4 sync-notion (100% 개인 개발)

**GitHub Action으로 PR 상태 → Notion 자동 동기화**

```yaml
# 팀 생산성 도구 직접 개발
- GitHub PR 생성/머지/클로즈 이벤트 감지
- Notion Database 자동 업데이트
- Reusable Workflow 패턴 적용
```

**의미:** 팀에서 요청하지 않은 도구를 **필요성을 느끼고 직접 만들어 기여**

---

## 5. Technical Skills

### 확실한 강점 (80%+)

```
React 18 + TanStack    ████████████████████ 85%
├─ TanStack Router (Type-safe 라우팅)
├─ TanStack Query (서버 상태 관리)
├─ TanStack Table (복잡한 테이블)
├─ Zustand (경량 상태관리)
└─ React Hook Form + Zod

프로젝트 셋업         ████████████████████ 85%
├─ 기술 스택 선정 (대안 비교 후 결정)
├─ 폴더 구조 설계
├─ 린팅/포매팅 규칙 (Biome)
├─ Git Hooks (Lefthook)
└─ CI/CD 기본 설정

폼/테이블 처리        ████████████████████ 85%
├─ useFieldArray 동적 폼
├─ 조건부 Zod 검증
├─ AG-Grid Enterprise
├─ TanStack Table + 인라인 편집
└─ 복잡한 계산 로직 통합
```

### 실무 경험 있음 (70%+)

```
Vue 2.7 + Pinia       ████████████████░░░░ 75%
├─ Composition API
├─ Pinia (상태관리)
├─ Vuetify (UI)
└─ VeeValidate (폼)

TypeScript (Strict)   ████████████████░░░░ 80%
├─ Generic 타입 활용
├─ Zod 스키마 + z.infer
├─ ts-pattern 패턴 매칭
├─ Type Guard
└─ any 사용 극도로 회피

MobX                  ████████████████░░░░ 70%
├─ Observable/Action/Computed
├─ flow (Generator 기반 async)
├─ 클래스 기반 상태 관리
└─ 현재 마이그레이션 진행 중
```

### 성장 중인 영역 (60%+)

```
성능 최적화           ████████████░░░░░░░░ 65%
├─ Suspense 최적화 (경험 있음)
├─ useMemo/useCallback 전략적 사용
└─ 더 많은 경험 필요

테스트 코드           ████████████░░░░░░░░ 60%
├─ Vitest (최근 도입)
├─ Playwright (최근 도입)
├─ 테스터블한 코드 작성 중
└─ 커버리지 확대 필요
```

---

## 6. Work Style (업무 스타일)

### 의사결정 방식

```
특징:
├─ AI 기반으로 여러 대안 비교 후 선택
├─ 장단점을 명확히 문서화
├─ "동작하면 끝"이 아니라 "왜 이 구조인가" 질문
├─ 불필요한 복잡성 단호히 거부
└─ 팀과 공유 후 합의
```

### 독립적 문제 해결

```
특징:
├─ 사수 없이 스스로 기술 결정
├─ 문제 발견 → 원인 분석 → 해결까지 독립적 수행
├─ 표면적 해결이 아닌 근본 원인까지 파고듦
└─ 예: Suspense 전파 문제, AG-Grid applyTransaction 동작 원리 파악
```

### 협업 방식

```
API 협업:
├─ OpenAPI/Swagger 기반 백엔드와 인터페이스 협의
├─ MSW로 백엔드 독립 개발
└─ Orval로 타입 자동 생성

디자인 협업:
├─ Figma 기반 디자인 시스템 구현
├─ 구현하면서 개선점 제안
└─ 디자인 토큰 시스템화
```

### 팀 기여

```
역할:
├─ 코드 리뷰 담당
├─ 기술 공유/발표
├─ 팀 도구 개발 (sync-notion)
├─ 컨벤션 수립 (Prix Admin)
└─ 다른 개발자의 오용 가능성까지 고려한 API 설계
```

---

## 7. Domain Knowledge (도메인 지식)

### 물류 도메인 2년+ 경험

```
구현 경험 있는 기능들:
├─ 견적 시스템
│   ├─ FCL (Full Container Load)
│   ├─ LCL (Less than Container Load)
│   └─ Air (항공)
├─ 예약 관리 시스템
├─ 화물 상세 관리
│   ├─ CBM, V'WT, C'WT 계산
│   ├─ 컨테이너 타입별 로직 (DRY, REEFER, OPEN_TOP, FLAT_RACK)
│   └─ Unit 변환 (CM/INCH, KG/LBS)
├─ 수출신고서 (Declaration) - 12개 섹션
├─ HAWB/MAWB (항공화물운송장)
├─ Triangle Shipment (삼각무역)
├─ 어드민 대시보드
├─ 사용자/권한 관리 (RBAC)
└─ 다국어 지원 (i18n)
```

**장점:** 물류 회사 취업 시 도메인 학습 기간 불필요, **즉시 기여 가능**

---

## 8. Level Assessment (레벨 평가)

```
Junior ━━━━━━━━━━ Mid-level ━━━━━━━━━━ Senior
                       ↑
                   여기 (중반)
```

**경력:** 2년 6개월
**실력:** Mid-level 중반

### 일반 Mid-level과의 차이

| 항목 | 일반 Mid-level | 나 |
|------|----------------|-----|
| 구조 설계 | 주어진 구조 따름 | "이 로직이 여기 있어야 해?" 질문 |
| 패턴 선택 | 배운 대로 적용 | 장단점 비교 후 맥락에 맞게 선택 |
| 디버깅 | 표면적 해결 | 근본 원인까지 파고듦 |
| 복잡성 관리 | 제안 수용 | 불필요한 복잡성 단호히 거부 |
| 타입 안전성 | 적당히 사용 | any 극도로 회피 |
| 팀 고려 | 본인 코드 집중 | 오용 가능성까지 설계에 반영 |

### 근거
| 항목 | 상태 | 증거 |
|------|------|------|
| 프로젝트 설계 | ✅ | Prix Admin 초기 셋업 100% |
| 아키텍처 사고 | ✅ | TableModel/FilterModel 책임 분리 설계 |
| 성능 최적화 | ✅ | Suspense 전파 문제 해결 |
| 리팩토링 | ✅ | 5건의 대규모 리팩토링 |
| 독립적 개발 | ✅ | sync-notion 100% 개발 |
| 테스트 코드 | ⚠️ | 최근 도입, 확대 중 |

---

## 9. Interview Points (면접 어필 포인트)

### 말할 수 있는 것

1. **"프로젝트 초기 설계 경험"**
   - Prix Admin에서 기술 스택, 린팅 규칙, Git Hooks까지 직접 결정
   - 227 커밋 (88.3% 기여)

2. **"아키텍처적 사고"**
   - 기능 구현보다 "이 로직이 여기 있어야 하나?"를 먼저 질문
   - MobX 마이그레이션에서 TableModel, FilterModel 책임 분리 설계

3. **"React, Vue 양쪽 프로덕션 경험"**
   - React: AIMS 3.0, Prix Admin
   - Vue: Freight Box Admin

4. **"성능 최적화 경험"**
   - Suspense 전파 문제 발견하고 해결
   - useMemo/useCallback 전략적 활용

5. **"물류 도메인 2년+ 경험"**
   - 견적, 예약, 수출신고서 시스템 구현
   - 도메인 계산 로직 (CBM, V'WT, C'WT)

6. **"독립적 문제 해결"**
   - 사수 없이 기술 결정
   - 팀 도구 직접 개발 (sync-notion)

### 질문 대응 예시

**Q: 가장 복잡했던 기능은?**

> "Prix Admin의 화물 정보 테이블이 가장 도전적이었습니다. React Hook Form의 useFieldArray와 TanStack Table을 통합하여 각 셀을 편집 가능한 폼 필드로 만들었고, 컨테이너 타입에 따라 동적으로 컬럼을 생성했습니다.
>
> 특히 물류 도메인의 계산 로직(CBM, V'WT 등)을 소수점 6자리까지 정밀하게 구현했고, ts-pattern으로 타입별 분기를 안전하게 처리했습니다."

**Q: 성능 최적화 경험은?**

> "AIMS 3.0에서 Grid config의 Suspense가 페이지 전체로 전파되어 불필요한 리렌더링이 발생하는 문제를 발견했습니다. Suspense Boundary를 분리하여 Grid만 별도로 감싸는 방식으로 해결했습니다.
>
> 또한 동적 폼에서 watch 대신 Controller를 사용해 리렌더링을 최소화하고, 검색 기능에 디바운스를 적용했습니다."

**Q: 팀에서 어떤 역할을 하나요?**

> "코드 리뷰를 담당하고, 기술 공유/발표를 합니다. 특히 API 설계 시 다른 개발자가 오용할 수 있는 가능성까지 고려합니다.
>
> 예를 들어 GridApi를 protected로 제한하여 외부에서 직접 수정하지 못하게 하고, 필요한 기능만 public 메서드로 노출했습니다. 'updateRow 메서드를 열어주면 같이 일하는 개발자들이 잘못 사용할 것 같다'는 고민을 항상 합니다."

---

## 10. Growth Roadmap (성장 방향)

### 현재 잘하고 있는 것
- 프로덕션 코드 기여
- 다양한 기술 스택 경험
- 도메인 지식 축적
- 아키텍처적 사고 시작

### 앞으로 쌓아야 할 것
1. **테스트 코드** - 현재 확대 중, 커버리지 증가 필요
2. **성능 최적화** - 더 많은 케이스 경험 필요
3. **기술 블로그** - Prix Admin 셋업, Suspense 문제 해결 등 문서화

---

## 11. Contact

- **GitHub:** github.com/dm0114
- **Email:** [이메일 주소]

---

*Last Updated: 2025-12-17*
