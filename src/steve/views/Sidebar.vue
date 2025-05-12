<template>
  <nav class="flex flex-col space-y-4">
    <router-link
      to="/user-center/profile"
      class="sidebar-button"
      active-class="active"
    >
      個人資料
    </router-link>
    <router-link
      to="/user-center/patients"
      class="sidebar-button"
      active-class="active"
    >
      管理患者
    </router-link>
    <router-link
      to="/user-center/favorites"
      class="sidebar-button"
      active-class="active"
    >
      收藏庫
    </router-link>
    <router-link
      to="/user-center/support"
      class="sidebar-button"
      active-class="active"
    >
      聯絡客服
    </router-link>
    <router-link
      to="/user-center/myPost"
      class="sidebar-button"
      active-class="active"
    >
      我的貼文
    </router-link>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
nav {
  padding-top: 2rem;
}

.sidebar-button {
  color: #ffffff;
  text-decoration: none;
  margin-bottom: 6px;
  /* 增加每個按鈕的分隔感 */
  width: 100%;
  display: block;
  text-align: center;
  padding: 0.75rem;
  border-radius: 12px;
  background-color: #80ccc3;
  transition: box-shadow 0.3s, background-color 0.3s;
  font-weight: 500;
  border: 1px solid #4db6ac;
}

.sidebar-button:hover {
  box-shadow: 0 0 8px #66cfc4;
  /* 藍色光暈 */
  background-color: #3ca094;
}

.active {
  background-color: #3ca094;
  font-weight: 600;
  border: 1px solid #66cfc4;
}
</style>
