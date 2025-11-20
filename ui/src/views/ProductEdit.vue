<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProduct, useUpdateProductCoreFields, useUpdateProductUserfields } from '@/composables/useProducts'
import { useLocations, useProductGroups, useQuantityUnits } from '@/composables/useReferenceData'

const router = useRouter()
const route = useRoute()

// Get product ID from route params
const productId = computed(() => Number(route.params.id))

// Fetch single product
const { data: product, isLoading: isLoadingProduct, error } = useProduct(productId)

// Fetch reference data (cached with 30 min staleTime)
const { data: locations, isLoading: isLoadingLocations } = useLocations()
const { data: productGroups, isLoading: isLoadingGroups } = useProductGroups()
const { data: quantityUnits, isLoading: isLoadingUnits } = useQuantityUnits()

// Combined loading state
const isLoading = computed(() => 
  isLoadingProduct.value || isLoadingLocations.value || 
  isLoadingGroups.value || isLoadingUnits.value
)

// Get mutation functions (with optimistic updates!)
const updateCoreFields = useUpdateProductCoreFields(productId)
const updateUserfields = useUpdateProductUserfields(productId)

function navigateBack() {
  router.push({ name: 'products' })
}

async function handleSave() {
  if (!product.value) return
  
  try {
    // Update core fields (UI updates immediately due to optimistic update)
    await updateCoreFields.mutateAsync(product.value)
    
    // Update userfields if they exist
    if (product.value.userfields) {
      await updateUserfields.mutateAsync(product.value.userfields)
    }
    
    // Navigate back to products list
    navigateBack()
  } catch (error) {
    console.error('Failed to update product:', error)
    // Optimistic update will be rolled back automatically
  }
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button class="btn btn-ghost btn-circle" @click="navigateBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-3xl font-bold">Edit Product</h1>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error loading product: {{ error.message }}</span>
    </div>

    <!-- Form -->
    <div v-else-if="product" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <form @submit.prevent="handleSave" class="space-y-6">
          <!-- Name field -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-semibold">Product Name</span>
              <span class="label-text-alt text-error">Required</span>
            </div>
            <input
              v-model="product.name"
              type="text"
              placeholder="Enter product name"
              class="input input-bordered w-full"
              required
            />
          </label>

          <!-- Description field -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-semibold">Description</span>
            </div>
            <textarea
              v-model="product.description"
              placeholder="Enter product description"
              class="textarea textarea-bordered h-24"
              rows="3"
            ></textarea>
            <div class="label">
              <span class="label-text-alt">Provide a detailed description</span>
            </div>
          </label>

          <!-- Product Location - Using fetched data -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-semibold">Location</span>
            </div>
            <select v-model="product.location_id" class="select select-bordered w-full">
              <option :value="null">None</option>
              <option 
                v-for="location in locations" 
                :key="location.id" 
                :value="location.id"
              >
                {{ location.name }}
              </option>
            </select>
          </label>

          <!-- Min Stock Amount & Best Before Days -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text font-semibold">Min Stock Amount</span>
              </div>
              <input
                v-model.number="product.min_stock_amount"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                class="input input-bordered w-full"
              />
            </label>

            <label class="form-control w-full">
              <div class="label">
                <span class="label-text font-semibold">Best Before Days</span>
              </div>
              <input
                v-model.number="product.default_best_before_days"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                class="input input-bordered w-full"
              />
            </label>
          </div>

          <!-- Product Group - Using fetched data -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-semibold">Product Group</span>
            </div>
            <select v-model="product.product_group_id" class="select select-bordered w-full">
              <option :value="null">None</option>
              <option 
                v-for="group in productGroups" 
                :key="group.id" 
                :value="group.id"
              >
                {{ group.name }}
              </option>
            </select>
          </label>

          <!-- Quantity Unit - Using fetched data -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-semibold">Quantity Unit</span>
            </div>
            <select v-model="product.qu_id_purchase" class="select select-bordered w-full">
              <option 
                v-for="unit in quantityUnits" 
                :key="unit.id" 
                :value="unit.id"
              >
                {{ unit.name }}
              </option>
            </select>
          </label>

          <!-- Checkboxes Section -->
          <div class="divider">Options</div>
          
          <div class="space-y-3">
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-4">
                <input
                  v-model="product.active"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                />
                <div>
                  <span class="label-text font-semibold">Active</span>
                  <p class="label-text-alt">Product is available for use</p>
                </div>
              </label>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-4">
                <input
                  v-model="product.allow_partial_units_in_stock"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                />
                <div>
                  <span class="label-text font-semibold">Allow Partial Units in Stock</span>
                  <p class="label-text-alt">Enable fractional quantities</p>
                </div>
              </label>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-4">
                <input
                  v-model="product.enable_tare_weight_handling"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                />
                <div>
                  <span class="label-text font-semibold">Enable Tare Weight Handling</span>
                  <p class="label-text-alt">Account for container weight</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Tare Weight (conditional) -->
          <label
            v-if="product.enable_tare_weight_handling"
            class="form-control w-full"
          >
            <div class="label">
              <span class="label-text font-semibold">Tare Weight</span>
            </div>
            <input
              v-model.number="product.tare_weight"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="input input-bordered w-full"
            />
          </label>

          <!-- Barcode -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-semibold">Barcode</span>
            </div>
            <input
              v-model="product.barcode"
              type="text"
              placeholder="Enter barcode"
              class="input input-bordered w-full font-mono"
            />
          </label>

          <!-- User Fields Section -->
          <template v-if="product.userfields && Object.keys(product.userfields).length > 0">
            <div class="divider">Custom Fields</div>
            
            <div class="space-y-4">
              <div
                v-for="(value, key) in product.userfields"
                :key="key"
                class="form-control w-full"
              >
                <div class="label">
                  <span class="label-text font-semibold capitalize">
                    {{ String(key).replace(/_/g, ' ') }}
                  </span>
                </div>
                <input
                  v-model="product.userfields[key]"
                  type="text"
                  :placeholder="`Enter ${String(key)}`"
                  class="input input-bordered w-full"
                />
              </div>
            </div>
          </template>

          <!-- Form Actions -->
          <div class="flex gap-3 justify-end pt-4">
            <button
              type="button"
              class="btn btn-ghost"
              @click="navigateBack"
              :disabled="updateCoreFields.isPending"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="updateCoreFields.isPending"
            >
              <span v-if="updateCoreFields.isPending" class="loading loading-spinner loading-sm"></span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>