<script setup lang="ts">
</script>

<template>
  <header class="fixed top-0 z-10 w-full bg-white shadow-md">
    <div class="container flex items-center h-24 gap-4">
      <div class="flex items-center justify-between flex-1 gap-10">
        <RouterLink to="/" class="text-2xl font-bold">airtable-live-reviewing</RouterLink> 
        <div class="flex items-center gap-4">
          <RouterLink to="/login" class="text-lg hover:text-blue-500">Login</RouterLink>
          <RouterLink to="/register" class="text-lg hover:text-blue-500">Register</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>