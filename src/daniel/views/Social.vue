<template>

    <GlobalBanner :imgSrc="homeBannerImg">
        <h1>討論區</h1>
    </GlobalBanner>

    <div class="social-layout">
        <!-- 左側貼文篩選欄 -->
        <aside class="sidebar sidebar-filter">
            <!-- 類別篩選 -->
            <section class="filter-section">
                <h4 class="filter-title">貼文分類</h4>
                <div class="categories">
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
                <div class="topics">
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
                <ul class="widget-list">
                    <li v-for="post in hotPosts" :key="post.postId">
                        <a :href="`/posts/${post.postId}`">{{ post.title }}</a>
                    </li>
                </ul>
            </section>
            <section class="widget recent-posts">
                <h4 class="widget-title">最新貼文</h4>
                <ul class="widget-list">
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
import homeBannerImg from '@/assets/images/GlobalBanner/old-senior-asian-friends-retired-people-hapiness-positive-laugh-smile-conversation-together-living-room-nursing-home-seniors-participating-group-activities-adult-daycare-center.webp'

const categoryStore = useCategoryStore()
const topicStore = useTopicStore()

const hotPosts = ref([])
const recentPosts = ref([])

onMounted(async () => {
    categoryStore.loadCategories()
    topicStore.loadTopics()

    // 熱門：按 views 排序、最多拿 5 筆
    const hotRes = await myAxios.post('/api/posts/search', {
        sort: 'views',
        dir: 'desc',
        rows: 5
    })
    hotPosts.value = hotRes.data

    // 最新：按 createdAt 排序、最多拿 5 筆
    const newRes = await myAxios.post('/api/posts/search', {
        sort: 'createdAt',
        dir: 'desc',
        rows: 5
    })
    recentPosts.value = newRes.data
})
</script>

<style scoped>
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
    gap: var(--space-md);
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
    top: 75px;
    align-self: start;
    max-height: 85vh;
    overflow-y: auto;
}

/* 針對 WebKit 瀏覽器的捲軸樣式 */
.sidebar::-webkit-scrollbar {
    width: 8px; /* 設定捲軸寬度 */
}

.sidebar::-webkit-scrollbar-track {
    background: transparent; /* 設定捲軸軌道背景透明 */
}

.sidebar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1); /* 設定捲軸滑塊初始顏色，較淡 */
    border-radius: 4px;
}

.sidebar:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 滑鼠懸停時滑塊顏色，更明顯 */
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
    font-size: var(--font-size-sm);
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
</style>
