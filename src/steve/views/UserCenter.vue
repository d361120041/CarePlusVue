<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- 左側 Sidebar -->
      <aside class="w-64 min-h-screen bg-gray-100 p-4 shadow-md">
        <Sidebar />
      </aside>

      <!-- 右側內容 -->
      <main class="flex-1 p-6 bg-white">
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
/* 可視需要微調 */
</style>
