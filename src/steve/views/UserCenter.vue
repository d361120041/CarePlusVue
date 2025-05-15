<template>
  <div class="user-center-layout" style="background-color: #fff8f0">
    <!-- 左側 Sidebar -->
    <aside class="sidebar">
      <Sidebar />
    </aside>

    <!-- 右側內容：加入 transition 包住 router-view -->
    <main class="content" style="background-color: #fff8f0">
      <transition name="fade-slide" mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Sidebar from "@/steve/views/Sidebar.vue";

onMounted(() => {
  console.log("✅ 成功進入 UserCenter.vue");
});
</script>

<style scoped>
.user-center-layout {
  display: flex;
  /* 改用 min-height 讓整個區塊至少佔滿視窗高度 */
  min-height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 150px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 1rem;
  box-shadow: inset -1px 0 0 #eee;
  overflow-y: auto;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #fff;
}

/* ✅ 動畫樣式 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 1s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
