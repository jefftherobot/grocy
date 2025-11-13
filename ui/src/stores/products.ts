// stores/products.ts
import { defineStore } from 'pinia'
import type { Product } from '@/types/product'

interface ProductsState {
	products: Product[]
}

export const useProductsStore = defineStore('products', {
	state: (): ProductsState => ({
		products: [],
	}),
	actions: {
		setProducts(products: Product[]) {
			this.products = products
		},
		addProduct(product: Product) {
			this.products.push(product)
		},
		updateProduct(updated: Product) {
			const index = this.products.findIndex(p => p.id === updated.id)
			if (index !== -1) {
				this.products[index] = updated
			}
		},
		removeProduct(id: number) {
			this.products = this.products.filter(p => p.id !== id)
		},
	},
	getters: {
		getById: (state) => {
			return (id: number) => state.products.find(p => p.id === id)
		}
	}
})
