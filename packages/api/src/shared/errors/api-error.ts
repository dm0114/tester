/**
 * API 레이어 커스텀 에러
 *
 * Supabase 에러를 감싸서 일관된 에러 처리를 제공합니다.
 */

export type ApiErrorCode =
  // 공통
  | 'UNKNOWN_ERROR'
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  // Auth
  | 'AUTH_SIGN_IN_FAILED'
  | 'AUTH_SIGN_UP_FAILED'
  | 'AUTH_SIGN_OUT_FAILED'
  | 'AUTH_PASSWORD_RESET_FAILED'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_NOT_CONFIRMED'
  | 'AUTH_SESSION_EXPIRED'
  // Payroll
  | 'PAYROLL_FETCH_FAILED'
  | 'PAYROLL_CREATE_FAILED'
  | 'PAYROLL_UPDATE_FAILED'
  | 'PAYROLL_NOT_FOUND'
  | 'PAYROLL_INVALID_STATUS'
  // Employee
  | 'EMPLOYEE_FETCH_FAILED'
  | 'EMPLOYEE_NOT_FOUND'
  // Leave
  | 'LEAVE_FETCH_FAILED'
  | 'LEAVE_CREATE_FAILED'
  | 'LEAVE_INSUFFICIENT_BALANCE'
  // Contact
  | 'CONTACT_FETCH_FAILED'
  | 'CONTACT_CREATE_FAILED'
  | 'CONTACT_UPDATE_FAILED'
  | 'CONTACT_NOT_FOUND'

export interface ApiErrorOptions {
  code: ApiErrorCode
  message?: string
  cause?: unknown
  meta?: Record<string, unknown>
}

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly meta?: Record<string, unknown>

  constructor(options: ApiErrorOptions) {
    super(options.message ?? getDefaultMessage(options.code))
    this.name = 'ApiError'
    this.code = options.code
    this.meta = options.meta
    this.cause = options.cause
  }

  /**
   * Supabase 에러를 ApiError로 변환
   */
  static fromSupabase(code: ApiErrorCode, error: { message?: string; code?: string }): ApiError {
    return new ApiError({
      code,
      message: error.message,
      cause: error,
      meta: { supabaseCode: error.code },
    })
  }

  /**
   * 에러가 특정 코드인지 확인
   */
  is(code: ApiErrorCode): boolean {
    return this.code === code
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      meta: this.meta,
    }
  }
}

function getDefaultMessage(code: ApiErrorCode): string {
  const messages: Record<ApiErrorCode, string> = {
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
    NETWORK_ERROR: '네트워크 연결을 확인해주세요',
    UNAUTHORIZED: '인증이 필요합니다',
    FORBIDDEN: '접근 권한이 없습니다',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다',
    VALIDATION_ERROR: '입력값이 올바르지 않습니다',
    // Auth
    AUTH_SIGN_IN_FAILED: '로그인에 실패했습니다',
    AUTH_SIGN_UP_FAILED: '회원가입에 실패했습니다',
    AUTH_SIGN_OUT_FAILED: '로그아웃에 실패했습니다',
    AUTH_PASSWORD_RESET_FAILED: '비밀번호 재설정에 실패했습니다',
    AUTH_INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
    AUTH_EMAIL_NOT_CONFIRMED: '이메일 인증이 필요합니다',
    AUTH_SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요',
    // Payroll
    PAYROLL_FETCH_FAILED: '급여 정보를 불러오는데 실패했습니다',
    PAYROLL_CREATE_FAILED: '급여 생성에 실패했습니다',
    PAYROLL_UPDATE_FAILED: '급여 업데이트에 실패했습니다',
    PAYROLL_NOT_FOUND: '급여 정보를 찾을 수 없습니다',
    PAYROLL_INVALID_STATUS: '잘못된 급여 상태입니다',
    // Employee
    EMPLOYEE_FETCH_FAILED: '직원 정보를 불러오는데 실패했습니다',
    EMPLOYEE_NOT_FOUND: '직원을 찾을 수 없습니다',
    // Leave
    LEAVE_FETCH_FAILED: '휴가 정보를 불러오는데 실패했습니다',
    LEAVE_CREATE_FAILED: '휴가 신청에 실패했습니다',
    LEAVE_INSUFFICIENT_BALANCE: '휴가 잔여일수가 부족합니다',
    // Contact
    CONTACT_FETCH_FAILED: '문의 정보를 불러오는데 실패했습니다',
    CONTACT_CREATE_FAILED: '문의 등록에 실패했습니다',
    CONTACT_UPDATE_FAILED: '문의 상태 변경에 실패했습니다',
    CONTACT_NOT_FOUND: '문의를 찾을 수 없습니다',
  }
  return messages[code]
}

/**
 * Supabase Auth 에러를 ApiError로 변환
 * @see https://supabase.com/docs/reference/javascript/auth-error-codes
 */
export function createAuthError(
  defaultCode: ApiErrorCode,
  error: { message?: string; code?: string; status?: number },
): ApiError {
  // Supabase Auth 에러 코드 매핑
  const codeMap: Record<string, ApiErrorCode> = {
    invalid_credentials: 'AUTH_INVALID_CREDENTIALS',
    email_not_confirmed: 'AUTH_EMAIL_NOT_CONFIRMED',
    session_expired: 'AUTH_SESSION_EXPIRED',
    user_not_found: 'AUTH_INVALID_CREDENTIALS',
    invalid_grant: 'AUTH_INVALID_CREDENTIALS',
  }

  const mappedCode = error.code ? codeMap[error.code] : undefined

  return new ApiError({
    code: mappedCode ?? defaultCode,
    message: error.message,
    cause: error,
    meta: { supabaseCode: error.code, status: error.status },
  })
}

/**
 * unknown 에러를 ApiError로 안전하게 변환
 */
export function ensureApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof Error) {
    return new ApiError({
      code: 'UNKNOWN_ERROR',
      message: error.message,
      cause: error,
    })
  }

  return new ApiError({
    code: 'UNKNOWN_ERROR',
    cause: error,
  })
}
