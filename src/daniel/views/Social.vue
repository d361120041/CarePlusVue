<template>

    <GlobalBanner :imgSrc="homeBannerImg">
        <h1>討論區</h1>
    </GlobalBanner>

    <div class="social-layout">
        <!-- 左側貼文篩選欄 -->
        <aside class="sidebar sidebar-filter">
            <!-- 類別篩選 -->
            <section class="filter-section">
                <h4>貼文分類</h4>
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
                <h4>貼文主題</h4>
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
import homeBannerImg from '@/assets/images/GlobalBanner/old-senior-asian-friends-retired-people-hapiness-positive-laugh-smile-conversation-together-living-room-nursing-home-seniors-participating-group-activities-adult-daycare-center.jpg'

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
    gap: 1rem;
    position: relative;
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    background: linear-gradient(135deg,
            rgba(77, 182, 172, 0.15) 0%,
            rgba(255, 255, 255, 0.8) 100%); */
}

main {
    border-radius: 8px;
    /* padding: 1rem; */
    margin: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    background: linear-gradient(135deg,
            rgba(77, 182, 172, 0.15) 0%,
            rgba(255, 255, 255, 0.8) 100%); */
    /* color: #333333; */
}

/* 共用側欄樣式 */
.sidebar {
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: linear-gradient(135deg,
            rgba(77, 182, 172, 0.05) 0%,
            rgba(255, 255, 255, 0.9) 100%);
    box-shadow:
        0 4px 6px rgba(0, 0, 0, 0.05),
        0 1px 3px rgba(0, 0, 0, 0.1);
    color: #333333;
}

.widget-title,
.filter-section h4 {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.5rem;
    color: #333333;
    border-bottom: 2px solid #333333;
    padding-bottom: 0.25rem;
}

.filter-section,
.widget {
    background: #FFFFFF;
    border: 1px solid #EEEEEE;
    border-radius: 1.2rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
}

.categories,
.topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.category-btn {
    padding: 0.3rem 0.6rem;
    margin: 0.3rem;
    border: 2px solid #3e9bdc;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    font-size: 1rem;
    background: #fff;
    color: #3e9bdc;
    will-change: transform, box-shadow;
}

.category-btn:hover,
.category-btn.active {
    background: #3e9bdc;
    color: #FFFFFF;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-btn.active {
    background: #3e9bdc;
    color: #fff;
    border-color: #3e9bdc;
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.widget-title {
    background: linear-gradient(to right, #4db6ac, #3e9bdc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 兩個 widget 之間加分隔線 */
.widget-list a {
    color: #333333;
    text-decoration: none;
}

.widget-list a:hover {
    text-decoration: underline;
    color: #333333;
}

.widget+.widget {
    border-top: 1px solid #EEEEEE;
    margin-top: 1rem;
    padding-top: 1rem;
}

/* 響應式佈局調整 */
@media (max-width: 768px) {
    .social-layout {
        grid-template-columns: 1fr;
        grid-template-areas:
            "banner"
            "main"
            "sidebar-filter"
            "sidebar-info";
    }
}
</style>
