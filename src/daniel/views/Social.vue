<template>
    <div class="social-layout">
        <div class="social-container">
            <h1>Social</h1>

            <!-- 新增貼文按鈕 -->
            <button @click="isModalOpen = true">新增貼文</button>
            <PostList ref="postListRef" />

            <!-- 統一的 Modal -->
            <PostFormModal :visible="isModalOpen" :post="currentPost" @close="isModalOpen = false"
                @saved="handleSaved" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'

import PostList from '@/daniel/components/post/PostList.vue'
import PostFormModal from '@/daniel/components/post/PostFormModal.vue'

const isModalOpen = ref(false)
const postListRef = ref(null)
const currentPost = ref(null)

function openNew() {
    currentPost.value = null
    isModalOpen.value = true
}
function openEdit(post) {
    currentPost.value = post
    isModalOpen.value = true
}

function handleSaved(post) {
    isModalOpen.value = false
    // 如果是新增，讓列表加一筆；如果是編輯，更新列表內該筆
    postListRef.value.reloadPosts()
}
</script>

<style scoped>
social-layout {
    .layout {
        display: grid;
        grid-template-columns: 1fr min(80ch, 100%) 1fr;
    }

    .main {
        grid-column: 2;
        /* 內容都放第二欄 */
    }
}

.social-container {
    max-width: 500px;
    /* 或 90ch，視內容量調整 */
    margin: 0 auto;
    /* 左右置中 */
    padding: 1rem;
    /* 內側留白 */
}
</style>