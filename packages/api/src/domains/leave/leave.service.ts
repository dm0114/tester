/**
 * Leave Service
 *
 * 휴가 관련 비즈니스 로직을 담당합니다.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Leave, LeaveInput, LeaveApprovalInput, LeaveStatus } from '@portfolio/types'
import { ApiError } from '../../shared/errors'
import { leaveRepository } from './leave.repository'

// ============================================================================
// 유효한 상태 전이
// ============================================================================

const VALID_STATUS_TRANSITIONS: Record<LeaveStatus, LeaveStatus[]> = {
  PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['CANCELLED'],
  REJECTED: [],
  CANCELLED: [],
}

// ============================================================================
// 비즈니스 로직
// ============================================================================

/**
 * 휴가 일수 계산
 */
export function calculateLeaveDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

/**
 * 상태 전이 검증
 */
export function validateLeaveStatusTransition(currentStatus: LeaveStatus, newStatus: LeaveStatus): void {
  const allowedStatuses = VALID_STATUS_TRANSITIONS[currentStatus]

  if (!allowedStatuses.includes(newStatus)) {
    throw new ApiError({
      code: 'VALIDATION_ERROR',
      message: `${currentStatus}에서 ${newStatus}로 변경할 수 없습니다`,
      meta: { currentStatus, newStatus, allowed: allowedStatuses },
    })
  }
}

/**
 * 휴가 신청
 */
export async function createLeaveRequest(
  client: SupabaseClient,
  employeeId: string,
  input: LeaveInput,
): Promise<Leave> {
  const days = calculateLeaveDays(input.start_date, input.end_date)

  return leaveRepository.create(client, {
    employee_id: employeeId,
    leave_type_id: input.leave_type_id,
    start_date: input.start_date,
    end_date: input.end_date,
    days,
    reason: input.reason,
    status: 'PENDING',
  })
}

/**
 * 휴가 승인/반려 처리
 */
export async function processLeave(
  client: SupabaseClient,
  leaveId: string,
  approverId: string,
  input: LeaveApprovalInput,
): Promise<Leave> {
  // 1. 휴가 조회
  const leave = await leaveRepository.findById(client, leaveId)

  // 2. 상태 전이 검증
  validateLeaveStatusTransition(leave.status, input.status)

  // 3. 승인 시 휴가 잔여 차감
  if (input.status === 'APPROVED') {
    const year = new Date(leave.start_date).getFullYear()
    await leaveRepository.deductBalance(
      client,
      leave.employee_id,
      leave.leave_type_id,
      year,
      leave.days,
    )
  }

  // 4. 상태 업데이트
  return leaveRepository.updateStatus(client, leaveId, input.status, approverId)
}

/**
 * 휴가 취소
 */
export async function cancelLeave(
  client: SupabaseClient,
  leaveId: string,
): Promise<Leave> {
  // 1. 휴가 조회
  const leave = await leaveRepository.findById(client, leaveId)

  // 2. 상태 전이 검증
  validateLeaveStatusTransition(leave.status, 'CANCELLED')

  // 3. 이미 승인된 휴가라면 잔여 복구
  if (leave.status === 'APPROVED') {
    const year = new Date(leave.start_date).getFullYear()
    await leaveRepository.restoreBalance(
      client,
      leave.employee_id,
      leave.leave_type_id,
      year,
      leave.days,
    )
  }

  // 4. 상태 업데이트
  return leaveRepository.updateStatus(client, leaveId, 'CANCELLED')
}

/**
 * Service 객체
 */
export const leaveService = {
  calculateDays: calculateLeaveDays,
  validateStatusTransition: validateLeaveStatusTransition,
  createRequest: createLeaveRequest,
  process: processLeave,
  cancel: cancelLeave,
}
