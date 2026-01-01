import type { ContainerSpec, ContainerType } from '@/types/cargo'

export const CONTAINER_SPECS: Record<ContainerType, ContainerSpec> = {
  '20DRY': { cbm: 33, maxWeight: 21770 },
  '40DRY': { cbm: 67, maxWeight: 26480 },
  '40HC': { cbm: 76, maxWeight: 26230 },
  '20RF': { cbm: 28, maxWeight: 20500 },
  '40RF': { cbm: 60, maxWeight: 26280 },
}

export const CONTAINER_TYPE_LABELS: Record<ContainerType, string> = {
  '20DRY': "20' Dry Container",
  '40DRY': "40' Dry Container",
  '40HC': "40' High Cube",
  '20RF': "20' Reefer",
  '40RF': "40' Reefer",
}

export const CONTAINER_TYPES: ContainerType[] = [
  '20DRY',
  '40DRY',
  '40HC',
  '20RF',
  '40RF',
]
