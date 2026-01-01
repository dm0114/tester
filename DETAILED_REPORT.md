# Developer Portfolio - Technical Analysis Report

## Developer Profile
**Name:** dmdm (dm0114)
**Experience:** 2년 6개월
**Level:** Mid-level (Junior → Mid 전환 완료)
**Focus:** Frontend Development (React/Vue), Logistics Domain

---

## Growth Trajectory (시간순 성장 궤적)

### Timeline Overview

```
2023.06 ─────────────────────────────────────────────────── 2025.06
   │                    │                │                    │
   ▼                    ▼                ▼                    ▼
 UI 구현             상태관리/API      프로젝트 셋업       성능 최적화
 (Vue)              연동 학습          직접 설계            리팩토링
                   (Next.js)          (React)              (React)
```

---

### Phase 1: 시작 (2023년 6월)
**프로젝트:** aif-freight-box-client-web, aif-freight-box-admin-web

```
첫 커밋들:
├─ "✨ Booking Page UI 구현"
├─ "✨ User List UI"
├─ "GET API 연결"
├─ "API조건 추가 및 Filter 구현"
└─ "delete api 연결"
```

**특징:**
- Vue.js + Vuetify로 시작
- 기본적인 UI 구현과 API 연동
- 팀 컨벤션 학습 단계

---

### Phase 2: 성장 (2023년 10월)
**프로젝트:** grit-pageone-folderpage-client-web (Next.js)

```
주요 커밋들:
├─ "id관리를 위한 store 생성"
├─ "상위에서 pagination 로직을 관리하도록 변경"
├─ "detail page api 연결"
├─ "form ui 구현"
└─ "form 초기 값 설정"
```

**특징:**
- Next.js로 기술 스택 확장
- 상태 관리 패턴 직접 설계 ("id관리를 위한 store 생성")
- 컴포넌트 구조 설계 ("상위에서 pagination 로직 관리")

---

### Phase 3: 도약 (2024년 7월) ★ 핵심
**프로젝트:** aif-prix-admin (React + TypeScript)

```
프로젝트 초기 셋업 직접 담당:
├─ "feat: init" (프로젝트 초기화)
├─ "Biome 설정" (린터/포매터 결정)
├─ "pre-commit 적용" (Git hooks)
├─ "editor config" (개발환경 표준화)
├─ "query provider setup" (TanStack Query 구조)
├─ "router-setup" (TanStack Router)
├─ "mantine setup" (UI 라이브러리 선택)
├─ "MSW setup" (API 모킹 전략)
└─ "axios setup" (HTTP 클라이언트 구조)
```

**의미:**
- **프로젝트 아키텍처를 처음부터 직접 설계**
- 기술 스택 선택: React 18, TanStack, Mantine, Biome
- 개발 환경 표준화: pre-commit, editor config
- API 전략: MSW 모킹, Axios 인터셉터 구조

---

### Phase 4: 성숙 (2024년 11월 ~ 현재)
**프로젝트:** client-web-pageone-v2 (AIMS 3.0)

```
초기 기여:
├─ "Common Client", "Top bar", "Side bar"
├─ "Grid pagination", "Code page filter"
└─ 기본 컴포넌트 구축

최근 기여 (2025):
├─ "Grid config의 suspense 전파로 인한 페이지 전체 리렌더링 방지" ← 성능 최적화
├─ "Order Panel Refactoring" ← 리팩토링
├─ "query option, mutation 정리" ← 코드 구조화
├─ "Triangle shipement invalidate query key 수정" ← 캐시 전략
└─ "테이블 셀렉트 에디터" ← 복잡한 UI 컴포넌트
```

**성장 증거:**
- 단순 기능 구현 → **성능 최적화, 리팩토링** 수준으로 발전
- React Suspense 이해하고 문제 해결
- Query invalidation 캐시 전략 다룸

---

### Phase 5: 독립적 프로젝트 (2025년 9월)
**프로젝트:** sync-notion (100% 본인 개발)

```
완전한 독립 개발:
├─ GitHub Action 워크플로우 설계
├─ Notion API 연동 구현
├─ Reusable workflow 패턴 적용
└─ 문서화까지 완료
```

**의미:**
- 외부 의존 없이 처음부터 끝까지 독립 개발
- 팀 생산성 도구 직접 만들어 기여

---

## Honest Skill Assessment (수정됨)

### 확실한 강점

```
프로젝트 셋업/아키텍처  ████████████████░░░░ 80%
└─ Prix Admin에서 처음부터 설계한 이력 있음
└─ Biome, TanStack Router/Query, MSW 구조 직접 결정

React 생태계            ████████████████░░░░ 80%
└─ React 18, TanStack Router/Query
└─ Suspense 관련 성능 최적화 경험
└─ 커스텀 훅 작성 능력

Vue 생태계              ████████████████░░░░ 75%
└─ Vue 2 + Composition API
└─ Vuetify, Pinia 실무 경험

TypeScript              ████████████████░░░░ 75%
└─ Strict mode 환경 경험
└─ Zod 스키마 활용

폼/테이블 처리          ████████████████░░░░ 80%
└─ React Hook Form + Zod
└─ AG Grid, TanStack Table
```

### 성장 중인 영역

```
성능 최적화             ████████████░░░░░░░░ 60%
└─ Suspense 전파 문제 해결 경험 있음
└─ 더 많은 경험 필요

리팩토링               ████████████░░░░░░░░ 60%
└─ "Order Panel Refactoring" 등 경험
└─ 대규모 리팩토링 경험은 제한적

테스트                 ████████░░░░░░░░░░░░ 40%
└─ 최근 테스터블한 코드 작성 중 (본인 언급)
└─ 아직 충분한 테스트 코드 축적 필요
```

