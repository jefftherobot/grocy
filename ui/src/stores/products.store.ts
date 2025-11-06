// src/store/products.store.ts
import { defineStore } from 'pinia'
import * as api from '@/api/products.api'

export const useProductsStore = defineStore('products', {
	state: () => ({
		items: [] as any[],
		loading: false,
		selected: null as any | null,
	}),

	getters: {
		byId: (state) => (id: number) => state.items.find((p) => p.id === id),
	},

	actions: {
		async load() {
			this.loading = true
			const { data } = await api.fetchProducts()
			this.items = data
			this.loading = false
		},

		async select(id: number) {
			const { data } = await api.fetchProduct(id)
			this.selected = data
		},

		async create(product: any) {
			await api.createProduct(product)
			await this.load()
		},

		async update(id: number, product: any) {
			await api.updateProduct(id, product)
			await this.load()
		},
	},
})
