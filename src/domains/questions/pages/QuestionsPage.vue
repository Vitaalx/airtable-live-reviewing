<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import StarsAnswer from '../components/answers/StarsAnswer.vue';

const sections = Array.from({ length: 12 }, (_, index) => `Section ${index + 1}`);
const currentSection = ref(0);
const isScrolling = ref(false);
const sectionRefs = ref<HTMLElement[]>([]);
const touchStartY = ref(0);

function updateSectionHeights() {
  sectionRefs.value.forEach((section) => {
    section.style.height = `${window.innerHeight}px`;
  });
}

function scrollToSection(index: number) {
  if (index >= 0 && index < sections.length) {
    console.log('scrolling to section', index);
    isScrolling.value = true;
    currentSection.value = index;
    sectionRefs.value[index].scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isScrolling.value = false;
    }, 300);
  }
}

function scrollToNextSection() {
  scrollToSection(currentSection.value + 1);
}

function scrollToPreviousSection() {
  scrollToSection(currentSection.value - 1);
}

function handleScroll(event: WheelEvent) {
  if (isScrolling.value) return;

  const direction = event.deltaY > 0 ? 1 : -1;

  scrollToSection(currentSection.value + direction);
}

function handleTouchMove(event: TouchEvent) {
  if (isScrolling.value) return;

  const touchEndY = event.touches[0].clientY;
  const direction = touchStartY.value - touchEndY > 0 ? 1 : -1;

  if (Math.abs(touchStartY.value - touchEndY) > 50) {
    scrollToSection(currentSection.value + direction);
  }
}

onMounted(() => {
  window.addEventListener('resize', updateSectionHeights);
  window.addEventListener('wheel', (event) => requestAnimationFrame(() => handleScroll(event)));
  window.addEventListener('touchstart', (event) => {
    touchStartY.value = event.touches[0].clientY;
  });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleScroll);
  window.removeEventListener('touchstart', (event) => {
    touchStartY.value = event.touches[0].clientY;
  });
  window.removeEventListener('touchmove', handleTouchMove);
});
</script>

<template>
  <div class="relative h-screen-nh overflow-hidden">
    <section
      v-for="(section, index) in sections"
      :key="index"
      :class="[
        'flex items-center justify-center text-2xl border-b border-gray-300',
        index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'
      ]"
      class="h-screen"
      ref="sectionRefs"
    >
      <StarsAnswer :question="'Question ' + (index + 1)" :id="'question-' + index" />
    </section>

    <div class="fixed bottom-[calc(50vh-22px)] right-4 flex flex-col gap-2">
      <button @click="scrollToPreviousSection" class="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700">
        ▲
      </button>
      <button @click="scrollToNextSection" class="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700">
        ▼
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
