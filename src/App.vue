<template>
  <!-- 頁首 開始 -->
  <!-- <header v-if="!isAdminRoute">
    <h1>頁首</h1>
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
  <footer v-if="!isAdminRoute">
    <h1>頁尾</h1>
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
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #fff8f0; /* ✅ 米白背景 */
}

#app {
  position: relative;
  background-color: transparent; /* ✅ 不蓋掉背景圖片 */
}
</style>
