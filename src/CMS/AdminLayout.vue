
<template>
  <div class="admin-root">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h1 class="sidebar-title">後台管理系統</h1>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="sidebar-link">首頁</router-link>
        <router-link to="/admin/admin/dashboard" class="sidebar-link">照服員管理</router-link>
        <router-link to="/admin/cms/courses" class="sidebar-link">課程管理</router-link>
        <router-link to="/admin/cms/chapters" class="sidebar-link">章節管理</router-link>
        <router-link to="/admin/cms/progress" class="sidebar-link">進度管理</router-link>
                <!-- allen 新聞連結 -->
        <router-link to="/admin/news" class="sidebar-link">新聞管理</router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="main-content">
      <div class="navbar-wrapper">
        <NavBar />
      </div>
<!-- router view -->
      <main class="content-wrapper">
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
  display: flex;
  height: 100vh;
  background-color: #f7fafc;
}

/* Sidebar 樣式 */
.sidebar {
  width: 200px;
  background-color: #2d3748;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.sidebar-link:hover {
  background-color: #4a5568;
}

/* 可擴充：高亮目前頁面 */
.sidebar-link.router-link-exact-active {
  background-color: #38b2ac;
  color: white;
}

/* Main content 區域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
}

.navbar-wrapper {
  flex-shrink: 0;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  min-width: 0;
}
</style>


