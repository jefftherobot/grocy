import { defineQueryOptions } from '@pinia/colada'
import { api } from '@/api/fetchInstance'
import type { Product } from '@/types/product'
import { PRODUCT_KEYS } from './products.keys'

// Query: Fetch all products
export const allProductsQuery = defineQueryOptions({
  key: PRODUCT_KEYS.all,
  query: () => api.get<Product[]>('/objects/products'),
  staleTime: 1000 * 60 * 5, // 5 minutes
})

// Query: Fetch single product with userfields
export const productByIdQuery = defineQueryOptions(({ id }: { id: number }) => ({
  key: PRODUCT_KEYS.byId(id),
  query: async () => {
    const coreFields = await api.get<Product>(`/objects/products/${id}`)
    const userfields = await api.get<Record<string, any>>(`/userfields/products/${id}`)
    return { ...coreFields, userfields }
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
}))