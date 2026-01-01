import type { Incoterms } from '@/types/quote'

export interface IncotermsInfo {
  code: Incoterms
  name: string
  description: string
  category: 'any' | 'sea'
}

export const INCOTERMS_LIST: IncotermsInfo[] = [
  {
    code: 'EXW',
    name: 'Ex Works',
    description: 'Seller makes goods available at their premises',
    category: 'any',
  },
  {
    code: 'FCA',
    name: 'Free Carrier',
    description: 'Seller delivers goods to carrier at named place',
    category: 'any',
  },
  {
    code: 'FAS',
    name: 'Free Alongside Ship',
    description: 'Seller delivers goods alongside ship',
    category: 'sea',
  },
  {
    code: 'FOB',
    name: 'Free On Board',
    description: 'Seller delivers goods on board vessel',
    category: 'sea',
  },
  {
    code: 'CFR',
    name: 'Cost and Freight',
    description: 'Seller pays freight to destination port',
    category: 'sea',
  },
  {
    code: 'CIF',
    name: 'Cost, Insurance & Freight',
    description: 'Seller pays freight and insurance to destination',
    category: 'sea',
  },
  {
    code: 'CPT',
    name: 'Carriage Paid To',
    description: 'Seller pays freight to named destination',
    category: 'any',
  },
  {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    description: 'Seller pays freight and insurance to destination',
    category: 'any',
  },
  {
    code: 'DAP',
    name: 'Delivered at Place',
    description: 'Seller delivers to named place, ready for unloading',
    category: 'any',
  },
  {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    description: 'Seller delivers and unloads at destination',
    category: 'any',
  },
  {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    description: 'Seller delivers cleared goods at destination',
    category: 'any',
  },
]

export const getIncotermsForMode = (
  transportMode: 'FCL' | 'LCL' | 'AIR'
): IncotermsInfo[] => {
  if (transportMode === 'AIR') {
    return INCOTERMS_LIST.filter((i) => i.category === 'any')
  }
  return INCOTERMS_LIST
}
