import { defineStore } from 'pinia'
import type { Product } from '@/api/products.api'
import * as ProductApi from '@/api/products.api'
import { runAsync } from '@/utils/runAsync'

export const useProductsStore = defineStore('products', {
	state: () => ({
		items: [] as Product[],
		selected: null as Product | null,
		loading: false,
		saving: false,
		error: null as string | null,
	}),

	actions: {
		async loadAll() {
			const resp = await runAsync(this, () => ProductApi.fetchProducts())
			this.items = resp.data
		},

		async select(id: number) {
			const resp = await runAsync(this, () => ProductApi.fetchProduct(id))
			this.selected = resp.data
		},

		clearSelected() {
			this.selected = null
		},

		async save(product: Product) {
			await runAsync(
				this,
				async () => {
					let id = product.id
					if (id) {
						await ProductApi.updateProductCoreFields(id, product)
					} else {
						const resp = await ProductApi.createProduct(product)
						id = resp.data.id
					}
					if (product.userfields) {
						await ProductApi.updateProductUserfields(id, product.userfields)
					}
					await this.loadAll()
					this.selected = null
				},
				'saving',
			)
		},
	},
})
