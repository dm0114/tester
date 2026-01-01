import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useForm } from '@tanstack/react-form'

import { CargoTable } from './CargoTable'
import type { CargoItem } from '@/schemas/quote-form.schema'
import type { CargoSummary, TransportMode } from '@/types/cargo'

// Sample data for stories
const sampleLCLCargo: CargoItem[] = [
  {
    id: '1',
    description: 'Sample Cargo',
    length: 100,
    width: 50,
    height: 30,
    packages: 10,
    grossWeight: 500,
    unit: 'CM',
  },
]

const sampleFCLCargo: CargoItem[] = [
  {
    id: '1',
    description: 'Container 1',
    containerType: '40HC',
    quantity: 2,
    packages: 2,
    grossWeight: 20000,
  },
]

const sampleAirCargo: CargoItem[] = [
  {
    id: '1',
    description: 'Air Cargo',
    length: 50,
    width: 40,
    height: 30,
    packages: 5,
    grossWeight: 100,
    unit: 'CM',
  },
]

// Wrapper component to provide form context for Storybook
function CargoTableWithForm({
  transportMode,
  initialCargo,
  summary,
  calculatedRows,
}: {
  transportMode: TransportMode
  initialCargo: CargoItem[]
  summary: CargoSummary
  calculatedRows: { index: number; cbm: number; vwt?: number; cwt?: number }[]
}) {
  const form = useForm({
    defaultValues: {
      cargo: initialCargo,
    },
  })

  return (
    <CargoTable
      form={form as never}
      cargo={initialCargo}
      transportMode={transportMode}
      calculatedRows={calculatedRows}
      summary={summary}
      onAddRow={() => console.log('Add row clicked')}
      onRemoveRow={(index) => console.log('Remove row:', index)}
    />
  )
}

const meta: Meta<typeof CargoTableWithForm> = {
  title: 'Components/Cargo/CargoTable',
  component: CargoTableWithForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CargoTableWithForm>

export const LCL: Story = {
  args: {
    transportMode: 'LCL',
    initialCargo: sampleLCLCargo,
    calculatedRows: [{ index: 0, cbm: 0.15 }],
    summary: {
      totalCBM: 0.15,
      totalWeight: 500,
      totalPackages: 10,
    },
  },
}

export const FCL: Story = {
  args: {
    transportMode: 'FCL',
    initialCargo: sampleFCLCargo,
    calculatedRows: [{ index: 0, cbm: 152 }],
    summary: {
      totalCBM: 152,
      totalWeight: 20000,
      totalPackages: 2,
    },
  },
}

export const Air: Story = {
  args: {
    transportMode: 'AIR',
    initialCargo: sampleAirCargo,
    calculatedRows: [{ index: 0, cbm: 0.06, vwt: 10, cwt: 100 }],
    summary: {
      totalCBM: 0.06,
      totalWeight: 100,
      totalPackages: 5,
    },
  },
}

export const Empty: Story = {
  args: {
    transportMode: 'LCL',
    initialCargo: [],
    calculatedRows: [],
    summary: {
      totalCBM: 0,
      totalWeight: 0,
      totalPackages: 0,
    },
  },
}

export const MultipleRows: Story = {
  args: {
    transportMode: 'LCL',
    initialCargo: [
      {
        id: '1',
        description: 'Cargo Item 1',
        length: 100,
        width: 50,
        height: 30,
        packages: 10,
        grossWeight: 500,
        unit: 'CM',
      },
      {
        id: '2',
        description: 'Cargo Item 2',
        length: 80,
        width: 60,
        height: 40,
        packages: 5,
        grossWeight: 250,
        unit: 'CM',
      },
      {
        id: '3',
        description: 'Cargo Item 3',
        length: 120,
        width: 80,
        height: 60,
        packages: 3,
        grossWeight: 750,
        unit: 'CM',
      },
    ],
    calculatedRows: [
      { index: 0, cbm: 0.15 },
      { index: 1, cbm: 0.096 },
      { index: 2, cbm: 0.1728 },
    ],
    summary: {
      totalCBM: 0.4188,
      totalWeight: 1500,
      totalPackages: 18,
    },
  },
}
