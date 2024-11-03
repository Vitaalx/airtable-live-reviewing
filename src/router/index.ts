import { createRouter, createWebHistory } from 'vue-router';

import auth from '@/domains/auth/router';
import questions from '@/domains/questions/router';
import { verifyToken } from '@/utils/token';
import { KEY_ACCESS_TOKEN_LOCAL_STORAGE } from '@/stores/user';

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



router.beforeEach(async (to, from, next) => {
  const publicPages = [
    '/login',
    '/register'
  ];

  const token = localStorage.getItem(KEY_ACCESS_TOKEN_LOCAL_STORAGE);

  if (publicPages.includes(to.path)) {
    return next();
  }
  if (!token) {
    return next('/login');
  }

  const isValid = await verifyToken(token);
  
  if (!isValid) {
    return next('/login');
  }
  next();
});

export default router;