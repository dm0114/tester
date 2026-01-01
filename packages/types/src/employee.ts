/**
 * 직원 관련 타입
 */

import type { BaseEntity } from './common'
import type { UserRole } from './auth'

/** 직원 상태 */
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'

/** 부서 */
export interface Department extends BaseEntity {
  name: string
  code: string
  parent_id?: string
}

/** 직책/직급 */
export interface Position extends BaseEntity {
  name: string
  level: number
  base_salary: number
}

/** 직원 */
export interface Employee extends BaseEntity {
  employee_number: string
  user_id: string
  department_id: string
  position_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  hire_date: string
  status: EmployeeStatus
  role: UserRole
  // Relations (optional, populated via join)
  department?: Department
  position?: Position
}

/** 직원 생성/수정 입력 */
export interface EmployeeInput {
  employee_number: string
  department_id: string
  position_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  hire_date: string
  status?: EmployeeStatus
  role?: UserRole
}

/** 직원 필터 */
export interface EmployeeFilters {
  status?: EmployeeStatus
  role?: UserRole
  department_id?: string
  search?: string
  page?: number
  limit?: number
}
