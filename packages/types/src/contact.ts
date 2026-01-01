/**
 * Contact - 포트폴리오 문의 타입
 */

export type ContactStatus = 'PENDING' | 'READ' | 'REPLIED'

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  replied_at: string | null
  created_at: string
  updated_at: string
}

export interface ContactInput {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFilters {
  status?: ContactStatus
  search?: string
}
