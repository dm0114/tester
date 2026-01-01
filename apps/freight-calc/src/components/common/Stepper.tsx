

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { QUOTE_STEPS } from '@/types/quote'

interface StepperProps {
  currentStepIndex: number
  steps?: typeof QUOTE_STEPS
}

export function Stepper({
  currentStepIndex,
  steps = QUOTE_STEPS,
}: StepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <li key={step.id} className="relative flex-1">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-background text-primary',
                    !isCompleted &&
                      !isCurrent &&
                      'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    'mt-2 text-sm font-medium',
                    isCurrent && 'text-primary',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-5 left-1/2 w-full h-0.5',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
