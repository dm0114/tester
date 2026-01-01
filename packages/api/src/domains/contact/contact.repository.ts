/**
 * Contact Repository - Supabase 데이터 접근
 */
import type { Contact, ContactInput, ContactFilters } from '@portfolio/types'
import { supabase } from '../../shared/client'

export const contactRepository = {
  /**
   * 문의 생성 (익명 사용자도 가능)
   */
  async create(input: ContactInput): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 문의 목록 조회 (관리자 전용)
   */
  async findAll(filters: ContactFilters = {}): Promise<Contact[]> {
    let query = supabase.from('contacts').select('*').order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  /**
   * 문의 상세 조회
   */
  async findById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase.from('contacts').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  /**
   * 문의 상태 업데이트
   */
  async updateStatus(id: string, status: Contact['status']): Promise<Contact> {
    const updates: Partial<Contact> = { status }
    if (status === 'REPLIED') {
      updates.replied_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
