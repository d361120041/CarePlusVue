<template>
  <nav class="flex flex-col space-y-4">
    <router-link
      to="/user-center/profile"
      class="hover:underline text-blue-700"
    >
      編輯使用者資料
    </router-link>
    <router-link
      to="/user-center/patients"
      class="hover:underline text-blue-700"
    >
      管理患者
    </router-link>
    <router-link
      to="/user-center/favorites"
      class="hover:underline text-blue-700"
    >
      收藏庫
    </router-link>
    <router-link
      to="/user-center/support"
      class="hover:underline text-blue-700"
    >
      客服訊息
    </router-link>
  </nav>
</template>
