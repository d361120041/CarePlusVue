import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // 加上這行
// import { useAuth } from '@/stores/useAuth'

// ================== 匯入套件 開始==================
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import Forbidden from "@/views/Forbidden.vue";
import HomeHero from "@/views/HomeHero.vue";

// ------------------ daniel ------------------
import Social from '@/daniel/views/Social.vue'
import MyPost from '@/daniel/views/MyPost.vue'
// ------------------ daniel ------------------

// ------------------ yuni ------------------
import CourseHome from "@/yuni/views/CourseHome.vue";
import CourseDetail from "@/yuni/views/CourseDetail.vue";
import MyCourse from "@/yuni/views/MyCourse.vue";
import CourseLearn from "@/yuni/views/CourseLearn.vue";
import CourseProgress from "@/yuni/views/CourseProgress.vue";
import Done from "@/yuni/views/Done.vue";
import RitaOrder from "@/yuni/views/RitaOrder.vue";
// ------------------ yuni ------------------

// ------------------ allen ------------------
//News
import NewsList from "@/allen/views/NewsList.vue";
import NewsDetail from "@/allen/views/NewsDetail.vue";
import AdminNewsList from "@/allen/views/AdminNewsList.vue";
import AdminEditNews from "@/allen/views/AdminEditNews.vue";
import AdminNewsDetail from "@/allen/views/AdminNewsDetail.vue";
import AdminNewsPreview from "@/allen/views/AdminNewsPreview.vue";

// ------------------ allen ------------------
 
// ------------------ yuuhou ------------------
import CaregiverLogin from "@/yuuhou/LoginCaregiver.vue";
import CaregiverProfileView from "@/yuuhou/CaregiverProfileView.vue";
import CaregiverPricing from "@/yuuhou/EditService.vue";

import UserForgotPwd from "@/yuuhou/UserForgotPwd.vue";
// import Navigationbar from "@/views/Navigationbar.vue";

// import CaregiverSchedule from '@/yuuhou/Schedule.vue'
// import CaregiverOrders from '@/yuuhou/Orders.vue'
// import CaregiverReviews from '@/yuuhou/Reviews.vue'

import LoginView from "@/yuuhou/LoginView.vue";
import RegisterView from "@/yuuhou/RegisterView.vue";

// import AdminLogin          from '@/yuuhou/AdminLogin.vue'
import AdminDashboard from "@/yuuhou/AdminDashboard.vue";
import UserDashboard from "@/yuuhou/UserDashboard.vue";
import CaregiverDashboard from "@/yuuhou/CaregiverDashboard.vue";
import ComingSoon from "@/views/ComingSoon.vue";
import VerifySuccess from "@/yuuhou/VerifySuccess.vue";
import ResetPasswordYuuhou from "@/yuuhou/ResetPassword.vue";
import VerifyFailed from "@/yuuhou/VerifyFailed.vue";
import VerifyReminder from "@/yuuhou/VerifyReminder.vue";
// ------------------ yuuhou ------------------
//UserInterface
import UserLogin from "@/steve/views/UserLogin.vue";
import UserRegister from "@/steve/views/UserRegister.vue";
import UserVerify from "@/steve/views/UserVerify.vue";
import ForgotPassword from "@/steve/views/ForgotPassword.vue";
import ResetPasswordSteve from "@/steve/views/ResetPassword.vue";
import UserCenter from "@/steve/views/UserCenter.vue";
import UserProfile from "@/steve/views/UserProfile.vue";
import InquiryForm from "@/steve/views/InquiryForm.vue";
import PatientsList from "@/steve/views/PatientsList.vue";
import AddPatient from "@/steve/views/AddPatient.vue";
import FavoritesView from "@/steve/views/FavoritesView.vue";

// ------------------ 後台cms ------------------
//  後台管理頁面

import AdminLayout from "@/CMS/AdminLayout.vue";
import CmsDashboard from "@/CMS/CmsDashboard.vue";
import CourseAdmin from '@/CMS/yuni/views/CourseAdmin.vue'
import ChapterAdmin from '@/CMS/yuni/views/ChapterAdmin.vue'
import ProgressAdmin from '@/CMS/yuni/views/ProgressAdmin.vue'
// ------------------ 後台cms ------------------

// ================== 匯入套件 結束==================

