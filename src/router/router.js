import { createRouter, createWebHistory } from 'vue-router'


// ================== 匯入套件 開始==================
//  基礎頁面 
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'

// Course
import CourseHome from '@/yuni/views/CourseHome.vue'
import CourseAdmin from '@/yuni/views/admin/CourseAdmin.vue'

// Caregiver
import CaregiverLogin from '@/yuuhou/CaregiverLogin.vue'

// Social
import Social from '@/daniel/views/Social.vue'

// ================== 匯入套件 結束==================


// ================== 路由設定 開始 ==================
const routes = [
  // 基礎頁面
  { path: "/", component: Home, name: "home" },
  { path: "/:pathMatch(.*)", component: NotFound, name: "notfound" },
  { path: "/403", component: Forbidden, name: "forbidden" },

  // Course
  { path: "/course", component: CourseHome, name: "courseHome" },
  { path: "/course/admin", component: CourseAdmin, name: "courseAdmin" },

  // Caregiver
  { path: "/caregiverLogin", component: CaregiverLogin, name: "caregiverLogin" },
  
  // Social
  { path: "/social", component: Social, name: "social" },

  // Appointment
  { path: "/caregivers/search", component: () => import('@/rita/views/SearchCaregiver.vue'), name: "searchCaregiver" },
  { path: "/caregivers/list", component: () => import('@/rita/views/CaregiverList.vue'), name: "caregiverList" },
  { path: "/caregivers/:id", component: () => import('@/rita/views/CaregiverProfile.vue'), name: "caregiverProfile" },

  // 預約需求單流程（分三步）
  { path: "/request/time", component: () => import('@/rita/views/RequestTime.vue'), name: "requestTime" },
  { path: "/request/patient", component: () => import('@/rita/views/RequestPatient.vue'), name: "requestPatient" },
  { path: "/request/location", component: () => import('@/rita/views/RequestLocation.vue'), name: "requestLocation" },

  // 看護確認預約
  { path: "/caregiver/confirm/:appointmentId", component: () => import('@/rita/views/CaregiverConfirm.vue'), name: "caregiverConfirm" },

  // 使用者查看訂單與付款
  { path: "/orders", component: () => import('@/rita/views/OrderList.vue'), name: "orderList" },
  { path: "/payment/:appointmentId", component: () => import('@/rita/views/Payment.vue'), name: "payment" },
  { path: "/payment/success", component: () => import('@/rita/views/PaymentSuccess.vue'), name: "paymentSuccess" },


];
// ================== 路由設定 結束 ==================


// ================== 其他設定 開始 ==================
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
// ================== 其他設定 結束 ==================

export default router

