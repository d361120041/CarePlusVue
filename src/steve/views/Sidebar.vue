<template>
  <nav class="flex flex-col space-y-4">
    <router-link
      to="/user-center/profile"
      class="sidebar-button"
      active-class="active"
    >
      個人資料 👤
    </router-link>
    <router-link
      to="/user-center/patients"
      class="sidebar-button"
      active-class="active"
    >
      管理家屬 👨‍👨‍👦‍👦
    </router-link>
    <router-link
      to="/user-center/favorites"
      class="sidebar-button"
      active-class="active"
    >
      收藏庫 💼
    </router-link>

    <router-link
      to="/user-center/myPost"
      class="sidebar-button"
      active-class="active"
    >
      我的貼文 💭
    </router-link>
    <router-link
      to="/user-center/orders"
      class="sidebar-button"
      active-class="active"
    >
      我的預約 📅
    </router-link>

    <router-link
      to="/user-center/courses"
      class="sidebar-button"
      active-class="active"
    >
      我的課程 📚
    </router-link>

    <router-link
      to="/user-center/support"
      class="sidebar-button"
      active-class="active"
    >
      聯絡客服 ☎️
    </router-link>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
nav {
  padding-top: 2rem;
  width: 350px;
}

.sidebar-button {
  display: block;
  margin-bottom: 12px;
  padding: 8px 12px;
  color: black;
  background-color: transparent;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

/* hover 時底色浮出，使用原本 hover 色 */
.sidebar-button:hover {
  background-color: #ffa76b;
}

/* 當前頁面選中效果，使用原本 active 色 */
.active {
  background-color: #ff8c42;
  font-weight: 600;
}
</style>
