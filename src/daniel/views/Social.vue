<template>

    <GlobalBanner :imgSrc="homeBannerImg">
        <div class="banner-text">
            <h1>討論區</h1>
            <p class="sub-text">長照交流，一起分享與成長</p>
            <!-- <p class="sub-text">提問解惑，經驗共享的溫暖角落</p> -->
        </div>
    </GlobalBanner>

    <div class="social-layout">
        <!-- 左側貼文篩選欄 -->
        <aside class="sidebar sidebar-filter">
            <!-- 類別篩選 -->
            <section class="filter-section">
                <h4 class="filter-title">貼文分類</h4>

                <!-- 載入中顯示骨架，否則真正按鈕 -->
                <div v-if="isCatLoading" class="spinner-wrapper">
                    <div class="spinner"></div>
                </div>

                <div v-else class="categories">
                    <button v-for="cat in categoryStore.categories" :key="cat.id"
                        @click="categoryStore.toggleCategory(cat.id)" :class="{
                            'category-btn': true,
                            active: categoryStore.selectedIds.includes(cat.id),
                        }">
                        {{ cat.name }}
                    </button>
                </div>
            </section>

            <!-- 主題篩選 -->
            <section class=" filter-section">
                <h4 class="filter-title">貼文主題</h4>

                <div v-if="isTopicLoading" class="spinner-wrapper">
                    <div class="spinner"></div>
                </div>
                <div v-else class="topics">
                    <button v-for="top in topicStore.topics" :key="top.id" @click="topicStore.toggleTopic(top.id)"
                        :class="['category-btn', { active: topicStore.selectedIds.includes(top.id) }]">
                        {{ top.name }}
                    </button>
                </div>
            </section>
        </aside>

        <!-- 主要貼文區塊 -->
        <main>
            <PostMain />
        </main>

        <aside class="sidebar sidebar-info">
            <section class="widget popular-posts">
                <h4 class="widget-title">本週熱門</h4>

                <!-- 載入中顯示骨架項目 -->
                <div v-if="isHotLoading" class="spinner-wrapper">
                    <div class="spinner"></div>
                </div>

                <ul v-else class="widget-list">
                    <li v-for="post in hotPosts" :key="post.postId">
                        <a :href="`/posts/${post.postId}`">{{ post.title }}</a>
                    </li>
                </ul>
            </section>

            <section class="widget recent-posts">
                <h4 class="widget-title">最新貼文</h4>

                <div v-if="isNewLoading" class="spinner-wrapper">
                    <div class="spinner"></div>
                </div>

                <ul v-else class="widget-list">
                    <li v-for="post in recentPosts" :key="post.postId">
                        <a :href="`/posts/${post.postId}`">{{ post.title }}</a>
                    </li>
                </ul>
            </section>
        </aside>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/daniel/stores/categories.js'
import { useTopicStore } from '@/daniel/stores/topics.js'

import myAxios from '@/plugins/axios.js'
import PostMain from '@/daniel/components/post/PostMain.vue'
import GlobalBanner from '@/components/GlobalBanner.vue'
import homeBannerImg from '@/assets/images/GlobalBanner/old-senior-asian-friends-retired-people-hapiness-positive-laugh-smile-conversation.webp'

const categoryStore = useCategoryStore()
const topicStore = useTopicStore()

const hotPosts = ref([])
const recentPosts = ref([])

const isCatLoading = ref(true)
const isTopicLoading = ref(true)
const isHotLoading = ref(true)
const isNewLoading = ref(true)

onMounted(() => {
    // 分類
    categoryStore.loadCategories()
        .finally(() => { isCatLoading.value = false })

    // 主題
    topicStore.loadTopics()
        .finally(() => { isTopicLoading.value = false })

    // 熱門：按 views 排序、最多拿 5 筆
    myAxios.post('/api/posts/search', {
        sort: 'views',
        dir: 'desc',
        rows: 5
    })
        .then(res => hotPosts.value = res.data)
        .finally(() => { isHotLoading.value = false })

    // 最新：按 createdAt 排序、最多拿 5 筆
    myAxios.post('/api/posts/search', {
        sort: 'createdAt',
        dir: 'desc',
        rows: 5
    })
        .then(res => recentPosts.value = res.data)
        .finally(() => { isNewLoading.value = false })
})
</script>

<style scoped>
.banner-text {
    font-weight: 800;
    color: #2D3748;
    text-shadow: 3px 3px 6px rgba(255, 255, 255, 0.8);
    /* 更明顯的光暈效果 */
    letter-spacing: 1px;
    /* 增加字間距 */
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    text-align: center;
}

.sub-text {
    font-size: 1.5rem;
    /* 縮小副標題 */
    font-weight: 600;
    color: #2D3748;
    margin-top: 10px;
}

