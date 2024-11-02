<script setup lang="ts">
import { reactive, ref } from 'vue';
import { z } from 'zod';

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

  console.log(module);  
}
</script>

<template>
  <section class="h-screen-nh flex justify-center items-center container">
    <div class="mx-auto grid w-96 gap-6 p-6 bg-white rounded-md shadow-md">
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">
          Choisissez un module
        </h1>
      </div>

      <div class="flex gap-2 flex-col items-center">
        <select class="w-full p-2 mt-4 border border-gray-300 rounded-md" v-model="selectedModule" required>
          <option v-for="(module, index) in modules" :value="module.name" :key="index">{{ module.name }}</option>
        </select>
        
        <button @click="validate" class="w-full p-2 bg-blue-500 text-white rounded-md">Valider</button>
      </div>
    </div>
  </section>
</template>