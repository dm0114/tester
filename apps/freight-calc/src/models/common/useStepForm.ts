'use client'

import { useCallback, useState } from 'react'

interface UseStepFormOptions<T extends string> {
  steps: T[]
  initialStep?: T
  validateStep?: (step: T) => Promise<boolean> | boolean
}

interface UseStepFormReturn<T extends string> {
  currentStep: T
  currentStepIndex: number
  steps: T[]
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  goToStep: (step: T) => void
  goToStepByIndex: (index: number) => void
  nextStep: () => Promise<boolean>
  prevStep: () => void
  reset: () => void
}

export function useStepForm<T extends string>({
  steps,
  initialStep,
  validateStep,
}: UseStepFormOptions<T>): UseStepFormReturn<T> {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialStep ? steps.indexOf(initialStep) : 0
  )

  const currentStep = steps[currentStepIndex]
  const totalSteps = steps.length
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === totalSteps - 1

  const goToStep = useCallback(
    (step: T) => {
      const index = steps.indexOf(step)
      if (index !== -1) {
        setCurrentStepIndex(index)
      }
    },
    [steps]
  )

  const goToStepByIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        setCurrentStepIndex(index)
      }
    },
    [totalSteps]
  )

  const nextStep = useCallback(async (): Promise<boolean> => {
    if (isLastStep) return false

    if (validateStep) {
      const isValid = await validateStep(currentStep)
      if (!isValid) return false
    }

    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1))
    return true
  }, [isLastStep, validateStep, currentStep, totalSteps])

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
    }
  }, [isFirstStep])

  const reset = useCallback(() => {
    setCurrentStepIndex(initialStep ? steps.indexOf(initialStep) : 0)
  }, [initialStep, steps])

  return {
    currentStep,
    currentStepIndex,
    steps,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToStep,
    goToStepByIndex,
    nextStep,
    prevStep,
    reset,
  }
}
