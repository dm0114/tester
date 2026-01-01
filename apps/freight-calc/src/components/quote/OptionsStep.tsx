

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { QuoteFormType } from '@/models/quote/useQuoteForm'

interface OptionsStepProps {
  form: QuoteFormType
  onPrev: () => void
  onNext: () => Promise<boolean>
}

export function OptionsStep({ form, onPrev, onNext }: OptionsStepProps) {
  const handleNext = async () => {
    await onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Service Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Services</h3>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="options.customsService">
                {(field) => (
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Customs Clearance</Label>
                      <p className="text-sm text-muted-foreground">
                        Include customs clearance service
                      </p>
                    </div>
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="options.insurance">
                {(field) => (
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Cargo Insurance</Label>
                      <p className="text-sm text-muted-foreground">
                        Include cargo insurance
                      </p>
                    </div>
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="options.etd">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Expected ETD</Label>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="options.eta">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Expected ETA</Label>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Special Requests */}
          <form.Field name="options.specialRequests">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Special Requests</Label>
                <Textarea
                  id={field.name}
                  placeholder="Enter any special requirements or notes..."
                  className="min-h-[100px]"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <Button type="button" onClick={handleNext}>
              Review Quote
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
