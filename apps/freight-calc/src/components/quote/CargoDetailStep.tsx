

import { CargoTable } from '@/components/cargo/CargoTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuoteFormType } from '@/models/quote/useQuoteForm'
import type { CargoItem } from '@/schemas/quote-form.schema'
import type { CargoSummary, TransportMode } from '@/types/cargo'

interface CalculatedRow {
  index: number
  cbm: number
  vwt?: number
  cwt?: number
}

interface CargoDetailStepProps {
  form: QuoteFormType
  cargo: CargoItem[]
  transportMode: TransportMode
  calculatedRows: CalculatedRow[]
  summary: CargoSummary
  onAddRow: () => void
  onRemoveRow: (index: number) => void
  onPrev: () => void
  onNext: () => Promise<boolean>
}

export function CargoDetailStep({
  form,
  cargo,
  transportMode,
  calculatedRows,
  summary,
  onAddRow,
  onRemoveRow,
  onPrev,
  onNext,
}: CargoDetailStepProps) {
  const handleNext = async () => {
    if (cargo.length === 0) {
      return
    }

    await onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargo Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CargoTable
            form={form}
            cargo={cargo}
            transportMode={transportMode}
            calculatedRows={calculatedRows}
            summary={summary}
            onAddRow={onAddRow}
            onRemoveRow={onRemoveRow}
          />

          {cargo.length === 0 && (
            <p className="text-sm text-destructive">
              At least 1 cargo item is required
            </p>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <Button type="button" onClick={handleNext}>
              Next: Options
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
