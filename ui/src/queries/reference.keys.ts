// Reference data (locations, product groups, quantity units, etc.)
// This data changes rarely, so we can cache it aggressively
export const LOCATION_KEYS = {
  root: ['locations'] as const,
  all: () => [...LOCATION_KEYS.root] as const,
  byId: (id: number) => [...LOCATION_KEYS.root, id] as const,
}

export const PRODUCT_GROUP_KEYS = {
  root: ['product-groups'] as const,
  all: () => [...PRODUCT_GROUP_KEYS.root] as const,
  byId: (id: number) => [...PRODUCT_GROUP_KEYS.root, id] as const,
}

export const QUANTITY_UNIT_KEYS = {
  root: ['quantity-units'] as const,
  all: () => [...QUANTITY_UNIT_KEYS.root] as const,
  byId: (id: number) => [...QUANTITY_UNIT_KEYS.root, id] as const,
}