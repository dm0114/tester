

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuoteFormType } from '@/models/quote/useQuoteForm'
import type { CargoSummary, TransportMode } from '@/types/cargo'

interface ResultStepProps {
  form: QuoteFormType
  summary: CargoSummary
  transportMode: TransportMode
  onPrev: () => void
  onSubmit: () => void
  onReset: () => void
}

export function ResultStep({
  form,
  summary,
  transportMode,
  onPrev,
  onSubmit,
  onReset,
}: ResultStepProps) {
  const values = form.state.values

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Info Summary */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-medium">Shipment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Bound:</span>{' '}
                <span className="font-medium">{values.bound}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mode:</span>{' '}
                <span className="font-medium">{transportMode}</span>
              </div>
              <div>
                <span className="text-muted-foreground">POL:</span>{' '}
                <span className="font-medium">
                  {values.pol?.code} - {values.pol?.name}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">POD:</span>{' '}
                <span className="font-medium">
                  {values.pod?.code} - {values.pod?.name}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Incoterms:</span>{' '}
                <span className="font-medium">{values.incoterms}</span>
              </div>
            </div>
          </div>

          {/* Cargo Summary */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-medium">Cargo Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {summary.totalCBM.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">Total CBM</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {summary.totalWeight.toFixed(1)} kg
                </div>
                <div className="text-sm text-muted-foreground">Total Weight</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{summary.totalPackages}</div>
                <div className="text-sm text-muted-foreground">
                  {transportMode === 'FCL' ? 'Containers' : 'Packages'}
                </div>
              </div>
            </div>
          </div>

          {/* Options Summary */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-medium">Selected Services</h3>
            <div className="flex flex-wrap gap-2">
              {values.options?.customsService && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                  Customs Clearance
                </span>
              )}
              {values.options?.insurance && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                  Cargo Insurance
                </span>
              )}
              {!values.options?.customsService && !values.options?.insurance && (
                <span className="text-sm text-muted-foreground">
                  No additional services selected
                </span>
              )}
            </div>
            {values.options?.etd && (
              <div className="text-sm">
                <span className="text-muted-foreground">ETD:</span>{' '}
                {values.options.etd}
              </div>
            )}
            {values.options?.eta && (
              <div className="text-sm">
                <span className="text-muted-foreground">ETA:</span>{' '}
                {values.options.eta}
              </div>
            )}
            {values.options?.specialRequests && (
              <div className="text-sm">
                <span className="text-muted-foreground">Notes:</span>{' '}
                {values.options.specialRequests}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onReset}>
                Start New Quote
              </Button>
              <Button type="button" onClick={onSubmit}>
                Submit Quote
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
