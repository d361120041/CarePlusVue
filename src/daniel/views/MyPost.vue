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
            <h3 class="mypost-header">我的貼文
                <!-- 篩選按鈕 -->
                <button @click="filterModalVisible = true" class="filter-icon-btn" aria-label="開啟篩選">
                    <img :src="filterImg" alt="篩選圖示" />
                </button>
            </h3>

            <PostMain :only-mine="true" />

            <!-- 抽出的 FilterModal -->
            <FilterModal :visible="filterModalVisible" :initial="initialFilter" :categories="categoryStore.categories"
                :topics="topicStore.topics" @apply="onFilterApply" @clear="onFilterClear"
                @close="filterModalVisible = false" />
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories'
import { useTopicStore } from '@/daniel/stores/topics'
// import { useTagStore } from '@/daniel/stores/tags'
import { useAuthStore } from '@/stores/auth';

import PostMain from '@/daniel/components/post/PostMain.vue'
import FilterModal from '@/daniel/components/modal/FilterModal.vue'
import filterImg from '@/assets/daniel/sliders-solid.svg'

const postStore = usePostStore()
const categoryStore = useCategoryStore()
const topicStore = useTopicStore()
// const tagStore = useTagStore()
const authStore = useAuthStore()

// 使用者大頭貼
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

// 控制 Modal
const filterModalVisible = ref(false)

// 我們的「原始」filter state
const initialFilter = reactive({
    titleKeyword: null,
    contentKeyword: null,
    startYear: null,
    startMonth: null,
    endYear: null,
    endMonth: null,
    postCategoryIds: [],
    postTopicIds: [],
    sort: 'createdAt',
    dir: 'asc'
})

// 當 Modal 按「套用」回來
async function onFilterApply(payload) {
    // payload={ titleKeyword, contentKeyword, startTime, endTime, postCategoryIds, postTopicIds, sort, dir }
    await postStore.loadPosts({
        ...payload,
        userId: authStore.user.userId
    })
}

// 當 Modal 按「清除」時
async function onFilterClear() {
    Object.assign(initialFilter, {
        titleKeyword: null,
        contentKeyword: null,
        startYear: null,
        startMonth: null,
        endYear: null,
        endMonth: null,
        postCategoryIds: [],
        postTopicIds: [],
        sort: 'createdAt',
        dir: 'asc'
    })
    // 重載「只看自己」所有貼文
    await postStore.loadPosts({ userId: authStore.user.userId })
}

// 初始抓分類＋載貼文
onMounted(async () => {
    await categoryStore.loadCategories()
    await topicStore.loadTopics()
    await onFilterClear()
})
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
    margin-left: 50px;
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
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
}

.filter-icon-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;

    /* 一定要撐開 */
    display: inline-flex;
    /* 或 inline-block */
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    /* 固定按鈕寬度 */
    height: 1.5rem;
    /* 固定按鈕高度 */
}

/* 確保 img 撐滿按鈕 */
.filter-icon-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* 初始先轉灰階，讓它呈現單色 */
    filter: grayscale(100%) brightness(60%);
    transition: filter var(--transition-medium);
}

.filter-icon-btn:hover img {
    filter:
        grayscale(0%) invert(61%) sepia(25%) saturate(495%) hue-rotate(140deg) brightness(95%) contrast(90%);
}
</style>