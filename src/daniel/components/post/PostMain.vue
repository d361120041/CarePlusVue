<template>
    <div class="social-container">
        <!-- 新增貼文卡片 -->
        <article class="post-item new-post-card" @click="() => postStore.openModal(null)">
            <img class="user-avatar" :src="imageUrl" alt="User Avatar" />
            <input type="text" class="new-post-input" placeholder="What's on your mind?" readonly />
        </article>

        <!-- 貼文列表 -->
        <PostList :filterCategoryIds="categoryStore.selectedIds" @refresh="reloadPosts" />

        <!-- 新增與編輯 Modal -->
        <PostFormModal :visible="postStore.isModalOpen" :post="postStore.currentPost" @close="postStore.closeModal"
            @saved="reloadPosts" />

        <!-- 貼文詳情 Modal -->
        <PostDetailModal v-if="postStore.detailPost" :visible="postStore.isDetailModalOpen" :post="postStore.detailPost"
            @close="postStore.closeDetailModal" @refresh="reloadPosts" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories.js'
import { useAuthStore } from '@/stores/auth'

import PostList from '@/daniel/components/post/PostList.vue'
import PostFormModal from '@/daniel/components/post/PostFormModal.vue'
import PostDetailModal from '@/daniel/components/post/PostDetailModal.vue'

// 直接在元件內使用 Pinia store（或你也可以把它們當 props 傳進來）
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

// 使用者大頭貼
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

// 重新載入貼文的函式
async function reloadPosts() {
    await postStore.loadPosts({
        postCategoryIds: categoryStore.selectedIds,
    })
}

watch(
    () => categoryStore.selectedIds.slice(),
    () => {
        reloadPosts()
    },
    { deep: true }
)

// 初始載入分類與貼文
onMounted(async () => {
    await categoryStore.loadCategories()
    await reloadPosts()
})
</script>

<style scoped>
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