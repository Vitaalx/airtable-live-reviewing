<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import AirtableBase from '../../../providers/airtable';
import { useUserStore } from '../../../stores/user';

const userStore = useUserStore();
const email = ref(userStore.user?.email);

interface AnsweredQuestion {
    question: string;
    module: string;
    professor: string;
}

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
    <div class="flex flex-col items-center">
        <h1>Questions répondues</h1>
        <ul>
            <li v-for="answeredQuestion in answeredQuestions" :key="answeredQuestion.question">
                <p>Titre de la question : {{ answeredQuestion.question }}</p>
                <p>Nom du module : {{ answeredQuestion.module }}</p>
                <p>Professeur : {{ answeredQuestion.professor }}</p>
            </li>
        </ul>
    </div>
</template>