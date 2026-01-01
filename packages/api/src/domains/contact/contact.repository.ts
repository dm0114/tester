/**
 * Contact Repository - Supabase 데이터 접근
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Contact, ContactInput, ContactFilters } from '@portfolio/types'
import { ApiError } from '../../shared/errors'

/**
 * 문의 생성 (익명 사용자도 가능)
 */
export async function createContact(
  client: SupabaseClient,
  input: ContactInput,
): Promise<Contact> {
  const { data, error } = await client
    .from('contacts')
    .insert(input)
    .select()
    .single()

  if (error) {
    throw ApiError.fromSupabase('CONTACT_CREATE_FAILED', error)
  }
  return data
}

/**
 * 문의 목록 조회 (관리자 전용)
 */
export async function findContacts(
  client: SupabaseClient,
  filters: ContactFilters = {},
): Promise<Contact[]> {
  let query = client.from('contacts').select('*').order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    throw ApiError.fromSupabase('CONTACT_FETCH_FAILED', error)
  }
  return data
}

/**
 * 문의 상세 조회
 */
export async function findContactById(
  client: SupabaseClient,
  id: string,
): Promise<Contact> {
  const { data, error } = await client
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError({ code: 'CONTACT_NOT_FOUND', cause: error })
    }
    throw ApiError.fromSupabase('CONTACT_FETCH_FAILED', error)
  }
  return data
}

/**
 * 문의 상태 업데이트
 */
export async function updateContactStatus(
  client: SupabaseClient,
  id: string,
  status: Contact['status'],
): Promise<Contact> {
  const updates: Partial<Contact> = { status }
  if (status === 'REPLIED') {
    updates.replied_at = new Date().toISOString()
  }

  const { data, error } = await client
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw ApiError.fromSupabase('CONTACT_UPDATE_FAILED', error)
  }
  return data
}

/**
 * Repository 객체
 */
export const contactRepository = {
  create: createContact,
  findMany: findContacts,
  findById: findContactById,
  updateStatus: updateContactStatus,
}
