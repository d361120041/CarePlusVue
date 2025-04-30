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

//News
import NewsList from '@/allen/views/NewsList.vue'
import NewsDetail from '@/allen/views/NewsDetail.vue'
import AdminNewsList from '@/allen/views/AdminNewsList.vue'
import AdminEditNews from '@/allen/views/AdminEditNews.vue'
import AdminNewsDetail from '@/allen/views/AdminNewsDetail.vue'
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

  // News
  { path: "/news", component: NewsList, name: "news" }, //前台新聞主頁
  { path: "/news/:id", component: NewsDetail, name: "newsDetail" }, //前台新聞內容
  { path: "/admin/news",component: AdminNewsList, name: "adminNewsList" }, //後台新聞主頁
  { path: "/admin/news/new",component: AdminEditNews, name: "adminNewsNew" }, //後台新增新聞
  { path: "/admin/news/edit/:id",component: AdminEditNews, name: "adminNewsEdit" }, //後台編輯新聞
  { path: "/admin/news/:id", component: AdminNewsDetail, name: "adminNewsDetail" } //後台新聞內容
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

