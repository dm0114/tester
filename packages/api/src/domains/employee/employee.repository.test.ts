/**
 * Employee Repository Tests
 */

import { describe, it, expect } from 'vitest'
import { createMockSupabaseClient, mockData, type MockQueryBuilder } from '../../__tests__/mock-supabase'
import { findEmployees, findEmployeeById } from './employee.repository'
import { ApiError } from '../../shared/errors'

describe('employee.repository', () => {
  describe('findEmployees', () => {
    it('직원 목록을 조회한다', async () => {
      const mockEmployees = [
        mockData.employee(),
        mockData.employee({ id: 'emp-2', first_name: '김' }),
      ]
      const client = createMockSupabaseClient({
        tables: { employees: { data: mockEmployees } },
      })

      const result = await findEmployees(client, {})

      expect(result).toHaveLength(2)
      expect(client.from).toHaveBeenCalledWith('employees')
    })

    it('상태 필터가 적용된다', async () => {
      const mockEmployees = [mockData.employee()]
      const client = createMockSupabaseClient({
        tables: { employees: { data: mockEmployees } },
      })

      await findEmployees(client, { status: 'ACTIVE' })

      const queryBuilder = client.from('employees') as unknown as MockQueryBuilder
      expect(queryBuilder.eq).toHaveBeenCalledWith('status', 'ACTIVE')
    })

    it('역할 필터가 적용된다', async () => {
      const mockEmployees = [mockData.employee({ role: 'MANAGER' })]
      const client = createMockSupabaseClient({
        tables: { employees: { data: mockEmployees } },
      })

      await findEmployees(client, { role: 'MANAGER' })

      const queryBuilder = client.from('employees') as unknown as MockQueryBuilder
      expect(queryBuilder.eq).toHaveBeenCalledWith('role', 'MANAGER')
    })

    it('부서 필터가 적용된다', async () => {
      const mockEmployees = [mockData.employee()]
      const client = createMockSupabaseClient({
        tables: { employees: { data: mockEmployees } },
      })

      await findEmployees(client, { department_id: 'dept-1' })

      const queryBuilder = client.from('employees') as unknown as MockQueryBuilder
      expect(queryBuilder.eq).toHaveBeenCalledWith('department_id', 'dept-1')
    })

    it('검색어 필터가 적용된다', async () => {
      const mockEmployees = [mockData.employee()]
      const client = createMockSupabaseClient({
        tables: { employees: { data: mockEmployees } },
      })

      await findEmployees(client, { search: '홍' })

      const queryBuilder = client.from('employees') as unknown as MockQueryBuilder
      expect(queryBuilder.or).toHaveBeenCalled()
    })

    it('페이지네이션이 적용된다', async () => {
      const client = createMockSupabaseClient({
        tables: { employees: { data: [] } },
      })

      await findEmployees(client, { page: 3, limit: 5 })

      const queryBuilder = client.from('employees') as unknown as MockQueryBuilder
      expect(queryBuilder.range).toHaveBeenCalledWith(10, 14)
    })

    it('에러 시 ApiError를 던진다', async () => {
      const client = createMockSupabaseClient({
        tables: { employees: { data: null, error: new Error('DB Error') } },
      })

      await expect(findEmployees(client, {})).rejects.toThrow(ApiError)
    })
  })

  describe('findEmployeeById', () => {
    it('직원을 ID로 조회한다', async () => {
      const mockEmployee = mockData.employee()
      const client = createMockSupabaseClient({
        tables: { employees: { data: mockEmployee } },
      })

      const result = await findEmployeeById(client, 'emp-1')

      expect(result.id).toBe('emp-1')
      expect(result.first_name).toBe('홍')
    })

    it('존재하지 않으면 EMPLOYEE_NOT_FOUND 에러', async () => {
      const error = { code: 'PGRST116', message: 'Row not found' }
      const client = createMockSupabaseClient({
        tables: { employees: { data: null, error: error as unknown as Error } },
      })

      try {
        await findEmployeeById(client, 'non-existent')
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('EMPLOYEE_NOT_FOUND')
      }
    })
  })
})
