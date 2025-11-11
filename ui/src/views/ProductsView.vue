<script setup lang="ts">
import { ref } from 'vue'
import { useProducts } from '@/composables/products.queries'

const { data, isLoading } = useProducts();

const emit = defineEmits<{
	edit: [id: number]
}>()

</script>

<template>
  <div v-if="isLoading">Loading...</div>

  <ul v-else>
    <li v-for="product in data" :key="product.id">
      {{ product.name }}
    </li>
  </ul>

</template>