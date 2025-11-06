<!-- src/views/ProductsView.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import ProductTable from '@/components/products/ProductTable.vue'
import ProductEditModal from '@/components/products/ProductEditModal.vue'

const store = useProductsStore()
const showModal = ref(false)

onMounted(() => store.loadAll())

function editProduct(productId: number) {
	store.select(productId)
	showModal.value = true
}

function newProduct() {
	store.selected = null
	showModal.value = true
}
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-4">Products</h1>

		<button class="btn btn-primary mb-4" @click="newProduct">Add Product</button>

		<ProductTable :products="store.items" @edit="editProduct" />

		<ProductEditModal v-model:open="showModal" />
	</div>
</template>
