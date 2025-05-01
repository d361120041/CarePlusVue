import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/useAuth'

import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'
import Social from '@/Daniel/views/Social.vue'
import CaregiverLogin from '@/yuuhou/CaregiverLogin.vue'
// yuuhou
import CaregiverProfileView from '@/yuuhou/CaregiverProfileView.vue'
import CaregiverPricing from '@/yuuhou/EditService.vue'
// import CaregiverSchedule from '@/yuuhou/Schedule.vue'
// import CaregiverOrders from '@/yuuhou/Orders.vue'
// import CaregiverReviews from '@/yuuhou/Reviews.vue'

import LoginView           from '@/yuuhou/LoginView.vue'
import RegisterView        from '@/yuuhou/RegisterView.vue'
import UserForgotPwd       from '@/yuuhou/UserForgotPwd.vue'
// import AdminLogin          from '@/yuuhou/AdminLogin.vue'
import AdminDashboard      from '@/yuuhou/AdminDashboard.vue'
import UserDashboard       from '@/yuuhou/UserDashboard.vue'
import CaregiverDashboard from '@/yuuhou/CaregiverDashboard.vue'
import AdminMenu from '@/yuuhou/AdminMenu.vue'
import ComingSoon from '@/views/ComingSoon.vue'
import VerifySuccess from '@/yuuhou/VerifySuccess.vue'
import ResetPassword from '@/yuuhou/ResetPassword.vue'
import VerifyFailed from '@/yuuhou/VerifyFailed.vue'
import VerifyReminder from '@/yuuhou/VerifyReminder.vue'
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
  // { path: '/adminLogin', component: AdminLogin, name: 'adminLogin' },
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/reset-password', component: ResetPassword },
  { path: '/verify-success', component: VerifySuccess, name: 'verifySuccess' },
  { path: '/admin/menu', component: AdminMenu },
  { path: '/verify-reminder', component: VerifyReminder },
  { path: '/verify-failed', component: VerifyFailed },
  { path: '/admin/yuni', component: ComingSoon },   //yuni
  { path: '/admin/zonghan', component: ComingSoon },//zonghan
  { path: '/admin/rita1', component: ComingSoon },  //rita
  { path: '/admin/rita2', component: ComingSoon },  //rita
  { path: '/admin/steve', component: ComingSoon },  //steve
  { path: '/admin/qilin', component: ComingSoon },   //qilin
  { path: '/caregiver/profile', component: CaregiverProfileView },
  { path: '/caregiver/pricing', component: CaregiverPricing },
  // { path: '/caregiver/schedule', component: CaregiverSchedule },
  // { path: '/caregiver/orders', component: CaregiverOrders },
  // { path: '/caregiver/reviews', component: CaregiverReviews },
  
  // yuuhou
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active--exact'
})
export default router

