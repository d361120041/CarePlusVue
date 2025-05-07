<template>
    <div class="mypost-container">

        <!-- 左欄：使用者資訊 -->
        <aside class="user-info">
            <img :src="authStore.user.profilePicture || '/default-avatar.png'" alt="頭貼" class="user-avatar" />
            <h2 class="user-name">
                {{ authStore.user.userName }}
            </h2>
            <p class="user-bio">{{ authStore.user.bio }}</p>
            <p class="user-intro">{{ authStore.user.intro }}</p>
        </aside>

        <!-- 右欄：我的貼文列表 -->
        <main class="mypost-main">
            <h3 class="mypost-header">我的貼文</h3>
                <PostMain />
        </main>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

import PostMain from '@/daniel/components/post/PostMain.vue'
</script>

<style scoped>
.mypost-main {

}
</style>