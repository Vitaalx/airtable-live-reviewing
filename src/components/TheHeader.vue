<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRouter, RouterLink } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function logout() {
  userStore.logoutUser();
  router.push({ path: "/login" });
}
</script>

<template>
  <header class="fixed top-0 z-10 w-full bg-white shadow-md">
    <div class="container flex items-center h-24 gap-4">
      <div class="flex items-center justify-between flex-1 gap-10">
        <RouterLink to="/" class="text-2xl font-bold">airtable-live-reviewing</RouterLink> 
        
        <div class="flex items-center gap-4">
          <template v-if="!userStore.isAuthenticated">
            <RouterLink to="/login" class="text-lg hover:text-blue-500">Se connecter</RouterLink>
          
            <RouterLink to="/register" class="text-lg hover:text-blue-500">S'inscrire</RouterLink>
          </template>
          <template v-else>  
            <span @click="logout()" class="text-lg hover:text-blue-500 hover:cursor-pointer">Se déconnecter</span>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>