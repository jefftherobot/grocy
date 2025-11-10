<script setup lang="ts">
import type { Product } from '@/api/products.api'

const props = defineProps<{
	products: Product[]
}>()

const emit = defineEmits<{
	edit: [id: number]
}>()
</script>

<template>
	<table>
		<tr v-for="p in products" :key="p.id">
			<td>{{ p.name }}</td>
			<td>{{ p.description }}</td>
			<td>
				<button @click="emit('edit', p.id!)">Edit</button>
			</td>
		</tr>

		<tr v-if="products.length === 0">
			<td colspan="2">No products found</td>
		</tr>
	</table>
</template>
