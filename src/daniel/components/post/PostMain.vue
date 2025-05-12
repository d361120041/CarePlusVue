<template>
    <div class="social-container">
        <!-- 新增貼文卡片 -->
        <article class="new-post-card">
            <UserAvatar :imageUrl="imageUrl" />
            <div class="new-post-input" @click="() => postStore.openModal(null)">{{ authStore.user.userName }}，在想些什麼？
            </div>
        </article>

        <!-- 貼文列表 -->
        <PostList :filterCategoryIds="categoryStore.selectedIds" :filter-topic-ids="topicStore.selectedIds"
            :filterUserId="onlyMine ? authStore.user.userId : null" @refresh="reloadPosts" />

        <!-- 無限捲動偵測器 -->
        <div ref="sentinel" class="sentinel"></div>

        <!-- 載入中 Spinner -->
        <div v-if="postStore.isLoading" class="loading">載入中…</div>

        <!-- 沒有更多貼文 提示 -->
        <div v-if="!postStore.hasMore && !postStore.isLoading" class="no-more">
            沒有貼文囉！
        </div>

        <!-- 新增與編輯 Modal -->
        <PostFormModal :visible="postStore.isModalOpen" :post="postStore.currentPost" @close="postStore.closeModal"
            @saved="reloadPosts" />

        <!-- 貼文詳情 Modal -->
        <PostDetailModal v-if="postStore.detailPost" :visible="postStore.isDetailModalOpen" :post="postStore.detailPost"
            @close="postStore.closeDetailModal" @refresh="reloadPosts" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories.js'
import { useTopicStore } from '@/daniel/stores/topics.js'
import { useAuthStore } from '@/stores/auth'

import PostList from '@/daniel/components/post/PostList.vue'
import PostFormModal from '@/daniel/components/post/PostFormModal.vue'
import PostDetailModal from '@/daniel/components/post/PostDetailModal.vue'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({
    onlyMine: {
        type: Boolean,
        default: false
    }
})

// 直接在元件內使用 Pinia store（或你也可以把它們當 props 傳進來）
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const topicStore = useTopicStore()
const authStore = useAuthStore()
const sentinel = ref(null)
let observer = null

// 使用者大頭貼
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

// 重新載入貼文的函式
async function reloadPosts() {
    await postStore.loadPosts({
        postCategoryIds: categoryStore.selectedIds,
        postTopicIds: topicStore.selectedIds,
        userId: props.onlyMine ? authStore.user.userId : null
    }, {
        page: 1,
        append: false
    })
}

function setupObserver() {
    observer = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting && postStore.hasMore) {
            await postStore.loadPosts({
                postCategoryIds: categoryStore.selectedIds,
                postTopicIds: topicStore.selectedIds,
                userId: props.onlyMine ? authStore.user.userId : null
            }, { page: postStore.currentPage + 1, append: true })
        }
    }, {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
    })
    observer.observe(sentinel.value)
}

watch(
    () => categoryStore.selectedIds.slice(),
    () => {
        reloadPosts()
    },
    { deep: true }
)

watch(
    () => topicStore.selectedIds.slice(),
    () => {
        reloadPosts()
    }, { deep: true }
)

// 當篩選條件改變，重置捲動載入
watch(
    [() => categoryStore.selectedIds.slice(), () => topicStore.selectedIds.slice()],
    async () => {
        observer.disconnect()
        await reloadPosts()
        setupObserver()
    },
    { deep: true }
)

// 初始載入分類與貼文
onMounted(async () => {
    await categoryStore.loadCategories()
    await topicStore.loadTopics()
    await reloadPosts()
    setupObserver()
})

onBeforeUnmount(() => {
    observer?.disconnect()
})

</script>

<style scoped>
.social-container {
    grid-column: 2;
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
}

.new-post-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
    transition: background 0.2s;
}

/* .new-post-card:hover {
    background: #f9f9f9;
} */

.new-post-input {
    flex: 1;
    color: #999;
    font-size: 1rem;
    background: #f5f5f5;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    transition: background 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.new-post-input:hover {
    background: #eaeaea;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.sentinel {
    height: 1px;
    /* 你可以用背景色暫時 debug： background: red; */
    /* background: red; */
}

/* 載入中 / 沒有更多貼文 */
.loading,
.no-more {
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
    color: #666;
}

.no-more {
    color: #999;
}
</style>