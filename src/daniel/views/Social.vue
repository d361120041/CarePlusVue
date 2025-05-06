<template>
    <div class="social-layout">
        <!-- 左側貼文篩選欄 -->
        <aside class="filter-sidebar">
            <h3 class="sidebar-title">Categories</h3>
            <div class="categories">
                <button v-for="cat in categoryStore.categories" :key="cat.id"
                    @click="categoryStore.toggleCategory(cat.id)"
                    :class="{ 'category-btn': true, active: categoryStore.selectedIds.includes(cat.id) }">
                    {{ cat.name }}
                </button>
            </div>
        </aside>

        <!-- 中間貼文區域 -->
        <div class="social-container">
            <!-- 新增貼文卡片 -->
            <article class="post-item new-post-card">
                <img class="user-avatar" :src="currentUser.avatarUrl" alt="User Avatar" />
                <input type="text" class="new-post-input" placeholder="What's on your mind?" readonly
                    @click="postStore.openModal(null)" />
            </article>

            <!-- 貼文列表 -->
            <PostList 
                :filterCategoryIds="categoryStore.selectedIds" 
                @delete-post="loadPostsAgain"
                @refresh="loadPostsAgain" />

            <!-- 新增與編輯 Modal -->
            <PostFormModal 
                :visible="postStore.isModalOpen" :post="postStore.currentPost" @close="postStore.closeModal"
                @saved="loadPostsAgain" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories.js'

import PostList from '@/daniel/components/post/PostList.vue'
import PostFormModal from '@/daniel/components/post/PostFormModal.vue'

const postStore = usePostStore()
const categoryStore = useCategoryStore()
const currentUser = ref({
    avatarUrl: '/circle-user-solid.svg',
});

async function loadPostsAgain() {
    await postStore.loadPosts({ 
        postCategoryIds: categoryStore.selectedIds 
    })
}

onMounted(async () => {
    await categoryStore.loadCategories()
    await loadPostsAgain()
})
</script>

<style scoped>
.social-layout {
    display: grid;
    grid-template-columns: 200px min(80ch, 100%) 1fr;
    gap: 1rem;
}

.filter-sidebar {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: bold;
}

.categories {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.category-btn {
    padding: 0.5rem 1rem;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    background: #f0f0f0;
    transition: all 0.2s;
    font-weight: 500;
}

.category-btn:hover {
    background: #e0e0e0;
}

.category-btn.active {
    background: #007bff;
    color: #fff;
    border-color: #0056b3;
    transform: scale(1.05);
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
