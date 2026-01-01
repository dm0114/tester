/**
 * Contact Domain
 *
 * 사용법:
 * import { useContacts, useCreateContact, contactRepository } from '@portfolio/api/domains/contact'
 */

// Query Keys
export { contactKeys } from './contact.keys'

// Repository
export { contactRepository } from './contact.repository'

// Hooks
export { useContacts, useContact } from './contact.hooks'

// Mutations
export { useCreateContact, useUpdateContactStatus } from './contact.mutations'
