<template>
  <div class="user-center-layout" style="background-color: #fff8f0">
    <!-- 左側 Sidebar -->
    <aside class="sidebar">
      <Sidebar />
    </aside>

    <!-- 右側內容 -->
    <main class="content" style="background-color: #fff8f0">
      <router-view />
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
  height: 100%; /* 撐滿外層 main 定義的區塊 */
  overflow: hidden; /* 禁止這層本身滾動 */
}

.sidebar {
  width: 150px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 1rem;
  box-shadow: inset -1px 0 0 #eee;
  overflow-y: auto; /* 側欄若內容過長可滾動 */
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto; /* 主要內容可獨立垂直滾動 */
  background-color: #fff;
}
</style>
