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
				<button class="btn" @click="openEdit(product.id ?? 0)">Edit</button>
			</td>
		</tr>
    </tbody>
  </table>
</div>

<dialog id="my_modal_1" class="modal" :class="{ 'modal-open': editingProductId }">

	<EditProductModal
		:id="editingProductId"
		@close="closeModal"
	/>
  <!-- <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click the button below to close</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  </div> -->
</dialog>
<!-- 	-->
</template>



