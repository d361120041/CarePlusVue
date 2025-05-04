<template>
  <div style="display: flex; height: 100vh">
    <!-- Sidebar -->
    <aside style="width: 250px; background: #2d3748; color: white; padding: 1rem">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 2rem">Care+ 後台</h1>
      <nav style="display: flex; flex-direction: column; gap: 1rem">
        <router-link to="/admin" style="color: white">首頁</router-link>
        <router-link to="/admin/cms/courses" style="color: white">課程管理</router-link>
        <router-link to="/admin/cms/chapters" style="color: white">章節管理</router-link>
        <router-link to="/admin/cms/progress" style="color: white">進度管理</router-link>
      </nav>
    </aside>

    <!-- 右側主內容 -->
    <div style="flex: 1; display: flex; flex-direction: column; height: 100vh; min-width: 0">
      <!-- Navbar -->
      <div style="flex-shrink: 0">
        <NavBar />
      </div>

      <!-- router-view -->
      <main style="flex: 1; overflow-y: auto; background: #f7fafc; padding: 2rem; min-width: 0">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/CMS/NavBar.vue'
</script>