// ================== 設定路徑 開始==================
const routes = [
  { path: "/", component: HomeHero, name: "homeHero" },
  { path: "/home", component: Home, name: "home" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound" },
  { path: "/403", component: Forbidden, name: "forbidden" },

  // ------------------ daniel ------------------
  { path: "/social", component: Social, name: "social" },
  // ------------------ daniel ------------------

  // ------------------ yuni ------------------
  { path: "/course", component: CourseHome, name: "courseHome" },
  { path: "/courses/:id", component: CourseDetail, name: "CourseDetail" },
  { path: "/my-courses", component: MyCourse, name: "MyCourse" },
  { path: "/learn/:courseId", component: CourseLearn, name: "CourseLearn" },
  {
    path: "/course-progress/:courseId",
    component: CourseProgress,
    name: "CourseProgress",
  },
  { path: "/done/:courseId", component: Done, name: "Done" },

  // ------------------ yuni ------------------

  // ------------------ allen ------------------
  // News
  { path: "/news", component: NewsList, name: "news" }, //前台新聞主頁
  { path: "/news/:id", component: NewsDetail, name: "newsDetail" }, //前台新聞內容
  { path: "/admin/news", component: AdminNewsList, name: "adminNewsList" }, //後台新聞主頁
  { path: "/admin/news/new", component: AdminEditNews, name: "adminNewsNew" }, //後台新增新聞
  { path: "/admin/news/edit/:id", component: AdminEditNews, name: "adminNewsEdit", }, //後台編輯新聞
  { path: "/admin/news/:id", component: AdminNewsDetail, name: "adminNewsDetail", }, //後台新聞內容
  { path: '/admin/news/preview/:id', component: AdminNewsPreview, name: 'AdminNewsPreview' }, //後台新聞預覽

  // ------------------ allen ------------------

  // ------------------ yuuhou ------------------
 
  {
    path: "/caregiver",
    component: CaregiverDashboard,
    children: [
      { path: "profile", component: CaregiverProfileView },
      { path: "pricing", component: CaregiverPricing },
      // { path: "schedule", component: ScheduleView },
      // { path: "orders", component: OrdersView },
    ],
  },


  // {
  //   path: "/caregiver",
  //   component: CaregiverDashboard,
  //   name: "caregiverDashboard",
  // },
  // { path: "/caregiver/profile", component: CaregiverProfileView },
  // { path: "/caregiver/pricing", component: CaregiverPricing },


  {
    path: "/caregiverLogin",
    component: CaregiverLogin,
    name: "caregiverLogin",
  },
  { path: "/login", component: LoginView, name: "login" },
  { path: "/register", component: RegisterView, name: "register" },
  { path: "/forgot", component: UserForgotPwd, name: "forgotPwd" },

  // { path: "/navigationbar" , component: Navigationbar, name: "navigationBar" },
  { path: "/user/dashboard", component: UserDashboard },


  // { path: '/adminLogin', component: AdminLogin, name: 'adminLogin' },



  { path: "/reset/yuuhou", component: ResetPasswordYuuhou },
  { path: "/verify-success", component: VerifySuccess, name: "verifySuccess" },
  { path: "/verify-reminder", component: VerifyReminder },
  { path: "/verify-failed", component: VerifyFailed },
  {
    path: "/login-select",
    component: () => import("@/yuuhou/LoginSelect.vue"),
  },
  {
    path: "/login-caregiver",
    component: () => import("@/yuuhou/LoginCaregiver.vue"),
  },
  { path: "/login-admin", component: () => import("@/yuuhou/LoginAdmin.vue") },

  // { path: '/caregiver/schedule', component: CaregiverSchedule },
  // { path: '/caregiver/orders', component: CaregiverOrders },
  // { path: '/caregiver/reviews', component: CaregiverReviews },
  // ------------------ yuuhou ------------------

  // ------------------ rita ------------------
  // Appointment
  {
    path: "/caregivers/search",
    component: () => import("@/rita/views/SearchCaregiver.vue"),
    name: "searchCaregiver",
  },
  {
    path: "/caregivers/list",
    component: () => import("@/rita/views/CaregiverList.vue"),
    name: "caregiverList",
  },
  {
    path: "/caregivers/:id",
    component: () => import("@/rita/views/CaregiverProfile.vue"),
    name: "caregiverProfile",
  },

  // 預約需求單流程（分三步）
  {
    path: "/request/time",
    component: () => import("@/rita/views/RequestTime.vue"),
    name: "requestTime",
  },
  {
    path: "/request/patient",
    component: () => import("@/rita/views/RequestPatient.vue"),
    name: "requestPatient",
  },
  {
    path: "/request/location",
    component: () => import("@/rita/views/RequestLocation.vue"),
    name: "requestLocation",
  },
  {
    path: "/request/confirm",
    component: () => import("@/rita/views/Confirm.vue"),
    name: "requestConfirm",
  },

  // 看護確認預約
  {
    path: "/caregiver/confirm/:appointmentId",
    component: () => import("@/rita/views/CaregiverConfirm.vue"),
    name: "caregiverConfirm",
  },

  // 使用者查看訂單與付款
  {
    path: "/user-center/orders",
    component: () => import("@/rita/views/OrderList.vue"),
    name: "orderList",
  },
  {
    path: "/payment/:appointmentId",
    component: () => import("@/rita/views/Payment.vue"),
    name: "payment",
  },
  {
    path: "/payment/success",
    component: () => import("@/rita/views/PaymentSuccess.vue"),
    name: "paymentSuccess",
  },
  // ------------------ rita ------------------

  //////////User//////////
  {
    path: "/userlogin",
    component: UserLogin,
    name: "userLogin",
  },
  { path: "/userregister", component: UserRegister, name: "userRegister" },
  { path: "/verify", component: UserVerify, name: "userVerify" }, //
  {
    path: "/ForgotPassword",
    component: ForgotPassword,
    name: "ForgotPassword",
  },
  {
    path: "/resetPassword",
    component: ResetPasswordSteve,
    name: "resetPassword",
  },

  {
    path: "/user-center",
    component: UserCenter,
    children: [
      { path: "", redirect: "/user-center/profile" },
      { path: "profile", component: UserProfile },
      { path: "support", component: InquiryForm },
      { path: "patients", component: PatientsList },
      { path: "patients/add", component: AddPatient },
      {
        path: "patients/edit/:id",
        component: () => import("@/steve/views/EditPatient.vue"),
      },
      { path: "favorites", component: FavoritesView },
      { path: "myPost", component: MyPost },
      {
        path: "orders",
        component: () => import("@/rita/views/OrderList.vue"),
        name: "orderList",
      },
    ],
  },
  // { path: "/user-center", component: UserCenter, name: "userCenter" }

  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "", component: CmsDashboard, name: "cmsDashboard" },
      { path: "cms/courses", component: CourseAdmin, name: "cmsCourses" },
      { path: "cms/chapters", component: ChapterAdmin, name: "cmsChapters" },
      { path: "cms/progress", component: ProgressAdmin, name: "cmsProgress" },
      // ✅ 新聞模組路由整合
      { path: "news", component: AdminNewsList, name: "adminNewsList" },
      { path: "news/new", component: AdminEditNews, name: "adminNewsNew" },
      { path: "news/edit/:id", component: AdminEditNews, name: "adminNewsEdit" },
      { path: "news/:id", component: AdminNewsDetail, name: "adminNewsDetail" },
      { path: "news/preview/:id", component: AdminNewsPreview, name: "AdminNewsPreview" },
      { path: "admin/dashboard", component: AdminDashboard, name: "adminDashboard", },
    ],
  },
];
// ================== 設定路徑 結束==================

// ================== 其他設定 開始 ==================
const router = createRouter({
  routes: routes,
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "active--exact",
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore(); // ✅ 使用 Pinia Store

  const caregiverToken = localStorage.getItem("token"); // ✅ 組員原有邏輯

  // ✅ 初始化使用者登入狀態
  if (!auth.storeReady) {
    await auth.checkAuth(); // 這裡才能用 await
    auth.storeReady = true;
  }

  // ✅ 照顧者頁面但沒登入
  if (to.path === "/caregiver" && !caregiverToken) {
    alert("請先登入照顧者帳號");
    return next("/caregiverLogin");
  }
  // ✅ 使用者中心頁面但沒登入
  if (to.path.startsWith("/user-center") && !auth.isAuthenticated) {
    alert("請先登入使用者帳號");
    return next("/userlogin");
  }

  //討論區驗證
  if (to.path === "/social" && !auth.isAuthenticated) {
    // 記住使用者想前往的路徑
    sessionStorage.setItem("redirectAfterLogin", to.fullPath);
    alert("請先登入使用者帳號");
    return next("/userlogin");
  }

  return next(); // ✅ 放行
});

// ================== 其他設定 結束 ==================

export default router;
