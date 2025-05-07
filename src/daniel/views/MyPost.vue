<template>
    <div class="mypost-container">

        <!-- 左欄：使用者資訊 -->
        <aside class="user-info">
            <img :src="imageUrl || '/default-avatar.png'" alt="頭貼" class="user-avatar" />
            <h2 class="user-name">
                {{ authStore.user.userName }}
            </h2>
            <p class="user-bio">{{ authStore.user.bio }}</p>
            <p class="user-intro">{{ authStore.user.intro }}</p>
        </aside>

        <!-- 右欄：我的貼文列表 -->
        <main class="mypost-main">
            <h3 class="mypost-header">我的貼文</h3>
            <PostMain :only-mine="true"/>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';

import PostMain from '@/daniel/components/post/PostMain.vue'

const authStore = useAuthStore()

// 使用者大頭貼
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`
</script>

<style scoped>
.mypost-container {
    display: flex;
    gap: 3rem;
    /* 欄間距 */
    padding: 1rem;
}

/* 左欄固定寬度或比例 */
.user-info {
    flex: 0 0 35%;
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    /* 直向堆疊 */
    align-items: center;
    /* 置中 */
}

/* 大頭貼從上到下第一個 */
.user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
}

/* bio 與 intro */
.user-bio,
.user-intro {
    width: 100%;
    text-align: center;
    margin-bottom: 0.75rem;
    color: #555;
    line-height: 1.4;
}

/* 右欄用剩下的空間 */
.mypost-main {
    flex: 1 1 65%;
}

.mypost-header {
    grid-column: 2;
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
}
</style>