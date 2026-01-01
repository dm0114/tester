/**
 * @vitest-environment happy-dom
 */

/**
 * Leave Hooks Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '../../__tests__/test-utils'
import { useLeaves, useLeaveBalance } from './leave.hooks'
import { leaveRepository } from './leave.repository'
import { mockData } from '../../__tests__/mock-supabase'

vi.mock('./leave.repository', () => ({
  leaveRepository: {
    findMany: vi.fn(),
    findBalances: vi.fn(),
  },
}))

vi.mock('../../shared/client', () => ({
  getSupabaseClient: vi.fn(() => ({})),
}))

describe('leave.hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useLeaves', () => {
    it('휴가 목록을 조회한다', async () => {
      const mockLeaves = [mockData.leave(), mockData.leave({ id: 'leave-2' })]
      vi.mocked(leaveRepository.findMany).mockResolvedValue(mockLeaves)

      const { result } = renderHook(() => useLeaves())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(2)
    })

    it('필터가 전달된다', async () => {
      vi.mocked(leaveRepository.findMany).mockResolvedValue([])

      const filters = { employee_id: 'emp-1', status: 'PENDING' as const }
      renderHook(() => useLeaves(filters))

      await waitFor(() => {
        expect(leaveRepository.findMany).toHaveBeenCalledWith(
          expect.anything(),
          filters,
        )
      })
    })
  })

  describe('useLeaveBalance', () => {
    it('휴가 잔여를 조회한다', async () => {
      const mockBalances = [mockData.leaveBalance()]
      vi.mocked(leaveRepository.findBalances).mockResolvedValue(mockBalances)

      const { result } = renderHook(() => useLeaveBalance('emp-1', 2024))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(1)
      expect(result.current.data?.[0].remaining_days).toBe(12)
    })

    it('employeeId가 없으면 쿼리가 비활성화된다', () => {
      const { result } = renderHook(() => useLeaveBalance('', 2024))

      expect(result.current.fetchStatus).toBe('idle')
      expect(leaveRepository.findBalances).not.toHaveBeenCalled()
    })

    it('year 파라미터가 전달된다', async () => {
      vi.mocked(leaveRepository.findBalances).mockResolvedValue([])

      renderHook(() => useLeaveBalance('emp-1', 2025))

      await waitFor(() => {
        expect(leaveRepository.findBalances).toHaveBeenCalledWith(
          expect.anything(),
          'emp-1',
          2025,
        )
      })
    })
  })
})
