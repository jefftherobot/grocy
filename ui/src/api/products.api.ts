// src/api/products.api.ts
import axios from '@/api/axiosInstance'

export function fetchProducts() {
	return axios.get('/objects/products')
}

export function fetchProduct(id: number) {
	return axios.get(`/objects/products/${id}`)
}

export function createProduct(data: any) {
	return axios.post('/objects/products', data)
}

export function updateProduct(id: number, data: any) {
	return axios.put(`/objects/products/${id}`, data)
}
