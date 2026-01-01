/**
 * 출퇴근 관련 타입
 */

import type { BaseEntity } from './common'
import type { Employee } from './employee'

/** 출퇴근 기록 */
export interface Attendance extends BaseEntity {
  employee_id: string
  date: string
  clock_in?: string
  clock_out?: string
  work_hours?: number
  overtime_hours?: number
  notes?: string
  // Relations
  employee?: Employee
}

/** 출퇴근 입력 */
export interface AttendanceInput {
  date: string
  clock_in?: string
  clock_out?: string
  notes?: string
}

/** 출근 체크 입력 */
export interface ClockInInput {
  notes?: string
}

/** 퇴근 체크 입력 */
export interface ClockOutInput {
  notes?: string
}

/** 출퇴근 필터 */
export interface AttendanceFilters {
  employee_id?: string
  date?: string
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

/** 출퇴근 통계 */
export interface AttendanceStats {
  total_work_days: number
  total_work_hours: number
  total_overtime_hours: number
  average_work_hours: number
}
