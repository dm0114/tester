/**
 * React Query Hooks Test Utilities
 *
 * QueryClient 래퍼와 hooks 테스트를 위한 유틸리티
 */

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook as rtlRenderHook, waitFor } from '@testing-library/react'

/**
 * 테스트용 QueryClient 생성
 * - 재시도 비활성화
 * - 에러 로깅 비활성화
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

/**
 * QueryClientProvider 래퍼
 */
export function createWrapper(client?: QueryClient) {
  const queryClient = client ?? createTestQueryClient()

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

/**
 * React Query hooks용 renderHook 래퍼
 */
export function renderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: {
    queryClient?: QueryClient
    initialProps?: TProps
  },
) {
  const queryClient = options?.queryClient ?? createTestQueryClient()

  return rtlRenderHook(hook, {
    wrapper: createWrapper(queryClient),
    initialProps: options?.initialProps,
  })
}

export { waitFor }
