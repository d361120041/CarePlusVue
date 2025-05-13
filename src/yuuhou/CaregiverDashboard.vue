<template>
  <div class="dashboard-container">
    <SidebarMenu1 />
    <div class="dashboard-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SidebarMenu1 from '@/yuuhou/SidebarMenu1.vue';
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.dashboard-content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #f8f9fa;
}
</style>
