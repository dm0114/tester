/**
 * Supabase Client Mock
 *
 * Repository 테스트를 위한 Supabase 클라이언트 모킹 유틸
 */

import { vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Mock Query Builder 타입 (테스트에서 사용)
 */
export interface MockQueryBuilder {
  select: ReturnType<typeof vi.fn>
  insert: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
  eq: ReturnType<typeof vi.fn>
  neq: ReturnType<typeof vi.fn>
  gt: ReturnType<typeof vi.fn>
  gte: ReturnType<typeof vi.fn>
  lt: ReturnType<typeof vi.fn>
  lte: ReturnType<typeof vi.fn>
  like: ReturnType<typeof vi.fn>
  ilike: ReturnType<typeof vi.fn>
  or: ReturnType<typeof vi.fn>
  in: ReturnType<typeof vi.fn>
  order: ReturnType<typeof vi.fn>
  range: ReturnType<typeof vi.fn>
  limit: ReturnType<typeof vi.fn>
  single: ReturnType<typeof vi.fn>
  maybeSingle: ReturnType<typeof vi.fn>
  then?: unknown
}

/**
 * 체이닝 가능한 쿼리 빌더 모킹
 */
export function createQueryBuilderMock<T>(data: T | T[] | null, error: Error | null = null): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    then: vi.fn((resolve) => resolve({ data, error })),
  }

  // Promise-like behavior for await
  Object.defineProperty(builder, 'then', {
    value: (resolve: (value: { data: T | T[] | null; error: Error | null }) => void) => {
      return Promise.resolve({ data, error }).then(resolve)
    },
  })

  return builder
}

/**
 * Supabase 클라이언트 모킹
 */
export function createMockSupabaseClient(overrides: Partial<MockSupabaseConfig> = {}): SupabaseClient {
  const config: MockSupabaseConfig = {
    ...overrides,
  }

  // 테이블별 쿼리빌더 캐싱 (동일 인스턴스 반환을 위해)
  const queryBuilderCache = new Map<string, ReturnType<typeof createQueryBuilderMock>>()

  const mockClient = {
    from: vi.fn((table: string) => {
      // 캐시된 쿼리빌더가 있으면 반환
      if (queryBuilderCache.has(table)) {
        return queryBuilderCache.get(table)!
      }

      const tableData = config.tables?.[table]
      const builder = tableData
        ? createQueryBuilderMock(tableData.data, tableData.error)
        : createQueryBuilderMock(null)

      queryBuilderCache.set(table, builder)
      return builder
    }),
    rpc: vi.fn((fn: string, params?: Record<string, unknown>) => {
      const rpcResult = config.rpc?.[fn]
      if (rpcResult) {
        return Promise.resolve({ data: rpcResult.data, error: rpcResult.error })
      }
      return Promise.resolve({ data: null, error: null })
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: config.user ?? null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: config.session ?? null }, error: null }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  }

  return mockClient as unknown as SupabaseClient
}

interface MockSupabaseConfig {
  tables?: Record<string, { data: unknown; error?: Error | null }>
  rpc?: Record<string, { data: unknown; error?: Error | null }>
  user?: { id: string; email: string } | null
  session?: { access_token: string } | null
}

/**
 * 샘플 데이터 팩토리
 */
export const mockData = {
  employee: (overrides: Record<string, unknown> = {}) => ({
    id: 'emp-1',
    employee_number: 'EMP-001',
    user_id: 'user-1',
    first_name: '홍',
    last_name: '길동',
    email: 'hong@example.com',
    status: 'ACTIVE' as const,
    role: 'EMPLOYEE' as const,
    department_id: 'dept-1',
    position_id: 'pos-1',
    hire_date: '2024-01-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    department: {
      id: 'dept-1',
      name: '개발팀',
      code: 'DEV',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    position: {
      id: 'pos-1',
      name: '주임',
      code: 'JUNIOR',
      level: 1,
      base_salary: 3_000_000,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    ...overrides,
  }),

  payroll: (overrides: Record<string, unknown> = {}) => ({
    id: 'pay-1',
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
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    ...overrides,
  }),

  leave: (overrides: Record<string, unknown> = {}) => ({
    id: 'leave-1',
    employee_id: 'emp-1',
    leave_type_id: 'lt-1',
    start_date: '2024-02-01',
    end_date: '2024-02-02',
    days: 2,
    reason: '개인 사유',
    status: 'PENDING' as const,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    ...overrides,
  }),

  leaveBalance: (overrides: Record<string, unknown> = {}) => ({
    id: 'lb-1',
    employee_id: 'emp-1',
    leave_type_id: 'lt-1',
    year: 2024,
    total_days: 15,
    used_days: 3,
    remaining_days: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    leave_type: {
      id: 'lt-1',
      name: '연차',
      code: 'ANNUAL' as const,
      default_days: 15,
      is_paid: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    ...overrides,
  }),
}
