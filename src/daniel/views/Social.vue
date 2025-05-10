<template>

    <GlobalBanner :imgSrc="homeBannerImg">
        <h1>討論區</h1>
    </GlobalBanner>

    <div class="social-layout">
        <!-- 左側貼文篩選欄 -->
        <aside class="filter-sidebar">
            <h3 class="sidebar-title">你想找什麼？</h3>
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
        <PostMain />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCategoryStore } from '@/daniel/stores/categories.js'
import { useTopicStore } from '@/daniel/stores/topics.js'
import PostMain from '@/daniel/components/post/PostMain.vue'
import GlobalBanner from '@/components/GlobalBanner.vue'
import homeBannerImg from '@/assets/images/GlobalBanner/people-holding-rubber-heart.jpg'

const categoryStore = useCategoryStore()
const topicStore = useTopicStore()

onMounted(() => {
    categoryStore.loadCategories()
    topicStore.loadTopics()
})
</script>

<style scoped>
.social-layout {
    display: grid;
    grid-template-columns: 1fr min(80ch, 100%) 1fr;
    gap: 1rem;
}

.filter-sidebar {
    background: #fff;
    padding: 1rem;
    margin: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    justify-self: center;
    font-size: 0.9rem;
    max-width: 20vw;
}

.sidebar-title {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
}

.filter-section {
    margin-bottom: 1rem;
}

.filter-section h4 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
}

.categories, 
.topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.category-btn {
    padding: 0.2rem 0.5rem;
    margin: 0.2rem;
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
</style>
