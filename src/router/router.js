import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'
import CaregiverLogin from '@/yuuhou/CaregiverLogin.vue'
import Social from '@/daniel/views/Social.vue'

const routes = [
  // ------------基礎頁面------------
  { path: "/", component: Home, name: "Home" },
  { path: "/403", component: Forbidden, name: "Forbidden" },
  { path: "/:pathMatch(.*)", component: NotFound, name: "Notfound" },
  { path: "/caregiverLogin", component: CaregiverLogin, name: "caregiverLogin" },

  // ------------social頁面------------
  { path: "/social", component: Social, name: "Social" },
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
  linkActiveClass: 'active',
  linkExactActiveClass: 'active--exact'
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (to.path === '/caregiver' && !isAuthenticated) {
    alert('請先登入')
    next('/caregiverLogin')
  } else {
    next()
  }
})


export default router

