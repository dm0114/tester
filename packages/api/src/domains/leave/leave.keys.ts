/**
 * Leave Query Keys Factory
 */

import type { LeaveFilters } from '@portfolio/types'

export const leaveKeys = {
  all: ['leaves'] as const,
  lists: () => [...leaveKeys.all, 'list'] as const,
  list: (filters: LeaveFilters) => [...leaveKeys.lists(), filters] as const,
  details: () => [...leaveKeys.all, 'detail'] as const,
  detail: (id: string) => [...leaveKeys.details(), id] as const,
  balances: () => [...leaveKeys.all, 'balance'] as const,
  balance: (employeeId: string, year: number) => [...leaveKeys.balances(), employeeId, year] as const,
}
