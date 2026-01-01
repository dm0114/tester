'use client'

import { useStore } from '@tanstack/react-store'
import { useMemo } from 'react'

import { CargoCalculator } from '@/services/cargo/cargo.calculator'
import type {
  CargoItem,
  QuoteFormValues,
} from '@/schemas/quote-form.schema'
import type { CargoSummary, TransportMode } from '@/types/cargo'
import type { QuoteFormType } from '@/models/quote/useQuoteForm'

interface UseCargoTableOptions {
  form: QuoteFormType
  transportMode: TransportMode
}

interface CalculatedRow {
  index: number
  cbm: number
  vwt?: number
  cwt?: number
}

interface UseCargoTableReturn {
  cargo: CargoItem[]
  calculatedRows: CalculatedRow[]
  summary: CargoSummary
  addRow: () => void
  removeRow: (index: number) => void
}

const generateId = () => crypto.randomUUID()

export function useCargoTable({
  form,
  transportMode,
}: UseCargoTableOptions): UseCargoTableReturn {
  // Subscribe to cargo array changes using useStore
  const cargo = useStore(form.store, (state: { values: QuoteFormValues }) => state.values.cargo)

  // Calculate values for each row based on transport mode
  const calculatedRows = useMemo<CalculatedRow[]>(() => {
    return cargo.map((item: CargoItem, index: number) => {
      // Check if it's FCL cargo
      if ('containerType' in item && 'quantity' in item) {
        const cbm = CargoCalculator.calculateContainerCBM(
          item.containerType,
          item.quantity || 1
        )
        return { index, cbm }
      }

      // LCL or Air cargo
      if ('length' in item && 'width' in item && 'height' in item) {
        const cbm = CargoCalculator.calculateCBM(
          item.length || 0,
          item.width || 0,
          item.height || 0,
          item.packages || 1,
          transportMode as 'LCL' | 'AIR'
        )

        if (transportMode === 'AIR') {
          const vwt = CargoCalculator.calculateVWT(
            item.length || 0,
            item.width || 0,
            item.height || 0,
            item.packages || 1
          )
          const cwt = CargoCalculator.calculateCWT(item.grossWeight || 0, vwt)
          return { index, cbm, vwt, cwt }
        }

        return { index, cbm }
      }

      return { index, cbm: 0 }
    })
  }, [cargo, transportMode])

  // Calculate summary
  const summary = useMemo<CargoSummary>(() => {
    return {
      totalCBM: calculatedRows.reduce((sum: number, r: CalculatedRow) => sum + r.cbm, 0),
      totalWeight: cargo.reduce(
        (sum: number, item: CargoItem) => sum + (item.grossWeight || 0),
        0
      ),
      totalPackages: cargo.reduce(
        (sum: number, item: CargoItem) => {
          if ('quantity' in item) {
            return sum + (item.quantity || 0)
          }
          return sum + (item.packages || 0)
        },
        0
      ),
    }
  }, [calculatedRows, cargo])

  // Add a new row with default values based on transport mode
  const addRow = () => {
    const baseRow = {
      id: generateId(),
      description: '',
      packages: 1,
      grossWeight: 0,
    }

    const newCargo = [...cargo]

    if (transportMode === 'FCL') {
      newCargo.push({
        ...baseRow,
        containerType: '40HC' as const,
        quantity: 1,
      })
    } else {
      newCargo.push({
        ...baseRow,
        length: 0,
        width: 0,
        height: 0,
        unit: 'CM' as const,
      })
    }

    form.setFieldValue('cargo', newCargo)
  }

  // Remove a row by index
  const removeRow = (index: number) => {
    const newCargo = cargo.filter((_: CargoItem, i: number) => i !== index)
    form.setFieldValue('cargo', newCargo)
  }

  return {
    cargo,
    calculatedRows,
    summary,
    addRow,
    removeRow,
  }
}
