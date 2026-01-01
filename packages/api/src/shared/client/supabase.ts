/**
 * Supabase 클라이언트 팩토리
 *
 * 환경에 따라 다른 방식으로 클라이언트를 생성할 수 있도록
 * 팩토리 패턴을 적용합니다.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type { SupabaseClient }

/**
 * 싱글톤 클라이언트 (브라우저 환경)
 * 기존 호환성을 위해 유지
 */
let browserClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (browserClient) return browserClient

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  browserClient = createClient(url, anonKey)
  return browserClient
}

/**
 * 커스텀 클라이언트 생성 (SSR, Edge, 테스트 등)
 */
export function createSupabaseClient(
  url: string,
  key: string,
  options?: Parameters<typeof createClient>[2],
): SupabaseClient {
  return createClient(url, key, options)
}

/**
 * 기존 코드 호환을 위한 default export
 * @deprecated getSupabaseClient() 사용 권장
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return Reflect.get(getSupabaseClient(), prop)
  },
})
