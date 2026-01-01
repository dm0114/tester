

import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CONTAINER_TYPES,
  CONTAINER_TYPE_LABELS,
} from '@/lib/constants/container'
import type { QuoteFormType } from '@/models/quote/useQuoteForm'
import type { CargoItem } from '@/schemas/quote-form.schema'
import type { CargoSummary, ContainerType, TransportMode } from '@/types/cargo'

interface CalculatedRow {
  index: number
  cbm: number
  vwt?: number
  cwt?: number
}

interface CargoTableProps {
  form: QuoteFormType
  cargo: CargoItem[]
  transportMode: TransportMode
  calculatedRows: CalculatedRow[]
  summary: CargoSummary
  onAddRow: () => void
  onRemoveRow: (index: number) => void
}

export function CargoTable({
  form,
  cargo,
  transportMode,
  calculatedRows,
  summary,
  onAddRow,
  onRemoveRow,
}: CargoTableProps) {
  const isFCL = transportMode === 'FCL'
  const isAir = transportMode === 'AIR'

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Cargo Details ({transportMode})
        </h3>
        <Button type="button" onClick={onAddRow} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Row
        </Button>
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="min-w-[150px]">Description</TableHead>
              {isFCL ? (
                <>
                  <TableHead className="w-[130px]">Container Type</TableHead>
                  <TableHead className="w-[80px]">Qty</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="w-[80px]">L (cm)</TableHead>
                  <TableHead className="w-[80px]">W (cm)</TableHead>
                  <TableHead className="w-[80px]">H (cm)</TableHead>
                  <TableHead className="w-[80px]">Pkgs</TableHead>
                </>
              )}
              <TableHead className="w-[100px]">GWT (kg)</TableHead>
              <TableHead className="w-[90px]">CBM</TableHead>
              {isAir && (
                <>
                  <TableHead className="w-[80px]">V'WT</TableHead>
                  <TableHead className="w-[80px]">C'WT</TableHead>
                </>
              )}
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargo.map((item, index) => {
              const calculated = calculatedRows[index] || { cbm: 0 }

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>

                  {/* Description */}
                  <TableCell>
                    <form.Field name={`cargo[${index}].description`}>
                      {(field) => (
                        <Input
                          placeholder="Cargo description"
                          className="h-8"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      )}
                    </form.Field>
                  </TableCell>

                  {isFCL ? (
                    <>
                      {/* Container Type */}
                      <TableCell>
                        <form.Field name={`cargo[${index}].containerType`}>
                          {(field) => (
                            <Select
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value as ContainerType)
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {CONTAINER_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {CONTAINER_TYPE_LABELS[type]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </form.Field>
                      </TableCell>
                      {/* Quantity */}
                      <TableCell>
                        <form.Field name={`cargo[${index}].quantity`}>
                          {(field) => (
                            <Input
                              type="number"
                              min={1}
                              className="h-8"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                              onBlur={field.handleBlur}
                            />
                          )}
                        </form.Field>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      {/* Dimensions */}
                      <TableCell>
                        <form.Field name={`cargo[${index}].length`}>
                          {(field) => (
                            <Input
                              type="number"
                              min={0}
                              className="h-8"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                              onBlur={field.handleBlur}
                            />
                          )}
                        </form.Field>
                      </TableCell>
                      <TableCell>
                        <form.Field name={`cargo[${index}].width`}>
                          {(field) => (
                            <Input
                              type="number"
                              min={0}
                              className="h-8"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                              onBlur={field.handleBlur}
                            />
                          )}
                        </form.Field>
                      </TableCell>
                      <TableCell>
                        <form.Field name={`cargo[${index}].height`}>
                          {(field) => (
                            <Input
                              type="number"
                              min={0}
                              className="h-8"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                              onBlur={field.handleBlur}
                            />
                          )}
                        </form.Field>
                      </TableCell>
                      <TableCell>
                        <form.Field name={`cargo[${index}].packages`}>
                          {(field) => (
                            <Input
                              type="number"
                              min={1}
                              className="h-8"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                              onBlur={field.handleBlur}
                            />
                          )}
                        </form.Field>
                      </TableCell>
                    </>
                  )}

                  {/* Gross Weight */}
                  <TableCell>
                    <form.Field name={`cargo[${index}].grossWeight`}>
                      {(field) => (
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          className="h-8"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          onBlur={field.handleBlur}
                        />
                      )}
                    </form.Field>
                  </TableCell>

                  {/* Calculated CBM */}
                  <TableCell className="text-right font-mono">
                    {calculated.cbm.toFixed(3)}
                  </TableCell>

                  {/* Air-specific calculated values */}
                  {isAir && (
                    <>
                      <TableCell className="text-right font-mono">
                        {calculated.vwt?.toFixed(1) || '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {calculated.cwt?.toFixed(1) || '-'}
                      </TableCell>
                    </>
                  )}

                  {/* Delete button */}
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveRow(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}

            {cargo.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isFCL ? 7 : isAir ? 11 : 9}
                  className="h-24 text-center text-muted-foreground"
                >
                  No cargo items. Click "Add Row" to add cargo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Row */}
      {cargo.length > 0 && (
        <div className="flex justify-end gap-6 p-4 bg-muted rounded-lg">
          <div>
            <span className="text-sm text-muted-foreground">Total CBM:</span>{' '}
            <span className="font-bold">{summary.totalCBM.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Total Weight:</span>{' '}
            <span className="font-bold">{summary.totalWeight.toFixed(1)} kg</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              {isFCL ? 'Total Containers' : 'Total Packages'}:
            </span>{' '}
            <span className="font-bold">{summary.totalPackages}</span>
          </div>
        </div>
      )}
    </div>
  )
}
