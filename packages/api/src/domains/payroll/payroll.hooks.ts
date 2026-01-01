/**
 * Payroll Query Hooks
 *
 * TanStack Query hooks for fetching payroll data.
 * Repository를 호출하여 데이터를 조회합니다.
 */

import { useQuery } from '@tanstack/react-query'
import type { PayrollFilters } from '@portfolio/types'
import { getSupabaseClient } from '../../shared/client'
import { payrollRepository } from './payroll.repository'
import { payrollKeys } from './payroll.keys'

/**
 * 급여 목록 조회
 */
export function usePayrolls(filters: PayrollFilters = {}) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: payrollKeys.list(filters),
    queryFn: () => payrollRepository.findMany(client, filters),
  })
}

/**
 * 급여 단건 조회
 */
export function usePayroll(id: string) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: payrollKeys.detail(id),
    queryFn: () => payrollRepository.findById(client, id),
    enabled: !!id,
  })
}
