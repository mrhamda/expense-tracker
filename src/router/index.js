import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import PasswordView from '@/views/PasswordView.vue'
import PasswordResetView from '@/views/PasswordResetView.vue'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'signin',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView
  },

  {
    path: '/password',
    name: 'password',
    component: PasswordView
  }

  ,

  {
    path: '/passwordReset',
    name: 'passwordReset',
    component: PasswordResetView
  }
  , {
    path: '/:catchAll(.*)',
    name: 'login',
    component: LoginView
  },



]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
