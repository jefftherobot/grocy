<script setup lang="ts">
defineProps<{ products: any[] }>()
defineEmits(['edit'])
</script>

<template>
	<table class="min-w-full border">
		<thead>
			<tr>
				<th class="p-2 text-left">Name</th>
				<th class="p-2">Barcode</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="p in products" :key="p.id" class="hover:bg-gray-50">
				<td class="p-2">{{ p.name }}</td>
				<td class="p-2">{{ p.barcode || '—' }}</td>
				<td class="p-2 text-right">
					<button class="btn btn-sm" @click="$emit('edit', p.id)">Edit</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>
