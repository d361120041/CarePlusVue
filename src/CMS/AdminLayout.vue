<template>
  <div class="admin-root">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h1 class="sidebar-title"> </h1>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="sidebar-link">首頁</router-link>
        <router-link to="/admin/admin/dashboard" class="sidebar-link">照服員管理</router-link>
        <router-link to="/admin/cms/courses" class="sidebar-link">課程管理</router-link>
        <router-link to="/admin/cms/chapters" class="sidebar-link">章節管理</router-link>
        <router-link to="/admin/cms/progress" class="sidebar-link">進度管理</router-link>
        <router-link to="/admin/news" class="sidebar-link">新聞管理</router-link>
      </nav>
    </aside>
    <!-- Main  -->
    <div class="main-content">
      <div class="navbar-wrapper">
        <NavBar />
      </div>
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
  min-height: 100vh;
  background-color: #f4f6f8;
}

.sidebar {
  width: 240px;
  background-color: #374151;
  color: #e5e7eb;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.sidebar-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  text-align: left;
  color: #cbd5e0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-link {
  color: #d1d5db;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  display: flex;
  align-items: center;
}

.sidebar-link:hover {
  background-color: #4b5563;
  color: #f9fafb;
}

.sidebar-link.router-link-exact-active {
  background-color: #10b981;
  color: #f9fafb;
  font-weight: 600;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  /* height: 100vh;  */
  overflow: hidden;
}

.navbar-wrapper {
  flex-shrink: 0;
  /* position: sticky;
  top: 0;
  z-index: 9; */
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background-color: #f9fafb;
}
</style>
