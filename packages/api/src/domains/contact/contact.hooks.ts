/**
 * Contact TanStack Query Hooks
 */
import { useQuery } from '@tanstack/react-query'
import type { ContactFilters } from '@portfolio/types'
import { getSupabaseClient } from '../../shared/client'
import { contactKeys } from './contact.keys'
import { contactRepository } from './contact.repository'

/**
 * 문의 목록 조회 (관리자용)
 */
export function useContacts(filters: ContactFilters = {}) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: contactKeys.list(filters),
    queryFn: () => contactRepository.findMany(client, filters),
  })
}

/**
 * 문의 상세 조회
 */
export function useContact(id: string | undefined) {
  const client = getSupabaseClient()

  return useQuery({
    queryKey: id ? contactKeys.detail(id) : ['contacts', 'detail', 'null'],
    queryFn: () => {
      if (!id) throw new Error('Contact ID is required')
      return contactRepository.findById(client, id)
    },
    enabled: !!id,
  })
}
