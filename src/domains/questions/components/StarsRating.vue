<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{ id: string }>();
const rating = ref<number>(0);
const emits = defineEmits();

watch(rating, (value) => {
  emits('send-rating', value);
});

const ratingText = computed(() => {
  switch (rating.value) {
    case 1:
      return 'Terrible';
    case 2:
      return 'Mauvais';
    case 3:
      return 'OK';
    case 4:
      return 'Bien';
    case 5:
      return 'Excellent';
    default:
      return '';
  }
});
</script>

<template>
  <form class="flex flex-col items-center">
    <div class="relative flex mb-2 space-x-1">
      <template v-for="i in 5" :key="i">
        <input
          :id="`${props.id}-rating-${i}`"
          type="radio"
          :value="i"
          v-model="rating"
          class="sr-only"
        />
        <label
          :for="`${props.id}-rating-${i}`"
          class="transition-transform duration-300 transform cursor-pointer hover:scale-110"
          :class="{ 'text-yellow-500': rating >= i, 'text-gray-400': rating < i }"
        >
          <svg
            class="w-8 h-8 transition duration-300 fill-current"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <polygon points="16 2 20.8 12 32 12.8 24 20 26 32 16 26 6 32 8 20 0 12.8 11.2 12" />
          </svg>
          <span class="sr-only">{{ i }} star</span>
        </label>
      </template>
    </div>
    <p v-if="rating" class="mt-2 font-medium text-center text-gray-500">
      {{ ratingText }}
    </p>
  </form>
</template>

<style scoped>
.rating__star-fill,
.rating__star-stroke,
.rating__star-line,
.rating__star-ring {
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}
.rating__star-fill {
  fill: yellow;
  transform: scale(0);
  transition: transform 0.3s ease-in-out;
}
.rating__star-stroke {
  stroke: #ccc;
  transition: stroke 0.3s ease-in-out;
}
.rating__star-ring {
  animation-name: starRing;
}
@keyframes starRing {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>