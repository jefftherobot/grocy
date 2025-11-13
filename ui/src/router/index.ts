import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/products',
			name: 'products',
			component: () => import('@/views/Products.vue'),
		},

		{
			path: '/products/:id',
			name: 'ProductDetail',
			component: () => import('@/views/ProductDetail.vue'),
			props: true
		},
		{
			path: '/products/:id/edit',
			name: 'ProductEdit',
			component: () => import('@/views/ProductEdit.vue'),
			props: true
		}
	],
})

export default router
