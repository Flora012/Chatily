
import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ForgottenPasswordView from '@/views/auth/ForgottenPasswordView.vue'
import SetForgottenPasswordView from '@/views/auth/SetForgottenPasswordView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import SearchForNameView from '@/views/search/SearchForNameView.vue'
import HomeView from '@/views/home/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
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
      component: ProfileView
    },
    {
      path:"/search",
      name: "search",
      component:SearchForNameView
    }
  ]
})

export default router
