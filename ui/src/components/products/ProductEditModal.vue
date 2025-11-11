<script setup lang="ts">  
import { ref, watch } from 'vue';  
import { useProduct, useUpdateProductCoreFields } from '@/composables/products.queries';  
import type { Product } from '@/types/product';  
  
const props = defineProps<{  
  productId: number;  
  showModal: boolean;  
}>();  
  
const { data: productData, refetch } = useProduct(props.productId);  
const updateMutation = useUpdateProductCoreFields(props.productId);  
  
const product = ref<Product | null>(null);  
  
watch(productData, (newData) => {  
  if (newData) {  
    product.value = { ...newData };  
  }  
});  
  
function updateProduct() {  
  if (product.value) {  
    updateMutation.mutate(product.value, {  
      onSuccess: () => {  
        closeModal();  
      }  
    });  
  }  
}  
  
function closeModal() {  
  emit('close');  
}  
</script>

<template>  
  <div v-if="showModal">  
    <div class="modal-overlay" @click="closeModal"></div>  
    <div class="modal-content">  
      <form @submit.prevent="updateProduct">  
        <input v-model="product.name" placeholder="Product Name" />  
        <input v-model="product.price" type="number" placeholder="Product Price" />  
        <!-- Add other fields as necessary -->  
        <button type="submit">Update Product</button>  
        <button type="button" @click="closeModal">Cancel</button>  
      </form>  
    </div>  
  </div>  
</template>  