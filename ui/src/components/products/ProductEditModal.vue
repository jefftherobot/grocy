<script setup lang="ts">
	import { useProduct, useUpdateProductCoreFields, useUpdateProductUserfields } from '@/queries/useProducts'

	const props = defineProps<{
		id: number | null
	}>()

	const emit = defineEmits<{
		close: []
	}>()

	// Fetch single product
	const { data: product, isLoading } = useProduct(() => props.id ?? 0)

	// Get mutation functions
	const updateCoreFields = useUpdateProductCoreFields(() => props.id ?? 0)
	const updateUserfields = useUpdateProductUserfields(() => props.id ?? 0)

	async function handleSave() {
		if (!product.value) return

		try {
			// Update core fields
			await updateCoreFields.mutateAsync(product.value)

			// Update userfields if they exist
			if (product.value.userfields) {
				await updateUserfields.mutateAsync(product.value.userfields)
			}

			emit('close')
		} catch (error) {
			console.error('Failed to update product:', error)
		}
	}
</script>

<template>

<div class="modal-box">
    <div v-if="isLoading">Loading product...</div>

			<div v-else-if="product">
				<h3 class="text-lg font-bold">Edit Product</h3>

				<form @submit.prevent="handleSave">
					<input v-model="product.name" class="input" placeholder="Name" />
					<input v-model="product.description" class="textarea" placeholder="Description" />

					<div class="actions">
						<button type="submit" class="btn">Save</button>
					</div>
				</form>
			</div>
    <div class="modal-action">
       <button class="btn" @click="emit('close')">Cancel</button>
    </div>
  </div>
</template>
