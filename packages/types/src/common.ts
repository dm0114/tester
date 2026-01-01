/**
 * 공통 타입 정의
 */

/** 기본 엔티티 필드 */
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

/** 페이지네이션 요청 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** 정렬 옵션 */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/** API 응답 래퍼 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

/** API 에러 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
