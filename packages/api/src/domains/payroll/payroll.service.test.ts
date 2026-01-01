/**
 * Payroll Service Tests
 *
 * 순수 함수 테스트 - 모킹 불필요
 */

import { describe, it, expect } from 'vitest'
import {
  calculatePayroll,
  getHourlyRate,
  getOvertimeRate,
  validateStatusTransition,
} from './payroll.service'
import { ApiError } from '../../shared/errors'

describe('payroll.service', () => {
  describe('getHourlyRate', () => {
    it('월급에서 시급을 계산한다', () => {
      // 월 209시간 기준
      expect(getHourlyRate(3_000_000)).toBeCloseTo(14354.07, 0)
      expect(getHourlyRate(4_000_000)).toBeCloseTo(19138.76, 0)
    })
  })

  describe('getOvertimeRate', () => {
    it('연장근무 시급은 1.5배이다', () => {
      const hourlyRate = getHourlyRate(3_000_000)
      expect(getOvertimeRate(3_000_000)).toBeCloseTo(hourlyRate * 1.5, 0)
    })
  })

  describe('calculatePayroll', () => {
    it('기본급만 있을 때 급여를 계산한다', () => {
      const result = calculatePayroll({
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
      })

      expect(result.gross_salary).toBe(3_000_000)
      expect(result.net_salary).toBeLessThan(result.gross_salary)
      expect(result.total_deductions).toBeGreaterThan(0)
    })

    it('연장근무가 있을 때 수당이 포함된다', () => {
      const withoutOvertime = calculatePayroll({
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
      })

      const withOvertime = calculatePayroll({
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
        overtime_hours: 10,
      })

      expect(withOvertime.gross_salary).toBeGreaterThan(withoutOvertime.gross_salary)
    })

    it('4대보험이 올바르게 계산된다', () => {
      const result = calculatePayroll({
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
      })

      // 국민연금: 4.5%
      expect(result.insurance.national_pension).toBe(Math.round(3_000_000 * 0.045 / 10) * 10)
      // 건강보험: 3.545%
      expect(result.insurance.health_insurance).toBe(Math.round(3_000_000 * 0.03545 / 10) * 10)
      // 고용보험: 0.9%
      expect(result.insurance.employment_insurance).toBe(Math.round(3_000_000 * 0.009 / 10) * 10)
    })

    it('10원 단위로 반올림된다', () => {
      const result = calculatePayroll({
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_123_456,
      })

      expect(result.gross_salary % 10).toBe(0)
      expect(result.net_salary % 10).toBe(0)
      expect(result.total_deductions % 10).toBe(0)
    })

    it('추가 공제가 반영된다', () => {
      const withoutDeduction = calculatePayroll({
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
      })

      const withDeduction = calculatePayroll({
        employee_id: 'emp-1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 3_000_000,
        additional_deductions: 100_000,
      })

      expect(withDeduction.net_salary).toBe(withoutDeduction.net_salary - 100_000)
    })
  })

  describe('validateStatusTransition', () => {
    it('DRAFT에서 CALCULATED로 전이 가능', () => {
      expect(() => validateStatusTransition('DRAFT', 'CALCULATED')).not.toThrow()
    })

    it('CALCULATED에서 APPROVED로 전이 가능', () => {
      expect(() => validateStatusTransition('CALCULATED', 'APPROVED')).not.toThrow()
    })

    it('APPROVED에서 PAID로 전이 가능', () => {
      expect(() => validateStatusTransition('APPROVED', 'PAID')).not.toThrow()
    })

    it('PAID에서 다른 상태로 전이 불가', () => {
      expect(() => validateStatusTransition('PAID', 'DRAFT')).toThrow(ApiError)
      expect(() => validateStatusTransition('PAID', 'APPROVED')).toThrow(ApiError)
    })

    it('DRAFT에서 PAID로 직접 전이 불가', () => {
      expect(() => validateStatusTransition('DRAFT', 'PAID')).toThrow(ApiError)
    })

    it('에러에 상태 정보가 포함된다', () => {
      try {
        validateStatusTransition('PAID', 'DRAFT')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).code).toBe('PAYROLL_INVALID_STATUS')
        expect((error as ApiError).meta).toHaveProperty('currentStatus', 'PAID')
        expect((error as ApiError).meta).toHaveProperty('newStatus', 'DRAFT')
      }
    })
  })
})
