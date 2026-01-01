/**
 * Contact Mutations
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ContactInput, Contact } from '@portfolio/types'
import { getSupabaseClient } from '../../shared/client'
import { contactKeys } from './contact.keys'
import { contactRepository } from './contact.repository'

/**
 * 문의 생성 (익명 사용자용)
 */
export function useCreateContact() {
  const client = getSupabaseClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ContactInput) => contactRepository.create(client, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all })
    },
  })
}

/**
 * 문의 상태 업데이트 (관리자용)
 */
export function useUpdateContactStatus() {
  const client = getSupabaseClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Contact['status'] }) =>
      contactRepository.updateStatus(client, id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all })
      queryClient.setQueryData(contactKeys.detail(data.id), data)
    },
  })
}
