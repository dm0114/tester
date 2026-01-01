/**
 * 휴가 관련 타입
 */

import type { BaseEntity } from './common'
import type { Employee } from './employee'

/** 휴가 유형 코드 */
export type LeaveTypeCode = 'ANNUAL' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'UNPAID'

/** 휴가 상태 */
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

/** 휴가 유형 */
export interface LeaveType extends BaseEntity {
  name: string
  code: LeaveTypeCode
  default_days: number
  is_paid: boolean
}

/** 휴가 잔여 */
export interface LeaveBalance {
  id: string
  employee_id: string
  leave_type_id: string
  year: number
  total_days: number
  used_days: number
  remaining_days: number
  created_at: string
  updated_at: string
  // Relations
  leave_type?: LeaveType
}

/** 휴가 신청 */
export interface Leave extends BaseEntity {
  employee_id: string
  leave_type_id: string
  start_date: string
  end_date: string
  days: number
  reason?: string
  status: LeaveStatus
  approved_by?: string
  approved_at?: string
  // Relations
  employee?: Employee
  leave_type?: LeaveType
  approver?: Employee
}

/** 휴가 신청 입력 */
export interface LeaveInput {
  leave_type_id: string
  start_date: string
  end_date: string
  reason?: string
}

/** 휴가 승인/반려 입력 */
export interface LeaveApprovalInput {
  status: 'APPROVED' | 'REJECTED'
  comment?: string
}

/** 휴가 필터 */
export interface LeaveFilters {
  employee_id?: string
  leave_type_id?: string
  status?: LeaveStatus
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}
