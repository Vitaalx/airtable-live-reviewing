<script setup lang="ts">
import StarsRating from '../StarsRating.vue';

interface TextAnswerProps {
  question: string;
  id: string;
}

const props = defineProps<TextAnswerProps>();
</script>

<template>
  <div class="min-h-[128px] flex flex-col gap-4 items-center">
    <span>{{ props.question }}</span>
    <StarsRating :id="props.id" />
  </div>
</template>

<style scoped>

</style>
