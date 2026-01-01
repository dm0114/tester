/**
 * 인증 관련 타입
 */

/** 사용자 역할 */
export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

/** 인증된 사용자 정보 */
export interface AuthUser {
  id: string
  email: string
  employee_id?: string
  role: UserRole
}

/** 로그인 요청 */
export interface LoginRequest {
  email: string
  password: string
}

/** 세션 정보 */
export interface Session {
  user: AuthUser
  access_token: string
  expires_at: number
}
