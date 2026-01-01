import type { TransportMode } from '@/types/cargo'

/**
 * Format CBM value based on transport mode
 * - LCL: 3 decimal places
 * - AIR: 6 decimal places
 * - FCL: 2 decimal places
 */
export function formatCBM(cbm: number, mode: TransportMode): string {
  switch (mode) {
    case 'LCL':
      return cbm.toFixed(3)
    case 'AIR':
      return cbm.toFixed(6)
    case 'FCL':
      return cbm.toFixed(2)
  }
}

/**
 * Format weight value with unit
 */
export function formatWeight(weight: number, unit: 'KG' | 'LBS' = 'KG'): string {
  return `${weight.toFixed(1)} ${unit}`
}

/**
 * Format dimension value
 */
export function formatDimension(
  length: number,
  width: number,
  height: number,
  unit: 'CM' | 'INCH' = 'CM'
): string {
  return `${length} x ${width} x ${height} ${unit}`
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format container type for display
 */
export function formatContainerType(
  type: '20DRY' | '40DRY' | '40HC' | '20RF' | '40RF'
): string {
  const labels: Record<string, string> = {
    '20DRY': "20' Dry",
    '40DRY': "40' Dry",
    '40HC': "40' High Cube",
    '20RF': "20' Reefer",
    '40RF': "40' Reefer",
  }
  return labels[type] ?? type
}

/**
 * Format transport mode for display
 */
export function formatTransportMode(mode: TransportMode): string {
  const labels: Record<TransportMode, string> = {
    FCL: 'FCL (Full Container Load)',
    LCL: 'LCL (Less Container Load)',
    AIR: 'Air Freight',
  }
  return labels[mode]
}
