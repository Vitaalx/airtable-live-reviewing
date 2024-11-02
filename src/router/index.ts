import auth from '../domains/auth/router';
import questions from '../domains/questions/router';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/BaseLayout.vue'),
      children: [
        ...auth(),
        ...questions()
      ]
    }
  ]
});

export default router;