'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { quoteKeys } from './quote.keys'
import { apiClient } from '@/lib/api/client'
import type { Quote } from '@/types/quote'
import type { QuoteFormValues } from '@/schemas/quote-form.schema'

// API Types
interface CreateQuoteRequest {
  bound: string
  transport_mode: string
  pol_code: string
  pol_name: string
  pod_code: string
  pod_name: string
  incoterms: string
  cargo_list: unknown[]
  options: {
    customs_service: boolean
    insurance: boolean
    special_requests?: string
    etd?: string
    eta?: string
  }
}

interface QuoteResponse {
  id: string
  created_at: string
  bound: string
  transport_mode: string
  pol_code: string
  pol_name: string
  pod_code: string
  pod_name: string
  incoterms: string
  cargo_list: unknown[]
  total_cbm: number
  total_weight: number
}

// Adapter - Form → API Request
function toCreateRequest(form: QuoteFormValues): CreateQuoteRequest {
  return {
    bound: form.bound,
    transport_mode: form.transportMode,
    pol_code: form.pol.code,
    pol_name: form.pol.name,
    pod_code: form.pod.code,
    pod_name: form.pod.name,
    incoterms: form.incoterms,
    cargo_list: form.cargo,
    options: {
      customs_service: form.options.customsService,
      insurance: form.options.insurance,
      special_requests: form.options.specialRequests,
      etd: form.options.etd,
      eta: form.options.eta,
    },
  }
}

// Adapter - API Response → Domain
function toDomain(response: QuoteResponse): Quote {
  return {
    id: response.id,
    createdAt: new Date(response.created_at),
    bound: response.bound as Quote['bound'],
    transportMode: response.transport_mode as Quote['transportMode'],
    pol: { code: response.pol_code, name: response.pol_name },
    pod: { code: response.pod_code, name: response.pod_name },
    incoterms: response.incoterms as Quote['incoterms'],
    cargo: response.cargo_list as Quote['cargo'],
    options: {
      customsService: false,
      insurance: false,
    },
    summary: {
      totalCBM: response.total_cbm,
      totalWeight: response.total_weight,
      totalPackages: 0,
    },
  }
}

// Quote Service
const QuoteService = {
  create: async (data: QuoteFormValues): Promise<Quote> => {
    const request = toCreateRequest(data)
    const response = await apiClient.post<QuoteResponse>('/quotes', request)
    return toDomain(response)
  },

  update: async (id: string, data: QuoteFormValues): Promise<Quote> => {
    const request = toCreateRequest(data)
    const response = await apiClient.put<QuoteResponse>(`/quotes/${id}`, request)
    return toDomain(response)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/quotes/${id}`)
  },
}

/**
 * Create Quote Mutation
 */
export function useCreateQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: QuoteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
    },
  })
}

/**
 * Update Quote Mutation
 */
export function useUpdateQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuoteFormValues }) =>
      QuoteService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
    },
  })
}

/**
 * Delete Quote Mutation with Optimistic Update
 */
export function useDeleteQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: QuoteService.delete,

    // Optimistic Update
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: quoteKeys.lists() })

      // Snapshot the previous value
      const previous = queryClient.getQueryData<Quote[]>(quoteKeys.lists())

      // Optimistically update the cache
      queryClient.setQueryData<Quote[]>(quoteKeys.lists(), (old) =>
        old?.filter((q) => q.id !== id) ?? []
      )

      // Return context with previous value for rollback
      return { previous }
    },

    // Rollback on Error
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(quoteKeys.lists(), context.previous)
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
    },
  })
}
