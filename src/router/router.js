import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/useAuth'

import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'
import Social from '@/Daniel/views/Social.vue'
import CaregiverLogin from '@/yuuhou/CaregiverLogin.vue'
// yuuhou
import LoginView           from '@/yuuhou/LoginView.vue'
import RegisterView        from '@/yuuhou/RegisterView.vue'
import UserForgotPwd       from '@/yuuhou/UserForgotPwd.vue'
import AdminLogin          from '@/yuuhou/AdminLogin.vue'
import AdminDashboard      from '@/yuuhou/AdminDashboard.vue'
import UserDashboard       from '@/yuuhou/UserDashboard.vue'
import CaregiverDashboard from '@/yuuhou/CaregiverDashboard.vue'
import AdminMenu from '@/admin/menu/AdminMenu.vue'

//yuuhou


const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/:pathMatch(.*)", component: NotFound, name: "notfound" },
  { path: "/403", component: Forbidden, name: "forbidden" },
  { path: "/social", component: Social, name: "social" },
  // yuuhou
  { path: "/caregiverLogin", component: CaregiverLogin, name: "caregiverLogin" },
  { path: "/login",     component: LoginView,     name:"login" },
  { path: "/register",  component: RegisterView,  name:"register" },
  { path: "/forgot",    component: UserForgotPwd, name:"forgotPwd" },
  { path: '/admin/dashboard', component: AdminDashboard, name: 'adminDashboard' },
  { path: "/user/dashboard",  component: UserDashboard},
  { path: '/caregiver', component: CaregiverDashboard, name: 'caregiverDashboard' },
  { path: '/adminLogin', component: AdminLogin, name: 'adminLogin' },
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/admin/menu', component: AdminMenu }

  // yuuhou
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active--exact'
})
export default router

