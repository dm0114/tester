/**
 * @vitest-environment happy-dom
 */

/**
 * Employee Hooks Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '../../__tests__/test-utils'
import { useEmployees, useEmployee } from './employee.hooks'
import { employeeRepository } from './employee.repository'
import { mockData } from '../../__tests__/mock-supabase'

vi.mock('./employee.repository', () => ({
  employeeRepository: {
    findMany: vi.fn(),
    findById: vi.fn(),
  },
}))

vi.mock('../../shared/client', () => ({
  getSupabaseClient: vi.fn(() => ({})),
}))

describe('employee.hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useEmployees', () => {
    it('직원 목록을 조회한다', async () => {
      const mockEmployees = [mockData.employee(), mockData.employee({ id: 'emp-2' })]
      vi.mocked(employeeRepository.findMany).mockResolvedValue(mockEmployees)

      const { result } = renderHook(() => useEmployees())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(2)
    })

    it('필터가 전달된다', async () => {
      vi.mocked(employeeRepository.findMany).mockResolvedValue([])

      const filters = { status: 'ACTIVE' as const, role: 'MANAGER' as const }
      renderHook(() => useEmployees(filters))

      await waitFor(() => {
        expect(employeeRepository.findMany).toHaveBeenCalledWith(
          expect.anything(),
          filters,
        )
      })
    })
  })

  describe('useEmployee', () => {
    it('직원을 ID로 조회한다', async () => {
      const mockEmployee = mockData.employee()
      vi.mocked(employeeRepository.findById).mockResolvedValue(mockEmployee)

      const { result } = renderHook(() => useEmployee('emp-1'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.id).toBe('emp-1')
    })

    it('ID가 없으면 쿼리가 비활성화된다', () => {
      const { result } = renderHook(() => useEmployee(''))

      expect(result.current.fetchStatus).toBe('idle')
      expect(employeeRepository.findById).not.toHaveBeenCalled()
    })
  })
})
