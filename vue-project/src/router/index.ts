import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import RegistrationView from '@/views/auth/RegistrationView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import ForgottenPasswordView from '@/views/auth/ForgottenPasswordView.vue';
import ProfileView from '@/views/profile/ProfileView.vue';
import SearchForNameView from '@/views/search/SearchForNameView.vue';
import NotificationView from '@/views/notification/NotificationView.vue';
import { AuthController } from "./authController";
import { AuthService } from './authService';
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/HomeView.vue'),
    beforeEnter: AuthController.requireAuth
  },
  {
    path: '/messages/:name/:friendId',
    name: 'Messages',
    component: () => import('@/views/messages/MessagesView.vue'),
    props: true,
    beforeEnter: AuthController.requireAuth
  },
  {
    path: '/home',
    name: 'home-alt',
    component: () => import('@/views/home/HomeView.vue'),
    beforeEnter: AuthController.requireAuth
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/forgotten-password/:emailHash',
    name: 'forgotten-password',
    component: ForgottenPasswordView,
    beforeEnter: (to, from, next) => {
      next();
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    beforeEnter: AuthController.requireAuth
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: AuthController.requireAuth
  },
  {
    path: '/group/:groupId/:groupName',
    name: 'GroupMessages',
    component: () => import('@/components/GroupMessagesView.vue'),
    props: (route) => ({
      groupId: Number(route.params.groupId),
      groupName: route.params.groupName,
    }),
    beforeEnter: AuthController.requireAuth
  },
  {
    path: "/search",
    name: "search",
    component: SearchForNameView,
    beforeEnter: AuthController.requireAuth
  },
  {
    path: "/notifications",
    name: "notification",
    component: NotificationView,
    beforeEnter: AuthController.requireAuth
  },
  {
    path: "/notify",
    name: "notify",
    component: NotificationView,
    beforeEnter: AuthController.requireAuth
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/registration', '/forgotten-password'];
  const authRequired = !publicPages.some(page => to.path.startsWith(page));
  const loggedIn = AuthService.isAuthenticated();

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  if ((to.name === 'login' || to.name === 'registration') && loggedIn) {
    return next('/');
  }

  next();
});

export default router;
