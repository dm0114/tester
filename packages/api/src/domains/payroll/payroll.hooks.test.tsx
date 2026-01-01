/**
 * @vitest-environment happy-dom
 */

/**
 * Payroll Hooks Tests
 *
 * Repository를 모킹하여 hooks의 React Query 동작 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '../../__tests__/test-utils'
import { usePayrolls, usePayroll } from './payroll.hooks'
import { payrollRepository } from './payroll.repository'
import { mockData } from '../../__tests__/mock-supabase'

// Repository 모킹
vi.mock('./payroll.repository', () => ({
  payrollRepository: {
    findMany: vi.fn(),
    findById: vi.fn(),
  },
}))

// Supabase 클라이언트 모킹
vi.mock('../../shared/client', () => ({
  getSupabaseClient: vi.fn(() => ({})),
}))

describe('payroll.hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('usePayrolls', () => {
    it('급여 목록을 조회한다', async () => {
      const mockPayrolls = [mockData.payroll(), mockData.payroll({ id: 'pay-2' })]
      vi.mocked(payrollRepository.findMany).mockResolvedValue(mockPayrolls)

      const { result } = renderHook(() => usePayrolls())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(2)
      expect(payrollRepository.findMany).toHaveBeenCalled()
    })

    it('필터가 전달된다', async () => {
      const mockPayrolls = [mockData.payroll()]
      vi.mocked(payrollRepository.findMany).mockResolvedValue(mockPayrolls)

      const filters = { employee_id: 'emp-1', status: 'DRAFT' as const }
      renderHook(() => usePayrolls(filters))

      await waitFor(() => {
        expect(payrollRepository.findMany).toHaveBeenCalledWith(
          expect.anything(),
          filters,
        )
      })
    })

    it('로딩 상태를 관리한다', async () => {
      vi.mocked(payrollRepository.findMany).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
      )

      const { result } = renderHook(() => usePayrolls())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('에러 상태를 관리한다', async () => {
      const error = new Error('Fetch failed')
      vi.mocked(payrollRepository.findMany).mockRejectedValue(error)

      const { result } = renderHook(() => usePayrolls())

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(error)
    })
  })

  describe('usePayroll', () => {
    it('급여를 ID로 조회한다', async () => {
      const mockPayroll = mockData.payroll()
      vi.mocked(payrollRepository.findById).mockResolvedValue(mockPayroll)

      const { result } = renderHook(() => usePayroll('pay-1'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.id).toBe('pay-1')
    })

    it('ID가 없으면 쿼리가 비활성화된다', () => {
      const { result } = renderHook(() => usePayroll(''))

      expect(result.current.fetchStatus).toBe('idle')
      expect(payrollRepository.findById).not.toHaveBeenCalled()
    })
  })
})
