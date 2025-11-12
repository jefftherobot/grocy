<script setup>
</script>
<template>
	<div>
		<aside>
			<h1>Grocy (Vue)</h1>
			<nav>
				<RouterLink to="/products">Products</RouterLink>
			</nav>
		</aside>
		<main>
			<router-view />
		</main>
	</div>
</template>
