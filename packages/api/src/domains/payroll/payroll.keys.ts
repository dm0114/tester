/**
 * Payroll Query Keys Factory
 *
 * TanStack Query의 쿼리 키를 일관되게 관리합니다.
 * @see https://tanstack.com/query/latest/docs/framework/react/community/lukemorales-query-key-factory
 */

import type { PayrollFilters } from '@portfolio/types'

export const payrollKeys = {
  all: ['payrolls'] as const,
  lists: () => [...payrollKeys.all, 'list'] as const,
  list: (filters: PayrollFilters) => [...payrollKeys.lists(), filters] as const,
  details: () => [...payrollKeys.all, 'detail'] as const,
  detail: (id: string) => [...payrollKeys.details(), id] as const,
  items: (payrollId: string) => [...payrollKeys.detail(payrollId), 'items'] as const,
}
