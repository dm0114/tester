/**
 * Payroll Mutation Hooks
 *
 * TanStack Query mutation hooks for payroll operations.
 * Service를 호출하여 비즈니스 로직을 실행합니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PayrollCalculationInput, Payroll, PayrollStatus } from '@portfolio/types'
import { getSupabaseClient } from '../../shared/client'
import { payrollRepository } from './payroll.repository'
import { payrollService } from './payroll.service'
import { payrollKeys } from './payroll.keys'

/**
 * 급여 생성 (계산 포함)
 */
export function useCreatePayroll() {
  const queryClient = useQueryClient()
  const client = getSupabaseClient()

  return useMutation({
    mutationFn: (input: PayrollCalculationInput): Promise<Payroll> =>
      payrollService.createWithCalculation(client, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.all })
    },
  })
}

/**
 * 급여 상태 업데이트
 */
export function useUpdatePayrollStatus() {
  const queryClient = useQueryClient()
  const client = getSupabaseClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PayrollStatus }): Promise<Payroll> =>
      payrollRepository.updateStatus(client, id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
    },
  })
}

/**
 * 급여 승인
 *
 * 상태 전이 검증이 포함된 안전한 승인 처리
 */
export function useApprovePayroll() {
  const queryClient = useQueryClient()
  const client = getSupabaseClient()

  return useMutation({
    mutationFn: (id: string): Promise<Payroll> => payrollService.approve(client, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
    },
  })
}

/**
 * 급여 지급 완료 처리
 *
 * 상태 전이 검증이 포함된 안전한 지급 완료 처리
 */
export function useMarkPayrollPaid() {
  const queryClient = useQueryClient()
  const client = getSupabaseClient()

  return useMutation({
    mutationFn: (id: string): Promise<Payroll> => payrollService.markPaid(client, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
    },
  })
}
