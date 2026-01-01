# Frontend Developer Portfolio
## 물류 Tech 기업 지원용

---

## dm0114 | 프론트엔드 개발자
**경력:** 2년 6개월 | **물류 도메인:** 2년+ 집중 경험

> **"물류 시스템 개발 경험 2년+. 도메인 학습 없이 즉시 기여 가능합니다."**

---

## 1. 물류 도메인 경험 Summary

### 구현 경험 있는 물류 기능

| 기능 | 프로젝트 | 설명 |
|------|----------|------|
| **견적 시스템** | Prix Admin, AIMS | FCL/LCL/Air 운임 견적 |
| **수출신고서** | AIMS 3.0 | 12개 섹션 폼, Ran/Commodity 테이블 |
| **화물 상세 관리** | Prix Admin | CBM/V'WT/C'WT 계산, Unit 변환 |
| **예약 관리** | Freight Box | Booking 워크플로우 |
| **통관 워크플로우** | AIMS 3.0 | 상태 관리, Planning Tab |
| **어드민 대시보드** | 전 프로젝트 | 데이터 테이블, 필터, 검색 |

### 물류 도메인 계산 로직 구현 경험

```typescript
// 직접 구현한 물류 계산 로직 예시

class CargoDetailCalculator {
  // CBM (Cubic Meter) 계산
  // - 항공: 소수점 6자리
  // - 해상: 소수점 3자리
  static getCbm(l, w, h, pkgs, modeOfTransport) {
    const result = l * w * h * pkgs * (0.01 ** 3);
    return modeOfTransport === 'LCL'
      ? Number(result.toFixed(3))
      : Number(result.toFixed(6));
  }

  // V'WT (Volume Weight) 계산 - 항공만
  static getVwt(l, w, h, pkgs) {
    return Number(((l * w * h * pkgs) / 6000).toFixed(1));
  }

  // C'WT (Chargeable Weight) - 0.5 단위 반올림
  static getCWT(gwt, vwt) {
    const cwt = Math.max(gwt, vwt);
    const decimal = cwt - Math.floor(cwt);

    if (decimal === 0) return cwt;
    if (decimal <= 0.5) return Math.floor(cwt) + 0.5;
    return Math.floor(cwt) + 1;
  }
}
```

**구현한 물류 용어/기능:**
- FCL (Full Container Load) / LCL (Less Container Load)
- POL (Port of Loading) / POD (Port of Discharge)
- HAWB / MAWB (항공화물운송장)
- Incoterms (무역조건)
- 컨테이너 타입 (DRY, REEFER, OPEN_TOP, FLAT_RACK)
- HS Code (관세 코드)
- Triangle Shipment (삼각 무역)

---

## 2. 핵심 물류 프로젝트

### 2.1 AIMS 3.0 - 통관 관리 시스템 ★

**기간:** 2024.11 ~ 현재 (13개월)
**역할:** 핵심 개발자 (239 커밋, 95%+ 기여)
**규모:** 77,500+ 라인

**구현 기능:**

#### 1) Export Declaration (수출신고서) - 현재 개발 중
```
12개 섹션 복잡한 폼:
├─ ExporterInfoSection (수출자 정보)
├─ BuyerInfoSection (구매자 정보)
├─ ManufacturerInfoSection (제조자 정보)
├─ CustomsOfficeInfoSection (세관 정보)
├─ DeclarationDetailInfoSection (신고 상세)
├─ ContainerInfoSection (컨테이너 정보)
├─ PortOfLoadingInfoSection (선적항 정보)
├─ StorageLocationInfoSection (보관장소)
├─ EscInfoSection (ESC 정보)
├─ RefundApplicantInfoSection (환급신청인)
├─ TotalWeightPackageInfoSection (총중량/포장)
└─ RanTab / CommodityTab (품목 테이블)
```

#### 2) Planning Tab - Drag & Drop
```
├─ 3분할 패널 간 화물 이동
├─ 실시간 집계 (패널별 카운트)
├─ Optimistic Update
└─ 상태 변경 자동 반영
```

#### 3) Instruction Tab - 편집 가능 테이블
```
├─ Editable Grid (인라인 편집)
├─ 복잡한 필터링
├─ Blocker 패턴 (변경 시 이탈 방지)
└─ 자동 저장
```

#### 4) HAWB/MAWB 시스템
```
├─ 9개 섹션 Document 관리
├─ 복잡한 상태 관리
└─ 파일 첨부/미리보기
```

#### 5) Triangle Shipment (삼각무역)
```
├─ Cargo 병합 로직
├─ Warehouse 관리
├─ MRN 처리
└─ 캐시 무효화 전략
```

**기술 스택:**
```
React 18, TypeScript (Strict)
TanStack Router/Query, Zustand
Mantine, AG-Grid Enterprise
React Hook Form + Zod
```

