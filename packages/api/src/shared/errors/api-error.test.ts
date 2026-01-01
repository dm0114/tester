/**
 * ApiError Tests
 */

import { describe, it, expect } from 'vitest'
import { ApiError, ensureApiError } from './api-error'

describe('ApiError', () => {
  describe('constructor', () => {
    it('기본 메시지가 설정된다', () => {
      const error = new ApiError({ code: 'PAYROLL_NOT_FOUND' })
      expect(error.message).toBe('급여 정보를 찾을 수 없습니다')
    })

    it('커스텀 메시지를 사용할 수 있다', () => {
      const error = new ApiError({
        code: 'PAYROLL_NOT_FOUND',
        message: 'Custom message',
      })
      expect(error.message).toBe('Custom message')
    })

    it('meta 정보를 저장한다', () => {
      const error = new ApiError({
        code: 'VALIDATION_ERROR',
        meta: { field: 'email' },
      })
      expect(error.meta).toEqual({ field: 'email' })
    })

    it('cause를 저장한다', () => {
      const cause = new Error('Original error')
      const error = new ApiError({
        code: 'UNKNOWN_ERROR',
        cause,
      })
      expect(error.cause).toBe(cause)
    })
  })

  describe('fromSupabase', () => {
    it('Supabase 에러를 ApiError로 변환한다', () => {
      const supabaseError = { message: 'Row not found', code: 'PGRST116' }
      const error = ApiError.fromSupabase('PAYROLL_NOT_FOUND', supabaseError)

      expect(error).toBeInstanceOf(ApiError)
      expect(error.code).toBe('PAYROLL_NOT_FOUND')
      expect(error.message).toBe('Row not found')
      expect(error.meta?.supabaseCode).toBe('PGRST116')
    })
  })

  describe('is', () => {
    it('에러 코드를 확인할 수 있다', () => {
      const error = new ApiError({ code: 'PAYROLL_NOT_FOUND' })

      expect(error.is('PAYROLL_NOT_FOUND')).toBe(true)
      expect(error.is('EMPLOYEE_NOT_FOUND')).toBe(false)
    })
  })

  describe('toJSON', () => {
    it('JSON으로 직렬화된다', () => {
      const error = new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        meta: { field: 'email' },
      })

      const json = error.toJSON()

      expect(json).toEqual({
        name: 'ApiError',
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        meta: { field: 'email' },
      })
    })
  })
})

describe('ensureApiError', () => {
  it('ApiError는 그대로 반환', () => {
    const original = new ApiError({ code: 'PAYROLL_NOT_FOUND' })
    const result = ensureApiError(original)
    expect(result).toBe(original)
  })

  it('Error를 ApiError로 변환', () => {
    const original = new Error('Something went wrong')
    const result = ensureApiError(original)

    expect(result).toBeInstanceOf(ApiError)
    expect(result.code).toBe('UNKNOWN_ERROR')
    expect(result.message).toBe('Something went wrong')
    expect(result.cause).toBe(original)
  })

  it('문자열을 ApiError로 변환', () => {
    const result = ensureApiError('string error')

    expect(result).toBeInstanceOf(ApiError)
    expect(result.code).toBe('UNKNOWN_ERROR')
    expect(result.cause).toBe('string error')
  })

  it('null/undefined를 ApiError로 변환', () => {
    const nullResult = ensureApiError(null)
    const undefinedResult = ensureApiError(undefined)

    expect(nullResult).toBeInstanceOf(ApiError)
    expect(undefinedResult).toBeInstanceOf(ApiError)
  })
})
