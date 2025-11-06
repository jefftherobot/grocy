<script setup lang="ts">
import { useProductsStore } from '@/stores/products.store'
import { ref, watch } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])

const store = useProductsStore()
const form = ref({ name: '', barcode: '' })

watch(
	() => store.selected,
	(p) => {
		form.value = p ? { ...p } : { name: '', barcode: '' }
	},
)
watch(
	() => props.open,
	(o) => !o && (form.value = { name: '', barcode: '' }),
)

async function save() {
	if (store.selected) {
		await store.update(store.selected.id, form.value)
	} else {
		await store.create(form.value)
	}
	emit('update:open', false)
}
</script>

<template>
	<div v-if="open" class="modal">
		<div class="modal-box">
			<h2 class="text-lg font-bold mb-4">
				{{ store.selected ? 'Edit Product' : 'New Product' }}
			</h2>

			<label>Name</label>
			<input v-model="form.name" class="input input-bordered w-full mb-2" />

			<label>Barcode</label>
			<input v-model="form.barcode" class="input input-bordered w-full mb-4" />

			<div class="text-right">
				<button class="btn mr-2" @click="$emit('update:open', false)">Cancel</button>
				<button class="btn btn-primary" @click="save">Save</button>
			</div>
		</div>
	</div>
</template>
