

import { match } from 'ts-pattern'

import { Stepper } from '@/components/common/Stepper'
import { BasicInfoStep } from '@/components/quote/BasicInfoStep'
import { CargoDetailStep } from '@/components/quote/CargoDetailStep'
import { OptionsStep } from '@/components/quote/OptionsStep'
import { ResultStep } from '@/components/quote/ResultStep'
import { useQuoteForm } from '@/models/quote/useQuoteForm'

export function QuoteForm() {
  const {
    form,
    cargoTable,
    stepper,
    transportMode,
    handleTransportModeChange,
    onSubmit,
    resetForm,
  } = useQuoteForm()

  const currentStep = match(stepper.currentStep)
    .with('basic', () => (
      <BasicInfoStep
        form={form}
        transportMode={transportMode}
        onTransportModeChange={handleTransportModeChange}
        onNext={stepper.nextStep}
      />
    ))
    .with('cargo', () => (
      <CargoDetailStep
        form={form}
        cargo={cargoTable.cargo}
        transportMode={transportMode}
        calculatedRows={cargoTable.calculatedRows}
        summary={cargoTable.summary}
        onAddRow={cargoTable.addRow}
        onRemoveRow={cargoTable.removeRow}
        onPrev={stepper.prevStep}
        onNext={stepper.nextStep}
      />
    ))
    .with('options', () => (
      <OptionsStep
        form={form}
        onPrev={stepper.prevStep}
        onNext={stepper.nextStep}
      />
    ))
    .with('result', () => (
      <ResultStep
        form={form}
        summary={cargoTable.summary}
        transportMode={transportMode}
        onPrev={stepper.prevStep}
        onSubmit={onSubmit}
        onReset={resetForm}
      />
    ))
    .exhaustive()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Freight Quote Calculator</h1>
        <p className="text-muted-foreground">
          Calculate shipping rates for FCL, LCL, and Air freight
        </p>
      </div>

      <Stepper currentStepIndex={stepper.currentStepIndex} />

      <form onSubmit={(e) => e.preventDefault()}>{currentStep}</form>
    </div>
  )
}
