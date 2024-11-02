<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const router = useRouter();

const moduleSchema = z.object({
  name: z.string(),
  professor: z.string().email()
});
  
const modules = reactive([
  { name: "Module 1", professor: "prof1@exemple.fr" },
  { name: "Module 2", professor: "prof2@exemple.fr" },
  { name: "Module 3", professor: "prof3@exemple.fr" },
  { name: "Module 4", professor: "prof4@exemple.fr" },
]);

const selectedModule = ref(modules[0].name);

async function validate() {
  const module = modules.find(module => module.name === selectedModule.value);

  if (!module) {
    return;
  }

  router.push({ path: `/unanswered-questions/${module.name}` });
}
</script>

<template>
  <section class="container flex items-center justify-center h-screen-nh">
    <div class="grid gap-6 p-6 mx-auto bg-white rounded-md shadow-md w-96">
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">
          Choisissez un module
        </h1>
      </div>

      <div class="flex flex-col items-center gap-2">
        <select class="w-full p-2 mt-4 border border-gray-300 rounded-md" v-model="selectedModule" required>
          <option v-for="(module, index) in modules" :value="module.name" :key="index">{{ module.name }}</option>
        </select>
        
        <button @click="validate" class="w-full p-2 text-white bg-blue-500 rounded-md">Valider</button>
      </div>
    </div>
  </section>
</template>