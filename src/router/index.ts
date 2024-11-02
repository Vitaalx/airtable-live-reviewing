import auth from '../domains/auth/router';
import questions from '../domains/questions/router';
import { createRouter, createWebHistory } from 'vue-router';
import { verifyToken } from '../utils/token';

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
  const token = localStorage.getItem('app-token');
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