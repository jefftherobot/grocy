<script setup lang="ts">
import { ref } from 'vue'
import { useProducts } from '@/queries/useProducts'
import EditProductModal from '@/components/products/ProductEditModal.vue'

// Fetch all products
const { data, isLoading, error } = useProducts()

const editingProductId = ref<number | null>(null)

function openEdit(productId: number) {
  editingProductId.value = productId
}

function closeModal() {
  editingProductId.value = null
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <ul v-else>
    <li v-for="product in data" :key="product.id">
      {{ product.name }} — {{ product.description }}
      <button @click="openEdit(product.id ?? 0)">Edit</button>
    </li>
  </ul>

  <EditProductModal
    v-if="editingProductId"
    :id="editingProductId"
    @close="closeModal"
  />
</template>
