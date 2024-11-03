<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import AirtableBase from '@/providers/airtable';
import { AnsweredQuestion } from '@/types/question';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const email = ref(userStore.user?.email);

const answeredQuestions = reactive<AnsweredQuestion[]>([]);

async function getAnsweredQuestionsWithDetails(email: string) {
    try {
        const result = await AirtableBase("QuestionsAnswered").select({
            filterByFormula: `AND({user} = '${email}', {status} = 'Answered')`
        }).all();

        for (const answeredQuestion of result) {
            await processAnsweredQuestion(answeredQuestion);
        }
    } catch (error) {
        console.error(error);
    }
}

async function processAnsweredQuestion(answeredQuestion: { get: (field: string) => any }) {
    const questionId = answeredQuestion.get("Question")?.[0];
    const questionRecord = await AirtableBase("Questions").find(questionId);
    const moduleId = questionRecord.get("Module")?.[0];

    const [moduleRecord, professorRecord] = await Promise.all([
        AirtableBase("Modules").find(moduleId),
        (async () => {
            const professorId = (await AirtableBase("Modules").find(moduleId)).get("Professor")?.[0];
            return AirtableBase("Users").find(professorId);
        })()
    ]);

    answeredQuestions.push({
        question: questionRecord.get("Title") as string,
        module: moduleRecord.get("Name") as string,
        professor: professorRecord.get("Email") as string
    });
}

onMounted(async () => { 
    if (!email.value) {
        return;
    }
   getAnsweredQuestionsWithDetails(email.value);
});
</script>
<template>
    <section class="container flex justify-center h-screen-nh">
        <div class="items-center justify-center py-12">
            <div class="w-full bg-white rounded-lg shadow-lg p-8 m-4">
                <h1 class="text-2xl font-semibold text-center mb-6">Questions répondues</h1>
                <ul class="divide-y divide-gray-200">
                    <li v-for="answeredQuestion in answeredQuestions" :key="answeredQuestion.question">
                        <div class="flex items center justify-between">
                            <div class="flex items center">
                                <div class="p-4 flex flex-col">
                                    <p class="text-lg font-semibold">{{ answeredQuestion.question }}</p>
                                    <p class="text-sm text-gray-500">Module : {{ answeredQuestion.module }}</p>
                                </div>
                            </div>
                            <div class="flex items center">
                                <p class="text-sm text-gray-500">Professeur : {{ answeredQuestion.professor }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>