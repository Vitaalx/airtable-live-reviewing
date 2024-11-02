import auth from '../domains/auth/router';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/BaseLayout.vue'),
      children: [
        ...auth()
      ]
    }
  ]
});

export default router;