<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useLocations, useProductGroups } from '@/composables/useReferenceData'

const router = useRouter()

// Fetch all products using Pinia Colada
const { data: products, isLoading: isLoadingProducts, error } = useProducts()

// Fetch reference data for displaying names
const { data: locations, isLoading: isLoadingLocations } = useLocations()
const { data: productGroups, isLoading: isLoadingGroups } = useProductGroups()

// Combined loading state
const isLoading = computed(() => 
  isLoadingProducts.value || isLoadingLocations.value || isLoadingGroups.value
)

// Helper function to get location name by ID
function getLocationName(locationId: number | null) {
  if (!locationId || !locations.value) return '—'
  const location = locations.value.find(loc => loc.id === locationId)
  return location?.name || '—'
}

// Helper function to get product group name by ID
function getProductGroupName(groupId: number | null) {
  if (!groupId || !productGroups.value) return '—'
  const group = productGroups.value.find(g => g.id === groupId)
  return group?.name || '—'
}

function navigateToEdit(productId: number) {
  router.push({ name: 'ProductEdit', params: { id: productId } })
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Products</h1>
      <button class="btn btn-primary">
        Add Product
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error loading products: {{ error.message }}</span>
    </div>

    <!-- Products table -->
    <div v-else class="overflow-x-auto">
      <table class="table table-sm table-zebra">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Product Group</th>
            <th>Min Stock</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td class="font-medium">{{ product.name }}</td>
            <td>{{ getLocationName(product.location_id) }}</td>
            <td>{{ getProductGroupName(product.product_group_id) }}</td>
						 <td>{{ product.min_stock_amount || 0 }}</td>
            <td>
              <span 
                :class="product.active ? 'badge badge-success' : 'badge badge-ghost'"
              >
                {{ product.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button 
                class="btn btn-sm btn-ghost"
                @click="navigateToEdit(product.id)"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="products?.length === 0" class="text-center py-12">
        <p class="text-gray-500">No products found</p>
      </div>
    </div>
  </div>
</template>