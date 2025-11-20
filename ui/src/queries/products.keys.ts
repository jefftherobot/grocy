export const PRODUCT_KEYS = {
  // Root key for all products
  root: ['products'] as const,
  
  // List of all products
  all: () => [...PRODUCT_KEYS.root] as const,
  
  // Single product by ID (includes userfields)
  byId: (id: number) => [...PRODUCT_KEYS.root, id] as const,
  
  // You can add more specific keys as needed
  // e.g., filtered, paginated, etc.
  filtered: (filters: Record<string, any>) => 
    [...PRODUCT_KEYS.root, 'filtered', filters] as const,
}