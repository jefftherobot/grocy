<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useProduct } from '@/composables/useProducts'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const { data: product, isLoading } = useProduct(() => id)

function goBack() {
  router.push('/products')
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <button class="btn mb-4" @click="goBack">← Back to Products</button>

    <div v-if="isLoading">
			<div class="flex w-52 flex-col gap-4">
				<div class="skeleton h-32 w-full"></div>
				<div class="skeleton h-4 w-28"></div>
				<div class="skeleton h-4 w-full"></div>
				<div class="skeleton h-4 w-full"></div>
			</div>
		</div>

    <div v-else-if="product">
      <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
      <p class="text-gray-600 mb-4">{{ product.description }}</p>

      <div class="space-y-2">
        <p><strong>Location:</strong> {{ product.location_id ?? 'N/A' }}</p>
        <p><strong>Product Group:</strong> {{ product.product_group_id ?? 'N/A' }}</p>
        <!-- Add more fields as needed -->
      </div>

      <div class="mt-6 flex gap-4">
        <button class="btn btn-primary" @click="$router.push({ name: 'ProductEdit', params: { id } })">
          Edit Product
        </button>
      </div>
    </div>
  </div>
</template>