.social-layout {
    display: grid;
    grid-template-columns: 1fr minmax(300px, 2fr) 1fr;
    gap: var(--space-md);
    position: relative;
    padding: var(--space-md);
    background-color: var(--color-bg-page);
}

main {
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

/* 共用側欄樣式 */
.sidebar {
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    margin: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    background: var(--color-bg-surface);
    box-shadow: var(--shadow-md);
    color: var(--color-text-tertiary);

    position: sticky;
    top: 100px;
    align-self: start;
    max-height: 85vh;
    overflow-y: auto;
}

/* 針對 WebKit 瀏覽器的捲軸樣式 */
.sidebar::-webkit-scrollbar {
    width: 8px;
    /* 設定捲軸寬度 */
}

.sidebar::-webkit-scrollbar-track {
    background: transparent;
    /* 設定捲軸軌道背景透明 */
}

.sidebar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    /* 設定捲軸滑塊初始顏色，較淡 */
    border-radius: 4px;
}

.sidebar:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    /* 滑鼠懸停時滑塊顏色，更明顯 */
}

.widget-title,
.filter-title {
    /* font-weight: var(--font-weight-bold); */
    text-align: center;
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: var(--space-xxs);
    color: var(--color-text-tertiary);

    /* background: linear-gradient(to right, var(--color-primary), var(--color-tertiary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text; */
}

.filter-section,
.widget {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-md);
    padding: var(--space-md);
    box-shadow: var(--shadow-sm);
}

.categories,
.topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-xs);
    margin: 1rem 0;
}

.category-btn {
    padding: var(--space-xxs) var(--space-sm);
    border: 2px solid #CCC;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-medium);
    /* font-size: 16px; */
    font-size: var(--font-size-lg);
    background: var(--color-bg-card);
    color: var(--color-text-muted);
    will-change: transform, box-shadow;
}

.category-btn:hover {
    background: var(--color-btn-primary-bg);
    color: var(--color-btn-primary-text);
    /* transform: translateY(2px); */
    box-shadow: var(--shadow-md);
}

.category-btn.active {
    /* transform: scale(1.05); */
    background: var(--color-btn-primary-bg-hover);
    color: var(--color-btn-primary-text);
}

.category-btn.focus {
    background: var(--color-btn-primary-bg);
    color: var(--color-btn-primary-text);
}

.widget-list {
    list-style-type: none;
    padding: 0;
}

.widget-list li {
    padding: var(--space-xs) 0;
    border-bottom: 1px solid var(--color-border);
}

.widget-list a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: var(--transition-fast);
    display: block;
    padding: var(--space-xxs) var(--space-xs);
    border-radius: var(--radius-sm);
}

.widget-list a:hover {
    color: var(--color-tertiary)
}

/* 超小螢幕：< 480px */
@media (max-width: 480px) {
    .social-layout {
        display: flex;
        flex-direction: column;
        padding: var(--space-sm);
    }

    .sidebar {
        position: static;
        max-height: none;
        margin: 0;
    }

    main,
    .sidebar {
        margin-bottom: var(--space-sm);
    }
}

/* 手機到平板：480px ~ 768px */
@media (min-width: 481px) and (max-width: 768px) {
    .social-layout {
        display: grid;
        grid-template-areas:
            "banner"
            "main"
            "sidebar-filter"
            "sidebar-info";
        grid-template-columns: 1fr;
    }

    /* 如果想把 banner 單獨區塊，也可加上 .banner-area */
}

/* 現有的 md ~ lg 保留 */
@media (max-width: var(--breakpoint-md)) {
    .social-layout {
        grid-template-columns: 1fr;
        grid-template-areas:
            "main"
            "sidebar-filter"
            "sidebar-info";
        gap: var(--space-sm);
        padding: var(--space-sm);
    }

    .sidebar,
    main {
        margin: var(--space-sm);
    }
}

/* 平板大小的調整 */
@media (min-width: calc(var(--breakpoint-md) + 1px)) and (max-width: var(--breakpoint-lg)) {
    .social-layout {
        grid-template-columns: 1fr 2fr;
        grid-template-areas:
            "sidebar-filter main"
            "sidebar-info main";
    }
}

/* 超大螢幕：> 1200px */
@media (min-width: 1201px) {
    .social-layout {
        grid-template-columns: 1fr 2fr 1fr;
        gap: calc(var(--space-md) * 1.5);
        padding: calc(var(--space-md) * 1.5);
    }

    .sidebar {
        top: 120px;
        max-height: 80vh;
    }
}

/* 包在中央，extra padding 看整體排版 */
.spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-md);
}

/* 最經典的 CSS 轉圈圈 */
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