---

### 2.2 Prix Admin - 견적 관리 시스템

**기간:** 2024.07 ~ 2024.12
**역할:** 프로젝트 설계 및 메인 개발 (88.3% 기여)

**구현 기능:**

#### 1) 화물 상세 테이블 (Cargo Detail)
```typescript
// TanStack Table + React Hook Form 통합
// 각 셀이 편집 가능한 폼 필드

const columns = [
  {
    header: "CNTR TYPE",
    cell: ({ row }) => (
      <Controller
        control={control}
        name={`fclCargoDetails.${row.index}.cntrType`}
        render={({ field }) => (
          <Select
            {...field}
            // 타입 변경 시 Size 옵션 동적 변경
            data={getContainerTypes(typeOfCargo)}
          />
        )}
      />
    )
  },
  // CBM, V'WT, C'WT 실시간 계산 컬럼
  {
    header: "CBM",
    cell: ({ row }) => calculateCBM(row.original)
  }
];
```

#### 2) 운송 모드별 폼 분기
```
수출/수입 (Bound) 선택
  ↓
운송 모드 선택
  ├─ FCL: Container 테이블 (동적 행)
  ├─ LCL: 화물 명세 테이블
  └─ AIR: 항공 화물 테이블 (V'WT 계산)
```

#### 3) AI 견적 분석 연동
```
├─ 고객 요청 텍스트 AI 분석
├─ 분석 결과로 폼 자동 채우기
├─ POL/POD 자동 추천
└─ 수출입 타입 판단
```

---

### 2.3 Freight Box - 화물 예약 시스템

**기간:** 2023.06 ~ 2024.06
**역할:** 협업 개발자 (11명 중 2위 기여도)

**구현 기능:**
- Booking Page UI 및 API 연동
- 예약 상태 관리 워크플로우
- 회원 가입 승인 시스템 (RBAC)
- 권한 기반 UI 분기

**기술 스택:** Vue 2.7, Pinia, Vuetify

---

## 3. 물류 도메인 어필 포인트

### 1) 도메인 학습 불필요
```
✅ FCL/LCL/Air 운임 계산 이해
✅ 통관 워크플로우 이해
✅ 화물 상세 계산 (CBM, V'WT, C'WT) 구현 경험
✅ 수출신고서 양식 및 필드 이해
✅ 컨테이너 타입별 로직 이해
```

### 2) 복잡한 물류 UI 구현 능력
```
✅ 다단계 견적 폼 (수출/수입, 운송모드별)
✅ 편집 가능한 화물 테이블 (인라인 편집)
✅ Drag & Drop 화물 배정
✅ 복잡한 필터/검색 시스템
✅ 대용량 데이터 테이블 (AG-Grid)
```

### 3) 예상 온보딩 기간
```
도메인 학습: 불필요 (2년+ 경험)
코드베이스 파악: 1-2주
독립적 기능 개발: 2주 이내
```

---

## 4. 기술 스택

### Frontend
```
React 18         ████████████████████ 90%
Vue 2.7          ████████████████░░░░ 75%
TypeScript       ████████████████████ 85%
```

### 상태 관리 & 데이터
```
TanStack Query   ████████████████████ 90%
Zustand          ████████████████████ 85%
Pinia            ████████████████░░░░ 75%
```

### UI & 테이블
```
AG-Grid          ████████████████████ 85%
TanStack Table   ████████████████████ 85%
Mantine          ████████████████████ 90%
Vuetify          ████████████████░░░░ 75%
```

### 폼 처리
```
React Hook Form  ████████████████████ 90%
Zod Validation   ████████████████████ 85%
useFieldArray    ████████████████████ 85%
```

---

## 5. 협업 경험

### 물류 프로젝트 협업
```
├─ 백엔드: OpenAPI 스펙 기반 협업
├─ 디자인: Figma 기반, 구현하며 개선 제안
├─ PM: Jira 티켓 연동, 일정 관리
└─ 팀: 코드 리뷰, 기술 공유
```

### 커밋 컨벤션
```
[AIMS3-1506] quotation 수입 - 독일 - FCL - Exhibition cargo detail
[PRIX-1521] Admin 유저 이메일 필드 추가
feat: declaration filter, preview 점검
fix: 란, 규격 테이블 오류 수정
```

---

## 6. 적합한 포지션

```
✓ 물류/포워딩 Tech 기업 프론트엔드 개발자
✓ 통관 시스템 개발
✓ 화물 관리 시스템 개발
✓ 물류 SaaS 제품 개발
```

---

## 7. 연락처

- **GitHub:** github.com/dm0114
- **Email:** [이메일 주소]

---

*물류 도메인 2년+ 경험. 즉시 기여 가능합니다.*
