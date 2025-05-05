<template>
  <header
    style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 1rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
    <div style="font-weight: bold; color:black">後台管理系統</div>
    <div style="display: flex; align-items: center; gap: 1rem;">
      <span style="color: black;">👤 Admin</span>
      <button @click="handleLogout">登出</button>

    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCaregiverAuth } from '@/stores/useCaregiverAuth' // ✅ 加這行

const router = useRouter()
const authStore = useCaregiverAuth() // ✅ 取得照顧者登入狀態

const handleLogout = () => {
  // ✅ 呼叫 Pinia 裡的 logout（你要自己在 store 裡定義）
  authStore.logout()

  // ✅ 回首頁
  router.push('/')
}
</script>

