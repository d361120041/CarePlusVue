<template>
  <header class="navbar">
    <!-- 可加入後台系統標題 -->
    <div class="page-title">
      {{ pageTitle }}
    </div>

    <!-- 使用者資訊與登出 -->

   

    <div class="right navbar-user">
      <span>👤 Admin </span>
      <button class="logout-button" @click="handleLogout">登出</button>
    </div>
  </header>
</template>



<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useCaregiverAuth } from '@/stores/useCaregiverAuth' // ✅ 加這行
import { computed } from 'vue'


const router = useRouter()
const authStore = useCaregiverAuth() // ✅ 取得照顧者登入狀態
const route = useRoute()


const handleLogout = () => {
  // ✅ 呼叫 Pinia 裡的 logout（你要自己在 store 裡定義）
  authStore.logout()

  // ✅ 回首頁
  router.push('/')
}


const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('/admin/cms/courses')) return '課程後台管理'
  if (path.includes('/admin/cms/chapters')) return '章節後台管理'
  if (path.includes('/admin/cms/progress')) return '進度後台管理'
  if (path.includes('/admin/news')) return '新聞後台管理'
  if (path.includes('/admin/admin/dashboard')) return '照服員管理'
  if (path === '/admin') return '後台首頁'
  return 'Care+ 後台'
})


</script>

<!-- <style scoped>
/* .navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 64px;
}

.navbar-title {
  font-weight: bold;
  font-size: 1.125rem;
  color: #2d3748;
} */

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #2d3748;
}

.logout-button {
  background-color: #df4949;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #dc1a1a;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #2d3748;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style> -->


<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 80px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600; 
  color: #374151;
}

.right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4a5568;
  font-weight: 500;
}

.logout-button {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.15s ease-in-out;
}

.logout-button:hover {
  background-color: #c53030;
}



/* ✅ 鈴鐺樣式 */
.notification-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: -58rem; /* ✅ 左邊縮小間距 */
}

/* ✅ 鈴鐺本體 */
.notification-icon {
  font-size: 1.0rem;
}

/* ✅ 假通知數量 */
.notification-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ef4444;
  color: #ffffff;
  border-radius: 50%;
  padding: 0.2rem 0.4rem;
  font-size: 0.5rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  pointer-events: none; /* ✅ 確保點不到 */
}
</style>