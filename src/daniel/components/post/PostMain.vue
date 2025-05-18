<template>
    <div class="social-container">
        <!-- 新增貼文卡片 -->
        <article class="new-post-card">
            <UserAvatar :imageUrl="imageUrl" style="margin-right: 0.5rem;" />
            <div class="new-post-input" @click="() => postStore.openModal(null)">{{ authStore.user.userName }}，在想些什麼？
            </div>
        </article>

        <!-- 貼文列表 -->
        <!-- 第一次載入時顯示骨架 -->
        <div v-if="postStore.isLoading && postStore.posts.length === 0">
            <SkeletonPostCard v-for="n in postStore.pageSize" :key="`skeleton-${n}`" />
        </div>
        <!-- 有貼文或後續載入就顯示真實列表 -->
        <div v-else>
            <PostList :filterCategoryIds="categoryStore.selectedIds" :filter-topic-ids="topicStore.selectedIds"
                :filterUserId="onlyMine ? authStore.user.userId : null" @refresh="reloadPosts" />
        </div>

        <!-- 無限捲動偵測器 -->
        <div ref="sentinel" class="sentinel"></div>

        <!-- 載入中 Spinner -->
        <div v-if="postStore.isLoading" class="loading" :class="{ active: postStore.isLoading }">載入中…</div>

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
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories.js'
import { useTopicStore } from '@/daniel/stores/topics.js'
import { useAuthStore } from '@/stores/auth'

import PostList from '@/daniel/components/post/PostList.vue'
import PostFormModal from '@/daniel/components/post/PostFormModal.vue'
import PostDetailModal from '@/daniel/components/post/PostDetailModal.vue'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'
import SkeletonPostCard from '@/daniel/components/post/SkeletonPostCard.vue'

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
const isLoadingVisible = ref(false) // 控制載入中提示的顯示
let loadingTimeout = null // 用於清除 timeout

// 使用者大頭貼
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

// 重新載入貼文的函式
async function reloadPosts() {

    if (postStore.isLoading) {
        isLoadingVisible.value = true;
    } else {
        // 避免在非載入狀態時顯示
        isLoadingVisible.value = false;
    }

    await postStore.loadPosts({
        postCategoryIds: categoryStore.selectedIds,
        postTopicIds: topicStore.selectedIds,
        userId: props.onlyMine ? authStore.user.userId : null
    }, {
        page: 1,
        append: false
    }).finally(() => {
        isLoadingVisible.value = false;
        clearTimeout(loadingTimeout); // 清除任何未執行的 timeout
    });
}

function setupObserver() {
    observer = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting && postStore.hasMore) {
            await postStore.loadPosts({
                postCategoryIds: categoryStore.selectedIds,
                postTopicIds: topicStore.selectedIds,
                userId: props.onlyMine ? authStore.user.userId : null
            }, { page: postStore.currentPage + 1, append: true }).finally(() => {
                isLoadingVisible.value = false;
            });
        }
    }, {
        root: null,
        rootMargin: '600px',
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

watch(
    () => postStore.isLoading,
    (newValue) => {
        clearTimeout(loadingTimeout); // 清除之前的 timeout
        if (newValue) {
            // 延遲一段時間後顯示載入中提示
            setTimeout(() => {
                isLoadingVisible.value = true
            }, 200) // 例如延遲 200 毫秒
        } else {
            isLoadingVisible.value = false
        }
    }
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
    clearTimeout(loadingTimeout); // 清除 timeout
})

</script>

<style scoped>
.social-container {
    grid-column: 2;
    margin: 0 auto;
    padding: 1rem;
}

.new-post-card {
    /* min-width: 600px; */
    width: 700px;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1rem;
    margin: 0 auto 1.5rem;
    transition: background 0.2s;
}

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
}

/* 載入中 / 沒有更多貼文 */
.loading {
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
    color: #666;
    opacity: 0;
    /* 初始時設定為完全透明 */
    transition: opacity 0.3s ease-in-out;
    /* 添加一個 0.3 秒的淡入淡出效果 */
}

/* 當 postStore.isLoading 為 true 時，添加一個 active 類名來改變 opacity */
.loading.active {
    opacity: 1;
    /* 載入時設定為完全不透明 */
}

.no-more {
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
    color: #999;
}
</style>