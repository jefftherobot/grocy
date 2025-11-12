import { useQuery, useMutation, useQueryCache } from '@pinia/colada'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { api } from '@/api/fetchInstance'
import type { Product } from '@/types/product'

// Query: Fetch all products
export function useProducts() {
	return useQuery({
		key: ['products'],
		query: () => api.get<Product[]>('/objects/products'),
	})
}

// Query: Fetch single product with userfields
export function useProduct(id: MaybeRefOrGetter<number>) {
	return useQuery({
		key: () => ['product', toValue(id)],
		query: async () => {
			const productId = toValue(id)
			const coreFields = await api.get<Product>(`/objects/products/${productId}`)
			const userfields = await api.get<Record<string, any>>(`/userfields/products/${productId}`)
			return { ...coreFields, userfields }
		},
		enabled: () => Boolean(toValue(id)),
	})
}

// Mutation: Create product
export function useCreateProduct() {
	const queryCache = useQueryCache()

	return useMutation({
		mutation: (product: Product) => {
			const { userfields, ...coreFields } = product
			return api.post<Product>('/objects/products', coreFields)
		},
		onSuccess: () => {
			queryCache.invalidateQueries({ key: ['products'] })
		},
	})
}

// Mutation: Update product core fields
export function useUpdateProductCoreFields(id: MaybeRefOrGetter<number>) {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (product: Product) => {
      const productId = toValue(id)
      const { userfields, ...coreFields } = product
      return api.put<Product>(`/objects/products/${productId}`, coreFields)
    },
    onSuccess: () => {
      const productId = toValue(id)
      queryCache.invalidateQueries({ key: ['product', productId] })
      queryCache.invalidateQueries({ key: ['products'] })
    },
  })
}

// Mutation: Update product userfields
export function useUpdateProductUserfields(id: MaybeRefOrGetter<number>) {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (userfields: Record<string, any>) => {
      const productId = toValue(id)
      return api.put(`/userfields/products/${productId}`, userfields)
    },
    onSuccess: () => {
      const productId = toValue(id)
      queryCache.invalidateQueries({ key: ['product', productId] })
    },
  })
}

