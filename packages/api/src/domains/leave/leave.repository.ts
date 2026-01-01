/**
 * Leave Repository
 *
 * 휴가 데이터 접근 로직을 캡슐화합니다.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Leave, LeaveFilters, LeaveBalance, LeaveStatus } from '@portfolio/types'
import { ApiError } from '../../shared/errors'

/** 휴가 목록 select 쿼리 */
const LEAVE_SELECT = `
  *,
  employee:employees(*, department:departments(*)),
  leave_type:leave_types(*),
  approver:employees!leaves_approved_by_fkey(first_name, last_name)
`

/**
 * 휴가 목록 조회
 */
export async function findLeaves(
  client: SupabaseClient,
  filters: LeaveFilters = {},
): Promise<Leave[]> {
  let query = client
    .from('leaves')
    .select(LEAVE_SELECT)
    .order('created_at', { ascending: false })

  if (filters.employee_id) {
    query = query.eq('employee_id', filters.employee_id)
  }
  if (filters.leave_type_id) {
    query = query.eq('leave_type_id', filters.leave_type_id)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.start_date) {
    query = query.gte('start_date', filters.start_date)
  }
  if (filters.end_date) {
    query = query.lte('end_date', filters.end_date)
  }

  // Pagination
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error } = await query

  if (error) {
    throw ApiError.fromSupabase('LEAVE_FETCH_FAILED', error)
  }

  return data as Leave[]
}

/**
 * 휴가 단건 조회
 */
export async function findLeaveById(
  client: SupabaseClient,
  id: string,
): Promise<Leave> {
  const { data, error } = await client
    .from('leaves')
    .select(LEAVE_SELECT)
    .eq('id', id)
    .single()

  if (error) {
    throw ApiError.fromSupabase('LEAVE_FETCH_FAILED', error)
  }

  return data as Leave
}

/**
 * 휴가 잔여 조회
 */
export async function findLeaveBalances(
  client: SupabaseClient,
  employeeId: string,
  year: number,
): Promise<LeaveBalance[]> {
  const { data, error } = await client
    .from('leave_balances')
    .select('*, leave_type:leave_types(*)')
    .eq('employee_id', employeeId)
    .eq('year', year)

  if (error) {
    throw ApiError.fromSupabase('LEAVE_FETCH_FAILED', error)
  }

  return data as LeaveBalance[]
}

/** 휴가 생성 input */
export interface CreateLeaveInput {
  employee_id: string
  leave_type_id: string
  start_date: string
  end_date: string
  days: number
  reason?: string
  status: LeaveStatus
}

/**
 * 휴가 생성
 */
export async function createLeave(
  client: SupabaseClient,
  input: CreateLeaveInput,
): Promise<Leave> {
  const { data, error } = await client
    .from('leaves')
    .insert(input)
    .select()
    .single()

  if (error) {
    throw ApiError.fromSupabase('LEAVE_CREATE_FAILED', error)
  }

  return data as Leave
}

/**
 * 휴가 상태 업데이트
 */
export async function updateLeaveStatus(
  client: SupabaseClient,
  id: string,
  status: LeaveStatus,
  approverId?: string,
): Promise<Leave> {
  const updates: Record<string, unknown> = { status }

  if (approverId) {
    updates.approved_by = approverId
    updates.approved_at = new Date().toISOString()
  }

  const { data, error } = await client
    .from('leaves')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw ApiError.fromSupabase('LEAVE_CREATE_FAILED', error)
  }

  return data as Leave
}

/**
 * 휴가 잔여 차감 (RPC)
 */
export async function deductLeaveBalance(
  client: SupabaseClient,
  employeeId: string,
  leaveTypeId: string,
  year: number,
  days: number,
): Promise<void> {
  const { error } = await client.rpc('deduct_leave_balance', {
    p_employee_id: employeeId,
    p_leave_type_id: leaveTypeId,
    p_year: year,
    p_days: days,
  })

  if (error) {
    throw new ApiError({
      code: 'LEAVE_INSUFFICIENT_BALANCE',
      message: '휴가 잔여일수가 부족합니다',
      cause: error,
    })
  }
}

/**
 * 휴가 잔여 복구 (RPC)
 */
export async function restoreLeaveBalance(
  client: SupabaseClient,
  employeeId: string,
  leaveTypeId: string,
  year: number,
  days: number,
): Promise<void> {
  const { error } = await client.rpc('restore_leave_balance', {
    p_employee_id: employeeId,
    p_leave_type_id: leaveTypeId,
    p_year: year,
    p_days: days,
  })

  if (error) {
    throw ApiError.fromSupabase('LEAVE_CREATE_FAILED', error)
  }
}

/**
 * Repository 객체
 */
export const leaveRepository = {
  findMany: findLeaves,
  findById: findLeaveById,
  findBalances: findLeaveBalances,
  create: createLeave,
  updateStatus: updateLeaveStatus,
  deductBalance: deductLeaveBalance,
  restoreBalance: restoreLeaveBalance,
}
