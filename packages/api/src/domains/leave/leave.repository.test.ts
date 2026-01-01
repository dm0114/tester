/**
 * Leave Repository Tests
 */

import { describe, it, expect } from 'vitest'
import { createMockSupabaseClient, mockData, type MockQueryBuilder } from '../../__tests__/mock-supabase'
import {
  findLeaves,
  findLeaveById,
  findLeaveBalances,
  createLeave,
  updateLeaveStatus,
} from './leave.repository'
import { ApiError } from '../../shared/errors'

describe('leave.repository', () => {
  describe('findLeaves', () => {
    it('휴가 목록을 조회한다', async () => {
      const mockLeaves = [mockData.leave(), mockData.leave({ id: 'leave-2' })]
      const client = createMockSupabaseClient({
        tables: { leaves: { data: mockLeaves } },
      })

      const result = await findLeaves(client, {})

      expect(result).toHaveLength(2)
      expect(client.from).toHaveBeenCalledWith('leaves')
    })

    it('직원 필터가 적용된다', async () => {
      const mockLeaves = [mockData.leave()]
      const client = createMockSupabaseClient({
        tables: { leaves: { data: mockLeaves } },
      })

      await findLeaves(client, { employee_id: 'emp-1' })

      const queryBuilder = client.from('leaves') as unknown as MockQueryBuilder
      expect(queryBuilder.eq).toHaveBeenCalledWith('employee_id', 'emp-1')
    })

    it('휴가 유형 필터가 적용된다', async () => {
      const mockLeaves = [mockData.leave()]
      const client = createMockSupabaseClient({
        tables: { leaves: { data: mockLeaves } },
      })

      await findLeaves(client, { leave_type_id: 'lt-1' })

      const queryBuilder = client.from('leaves') as unknown as MockQueryBuilder
      expect(queryBuilder.eq).toHaveBeenCalledWith('leave_type_id', 'lt-1')
    })

    it('상태 필터가 적용된다', async () => {
      const mockLeaves = [mockData.leave({ status: 'APPROVED' })]
      const client = createMockSupabaseClient({
        tables: { leaves: { data: mockLeaves } },
      })

      await findLeaves(client, { status: 'APPROVED' })

      const queryBuilder = client.from('leaves') as unknown as MockQueryBuilder
      expect(queryBuilder.eq).toHaveBeenCalledWith('status', 'APPROVED')
    })

    it('날짜 범위 필터가 적용된다', async () => {
      const mockLeaves = [mockData.leave()]
      const client = createMockSupabaseClient({
        tables: { leaves: { data: mockLeaves } },
      })

      await findLeaves(client, {
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      })

      const queryBuilder = client.from('leaves') as unknown as MockQueryBuilder
      expect(queryBuilder.gte).toHaveBeenCalledWith('start_date', '2024-01-01')
      expect(queryBuilder.lte).toHaveBeenCalledWith('end_date', '2024-12-31')
    })

    it('에러 시 ApiError를 던진다', async () => {
      const client = createMockSupabaseClient({
        tables: { leaves: { data: null, error: new Error('DB Error') } },
      })

      await expect(findLeaves(client, {})).rejects.toThrow(ApiError)
    })
  })

  describe('findLeaveById', () => {
    it('휴가를 ID로 조회한다', async () => {
      const mockLeave = mockData.leave()
      const client = createMockSupabaseClient({
        tables: { leaves: { data: mockLeave } },
      })

      const result = await findLeaveById(client, 'leave-1')

      expect(result.id).toBe('leave-1')
    })

    it('에러 시 LEAVE_FETCH_FAILED 에러', async () => {
      const client = createMockSupabaseClient({
        tables: { leaves: { data: null, error: new Error('Not found') } },
      })

      try {
        await findLeaveById(client, 'non-existent')
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('LEAVE_FETCH_FAILED')
      }
    })
  })

  describe('findLeaveBalances', () => {
    it('직원의 휴가 잔여를 조회한다', async () => {
      const mockBalances = [mockData.leaveBalance()]
      const client = createMockSupabaseClient({
        tables: { leave_balances: { data: mockBalances } },
      })

      const result = await findLeaveBalances(client, 'emp-1', 2024)

      expect(result).toHaveLength(1)
      expect(result[0].remaining_days).toBe(12)
    })
  })

  describe('createLeave', () => {
    it('휴가를 생성한다', async () => {
      const mockLeave = mockData.leave()
      const client = createMockSupabaseClient({
        tables: { leaves: { data: mockLeave } },
      })

      const result = await createLeave(client, {
        employee_id: 'emp-1',
        leave_type_id: 'lt-1',
        start_date: '2024-02-01',
        end_date: '2024-02-02',
        days: 2,
        reason: '개인 사유',
        status: 'PENDING',
      })

      expect(result.id).toBe('leave-1')
    })

    it('생성 실패 시 LEAVE_CREATE_FAILED 에러', async () => {
      const client = createMockSupabaseClient({
        tables: { leaves: { data: null, error: new Error('Insert failed') } },
      })

      try {
        await createLeave(client, {
          employee_id: 'emp-1',
          leave_type_id: 'lt-1',
          start_date: '2024-02-01',
          end_date: '2024-02-02',
          days: 2,
          status: 'PENDING',
        })
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('LEAVE_CREATE_FAILED')
      }
    })
  })

  describe('updateLeaveStatus', () => {
    it('상태를 업데이트한다', async () => {
      const updatedLeave = mockData.leave({ status: 'APPROVED' })
      const client = createMockSupabaseClient({
        tables: { leaves: { data: updatedLeave } },
      })

      const result = await updateLeaveStatus(client, 'leave-1', 'APPROVED', 'approver-1')

      expect(result.status).toBe('APPROVED')
    })

    it('승인자 ID와 시간이 설정된다', async () => {
      const updatedLeave = mockData.leave({
        status: 'APPROVED',
        approved_by: 'approver-1',
        approved_at: '2024-01-20T00:00:00Z',
      })
      const client = createMockSupabaseClient({
        tables: { leaves: { data: updatedLeave } },
      })

      await updateLeaveStatus(client, 'leave-1', 'APPROVED', 'approver-1')

      const queryBuilder = client.from('leaves') as unknown as MockQueryBuilder
      expect(queryBuilder.update).toHaveBeenCalled()
    })
  })
})
