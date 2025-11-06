// src/api/products.api.ts
import axios from '@/api/axiosInstance'
export interface Product {
	id?: number
	name: string
	description?: string
	product_group_id?: number
	active?: number
	location_id?: number
	shopping_location_id?: number
	qu_id_purchase?: number
	qu_id_stock?: number
	min_stock_amount?: number
	parent_product_id?: number
	calories?: number
	picture_file_name?: string
	userfields?: Record<string, any> | null
}

// Get all products
export function fetchProducts() {
	return axios.get('/objects/products')
}

/*
	userfields are in a separate table and have to be removed before updating the product
*/

// Get a single product + userfields
export async function fetchProduct(id: number) {
	const coreFieldsResp = await axios.get(`/objects/products/${id}`)
	const userfieldsResp = await axios.get(`/userfields/products/${id}`)

	return {
		data: {
			...coreFieldsResp.data,
			userfields: userfieldsResp.data ?? {},
		},
	}
}

// Create product (core fields only)
export function createProduct(data: Product) {
	const { userfields, ...corefields } = data
	return axios.post('/objects/products', corefields)
}

// Update product (core fields only)
export function updateProductCoreFields(id: number, data: Product) {
	const { userfields, ...corefields } = data
	return axios.put(`/objects/products/${id}`, corefields)
}

// Update only the userfields
export function updateProductUserfields(id: number, userfields: any) {
	return axios.put(`/userfields/products/${id}`, userfields)
}
