<template>
  <div style="display: flex; height: 100vh" class="admin-root">
    <!-- Sidebar -->
    <aside style="width: 250px; background: #2d3748; color: white; padding: 1rem">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 2rem">Care+ 後台</h1>
      <nav style="display: flex; flex-direction: column; gap: 1rem">
        <router-link to="/admin" style="color: white">首頁</router-link>
        <router-link to="/admin/cms/courses" style="color: white">課程管理</router-link>
        <router-link to="/admin/cms/chapters" style="color: white">章節管理</router-link>
        <router-link to="/admin/cms/progress" style="color: white">進度管理</router-link>
        <!-- allen 新聞連結 -->
        <router-link to="/admin/news" style="color: white">新聞管理</router-link>

      </nav>
    </aside>

    <!-- 右側主內容 -->
    <div style="flex: 1; display: flex; flex-direction: column; height: 100vh; min-width: 0">
      <!-- Navbar -->
      <div style="flex-shrink: 0">
        <NavBar />
      </div>

      <!-- router-view -->
      <main style="flex: 1; overflow-y: auto; background: #f7fafc; min-width: 0">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/CMS/NavBar.vue'
</script>


<style scoped>
.admin-root {
  position: fixed; /* 或 absolute */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
