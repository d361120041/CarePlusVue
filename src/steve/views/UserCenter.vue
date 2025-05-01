<template>
  <div class="user-center-layout">
    <div class="flex h-screen">
      <!-- 左側 Sidebar -->
      <aside class="w-64 bg-gray-100 p-4 shadow-md">
        <Sidebar />
      </aside>

      <!-- 右側內容 -->
      <main class="flex-1 p-6 bg-white overflow-y-auto">
        <router-view />
      </main>
    </div>
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
  height: 100vh; /* 撐滿整個視窗 */
}
</style>
