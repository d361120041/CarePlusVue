<template>
  <!-- 頁首 開始 -->
  <!-- <header v-if="!isAdminRoute" class="header">
    <div class="container d-flex justify-content-between align-items-center">
      <h1>Care+ 照護平台</h1>
    </div>
  </header> -->
  <!-- 頁首 結束 -->
  
  <!-- 導覽列 開始-->
  <nav v-if="!isAdminRoute">
    <Navigationbar />
  </nav>
  <!-- 導覽列 結束 -->

  <!-- 輪播圖 開始-->
  <!-- 輪播圖 結束 -->

  <!-- 主內容 開始-->
  <main>
    <RouterView />
  </main>
  <!-- 主內容 結束-->

  <!-- 頁尾 開始-->
  <footer v-if="!isAdminRoute" class="footer">
    <div class="container text-center">
      <h1>&copy; 2025 Care+ 照護平台</h1>
    </div>
  </footer>
  <!-- 頁尾 結束-->
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Navigationbar from "@/views/Navigationbar.vue";

const route = useRoute();
// ✅ 檢查是否為 admin 開頭的頁面
const isAdminRoute = computed(() => route.path.startsWith("/admin"));
</script>

<style>
.header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
}

.footer {
  background-color: var(--color-tertiary);
  color: white;
  padding: 1rem 0;
}

.main {
  padding: 2rem 0;
}

body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #fff8f0;
  /* ✅ 米白背景 */
}

#app {
  position: relative;
  background-color: transparent;
  /* ✅ 不蓋掉背景圖片 */
}

nav {
  position: sticky;
  /* 混合 relative + fixed 行為 */
  top: 0;
  /* 距離視窗頂端 0px 時開始黏住 */
  z-index: 1000;
  /* 確保它在其他內容之上 */
}
</style>
