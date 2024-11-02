<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div
		ref="container"
		class="w-full h-full overflow-auto"
	>
		<RouterView />
	</div>
</template>

<style scoped>
</style>
