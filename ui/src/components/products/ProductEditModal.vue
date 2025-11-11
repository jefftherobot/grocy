<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProduct, useUpdateProductCoreFields } from '@/composables/products.queries';

const props = defineProps<{ id: number }>();
const emit = defineEmits(['close']);

const { data: product, isLoading } = useProduct(props.id);
const updateCore = useUpdateProductCoreFields(props.id);

// Form state
const form = ref({
  name: '',
  description: ''
});

// When data loads, populate form
watch(product, (p) => {
	if (!p) return;
  form.value.name = p.name;
  form.value.description = p.description ?? '';
  },
	{
    immediate: true,
  }
);

async function save() {
  await updateCore.mutateAsync({
    ...product.value,
    ...form.value
  });
  emit('close');
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Edit Product</h2>
      <div v-if="isLoading">Loading product...</div>
      <form v-else @submit.prevent="save">
        <label>
          Name:
          <input v-model="form.name" type="text" />
        </label>
        <label>
          Description:
          <textarea v-model="form.description"></textarea>
        </label>
        <button type="submit">Save</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  min-width: 300px;
}
</style>
