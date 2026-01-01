import { z } from 'zod'

// Base cargo schema shared by all transport modes
const baseCargoSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  packages: z.coerce.number().min(1, 'At least 1 package required'),
  grossWeight: z.coerce.number().min(0.1, 'Weight must be at least 0.1kg'),
})

// LCL (Less Container Load) cargo schema
export const lclCargoSchema = baseCargoSchema.extend({
  length: z.coerce.number().min(1, 'Length must be at least 1'),
  width: z.coerce.number().min(1, 'Width must be at least 1'),
  height: z.coerce.number().min(1, 'Height must be at least 1'),
  unit: z.enum(['CM', 'INCH']).default('CM'),
})

// FCL (Full Container Load) cargo schema
export const fclCargoSchema = baseCargoSchema.extend({
  containerType: z.enum(['20DRY', '40DRY', '40HC', '20RF', '40RF']),
  quantity: z.coerce.number().min(1, 'At least 1 container required'),
})

// Air cargo schema (same dimensions as LCL)
export const airCargoSchema = lclCargoSchema.extend({
  // Calculated fields (optional, computed at runtime)
  vwt: z.coerce.number().optional(),
  cwt: z.coerce.number().optional(),
})

// Discriminated union for transport mode specific cargo
export const cargoByModeSchema = z.discriminatedUnion('transportMode', [
  z.object({
    transportMode: z.literal('FCL'),
    cargo: z.array(fclCargoSchema).min(1, 'At least 1 cargo item required'),
  }),
  z.object({
    transportMode: z.literal('LCL'),
    cargo: z.array(lclCargoSchema).min(1, 'At least 1 cargo item required'),
  }),
  z.object({
    transportMode: z.literal('AIR'),
    cargo: z.array(airCargoSchema).min(1, 'At least 1 cargo item required'),
  }),
])

// Type exports
export type LCLCargoInput = z.infer<typeof lclCargoSchema>
export type FCLCargoInput = z.infer<typeof fclCargoSchema>
export type AirCargoInput = z.infer<typeof airCargoSchema>
export type CargoByModeInput = z.infer<typeof cargoByModeSchema>
