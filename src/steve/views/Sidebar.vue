<template>
  <nav class="flex flex-col space-y-4">
    <router-link
      to="/user-center/profile"
      class="px-4 py-2 rounded hover:bg-gray-200"
      active-class="bg-gray-200 font-semibold"
    >
      個人資料
    </router-link>
    <router-link
      to="/user-center/patients"
      class="px-4 py-2 rounded hover:bg-gray-200"
      active-class="bg-gray-200 font-semibold"
    >
      管理患者
    </router-link>
    <router-link
      to="/user-center/favorites"
      class="px-4 py-2 rounded hover:bg-gray-200"
      active-class="bg-gray-200 font-semibold"
    >
      收藏庫
    </router-link>
    <router-link
      to="/user-center/support"
      class="px-4 py-2 rounded hover:bg-gray-200"
      active-class="bg-gray-200 font-semibold"
    >
      客服讯息
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
</style>
