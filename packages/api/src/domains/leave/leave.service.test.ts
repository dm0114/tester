/**
 * Leave Service Tests
 *
 * 순수 함수 테스트 - 모킹 불필요
 */

import { describe, it, expect } from 'vitest'
import {
  calculateLeaveDays,
  validateLeaveStatusTransition,
} from './leave.service'
import { ApiError } from '../../shared/errors'

describe('leave.service', () => {
  describe('calculateLeaveDays', () => {
    it('같은 날짜면 1일', () => {
      expect(calculateLeaveDays('2024-01-15', '2024-01-15')).toBe(1)
    })

    it('연속 2일이면 2일', () => {
      expect(calculateLeaveDays('2024-01-15', '2024-01-16')).toBe(2)
    })

    it('1주일이면 7일', () => {
      expect(calculateLeaveDays('2024-01-15', '2024-01-21')).toBe(7)
    })

    it('월을 넘어가는 휴가도 계산', () => {
      expect(calculateLeaveDays('2024-01-30', '2024-02-02')).toBe(4)
    })

    it('연도를 넘어가는 휴가도 계산', () => {
      expect(calculateLeaveDays('2024-12-30', '2025-01-02')).toBe(4)
    })
  })

  describe('validateLeaveStatusTransition', () => {
    describe('PENDING 상태에서', () => {
      it('APPROVED로 전이 가능', () => {
        expect(() => validateLeaveStatusTransition('PENDING', 'APPROVED')).not.toThrow()
      })

      it('REJECTED로 전이 가능', () => {
        expect(() => validateLeaveStatusTransition('PENDING', 'REJECTED')).not.toThrow()
      })

      it('CANCELLED로 전이 가능', () => {
        expect(() => validateLeaveStatusTransition('PENDING', 'CANCELLED')).not.toThrow()
      })
    })

    describe('APPROVED 상태에서', () => {
      it('CANCELLED로 전이 가능', () => {
        expect(() => validateLeaveStatusTransition('APPROVED', 'CANCELLED')).not.toThrow()
      })

      it('REJECTED로 전이 불가', () => {
        expect(() => validateLeaveStatusTransition('APPROVED', 'REJECTED')).toThrow(ApiError)
      })

      it('PENDING으로 전이 불가', () => {
        expect(() => validateLeaveStatusTransition('APPROVED', 'PENDING')).toThrow(ApiError)
      })
    })

    describe('REJECTED 상태에서', () => {
      it('다른 상태로 전이 불가', () => {
        expect(() => validateLeaveStatusTransition('REJECTED', 'PENDING')).toThrow(ApiError)
        expect(() => validateLeaveStatusTransition('REJECTED', 'APPROVED')).toThrow(ApiError)
        expect(() => validateLeaveStatusTransition('REJECTED', 'CANCELLED')).toThrow(ApiError)
      })
    })

    describe('CANCELLED 상태에서', () => {
      it('다른 상태로 전이 불가', () => {
        expect(() => validateLeaveStatusTransition('CANCELLED', 'PENDING')).toThrow(ApiError)
        expect(() => validateLeaveStatusTransition('CANCELLED', 'APPROVED')).toThrow(ApiError)
      })
    })

    it('에러에 상태 정보가 포함된다', () => {
      try {
        validateLeaveStatusTransition('REJECTED', 'APPROVED')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).meta).toHaveProperty('currentStatus', 'REJECTED')
        expect((error as ApiError).meta).toHaveProperty('newStatus', 'APPROVED')
        expect((error as ApiError).meta).toHaveProperty('allowed')
      }
    })
  })
})
