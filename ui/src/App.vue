<template>
  <div class="flex min-h-screen bg-base-200">
    <!-- Sidebar -->
    <aside class="w-60 bg-base-100 border-r border-base-300 p-4">
      <h1 class="text-xl font-bold mb-4">
        Grocy (Vue)
      </h1>

      <nav class="flex flex-col gap-2">
        <RouterLink to="/" class="btn btn-ghost justify-start">Dashboard</RouterLink>
        <RouterLink to="/products" class="btn btn-ghost justify-start">Products</RouterLink>
        <RouterLink to="/shopping-list" class="btn btn-ghost justify-start">Shopping List</RouterLink>
        <RouterLink to="/stock" class="btn btn-ghost justify-start">Stock</RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// No script needed yet
</script>