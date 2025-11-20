import { useQuery, useMutation, useQueryCache } from '@pinia/colada'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { api } from '@/api/fetchInstance'
import type { Product } from '@/types/product'
import { PRODUCT_KEYS } from '@/queries/products.keys'
import { allProductsQuery, productByIdQuery } from '@/queries/products.queries'

// Query: Fetch all products (using query options)
export function useProducts() {
	return useQuery(allProductsQuery)
}

// Query: Fetch single product (using query options with params)
export function useProduct(id: MaybeRefOrGetter<number>) {
	return useQuery({
		key: () => {
			const productId = toValue(id)
			return PRODUCT_KEYS.byId(productId)
		},
		query: async () => {
			const productId = toValue(id)
			const coreFields = await api.get<Product>(`/objects/products/${productId}`)
			const userfields = await api.get<Record<string, any>>(`/userfields/products/${productId}`)
			return { ...coreFields, userfields }
		},
		enabled: () => Boolean(toValue(id)),
		staleTime: 1000 * 60 * 5,
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
			// Invalidate all products list to refetch
			queryCache.invalidateQueries({ key: PRODUCT_KEYS.all() })
		},
	})
}

// Mutation: Update product core fields WITH OPTIMISTIC UPDATE
export function useUpdateProductCoreFields(id: MaybeRefOrGetter<number>) {
	const queryCache = useQueryCache()
	
	return useMutation({
		mutation: (product: Product) => {
			const productId = toValue(id)
			const { userfields, ...coreFields } = product
			return api.put<Product>(`/objects/products/${productId}`, coreFields)
		},
		
		// OPTIMISTIC UPDATE: Update UI immediately before server responds
		onMutate: async (updatedProduct) => {
			const productId = toValue(id)
			
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryCache.cancelQueries({ key: PRODUCT_KEYS.byId(productId) })
			
			// Snapshot the previous value
			const previousProduct = queryCache.getQueryData<Product>(PRODUCT_KEYS.byId(productId))
			
			// Optimistically update the cache
			if (previousProduct) {
				queryCache.setQueryData(PRODUCT_KEYS.byId(productId), {
					...previousProduct,
					...updatedProduct,
				})
			}
			
			// Return context with the previous value
			return { previousProduct }
		},
		
		// If mutation fails, rollback to previous value
		onError: (error, variables, context) => {
			const productId = toValue(id)
			if (context?.previousProduct) {
				queryCache.setQueryData(PRODUCT_KEYS.byId(productId), context.previousProduct)
			}
		},
		
		// Always refetch after mutation settles (success or error)
		onSettled: () => {
			const productId = toValue(id)
			queryCache.invalidateQueries({ key: PRODUCT_KEYS.byId(productId) })
			queryCache.invalidateQueries({ key: PRODUCT_KEYS.all() })
		},
	})
}

// Mutation: Update product userfields WITH OPTIMISTIC UPDATE
export function useUpdateProductUserfields(id: MaybeRefOrGetter<number>) {
	const queryCache = useQueryCache()
	
	return useMutation({
		mutation: (userfields: Record<string, any>) => {
			const productId = toValue(id)
			return api.put(`/userfields/products/${productId}`, userfields)
		},
		
		// OPTIMISTIC UPDATE: Update userfields immediately
		onMutate: async (newUserfields) => {
			const productId = toValue(id)
			
			await queryCache.cancelQueries({ key: PRODUCT_KEYS.byId(productId) })
			
			const previousProduct = queryCache.getQueryData<Product>(PRODUCT_KEYS.byId(productId))
			
			if (previousProduct) {
				queryCache.setQueryData(PRODUCT_KEYS.byId(productId), {
					...previousProduct,
					userfields: newUserfields,
				})
			}
			
			return { previousProduct }
		},
		
		onError: (error, variables, context) => {
			const productId = toValue(id)
			if (context?.previousProduct) {
				queryCache.setQueryData(PRODUCT_KEYS.byId(productId), context.previousProduct)
			}
		},
		
		onSettled: () => {
			const productId = toValue(id)
			queryCache.invalidateQueries({ key: PRODUCT_KEYS.byId(productId) })
		},
	})
}

// Mutation: Delete product WITH OPTIMISTIC UPDATE
export function useDeleteProduct() {
	const queryCache = useQueryCache()
	
	return useMutation({
		mutation: (id: number) => api.delete(`/objects/products/${id}`),
		
		// OPTIMISTIC UPDATE: Remove from list immediately
		onMutate: async (deletedId) => {
			await queryCache.cancelQueries({ key: PRODUCT_KEYS.all() })
			
			const previousProducts = queryCache.getQueryData<Product[]>(PRODUCT_KEYS.all())
			
			// Optimistically remove the product from the list
			if (previousProducts) {
				queryCache.setQueryData(
					PRODUCT_KEYS.all(),
					previousProducts.filter(p => p.id !== deletedId)
				)
			}
			
			return { previousProducts }
		},
		
		onError: (error, variables, context) => {
			// Rollback on error
			if (context?.previousProducts) {
				queryCache.setQueryData(PRODUCT_KEYS.all(), context.previousProducts)
			}
		},
		
		onSettled: (_, __, deletedId) => {
			// Refetch to ensure consistency
			queryCache.invalidateQueries({ key: PRODUCT_KEYS.all() })
			queryCache.invalidateQueries({ key: PRODUCT_KEYS.byId(deletedId) })
		},
	})
}