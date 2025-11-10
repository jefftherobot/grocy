<script setup>
import { useQuery } from '@tanstack/vue-query'
import * as ProductApi from '@/api/products.api'
import ProductTable from '@/components/products/ProductTable.vue'

const { isPending, isError, data, error } = useQuery({
	queryKey: ['products'],
	queryFn: ProductApi.fetchProducts
})
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
</template>
