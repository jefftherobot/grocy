import { defineQueryOptions } from '@pinia/colada'
import { api } from '@/api/fetchInstance'
import { LOCATION_KEYS, PRODUCT_GROUP_KEYS, QUANTITY_UNIT_KEYS } from './reference.keys'

// Types for reference data
export interface Location {
  id: number
  name: string
  description?: string
  is_freezer: boolean
}

export interface ProductGroup {
  id: number
  name: string
  description?: string
}

export interface QuantityUnit {
  id: number
  name: string
  name_plural?: string
  description?: string
}

// Query: Fetch all locations
export const allLocationsQuery = defineQueryOptions({
  key: LOCATION_KEYS.all,
  query: () => api.get<Location[]>('/objects/locations'),
  staleTime: 1000 * 60 * 30, // 30 minutes (reference data changes rarely)
})

// Query: Fetch all product groups
export const allProductGroupsQuery = defineQueryOptions({
  key: PRODUCT_GROUP_KEYS.all,
  query: () => api.get<ProductGroup[]>('/objects/product_groups'),
  staleTime: 1000 * 60 * 30, // 30 minutes
})

// Query: Fetch all quantity units
export const allQuantityUnitsQuery = defineQueryOptions({
  key: QUANTITY_UNIT_KEYS.all,
  query: () => api.get<QuantityUnit[]>('/objects/quantity_units'),
  staleTime: 1000 * 60 * 30, // 30 minutes
})