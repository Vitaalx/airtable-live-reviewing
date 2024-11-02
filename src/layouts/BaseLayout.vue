<script lang="ts" setup>
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

</script>
<template>
    <TheHeader />

    <main class=" min-h-screen-nh mt-24 bg-gray-100">
        <RouterView />
    </main>

    <TheFooter />
</template>