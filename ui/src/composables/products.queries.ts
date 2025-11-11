import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/api/fetchInstance';
import type { Product } from '@/types/product';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<Product[]>('/objects/products'),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const coreFields = await api.get<Product>(`/objects/products/${id}`);
      const userfields = await api.get<Record<string, any>>(`/userfields/products/${id}`);
      return { ...coreFields, userfields };
    },
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) => {
      const { userfields, ...coreFields } = product;
      return api.post<Product>('/objects/products', coreFields);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductCoreFields(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) => {
      const { userfields, ...coreFields } = product;
      return api.put<Product>(`/objects/products/${id}`, coreFields);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product', id] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductUserfields(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userfields: Record<string, any>) =>
      api.put(`/userfields/products/${id}`, userfields),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product', id] });
    },
  });
}