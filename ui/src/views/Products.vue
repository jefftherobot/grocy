<script setup lang="ts">
import { ref } from 'vue'
import { useProducts } from '@/queries/useProducts'
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

<div class="overflow-x-auto">
	<div v-if="isLoading">Loading...</div>
  <table v-else class="table table-zebra">
    <!-- head -->
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Location</th>
        <th>Product Group</th>
      </tr>
    </thead>
    <tbody>
     <tr v-for="product in data" :key="product.id">
			<td>{{ product.name }}</td>
			<td>{{ product.description }}</td>
			<td></td>
			<td></td>
			<td></td>
			<td>
				<button class="btn" @click="$router.push({ name: 'ProductDetail', params: { id: product.id } })">View</button>
			</td>
			<td>
				<button class="btn" @click="$router.push({ name: 'ProductEdit', params: { id: product.id } })">Edit</button>
			</td>
			<td>
				
			</td>
		</tr>
    </tbody>
  </table>
</div>
<!-- 	-->
</template>



