/**
 * 급여 관련 타입
 */

import type { BaseEntity } from './common'
import type { Employee } from './employee'

/** 급여 상태 */
export type PayrollStatus = 'DRAFT' | 'CALCULATED' | 'APPROVED' | 'PAID'

/** 급여 항목 유형 */
export type PayrollItemType = 'EARNING' | 'DEDUCTION'

/** 급여 */
export interface Payroll extends BaseEntity {
  employee_id: string
  period_start: string
  period_end: string
  base_salary: number
  overtime_pay: number
  bonus: number
  deductions: number
  tax: number
  net_salary: number
  status: PayrollStatus
  calculated_at?: string
  paid_at?: string
  // Relations
  employee?: Employee
  items?: PayrollItem[]
}

/** 급여 항목 */
export interface PayrollItem {
  id: string
  payroll_id: string
  item_type: PayrollItemType
  item_name: string
  amount: number
  created_at: string
}

/** 급여 계산 입력 */
export interface PayrollCalculationInput {
  employee_id: string
  period_start: string
  period_end: string
  base_salary: number
  overtime_hours?: number
  bonus?: number
  additional_deductions?: number
}

/** 급여 계산 결과 */
export interface PayrollCalculationResult {
  gross_salary: number
  tax: number
  insurance: {
    national_pension: number
    health_insurance: number
    employment_insurance: number
    long_term_care: number
  }
  total_deductions: number
  net_salary: number
}

/** 급여 필터 */
export interface PayrollFilters {
  employee_id?: string
  status?: PayrollStatus
  period_start?: string
  period_end?: string
  page?: number
  limit?: number
}