---

## Key Strengths (확인된 강점)

### 1. 프로젝트 초기 설계 능력
**증거:** aif-prix-admin 프로젝트

Prix Admin에서 **프로젝트를 처음부터 직접 설계**했습니다:
- 기술 스택 선택 (React 18, TanStack, Mantine, Biome)
- 개발 환경 구축 (pre-commit, editor config)
- API 구조 설계 (MSW, Axios interceptors)
- 린팅/포매팅 규칙 수립

이건 단순히 "팀 컨벤션을 따랐다"가 아니라 **"컨벤션을 만들었다"**는 증거입니다.

---

### 2. 기술 스택 다양성
**증거:** 프로젝트별 기술 스택

| 프로젝트 | Framework | State | UI |
|----------|-----------|-------|-----|
| Prix Admin | React 18 | TanStack Query | Mantine |
| AIMS 3.0 | React 18 | Zustand + TQ | AG Grid |
| Freight Box | Vue 2 | Pinia | Vuetify |
| Folderpage | Next.js | TanStack Query | - |

React와 Vue 양쪽에서 **실제 프로덕션 경험**이 있으며,
각 프로젝트에 적합한 상태 관리 솔루션을 활용할 수 있습니다.

---

### 3. 성장 속도
**증거:** 2년 6개월 동안의 커밋 히스토리

```
2023.06: "Booking Page UI 구현" (기본 UI)
    ↓
2023.10: "id관리를 위한 store 생성" (상태 설계)
    ↓
2024.07: "feat: init" + 전체 프로젝트 셋업 (아키텍처)
    ↓
2025.06: "suspense 전파 방지" (성능 최적화)
```

**2년 6개월 만에:**
- UI 구현 → 상태 관리 설계 → 프로젝트 아키텍처 → 성능 최적화

일반적인 성장 속도보다 빠른 편입니다.

---

### 4. 물류 도메인 집중 경험
**증거:** 4개 물류 관련 프로젝트

같은 도메인에서 2년 이상 집중적으로 경험을 쌓았습니다:
- 견적 시스템 (여러 번 반복 구현)
- 화물 상세 관리 (FCL, LCL, Air)
- 어드민 대시보드
- 사용자/권한 관리

---

### 5. 독립적 문제 해결
**증거:** sync-notion, 성능 최적화 커밋

```
// sync-notion: 팀 도구를 직접 만들어 기여
"Add GitHub Action workflow for updating Notion PR status"

// AIMS: 성능 문제를 스스로 발견하고 해결
"Grid config의 suspense 전파로 인한 페이지 전체 리렌더링 방지"
```

---

## Revised Level Assessment

### 이전 평가 (너무 보수적)
```
Junior ━━━━━━━━━━ Mid-level ━━━━━━━━━━ Senior
                  ↑
              여기 (초입)
```

### 수정된 평가
```
Junior ━━━━━━━━━━ Mid-level ━━━━━━━━━━ Senior
                       ↑
                   여기 (중반)
```

**근거:**
1. ✅ 프로젝트 초기 설계 경험 (Prix Admin)
2. ✅ 성능 최적화 문제 해결 (Suspense)
3. ✅ 독립적 도구 개발 (sync-notion)
4. ✅ 리팩토링 경험 (Order Panel)
5. ⚠️ 테스트 코드는 아직 성장 중

**결론:** Mid-level 중반, Senior 전 단계

---

## Improvement Areas (여전히 필요한 것)

### 1. 테스트 코드 축적
현재 "테스터블하게 코드 작성 중"이라고 하셨으니,
실제 테스트 코드를 GitHub에 쌓아가는 것이 필요합니다.

### 2. 기술 블로그/문서화
Prix Admin 셋업 경험, Suspense 문제 해결 등을
블로그로 정리하면 강력한 어필 포인트가 됩니다.

### 3. 오픈소스 기여
sync-notion 같은 도구를 public으로 공개하고
다른 팀에서도 쓸 수 있게 하면 좋습니다.

---

## 취업 시 어필 포인트 (수정됨)

### 말할 수 있는 것

```
✓ "프로젝트 초기 설계부터 참여한 경험" (Prix Admin)
✓ "React, Vue 양쪽 프로덕션 경험"
✓ "TanStack 생태계 (Router, Query) 깊이 있는 사용"
✓ "성능 최적화 경험 (Suspense 전파 문제 해결)"
✓ "물류 도메인 2년 이상 집중 경험"
✓ "팀 생산성 도구 직접 개발 (GitHub Action)"
```

### 주의할 표현

```
✗ "시니어" → 아직 아님 (경력상)
✗ "20만 줄 설계" → "20만 줄 프로젝트에 핵심 기여"로 표현
```

---

## Summary

### 한 줄 평가

> **"2.5년차 기준 상위권. 프로젝트 초기 설계 경험과 성능 최적화 능력을 갖춘 Mid-level 개발자"**

### 평가표 (수정됨)

| 항목 | 평가 | 근거 |
|------|------|------|
| 프로젝트 설계 | **양호** | Prix Admin 초기 셋업 |
| 기술 다양성 | **양호** | React + Vue + Next.js |
| 코드 품질 | **양호** | 리팩토링, 최적화 경험 |
| 테스트 | 성장 중 | 본인 언급 (진행 중) |
| 도메인 지식 | **양호** | 물류 2년+ |
| 독립성 | **양호** | sync-notion 개발 |
| **종합 레벨** | **Mid-level 중반** | |

---

*Report Generated: 2025-12-16*
*Based on: Git commit history timeline analysis*
