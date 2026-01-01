'use client'

import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { useCallback, useMemo } from 'react'

import { useCargoTable } from '@/models/cargo/useCargoTable'
import { useStepForm } from '@/models/common/useStepForm'
import {
  DEFAULT_QUOTE_FORM_VALUES,
  type QuoteFormValues,
} from '@/schemas/quote-form.schema'
import type { TransportMode } from '@/types/cargo'
import type { QuoteFormStep } from '@/types/quote'

const QUOTE_FORM_STEPS: QuoteFormStep['id'][] = [
  'basic',
  'cargo',
  'options',
  'result',
]

export function useQuoteForm() {
  // Initialize TanStack Form
  const form = useForm({
    defaultValues: DEFAULT_QUOTE_FORM_VALUES,
    onSubmit: async ({ value }) => {
      // eslint-disable-next-line no-console
      console.log('Quote submitted:', value)
      return value
    },
  })

  // Watch transport mode for conditional rendering using useStore
  const transportMode = useStore(
    form.store,
    (state: { values: QuoteFormValues }) => state.values.transportMode
  ) as TransportMode

  // Hook Composition: Cargo table management
  const cargoTable = useCargoTable({
    form,
    transportMode,
  })

  // Step validation functions
  const validateBasicStep = useCallback(async (): Promise<boolean> => {
    const values = form.state.values

    // Check required fields
    if (!values.pol?.code || !values.pol?.name) {
      return false
    }
    if (!values.pod?.code || !values.pod?.name) {
      return false
    }

    return true
  }, [form])

  const validateCargoStep = useCallback(async (): Promise<boolean> => {
    const values = form.state.values
    return values.cargo.length > 0
  }, [form])

  // Validation function for each step
  const validateStep = useCallback(
    async (step: QuoteFormStep['id']): Promise<boolean> => {
      switch (step) {
        case 'basic':
          return validateBasicStep()
        case 'cargo':
          return validateCargoStep()
        case 'options':
          return true // Options are all optional
        default:
          return true
      }
    },
    [validateBasicStep, validateCargoStep]
  )

  // Hook Composition: Multi-step form control
  const stepper = useStepForm({
    steps: QUOTE_FORM_STEPS,
    validateStep,
  })

  // Handle transport mode change - clear cargo when mode changes
  const handleTransportModeChange = useCallback(
    (mode: TransportMode) => {
      form.setFieldValue('transportMode', mode)
      form.setFieldValue('cargo', []) // Clear cargo when changing transport mode
    },
    [form]
  )

  // Form submission
  const onSubmit = useMemo(
    () => () => form.handleSubmit(),
    [form]
  )

  // Reset form to initial state
  const resetForm = useCallback(() => {
    form.reset()
    stepper.reset()
  }, [form, stepper])

  // Get current form values
  const getValues = useCallback(
    (): QuoteFormValues => form.state.values,
    [form]
  )

  return {
    form,
    cargoTable,
    stepper,
    transportMode,
    handleTransportModeChange,
    onSubmit,
    resetForm,
    getValues,
  }
}

// Export the form type for use in components
export type QuoteFormType = ReturnType<typeof useQuoteForm>['form']
