import { useQuery } from '@pinia/colada'
import { allLocationsQuery, allProductGroupsQuery, allQuantityUnitsQuery } from '@/queries/reference.queries'

// Query: Fetch all locations
export function useLocations() {
  return useQuery(allLocationsQuery)
}

// Query: Fetch all product groups
export function useProductGroups() {
  return useQuery(allProductGroupsQuery)
}

// Query: Fetch all quantity units
export function useQuantityUnits() {
  return useQuery(allQuantityUnitsQuery)
}