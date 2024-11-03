<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import AirtableBase from '@/providers/airtable';
import { Module } from '@/types/module';

const router = useRouter();

const modules = reactive<Module[]>([]);

const selectedModule = ref("");

async function getModules() {
  try {
    const records = await AirtableBase("Modules").select().all();

    modules.splice(0, modules.length, ...records.map(record => ({
      name: record.get('Name') as string
    })));
    selectedModule.value = modules[0].name;
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error);
    throw error;
  }
}

async function validate() {
  const module = modules.find(module => module.name === selectedModule.value);

  if (!module) {
    return;
  }

  router.push({ path: `/unanswered-questions/${module.name}` });
}

onBeforeMount(() => {
  getModules();
});
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