/**
 * Payroll Service
 *
 * 급여 관련 비즈니스 로직을 담당합니다.
 * - 급여 계산 (4대보험, 소득세)
 * - 급여 생성 프로세스 (계산 + 저장)
 * - 상태 전이 검증
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Payroll, PayrollCalculationInput, PayrollCalculationResult, PayrollStatus } from '@portfolio/types'
import { ApiError } from '../../shared/errors'
import { payrollRepository, type PayrollItemInput } from './payroll.repository'

// ============================================================================
// 상수
// ============================================================================

/** 보험료율 상수 (2024년 기준) */
const INSURANCE_RATES = {
  /** 국민연금: 4.5% (사업주 4.5%, 근로자 4.5% = 총 9%) */
  NATIONAL_PENSION: 0.045,
  /** 건강보험: 3.545% (2024년 기준) */
  HEALTH_INSURANCE: 0.03545,
  /** 장기요양보험: 건강보험료의 12.81% */
  LONG_TERM_CARE_RATE: 0.1281,
  /** 고용보험: 0.9% */
  EMPLOYMENT_INSURANCE: 0.009,
} as const

/** 연장근무 배율 */
const OVERTIME_MULTIPLIER = 1.5

/** 월 근무시간 (209시간 기준) */
const MONTHLY_WORK_HOURS = 209

/** 유효한 상태 전이 맵 */
const VALID_STATUS_TRANSITIONS: Record<PayrollStatus, PayrollStatus[]> = {
  DRAFT: ['CALCULATED', 'DRAFT'],
  CALCULATED: ['APPROVED', 'DRAFT'],
  APPROVED: ['PAID', 'DRAFT'],
  PAID: [],
}

// ============================================================================
// 급여 계산 (순수 함수)
// ============================================================================

/**
 * 시급 계산
 */
export function getHourlyRate(baseSalary: number): number {
  return baseSalary / MONTHLY_WORK_HOURS
}

/**
 * 연장근무 시급
 */
export function getOvertimeRate(baseSalary: number): number {
  return getHourlyRate(baseSalary) * OVERTIME_MULTIPLIER
}

/**
 * 연장근무수당 계산
 */
function calculateOvertimePay(baseSalary: number, hours: number): number {
  return getHourlyRate(baseSalary) * OVERTIME_MULTIPLIER * hours
}

/**
 * 4대보험 계산
 */
function calculateInsurance(grossSalary: number) {
  const nationalPension = grossSalary * INSURANCE_RATES.NATIONAL_PENSION
  const healthInsurance = grossSalary * INSURANCE_RATES.HEALTH_INSURANCE
  const longTermCare = healthInsurance * INSURANCE_RATES.LONG_TERM_CARE_RATE
  const employmentInsurance = grossSalary * INSURANCE_RATES.EMPLOYMENT_INSURANCE

  return {
    national_pension: nationalPension,
    health_insurance: healthInsurance,
    long_term_care: longTermCare,
    employment_insurance: employmentInsurance,
  }
}

/**
 * 소득세 계산 (간이세액표 기반 단순화)
 */
function calculateIncomeTax(grossSalary: number): number {
  const annualSalary = grossSalary * 12
  let tax = 0

  if (annualSalary <= 14_000_000) {
    tax = annualSalary * 0.06
  } else if (annualSalary <= 50_000_000) {
    tax = 840_000 + (annualSalary - 14_000_000) * 0.15
  } else if (annualSalary <= 88_000_000) {
    tax = 6_240_000 + (annualSalary - 50_000_000) * 0.24
  } else if (annualSalary <= 150_000_000) {
    tax = 15_360_000 + (annualSalary - 88_000_000) * 0.35
  } else if (annualSalary <= 300_000_000) {
    tax = 37_060_000 + (annualSalary - 150_000_000) * 0.38
  } else if (annualSalary <= 500_000_000) {
    tax = 94_060_000 + (annualSalary - 300_000_000) * 0.4
  } else if (annualSalary <= 1_000_000_000) {
    tax = 174_060_000 + (annualSalary - 500_000_000) * 0.42
  } else {
    tax = 384_060_000 + (annualSalary - 1_000_000_000) * 0.45
  }

  return tax / 12
}

/**
 * 원 단위 반올림 (10원 단위)
 */
function round(amount: number): number {
  return Math.round(amount / 10) * 10
}

/**
 * 급여 계산 메인 함수
 */
