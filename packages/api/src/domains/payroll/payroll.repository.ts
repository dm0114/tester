/**
 * Payroll Repository
 *
 * Supabase 데이터 접근 로직을 캡슐화합니다.
 * 모든 함수는 SupabaseClient를 주입받아 테스트가 용이합니다.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Payroll, PayrollFilters, PayrollStatus } from '@portfolio/types'
import { ApiError } from '../../shared/errors'

/** 급여 목록 select 쿼리 */
const PAYROLL_LIST_SELECT = '*, employee:employees(*, department:departments(*), position:positions(*))'

/** 급여 상세 select 쿼리 (items 포함) */
const PAYROLL_DETAIL_SELECT = `
  *,
  employee:employees(*, department:departments(*), position:positions(*)),
  items:payroll_items(*)
`

/**
 * 급여 목록 조회
 */
export async function findPayrolls(
  client: SupabaseClient,
  filters: PayrollFilters = {},
): Promise<Payroll[]> {
  let query = client
    .from('payrolls')
    .select(PAYROLL_LIST_SELECT)
    .order('created_at', { ascending: false })

  if (filters.employee_id) {
    query = query.eq('employee_id', filters.employee_id)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.period_start) {
    query = query.gte('period_start', filters.period_start)
  }
  if (filters.period_end) {
    query = query.lte('period_end', filters.period_end)
  }

  // Pagination
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error } = await query

  if (error) {
    throw ApiError.fromSupabase('PAYROLL_FETCH_FAILED', error)
  }

  return data as Payroll[]
}

/**
 * 급여 단건 조회
 */
export async function findPayrollById(
  client: SupabaseClient,
  id: string,
): Promise<Payroll> {
  const { data, error } = await client
    .from('payrolls')
    .select(PAYROLL_DETAIL_SELECT)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError({ code: 'PAYROLL_NOT_FOUND', cause: error })
    }
    throw ApiError.fromSupabase('PAYROLL_FETCH_FAILED', error)
  }

  return data as Payroll
}

/** 급여 생성 input */
export interface CreatePayrollInput {
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
  calculated_at: string
}

/**
 * 급여 생성
 */
export async function createPayroll(
  client: SupabaseClient,
  input: CreatePayrollInput,
): Promise<Payroll> {
  const { data, error } = await client
    .from('payrolls')
    .insert(input)
    .select(PAYROLL_LIST_SELECT)
    .single()

  if (error) {
    throw ApiError.fromSupabase('PAYROLL_CREATE_FAILED', error)
  }

  return data as Payroll
}

/** 급여 항목 input */
export interface PayrollItemInput {
  payroll_id: string
  item_type: 'DEDUCTION' | 'ADDITION'
  item_name: string
  amount: number
}

/**
 * 급여 항목 일괄 생성
 */
export async function createPayrollItems(
  client: SupabaseClient,
  items: PayrollItemInput[],
): Promise<void> {
  const { error } = await client.from('payroll_items').insert(items)

  if (error) {
    throw ApiError.fromSupabase('PAYROLL_CREATE_FAILED', error)
  }
}

/**
 * 급여 상태 업데이트
 */
export async function updatePayrollStatus(
  client: SupabaseClient,
  id: string,
  status: PayrollStatus,
): Promise<Payroll> {
  const updates: Record<string, unknown> = { status }

  if (status === 'PAID') {
    updates.paid_at = new Date().toISOString()
  }

  const { data, error } = await client
    .from('payrolls')
    .update(updates)
    .eq('id', id)
    .select(PAYROLL_LIST_SELECT)
    .single()

  if (error) {
    throw ApiError.fromSupabase('PAYROLL_UPDATE_FAILED', error)
  }

  return data as Payroll
}

/**
 * Repository 객체 (선호하는 방식으로 사용 가능)
 */
export const payrollRepository = {
  findMany: findPayrolls,
  findById: findPayrollById,
  create: createPayroll,
  createItems: createPayrollItems,
  updateStatus: updatePayrollStatus,
}
