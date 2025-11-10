<script setup>
import { useQuery } from '@tanstack/vue-query'
import * as ProductApi from '@/api/products.api'

const { isPending, isError, data, error } = useQuery({
	queryKey: ['products'],
	queryFn: ProductApi.fetchProducts
})
</script>

<template>
	<span v-if="isPending">Loading...</span>
	<span v-else-if="isError">Error: {{ error.message }}</span>
	<!-- We can assume by this point that `isSuccess === true` -->
	<ul v-else-if="data">
		<li v-for="product in data" :key="product.id">{{ product.name }}</li>
	</ul>
</template>
