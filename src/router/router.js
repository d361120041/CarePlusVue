import { createRouter, createWebHistory } from 'vue-router'
// import { useAuth } from '@/stores/useAuth'

// ================== 匯入套件 開始==================
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'


// ------------------ daniel ------------------
import Social from '@/daniel/views/Social.vue'
// ------------------ daniel ------------------


// ------------------ yuni ------------------
import CourseHome from '@/yuni/views/CourseHome.vue'
import CourseAdmin from '@/yuni/views/admin/CourseAdmin.vue'
import CourseDetail from '@/yuni/views/CourseDetail.vue'
import MyCourse from '@/yuni/views/MyCourse.vue'
import CourseLearn from '@/yuni/views/CourseLearn.vue'
import CourseProgress from '@/yuni/views/CourseProgress.vue'
// ------------------ yuni ------------------


// ------------------ allen ------------------
//News
import NewsList from '@/allen/views/NewsList.vue'
import NewsDetail from '@/allen/views/NewsDetail.vue'
import AdminNewsList from '@/allen/views/AdminNewsList.vue'
import AdminEditNews from '@/allen/views/AdminEditNews.vue'
import AdminNewsDetail from '@/allen/views/AdminNewsDetail.vue'
// ------------------ allen ------------------


// ------------------ yuuhou ------------------
import CaregiverLogin from '@/yuuhou/CaregiverLogin.vue'
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
// ------------------ yuuhou ------------------
// ================== 匯入套件 結束==================





// ================== 設定路徑 開始==================
const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/:pathMatch(.*)", component: NotFound, name: "notfound" },
  { path: "/403", component: Forbidden, name: "forbidden" },


// ------------------ daniel ------------------
  { path: "/social", component: Social, name: "social" },
// ------------------ daniel ------------------


// ------------------ yuni ------------------
  { path: "/course", component: CourseHome, name: "courseHome" },
  { path: "/course/admin", component: CourseAdmin, name: "courseAdmin" },
  { path: '/courses/:id', component: CourseDetail, name: 'CourseDetail' },
  { path: '/my-courses', component: MyCourse, name: 'MyCourse' },
  { path: '/learn/:courseId', component: CourseLearn, name: 'CourseLearn' },
  { path: '/course-progress/:courseId', component: CourseProgress, name: 'CourseProgress' },
// ------------------ yuni ------------------


// ------------------ allen ------------------
  // News
  { path: "/news", component: NewsList, name: "news" }, //前台新聞主頁
  { path: "/news/:id", component: NewsDetail, name: "newsDetail" }, //前台新聞內容
  { path: "/admin/news",component: AdminNewsList, name: "adminNewsList" }, //後台新聞主頁
  { path: "/admin/news/new",component: AdminEditNews, name: "adminNewsNew" }, //後台新增新聞
  { path: "/admin/news/edit/:id",component: AdminEditNews, name: "adminNewsEdit" }, //後台編輯新聞
  { path: "/admin/news/:id", component: AdminNewsDetail, name: "adminNewsDetail" }, //後台新聞內容
// ------------------ allen ------------------


// ------------------ yuuhou ------------------
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
  // ------------------ yuuhou ------------------
];
// ================== 設定路徑 結束==================





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

