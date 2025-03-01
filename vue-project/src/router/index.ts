import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ForgottenPasswordView from '@/views/auth/ForgottenPasswordView.vue'
import SetForgottenPasswordView from '@/views/auth/SetForgottenPasswordView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import SearchForNameView from '@/views/search/SearchForNameView.vue'
import HomeView from '@/views/home/HomeView.vue'
import NotificationView from '@/views/notification/NotificationView.vue'

// Ellenőrzi, hogy be van-e jelentkezve a felhasználó
const requireAuth = (to, from, next) => {
  const isAuthenticated = localStorage.getItem("userEmail"); // Ellenőrizzük a localStorage-t
  if (!isAuthenticated) {
    next('/login'); // Ha nincs bejelentkezve, irány a login oldal
  } else {
    next(); // Egyébként folytathatja az útvonalra navigálást
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/home',
      name: 'home-alt',
      component: HomeView
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/forgotten-password',
      name: 'forgotten-password',
      component: ForgottenPasswordView
    },
    {
      path: '/set-forgotten-password/:token',
      name: 'set-forgotten-password',
      component: SetForgottenPasswordView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: requireAuth // Csak bejelentkezett felhasználóknak
    },
    {
      path: "/search",
      name: "search",
      component: SearchForNameView
    },
    { 
      path: "/notifications",
      name: "notification", 
      component: NotificationView,
      beforeEnter: requireAuth // Csak bejelentkezett felhasználóknak
    },
    {
      path: "/notify",
      name: "notify",
      component: NotificationView,
    },
  ]
})

export default router
