export type TransportMode = 'FCL' | 'LCL' | 'AIR'

export type Bound = 'EXPORT' | 'IMPORT'

export type ContainerType = '20DRY' | '40DRY' | '40HC' | '20RF' | '40RF'

export type DimensionUnit = 'CM' | 'INCH'

export type WeightUnit = 'KG' | 'LBS'

export interface ContainerSpec {
  cbm: number
  maxWeight: number
}

export interface BaseCargo {
  id: string
  description: string
  packages: number
  grossWeight: number
}

export interface LCLCargo extends BaseCargo {
  length: number
  width: number
  height: number
  unit: DimensionUnit
}

export interface FCLCargo extends BaseCargo {
  containerType: ContainerType
  quantity: number
}

export interface AirCargo extends LCLCargo {
  vwt?: number
  cwt?: number
}

export type Cargo = LCLCargo | FCLCargo | AirCargo

export interface CalculatedCargo {
  cbm: number
  vwt?: number
  cwt?: number
}

export interface CargoSummary {
  totalCBM: number
  totalWeight: number
  totalPackages: number
}
