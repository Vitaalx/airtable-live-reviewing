<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
import StarsAnswer from '../components/answers/StarsAnswer.vue';
import AirtableBase from '../../../providers/airtable';
import { useUserStore } from '../../../stores/user';
import { useRoute } from 'vue-router';
import { z } from 'zod';
import { Question } from '../../../types/question';

const userStore = useUserStore();
const route = useRoute();

const paramsSchema = z.object({
  moduleName: z.string()
});

const params = paramsSchema.parse(route.params);
const moduleName = ref(params.moduleName);

const currentQuestion = ref(0);
const isScrolling = ref(false);
const questionRefs = ref<HTMLElement[]>([]);
const touchStartY = ref(0);

const questionsUnanswered = reactive<Question[]>([]);

// Fonction pour récupérer les questions non répondues d'un utilisateur
async function getUnansweredQuestions(moduleName: string) {
  try {
    // Récupérer toutes les questions du module sélectionné
    const questions = await AirtableBase("Questions").select({
      filterByFormula: `{module} = '${moduleName}'`
    }).all();

    if (questions.length == 0) {
      return;
    }

    const userEmail = userStore.user?.email;

    if (!userEmail) {
      return;
    }

    // Récupérer les questions auxquelles l'utilisateur a déjà répondu dans ce module
    const answeredQuestions = await AirtableBase("QuestionsAnswered").select({
      filterByFormula: `AND({user} = '${userEmail}', {status} = 'Answered')`
    }).all();

    const answeredQuestionsIds = answeredQuestions
      .map((question) => question.get("Question"))
      .filter((q) => q !== undefined)
      .map((q) => q[0]);

    const unansweredQuestions = questions.filter((question) => !answeredQuestionsIds.includes(question.id));

    for (const question of unansweredQuestions) {
      questionsUnanswered.push({
        title: question.get("Title") as string,
        id: question.id
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des questions non répondues:', error);
    throw error;
  }
}

async function refreshQuestions(questionId: string) {
  const index = questionsUnanswered.findIndex((question) => question.id === questionId);
  if (index !== -1) {
    questionsUnanswered.splice(index, 1);
  }
}

async function sendAnswer(rating: number) {
  try {
    AirtableBase("Answers").create(
        {
          "Question": [questionsUnanswered[currentQuestion.value].id],
          "Content": rating,
          "User": [userStore.user?.id as string],
        }, function(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
      );
      refreshQuestions(questionsUnanswered[currentQuestion.value].id);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
  }
}

function updateQuestionHeights() {
  questionRefs.value.forEach((question) => {
    question.style.height = `${window.innerHeight}px`;
  });
}

function scrollToQuestion(index: number) {
  if (index >= 0 && index < questionsUnanswered.length) {
    isScrolling.value = true;
    currentQuestion.value = index;
    questionRefs.value[index].scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isScrolling.value = false;
    }, 300);
  }
}

function scrollToNextQuestion() {
  scrollToQuestion(currentQuestion.value + 1);
}

function scrollToPreviousQuestion() {
  scrollToQuestion(currentQuestion.value - 1);
}

function handleScroll(event: WheelEvent) {
  if (isScrolling.value) return;

  const direction = event.deltaY > 0 ? 1 : -1;

  scrollToQuestion(currentQuestion.value + direction);
}

function handleTouchMove(event: TouchEvent) {
  if (isScrolling.value) return;

  const touchEndY = event.touches[0].clientY;
  const direction = touchStartY.value - touchEndY > 0 ? 1 : -1;

  if (Math.abs(touchStartY.value - touchEndY) > 50) {
    scrollToQuestion(currentQuestion.value + direction);
  }
}

watch(
  moduleName,
  () => {
    questionsUnanswered.splice(0, questionsUnanswered.length);
    getUnansweredQuestions(moduleName.value);
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', updateQuestionHeights);
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
  <div class="relative overflow-hidden h-screen-nh">
    <section
      v-if="questionsUnanswered.length > 0"
      v-for="(question, index) in questionsUnanswered"
      :key="index"
      :class="[
        'flex items-center justify-center text-2xl border-b border-gray-300',
        index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'
      ]"
      class="h-screen"
      ref="questionRefs"
    >
      <StarsAnswer :question="question.title" :id="'question-' + index" @send="(e) => sendAnswer(e)" />

      <div class="fixed bottom-[calc(50vh-22px)] right-4 flex flex-col gap-2">
        <button @click="scrollToPreviousQuestion" class="p-2 text-white bg-gray-600 rounded-full hover:bg-gray-700">
          ▲
        </button>
        <button @click="scrollToNextQuestion" class="p-2 text-white bg-gray-600 rounded-full hover:bg-gray-700">
          ▼
        </button>
      </div>
    </section>

    <section v-else>
      <div class="flex items-center justify-center h-screen text-2xl bg-gray-200 border-b border-gray-300">
        <p>Aucune questions.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>
