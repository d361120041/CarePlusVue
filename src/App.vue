<template>
  <!-- 導覽列 開始-->
  <nav v-if="!isAdminRoute">
    <Navigationbar />
  </nav>
  <!-- 導覽列 結束 -->

  <!-- 主內容 開始-->
  <main>
    <RouterView />
  </main>
  <!-- 主內容 結束-->

  <!-- 頁尾 開始-->
  <footer v-if="!isAdminRoute" class="footer">
    <Footer />
  </footer>
  <!-- 頁尾 結束-->

  <BackToTop />

</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";

import Navigationbar from "@/views/Navigationbar.vue";
import Footer from "@/views/Footer.vue";
import BackToTop from "@/components/BackToTop.vue";

const route = useRoute();
// ✅ 檢查是否為 admin 開頭的頁面
const isAdminRoute = computed(() => route.path.startsWith("/admin"));
</script>

<style scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>
