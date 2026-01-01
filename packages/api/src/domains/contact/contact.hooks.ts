/**
 * Contact TanStack Query Hooks
 */
import { useQuery } from '@tanstack/react-query'
import type { ContactFilters } from '@portfolio/types'
import { contactKeys } from './contact.keys'
import { contactRepository } from './contact.repository'

/**
 * 문의 목록 조회 (관리자용)
 */
export function useContacts(filters: ContactFilters = {}) {
  return useQuery({
    queryKey: contactKeys.list(filters),
    queryFn: () => contactRepository.findAll(filters),
  })
}

/**
 * 문의 상세 조회
 */
export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: contactKeys.detail(id!),
    queryFn: () => contactRepository.findById(id!),
    enabled: !!id,
  })
}
