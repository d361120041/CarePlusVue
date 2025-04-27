<template>
    <h1>Social</h1>
    <!-- 新增貼文按鈕 -->
    <button @click="isModalOpen = true">新增貼文</button>
    <PostList ref="postListRef" />

    <!-- 統一的 Modal -->
    <PostFormModal :visible="isModalOpen" :post="currentPost" @close="isModalOpen = false" @saved="handleSaved" />
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'

import PostList from '@/daniel/components/PostList.vue'
import PostFormModal from '@/daniel/components/PostFormModal.vue'

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

<style scoped></style>