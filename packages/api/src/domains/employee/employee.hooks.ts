/**
 * Employee Query Hooks
 */

import { useQuery } from '@tanstack/react-query'
import type { EmployeeFilters } from '@portfolio/types'
import { getSupabaseClient } from '../../shared/client'
import { employeeRepository } from './employee.repository'
import { employeeKeys } from './employee.keys'

/**
 * 직원 목록 조회
 */
export function useEmployees(filters: EmployeeFilters = {}) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => employeeRepository.findMany(client, filters),
  })
}

/**
 * 직원 단건 조회
 */
export function useEmployee(id: string) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeRepository.findById(client, id),
    enabled: !!id,
  })
}