export function calculatePayroll(input: PayrollCalculationInput): PayrollCalculationResult {
  const { base_salary, overtime_hours = 0, bonus = 0, additional_deductions = 0 } = input

  // 1. 연장근무수당
  const overtimePay = calculateOvertimePay(base_salary, overtime_hours)

  // 2. 총 급여 (세전)
  const grossSalary = base_salary + overtimePay + bonus

  // 3. 4대보험
  const insurance = calculateInsurance(grossSalary)

  // 4. 소득세
  const tax = calculateIncomeTax(grossSalary)

  // 5. 총 공제액
  const totalDeductions =
    insurance.national_pension +
    insurance.health_insurance +
    insurance.long_term_care +
    insurance.employment_insurance +
    tax +
    tax * 0.1 + // 지방소득세
    additional_deductions

  // 6. 실수령액
  const netSalary = grossSalary - totalDeductions

  return {
    gross_salary: round(grossSalary),
    tax: round(tax),
    insurance: {
      national_pension: round(insurance.national_pension),
      health_insurance: round(insurance.health_insurance),
      long_term_care: round(insurance.long_term_care),
      employment_insurance: round(insurance.employment_insurance),
    },
    total_deductions: round(totalDeductions),
    net_salary: round(netSalary),
  }
}

// ============================================================================
// 비즈니스 프로세스
// ============================================================================

/**
 * 급여 생성 (계산 + 저장 + 항목 저장)
 *
 * 트랜잭션으로 처리되어야 하지만 Supabase는 클라이언트 트랜잭션 미지원
 * RPC나 Edge Function으로 처리하는 것을 권장
 */
export async function createPayrollWithCalculation(
  client: SupabaseClient,
  input: PayrollCalculationInput,
): Promise<Payroll> {
  // 1. 급여 계산
  const result = calculatePayroll(input)

  // 2. DB에 저장
  const payroll = await payrollRepository.create(client, {
    employee_id: input.employee_id,
    period_start: input.period_start,
    period_end: input.period_end,
    base_salary: input.base_salary,
    overtime_pay: (input.overtime_hours ?? 0) * getOvertimeRate(input.base_salary),
    bonus: input.bonus ?? 0,
    deductions: result.total_deductions,
    tax: result.tax,
    net_salary: result.net_salary,
    status: 'DRAFT',
    calculated_at: new Date().toISOString(),
  })

  // 3. 급여 항목 저장 (공제 내역)
  const items: PayrollItemInput[] = [
    { payroll_id: payroll.id, item_type: 'DEDUCTION', item_name: '국민연금', amount: result.insurance.national_pension },
    { payroll_id: payroll.id, item_type: 'DEDUCTION', item_name: '건강보험', amount: result.insurance.health_insurance },
    { payroll_id: payroll.id, item_type: 'DEDUCTION', item_name: '장기요양보험', amount: result.insurance.long_term_care },
    { payroll_id: payroll.id, item_type: 'DEDUCTION', item_name: '고용보험', amount: result.insurance.employment_insurance },
    { payroll_id: payroll.id, item_type: 'DEDUCTION', item_name: '소득세', amount: result.tax },
    { payroll_id: payroll.id, item_type: 'DEDUCTION', item_name: '지방소득세', amount: Math.round(result.tax * 0.1) },
  ]

  await payrollRepository.createItems(client, items)

  return payroll
}

/**
 * 상태 전이 검증
 */
export function validateStatusTransition(currentStatus: PayrollStatus, newStatus: PayrollStatus): void {
  const allowedStatuses = VALID_STATUS_TRANSITIONS[currentStatus]

  if (!allowedStatuses.includes(newStatus)) {
    throw new ApiError({
      code: 'PAYROLL_INVALID_STATUS',
      message: `${currentStatus}에서 ${newStatus}로 변경할 수 없습니다`,
      meta: { currentStatus, newStatus, allowed: allowedStatuses },
    })
  }
}

/**
 * 급여 승인
 */
export async function approvePayroll(client: SupabaseClient, id: string): Promise<Payroll> {
  const payroll = await payrollRepository.findById(client, id)
  validateStatusTransition(payroll.status, 'APPROVED')
  return payrollRepository.updateStatus(client, id, 'APPROVED')
}

/**
 * 급여 지급 완료
 */
export async function markPayrollPaid(client: SupabaseClient, id: string): Promise<Payroll> {
  const payroll = await payrollRepository.findById(client, id)
  validateStatusTransition(payroll.status, 'PAID')
  return payrollRepository.updateStatus(client, id, 'PAID')
}

// ============================================================================
// Service 객체 export (선호 방식으로 사용)
// ============================================================================

export const payrollService = {
  calculate: calculatePayroll,
  getHourlyRate,
  getOvertimeRate,
  createWithCalculation: createPayrollWithCalculation,
  approve: approvePayroll,
  markPaid: markPayrollPaid,
  validateStatusTransition,
}
