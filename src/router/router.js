import { createRouter, createWebHistory } from "vue-router";

// ================== 匯入套件 開始==================
//  基礎頁面
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import Forbidden from "@/views/Forbidden.vue";

// Course
import CourseHome from "@/yuni/views/CourseHome.vue";
import CourseAdmin from "@/yuni/views/admin/CourseAdmin.vue";

// Caregiver
import CaregiverLogin from "@/yuuhou/CaregiverLogin.vue";

// Social
import Social from "@/daniel/views/Social.vue";

//UserInterface
import UserLogin from "@/steve/views/UserLogin.vue";
// import UserCenter from "@/steve/views/UserCenter.vue";
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
  {
    path: "/caregiverLogin",
    component: CaregiverLogin,
    name: "caregiverLogin",
  },

  // Social
  { path: "/social", component: Social, name: "social" },

  //User
  {
    path: "/userlogin",
    component: UserLogin,
    name: "userLogin",
  },
  // { path: "/user-center", component: UserCenter, name: "userCenter" },
];
// ================== 路由設定 結束 ==================

// ================== 其他設定 開始 ==================
const router = createRouter({
  routes: routes,
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "active--exact",
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (to.path === "/caregiver" && !isAuthenticated) {
    alert("請先登入");
    next("/caregiverLogin");
  } else {
    next();
  }
});
// ================== 其他設定 結束 ==================

export default router;
