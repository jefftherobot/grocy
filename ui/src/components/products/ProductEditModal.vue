<script setup lang="ts">
import { useProductsStore } from '@/stores/products.store'
import { ref, watch } from 'vue'
import type { Product } from '@/api/products.api'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])

const store = useProductsStore()

// Full product form model
const emptyProduct: Product = {
	name: '',
	active: 1,
	userfields: {},
}

const form = ref<Product>({ ...emptyProduct })

// Fill form whenever a product is selected
watch(
	() => store.selected,
	(p) => {
		form.value = p ? JSON.parse(JSON.stringify(p)) : { ...emptyProduct }
	},
	{ immediate: true },
)

// Reset form whenever modal closes
watch(
	() => props.open,
	(o) => !o && (form.value = { ...emptyProduct }),
)

// --- Save Function ---
async function save() {
	await store.save(form.value)
	emit('update:open', false)
}
</script>

<template>
	<div v-if="open" class="modal">
		<div class="modal-box">
			<h2 class="text-lg font-bold mb-4">
				{{ store.selected ? 'Edit Product' : 'New Product' }}
			</h2>

			<!-- Name -->
			<label class="label"><span class="label-text">Name</span></label>
			<input v-model="form.name" class="input input-bordered w-full mb-2" />

			<!-- Description -->
			<label class="label"><span class="label-text">Description</span></label>
			<input v-model="form.description" class="input input-bordered w-full mb-2" />

			<div class="text-right">
				<button class="btn mr-2" @click="$emit('update:open', false)">Cancel</button>
				<button class="btn btn-primary" @click="save">Save</button>
			</div>
		</div>
	</div>
</template>
