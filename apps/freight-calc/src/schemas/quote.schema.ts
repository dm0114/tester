import { z } from 'zod'

import {
  airCargoSchema,
  fclCargoSchema,
  lclCargoSchema,
} from './cargo.schema'

// Port schema
export const portSchema = z.object({
  code: z.string().min(1, 'Port code is required'),
  name: z.string().min(1, 'Port name is required'),
})

// Incoterms enum
export const incotermsSchema = z.enum([
  'EXW',
  'FCA',
  'FAS',
  'FOB',
  'CFR',
  'CIF',
  'CPT',
  'CIP',
  'DAP',
  'DPU',
  'DDP',
])

// Options schema
export const quoteOptionsSchema = z.object({
  customsService: z.boolean().default(false),
  insurance: z.boolean().default(false),
  specialRequests: z.string().optional(),
  etd: z.string().optional(),
  eta: z.string().optional(),
})

// Base quote schema (without cargo - will be added conditionally)
const baseQuoteSchema = z.object({
  bound: z.enum(['EXPORT', 'IMPORT']),
  transportMode: z.enum(['FCL', 'LCL', 'AIR']),
  pol: portSchema,
  pod: portSchema,
  incoterms: incotermsSchema,
  options: quoteOptionsSchema,
})

// FCL Quote schema
export const fclQuoteSchema = baseQuoteSchema.extend({
  transportMode: z.literal('FCL'),
  cargo: z.array(fclCargoSchema).min(1, 'At least 1 cargo item required'),
})

// LCL Quote schema
export const lclQuoteSchema = baseQuoteSchema.extend({
  transportMode: z.literal('LCL'),
  cargo: z.array(lclCargoSchema).min(1, 'At least 1 cargo item required'),
})

// Air Quote schema
export const airQuoteSchema = baseQuoteSchema.extend({
  transportMode: z.literal('AIR'),
  cargo: z.array(airCargoSchema).min(1, 'At least 1 cargo item required'),
})

// Combined quote schema with discriminated union
export const quoteFormSchema = z.discriminatedUnion('transportMode', [
  fclQuoteSchema,
  lclQuoteSchema,
  airQuoteSchema,
])

// Step validation schemas
export const basicInfoSchema = z.object({
  bound: z.enum(['EXPORT', 'IMPORT']),
  transportMode: z.enum(['FCL', 'LCL', 'AIR']),
  pol: portSchema,
  pod: portSchema,
  incoterms: incotermsSchema,
})

// Type exports
export type PortInput = z.infer<typeof portSchema>
export type QuoteOptionsInput = z.infer<typeof quoteOptionsSchema>
export type BasicInfoInput = z.infer<typeof basicInfoSchema>
export type FCLQuoteInput = z.infer<typeof fclQuoteSchema>
export type LCLQuoteInput = z.infer<typeof lclQuoteSchema>
export type AirQuoteInput = z.infer<typeof airQuoteSchema>
export type QuoteFormInput = z.infer<typeof quoteFormSchema>
