/**
 * Leave Query Hooks
 */

import { useQuery } from '@tanstack/react-query'
import type { LeaveFilters } from '@portfolio/types'
import { getSupabaseClient } from '../../shared/client'
import { leaveRepository } from './leave.repository'
import { leaveKeys } from './leave.keys'

/**
 * 휴가 목록 조회
 */
export function useLeaves(filters: LeaveFilters = {}) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: leaveKeys.list(filters),
    queryFn: () => leaveRepository.findMany(client, filters),
  })
}

/**
 * 휴가 잔여 조회
 */
export function useLeaveBalance(employeeId: string, year: number = new Date().getFullYear()) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: leaveKeys.balance(employeeId, year),
    queryFn: () => leaveRepository.findBalances(client, employeeId, year),
    enabled: !!employeeId,
  })
}
