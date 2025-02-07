import CarCreateView from '@/views/cars/CarCreateView.vue'
import CarDeleteView from '@/views/cars/CarDeleteView.vue'
import CarListView from '@/views/cars/CarListView.vue'
import CarUpdateView from '@/views/cars/CarUpdateView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/health/HomeView.vue'
import Health2View from '@/views/health/Health2View.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import SetPasswordView from '@/views/auth/SetPasswordView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ForgottenPasswordView from '@/views/auth/ForgottenPasswordView.vue'
import SetForgottenPasswordView from '@/views/auth/SetForgottenPasswordView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import ProjectListView from '@/views/crud/ProjectListView.vue'
import ProjectCreateView from '@/views/crud/ProjectCreateView.vue'
import ProjectViewView from '@/views/crud/ProjectViewView.vue'
import ProjectUpdateView from '@/views/crud/ProjectUpdateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cars',
      name: 'cars_list',
      component: CarListView
    },
    {
      path: '/cars/create',
      name: 'cars_create',
      component: CarCreateView
    },
    {
      path: '/cars/:carId/update',
      name: 'cars_update',
      component: CarUpdateView
    },
    {
      path: '/cars/:carId/delete',
      name: 'cars_delete',
      component: CarDeleteView
    },
    {
      path: '/health',
      name: 'health',
      component: Health2View
    },
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
      path: '/set-password/:token',
      name: 'set-password',
      component: SetPasswordView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectListView
    },
    {
      path: '/projects/create',
      name: 'projects_create',
      component: ProjectCreateView
    },
    {
      path: '/projects/:id/view',
      name: 'projects_view',
      component: ProjectViewView
    },
    {
      path: '/projects/:id/update',
      name: 'projects_update',
      component: ProjectUpdateView
    }
  ]
})

export default router
