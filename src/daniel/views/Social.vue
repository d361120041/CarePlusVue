<template>
    <div class="social-layout">
        <div class="social-container">

            <!-- 新增貼文卡片 -->
            <article class="post-item new-post-card" @click="openNew">
                <img class="user-avatar" :src="currentUser.avatarUrl" alt="User Avatar" />
                <!-- <img class="user-avatar" :src="post.user.profilePicture" alt="User Avatar" /> -->
                <input type="text" class="new-post-input" placeholder="What's on your mind?" readonly
                    @click="openNew" />
            </article>

            <!-- 貼文列表 -->
            <PostList ref="postListRef" />

            <!-- 新增與編輯 Modal -->
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

const currentUser = ref({
    // avatarUrl: '/circle-user-regular.svg'
    avatarUrl: '/circle-user-solid.svg'
    // avatarUrl: '/user-regular.svg'
    // avatarUrl: '/user-solid.svg'
})
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
.social-layout {
    display: grid;
    grid-template-columns: 1fr min(80ch, 100%) 1fr;
}

.social-container {
    grid-column: 2;
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
}

/* 新增貼文卡片樣式 */
.new-post-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
    transition: background 0.2s;
}

.new-post-card:hover {
    background: #f9f9f9;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1rem;
}

.new-post-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    background: transparent;
    cursor: pointer;
}

.new-post-input::placeholder {
    color: #999;
}
</style>