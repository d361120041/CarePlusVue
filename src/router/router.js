import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'
import Social from '@/daniel/views/Social.vue'
import CaregiverLogin from '@/yuuhou/CaregiverLogin.vue'
import CourseHome from '@/yuni/views/CourseHome.vue'
import CourseAdmin from '@/yuni/views/admin/CourseAdmin.vue'
const routes = [
    { path: "/", component: Home, name: "home" },
    { path: "/:pathMatch(.*)", component: NotFound, name: "notfound" },
    { path: "/403", component: Forbidden, name: "forbidden" },
    { path: "/social", component: Social, name: "social" },
    { path: "/caregiverLogin", component: CaregiverLogin, name: "caregiverLogin" },
    { path: "/course", component: CourseHome, name: "courseHome" },
    { path: "/course/admin", component: CourseAdmin, name: "courseAdmin" },
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

