<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import * as ProductApi from '@/api/products.api'
import type { Product } from '@/api/products.api'

const props = defineProps<{
  open: boolean
  productId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
}>()

const queryClient = useQueryClient()

const productQuery = useQuery({
  queryKey: ['product', props.productId],
  queryFn: () => ProductApi.fetchProduct(props.productId!),
  enabled: false
})

const form = ref<Product>({
  name: '',
  description: '',
  userfields: {}
})

watch(
  () => props.productId,
  async (id) => {
    if (id != null) {
      const result = await productQuery.refetch()
      if (result.data?.data) {
        form.value = { ...result.data.data }
      }
    } else {
      // New product → reset immediately
      form.value = { name: '', description: '', userfields: {} }
    }
  },
  { immediate: true }
)

const saveMutation = useMutation({
  mutationFn: async (p: Product) => {
    let id = p.id
    if (!id) {
      const created = await ProductApi.createProduct(p)
      id = created.id
    } else {
      await ProductApi.updateProductCoreFields(id, p)
    }
    if (p.userfields) {
      await ProductApi.updateProductUserfields(id!, p.userfields)
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    emit('update:open', false)
  }
})

function save() {
  saveMutation.mutate(form.value)
}
</script>

<template>
  <div v-if="open" class="modal">
   	<div>
      <h2>{{ productId ? 'Edit Product' : 'New Product' }}</h2>
      <input v-model="form.name"/>
      <textarea v-model="form.description"></textarea>
      <div>
        <button  @click="emit('update:open', false)">Cancel</button>
        <button  @click="save">Save</button>
      </div>
    </div>
  </div>

</template>
