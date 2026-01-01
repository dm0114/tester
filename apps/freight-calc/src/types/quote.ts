import type { Bound, Cargo, CargoSummary, TransportMode } from './cargo'

export interface Port {
  code: string
  name: string
}

export type Incoterms =
  | 'EXW'
  | 'FCA'
  | 'FAS'
  | 'FOB'
  | 'CFR'
  | 'CIF'
  | 'CPT'
  | 'CIP'
  | 'DAP'
  | 'DPU'
  | 'DDP'

export interface QuoteOptions {
  customsService: boolean
  insurance: boolean
  specialRequests?: string
  etd?: string
  eta?: string
}

export interface Quote {
  id: string
  createdAt: Date
  bound: Bound
  transportMode: TransportMode
  pol: Port
  pod: Port
  incoterms: Incoterms
  cargo: Cargo[]
  options: QuoteOptions
  summary: CargoSummary
}

export interface QuoteFormStep {
  id: 'basic' | 'cargo' | 'options' | 'result'
  title: string
  description: string
}

export const QUOTE_STEPS: QuoteFormStep[] = [
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Select transport mode and ports',
  },
  {
    id: 'cargo',
    title: 'Cargo Details',
    description: 'Enter cargo information',
  },
  {
    id: 'options',
    title: 'Options',
    description: 'Additional services',
  },
  {
    id: 'result',
    title: 'Result',
    description: 'Review and submit',
  },
]
