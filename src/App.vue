<script setup>
import { useGetUsers } from './composables/users';

const { getUsers } = useGetUsers();

//Test
getUsers();
</script>

<template>
  <div>
    <h1 class="text-blue-600 text-center text-4xl">Live reviewing - Airtable</h1>
  </div>
</template>

<style scoped>
</style>
