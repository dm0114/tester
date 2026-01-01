/**
 * Employee Repository
 *
 * 직원 데이터 접근 로직을 캡슐화합니다.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Employee, EmployeeFilters } from '@portfolio/types'
import { ApiError } from '../../shared/errors'

/** 직원 목록 select 쿼리 */
const EMPLOYEE_SELECT = '*, department:departments(*), position:positions(*)'

/**
 * 직원 목록 조회
 */
export async function findEmployees(
  client: SupabaseClient,
  filters: EmployeeFilters = {},
): Promise<Employee[]> {
  let query = client.from('employees').select(EMPLOYEE_SELECT)

  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.role) {
    query = query.eq('role', filters.role)
  }
  if (filters.department_id) {
    query = query.eq('department_id', filters.department_id)
  }
  if (filters.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
    )
  }

  // Pagination
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error } = await query

  if (error) {
    throw ApiError.fromSupabase('EMPLOYEE_FETCH_FAILED', error)
  }

  return data as Employee[]
}

/**
 * 직원 단건 조회
 */
export async function findEmployeeById(
  client: SupabaseClient,
  id: string,
): Promise<Employee> {
  const { data, error } = await client
    .from('employees')
    .select(EMPLOYEE_SELECT)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError({ code: 'EMPLOYEE_NOT_FOUND', cause: error })
    }
    throw ApiError.fromSupabase('EMPLOYEE_FETCH_FAILED', error)
  }

  return data as Employee
}

/**
 * Repository 객체
 */
export const employeeRepository = {
  findMany: findEmployees,
  findById: findEmployeeById,
}
