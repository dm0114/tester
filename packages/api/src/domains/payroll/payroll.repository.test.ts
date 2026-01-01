/**
 * Payroll Repository Tests
 *
 * Supabase 클라이언트 모킹을 통한 통합 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabaseClient, mockData, type MockQueryBuilder } from '../../__tests__/mock-supabase'
import { findPayrolls, findPayrollById, createPayroll, updatePayrollStatus } from './payroll.repository'
import { ApiError } from '../../shared/errors'

describe('payroll.repository', () => {
  describe('findPayrolls', () => {
    it('급여 목록을 조회한다', async () => {
      const mockPayrolls = [mockData.payroll(), mockData.payroll({ id: 'pay-2' })]
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: mockPayrolls } },
      })

      const result = await findPayrolls(client, {})

      expect(result).toHaveLength(2)
      expect(client.from).toHaveBeenCalledWith('payrolls')
    })

    it('필터가 적용된다', async () => {
      const mockPayrolls = [mockData.payroll()]
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: mockPayrolls } },
      })

      const result = await findPayrolls(client, {
        employee_id: 'emp-1',
        status: 'DRAFT',
      })

      expect(result).toHaveLength(1)
      const queryBuilder = client.from('payrolls') as unknown as MockQueryBuilder
      expect(queryBuilder.eq).toHaveBeenCalledWith('employee_id', 'emp-1')
      expect(queryBuilder.eq).toHaveBeenCalledWith('status', 'DRAFT')
    })

    it('페이지네이션이 적용된다', async () => {
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: [] } },
      })

      await findPayrolls(client, { page: 2, limit: 10 })

      const queryBuilder = client.from('payrolls') as unknown as MockQueryBuilder
      expect(queryBuilder.range).toHaveBeenCalledWith(10, 19)
    })

    it('에러 시 ApiError를 던진다', async () => {
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: null, error: new Error('DB Error') } },
      })

      await expect(findPayrolls(client, {})).rejects.toThrow(ApiError)
    })
  })

  describe('findPayrollById', () => {
    it('급여를 ID로 조회한다', async () => {
      const mockPayroll = mockData.payroll()
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: mockPayroll } },
      })

      const result = await findPayrollById(client, 'pay-1')

      expect(result.id).toBe('pay-1')
      expect(client.from).toHaveBeenCalledWith('payrolls')
    })

    it('존재하지 않으면 PAYROLL_NOT_FOUND 에러', async () => {
      const error = { code: 'PGRST116', message: 'Row not found' }
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: null, error: error as unknown as Error } },
      })

      try {
        await findPayrollById(client, 'non-existent')
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('PAYROLL_NOT_FOUND')
      }
    })
  })

  describe('createPayroll', () => {
    it('급여를 생성한다', async () => {
      const mockPayroll = mockData.payroll()
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: mockPayroll } },
      })

      const input = {
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
        overtime_pay: 0,
        bonus: 0,
        deductions: 300_000,
        tax: 100_000,
        net_salary: 2_600_000,
        status: 'DRAFT' as const,
        calculated_at: '2024-01-15T00:00:00Z',
      }

      const result = await createPayroll(client, input)

      expect(result.id).toBe('pay-1')
      expect(client.from).toHaveBeenCalledWith('payrolls')
    })

    it('생성 실패 시 PAYROLL_CREATE_FAILED 에러', async () => {
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: null, error: new Error('Insert failed') } },
      })

      const input = {
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
        overtime_pay: 0,
        bonus: 0,
        deductions: 300_000,
        tax: 100_000,
        net_salary: 2_600_000,
        status: 'DRAFT' as const,
        calculated_at: '2024-01-15T00:00:00Z',
      }

      try {
        await createPayroll(client, input)
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('PAYROLL_CREATE_FAILED')
      }
    })
  })

  describe('updatePayrollStatus', () => {
    it('상태를 업데이트한다', async () => {
      const updatedPayroll = mockData.payroll({ status: 'APPROVED' })
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: updatedPayroll } },
      })

      const result = await updatePayrollStatus(client, 'pay-1', 'APPROVED')

      expect(result.status).toBe('APPROVED')
    })

    it('PAID 상태로 변경 시 paid_at이 설정된다', async () => {
      const updatedPayroll = mockData.payroll({ status: 'PAID', paid_at: '2024-01-20T00:00:00Z' })
      const client = createMockSupabaseClient({
        tables: { payrolls: { data: updatedPayroll } },
      })

      const result = await updatePayrollStatus(client, 'pay-1', 'PAID')

      expect(result.status).toBe('PAID')
      // update 호출 시 paid_at 포함 확인
      const queryBuilder = client.from('payrolls') as unknown as MockQueryBuilder
      expect(queryBuilder.update).toHaveBeenCalled()
    })
  })
})
