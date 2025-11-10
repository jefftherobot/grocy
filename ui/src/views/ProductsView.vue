<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import * as ProductApi from '@/api/products.api'
import ProductTable from '@/components/products/ProductTable.vue'
import ProductEditModal from '@/components/products/ProductEditModal.vue'

const showModal = ref(false)
const selectedProductId = ref<number | null>(null)

const { isPending, isError, data, error } = useQuery({
	queryKey: ['products'],
	queryFn: ProductApi.fetchProducts
})

function editProduct(id: number) {
  selectedProductId.value = id
  showModal.value = true
}

</script>

<template>
	<span v-if="isPending">Loading...</span>
	<span v-else-if="isError">Error: {{ error.message }}</span>
	<!-- We can assume by this point that `isSuccess === true` -->

	<ProductTable
      v-else
      :products="data ?? []"
      @edit="editProduct"
    />

    <ProductEditModal
      v-model:open="showModal"
      :productId="selectedProductId"
    />
</template>
