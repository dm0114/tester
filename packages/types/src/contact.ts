/**
 * Contact - 포트폴리오 문의 타입
 */
import type { BaseEntity } from './common'

export type ContactStatus = 'PENDING' | 'READ' | 'REPLIED'

export interface Contact extends BaseEntity {
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  replied_at: string | null
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
