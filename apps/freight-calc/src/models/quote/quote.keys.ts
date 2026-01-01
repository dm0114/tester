import type { TransportMode, Bound } from '@/types/cargo'

export interface QuoteFilters {
  bound?: Bound
  transportMode?: TransportMode
  search?: string
  page?: number
  limit?: number
}

/**
 * Query Key Factory for Quotes
 *
 * Usage:
 * ```ts
 * useQuery({
 *   queryKey: quoteKeys.detail(id),
 *   queryFn: () => QuoteService.getById(id),
 * })
 * ```
 */
export const quoteKeys = {
  all: ['quotes'] as const,
  lists: () => [...quoteKeys.all, 'list'] as const,
  list: (filters: QuoteFilters) => [...quoteKeys.lists(), filters] as const,
  details: () => [...quoteKeys.all, 'detail'] as const,
  detail: (id: string) => [...quoteKeys.details(), id] as const,
}

/**
 * Query Key Factory for Ports (autocomplete)
 */
export const portKeys = {
  all: ['ports'] as const,
  search: (query: string) => [...portKeys.all, 'search', query] as const,
}
