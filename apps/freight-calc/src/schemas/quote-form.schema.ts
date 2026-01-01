import { z } from 'zod'

// Port schema
export const portSchema = z.object({
  code: z.string().min(1, 'Port code is required'),
  name: z.string().min(1, 'Port name is required'),
})

// Quote options schema
export const quoteOptionsSchema = z.object({
  customsService: z.boolean().default(false),
  insurance: z.boolean().default(false),
  specialRequests: z.string().optional(),
  etd: z.string().optional(),
  eta: z.string().optional(),
})

// Base cargo fields shared by all types
const baseCargoFields = {
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  packages: z.coerce.number().min(1, 'At least 1 package required'),
  grossWeight: z.coerce.number().min(0.1, 'Weight must be at least 0.1kg'),
}

// FCL cargo item
export const fclCargoItemSchema = z.object({
  ...baseCargoFields,
  containerType: z.enum(['20DRY', '40DRY', '40HC', '20RF', '40RF']),
  quantity: z.coerce.number().min(1, 'At least 1 container required'),
})

// LCL/Air cargo item (dimensions required)
export const dimensionCargoItemSchema = z.object({
  ...baseCargoFields,
  length: z.coerce.number().min(1, 'Length must be at least 1'),
  width: z.coerce.number().min(1, 'Width must be at least 1'),
  height: z.coerce.number().min(1, 'Height must be at least 1'),
  unit: z.enum(['CM', 'INCH']),
  vwt: z.coerce.number().optional(),
  cwt: z.coerce.number().optional(),
})

// Union of all cargo types
export const cargoItemSchema = z.union([
  fclCargoItemSchema,
  dimensionCargoItemSchema,
])

// Main quote form schema
export const quoteFormSchema = z.object({
  bound: z.enum(['EXPORT', 'IMPORT']),
  transportMode: z.enum(['FCL', 'LCL', 'AIR']),
  pol: portSchema,
  pod: portSchema,
  incoterms: z.enum([
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
  ]),
  cargo: z.array(cargoItemSchema),
  options: quoteOptionsSchema,
})

// Infer types from schema
export type QuoteFormValues = z.infer<typeof quoteFormSchema>
export type PortInput = z.infer<typeof portSchema>
export type QuoteOptionsInput = z.infer<typeof quoteOptionsSchema>
export type FCLCargoItem = z.infer<typeof fclCargoItemSchema>
export type DimensionCargoItem = z.infer<typeof dimensionCargoItemSchema>
export type CargoItem = z.infer<typeof cargoItemSchema>

// Type guards for cargo items
export function isFCLCargo(item: CargoItem): item is FCLCargoItem {
  return 'containerType' in item && 'quantity' in item
}

export function isDimensionCargo(item: CargoItem): item is DimensionCargoItem {
  return 'length' in item && 'width' in item && 'height' in item
}

// Default values for the form
export const DEFAULT_QUOTE_FORM_VALUES: QuoteFormValues = {
  bound: 'EXPORT',
  transportMode: 'FCL',
  pol: { code: '', name: '' },
  pod: { code: '', name: '' },
  incoterms: 'FOB',
  cargo: [],
  options: {
    customsService: false,
    insurance: false,
    specialRequests: '',
    etd: '',
    eta: '',
  },
}
