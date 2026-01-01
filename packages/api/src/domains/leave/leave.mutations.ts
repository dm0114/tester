/**
 * Leave Mutation Hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LeaveInput, LeaveApprovalInput, Leave } from '@portfolio/types'
import { getSupabaseClient } from '../../shared/client'
import { leaveService } from './leave.service'
import { leaveKeys } from './leave.keys'

/**
 * 휴가 신청
 */
export function useCreateLeave() {
  const queryClient = useQueryClient()
  const client = getSupabaseClient()

  return useMutation({
    mutationFn: ({ employeeId, input }: { employeeId: string; input: LeaveInput }): Promise<Leave> =>
      leaveService.createRequest(client, employeeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.all })
    },
  })
}

/**
 * 휴가 승인/반려
 */
export function useProcessLeave() {
  const queryClient = useQueryClient()
  const client = getSupabaseClient()

  return useMutation({
    mutationFn: ({
      leaveId,
      approverId,
      input,
    }: {
      leaveId: string
      approverId: string
      input: LeaveApprovalInput
    }): Promise<Leave> => leaveService.process(client, leaveId, approverId, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() })
      queryClient.invalidateQueries({ queryKey: leaveKeys.balances() })
    },
  })
}

/**
 * 휴가 취소
 */
export function useCancelLeave() {
  const queryClient = useQueryClient()
  const client = getSupabaseClient()

  return useMutation({
    mutationFn: (leaveId: string): Promise<Leave> => leaveService.cancel(client, leaveId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() })
      queryClient.invalidateQueries({ queryKey: leaveKeys.balances() })
    },
  })
}
