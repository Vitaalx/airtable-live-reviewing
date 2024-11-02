<script lang="ts" setup>
import TheHeader from '../components/TheHeader.vue';
//import TheFooter from '../components/TheFooter.vue';

</script>
<template>
    <TheHeader />

    <main class="mt-24 bg-gray-100 min-h-screen-nh">
        <RouterView />
    </main>

    <TheFooter />
</template>