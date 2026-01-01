

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getIncotermsForMode } from '@/lib/constants/incoterms'
import type { QuoteFormType } from '@/models/quote/useQuoteForm'
import type { TransportMode } from '@/types/cargo'

interface BasicInfoStepProps {
  form: QuoteFormType
  transportMode: TransportMode
  onTransportModeChange: (mode: TransportMode) => void
  onNext: () => Promise<boolean>
}

export function BasicInfoStep({
  form,
  transportMode,
  onTransportModeChange,
  onNext,
}: BasicInfoStepProps) {
  const incotermsOptions = getIncotermsForMode(transportMode)

  const handleNext = async () => {
    await onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bound Selection */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="bound">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Bound</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as 'EXPORT' | 'IMPORT')
                    }
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select bound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXPORT">Export</SelectItem>
                      <SelectItem value="IMPORT">Import</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="transportMode">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Transport Mode</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value as TransportMode)
                      onTransportModeChange(value as TransportMode)
                    }}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCL">
                        FCL (Full Container Load)
                      </SelectItem>
                      <SelectItem value="LCL">
                        LCL (Less Container Load)
                      </SelectItem>
                      <SelectItem value="AIR">Air Freight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          {/* Port Selection */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="pol.code">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>POL (Port of Loading)</Label>
                  <Input
                    id={field.name}
                    placeholder="e.g., KRPUS"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="pol.name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>POL Name</Label>
                  <Input
                    id={field.name}
                    placeholder="e.g., Busan, Korea"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="pod.code">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>POD (Port of Discharge)</Label>
                  <Input
                    id={field.name}
                    placeholder="e.g., USLAX"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="pod.name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>POD Name</Label>
                  <Input
                    id={field.name}
                    placeholder="e.g., Los Angeles, USA"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>
          </div>

          {/* Incoterms */}
          <form.Field name="incoterms">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Incoterms</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as typeof field.state.value)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select incoterms" />
                  </SelectTrigger>
                  <SelectContent>
                    {incotermsOptions.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.code} - {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Next Button */}
          <div className="flex justify-end">
            <Button type="button" onClick={handleNext}>
              Next: Cargo Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
