<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useProduct, useUpdateProductCoreFields, useUpdateProductUserfields } from '@/queries/useProducts'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)

// Fetch single product
const { data: product, isLoading } = useProduct(() => id)

// Get mutation functions
const updateCoreFields = useUpdateProductCoreFields(() => id)
const updateUserfields = useUpdateProductUserfields(() => id)

async function handleSave() {
  if (!product.value) return

  try {
    await updateCoreFields.mutateAsync(product.value)
    if (product.value.userfields) {
      await updateUserfields.mutateAsync(product.value.userfields)
    }
    router.push('/products') // Navigate back after save
  } catch (error) {
    console.error('Failed to update product:', error)
  }
}

function cancelEdit() {
  router.push('/products')
}
</script>

<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Edit Product</h2>

    <div v-if="isLoading">Loading product...</div>

    <div v-else-if="product">
      <form @submit.prevent="handleSave" class="space-y-4">
        <input v-model="product.name" class="input w-full" placeholder="Name" />
        <textarea v-model="product.description" class="textarea w-full" placeholder="Description"></textarea>

        <div class="flex gap-4">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn" @click="cancelEdit">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>